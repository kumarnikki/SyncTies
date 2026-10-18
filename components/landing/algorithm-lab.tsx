"use client";

import React, { useState } from "react";
import { Sparkles, Sliders, Cpu, Check, Shield, Info, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AlgorithmLab() {
  const [domainScore, setDomainScore] = useState<number>(95);
  const [helpScore, setHelpScore] = useState<number>(90);
  const [capacityScore, setCapacityScore] = useState<number>(100);
  const [recencyScore, setRecencyScore] = useState<number>(85);

  // Compute deterministic weighted score
  const totalScore = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        domainScore * 0.4 +
          helpScore * 0.3 +
          capacityScore * 0.2 +
          recencyScore * 0.1
      )
    )
  );

  const handleReset = () => {
    setDomainScore(95);
    setHelpScore(90);
    setCapacityScore(100);
    setRecencyScore(85);
  };

  // Dynamic explanation generated from actual signals
  const getExplanation = () => {
    if (capacityScore === 0) {
      return "Mentor has reached their monthly review cap. To protect against mentor burnout, candidate is deprioritized until next month's token refresh.";
    }
    if (totalScore >= 85) {
      return "Exceptional alignment: High domain commonality (Jaccard > 0.8) and matching guidance format with open capacity slots.";
    }
    if (totalScore >= 70) {
      return "Solid relevance fit: Good shared domain context. Mentor has availability and active recent platform participation.";
    }
    return "Low algorithmic alignment: Weak domain overlap or incompatible guidance format. Ranked lower in student discovery queue.";
  };

  const getScoreTheme = () => {
    if (capacityScore === 0) return { color: "#c44f5a", label: "Capacity Capped" };
    if (totalScore >= 85) return { color: "#3563ff", label: "High Priority Match" };
    if (totalScore >= 70) return { color: "#7c5ce7", label: "Moderate Fit" };
    return { color: "#e67e22", label: "Low Relevance" };
  };

  const theme = getScoreTheme();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="badge soft text-xs inline-flex items-center gap-1.5 mb-2">
            <Cpu className="h-3.5 w-3.5 text-[#3563ff]" /> Interactive Matching Sandbox
          </span>
          <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#15213b]">
            Test the deterministic SQL formula in real time
          </h3>
          <p className="text-sm text-[#66758e] mt-1 max-w-2xl leading-relaxed">
            Move the sliders and toggle mentor availability below to see how SyncTies computes transparent recommendation scores without black-box guesswork.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="btn secondary text-xs h-9 px-3.5 gap-1.5 self-start sm:self-auto shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 sm:gap-8 items-stretch">
        {/* Left Column: Interactive Controls */}
        <div className="p-6 sm:p-8 rounded-[24px] bg-white border border-[#e5eaf2] shadow-sm space-y-6">
          {/* Factor 1: Domain Overlap */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#15213b] flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#3563ff]" />
                <span>1. Domain Overlap (40% Weight)</span>
              </span>
              <span className="font-heading font-extrabold text-[#3563ff] text-sm">
                {domainScore}%
              </span>
            </div>
            <p className="text-[11px] text-[#8896ab]">
              Jaccard intersection over canonical domain tags between student ask and mentor profile.
            </p>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={domainScore}
              onChange={(e) => setDomainScore(Number(e.target.value))}
              className="w-full accent-[#3563ff] cursor-pointer"
            />
          </div>

          {/* Factor 2: Help-Type Fit */}
          <div className="space-y-2.5 pt-4 border-t border-[var(--line-soft)]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#15213b] flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#7c5ce7]" />
                <span>2. Help-Type Fit (30% Weight)</span>
              </span>
              <span className="font-heading font-extrabold text-[#7c5ce7] text-sm">
                {helpScore}%
              </span>
            </div>
            <p className="text-[11px] text-[#8896ab]">
              Compatibility between the student format requested and the mentor active offer.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Exact Match", val: 100 },
                { label: "Adjacent Fit", val: 70 },
                { label: "Broad Guidance", val: 40 },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setHelpScore(opt.val)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                    helpScore === opt.val
                      ? "bg-[#f5f0ff] border-[#7c5ce7] text-[#7c5ce7] shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Factor 3: Mentor Capacity */}
          <div className="space-y-2.5 pt-4 border-t border-[var(--line-soft)]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#15213b] flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#2d9667]" />
                <span>3. Monthly Capacity (20% Weight)</span>
              </span>
              <span className="font-heading font-extrabold text-[#2d9667] text-sm">
                {capacityScore}%
              </span>
            </div>
            <p className="text-[11px] text-[#8896ab]">
              Protects alumni from over-inbox exhaustion. 0% drops score when mentor reaches their cap.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Open Slots (5/5)", val: 100 },
                { label: "1 Slot Left (1/5)", val: 50 },
                { label: "Capacity Full (0/5)", val: 0 },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setCapacityScore(opt.val)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                    capacityScore === opt.val
                      ? opt.val === 0
                        ? "bg-rose-50 border-rose-400 text-rose-700 shadow-xs"
                        : "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Factor 4: Activity Recency */}
          <div className="space-y-2.5 pt-4 border-t border-[var(--line-soft)]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#15213b] flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#00b4d8]" />
                <span>4. Activity Recency (10% Weight)</span>
              </span>
              <span className="font-heading font-extrabold text-[#00b4d8] text-sm">
                {recencyScore}%
              </span>
            </div>
            <p className="text-[11px] text-[#8896ab]">
              14-day exponential half-life curve rewarding mentors actively logging in.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Active Today", val: 100 },
                { label: "Within 7 Days", val: 75 },
                { label: "14+ Days Inactive", val: 30 },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setRecencyScore(opt.val)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                    recencyScore === opt.val
                      ? "bg-cyan-50 border-cyan-500 text-cyan-800 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Composite Fit Score Display */}
        <div className="p-6 sm:p-8 rounded-[24px] bg-slate-900 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div
            className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none transition-colors duration-700"
            style={{ backgroundColor: theme.color }}
          />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="badge dark text-xs inline-flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-cyan-300" /> Real-time Calculation
              </span>
              <span
                className="text-xs font-bold px-2.5 py-0.5 rounded-full border transition-all duration-300"
                style={{
                  color: theme.color,
                  borderColor: `${theme.color}40`,
                  backgroundColor: `${theme.color}18`,
                }}
              >
                {theme.label}
              </span>
            </div>

            {/* Score Big Orb */}
            <div className="text-center my-6">
              <div
                className="relative w-36 h-36 mx-auto rounded-full flex flex-col items-center justify-center p-3 transition-all duration-500"
                style={{
                  background: `conic-gradient(${theme.color} ${totalScore}%, rgba(255,255,255,0.08) 0)`,
                  boxShadow: `0 0 35px ${theme.color}40`,
                }}
              >
                <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center">
                  <span className="font-heading text-4xl sm:text-5xl font-extrabold text-white leading-none">
                    {totalScore}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 mt-1">/ 100 fit</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-3 font-medium">
                Deterministic Composite Match Score
              </p>
            </div>

            {/* Grounded AI Rationale Snippet */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-slate-300 space-y-1">
              <strong className="text-white block font-semibold flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                <span>Grounded Match Brief</span>
              </strong>
              <p className="text-slate-300 leading-relaxed text-xs m-0">
                {getExplanation()}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-[11px] text-slate-400 mt-6 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              <span>100% Deterministic SQL</span>
            </span>
            <span className="text-slate-400">PostgreSQL Pl/pgSQL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
