"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Target,
  Shield,
  Zap,
  CheckCircle2,
  Check,
  Award,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

export function AuthSideShowcase() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const tabs = [
    {
      id: "matching",
      label: "Matching",
      title: "Goal-Driven Fit",
      desc: "Deterministic SQL ranking based on verified domain overlap and availability.",
    },
    {
      id: "tokens",
      label: "Anti-Spam",
      title: "Token Safeguards",
      desc: "5 monthly tokens prevent mass blast spam and protect mentor schedule capacity.",
    },
    {
      id: "fulfillment",
      label: "Outcomes",
      title: "Mutual Confirmation",
      desc: "Goals are confirmed only when both student and mentor confirm the milestone.",
    },
  ];

  // Auto-cycle tabs every 5 seconds unless user hovers
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % tabs.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, tabs.length]);

  return (
    <div
      className="space-y-6 my-auto py-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Pilot Badge & Headline */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="badge dark text-xs inline-flex items-center gap-1.5 py-1 px-3">
            <Sparkles className="h-3 w-3 text-cyan-300" />
            <span>Intent-Based Networking</span>
          </span>
          <span className="text-[11px] font-semibold text-cyan-300/80 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded-full">
            Live Pilot
          </span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white leading-tight">
          A better way to find the person who can help.
        </h1>
        <p className="text-sm text-[#b9c6e6] mt-2.5 leading-relaxed max-w-md">
          Start with a specific career milestone. Meet alumni with matching expertise, open capacity, and verified credentials.
        </p>
      </div>

      {/* Interactive Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 max-w-sm">
        {tabs.map((tab, idx) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(idx)}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === idx
                ? "bg-white text-[#15213b] shadow-sm font-bold"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Showcase Visual Card */}
      <div className="relative p-5 rounded-2xl bg-white/10 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.25)] backdrop-blur-xl max-w-md transition-all duration-500">
        {/* TAB 0: GOAL-FIRST MATCHING CARD */}
        {activeTab === 0 && (
          <div className="space-y-3.5 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div>
                <small className="text-[11px] text-[#9db1e0] uppercase tracking-wider block font-medium">
                  Verified Candidate Recommendation
                </small>
                <b className="text-white text-sm font-heading block mt-0.5">
                  Prepare for AI Product Management
                </b>
              </div>
              <div className="score-orb shrink-0" style={{ width: 44, height: 44 }}>
                <span className="text-sm font-bold">94</span>
                <small className="text-[7px]">match</small>
              </div>
            </div>

            <div className="auth-showcase-card p-3 bg-white rounded-xl shadow-md space-y-2 border border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Avatar initials="MP" tone="violet" size="sm" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">Maya Patel</h4>
                    <p className="text-[11px] font-medium text-slate-600">Senior PM · Northstar Labs</p>
                  </div>
                </div>
                <span className="badge success text-[10px] py-0.5 px-2 font-semibold">3 Open Slots</span>
              </div>

              <div className="space-y-1.5 text-[10.5px] pt-1.5 border-t border-slate-100">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-medium">Domain Overlap (40%)</span>
                  <b className="text-[#2557e8] font-bold">96%</b>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-medium">Help-Type Fit (30%)</span>
                  <b className="text-[#6d44e0] font-bold">92%</b>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-cyan-300" />
              <span>Grounded AI brief synthesizes fit from verified profile attributes.</span>
            </div>
          </div>
        )}

        {/* TAB 1: TOKEN SAFEGUARDS CARD */}
        {activeTab === 1 && (
          <div className="space-y-3.5 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div>
                <small className="text-[11px] text-[#9db1e0] uppercase tracking-wider block font-medium">
                  Anti-Spam Token Guardrails
                </small>
                <b className="text-white text-sm font-heading block mt-0.5">
                  5 Monthly Outreach Tokens
                </b>
              </div>
              <Zap className="h-5 w-5 text-amber-300 shrink-0" />
            </div>

            <div className="auth-showcase-card p-3.5 bg-white rounded-xl shadow-md space-y-2.5 border border-white/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Current Token Balance</span>
                <span className="text-base font-extrabold text-[#2557e8] font-heading">
                  4 <span className="text-xs font-semibold text-slate-600">/ 5 left</span>
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#2557e8] to-[#00d2ff] w-[80%] rounded-full" />
              </div>
              <p className="text-[12px] font-medium text-slate-800 leading-relaxed pt-1.5 border-t border-slate-100">
                Zero unsolicited spam. Requests expire after 14 days without response to prevent endless waiting.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-cyan-200">
              <Shield className="h-3.5 w-3.5 shrink-0 text-cyan-300" />
              <span>Mentors set strict monthly caps (default 3 reviews/month).</span>
            </div>
          </div>
        )}

        {/* TAB 2: MUTUAL FULFILLMENT CARD */}
        {activeTab === 2 && (
          <div className="space-y-3.5 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div>
                <small className="text-[11px] text-[#9db1e0] uppercase tracking-wider block font-medium">
                  Rule #7: Dual Confirmation
                </small>
                <b className="text-white text-sm font-heading block mt-0.5">
                  Verified Outcome Rooms
                </b>
              </div>
              <Award className="h-5 w-5 text-emerald-300 shrink-0" />
            </div>

            <div className="auth-showcase-card p-3.5 bg-white rounded-xl shadow-md space-y-2.5 border border-white/20">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Student Confirmed
                </span>
                <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Mentor Confirmed
                </span>
              </div>

              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-300 text-center text-xs font-bold text-emerald-950">
                ✓ Goal Mutually Fulfilled
              </div>

              <p className="text-[11.5px] font-medium text-slate-800 leading-relaxed text-center pt-1 border-t border-slate-100">
                Unlocks confidential ratings and verified platform impact points.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-cyan-200">
              <Check className="h-3.5 w-3.5 shrink-0 text-emerald-300" />
              <span>92% of active collaborative rooms reach mutual completion.</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Live Metrics Row */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-[#9eb2de] pt-2 border-t border-white/10">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <b>94.8%</b> response rate
        </span>
        <span className="text-white/30">·</span>
        <span><b>&lt; 36 hrs</b> median review</span>
        <span className="text-white/30">·</span>
        <span><b>0%</b> directory spam</span>
      </div>
    </div>
  );
}
