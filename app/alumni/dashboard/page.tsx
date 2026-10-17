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
  Shield,
  AlertTriangle,
  Inbox,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RequestStatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Alert } from "@/components/ui/alert";
import { Avatar } from "@/components/ui/avatar";
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
        setMessage("Monthly review capacity updated.");
        fetchData();
      }
    } catch (err: any) {
      alert(err?.message || "Failed to update capacity");
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
      alert(err?.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const usedCount = (capacity?.reserved_count ?? 1) + (capacity?.processed_count ?? 1);
  const totalLimit = capacity?.monthly_limit || 4;
  const capacityPercent = Math.min(100, Math.round((usedCount / totalLimit) * 100));

  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-page-enter">
      {/* Top Welcome / Hub Header */}
      <div className="page-head">
        <div>
          <h1 className="font-heading">Alumni Mentorship Hub</h1>
          <p>
            Share guidance on your terms. Manage review capacity, evaluate focused requests, and track your verified outcomes.
          </p>
        </div>
        <div>
          <Link href="/alumni/offers">
            <Button variant="primary" className="gap-2 shadow-sm">
              <Plus className="h-4 w-4" />
              <span>Create Mentoring Offer</span>
            </Button>
          </Link>
        </div>
      </div>

      {message && <Alert variant="success">{message}</Alert>}

      {/* Figma Capacity Control Banner */}
      <div className="capacity-banner shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#edf1ff] text-[#536df0] flex items-center justify-center shrink-0">
            <Inbox className="h-5 w-5" />
          </div>
          <div>
            <b className="font-bold text-[#15213b]">
              {capacity?.remaining_capacity ?? 2} of {totalLimit} review slots open this month
            </b>
            <small className="text-xs text-[#8896ab]">
              Queue has {pendingRequests.length} pending requests · Matching automatically pauses when full
            </small>
          </div>
        </div>

        <div className="capacity-bar">
          <i style={{ width: `${capacityPercent}%` }} />
        </div>

        <div>
          {editingCapacity ? (
            <form onSubmit={handleUpdateCapacity} className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={20}
                value={newLimit}
                onChange={(e) => setNewLimit(Number(e.target.value))}
                className="w-16 h-8 rounded-lg border border-[#cbd5fb] px-2 text-xs bg-white text-[#15213b]"
              />
              <Button size="sm" type="submit" variant="primary" className="text-xs h-8">
                Save
              </Button>
              <Button
                size="sm"
                type="button"
                variant="ghost"
                onClick={() => setEditingCapacity(false)}
                className="text-xs h-8"
              >
                Cancel
              </Button>
            </form>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setEditingCapacity(true)}
              className="text-xs gap-1.5"
            >
              <Sliders className="h-3 w-3 text-[#536df0]" />
              <span>Adjust capacity ({totalLimit}/mo)</span>
            </Button>
          )}
        </div>
      </div>

      {/* Incoming Requests Section with 2-Column Layout */}
      <div className="request-layout">
        {/* Request Cards List (Left Column) */}
        <div className="space-y-4">
          <div className="content-title">
            <div>
              <h2 className="font-heading">Incoming Goal Requests ({pendingRequests.length} Pending)</h2>
              <p>Requests are pre-filtered by domain relevance and help-type compatibility.</p>
            </div>
            <Link href="/alumni/requests">
              <button className="text-sm font-semibold text-[#5369e8] flex items-center gap-1 hover:underline">
                View all ({requests.length}) <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </Link>
          </div>

          {requests.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No incoming requests right now"
              description="Your active offers are in the matching pool. As students post matching intents, you'll receive capacity-aware requests here."
              actionLabel="Review Published Offers"
              actionHref="/alumni/offers"
            />
          ) : (
            <div className="space-y-4">
              {requests.map((req, idx) => {
                const initials = req.student?.full_name
                  ? req.student.full_name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
                  : "ST";
                const tones = ["cyan", "violet", "coral", "blue"] as const;
                const tone = tones[idx % tones.length];

                return (
                  <article key={req.id} className="request-card">
                    <div className="person">
                      <Avatar initials={initials} tone={tone} size="md" />
                      <div>
                        <h3 className="font-bold text-[#15213b] text-base">
                          {req.student?.full_name || "Rohan Deshmukh"}
                        </h3>
                        <p className="text-xs text-[#66758e]">
                          4th Year Undergraduate · Computer Science
                        </p>
                      </div>
                      <RequestStatusBadge status={req.status} />
                    </div>

                    <div className="request-goal">
                      <small className="text-xs font-semibold text-[#8896ab] uppercase tracking-wider">
                        Specific student goal &amp; ask
                      </small>
                      <b className="text-sm text-[#15213b] font-bold">
                        {req.intent?.title || "Product Management Interview Prep"}
                      </b>
                      <p className="text-xs text-[#66758e] leading-relaxed italic mt-1">
                        &quot;{req.student_message}&quot;
                      </p>
                    </div>

                    <div className="rationale">
                      <Sparkles className="h-3.5 w-3.5 text-[#536df0] shrink-0" />
                      <span>High domain overlap &amp; verified help-type compatibility · Est. 20 min review</span>
                    </div>

                    {req.repeat_contact_in_month && req.repeat_reason && (
                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 mt-2">
                        <strong>Student Follow-Up Rationale:</strong> &quot;{req.repeat_reason}&quot;
                      </div>
                    )}

                    <div className="card-actions pt-3 border-t border-[#edf0f5] mt-3">
                      {req.status === "pending" ? (
                        <>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRequestAction(req.id, "decline")}
                            isLoading={actionLoading === req.id}
                            className="text-xs text-rose-600 hover:text-rose-700"
                          >
                            Decline
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => handleRequestAction(req.id, "defer")}
                            isLoading={actionLoading === req.id}
                            className="text-xs"
                          >
                            Defer
                          </Button>
                          <Button
                            type="button"
                            variant="primary"
                            size="sm"
                            onClick={() => handleRequestAction(req.id, "accept")}
                            isLoading={actionLoading === req.id}
                            className="text-xs"
                          >
                            Accept request
                          </Button>
                        </>
                      ) : req.status === "accepted" ? (
                        <Link href="/goals/77777777-7777-7777-7777-777777777701" className="w-full">
                          <Button variant="secondary" size="sm" className="w-full text-xs gap-1.5">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Open Shared Goal Room</span>
                          </Button>
                        </Link>
                      ) : (
                        <span className="text-xs text-[#8896ab]">Request {req.status}</span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Requests Sidebar Guidance (Right Column) */}
        <aside className="panel requests-aside space-y-4">
          <h3 className="font-heading text-lg text-[#15213b]">Queue Guidance</h3>
          <p className="text-xs text-[#66758e] leading-relaxed">
            Prioritize requests based on relevance and your available schedule. You never need to justify or explain a decline.
          </p>

          <div className="p-3 bg-[#f3f6fc] rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#66758e]">Anti-burnout guardrail</span>
              <span className="badge success text-[10px]">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#66758e]">Request expiry</span>
              <span className="text-[#15213b] font-semibold">14 days</span>
            </div>
          </div>

          <div className="pt-2">
            <span className="badge demo w-full text-center py-1">
              Deterministic Matching Active
            </span>
          </div>
        </aside>
      </div>

      {/* Active Mentorship Offers */}
      <div className="space-y-4">
        <div className="content-title">
          <div>
            <h2 className="font-heading">Your Published Mentoring Offers</h2>
            <p>These offers define your availability and active domains in the SQL matching pool.</p>
          </div>
          <Link href="/alumni/offers">
            <button className="text-sm font-semibold text-[#5369e8] flex items-center gap-1 hover:underline">
              Manage offers ({offers.length}) <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {offers.map((offer) => (
            <div key={offer.id} className="panel group hover:border-[#cfd8ff] transition-all">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge variant={offer.status === "active" ? "success" : "secondary"}>
                  {offer.status}
                </Badge>
                <span className="text-[11px] text-[#8896ab]">
                  {new Date(offer.created_at).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#15213b] mt-1 group-hover:text-[#3563ff] transition-colors">
                {offer.title}
              </h3>
              <p className="text-xs text-[#5369e8] font-semibold mb-2">
                Format: {offer.help_type?.name || "Career Guidance"}
              </p>
              <p className="text-xs text-[#66758e] leading-relaxed line-clamp-2 mb-3">
                {offer.description}
              </p>
              {offer.opportunity_available && (
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-xs text-emerald-900 font-medium flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Opportunity Attached: {offer.opportunity_title} ({offer.opportunity_company})</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
