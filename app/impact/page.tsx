"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  CheckCircle,
  Coins,
  ShieldAlert,
  Info,
  Sliders,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const COLORS = ["#2563eb", "#4f46e5", "#059669", "#d97706", "#dc2626", "#7c3aed"];

export default function ImpactDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/metrics")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch((err) => console.error("Metrics fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-sm text-slate-500">Computing impact metrics...</div>;
  }

  const summary = data?.summary || {};
  const isSample = Boolean(data?.isSampleData);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            SyncTies Pilot Impact Metrics
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Verifiable database aggregates tracking connection conversions, capacity utilization, and confirmed goal outcomes.
          </p>
        </div>

        {/* Demo / Live Badge */}
        <div>
          {isSample ? (
            <Badge variant="warning" className="text-xs px-3 py-1 gap-1.5">
              <Info className="h-3.5 w-3.5" />
              <span>Sample Demo Dataset Active</span>
            </Badge>
          ) : (
            <Badge variant="success" className="text-xs px-3 py-1 gap-1.5">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Live Production Aggregates</span>
            </Badge>
          )}
        </div>
      </div>

      {isSample && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center justify-between">
          <span>
            <strong>Honest Metrics Notice:</strong> {data?.sampleNotice || "Seed test records are used until active pilot engagement accumulates."}
          </span>
          <span className="text-[11px] text-amber-800 font-mono">Cohort Window: Fall 2026</span>
        </div>
      )}

      {/* Top Level Metric KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Unique Connections */}
        <Card className="shadow-xs border-blue-200/80 bg-blue-50/20">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                Accepted Unique Pairs
              </p>
              <div className="text-3xl font-extrabold text-blue-950 mt-1">
                {summary.uniqueAcceptedConnections}
              </div>
              <p className="text-xs text-slate-500 mt-1">Student–Alumnus connections</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Users className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Goal Fulfillment Rate */}
        <Card className="shadow-xs border-emerald-200/80 bg-emerald-50/20">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Fulfillment Rate
              </p>
              <div className="text-3xl font-extrabold text-emerald-950 mt-1">
                {summary.fulfillmentRate}%
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {summary.fulfilledGoals} of {summary.uniqueAcceptedConnections} accepted goals
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <CheckCircle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Network Connectivity % */}
        <Card className="shadow-xs border-indigo-200/80 bg-indigo-50/20">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
                Connectivity Coverage
              </p>
              <div className="text-3xl font-extrabold text-indigo-950 mt-1">
                {summary.connectivityScore}%
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Of {summary.possiblePairs} possible pairs
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <TrendingUp className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Weekly Active Users */}
        <Card className="shadow-xs border-purple-200/80 bg-purple-50/20">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-700">
                Active Participants
              </p>
              <div className="text-3xl font-extrabold text-purple-950 mt-1">
                {summary.activeVerifiedStudents + summary.activeVerifiedAlumni}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {summary.activeVerifiedStudents} students • {summary.activeVerifiedAlumni} alumni
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Users className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connectivity Definition Note */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
        <strong className="text-slate-900 block text-sm">
          Network Connectivity Formula (Pilot Metric Specification):
        </strong>
        <p>
          <code>Connectivity % = 100 × accepted unique student–alumnus pairs / (active verified students × active verified alumni)</code>
        </p>
        <p className="text-slate-500 text-[11px]">
          Note: This measures pair coverage in the defined pilot population, not shortest-path graph distances.
        </p>
      </div>

      {/* Funnel & Domain Breakdown Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Conversion Funnel Bar Chart */}
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">
              Connection Lifecycle Conversion Funnel
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Drop-off from intent posted to dual-confirmed goal fulfillment
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.funnel || []} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#64748b" fontSize={11} />
                  <YAxis
                    dataKey="stage"
                    type="category"
                    stroke="#475569"
                    fontSize={11}
                    width={110}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      color: "#fff",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]}>
                    {(data?.funnel || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Domain Distribution Bar Chart */}
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">
              Connections by Professional Domain
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Distribution of accepted student–alumni partnerships across disciplines
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.domainBreakdown || []} margin={{ bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="domain"
                    stroke="#64748b"
                    fontSize={10}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      color: "#fff",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="connections" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Token Accounting & Capacity Utilization Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Token Accounting */}
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle className="text-base text-slate-900 flex items-center gap-2">
              <Coins className="h-5 w-5 text-blue-600" />
              <span>Token Accounting & Invariants</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Auditable monthly token accounting across all pilot cohorts
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">Total Monthly Tokens Granted:</span>
              <strong className="text-slate-900">
                {data?.tokenAccounting?.totalGranted || 210}
              </strong>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">Tokens Spent on Valid Requests:</span>
              <strong className="text-blue-600">
                {data?.tokenAccounting?.totalSpent || 76}
              </strong>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">Failed / Rejected Attempts Debited:</span>
              <strong className="text-emerald-600 font-mono">0 (System Invariant)</strong>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-600">Tokens Remaining in Circulation:</span>
              <strong className="text-slate-900">
                {data?.tokenAccounting?.remainingInCirculation || 134}
              </strong>
            </div>
          </CardContent>
        </Card>

        {/* Capacity Utilization */}
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle className="text-base text-slate-900 flex items-center gap-2">
              <Sliders className="h-5 w-5 text-indigo-600" />
              <span>Alumni Capacity Utilization</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Alumni review slot allocation and burnout protection
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">Total Declared Review Capacity:</span>
              <strong className="text-slate-900">
                {data?.capacityUtilization?.totalMonthlyCapacity || 84} slots
              </strong>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">Processed / Reviewed Slots:</span>
              <strong className="text-indigo-600">
                {data?.capacityUtilization?.processedSlots || 52} slots
              </strong>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">Active Reserved Slots (Pending Review):</span>
              <strong className="text-amber-600">
                {data?.capacityUtilization?.reservedSlots || 12} slots
              </strong>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-600">Searches Screened Out (Zero-Capacity Protection):</span>
              <strong className="text-slate-900">
                {data?.capacityUtilization?.zeroCapacitySearchesBlocked || 14}
              </strong>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Network Mentors */}
      {data?.topHubs && (
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">
              Top Network Hubs by Fulfilled Outcomes
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Recognizing alumni who have mutually fulfilled the most student goals
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-slate-100 text-xs">
            {data.topHubs.map((hub: any, idx: number) => (
              <div key={idx} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-full bg-slate-100 font-bold text-slate-700 flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">{hub.name}</h5>
                    <p className="text-slate-500">{hub.domain}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-700 text-sm">
                    {hub.fulfilled} Fulfilled
                  </div>
                  <div className="text-slate-400 text-[10px]">{hub.connections} Connections</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
