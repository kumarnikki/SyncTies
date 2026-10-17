"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Target, Plus, Sparkles, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Intent } from "@/types/database";

export default function StudentIntentsPage() {
  const [intents, setIntents] = useState<Intent[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/intents")
      .then((r) => r.json())
      .then((d) => {
        if (d?.intents) setIntents(d.intents);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? intents : intents.filter((i) => i.status === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            My Goals & Intents
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Structured goals are evaluated by the SQL engine to find eligible alumni mentors.
          </p>
        </div>
        <Link href="/student/intents/new">
          <Button variant="primary" className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Create New Intent</span>
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {["all", "open", "in_progress", "fulfilled", "closed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors ${
              filter === f
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {f.replace("_", " ")}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-slate-500">Loading your intents...</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No intents found"
          description="Create a structured intent with your target role and domains to start matching with alumni."
          actionLabel="Create New Intent"
          actionHref="/student/intents/new"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((intent) => (
            <Card key={intent.id} className="flex flex-col justify-between shadow-xs hover:border-blue-300 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant={intent.status === "open" ? "default" : "secondary"}>
                    {intent.status}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    {new Date(intent.created_at).toLocaleDateString()}
                  </span>
                </div>
                <CardTitle className="text-base text-slate-900 mt-2 leading-snug">
                  {intent.title}
                </CardTitle>
                <p className="text-xs text-blue-600 font-medium">
                  {intent.help_type?.name || "Mock Interview"}
                </p>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {intent.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {intent.domains?.map((d) => (
                    <span
                      key={d.id}
                      className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                    >
                      {d.name}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <Link href={`/student/matches?intentId=${intent.id}`} className="w-full block">
                    <Button variant="primary" size="sm" className="w-full gap-1.5 text-xs">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Browse Ranked Matches</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
