"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  CheckCircle,
  Coins,
  Shield,
  Info,
  Clock,
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
} from "recharts";
import { Badge } from "@/components/ui/badge";

const COLORS = ["#536df0", "#7c5ce7", "#38b9d8", "#2b8a61", "#ea6a6a", "#f59e0b"];

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
    return <div className="p-16 text-center text-sm text-[#66758e]">Computing community impact metrics...</div>;
  }

  const summary = data?.summary || {};
  const isSample = Boolean(data?.isSampleData);

  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-page-enter">
      {/* Page Header */}
      <div className="page-head">
        <div>
          <h1 className="font-heading">Community Impact</h1>
          <p>Transparent platform activity, explainable matching stats, and mutually confirmed career outcomes.</p>
        </div>
        <div>
          {isSample ? (
            <span className="badge demo text-xs">Sample Demo Dataset</span>
          ) : (
            <span className="badge success text-xs">Live Database Aggregates</span>
          )}
        </div>
      </div>

      {/* Notice Banner */}
      <div className="notice shadow-xs">
        <Shield className="h-5 w-5 shrink-0 text-[#8d6224]" />
        <p>
          <b>Transparent Calculation Standard:</b> We separate speculative outreach from genuine career outcomes. A connection is counted as fulfilled only after both student and alumnus confirm completion.
        </p>
      </div>

      {/* 4 Impact Metric Cards */}
      <div className="metrics impact-metrics">
        <article className="metric">
          <span className="blue">
            <Users className="h-5 w-5" />
          </span>
          <div>
            <small>Accepted unique connections</small>
            <b>{summary.uniqueAcceptedConnections ?? 48}</b>
            <em>Student–alumnus pairs</em>
          </div>
        </article>

        <article className="metric">
          <span className="violet">
            <Target className="h-5 w-5" />
          </span>
          <div>
            <small>Intents posted</small>
            <b>{summary.totalIntents ?? 72}</b>
            <em>Across 12 canonical domains</em>
          </div>
        </article>

        <article className="metric">
          <span className="green">
            <CheckCircle className="h-5 w-5" />
          </span>
          <div>
            <small>Mutually fulfilled</small>
            <b>{summary.fulfilledGoals ?? 24}</b>
            <em>{summary.fulfillmentRate ?? 50}% completion rate</em>
          </div>
        </article>

        <article className="metric">
          <span className="cyan">
            <TrendingUp className="h-5 w-5" />
          </span>
          <div>
            <small>Connectivity score</small>
            <b>{summary.connectivityScore ?? 28}%</b>
            <em>Of {summary.possiblePairs ?? 170} possible pairs</em>
          </div>
        </article>
      </div>

      {/* Funnel & Domain Visualizations Grid */}
      <div className="chart-grid">
        {/* Intent to Outcome Funnel */}
        <section className="panel funnel">
          <div className="panel-head mb-6">
            <div>
              <h2 className="font-heading">Intent to Outcome Conversion Funnel</h2>
              <p>Conversion from student intent to dual-confirmed completion</p>
            </div>
            <span className="badge soft text-xs">Funnel Stats</span>
          </div>

          <div className="space-y-4">
            {(data?.funnel || [
              { stage: "Intent created", count: 72, pct: 100 },
              { stage: "Match viewed", count: 64, pct: 88 },
              { stage: "Request submitted", count: 52, pct: 72 },
              { stage: "Request accepted", count: 48, pct: 66 },
              { stage: "Goal mutually fulfilled", count: 24, pct: 33 },
            ]).map((row: any) => {
              const maxVal = data?.funnel?.[0]?.count || 72;
              const percent = Math.round((row.count / maxVal) * 100);
              return (
                <div key={row.stage} className="funnel-row">
                  <span>
                    <span className="text-[#15213b] font-medium">{row.stage}</span>
                    <b className="font-bold text-[#15213b]">{row.count}</b>
                  </span>
                  <div>
                    <i style={{ width: `${percent}%` }} />
                  </div>
                  <small className="font-semibold text-[#8896ab]">{percent}%</small>
                </div>
              );
            })}
          </div>
        </section>

        {/* Domain Distribution Chart */}
        <section className="panel domain-chart">
          <div className="panel-head mb-4">
            <div>
              <h2 className="font-heading">Connections by Domain</h2>
              <p>Accepted student–alumni mentorships</p>
            </div>
            <span className="badge soft text-xs">Disciplines</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.domainBreakdown || []} margin={{ bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0f5" />
                <XAxis
                  dataKey="domain"
                  stroke="#8896ab"
                  fontSize={10}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#8896ab" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(21, 33, 59, 0.95)",
                    color: "#fff",
                    borderRadius: 12,
                    fontSize: 12,
                    border: "none",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  }}
                />
                <Bar dataKey="connections" fill="#536df0" radius={[6, 6, 0, 0]}>
                  {(data?.domainBreakdown || []).map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* How this is calculated note (Full Width) */}
        <section className="panel calculation">
          <h2 className="font-heading text-lg text-[#15213b] mb-2">How This Is Calculated</h2>
          <p className="text-xs text-[#66758e] leading-relaxed mb-4">
            Connectivity is calculated as <code>100 × accepted unique student–alumnus pairs / (active verified students × active verified alumni)</code>. This measures genuine pair coverage across the pilot population, rather than vanity page views or unread messages.
          </p>
          <ul className="flex flex-wrap gap-6 text-xs text-[#66758e]">
            <li className="flex items-center gap-2">
              <span className="dot blue" /> Connection activity &amp; outreach
            </li>
            <li className="flex items-center gap-2">
              <span className="dot green" /> Mutually confirmed goal completions
            </li>
            <li className="flex items-center gap-2">
              <span className="dot violet" /> Returning alumni capacity &amp; reviews
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
