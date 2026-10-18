import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { localStore } from "@/lib/data/store";
import { ConnectionRequest, Goal } from "@/types/database";
import { getTokenCostForHelpType } from "@/lib/tokens/costs";

export const dynamic = "force-dynamic";

const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const createRequestSchema = z.object({
  alum_id: z.string().regex(uuidPattern, "Invalid alumnus identifier"),
  intent_id: z.string().regex(uuidPattern, "Invalid intent identifier"),
  offer_id: z.string().regex(uuidPattern, "Invalid offer identifier").optional().nullable(),
  student_message: z.string().min(15, "Message must be at least 15 characters").max(1000),
  repeat_reason: z.string().max(500).optional().nullable(),
  idempotency_key: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role"); // "student" or "alum"

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      let query = supabase
        .from("connection_requests")
        .select(`
          *,
          student:profiles!connection_requests_student_id_fkey(*),
          alumnus:profiles!connection_requests_alum_id_fkey(*),
          intent:intents(*),
          offer:offers(*)
        `)
        .order("created_at", { ascending: false });

      if (role === "student") {
        query = query.eq("student_id", user.id);
      } else if (role === "alum") {
        query = query.eq("alum_id", user.id);
      } else {
        query = query.or(`student_id.eq.${user.id},alum_id.eq.${user.id}`);
      }

      const { data, error } = await query;
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      return NextResponse.json({ requests: data || [] });
    } catch (err) {
      console.warn("Supabase requests query failed, using local store:", err);
    }
  }

  // Standalone fallback
  const requests = localStore.requests.map((r) => ({
    ...r,
    student: localStore.profiles.find((p) => p.id === r.student_id),
    alumnus: localStore.profiles.find((p) => p.id === r.alum_id),
    intent: localStore.intents.find((i) => i.id === r.intent_id),
    offer: localStore.offers.find((o) => o.id === r.offer_id),
  }));

  return NextResponse.json({ requests, isDemo: true });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = createRequestSchema.parse(body);

    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Call Atomic Database RPC with Row Locks
      const { data: result, error: rpcError } = await supabase.rpc(
        "create_connection_request_atomic",
        {
          p_student_id: user.id,
          p_alum_id: validated.alum_id,
          p_intent_id: validated.intent_id,
          p_offer_id: validated.offer_id || null,
          p_student_message: validated.student_message,
          p_repeat_reason: validated.repeat_reason || null,
          p_idempotency_key: validated.idempotency_key || crypto.randomUUID(),
        }
      );

      if (rpcError) {
        return NextResponse.json({ error: rpcError.message }, { status: 400 });
      }

      return NextResponse.json(result, { status: 201 });
    }

    // Standalone fallback: execute atomic simulation in local store
    const student = localStore.profiles[3];
    const studentToken = localStore.studentTokens[student.id];

    // Determine token cost based on help type
    const targetIntent = localStore.intents.find((i) => i.id === validated.intent_id);
    const targetOffer = validated.offer_id ? localStore.offers.find((o) => o.id === validated.offer_id) : null;
    const helpTypeId = targetOffer?.help_type_id || targetIntent?.help_type_id;
    const helpTypeObj = localStore.helpTypes.find((ht) => ht.id === helpTypeId);
    const tokenCost = getTokenCostForHelpType(helpTypeObj?.slug || helpTypeObj?.name || targetIntent?.title);

    if (!studentToken || studentToken.tokens_remaining < tokenCost) {
      return NextResponse.json(
        {
          error: `Insufficient monthly tokens. This request requires ${tokenCost} token(s), but your balance is ${studentToken?.tokens_remaining ?? 0}.`,
        },
        { status: 400 }
      );
    }

    const alumCapacity = localStore.capacities[validated.alum_id];
    if (alumCapacity && alumCapacity.remaining_capacity <= 0) {
      return NextResponse.json(
        { error: "Alumnus has no remaining monthly review capacity." },
        { status: 400 }
      );
    }

    // Check repeat contact
    const isRepeat = localStore.requests.some(
      (r) => r.student_id === student.id && r.alum_id === validated.alum_id
    );

    if (isRepeat && (!validated.repeat_reason || validated.repeat_reason.trim().length < 5)) {
      return NextResponse.json(
        { error: "Repeat contact requires an explicit justification." },
        { status: 400 }
      );
    }

    // Debit exact token cost based on help category
    studentToken.tokens_spent = Number((studentToken.tokens_spent + tokenCost).toFixed(2));
    studentToken.tokens_remaining = Number(Math.max(0, studentToken.tokens_remaining - tokenCost).toFixed(2));

    // Reserve 1 capacity slot
    if (alumCapacity) {
      alumCapacity.reserved_count += 1;
      alumCapacity.remaining_capacity = Math.max(0, alumCapacity.remaining_capacity - 1);
    }

    const requestId = crypto.randomUUID();
    const goalId = crypto.randomUUID();

    const newRequest: ConnectionRequest = {
      id: requestId,
      student_id: student.id,
      alum_id: validated.alum_id,
      intent_id: validated.intent_id,
      offer_id: validated.offer_id || undefined,
      status: "pending",
      student_message: validated.student_message,
      repeat_contact_in_month: isRepeat,
      repeat_reason: validated.repeat_reason || undefined,
      idempotency_key: validated.idempotency_key || undefined,
      token_cost: tokenCost,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const newGoal: Goal = {
      id: goalId,
      request_id: requestId,
      student_id: student.id,
      alum_id: validated.alum_id,
      title: localStore.intents.find((i) => i.id === validated.intent_id)?.title || "Mentoring Goal",
      description: validated.student_message,
      status: "open",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localStore.requests.unshift(newRequest);
    localStore.goals.unshift(newGoal);

    return NextResponse.json(
      {
        success: true,
        request_id: requestId,
        goal_id: goalId,
        tokens_remaining: studentToken.tokens_remaining,
        is_repeat: isRepeat,
      },
      { status: 201 }
    );
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      const msg = err.issues?.[0]?.message || (err as any).errors?.[0]?.message || "Validation failed";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
