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
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RequestStatusBadge, GoalStatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Intent, ConnectionRequest, Goal, TokenSummary } from "@/types/database";

export default function StudentDashboardPage() {
  const [tokens, setTokens] = useState<TokenSummary | null>(null);
  const [intents, setIntents] = useState<Intent[]>([]);
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/tokens/balance").then((r) => r.json()),
      fetch("/api/intents").then((r) => r.json()),
      fetch("/api/connection-requests?role=student").then((r) => r.json()),
    ])
      .then(([tokensData, intentsData, reqData]) => {
        if (tokensData) setTokens(tokensData);
        if (intentsData?.intents) setIntents(intentsData.intents);
        if (reqData?.requests) {
          setRequests(reqData.requests);
          // extract goals
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Student Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your goals, monthly outreach tokens, and verified alumni matches.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/student/intents/new">
            <Button variant="primary" className="gap-2 shadow-xs">
              <Plus className="h-4 w-4" />
              <span>New Intent / Goal</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Monthly Tokens */}
        <Card className="border-blue-200/80 bg-blue-50/20 shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                Monthly Tokens Left
              </p>
              <div className="text-3xl font-extrabold text-blue-950 mt-1">
                {tokens?.tokens_remaining ?? 4}{" "}
                <span className="text-sm font-normal text-slate-500">
                  / {tokens?.tokens_granted ?? 5}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">1 token per connection request</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Coins className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Active Open Intents */}
        <Card className="shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Active Intents
              </p>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">
                {openIntents.length}
              </div>
              <p className="text-xs text-slate-500 mt-1">Ready for SQL matching</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card className="shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Pending Requests
              </p>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">
                {pendingRequests.length}
              </div>
              <p className="text-xs text-slate-500 mt-1">Under alumni review</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Goals Progress */}
        <Card className="shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Fulfilled Goals
              </p>
              <div className="text-3xl font-extrabold text-emerald-600 mt-1">
                1
              </div>
              <p className="text-xs text-slate-500 mt-1">Dual-confirmed completion</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Intents & Match Finding */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Your Goals & Intents</span>
          </h2>
          <Link href="/student/intents" className="text-xs font-medium text-blue-600 hover:underline">
            View All Intents
          </Link>
        </div>

        {intents.length === 0 ? (
          <EmptyState
            icon={Target}
            title="No intents posted yet"
            description="Create your first structured intent to receive SQL-ranked alumni recommendations."
            actionLabel="Create First Intent"
            actionHref="/student/intents/new"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {intents.map((intent) => (
              <Card key={intent.id} className="shadow-xs hover:border-blue-300 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base text-slate-900 leading-snug">
                        {intent.title}
                      </CardTitle>
                      <p className="text-xs text-blue-600 font-medium mt-1">
                        Help Type: {intent.help_type?.name || "Mock Interview"}
                      </p>
                    </div>
                    <Badge variant={intent.status === "open" ? "default" : "secondary"}>
                      {intent.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {intent.description}
                  </p>

                  {/* Domain Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {intent.domains?.map((d) => (
                      <span
                        key={d.id}
                        className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                      >
                        {d.name}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Posted {new Date(intent.created_at).toLocaleDateString()}
                    </span>
                    <Link href={`/student/matches?intentId=${intent.id}`}>
                      <Button variant="primary" size="sm" className="gap-1.5 text-xs">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Find Ranked Matches</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Outgoing Requests & Goals Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Requests */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>Recent Outreach Requests</span>
            </h2>
            <Link href="/student/requests" className="text-xs font-medium text-blue-600 hover:underline">
              View All ({requests.length})
            </Link>
          </div>

          <Card className="shadow-xs">
            <CardContent className="p-0 divide-y divide-slate-100">
              {requests.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500">
                  No requests sent yet. Browse matches for your active intents.
                </div>
              ) : (
                requests.slice(0, 4).map((req) => (
                  <div key={req.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">
                          {req.alumnus?.full_name || "Priya Sharma"}
                        </span>
                        {req.repeat_contact_in_month && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium">
                            Repeat Contact
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        Goal: {req.intent?.title || "APM Mock Interview"}
                      </p>
                      {req.alumni_response_note && (
                        <p className="text-xs text-emerald-700 bg-emerald-50 p-1.5 rounded mt-1 border border-emerald-100">
                          &quot;{req.alumni_response_note}&quot;
                        </p>
                      )}
                    </div>
                    <RequestStatusBadge status={req.status} />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Active Collaboration Goal */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <span>Goal Progress & Dual Confirmation</span>
            </h2>
            <Link
              href="/goals/77777777-7777-7777-7777-777777777701"
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              Goal Room
            </Link>
          </div>

          <Card className="shadow-xs border-emerald-200/80 bg-emerald-50/10">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base text-slate-900">
                    Prepare for Associate Product Manager Case Interviews
                  </CardTitle>
                  <p className="text-xs text-slate-500 mt-1">
                    Partner: Priya Sharma (Senior PM @ Stripe)
                  </p>
                </div>
                <GoalStatusBadge status="fulfilled" />
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="p-3 bg-white rounded-lg border border-slate-200/80 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Student Confirmation:</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" /> Confirmed Oct 14
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Alumnus Confirmation:</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" /> Confirmed Oct 14
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-emerald-800 font-medium">
                  Mutually confirmed outcome recorded
                </span>
                <Link href="/goals/77777777-7777-7777-7777-777777777701">
                  <Button size="sm" variant="outline" className="text-xs gap-1">
                    <span>View Goal Room & Feedback</span>
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
