"use client";

import React, { useState } from "react";
import {
  Target,
  Search,
  Inbox,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Check,
  CheckCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface SampleIntent {
  id: string;
  title: string;
  format: string;
  domains: string[];
  candidate: {
    name: string;
    role: string;
    company: string;
    score: number;
    initials: string;
    tone: "violet" | "cyan" | "coral" | "blue";
    domainFit: number;
    helpFit: number;
    capacityFit: number;
    recencyFit: number;
    brief: string;
  };
}

const SAMPLE_INTENTS: SampleIntent[] = [
  {
    id: "ai-pm",
    title: "Transition to AI Product Management",
    format: "Career Guidance & Transition Strategy",
    domains: ["AI / ML", "Product Management", "Computer Science"],
    candidate: {
      name: "Maya Patel",
      role: "Senior PM (AI Platforms)",
      company: "Northstar Labs · ex-Google",
      score: 94,
      initials: "MP",
      tone: "violet",
      domainFit: 96,
      helpFit: 94,
      capacityFit: 90,
      recencyFit: 92,
      brief: "Maya led LLM platform transitions and mentors 3rd/4th year students with active review slots.",
    },
  },
  {
    id: "systems-sre",
    title: "Distributed Systems & Cloud SRE Roadmap",
    format: "Architecture Critique & Interview Prep",
    domains: ["Distributed Systems", "Cloud Infrastructure", "Kubernetes"],
    candidate: {
      name: "Liam Vance",
      role: "Staff Infrastructure Engineer",
      company: "Stripe · Class of 2022",
      score: 91,
      initials: "LV",
      tone: "cyan",
      domainFit: 94,
      helpFit: 90,
      capacityFit: 88,
      recencyFit: 90,
      brief: "Liam specializes in high-throughput backend architecture and conducts mock systems design interviews.",
    },
  },
  {
    id: "fintech-quant",
    title: "Algorithmic Trading & Quantitative Research",
    format: "Resume Review & Problem Solving",
    domains: ["Quantitative Finance", "Python / C++", "Data Science"],
    candidate: {
      name: "Sarah Chen",
      role: "Quantitative Strategist",
      company: "Two Sigma · Alumni Mentor",
      score: 89,
      initials: "SC",
      tone: "coral",
      domainFit: 92,
      helpFit: 88,
      capacityFit: 85,
      recencyFit: 88,
      brief: "Sarah breaks down math-heavy interview patterns and evaluates portfolio backtesting projects.",
    },
  },
];

export function InteractiveJourney() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedIntentId, setSelectedIntentId] = useState<string>("ai-pm");
  const [tokensRemaining, setTokensRemaining] = useState<number>(5);
  const [requestSent, setRequestSent] = useState<boolean>(false);
  const [studentConfirmed, setStudentConfirmed] = useState<boolean>(true);
  const [mentorConfirmed, setMentorConfirmed] = useState<boolean>(false);

  const currentIntent =
    SAMPLE_INTENTS.find((i) => i.id === selectedIntentId) || SAMPLE_INTENTS[0];

  const handleSimulateRequest = () => {
    if (tokensRemaining > 0 && !requestSent) {
      setTokensRemaining((prev) => prev - 1);
      setRequestSent(true);
    }
  };

  const handleResetSim = () => {
    setTokensRemaining(5);
    setRequestSent(false);
  };

  const isMutuallyFulfilled = studentConfirmed && mentorConfirmed;

  return (
    <div className="space-y-10">
      {/* 4-Step Interactive Navigation Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { num: 1, label: "1. Define Intent", icon: Target, desc: "Structured Goal" },
          { num: 2, label: "2. SQL Matching", icon: Search, desc: "Explainable Fit" },
          { num: 3, label: "3. Guarded Outreach", icon: Inbox, desc: "Token Safeguards" },
          { num: 4, label: "4. Mutual Outcome", icon: CheckCircle2, desc: "Dual Confirmation" },
        ].map((s) => {
          const Icon = s.icon;
          const isActive = activeStep === s.num;
          const isDone = activeStep > s.num;

          return (
            <button
              key={s.num}
              type="button"
              onClick={() => setActiveStep(s.num)}
              className={`flex-1 min-w-[160px] sm:min-w-[200px] text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 relative ${
                isActive
                  ? "bg-white border-[#3563ff] shadow-[0_12px_30px_rgba(53,99,255,0.14)] -translate-y-0.5"
                  : isDone
                  ? "bg-white/70 border-emerald-200 hover:bg-white text-slate-700"
                  : "bg-white/50 border-[var(--line-soft)] hover:bg-white text-slate-500"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-[#3563ff] text-white"
                      : isDone
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {isDone ? <Check className="h-4 w-4" /> : s.num}
                </span>
                <span className="text-[11px] font-semibold text-[#8896ab] uppercase tracking-wider">
                  {s.desc}
                </span>
              </div>
              <div className="font-heading font-bold text-sm text-[#15213b]">
                {s.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Step Content Canvas */}
      <div className="p-5 sm:p-8 lg:p-10 rounded-[28px] border border-white/90 bg-white/75 shadow-[0_25px_65px_rgba(33,52,99,0.08)] backdrop-blur-xl transition-all duration-500">
        {/* STEP 1: DEFINE INTENT */}
        {activeStep === 1 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="badge soft text-xs inline-flex items-center gap-1.5 mb-1.5">
                  <Target className="h-3.5 w-3.5 text-[#3563ff]" /> Step 1: Goal Definition
                </span>
                <h3 className="font-heading text-2xl font-bold text-[#15213b]">
                  Select an example student career intent
                </h3>
                <p className="text-sm text-[#66758e] mt-1">
                  SyncTies replaces vague directory browsing with specific, time-bounded milestones.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="btn secondary text-xs h-9 px-4 shrink-0 gap-1.5 self-start sm:self-auto"
              >
                <span>Preview Matching</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {SAMPLE_INTENTS.map((intent) => {
                const isSelected = selectedIntentId === intent.id;
                return (
                  <div
                    key={intent.id}
                    onClick={() => setSelectedIntentId(intent.id)}
                    className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#f5f8ff] border-[#3563ff] shadow-md ring-2 ring-[#3563ff]/20"
                        : "bg-white border-[#e5eaf2] hover:border-slate-300 hover:shadow-xs"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="badge soft text-[11px] font-semibold">Sample Intent</span>
                        {isSelected && (
                          <span className="h-5 w-5 rounded-full bg-[#3563ff] text-white flex items-center justify-center text-xs">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                      <h4 className="font-heading font-bold text-base text-[#15213b] mb-1.5">
                        {intent.title}
                      </h4>
                      <p className="text-xs text-[#5369e8] font-medium mb-3">
                        Format: {intent.format}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-2 border-t border-[var(--line-soft)]">
                      {intent.domains.map((d) => (
                        <span
                          key={d}
                          className="text-[10px] bg-white text-[#4056c6] border border-[#d6e2ff] px-2 py-0.5 rounded font-medium"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 flex-wrap text-xs text-[#66758e]">
              <span>
                Selected Target: <b>{currentIntent.title}</b> with <b>{currentIntent.domains.length} canonical domains</b>.
              </span>
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="btn text-xs py-1.5 px-3.5 gap-1.5"
              >
                <span>Calculate Alumni Matches (Step 2)</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: TRANSPARENT SQL MATCHING */}
        {activeStep === 2 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="badge soft text-xs inline-flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#3563ff]" /> Step 2: Algorithmic Fit
                </span>
                <h3 className="font-heading text-2xl font-bold text-[#15213b]">
                  Explainable matching for &quot;{currentIntent.title}&quot;
                </h3>
                <p className="text-sm text-[#66758e] mt-1">
                  Deterministic formula: 40% Domain Overlap + 30% Help-Type Fit + 20% Capacity + 10% Recency.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="btn ghost text-xs h-9 px-3"
                >
                  Change Intent
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="btn secondary text-xs h-9 px-4 gap-1.5"
                >
                  <span>Step 3: Outreach</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Candidate Card Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-stretch">
              {/* Left: Top Candidate Box */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e5eaf2] shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      initials={currentIntent.candidate.initials}
                      tone={currentIntent.candidate.tone}
                      size="lg"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-heading font-bold text-lg text-[#15213b]">
                          {currentIntent.candidate.name}
                        </h4>
                        <Badge variant="soft" className="text-[10px]">Verified Alum</Badge>
                      </div>
                      <p className="text-xs text-[#66758e]">
                        {currentIntent.candidate.role} · {currentIntent.candidate.company}
                      </p>
                    </div>
                  </div>

                  <div className="score-orb">
                    <span className="font-heading text-lg font-bold">
                      {currentIntent.candidate.score}
                    </span>
                    <small className="text-[8px] text-[#3563ff] font-semibold">match</small>
                  </div>
                </div>

                {/* Grounded Brief */}
                <div className="p-3.5 rounded-xl bg-[#f0f4ff] border border-[#d6e2ff] text-xs text-[#2b44b8] flex items-start gap-2.5">
                  <Sparkles className="h-4 w-4 shrink-0 text-[#3563ff] mt-0.5" />
                  <div>
                    <strong className="block text-[#15213b] font-semibold mb-0.5">
                      Grounded AI Recommendation Rationale
                    </strong>
                    <span>{currentIntent.candidate.brief}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-[var(--line-soft)]">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    3 of 5 review slots open this month
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveStep(3)}
                    className="btn text-xs py-1.5 px-3.5 gap-1.5 shadow-xs"
                  >
                    <span>Request Introduction</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Right: Factor Decomposition Breakdown */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5 flex flex-col justify-between">
                <div>
                  <h4 className="font-heading text-sm font-bold text-[#15213b] mb-1">
                    Factor Breakdown Scores
                  </h4>
                  <p className="text-xs text-[#66758e]">
                    Every recommendation is explainable and verifiable.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-[#15213b] mb-1">
                      <span>Domain Overlap (40%)</span>
                      <span>{currentIntent.candidate.domainFit}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#e2e8f0] overflow-hidden">
                      <div
                        className="h-full bg-[#3563ff] rounded-full transition-all duration-700"
                        style={{ width: `${currentIntent.candidate.domainFit}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-[#15213b] mb-1">
                      <span>Help-Type Fit (30%)</span>
                      <span>{currentIntent.candidate.helpFit}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#e2e8f0] overflow-hidden">
                      <div
                        className="h-full bg-[#7c5ce7] rounded-full transition-all duration-700"
                        style={{ width: `${currentIntent.candidate.helpFit}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-[#15213b] mb-1">
                      <span>Available Capacity (20%)</span>
                      <span>{currentIntent.candidate.capacityFit}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#e2e8f0] overflow-hidden">
                      <div
                        className="h-full bg-[#2d9667] rounded-full transition-all duration-700"
                        style={{ width: `${currentIntent.candidate.capacityFit}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-[#15213b] mb-1">
                      <span>Activity Recency (10%)</span>
                      <span>{currentIntent.candidate.recencyFit}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#e2e8f0] overflow-hidden">
                      <div
                        className="h-full bg-[#00b4d8] rounded-full transition-all duration-700"
                        style={{ width: `${currentIntent.candidate.recencyFit}%` }}
                      />
                    </div>
                  </div>
                </div>

                <small className="text-[11px] text-[#8896ab] border-t border-slate-200 pt-2 block">
                  Scored algorithmically by PostgreSQL. Scores indicate relevance, never mentor quality.
                </small>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: GUARDED OUTREACH */}
        {activeStep === 3 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="badge soft text-xs inline-flex items-center gap-1.5 mb-1.5">
                  <Zap className="h-3.5 w-3.5 text-[#3563ff]" /> Step 3: Anti-Spam Guardrails
                </span>
                <h3 className="font-heading text-2xl font-bold text-[#15213b]">
                  Token-guarded introduction requests
                </h3>
                <p className="text-sm text-[#66758e] mt-1">
                  Students spend 1 monthly token per request to ensure respectful, high-signal outreach.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="btn ghost text-xs h-9 px-3"
                >
                  Back to Matches
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="btn secondary text-xs h-9 px-4 gap-1.5"
                >
                  <span>Step 4: Outcome</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive Token Simulation Box */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-6 items-center">
              {/* Token balance card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1b274a] to-[#2c3d73] text-white space-y-4">
                <div className="flex items-center justify-between">
                  <span className="badge dark text-xs">Simulated Token Ledger</span>
                  <Zap className="h-5 w-5 text-cyan-300" />
                </div>

                <div>
                  <div className="text-xs text-[#b8c6e8]">Monthly Available Balance</div>
                  <div className="text-4xl font-extrabold font-heading text-white mt-1">
                    {tokensRemaining}{" "}
                    <span className="text-base font-normal text-[#8fa2d4]">/ 5 tokens</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#ccd8f5]">
                  <div className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-cyan-300" />
                    <span>Each request requires 1 token to debit.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-cyan-300" />
                    <span>Tokens automatically refresh on the 1st of each month.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-cyan-300" />
                    <span>14-day auto-expiration prevents ghosting.</span>
                  </div>
                </div>

                {requestSent && (
                  <button
                    type="button"
                    onClick={handleResetSim}
                    className="text-xs text-cyan-300 underline font-semibold hover:text-white"
                  >
                    Reset Simulated Tokens
                  </button>
                )}
              </div>

              {/* Outreach Action Form Simulation */}
              <div className="p-6 rounded-2xl bg-white border border-[#e5eaf2] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-base text-[#15213b]">
                    Target: {currentIntent.candidate.name}
                  </h4>
                  <Badge variant={requestSent ? "success" : "soft"}>
                    {requestSent ? "Request Submitted" : "Ready to Send"}
                  </Badge>
                </div>

                <div className="text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 text-[#455470] leading-relaxed">
                  <strong>Student Ask:</strong> &quot;Hi {currentIntent.candidate.name}, I am preparing to transition into {currentIntent.title} and would appreciate 20 mins to review my roadmap.&quot;
                </div>

                <div className="flex items-center justify-between text-xs text-[#66758e]">
                  <span>Cost: 1 Token</span>
                  <span>Estimated Review: ~15 mins</span>
                </div>

                {!requestSent ? (
                  <button
                    type="button"
                    onClick={handleSimulateRequest}
                    className="btn w-full py-2.5 px-4 text-xs font-semibold gap-2 shadow-xs"
                  >
                    <Zap className="h-4 w-4" />
                    <span>Click to Simulate 1-Token Request</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Request Dispatched! 1 token deducted from monthly ledger.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveStep(4)}
                      className="btn secondary w-full py-2 text-xs font-semibold gap-1.5"
                    >
                      <span>Proceed to Dual Confirmation (Step 4)</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: MUTUAL OUTCOME */}
        {activeStep === 4 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="badge soft text-xs inline-flex items-center gap-1.5 mb-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#3563ff]" /> Step 4: Rule #7
                </span>
                <h3 className="font-heading text-2xl font-bold text-[#15213b]">
                  Mutual Fulfillment &amp; Verified Credibility
                </h3>
                <p className="text-sm text-[#66758e] mt-1">
                  Goals are marked fulfilled only when BOTH student and alumnus explicitly confirm completion.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="btn secondary text-xs h-9 px-4 gap-1.5"
              >
                <span>Restart Journey</span>
              </button>
            </div>

            {/* Interactive Dual Checkbox Workspace */}
            <div className="p-6 rounded-2xl bg-white border border-[#e5eaf2] shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--line-soft)] flex-wrap gap-2">
                <div>
                  <h4 className="font-heading font-bold text-lg text-[#15213b]">
                    Goal Workspace: {currentIntent.title}
                  </h4>
                  <p className="text-xs text-[#66758e]">
                    Collaborators: Jordan Lee (Student) &amp; {currentIntent.candidate.name} (Alumnus)
                  </p>
                </div>
                <Badge tone={isMutuallyFulfilled ? "success" : "soft"}>
                  {isMutuallyFulfilled ? "Mutually Fulfilled" : "In Progress"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Student confirmation toggle */}
                <div
                  onClick={() => setStudentConfirmed(!studentConfirmed)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    studentConfirmed
                      ? "bg-emerald-50/70 border-emerald-200"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#15213b]">Student Partner</span>
                    <span
                      className={`h-5 w-5 rounded-md flex items-center justify-center text-xs font-bold ${
                        studentConfirmed
                          ? "bg-emerald-600 text-white"
                          : "border border-slate-300 bg-white"
                      }`}
                    >
                      {studentConfirmed && <Check className="h-3.5 w-3.5" />}
                    </span>
                  </div>
                  <p className="text-xs text-[#66758e] mt-2">
                    {studentConfirmed
                      ? "Confirmed outcome: Received concrete roadmap review notes."
                      : "Pending: Click to mark as confirmed by student."}
                  </p>
                </div>

                {/* Mentor confirmation toggle */}
                <div
                  onClick={() => setMentorConfirmed(!mentorConfirmed)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    mentorConfirmed
                      ? "bg-emerald-50/70 border-emerald-200"
                      : "bg-amber-50/60 border-amber-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#15213b]">Alumnus Mentor</span>
                    <span
                      className={`h-5 w-5 rounded-md flex items-center justify-center text-xs font-bold ${
                        mentorConfirmed
                          ? "bg-emerald-600 text-white"
                          : "border border-amber-300 bg-white"
                      }`}
                    >
                      {mentorConfirmed && <Check className="h-3.5 w-3.5" />}
                    </span>
                  </div>
                  <p className="text-xs text-[#66758e] mt-2">
                    {mentorConfirmed
                      ? "Confirmed outcome: Mentorship milestone completed."
                      : "Pending: Click to simulate mentor confirmation."}
                  </p>
                </div>
              </div>

              {/* Status Outcome Banner */}
              {isMutuallyFulfilled ? (
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                    <div>
                      <b className="block text-sm text-emerald-950">Mutual Confirmation Established!</b>
                      <span>Fulfillment verified. Both parties unlocked confidential rating and community badges.</span>
                    </div>
                  </div>
                  <Badge variant="success" className="px-3 py-1 font-bold">
                    ✓ Credited to Community Metrics
                  </Badge>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#66758e] flex items-center justify-between flex-wrap gap-2">
                  <span>
                    SyncTies rule: Single-sided claims do not count. Click both cards above to test mutual fulfillment.
                  </span>
                  <span className="text-xs font-semibold text-[#3563ff]">
                    {studentConfirmed && !mentorConfirmed
                      ? "1 of 2 Confirmed"
                      : !studentConfirmed && mentorConfirmed
                      ? "1 of 2 Confirmed"
                      : "0 of 2 Confirmed"}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
