"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Star,
  Clock,
  Check,
  Sliders,
  Award,
  Zap,
  TrendingUp,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMentorTier, getMentorBadges } from "@/lib/mentors/tiers";

interface MentorImpactCardProps {
  distinctMentees?: number;
  monthlyLimit?: number;
  utilizedSlots?: number;
  onCapacityChange?: (newLimit: number) => void;
}

export function MentorImpactCard({
  distinctMentees = 2,
  monthlyLimit = 5,
  utilizedSlots = 2,
  onCapacityChange,
}: MentorImpactCardProps) {
  const [isAccepting, setIsAccepting] = useState(true);
  const [limit, setLimit] = useState(monthlyLimit);
  const [isUpdatingCap, setIsUpdatingCap] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const tier = getMentorTier(distinctMentees);
  const badges = getMentorBadges({
    distinctMentees,
    completedGoals: 1,
    avgRating: 5.0,
    reviewCount: 1,
    confirmedHours: 4,
  });

  const handleAdjustLimit = async (delta: number) => {
    const nextVal = Math.min(20, Math.max(1, limit + delta));
    setLimit(nextVal);
    setIsUpdatingCap(true);

    try {
      const res = await fetch("/api/capacity", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monthly_limit: nextVal }),
      });
      if (res.ok) {
        setToastMsg(`Monthly capacity updated to ${nextVal} reviews.`);
        if (onCapacityChange) onCapacityChange(nextVal);
        setTimeout(() => setToastMsg(null), 4000);
      }
    } catch {
      alert("Failed to update capacity");
    } finally {
      setIsUpdatingCap(false);
    }
  };

  const utilizationPercent = Math.min(100, Math.round((utilizedSlots / limit) * 100));

  return (
    <div className="panel p-5 bg-gradient-to-br from-white to-[#fafbfe] border border-[#dce5fb] rounded-2xl shadow-xs space-y-5">
      {/* Top Banner: Availability Switch & Quick Capacity */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-[#e2e8f0] shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAccepting(!isAccepting)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
              isAccepting ? "bg-emerald-500" : "bg-slate-300"
            }`}
            aria-label="Toggle availability"
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                isAccepting ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <div>
            <span className="text-xs font-bold text-[#15213b] block">
              {isAccepting ? "Accepting New Requests" : "Mentorship Paused"}
            </span>
            <small className="text-[11px] text-[#64748b]">
              {isAccepting
                ? "Active in algorithm recommendation index"
                : "Profile hidden from match ranking"}
            </small>
          </div>
        </div>

        {/* Quick Capacity Stepper */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-700">Monthly Cap:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={isUpdatingCap || limit <= 1}
              onClick={() => handleAdjustLimit(-1)}
              className="w-5 h-5 rounded flex items-center justify-center bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
            >
              -
            </button>
            <span className="text-xs font-bold text-[#2557e8] w-5 text-center">
              {limit}
            </span>
            <button
              type="button"
              disabled={isUpdatingCap || limit >= 20}
              onClick={() => handleAdjustLimit(1)}
              className="w-5 h-5 rounded flex items-center justify-center bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
            >
              +
            </button>
          </div>
          <span className="text-[10px] text-slate-600">/mo</span>
        </div>
      </div>

      {toastMsg && (
        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Capacity Utilization Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-800">
            Monthly Review Capacity Utilization
          </span>
          <span className="font-bold text-[#2557e8]">
            {utilizedSlots} of {limit} reviews used ({utilizationPercent}%)
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#2557e8] to-[#00d2ff] rounded-full transition-all duration-500"
            style={{ width: `${utilizationPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-600">
          <span>{limit - utilizedSlots} open review slots remaining</span>
          <span>Automatic reset on 1st of next month</span>
        </div>
      </div>

      {/* Tier Roadmap Progress */}
      <div className="p-4 rounded-xl bg-white border border-[#e2e8f0] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="badge soft text-xs font-bold inline-flex items-center gap-1.5 py-0.5 px-2.5 text-[#3563ff] bg-[#edf2fe]">
              <Sparkles className="h-3 w-3" />
              <span>{tier.label} · Tier {tier.tierNumber}</span>
            </span>
            <span className="text-xs text-slate-600 font-medium">
              Verified Mentor
            </span>
          </div>
          <span className="text-xs font-bold text-[#15213b]">
            {tier.currentMentees} / {tier.nextThreshold || 100} Mentees
          </span>
        </div>

        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.max(6, tier.progressPercent)}%`,
              backgroundColor: tier.accentColor,
            }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-600">
          <span>Current: <b>{tier.label}</b></span>
          <span><b>{tier.menteesNeeded} more distinct mentees</b> to reach {tier.nextTierLabel}</span>
        </div>
      </div>

      {/* Verified Badges Shelf */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#15213b] flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-[#2557e8]" />
            <span>Verified Mentor Credential Badges</span>
          </span>
          <span className="text-[11px] text-[#64748b]">
            Audited on PostgreSQL Ledger
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                b.earned
                  ? "bg-white border-[#d8e2f0] text-slate-900 shadow-2xs hover:border-[#3563ff]"
                  : "bg-slate-50 border-slate-200/60 text-slate-400 opacity-60"
              }`}
              title={b.description}
            >
              <span className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                {b.icon === "shield" ? (
                  <ShieldCheck className="h-3.5 w-3.5 text-[#3563ff]" />
                ) : b.icon === "star" ? (
                  <Star className="h-3.5 w-3.5 text-amber-500" />
                ) : b.icon === "clock" ? (
                  <Clock className="h-3.5 w-3.5 text-sky-500" />
                ) : (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                )}
              </span>
              <div className="leading-tight">
                <span className="text-xs font-bold block">{b.name}</span>
                <span className="text-[10px] text-slate-600 block line-clamp-1">
                  {b.description}
                </span>
              </div>
              {b.earned && (
                <small className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-full shrink-0">
                  {b.earnedDate || "Active"}
                </small>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
