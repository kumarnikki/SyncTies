"use client";

import React, { useState, useEffect } from "react";
import { User, ShieldCheck, Save, Sparkles, Building, GraduationCap, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { Profile } from "@/types/database";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [institution, setInstitution] = useState("");
  const [bio, setBio] = useState("");
  const [studyYear, setStudyYear] = useState<number>(4);
  const [expectedGradYear, setExpectedGradYear] = useState<number>(2027);
  const [graduationYear, setGraduationYear] = useState<number>(2023);
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d?.profile) {
          const p = d.profile;
          setProfile(p);
          setFullName(p.full_name || "");
          setInstitution(p.institution || "Tech University");
          setBio(p.bio || "");
          if (p.study_year) setStudyYear(p.study_year);
          if (p.expected_graduation_year) setExpectedGradYear(p.expected_graduation_year);
          if (p.graduation_year) setGraduationYear(p.graduation_year);
          if (p.job_title) setJobTitle(p.job_title);
          if (p.company) setCompany(p.company);
          if (p.industry) setIndustry(p.industry);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSaveLoading(true);

    try {
      const payload = {
        full_name: fullName,
        institution,
        bio,
        study_year: profile?.role === "student" ? Number(studyYear) : null,
        expected_graduation_year: profile?.role === "student" ? Number(expectedGradYear) : null,
        graduation_year: profile?.role === "alum" ? Number(graduationYear) : null,
        job_title: profile?.role === "alum" ? jobTitle : null,
        company: profile?.role === "alum" ? company : null,
        industry: profile?.role === "alum" ? industry : null,
      };

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save profile");
      }

      const data = await res.json();
      setProfile(data.profile);
      setMessage("Profile updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-slate-500">Loading profile...</div>;
  }

  const isStudent = profile?.role === "student";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Account Profile & Pilot Verification
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Keep your profile accurate to maintain high matching precision in the algorithm.
          </p>
        </div>

        {/* Verification Badge */}
        <div className="flex items-center gap-2">
          <Badge
            variant={
              profile?.verification_status === "verified"
                ? "success"
                : profile?.verification_status === "pending"
                ? "warning"
                : "secondary"
            }
            className="text-xs px-2.5 py-1"
          >
            <ShieldCheck className="h-3.5 w-3.5 mr-1" />
            <span className="capitalize">{profile?.verification_status || "verified"}</span>
          </Badge>
        </div>
      </div>

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="error">{error}</Alert>}

      <Card className="shadow-xs">
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            {/* Identity & Role info banner */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  {fullName ? fullName[0] : "U"}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">{fullName}</h4>
                  <p className="text-xs text-slate-500">
                    Role: <strong className="capitalize">{profile?.role || "student"}</strong> •{" "}
                    {profile?.email || "user@example.com"}
                  </p>
                </div>
              </div>
              <span className="text-xs bg-slate-200/60 text-slate-600 px-2 py-1 rounded">
                Role Locked (Server Enforced)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Input
                label="University / Institution"
                required
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
              />
            </div>

            {/* Student specific fields */}
            {isStudent && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Study Year (Pilot Cohort: 3rd & 4th Year)"
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

            {/* Alumni specific fields */}
            {!isStudent && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Current Job Title"
                    placeholder="e.g. Senior PM"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                  <Input
                    label="Current Company"
                    placeholder="e.g. Stripe"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                  <Input
                    label="Industry Domain"
                    placeholder="e.g. FinTech"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  />
                </div>

                <Select
                  label="Graduation Year (Pilot Cohort: Recent 3 Batches)"
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
              </div>
            )}

            <Textarea
              label="Public Bio / Professional Summary"
              rows={4}
              placeholder="Tell others about your background, career focus, and mentoring availability."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" className="gap-2" isLoading={saveLoading}>
                <Save className="h-4 w-4" />
                <span>Save Profile Changes</span>
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
