import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { localStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";

const profileUpdateSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters").optional(),
  role: z.enum(["student", "alum"]).optional(),
  bio: z.string().max(1000, "Bio cannot exceed 1000 characters").optional(),
  institution: z.string().min(2, "Institution must be specified").optional(),
  study_year: z.number().int().min(1).max(6).optional().nullable(),
  expected_graduation_year: z.number().int().min(2024).max(2035).optional().nullable(),
  graduation_year: z.number().int().min(1980).max(2026).optional().nullable(),
  job_title: z.string().max(100).optional().nullable(),
  company: z.string().max(100).optional().nullable(),
  industry: z.string().max(100).optional().nullable(),
  avatar_url: z.string().url().optional().nullable().or(z.literal("")),
});

export async function GET() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      let { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile && !error) {
        // Safe auto-provisioning for authenticated OAuth users (maintains 1 profile per auth.users.id)
        const meta = user.user_metadata || {};
        const fallbackRole = meta.role === "alum" ? "alum" : "student";
        const fallbackName =
          meta.full_name || meta.name || (user.email ? user.email.split("@")[0] : "SyncTies Member");
        const fallbackAvatar = meta.avatar_url || meta.picture || null;

        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .upsert(
            {
              id: user.id,
              email: user.email,
              full_name: fallbackName,
              avatar_url: fallbackAvatar,
              role: fallbackRole,
              institution: meta.institution || "University Pilot",
              verification_status: "unverified",
              is_active: true,
              last_active_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          )
          .select()
          .single();

        if (!insertError && newProfile) {
          profile = newProfile;
        }
      }

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ profile, user });
    } catch (err) {
      console.warn("Supabase profile get failed, using fallback:", err);
    }
  }

  // Standalone mode default: return student or alum profile from local store
  const defaultProfile = localStore.profiles[3]; // Rohan (student)
  return NextResponse.json({
    profile: defaultProfile,
    isDemo: true,
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = profileUpdateSchema.parse(body);

    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Security: Only update user's own profile and allowed fields
      const { data: updated, error } = await supabase
        .from("profiles")
        .update({
          ...validated,
          updated_at: new Date().toISOString(),
          last_active_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ profile: updated });
    }

    // Standalone fallback: update local store profile
    const defaultProfile = localStore.profiles[3];
    const updated = localStore.saveProfile({
      id: defaultProfile.id,
      ...validated,
    });

    return NextResponse.json({ profile: updated, isDemo: true });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      const msg = err.issues?.[0]?.message || (err as any).errors?.[0]?.message || "Validation failed";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
