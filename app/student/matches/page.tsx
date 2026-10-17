"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Sparkles,
  Coins,
  CheckCircle,
  Clock,
  Briefcase,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { Textarea } from "@/components/ui/textarea";
import { MatchResult, TokenSummary } from "@/types/database";

function MatchesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intentId = searchParams.get("intentId");

  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [tokens, setTokens] = useState<TokenSummary | null>(null);
  const [intent, setIntent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedBreakdown, setExpandedBreakdown] = useState<Record<string, boolean>>({});

  // Request modal state
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);
  const [studentMessage, setStudentMessage] = useState("");
  const [repeatReason, setRepeatReason] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!intentId) return;

    Promise.all([
      fetch(`/api/matches?intentId=${intentId}`).then((r) => r.json()),
      fetch("/api/tokens/balance").then((r) => r.json()),
    ])
      .then(([matchData, tokenData]) => {
        if (matchData?.matches) setMatches(matchData.matches);
        if (matchData?.intent) setIntent(matchData.intent);
        if (tokenData) setTokens(tokenData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [intentId]);

  const toggleBreakdown = (alumId: string) => {
    setExpandedBreakdown((prev) => ({
      ...prev,
      [alumId]: !prev[alumId],
    }));
  };

  const handleOpenRequestModal = (match: MatchResult) => {
    setSelectedMatch(match);
    setRequestError(null);
    setRequestSuccess(null);
    setStudentMessage(
      `Hi ${match.full_name}, I saw your offer "${match.offer_title}" and would love your guidance on my goal.`
    );
    setRepeatReason("");
  };

  const handleSendRequest = async () => {
    if (!selectedMatch || !intentId) return;

    setRequestLoading(true);
    setRequestError(null);

    try {
      const res = await fetch("/api/connection-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alum_id: selectedMatch.alum_id,
          intent_id: intentId,
          offer_id: selectedMatch.offer_id,
          student_message: studentMessage,
          repeat_reason: selectedMatch.is_repeat_contact ? repeatReason : undefined,
          idempotency_key: crypto.randomUUID(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit connection request");
      }

      // Update tokens count locally
      if (tokens) {
        setTokens({
          ...tokens,
          tokens_spent: tokens.tokens_spent + 1,
          tokens_remaining: Math.max(0, tokens.tokens_remaining - 1),
        });
      }

      setRequestSuccess("Connection request sent successfully! 1 token was debited.");
      setTimeout(() => {
        setSelectedMatch(null);
        router.push("/student/requests");
      }, 1500);
    } catch (err: any) {
      setRequestError(err.message || "Failed to send request");
    } finally {
      setRequestLoading(false);
    }
  };

  if (!intentId) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <EmptyState
          icon={Users}
          title="No intent specified"
          description="Select an active intent from your dashboard to view ranked alumni matches."
          actionLabel="View Dashboard"
          actionHref="/student/dashboard"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Token Balance */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <Link
            href="/student/intents"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Intents</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            SQL-Ranked Alumni Matches
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Candidates ranked deterministically: 40% Domain Overlap + 30% Help Fit + 20% Available Capacity + 10% Recency
          </p>
        </div>

        {/* Token Balance Badge */}
        <div className="inline-flex items-center gap-3 bg-blue-50 border border-blue-200/80 rounded-xl px-4 py-2.5">
          <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Coins className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs text-blue-700 font-medium">Monthly Token Balance</div>
            <div className="text-lg font-extrabold text-blue-950 leading-tight">
              {tokens?.tokens_remaining ?? 4}{" "}
              <span className="text-xs font-normal text-slate-500">
                / {tokens?.tokens_granted ?? 5} remaining
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Goal Summary Header */}
      {intent && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Matching For Goal:
            </span>
            <h3 className="font-bold text-slate-900 text-base">{intent.title}</h3>
          </div>
          <Badge variant="indigo">{intent.help_type?.name || "Mock Interview"}</Badge>
        </div>
      )}

      {/* Match Results List */}
      {loading ? (
        <div className="p-12 text-center text-sm text-slate-500">
          Running SQL matching query across alumni offers...
        </div>
      ) : matches.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No eligible alumni matches found"
          description="None of our currently active alumni have open capacity matching this specific domain and help type. Check back soon or broaden your intent tags."
          actionLabel="Edit Intent Tags"
          actionHref="/student/intents"
        />
      ) : (
        <div className="space-y-6">
          {matches.map((match) => {
            const isExpanded = expandedBreakdown[match.alum_id];

            return (
              <Card
                key={match.alum_id}
                className="shadow-xs hover:border-blue-300 transition-all border-slate-200/90 overflow-hidden"
              >
                <CardHeader className="bg-white border-b border-slate-100 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-lg font-bold text-slate-900">{match.full_name}</h3>
                        {match.is_repeat_contact && (
                          <span className="text-xs bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-medium inline-flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> Repeat Contact in Month
                          </span>
                        )}
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                          Class of {match.graduation_year || 2023}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 font-medium">
                        {match.job_title} • {match.company}
                        {match.industry ? ` (${match.industry})` : ""}
                      </p>
                    </div>

                    {/* Fit Score Display */}
                    <div className="flex items-center sm:flex-col sm:items-end justify-between gap-1">
                      <div className="text-2xl font-black text-blue-600">
                        {match.total_score}%
                      </div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Match Score
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-4 space-y-4">
                  {/* Active Offer Box */}
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">
                        Offered: {match.offer_title}
                      </span>
                      <span className="text-slate-500 font-medium">
                        {match.remaining_capacity} of {match.monthly_limit} slots remaining
                      </span>
                    </div>
                    {match.bio && (
                      <p className="text-slate-600 leading-relaxed italic">&quot;{match.bio}&quot;</p>
                    )}
                  </div>

                  {/* Grounded AI Brief */}
                  {match.brief && (
                    <div className="p-3.5 rounded-lg bg-blue-50/40 border border-blue-100 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 text-blue-800 font-semibold">
                        <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                        <span>Why You Should Connect</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{match.brief}</p>
                    </div>
                  )}

                  {/* Factor Breakdown Accordion */}
                  <div>
                    <button
                      type="button"
                      onClick={() => toggleBreakdown(match.alum_id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      <span>Algorithm Factor Breakdown</span>
                      {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                        <div>
                          <div className="text-slate-500">Domain Fit (40%)</div>
                          <div className="text-sm font-bold text-slate-900">{match.d_score}%</div>
                          <div className="text-[10px] text-slate-400">Jaccard overlap</div>
                        </div>
                        <div>
                          <div className="text-slate-500">Help Type (30%)</div>
                          <div className="text-sm font-bold text-slate-900">{match.h_score}%</div>
                          <div className="text-[10px] text-slate-400">Compatibility table</div>
                        </div>
                        <div>
                          <div className="text-slate-500">Capacity (20%)</div>
                          <div className="text-sm font-bold text-slate-900">{match.c_score}%</div>
                          <div className="text-[10px] text-slate-400">
                            {match.remaining_capacity} slots left
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500">Recency (10%)</div>
                          <div className="text-sm font-bold text-slate-900">{match.r_score}%</div>
                          <div className="text-[10px] text-slate-400">14-day half-life</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Bar */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Lock className="h-3.5 w-3.5 text-blue-600" />
                      Cost: 1 Monthly Token (Leaves {(tokens?.tokens_remaining ?? 4) - 1})
                    </span>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenRequestModal(match)}
                      className="gap-1.5"
                    >
                      <span>Request Connection</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Connection Request Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Send Connection Request</h3>
                <p className="text-xs text-slate-500">
                  Recipient: {selectedMatch.full_name} ({selectedMatch.job_title})
                </p>
              </div>
              <button
                onClick={() => setSelectedMatch(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {requestError && <Alert variant="error">{requestError}</Alert>}
            {requestSuccess && <Alert variant="success">{requestSuccess}</Alert>}

            {/* Repeat Contact Warning */}
            {selectedMatch.is_repeat_contact && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1.5">
                <div className="font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span>Repeat Contact Safeguard</span>
                </div>
                <p>
                  You previously contacted {selectedMatch.full_name} this month. To prevent spam, please provide an explicit reason for this follow-up request.
                </p>
                <Textarea
                  placeholder="Explain why you are requesting another review this month..."
                  rows={2}
                  value={repeatReason}
                  onChange={(e) => setRepeatReason(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Personalized Message (min 15 chars)
              </label>
              <Textarea
                rows={4}
                value={studentMessage}
                onChange={(e) => setStudentMessage(e.target.value)}
                placeholder="Briefly state your context, where you need feedback, and why you selected this alumnus."
              />
            </div>

            <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 text-xs text-blue-900 flex items-center justify-between">
              <span>Token deduction:</span>
              <span className="font-bold">1 Token (Atomic debit upon submission)</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedMatch(null)}
                disabled={requestLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSendRequest}
                isLoading={requestLoading}
                disabled={
                  studentMessage.trim().length < 15 ||
                  (selectedMatch.is_repeat_contact && repeatReason.trim().length < 5)
                }
              >
                Confirm & Debit 1 Token
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MatchesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Loading matches...</div>}>
      <MatchesContent />
    </Suspense>
  );
}
