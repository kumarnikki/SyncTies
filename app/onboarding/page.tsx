"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Users, Check, Sparkles, ArrowRight, GraduationCap, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Domain } from "@/types/database";

function OnboardingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [role, setRole] = useState<"student" | "alum">(
    (searchParams.get("role") as "student" | "alum") || "student"
  );
  const [fullName, setFullName] = useState(searchParams.get("name") || "");
  const [institution, setInstitution] = useState("Tech University");
  const [studyYear, setStudyYear] = useState<number>(4);
  const [expectedGradYear, setExpectedGradYear] = useState<number>(2027);
  const [graduationYear, setGraduationYear] = useState<number>(2023);
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [bio, setBio] = useState("");
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/domains")
      .then((r) => r.json())
      .then((d) => {
        if (d?.domains) setDomains(d.domains);
      })
      .catch(() => {});
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
    setLoading(true);

    try {
      const payload = {
        full_name: fullName,
        role,
        institution,
        study_year: role === "student" ? Number(studyYear) : null,
        expected_graduation_year: role === "student" ? Number(expectedGradYear) : null,
        graduation_year: role === "alum" ? Number(graduationYear) : null,
        job_title: role === "alum" ? jobTitle : null,
        company: role === "alum" ? company : null,
        industry: role === "alum" ? industry : null,
        bio,
      };

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save profile");
      }

      if (role === "student") {
        router.push("/student/dashboard");
      } else {
        router.push("/alumni/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex h-12 w-12 rounded-xl bg-blue-600 items-center justify-center text-white shadow-md">
          <Sparkles className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Complete Your SyncTies Profile
        </h1>
        <p className="text-sm text-slate-500">
          Help us match you with the right peers and opportunities during the university pilot.
        </p>
      </div>

      <Card className="shadow-sm">
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            {error && <Alert variant="error">{error}</Alert>}

            {/* Role indicator */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {role === "student" ? (
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                ) : (
                  <Briefcase className="h-6 w-6 text-indigo-600" />
                )}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    {role === "student" ? "Student Pilot Member" : "Alumnus / Working Professional"}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {role === "student"
                      ? "Eligible 3rd/4th year undergraduate student"
                      : "Recent graduating batches (2022-2026)"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRole(role === "student" ? "alum" : "student")}
                className="text-xs text-blue-600 font-medium hover:underline"
              >
                Switch Role
              </button>
            </div>

            <Input
              label="Full Name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Priya Sharma"
            />

            <Input
              label="University / Institution"
              required
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
            />

            {/* Student-specific fields */}
            {role === "student" && (
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Current Year of Study"
                  value={studyYear.toString()}
                  onChange={(e) => setStudyYear(Number(e.target.value))}
                  options={[
                    { value: "3", label: "3rd Year Undergraduate" },
                    { value: "4", label: "4th Year Undergraduate (Final Year)" },
                  ]}
                />
                <Select
                  label="Expected Graduation Year"
                  value={expectedGradYear.toString()}
                  onChange={(e) => setExpectedGradYear(Number(e.target.value))}
                  options={[
                    { value: "2026", label: "2026" },
                    { value: "2027", label: "2027" },
                    { value: "2028", label: "2028" },
                  ]}
                />
              </div>
            )}

            {/* Alumni-specific fields */}
            {role === "alum" && (
              <div className="space-y-4">
                <Select
                  label="Graduation Year"
                  value={graduationYear.toString()}
                  onChange={(e) => setGraduationYear(Number(e.target.value))}
                  options={[
                    { value: "2026", label: "Class of 2026 (Recent Grad)" },
                    { value: "2025", label: "Class of 2025" },
                    { value: "2024", label: "Class of 2024" },
                    { value: "2023", label: "Class of 2023" },
                    { value: "2022", label: "Class of 2022" },
                  ]}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Current Job Title"
                    required
                    placeholder="e.g. Product Manager, ML Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                  <Input
                    label="Current Company"
                    required
                    placeholder="e.g. Stripe, Google, Startup"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
                <Input
                  label="Industry / Domain"
                  placeholder="e.g. FinTech, Developer Tools, HealthTech"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>
            )}

            {/* Domain Tags */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                {role === "student" ? "Domains of Career Interest" : "Professional Expertise Domains"}
              </label>
              <div className="flex flex-wrap gap-2">
                {domains.map((dom) => {
                  const isSelected = selectedDomains.includes(dom.id);
                  return (
                    <button
                      key={dom.id}
                      type="button"
                      onClick={() => toggleDomain(dom.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
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
              label="Short Bio / Professional Summary"
              placeholder={
                role === "student"
                  ? "Briefly describe your career goals, what roles you are preparing for, and what help you seek."
                  : "Tell students about your experience, past internships, and what areas you are most happy to mentor on."
              }
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />

            <Button type="submit" variant="primary" className="w-full gap-2" isLoading={loading}>
              <span>Complete Onboarding & Enter Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div>Loading onboarding...</div>}>
      <OnboardingForm />
    </Suspense>
  );
}
