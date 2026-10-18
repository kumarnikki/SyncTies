"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Send,
  ExternalLink,
  Info,
  Star,
  Zap,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Intent } from "@/types/database";
import {
  getTokenCostForHelpType,
  getTokenCostMeta,
  formatTokens,
  calculateAffordability,
} from "@/lib/tokens/costs";

export interface SpotlightMentor {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarTone: "violet" | "cyan" | "coral" | "blue";
  initials: string;
  matchScore: number;
  openSlots: number;
  monthlyLimit: number;
  domains: string[];
  helpType: string;
  gradYear: number;
  starRating: number;
  starLevelTitle: string;
  badges: string[];
  factors: {
    domainScore: number;
    helpTypeScore: number;
    capacityScore: number;
    recencyScore: number;
  };
  groundedBrief: string;
}

const SPOTLIGHT_MENTORS: SpotlightMentor[] = [
  {
    id: "33333333-3333-3333-3333-333333333301",
    name: "Priya Sharma",
    role: "Senior Product Manager",
    company: "Stripe",
    avatarTone: "violet",
    initials: "PS",
    matchScore: 96,
    openSlots: 3,
    monthlyLimit: 5,
    domains: ["Product Management", "FinTech & Payments", "Computer Science"],
    helpType: "Mock Interview & Feedback",
    gradYear: 2023,
    starRating: 5.0,
    starLevelTitle: "5-Star Master Mentor",
    badges: ["Superstar Referrer", "Lightning Star (< 18h)"],
    factors: {
      domainScore: 100,
      helpTypeScore: 95,
      capacityScore: 90,
      recencyScore: 98,
    },
    groundedBrief:
      "Ex-Google APM lead now building global billing at Stripe. Matches 100% of your target product domains with 3 verified review slots open this month.",
  },
  {
    id: "33333333-3333-3333-3333-333333333303",
    name: "Ananya Patel",
    role: "Full-Stack Software Engineer",
    company: "Vercel",
    avatarTone: "cyan",
    initials: "AP",
    matchScore: 93,
    openSlots: 4,
    monthlyLimit: 5,
    domains: ["Web Development", "Computer Science", "Developer Tools"],
    helpType: "Resume & CV Review",
    gradYear: 2024,
    starRating: 5.0,
    starLevelTitle: "5-Star Master Mentor",
    badges: ["Perfection Star", "Verified Star"],
    factors: {
      domainScore: 95,
      helpTypeScore: 92,
      capacityScore: 92,
      recencyScore: 94,
    },
    groundedBrief:
      "Recent 2024 grad at Vercel with high recent activity. Specializes in junior developer portfolios, modern Next.js systems, and resume optimization.",
  },
  {
    id: "33333333-3333-3333-3333-333333333302",
    name: "Marcus Chen",
    role: "Staff Machine Learning Engineer",
    company: "DeepMind",
    avatarTone: "coral",
    initials: "MC",
    matchScore: 89,
    openSlots: 2,
    monthlyLimit: 4,
    domains: ["AI & Machine Learning", "Computer Science", "Research"],
    helpType: "Capstone & Project Mentorship",
    gradYear: 2022,
    starRating: 4.9,
    starLevelTitle: "4-Star Distinguished Mentor",
    badges: ["Diamond Star", "Research Guide"],
    factors: {
      domainScore: 90,
      helpTypeScore: 88,
      capacityScore: 85,
      recencyScore: 92,
    },
    groundedBrief:
      "Published AI researcher at DeepMind. Provides grounded technical direction for ML capstones and PhD applications.",
  },
];

interface StudentMatchSpotlightProps {
  activeIntent?: Intent | null;
  tokensRemaining?: number;
}

