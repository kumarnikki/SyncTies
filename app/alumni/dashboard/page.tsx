"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  CheckCircle,
  Clock,
  Sliders,
  Plus,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RequestStatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Alert } from "@/components/ui/alert";
import { ConnectionRequest, Offer, CapacitySummary } from "@/types/database";

export default function AlumniDashboardPage() {
  const [capacity, setCapacity] = useState<CapacitySummary | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCapacity, setEditingCapacity] = useState(false);
  const [newLimit, setNewLimit] = useState(3);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchData = () => {
    Promise.all([
      fetch("/api/capacity").then((r) => r.json()),
      fetch("/api/offers").then((r) => r.json()),
      fetch("/api/connection-requests?role=alum").then((r) => r.json()),
    ])
      .then(([capData, offerData, reqData]) => {
        if (capData) {
          setCapacity(capData);
          setNewLimit(capData.monthly_limit || 3);
        }
        if (offerData?.offers) setOffers(offerData.offers);
        if (reqData?.requests) setRequests(reqData.requests);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateCapacity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/capacity", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monthly_limit: Number(newLimit) }),
      });
      if (res.ok) {
        setEditingCapacity(false);
        setMessage("Monthly capacity limit updated.");
        fetchData();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRequestAction = async (
    requestId: string,
    action: "accept" | "decline" | "defer" | "ignore"
  ) => {
    setActionLoading(requestId);
    setMessage(null);

    try {
      const res = await fetch(`/api/connection-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Action failed");
      }

      setMessage(`Request was ${action}ed.`);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Alumni Mentorship Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your monthly review capacity, review incoming student goals, and track your contribution.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/alumni/offers">
            <Button variant="primary" className="gap-2 shadow-xs">
              <Plus className="h-4 w-4" />
              <span>Create New Offer</span>
            </Button>
          </Link>
        </div>
      </div>

      {message && <Alert variant="success">{message}</Alert>}

      {/* Monthly Capacity Management Card */}
      <Card className="border-indigo-200/80 bg-indigo-50/20 shadow-xs">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
                  Monthly Review Capacity Control
                </span>
                <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-medium">
                  Anti-Burnout Guardrail
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {capacity?.remaining_capacity ?? 2} of {capacity?.monthly_limit ?? 4} Review Slots Open This Month
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                SyncTies respects your time. Once your capacity is full, the SQL matching engine automatically pauses your profile from new student requests until next month.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              {editingCapacity ? (
                <form onSubmit={handleUpdateCapacity} className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={newLimit}
                    onChange={(e) => setNewLimit(Number(e.target.value))}
                    className="w-20 h-9 rounded-md border border-slate-300 px-2 text-sm bg-white text-slate-900"
                  />
                  <Button size="sm" type="submit" variant="primary">
                    Save
                  </Button>
                  <Button
                    size="sm"
                    type="button"
                    variant="ghost"
                    onClick={() => setEditingCapacity(false)}
                  >
                    Cancel
                  </Button>
                </form>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingCapacity(true)}
                  className="gap-1.5 bg-white text-xs"
                >
                  <Sliders className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Adjust Capacity Limit</span>
                </Button>
              )}
            </div>
          </div>

          {/* Capacity Progress Bar */}
          <div className="mt-6 pt-4 border-t border-indigo-100">
            <div className="flex justify-between text-xs text-slate-600 mb-2">
              <span>
                Reserved / Processed:{" "}
                <strong>
                  {(capacity?.reserved_count ?? 1) + (capacity?.processed_count ?? 1)}
                </strong>
              </span>
              <span>
                Remaining: <strong>{capacity?.remaining_capacity ?? 2}</strong>
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
              <div
                style={{
                  width: `${
                    (((capacity?.reserved_count ?? 1) + (capacity?.processed_count ?? 1)) /
                      (capacity?.monthly_limit || 4)) *
                    100
                  }%`,
                }}
                className="bg-indigo-600 h-full rounded-full transition-all"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incoming Requests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Incoming Connection Requests ({pendingRequests.length} Pending)
            </h2>
          </div>
          <Link href="/alumni/requests" className="text-xs font-medium text-blue-600 hover:underline">
            View All ({requests.length})
          </Link>
        </div>

        {requests.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No incoming requests right now"
            description="Your active offers are listed in the matching pool. As students post matching intents, you'll receive capacity-aware requests here."
            actionLabel="Review My Offers"
            actionHref="/alumni/offers"
          />
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <Card key={req.id} className="shadow-xs hover:border-slate-300 transition-all">
                <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-base">
                        {req.student?.full_name || "Rohan Deshmukh"}
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">
                        (4th Year Undergraduate)
                      </span>
                      <RequestStatusBadge status={req.status} />
                      {req.repeat_contact_in_month && (
                        <span className="text-xs bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-medium inline-flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Repeat Contact
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600">
                      <strong>Goal:</strong> {req.intent?.title || "Product Management Interview Prep"}
                    </p>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-700 italic">
                      &quot;{req.student_message}&quot;
                    </div>

                    {req.repeat_contact_in_month && req.repeat_reason && (
                      <p className="text-xs text-amber-900 bg-amber-50 p-2 rounded border border-amber-200">
                        <strong>Student Justification:</strong> &quot;{req.repeat_reason}&quot;
                      </p>
                    )}

                    <div className="text-[11px] text-slate-400">
                      Received {new Date(req.created_at).toLocaleDateString()} • Expires{" "}
                      {new Date(req.expires_at).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions for Pending Requests */}
                  {req.status === "pending" && (
                    <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleRequestAction(req.id, "accept")}
                        isLoading={actionLoading === req.id}
                        className="text-xs"
                      >
                        Accept Request
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRequestAction(req.id, "defer")}
                        isLoading={actionLoading === req.id}
                        className="text-xs"
                      >
                        Defer (Next Week)
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRequestAction(req.id, "decline")}
                        isLoading={actionLoading === req.id}
                        className="text-xs text-rose-600 hover:text-rose-700"
                      >
                        Decline
                      </Button>
                      {req.repeat_contact_in_month && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRequestAction(req.id, "ignore")}
                          isLoading={actionLoading === req.id}
                          className="text-xs text-slate-400 hover:text-slate-700"
                        >
                          Ignore Repeat
                        </Button>
                      )}
                    </div>
                  )}

                  {req.status === "accepted" && (
                    <Link href="/goals/77777777-7777-7777-7777-777777777701">
                      <Button size="sm" variant="outline" className="text-xs gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Open Goal Room</span>
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Active Mentorship Offers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Your Published Mentoring Offers</h2>
          </div>
          <Link href="/alumni/offers" className="text-xs font-medium text-blue-600 hover:underline">
            Manage Offers ({offers.length})
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map((offer) => (
            <Card key={offer.id} className="shadow-xs hover:border-indigo-300 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant={offer.status === "active" ? "success" : "secondary"}>
                    {offer.status}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    {new Date(offer.created_at).toLocaleDateString()}
                  </span>
                </div>
                <CardTitle className="text-base text-slate-900 mt-2">
                  {offer.title}
                </CardTitle>
                <p className="text-xs text-indigo-600 font-medium">
                  {offer.help_type?.name || "Mock Interview"}
                </p>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {offer.description}
                </p>
                {offer.opportunity_available && (
                  <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium">
                    Opportunity Tagged: {offer.opportunity_title} ({offer.opportunity_company})
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
