"use client";

import React, { useState, useEffect } from "react";
import { Briefcase, Plus, Check, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { Offer, Domain, HelpType } from "@/types/database";

export default function AlumniOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [helpTypes, setHelpTypes] = useState<HelpType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [helpTypeId, setHelpTypeId] = useState("");
  const [opportunityAvailable, setOpportunityAvailable] = useState(false);
  const [opportunityTitle, setOpportunityTitle] = useState("");
  const [opportunityCompany, setOpportunityCompany] = useState("");
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = () => {
    fetch("/api/offers")
      .then((r) => r.json())
      .then((d) => {
        if (d?.offers) setOffers(d.offers);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOffers();
    Promise.all([
      fetch("/api/domains").then((r) => r.json()),
      fetch("/api/help-types").then((r) => r.json()),
    ]).then(([dData, htData]) => {
      if (dData?.domains) setDomains(dData.domains);
      if (htData?.helpTypes) {
        setHelpTypes(htData.helpTypes);
        if (htData.helpTypes.length > 0) {
          setHelpTypeId(htData.helpTypes[0].id);
        }
      }
    });
  }, []);

  const toggleDomain = (id: string) => {
    if (selectedDomains.includes(id)) {
      setSelectedDomains(selectedDomains.filter((d) => d !== id));
    } else {
      setSelectedDomains([...selectedDomains, id]);
    }
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedDomains.length === 0) {
      setError("Please select at least 1 domain for this offer.");
      return;
    }

    setCreateLoading(true);

    try {
      const payload = {
        title,
        description,
        help_type_id: helpTypeId,
        status: "active",
        opportunity_available: opportunityAvailable,
        opportunity_title: opportunityAvailable ? opportunityTitle : undefined,
        opportunity_company: opportunityAvailable ? opportunityCompany : undefined,
        domain_ids: selectedDomains,
      };

      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create offer");
      }

      setMessage("New mentoring offer created successfully!");
      setShowCreateModal(false);
      setTitle("");
      setDescription("");
      setSelectedDomains([]);
      fetchOffers();
    } catch (err: any) {
      setError(err.message || "Failed to create offer");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Mentoring & Guidance Offers
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Publish structured offers outlining what support you provide and any active referral opportunities.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Publish New Offer</span>
        </Button>
      </div>

      {message && <Alert variant="success">{message}</Alert>}

      {loading ? (
        <div className="p-8 text-center text-sm text-slate-500">Loading offers...</div>
      ) : offers.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No offers published yet"
          description="Create your first mentoring offer so students with matching goals can connect with you."
          actionLabel="Create Offer"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer) => (
            <Card key={offer.id} className="shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant={offer.status === "active" ? "success" : "secondary"}>
                    {offer.status}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    Created {new Date(offer.created_at).toLocaleDateString()}
                  </span>
                </div>
                <CardTitle className="text-base text-slate-900 mt-2">{offer.title}</CardTitle>
                <p className="text-xs text-indigo-600 font-medium">
                  {offer.help_type?.name || "Mock Interview"}
                </p>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {offer.description}
                </p>

                {/* Domains */}
                <div className="flex flex-wrap gap-1.5">
                  {offer.domains?.map((d) => (
                    <span
                      key={d.id}
                      className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                    >
                      {d.name}
                    </span>
                  ))}
                </div>

                {offer.opportunity_available && (
                  <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-medium">
                    Opportunity Tagged: {offer.opportunity_title} ({offer.opportunity_company})
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Offer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Create New Mentoring Offer</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            {error && <Alert variant="error">{error}</Alert>}

            <form onSubmit={handleCreateOffer} className="space-y-4">
              <Input
                label="Offer Title"
                required
                placeholder="e.g. Technical Interview Simulation & System Design Drill"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Select
                label="Help Type Offered"
                required
                value={helpTypeId}
                onChange={(e) => setHelpTypeId(e.target.value)}
                options={helpTypes.map((ht) => ({
                  value: ht.id,
                  label: ht.name,
                }))}
              />

              {/* Domain Tags */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Supported Domains</label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {domains.map((dom) => {
                    const isSelected = selectedDomains.includes(dom.id);
                    return (
                      <button
                        key={dom.id}
                        type="button"
                        onClick={() => toggleDomain(dom.id)}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {isSelected ? "✓ " : ""}
                        {dom.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Textarea
                label="Description & Details"
                required
                rows={3}
                placeholder="Describe what you will cover, typical format (30-45 mins), and any expectations."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {/* Opportunity Tagging */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={opportunityAvailable}
                    onChange={(e) => setOpportunityAvailable(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600"
                  />
                  <span>Tag an available job opening or referral eligibility</span>
                </label>

                {opportunityAvailable && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Input
                      placeholder="Role title (e.g. APM 2027)"
                      value={opportunityTitle}
                      onChange={(e) => setOpportunityTitle(e.target.value)}
                    />
                    <Input
                      placeholder="Company (e.g. Stripe)"
                      value={opportunityCompany}
                      onChange={(e) => setOpportunityCompany(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" isLoading={createLoading}>
                  Publish Offer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
