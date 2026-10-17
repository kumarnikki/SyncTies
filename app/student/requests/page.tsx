"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, CheckCircle, AlertTriangle, ExternalLink, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RequestStatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Alert } from "@/components/ui/alert";
import { ConnectionRequest } from "@/types/database";

export default function StudentRequestsPage() {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchRequests = () => {
    fetch("/api/connection-requests?role=student")
      .then((r) => r.json())
      .then((d) => {
        if (d?.requests) setRequests(d.requests);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleWithdraw = async (requestId: string) => {
    setActionLoading(requestId);
    setMessage(null);

    try {
      const res = await fetch(`/api/connection-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "withdraw" }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to withdraw request");
      }

      setMessage("Request successfully withdrawn.");
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
          My Connection Requests
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor your outgoing requests, alumni response notes, and status updates.
        </p>
      </div>

      {message && <Alert variant="success">{message}</Alert>}

      {loading ? (
        <div className="p-8 text-center text-sm text-slate-500">Loading requests...</div>
      ) : requests.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No requests sent yet"
          description="Browse ranked alumni matches from your open intents to send your first connection request."
          actionLabel="View Dashboard"
          actionHref="/student/dashboard"
        />
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <Card key={req.id} className="shadow-xs border-slate-200">
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-base">
                      {req.alumnus?.full_name || "Alumnus Mentor"}
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      ({req.alumnus?.job_title} @ {req.alumnus?.company})
                    </span>
                    <RequestStatusBadge status={req.status} />
                    {req.repeat_contact_in_month && (
                      <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-medium">
                        Repeat Contact
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600">
                    <strong>Goal:</strong> {req.intent?.title || "Career guidance and mentorship"}
                  </p>

                  <div className="p-2.5 rounded bg-slate-50 border border-slate-200/80 text-xs text-slate-700 italic">
                    &quot;{req.student_message}&quot;
                  </div>

                  {req.alumni_response_note && (
                    <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                      <strong>Alumnus Response:</strong> &quot;{req.alumni_response_note}&quot;
                    </div>
                  )}

                  <div className="text-[11px] text-slate-400">
                    Sent on {new Date(req.created_at).toLocaleDateString()} • Expires on{" "}
                    {new Date(req.expires_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {req.status === "accepted" && (
                    <Link href={`/goals/77777777-7777-7777-7777-777777777701`}>
                      <Button size="sm" variant="primary" className="text-xs gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Open Goal Room</span>
                      </Button>
                    </Link>
                  )}

                  {req.status === "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      onClick={() => handleWithdraw(req.id)}
                      isLoading={actionLoading === req.id}
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1" />
                      <span>Withdraw Request</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
