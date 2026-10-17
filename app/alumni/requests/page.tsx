"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, CheckCircle, AlertTriangle, Users, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RequestStatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ConnectionRequest } from "@/types/database";

export default function AlumniRequestsPage() {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [responseNotes, setResponseNotes] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchRequests = () => {
    fetch("/api/connection-requests?role=alum")
      .then((r) => r.json())
      .then((d) => {
        if (d?.requests) setRequests(d.requests);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (
    requestId: string,
    action: "accept" | "decline" | "defer" | "ignore"
  ) => {
    setActionLoading(requestId);
    setMessage(null);

    try {
      const res = await fetch(`/api/connection-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          response_note: responseNotes[requestId] || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Action failed");
      }

      setMessage(`Request marked as ${action}ed.`);
      fetchRequests();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Incoming Connection Requests
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review student asks within your monthly capacity. Accepted requests transition to active collaborative goals.
        </p>
      </div>

      {message && <Alert variant="success">{message}</Alert>}

      {loading ? (
        <div className="p-8 text-center text-sm text-slate-500">Loading incoming requests...</div>
      ) : requests.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No incoming requests"
          description="Your review queue is currently clear. When students find your offers via SQL matching, requests appear here."
          actionLabel="View Dashboard"
          actionHref="/alumni/dashboard"
        />
      ) : (
        <div className="space-y-6">
          {requests.map((req) => (
            <Card key={req.id} className="shadow-xs border-slate-200">
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-lg">
                        {req.student?.full_name || "Student Requester"}
                      </h3>
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        Year {req.student?.study_year || 4} Undergraduate
                      </span>
                      <RequestStatusBadge status={req.status} />
                      {req.repeat_contact_in_month && (
                        <span className="text-xs bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Repeat Contact in Month
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Target Goal: <strong>{req.intent?.title || "Career Advice"}</strong>
                    </p>
                  </div>

                  <span className="text-xs text-slate-400">
                    Received {new Date(req.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Student message */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-800 space-y-1">
                  <span className="font-semibold text-slate-700 block">Student Message:</span>
                  <p className="italic leading-relaxed">&quot;{req.student_message}&quot;</p>
                </div>

                {req.repeat_contact_in_month && req.repeat_reason && (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
                    <strong>Repeat outreach justification:</strong> &quot;{req.repeat_reason}&quot;
                  </div>
                )}

                {/* If pending, show review note & action buttons */}
                {req.status === "pending" && (
                  <div className="pt-2 border-t border-slate-100 space-y-3">
                    <Input
                      placeholder="Optional response note to the student (e.g. Let's schedule 30 mins this Thursday)"
                      value={responseNotes[req.id] || ""}
                      onChange={(e) =>
                        setResponseNotes({ ...responseNotes, [req.id]: e.target.value })
                      }
                      className="text-xs"
                    />

                    <div className="flex flex-wrap items-center justify-end gap-2">
                      {req.repeat_contact_in_month && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAction(req.id, "ignore")}
                          isLoading={actionLoading === req.id}
                          className="text-xs text-slate-400 hover:text-slate-700"
                        >
                          Ignore Repeat
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAction(req.id, "decline")}
                        isLoading={actionLoading === req.id}
                        className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      >
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction(req.id, "defer")}
                        isLoading={actionLoading === req.id}
                        className="text-xs"
                      >
                        Defer (Next Week)
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleAction(req.id, "accept")}
                        isLoading={actionLoading === req.id}
                        className="text-xs"
                      >
                        Accept & Open Goal Room
                      </Button>
                    </div>
                  </div>
                )}

                {req.status === "accepted" && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-emerald-800 font-medium">
                      Accepted. Active collaborative goal established.
                    </span>
                    <Link href="/goals/77777777-7777-7777-7777-777777777701">
                      <Button size="sm" variant="outline" className="text-xs gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Go to Goal Collaboration Room</span>
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
