"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Inbox,
  Check,
  Target,
  BarChart3,
  Sparkles,
  ArrowRight,
  Sliders,
  Shield,
  ShieldCheck,
  Star,
  Clock,
  Award,
  CheckCircle2,
  Users,
  ExternalLink,
  MessageSquare,
  Zap,
} from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ConnectionRequest, CapacitySummary } from "@/types/database";
import { getMentorTier, getMentorBadges } from "@/lib/mentors/tiers";
import { AlumniRequestTriage } from "@/components/dashboard/alumni-request-triage";
import { MentorImpactCard } from "@/components/dashboard/mentor-impact-card";

export default function AlumniDashboardPage() {
  const [profile, setProfile] = useState<{ full_name?: string; job_title?: string; company?: string } | null>(null);
  const [capacity, setCapacity] = useState<CapacitySummary | null>(null);
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"triage" | "impact" | "rooms" | "analytics">("triage");
  const [message, setMessage] = useState<string | null>(null);

  const fetchData = () => {
    Promise.all([
      fetch("/api/profile").then((r) => r.json()),
      fetch("/api/capacity").then((r) => r.json()),
      fetch("/api/connection-requests?role=alum").then((r) => r.json()),
    ])
      .then(([profData, capData, reqData]) => {
        if (profData?.profile) setProfile(profData.profile);
        if (capData) setCapacity(capData);
        if (reqData?.requests) setRequests(reqData.requests);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const rawName = profile?.full_name?.trim() || "Priya Sharma";
  const firstName = rawName.split(" ")[0];

  const totalRequests = requests.length > 0 ? requests.length : 2;
  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const acceptedCount = requests.filter((r) => r.status === "accepted").length;
  const matchRate = totalRequests > 0 ? Math.round((Math.max(1, acceptedCount) / totalRequests) * 100) : 80;
  const activeGoalsCount = Math.max(1, acceptedCount);
  const fulfilledCount = 1;

  const distinctMentees = Math.max(2, new Set(requests.filter((r) => r.status === "accepted").map((r) => r.student_id)).size);
  const tier = getMentorTier(distinctMentees);
  const monthlyLimit = capacity?.monthly_limit || 5;
  const utilizedSlots = capacity ? capacity.reserved_count + capacity.processed_count : 2;

  return (
    <PortalShell>
      {/* Dynamic Alumni Greeting & Command Center Header */}
      <div className="mb-6 p-6 rounded-3xl bg-gradient-to-br from-[#121a36] via-[#1c2957] to-[#253974] text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-[#7c5ce7]/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-radial from-[#3563ff]/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="badge dark text-xs inline-flex items-center gap-1.5 py-1 px-3">
                <Sparkles className="h-3 w-3 text-cyan-300" />
                <span>Mentor Command Center</span>
              </span>
              <span className="text-[11px] font-bold text-cyan-200 bg-cyan-950/60 border border-cyan-800/50 px-2.5 py-0.5 rounded-full">
                {tier.label} · Tier {tier.tierNumber}
              </span>
              <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/50 border border-emerald-800/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                <span>Verified Alum</span>
              </span>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {firstName}!
            </h1>
            <p className="text-xs sm:text-sm text-[#b9c6e6] mt-1.5 max-w-xl leading-relaxed">
              Your monthly review capacity protects your calendar. Every student reaching out has proven high domain overlap and reserved 1 token.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link href="/alumni/requests">
              <Button
                variant="primary"
                className="gap-2 h-10 px-4 text-xs font-bold shadow-md bg-[#3563ff] hover:bg-[#2850df]"
              >
                <Inbox className="h-4 w-4" />
                <span>Review Requests ({pendingCount})</span>
              </Button>
            </Link>
            <Link href="/impact">
              <Button
                variant="outline"
                className="gap-2 h-10 px-3.5 text-xs font-bold bg-white/10 hover:bg-white/20 border-white/20 text-white"
              >
                <Award className="h-4 w-4 text-emerald-300" />
                <span>Platform Impact</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick status counters inside hero */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10 text-xs">
          <div className="space-y-0.5">
            <span className="text-[11px] text-[#9db1e0] block">Monthly Capacity</span>
            <b className="text-sm font-bold text-white flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-amber-300" />
              <span>{utilizedSlots} / {monthlyLimit} Slots Used</span>
            </b>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-[#9db1e0] block">Decision Queue</span>
            <b className="text-sm font-bold text-white flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-sky-300" />
              <span>{pendingCount} Awaiting Review</span>
            </b>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-[#9db1e0] block">Match Acceptance</span>
            <b className="text-sm font-bold text-white flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-cyan-300" />
              <span>{matchRate}% High Signal</span>
            </b>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-[#9db1e0] block">Dual Confirmations</span>
            <b className="text-sm font-bold text-white flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-emerald-300" />
              <span>100% Completed</span>
            </b>
          </div>
        </div>
      </div>

      {message && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{message}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-xs font-semibold underline">
            Dismiss
          </button>
        </div>
      )}

      {/* 4 Interactive Metric Cards */}
      <div className="metrics mb-7">
        {/* Metric 1: Total Requests */}
        <article className="metric group hover:border-purple-400 transition-all">
          <span className="violet">
            <Inbox className="h-5 w-5" />
          </span>
          <div className="flex-1 min-w-0">
            <small className="font-semibold text-slate-500">Student Requests</small>
            <b className="text-xl sm:text-2xl font-heading text-[#15213b]">{totalRequests}</b>
            <div className="flex items-center gap-1 text-[10.5px] text-amber-700 font-semibold mt-1">
              <Clock className="h-3 w-3" />
              <span>{pendingCount} pending decision</span>
            </div>
          </div>
        </article>

        {/* Metric 2: Match Acceptance Rate */}
        <article className="metric group hover:border-[#3563ff] transition-all">
          <span className="blue">
            <Check className="h-5 w-5" />
          </span>
          <div className="flex-1 min-w-0">
            <small className="font-semibold text-slate-500">Match Acceptance Rate</small>
            <b className="text-xl sm:text-2xl font-heading text-[#15213b]">{matchRate}%</b>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden my-1">
              <div
                className="h-full bg-gradient-to-r from-[#3563ff] to-[#00d2ff] rounded-full"
                style={{ width: `${matchRate}%` }}
              />
            </div>
            <em className="text-[10.5px] text-slate-500">Accepted / total offers</em>
          </div>
        </article>

        {/* Metric 3: Active Goals */}
        <article className="metric group hover:border-cyan-400 transition-all">
          <span className="cyan">
            <Target className="h-5 w-5" />
          </span>
          <div>
            <small className="font-semibold text-slate-500">Active Mentee Rooms</small>
            <b className="text-xl sm:text-2xl font-heading text-[#15213b]">{activeGoalsCount}</b>
            <div className="flex items-center gap-1 text-[10.5px] text-cyan-800 font-semibold mt-1">
              <Users className="h-3 w-3" />
              <span>In-progress milestone</span>
            </div>
          </div>
        </article>

        {/* Metric 4: Goals Fulfilled */}
        <article className="metric group hover:border-emerald-400 transition-all">
          <span className="green">
            <BarChart3 className="h-5 w-5" />
          </span>
          <div>
            <small className="font-semibold text-slate-500">Goals Fulfilled</small>
            <b className="text-xl sm:text-2xl font-heading text-[#15213b]">{fulfilledCount}</b>
            <div className="flex items-center gap-1 text-[10.5px] text-emerald-700 font-semibold mt-1">
              <Award className="h-3 w-3" />
              <span>100% Dual Confirmed</span>
            </div>
          </div>
        </article>
      </div>

      {/* Interactive Tabs Navigator */}
      <div className="flex items-center gap-2 p-1.5 bg-[#f0f3fa] rounded-2xl max-w-xl mb-6 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("triage")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === "triage"
              ? "bg-white text-[#15213b] shadow-sm font-extrabold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Inbox className="h-3.5 w-3.5 text-[#3563ff]" />
          <span>Triage Queue ({pendingCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("impact")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === "impact"
              ? "bg-white text-[#15213b] shadow-sm font-extrabold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-purple-600" />
          <span>Impact &amp; Tier</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("rooms")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === "rooms"
              ? "bg-white text-[#15213b] shadow-sm font-extrabold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Target className="h-3.5 w-3.5 text-emerald-600" />
          <span>Active Rooms ({activeGoalsCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("analytics")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === "analytics"
              ? "bg-white text-[#15213b] shadow-sm font-extrabold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Award className="h-3.5 w-3.5 text-amber-500" />
          <span>Signal Score</span>
        </button>
      </div>

      {/* TAB CONTENT 1: TRIAGE QUEUE */}
      {activeTab === "triage" && (
        <section className="mb-7 animate-fade-in-up">
          <AlumniRequestTriage
            initialRequests={requests}
            onActionComplete={() => fetchData()}
          />
        </section>
      )}

      {/* TAB CONTENT 2: IMPACT & TIER */}
      {activeTab === "impact" && (
        <section className="mb-7 animate-fade-in-up">
          <MentorImpactCard
            distinctMentees={distinctMentees}
            monthlyLimit={monthlyLimit}
            utilizedSlots={utilizedSlots}
            onCapacityChange={(newLimit) => {
              setMessage(`Monthly limit set to ${newLimit} reviews.`);
              fetchData();
            }}
          />
        </section>
      )}

      {/* TAB CONTENT 3: ACTIVE COLLABORATION ROOMS */}
      {activeTab === "rooms" && (
        <section className="mb-7 animate-fade-in-up">
          <div className="p-6 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="badge success text-xs font-bold inline-flex items-center gap-1 text-emerald-800 bg-emerald-50">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Dual Confirmed Outcome</span>
                </span>
                <h3 className="text-base font-bold text-[#15213b] font-heading mt-1">
                  Prepare for Associate Product Manager Case Interviews
                </h3>
                <p className="text-xs text-[#66758e]">
                  Mentee: Nikki Kumar (3rd Year Undergrad · Ready for Mentorship Match)
                </p>
              </div>
              <Link href="/goals/77777777-7777-7777-7777-777777777701">
                <Button variant="secondary" size="sm" className="text-xs gap-1 font-semibold">
                  <span>Enter Room</span>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </Link>
            </div>

            {/* Checklist of Dual Confirmation */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Student Milestone Confirmation:</span>
                <span className="text-emerald-800 font-bold flex items-center gap-1">
                  <Check className="h-3.5 w-3.5 text-emerald-600" /> Confirmed (Oct 14)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Alumnus Confirmation:</span>
                <span className="text-emerald-800 font-bold flex items-center gap-1">
                  <Check className="h-3.5 w-3.5 text-emerald-600" /> Confirmed (Oct 14)
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs">
              <span className="text-emerald-900 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Impact Points Released: +25 Platform Impact Score</span>
              </span>
              <Link href="/goals/77777777-7777-7777-7777-777777777701">
                <button className="text-xs font-bold text-[#3563ff] hover:underline">
                  View Goal Transcript &rarr;
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* TAB CONTENT 4: SIGNAL SCORE & TESTIMONIALS */}
      {activeTab === "analytics" && (
        <section className="mb-7 animate-fade-in-up grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="panel p-5 bg-white border border-[#e2e8f0] rounded-2xl shadow-xs space-y-3">
            <span className="badge soft text-xs font-bold inline-flex items-center gap-1.5 text-[#3563ff] bg-[#edf2fe]">
              <Award className="h-3 w-3" />
              <span>Platform Signal Score</span>
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-[#15213b] font-heading">94</span>
              <span className="text-xs font-semibold text-slate-500">/ 100 Signal Index</span>
            </div>
            <p className="text-xs text-[#66758e] leading-relaxed">
              Based on 100% mutual confirmation completion, responsive turnaround (&lt; 18h median), and zero dropped threads.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700">
              <span>Turnaround Speed:</span>
              <b className="text-emerald-700">&lt; 18 hours median</b>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span>Dual Confirmation:</span>
              <b className="text-[#3563ff]">100% Rate</b>
            </div>
          </div>

          <div className="panel p-5 bg-gradient-to-br from-[#ffffff] to-[#f8faff] border border-[#dce5fb] rounded-2xl shadow-xs space-y-3">
            <span className="badge soft text-xs font-bold inline-flex items-center gap-1.5 text-purple-700 bg-purple-50">
              <Star className="h-3 w-3 text-amber-500 fill-amber-400" />
              <span>Verified Student Testimonial</span>
            </span>
            <p className="text-xs text-slate-800 italic leading-relaxed pt-1">
              &ldquo;The mock interview was incredibly realistic. Priya gave me line-by-line feedback on my product design teardown that helped me clear first round interviews at Stripe.&rdquo;
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Avatar initials="NK" tone="violet" size="sm" />
                <div>
                  <b className="text-slate-900 block text-xs">Nikki Kumar</b>
                  <small className="text-slate-500 text-[10px]">3rd Year Undergrad · CS</small>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-600">5.0 ★ Rating</span>
            </div>
          </div>
        </section>
      )}
    </PortalShell>
  );
}
