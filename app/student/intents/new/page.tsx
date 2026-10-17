"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Target, Check, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Domain, HelpType } from "@/types/database";

export default function NewIntentPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [helpTypeId, setHelpTypeId] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);

  const [domains, setDomains] = useState<Domain[]>([]);
  const [helpTypes, setHelpTypes] = useState<HelpType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/domains").then((r) => r.json()),
      fetch("/api/help-types").then((r) => r.json()),
    ]).then(([dData, htData]) => {
      if (dData?.domains) setDomains(dData.domains);
      if (htData?.helpTypes) {
        setHelpTypes(htData.helpTypes);
        if (htData.helpTypes.length > 0) {
          setHelpTypeId(htData.helpTypes[1]?.id || htData.helpTypes[0].id); // default to Mock Interview
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedDomains.length === 0) {
      setError("Please select at least one professional domain.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title,
        description,
        help_type_id: helpTypeId,
        target_role: targetRole || undefined,
        target_company: targetCompany || undefined,
        domain_ids: selectedDomains,
      };

      const res = await fetch("/api/intents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create intent");
      }

      const { intent } = await res.json();
      router.push(`/student/matches?intentId=${intent.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create intent");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <Link
          href="/student/intents"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Intents</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Create a New Goal or Intent
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Specify what you need help with. The deterministic matching engine will rank alumni who match your domains and help type.
        </p>
      </div>

      <Card className="shadow-xs">
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            {error && <Alert variant="error">{error}</Alert>}

            <Input
              label="Goal Title"
              required
              placeholder="e.g. Prepare for Associate Product Manager Case Interviews"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Select
              label="Type of Help Requested"
              required
              value={helpTypeId}
              onChange={(e) => setHelpTypeId(e.target.value)}
              options={helpTypes.map((ht) => ({
                value: ht.id,
                label: `${ht.name} — ${ht.description || ""}`,
              }))}
            />

            {/* Target Role & Target Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Target Role (Optional)"
                placeholder="e.g. Associate Product Manager"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
              <Input
                label="Target Company / Sector (Optional)"
                placeholder="e.g. Stripe, Razorpay, or Seed Startups"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
              />
            </div>

            {/* Domain Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Applicable Domains (Factor D in matching formula)
              </label>
              <p className="text-xs text-slate-500">
                Select 1 to 4 canonical domains. Jaccard similarity is computed over these tags.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {domains.map((dom) => {
                  const isSelected = selectedDomains.includes(dom.id);
                  return (
                    <button
                      key={dom.id}
                      type="button"
                      onClick={() => toggleDomain(dom.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                      <span>{dom.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Textarea
              label="Context & Specific Questions"
              required
              placeholder="Explain where you currently stand, what challenges you are facing, and what specific feedback or guidance you are seeking from an alumnus."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />

            <Button type="submit" variant="primary" className="w-full gap-2" isLoading={loading}>
              <Sparkles className="h-4 w-4" />
              <span>Save Intent & View Ranked Matches</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
