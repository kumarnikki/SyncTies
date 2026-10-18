"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Inbox,
  Check,
  X,
  MessageSquare,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Zap,
  AlertTriangle,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ConnectionRequest } from "@/types/database";
import { getTokenCostForHelpType, getTokenCostMeta, formatTokens } from "@/lib/tokens/costs";

interface AlumniRequestTriageProps {
  initialRequests: ConnectionRequest[];
  onActionComplete?: () => void;
}

export function AlumniRequestTriage({
  initialRequests,
  onActionComplete,
}: AlumniRequestTriageProps) {
  const [requests, setRequests] = useState<ConnectionRequest[]>(initialRequests);
  const [filter, setFilter] = useState<"all" | "pending" | "accepted">("pending");
  const [responseNotes, setResponseNotes] = useState<Record<string, string>>({});
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If parent updates initialRequests
  React.useEffect(() => {
    setRequests(initialRequests);
  }, [initialRequests]);

  const handleAction = async (requestId: string, action: "accept" | "decline" | "ignore") => {
    setProcessingId(requestId);
    const note =
      responseNotes[requestId] ||
      (action === "accept"
        ? "Accepted! Looking forward to working together."
        : action === "ignore"
        ? "Repeat request marked as ignored."
        : "Thank you for reaching out; currently at capacity for this domain.");

    try {
      const res = await fetch(`/api/connection-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          response_note: note,
        }),
      });

      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  status:
                    action === "accept"
                      ? "accepted"
                      : action === "ignore"
                      ? "ignored"
                      : "declined",
                  alumni_response_note: note,
                }
              : r
          )
        );
        setSuccessMsg(
          action === "accept"
            ? "Request accepted! Collaboration room is now active."
            : action === "ignore"
            ? "Repeat request ignored. Decision recorded and communicated to student."
            : "Request declined. Student token refunded to their balance."
        );
        if (onActionComplete) onActionComplete();
        setTimeout(() => setSuccessMsg(null), 5000);
      } else {
        const d = await res.json();
        alert(d.error || "Action failed");
      }
    } catch {
      alert("Network error updating request");
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = requests.filter((r) => {
    if (filter === "pending") return r.status === "pending";
    if (filter === "accepted") return r.status === "accepted";
    return true;
  });

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="panel p-5 bg-white border border-[#e2e8f0] rounded-2xl shadow-xs space-y-4">
      {/* Head */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge soft text-xs font-semibold inline-flex items-center gap-1.5 py-0.5 px-2.5 text-[#3563ff] bg-[#edf2fe]">
              <Inbox className="h-3.5 w-3.5" />
              <span>Review &amp; Triage Center</span>
            </span>
            {pendingCount > 0 && (
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full animate-pulse">
                {pendingCount} Pending Decision
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-[#15213b] font-heading">
            Incoming Mentorship Requests
          </h3>
          <p className="text-xs text-[#66758e]">
            Review student goals that verified high domain overlap and reserved required tokens in escrow.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setFilter("pending")}
            className={`py-1 px-3 rounded-lg transition-all ${
              filter === "pending"
                ? "bg-white text-[#15213b] shadow-2xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("accepted")}
            className={`py-1 px-3 rounded-lg transition-all ${
              filter === "accepted"
                ? "bg-white text-[#15213b] shadow-2xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Accepted ({requests.filter((r) => r.status === "accepted").length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`py-1 px-3 rounded-lg transition-all ${
              filter === "all"
                ? "bg-white text-[#15213b] shadow-2xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All ({requests.length})
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg(null)}
            className="text-[11px] underline text-emerald-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Requests List */}
      {filtered.length === 0 ? (
        <div className="py-8 text-center text-slate-600 space-y-2">
          <CheckCircle2 className="h-8 w-8 text-slate-300 mx-auto" />
          <p className="text-xs font-medium">No requests matching this view.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 space-y-3">
          {filtered.map((req) => {
            const studentName = req.student?.full_name || "Nikki Kumar";
            const isPending = req.status === "pending";
            const isAccepted = req.status === "accepted";
            const isIgnored = req.status === "ignored";
            const isDeclined = req.status === "declined";
            const isRepeat = !!req.repeat_contact_in_month;

            const categoryHint = (req as any).offer?.category || req.intent?.title || "Mentoring";
            const tokenCost = req.token_cost ?? getTokenCostForHelpType(categoryHint);
            const costMeta = getTokenCostMeta(categoryHint);

            return (
              <div
                key={req.id}
                className={`pt-3 first:pt-0 space-y-3 p-3.5 rounded-xl transition-colors ${
                  isRepeat && isPending
                    ? "bg-gradient-to-r from-amber-50/60 to-orange-50/40 border border-amber-200/80"
                    : "hover:bg-[#fafbfe]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Avatar initials={studentName.slice(0, 2).toUpperCase()} tone="violet" size="md" />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <b className="text-sm text-[#15213b]">{studentName}</b>
                        <span className="badge soft text-[10px] py-0 px-2 font-semibold text-[#3563ff] bg-[#edf2fe]">
                          3rd Year Undergrad
                        </span>
                        <span className="badge success text-[10px] py-0 px-1.5 font-semibold text-emerald-800 bg-emerald-50">
                          94% Match Fit
                        </span>
                        {/* Token Escrow Badge */}
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2557e8] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                          <Zap className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
                          <span>{formatTokens(tokenCost)} Token Escrow</span>
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#3563ff] mt-0.5 flex items-center gap-1.5">
                        <span>Target Goal: {req.intent?.title || "APM Mock Interview & Product Sense"}</span>
                        <span className="text-[10px] font-medium text-slate-500">({costMeta.category})</span>
                      </p>
                      <p className="text-xs text-[#475569] mt-1.5 leading-relaxed bg-[#f8faff] p-2.5 rounded-lg border border-[#edf2fd] italic">
                        &ldquo;{req.student_message}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0 flex items-center gap-2">
                    {isPending && (
                      <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>11 days remaining</span>
                      </span>
                    )}
                    {isAccepted && (
                      <span className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        <span>Accepted · Active Room</span>
                      </span>
                    )}
                    {isIgnored && (
                      <span className="text-[11px] text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                        <EyeOff className="h-3 w-3" />
                        <span>Ignored Repeat</span>
                      </span>
                    )}
                    {isDeclined && (
                      <span className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                        <X className="h-3 w-3" />
                        <span>Declined (Refunded)</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Repeat Contact Notification Callout if applicable */}
                {isRepeat && isPending && (
                  <div className="p-2.5 rounded-xl bg-amber-100/70 border border-amber-300 text-amber-950 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                      <span>Repeat Contact Priority Signal</span>
                      <span className="ml-auto text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                        {formatTokens(tokenCost)} Tokens Paid
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-900/90 leading-relaxed">
                      This student has spent an additional monthly token to re-connect with you. You know they prioritized this interaction. You can either <b>Review &amp; Accept</b> or <b>Ignore</b> (which communicates the ignored decision to the student).
                    </p>
                    {/* Display follow-up rationale if provided */}
                    {(req.repeat_reason || req.repeat_contact_rationale) && (
                      <div className="text-[11px] bg-white/90 p-2 rounded-lg border border-amber-200 text-slate-800 font-medium italic">
                        Follow-up rationale: &ldquo;{req.repeat_reason || req.repeat_contact_rationale}&rdquo;
                      </div>
                    )}
                  </div>
                )}

                {/* Mentor Action Bar if Pending */}
                {isPending && (
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Add quick reply note (optional)..."
                        value={responseNotes[req.id] || ""}
                        onChange={(e) =>
                          setResponseNotes({ ...responseNotes, [req.id]: e.target.value })
                        }
                        className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#3563ff]"
                      />
                    </div>
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleAction(req.id, "accept")}
                        isLoading={processingId === req.id}
                        className="text-xs h-8 px-3 gap-1 bg-emerald-600 hover:bg-emerald-700 font-semibold"
                      >
                        <Check className="h-3 w-3" />
                        <span>{isRepeat ? "Review & Accept" : "Accept & Open Room"}</span>
                      </Button>

                      {isRepeat && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleAction(req.id, "ignore")}
                          isLoading={processingId === req.id}
                          className="text-xs h-8 px-2.5 text-amber-800 bg-amber-100 hover:bg-amber-200 border-amber-300 font-semibold"
                        >
                          <EyeOff className="h-3 w-3" />
                          <span>Ignore Repeat</span>
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction(req.id, "decline")}
                        isLoading={processingId === req.id}
                        className="text-xs h-8 px-2.5 text-slate-600 hover:text-rose-600 hover:border-rose-200"
                      >
                        <X className="h-3 w-3" />
                        <span>Decline ({formatTokens(tokenCost)} refunded)</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* If Accepted, provide Room link */}
                {isAccepted && (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[#64748b]">
                      Confirmed response: &ldquo;{req.alumni_response_note || "Accepted! Room active."}&rdquo;
                    </span>
                    <Link href="/goals/77777777-7777-7777-7777-777777777701">
                      <Button size="sm" variant="secondary" className="text-xs h-7 gap-1 font-semibold">
                        <span>Open Collaboration Room</span>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