export function StudentMatchSpotlight({
  activeIntent,
  tokensRemaining = 4,
}: StudentMatchSpotlightProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [requestModalMentor, setRequestModalMentor] = useState<SpotlightMentor | null>(null);
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleOpenRequest = (mentor: SpotlightMentor) => {
    setRequestModalMentor(mentor);
    setMessageText(
      `Hi ${mentor.name.split(" ")[0]}, I am working toward ${
        activeIntent?.title || "my target tech milestones"
      }. I would really appreciate 30 minutes of your guidance on key preparation areas!`
    );
  };

  const modalCost = requestModalMentor ? getTokenCostForHelpType(requestModalMentor.helpType) : 0.5;
  const modalMeta = requestModalMentor ? getTokenCostMeta(requestModalMentor.helpType) : null;

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestModalMentor) return;

    setIsSending(true);
    try {
      // Send outreach request via API
      const res = await fetch("/api/connection-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alum_id: requestModalMentor.id,
          intent_id: activeIntent?.id || "44444444-4444-4444-4444-444444444401",
          student_message: messageText,
        }),
      });

      if (res.ok) {
        setSuccessNotice(
          `Request sent to ${requestModalMentor.name}! ${formatTokens(modalCost)} tokens reserved in escrow. You have ${formatTokens(
            Math.max(0, tokensRemaining - modalCost)
          )} tokens left.`
        );
        setRequestModalMentor(null);
        setTimeout(() => setSuccessNotice(null), 6000);
      } else {
        const d = await res.json();
        alert(d.error || "Unable to send request right now");
      }
    } catch {
      alert("Network error sending request");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Title & Info Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="badge soft text-xs font-semibold inline-flex items-center gap-1.5 py-0.5 px-2.5 text-[#3563ff] bg-[#edf2fe]">
              <Sparkles className="h-3 w-3" />
              <span>Explainable PostgreSQL Algorithm</span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              Verified Capacity Open
            </span>
          </div>
          <h2 className="font-heading text-lg font-bold text-[#15213b]">
            High-Signal Mentors Matched For You
          </h2>
          <p className="text-xs text-[#66758e]">
            Deterministic rankings based on verified domain overlap, offer compatibility, and real-time monthly slots.
          </p>
        </div>

        <Link
          href={
            activeIntent
              ? `/student/matches?intentId=${activeIntent.id}`
              : "/student/matches"
          }
          className="shrink-0"
        >
          <button className="text-xs font-bold text-[#3563ff] hover:underline flex items-center gap-1">
            <span>Explore all ranked matches</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </Link>
      </div>

      {successNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between animate-fade-in-up">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
          <button
            onClick={() => setSuccessNotice(null)}
            className="text-[11px] text-emerald-800 underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Grid of 3 Spotlight Mentors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SPOTLIGHT_MENTORS.map((mentor) => {
          const isExpanded = expandedId === mentor.id;
          const tokenCost = getTokenCostForHelpType(mentor.helpType);
          const costMeta = getTokenCostMeta(mentor.helpType);
          const affordability = calculateAffordability(tokensRemaining, tokenCost);

          return (
            <div
              key={mentor.id}
              className="panel group bg-white border border-[#e2e8f0] hover:border-[#cfd8ff] rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between p-4"
            >
              <div>
                {/* Header: Avatar, Name, Score Orb */}
                <div className="flex items-start justify-between gap-2.5 mb-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar initials={mentor.initials} tone={mentor.avatarTone} size="md" />
                    <div className="min-w-0 leading-tight">
                      <h4 className="text-sm font-bold text-[#15213b] group-hover:text-[#3563ff] transition-colors truncate">
                        {mentor.name}
                      </h4>
                      <p className="text-xs text-[#66758e] truncate mt-0.5">
                        {mentor.role}
                      </p>
                      <p className="text-[11px] font-semibold text-[#15213b] truncate">
                        @{mentor.company} · &apos;{mentor.gradYear.toString().slice(-2)}
                      </p>
                    </div>
                  </div>

                  {/* Score Orb */}
                  <div className="score-orb shrink-0" style={{ width: 42, height: 42 }}>
                    <span className="text-xs font-extrabold">{mentor.matchScore}</span>
                    <small className="text-[6.5px]">fit</small>
                  </div>
                </div>

                {/* Star Rating Banner */}
                <div className="flex items-center gap-1.5 mb-2.5 bg-amber-50/70 border border-amber-200/70 rounded-lg px-2 py-1 text-[10.5px]">
                  <span className="inline-flex items-center gap-0.5 font-bold text-amber-700">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                    <span>{mentor.starRating.toFixed(1)} ★</span>
                  </span>
                  <span className="text-slate-700 font-semibold truncate">
                    {mentor.starLevelTitle}
                  </span>
                </div>

                {/* Offer & Capacity Pills */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                  <span className="badge soft text-[10px] py-0.5 px-2 font-semibold text-[#3563ff] bg-[#edf2fe]">
                    {mentor.helpType}
                  </span>
                  <span className="badge success text-[10px] py-0.5 px-2 font-semibold text-emerald-800 bg-emerald-50 border-emerald-200">
                    {mentor.openSlots} open slots
                  </span>
                </div>

                {/* Grounded AI Brief */}
                <div className="p-2.5 rounded-xl bg-[#f8faff] border border-[#e8effc] text-[11px] text-[#475569] leading-relaxed mb-3">
                  <div className="flex items-center gap-1 font-semibold text-[#2557e8] mb-0.5 text-[10px]">
                    <Sparkles className="h-3 w-3 text-[#2557e8]" />
                    <span>Grounded Brief</span>
                  </div>
                  {mentor.groundedBrief}
                </div>

                {/* Matched Domains Badges */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {mentor.domains.map((dom, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-medium bg-[#f1f5f9] text-[#475569] px-2 py-0.5 rounded-md"
                    >
                      {dom}
                    </span>
                  ))}
                </div>

                {/* Factor Breakdown Accordion Toggle */}
                <button
                  type="button"
                  onClick={() => toggleExpand(mentor.id)}
                  className="w-full flex items-center justify-between text-[11px] font-bold text-[#64748b] hover:text-[#15213b] py-1.5 px-2 rounded-lg bg-[#fafbfe] border border-slate-100 mb-3 transition-colors"
                >
                  <span className="flex items-center gap-1">
                    <Info className="h-3 w-3 text-[#3563ff]" />
                    <span>Algorithm breakdown (4 Factors)</span>
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>

                {/* Expanded Factor Breakdown */}
                {isExpanded && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-[10.5px] text-slate-700 mb-3 animate-fade-in-up">
                    <div className="flex justify-between items-center">
                      <span>Domain Overlap (40%)</span>
                      <b className="text-[#2557e8]">{mentor.factors.domainScore}%</b>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Help-Type Fit (30%)</span>
                      <b className="text-[#6d44e0]">{mentor.factors.helpTypeScore}%</b>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Capacity Weight (20%)</span>
                      <b className="text-emerald-700">{mentor.factors.capacityScore}%</b>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Activity Recency (10%)</span>
                      <b className="text-sky-700">{mentor.factors.recencyScore}%</b>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button & Token Cost */}
              <div className="pt-2.5 border-t border-slate-100 mt-auto flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1 text-[11px] text-[#15213b] font-bold">
                    <Zap className="h-3 w-3 text-amber-500 fill-amber-500 shrink-0" />
                    <span>{formatTokens(tokenCost)} {tokenCost === 1 ? "Token" : "Tokens"}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {affordability > 0 ? `Can request ${affordability}x` : "Low balance"}
                  </span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleOpenRequest(mentor)}
                  disabled={tokensRemaining < tokenCost}
                  className="text-xs h-8 px-3 gap-1.5 shadow-xs font-semibold shrink-0"
                >
                  <Send className="h-3 w-3" />
                  <span>Request</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Outreach Modal / Drawer */}
      {requestModalMentor && (
        <div className="modal-wrap">
          <div
            className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-xs z-50"
            onClick={() => setRequestModalMentor(null)}
          />
          <div className="relative z-50 w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-fade-in-up">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="badge soft text-[10px] font-bold text-[#3563ff] bg-[#edf2fe] mb-1 inline-block">
                  Intent-Based Outreach
                </span>
                <h3 className="text-lg font-bold text-[#15213b] font-heading">
                  Connect with {requestModalMentor.name}
                </h3>
                <p className="text-xs text-[#66758e]">
                  {requestModalMentor.role} @ {requestModalMentor.company} · {requestModalMentor.openSlots} open reviews left
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRequestModalMentor(null)}
                className="text-slate-600 hover:text-slate-900 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendRequest} className="space-y-4">
              <div className="field">
                <label className="text-xs font-bold text-slate-800">
                  Your Milestone / Ask for {requestModalMentor.name.split(" ")[0]}:
                </label>
                <textarea
                  rows={4}
                  required
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3563ff]"
                  placeholder="State your goal, what you have prepared, and the specific feedback you are seeking..."
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Zap className="h-3.5 w-3.5 text-amber-600 fill-amber-500" />
                  <span>{formatTokens(modalCost)} Token Escrow Safeguard</span>
                  {modalMeta && (
                    <span className="ml-auto text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                      {modalMeta.category}
                    </span>
                  )}
                </div>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  This request reserves {formatTokens(modalCost)} of your {formatTokens(tokensRemaining)} tokens. If {requestModalMentor.name.split(" ")[0]} does not respond within 14 days, the {formatTokens(modalCost)} tokens automatically refund back to your balance.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRequestModalMentor(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSending}
                  disabled={tokensRemaining < modalCost}
                  className="gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Request (Use {formatTokens(modalCost)} {modalCost === 1 ? "Token" : "Tokens"})</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

