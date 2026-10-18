"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Coins,
  Target,
  Users,
  CheckCircle,
  Clock,
  ArrowRight,
  Plus,
  Sparkles,
  ExternalLink,
  Shield,
  Zap,
  Inbox,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Compass,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RequestStatusBadge, GoalStatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Avatar } from "@/components/ui/avatar";
import { PortalShell } from "@/components/layout/portal-shell";
import { Intent, ConnectionRequest, Goal, TokenSummary } from "@/types/database";
import { getStudyYearLabel } from "@/lib/students/study-year";
import { IntentTemplatePicker } from "@/components/dashboard/intent-template-picker";
import { StudentMatchSpotlight } from "@/components/dashboard/student-match-spotlight";

export default function StudentDashboardPage() {
  const [tokens, setTokens] = useState<TokenSummary | null>(null);
  const [intents, setIntents] = useState<Intent[]>([]);
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [profile, setProfile] = useState<{
    study_year?: number | null;
    full_name?: string;
    institution?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"matches" | "intents" | "starters" | "rooms">("matches");

  useEffect(() => {
    Promise.all([
      fetch("/api/tokens/balance").then((r) => r.json()),
      fetch("/api/intents").then((r) => r.json()),
      fetch("/api/connection-requests?role=student").then((r) => r.json()),
      fetch("/api/profile").then((r) => r.json()),
    ])
      .then(([tokensData, intentsData, reqData, profileData]) => {
        if (tokensData) setTokens(tokensData);
        if (intentsData?.intents) setIntents(intentsData.intents);
        if (profileData?.profile) setProfile(profileData.profile);
        if (reqData?.requests) {
          setRequests(reqData.requests);
          const acceptedWithGoals = reqData.requests
            .filter((r: any) => r.status === "accepted")
            .map((r: any) => ({
              id: "77777777-7777-7777-7777-777777777701",
              request_id: r.id,
              title: r.intent?.title || "Mentoring Goal",
              status: "in_progress",
              alumnus: r.alumnus,
              student: r.student,
            }));
          setGoals(acceptedWithGoals);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const openIntents = intents.filter((i) => i.status === "open");
  const pendingRequests = requests.filter((r) => r.status === "pending");
  const studentName = profile?.full_name || "Nikki Kumar";
  const firstName = studentName.split(" ")[0];
  const tokensRemaining = tokens?.tokens_remaining ?? 4;
  const tokensGranted = tokens?.tokens_granted ?? 5;
  const tokenPercent = Math.round((tokensRemaining / tokensGranted) * 100);

  return (
    <PortalShell>
      {/* Dynamic Student Greeting & Quick-Action Command Bar */}
      <div className="mb-6 p-6 rounded-3xl bg-gradient-to-br from-[#15213b] via-[#1b2b4e] to-[#24396b] text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-[#3563ff]/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-radial from-[#00d2ff]/15 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="badge dark text-xs inline-flex items-center gap-1.5 py-1 px-3">
                <Sparkles className="h-3 w-3 text-cyan-300" />
                <span>Student Career Command</span>
              </span>
              {profile?.study_year ? (
                <span className="text-[11px] font-bold text-cyan-200 bg-cyan-950/60 border border-cyan-800/50 px-2.5 py-0.5 rounded-full">
                  {getStudyYearLabel(profile.study_year)}
                </span>
              ) : (
                <span className="text-[11px] font-bold text-cyan-200 bg-cyan-950/60 border border-cyan-800/50 px-2.5 py-0.5 rounded-full">
                  3rd Year Undergrad
                </span>
              )}
              <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/50 border border-emerald-800/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Shield className="h-3 w-3 text-emerald-400" />
                <span>Verified Network</span>
              </span>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {firstName}!
            </h1>
            <p className="text-xs sm:text-sm text-[#b9c6e6] mt-1.5 max-w-xl leading-relaxed">
              Every connection on SyncTies starts with a concrete milestone. Find alumni with verified domain fit, open capacity, and zero unsolicited spam.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link href="/student/intents/new">
              <Button
                variant="primary"
                className="gap-2 h-10 px-4 text-xs font-bold shadow-md bg-[#3563ff] hover:bg-[#2850df]"
              >
                <Plus className="h-4 w-4" />
                <span>Set a Goal / Intent</span>
              </Button>
            </Link>
            <Link href="/student/matches">
              <Button
                variant="outline"
                className="gap-2 h-10 px-3.5 text-xs font-bold bg-white/10 hover:bg-white/20 border-white/20 text-white"
              >
                <Compass className="h-4 w-4 text-cyan-300" />
                <span>Ranked Mentors</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick status counters inside hero */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10 text-xs">
          <div className="space-y-0.5">
            <span className="text-[11px] text-[#9db1e0] block">Token Escrow</span>
            <b className="text-sm font-bold text-white flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-amber-300" />
              <span>{tokensRemaining} / {tokensGranted} Available</span>
            </b>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-[#9db1e0] block">Algorithm Matches</span>
            <b className="text-sm font-bold text-white flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              <span>96% Top Fit Score</span>
            </b>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-[#9db1e0] block">Awaiting Decision</span>
            <b className="text-sm font-bold text-white flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-sky-300" />
              <span>{pendingRequests.length} Outreach Request</span>
            </b>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-[#9db1e0] block">Verified Confirmation</span>
            <b className="text-sm font-bold text-white flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-emerald-300" />
              <span>100% Dual Completion</span>
            </b>
          </div>
        </div>
      </div>

      {/* 4 Interactive Metric Cards with Progress Visualizers */}
      <div className="metrics mb-7">
        {/* Metric 1: Tokens Remaining */}
        <article className="metric group hover:border-[#3563ff] transition-all">
          <span className="blue">
            <Zap className="h-5 w-5" />
          </span>
          <div className="flex-1 min-w-0">
            <small className="font-semibold text-slate-500">Monthly Outreach Tokens</small>
            <b className="text-xl sm:text-2xl font-heading text-[#15213b]">
              {tokensRemaining}{" "}
              <em className="text-xs font-normal text-[#8896ab]">/ {tokensGranted} left</em>
            </b>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden my-1">
              <div
                className="h-full bg-gradient-to-r from-[#3563ff] to-[#00d2ff] rounded-full"
                style={{ width: `${tokenPercent}%` }}
              />
            </div>
            <em className="text-[10.5px] text-slate-500">1 token reserved per request</em>
          </div>
        </article>

        {/* Metric 2: Active Intents */}
        <article className="metric group hover:border-[#7c5ce7] transition-all">
          <span className="violet">
            <Target className="h-5 w-5" />
          </span>
          <div>
            <small className="font-semibold text-slate-500">Active Career Intents</small>
            <b className="text-xl sm:text-2xl font-heading text-[#15213b]">{openIntents.length || 1}</b>
            <div className="flex items-center gap-1 text-[10.5px] text-emerald-700 font-semibold mt-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>Active in matching index</span>
            </div>
          </div>
        </article>

        {/* Metric 3: Open Requests */}
        <article className="metric group hover:border-cyan-400 transition-all">
          <span className="cyan">
            <Clock className="h-5 w-5" />
          </span>
          <div>
            <small className="font-semibold text-slate-500">Outreach in Review</small>
            <b className="text-xl sm:text-2xl font-heading text-[#15213b]">{pendingRequests.length}</b>
            <em className="text-[10.5px] text-slate-500 flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>14-day auto-expiry guard</span>
            </em>
          </div>
        </article>

        {/* Metric 4: Goals Fulfilled */}
        <article className="metric group hover:border-emerald-400 transition-all">
          <span className="green">
            <CheckCircle className="h-5 w-5" />
          </span>
          <div>
            <small className="font-semibold text-slate-500">Milestones Fulfilled</small>
            <b className="text-xl sm:text-2xl font-heading text-[#15213b]">1</b>
            <em className="text-[10.5px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <Award className="h-3 w-3" />
              <span>100% Dual Confirmed</span>
            </em>
          </div>
        </article>
      </div>

      {/* Interactive Tabs Navigator */}
      <div className="flex items-center gap-2 p-1.5 bg-[#f0f3fa] rounded-2xl max-w-xl mb-6 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("matches")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === "matches"
              ? "bg-white text-[#15213b] shadow-sm font-extrabold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-[#3563ff]" />
          <span>Match Spotlight</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("intents")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === "intents"
              ? "bg-white text-[#15213b] shadow-sm font-extrabold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Target className="h-3.5 w-3.5 text-purple-600" />
          <span>Your Goals ({intents.length || 1})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("starters")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === "starters"
              ? "bg-white text-[#15213b] shadow-sm font-extrabold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Zap className="h-3.5 w-3.5 text-amber-500" />
          <span>1-Click Starters</span>
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
          <Award className="h-3.5 w-3.5 text-emerald-600" />
          <span>Goal Room (1)</span>
        </button>
      </div>

      {/* TAB CONTENT: 1. MATCH SPOTLIGHT */}
      {activeTab === "matches" && (
        <section className="mb-7 animate-fade-in-up">
          <StudentMatchSpotlight
            activeIntent={intents[0] || null}
            tokensRemaining={tokensRemaining}
          />
        </section>
      )}

      {/* TAB CONTENT: 2. 1-CLICK INTENT STARTERS */}
      {activeTab === "starters" && (
        <section className="mb-7 animate-fade-in-up">
          <IntentTemplatePicker />
        </section>
      )}

      {/* TAB CONTENT: 3. YOUR ACTIVE INTENTS */}
      {activeTab === "intents" && (
        <section className="space-y-4 mb-7 animate-fade-in-up">
          <div className="content-title">
            <div>
              <h2 className="font-heading text-lg font-bold text-[#15213b]">
                Your Active Career Intents &amp; Goals
              </h2>
              <p className="text-xs text-[#66758e]">
                Every connection starts with a specific, time-bounded outcome.
              </p>
            </div>
            <Link href="/student/intents">
              <button className="text-xs font-bold text-[#3563ff] flex items-center gap-1 hover:underline">
                View all intents <ArrowRight className="h-3 w-3" />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {intents.length === 0 ? (
              <EmptyState
                icon={Target}
                title="No intents posted yet"
                description="Create your first structured intent to receive SQL-ranked alumni recommendations."
                actionLabel="Create First Intent"
                actionHref="/student/intents/new"
              />
            ) : (
              intents.map((intent) => (
                <div
                  key={intent.id}
                  className="panel group hover:border-[#cfd8ff] transition-all flex flex-col justify-between p-5 rounded-2xl bg-white border border-[#e2e8f0] shadow-2xs hover:shadow-sm"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-sm font-bold text-[#15213b] leading-snug group-hover:text-[#3563ff] transition-colors">
                        {intent.title}
                      </h3>
                      <Badge variant={intent.status === "open" ? "default" : "secondary"}>
                        {intent.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#3563ff] font-semibold mb-2">
                      Format: {intent.help_type?.name || "Career Guidance"}
                    </p>
                    <p className="text-xs text-[#66758e] line-clamp-2 leading-relaxed mb-4">
                      {intent.description}
                    </p>

                    {/* Domain Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {intent.domains?.map((d) => (
                        <span
                          key={d.id}
                          className="text-[10px] bg-[#f0f3ff] text-[#4056c6] px-2 py-0.5 rounded-md font-medium"
                        >
                          {d.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#edf0f5] flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-[#8896ab]">
                      Posted {new Date(intent.created_at).toLocaleDateString()}
                    </span>
                    <Link href={`/student/matches?intentId=${intent.id}`}>
                      <Button variant="primary" size="sm" className="gap-1.5 text-xs shadow-xs h-8">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Find Ranked Matches</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* TAB CONTENT: 4. COLLABORATION ROOM SPOTLIGHT */}
      {activeTab === "rooms" && (
        <section className="mb-7 animate-fade-in-up">
          <div className="p-6 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="badge success text-xs font-bold inline-flex items-center gap-1 text-emerald-800 bg-emerald-50">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Dual Confirmed Milestone</span>
                </span>
                <h3 className="text-base font-bold text-[#15213b] font-heading mt-1">
                  Prepare for Associate Product Manager Case Interviews
                </h3>
                <p className="text-xs text-[#66758e]">
                  Partner Mentor: Priya Sharma (Senior Product Manager @ Stripe)
                </p>
              </div>
              <Link href="/goals/77777777-7777-7777-7777-777777777701">
                <Button variant="secondary" size="sm" className="text-xs gap-1 font-semibold">
                  <span>Enter Room</span>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </Link>
            </div>

            {/* 4-Step Milestone Progress Stepper */}
            <div className="py-2">
              <span className="text-[11px] font-bold text-slate-700 block mb-3">
                Milestone Execution Lifecycle:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-1">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                    <span>1. Intent Formulated</span>
                  </div>
                  <p className="text-[10.5px] text-emerald-800 leading-tight">
                    Structured ask with specific deliverables
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-1">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                    <span>2. Fit Verified</span>
                  </div>
                  <p className="text-[10.5px] text-emerald-800 leading-tight">
                    96% domain compatibility match
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-1">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                    <span>3. Prep Completed</span>
                  </div>
                  <p className="text-[10.5px] text-emerald-800 leading-tight">
                    45-min PM mock interview drill
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 ring-2 ring-emerald-400/30">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950 mb-1">
                    <Award className="h-3.5 w-3.5 text-emerald-700" />
                    <span>4. Mutually Confirmed</span>
                  </div>
                  <p className="text-[10.5px] text-emerald-900 font-medium leading-tight">
                    Both parties confirmed outcome
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-slate-700">
                <b>Confidential Rating Recorded:</b> 5.0 ★ · High Signal Feedback
              </span>
              <Link href="/goals/77777777-7777-7777-7777-777777777701">
                <button className="text-xs font-bold text-[#3563ff] hover:underline">
                  View Full Room Transcript &rarr;
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Outgoing Requests Stream */}
      <div className="space-y-4 mb-8">
        <div className="content-title">
          <div>
            <h2 className="font-heading text-lg font-bold text-[#15213b]">
              Recent Outreach Requests &amp; Status
            </h2>
            <p className="text-xs text-[#66758e]">
              Outreach requests use 1 token each and expire automatically if unreviewed after 14 days.
            </p>
          </div>
          <Link href="/student/requests">
            <button className="text-xs font-bold text-[#3563ff] flex items-center gap-1 hover:underline">
              View all requests ({requests.length}) <ArrowRight className="h-3 w-3" />
            </button>
          </Link>
        </div>

        <div className="panel p-0 divide-y divide-[#edf0f5] overflow-hidden rounded-2xl bg-white border border-[#e2e8f0]">
          {requests.length === 0 ? (
            <div className="p-10 flex flex-col items-center justify-center text-center bg-white">
              <div className="w-12 h-12 rounded-full bg-[#f0f4ff] text-[#3563ff] flex items-center justify-center mb-3">
                <Inbox className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-[#15213b] mb-1">
                No outreach requests sent yet
              </h3>
              <p className="text-xs text-[#66758e] max-w-sm mb-4 leading-relaxed">
                Once you send an outreach request to an alumnus, its review status, token reservation, and response notes will appear here.
              </p>
              <Link href="/student/matches">
                <Button variant="primary" size="sm" className="gap-2 text-xs shadow-xs">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Discover Ranked Mentors</span>
                </Button>
              </Link>
            </div>
          ) : (
            requests.slice(0, 4).map((req) => (
              <div
                key={req.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#fafbfe] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    initials={
                      req.alumnus?.full_name
                        ? req.alumnus.full_name.slice(0, 2).toUpperCase()
                        : "AL"
                    }
                    tone="violet"
                    size="md"
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-[#15213b]">
                        {req.alumnus?.full_name || "Priya Sharma"}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Senior PM @ Stripe
                      </span>
                      {req.repeat_contact_in_month && (
                        <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded font-medium">
                          Repeat Contact
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#66758e]">
                      Goal: <b>{req.intent?.title || "APM Mock Interview"}</b>
                    </p>
                    {req.alumni_response_note && (
                      <p className="text-xs text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 mt-1 font-medium">
                        Mentor Note: &ldquo;{req.alumni_response_note}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <RequestStatusBadge status={req.status} />
                  {req.status === "accepted" && (
                    <Link href="/goals/77777777-7777-7777-7777-777777777701">
                      <Button size="sm" variant="secondary" className="text-xs h-7 px-2.5 gap-1 font-semibold">
                        <span>Room</span>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PortalShell>
  );
}
