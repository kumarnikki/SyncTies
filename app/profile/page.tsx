"use client";

import React, { useState, useEffect } from "react";
import { User, ShieldCheck, Save, Sparkles, Building, GraduationCap, Briefcase, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { Avatar } from "@/components/ui/avatar";
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
      setMessage("Profile changes saved successfully!");
    } catch (err: any) {
      setError(err?.message || "Failed to update profile");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return <div className="p-16 text-center text-sm text-[#66758e]">Loading profile...</div>;
  }

  const isStudent = profile?.role === "student";
  const initials = fullName
    ? fullName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "ST";

  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-page-enter">
      {/* Figma Profile Hero */}
      <div className="profile-hero rounded-2xl shadow-xs">
        <div className="profile-main">
          <Avatar initials={initials} tone={isStudent ? "cyan" : "violet"} size="lg" />
          <div>
            <span className="badge soft text-xs mb-1 inline-flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-[#536df0]" />
              <span className="capitalize">{profile?.role || "student"} Member</span>
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#15213b]">
              {fullName || "Your Profile"}
            </h1>
            <p className="text-sm font-semibold text-[#66758e]">
              {isStudent
                ? `Year ${studyYear} Undergraduate · Class of ${expectedGradYear}`
                : `${jobTitle || "Professional"} at ${company || "Company"}`}
            </p>
            <span className="text-xs text-[#8896ab]">{institution}</span>
          </div>

          <div className="profile-cta">
            <div>
              <b className="font-heading">100%</b>
              <span>Identity Active</span>
            </div>
          </div>
        </div>
      </div>

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="error">{error}</Alert>}

      {/* Settings & Profile Layout */}
      <div className="settings-layout">
        {/* Main Edit Profile Form (Left Column) */}
        <section className="panel edit-profile">
          <div className="flex items-center justify-between pb-4 border-b border-[#edf0f5] mb-5">
            <div>
              <h2 className="font-heading text-xl text-[#15213b]">Profile Information</h2>
              <p className="text-xs text-[#66758e]">These details power your matching factors and explainable briefs.</p>
            </div>
            <span className="badge demo text-xs">Self-Reported Identity</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-grid">
              <div className="field">
                <label htmlFor="pName">Full name</label>
                <input
                  id="pName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="pInst">University / Institution</label>
                <input
                  id="pInst"
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                />
              </div>

              {isStudent ? (
                <>
                  <div className="field">
                    <label htmlFor="pStudyYear">Study year</label>
                    <select
                      id="pStudyYear"
                      value={studyYear}
                      onChange={(e) => setStudyYear(Number(e.target.value))}
                    >
                      <option value={3}>3rd Year Undergraduate</option>
                      <option value={4}>4th Year Undergraduate (Final Year)</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="pGradYear">Expected graduation</label>
                    <select
                      id="pGradYear"
                      value={expectedGradYear}
                      onChange={(e) => setExpectedGradYear(Number(e.target.value))}
                    >
                      <option value={2026}>2026</option>
                      <option value={2027}>2027</option>
                      <option value={2028}>2028</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="field">
                    <label htmlFor="pJob">Job title</label>
                    <input
                      id="pJob"
                      type="text"
                      placeholder="e.g. Senior PM"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="pComp">Company</label>
                    <input
                      id="pComp"
                      type="text"
                      placeholder="e.g. Stripe, Google"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="pInd">Industry domain</label>
                    <input
                      id="pInd"
                      type="text"
                      placeholder="e.g. Developer Tools, FinTech"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="pAlumYear">Graduation year</label>
                    <select
                      id="pAlumYear"
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(Number(e.target.value))}
                    >
                      <option value={2026}>Class of 2026</option>
                      <option value={2025}>Class of 2025</option>
                      <option value={2024}>Class of 2024</option>
                      <option value={2023}>Class of 2023</option>
                      <option value={2022}>Class of 2022</option>
                    </select>
                  </div>
                </>
              )}

              <div className="field full">
                <label htmlFor="pBio">Public bio &amp; background</label>
                <textarea
                  id="pBio"
                  rows={3}
                  placeholder="Share a short summary of your background, experience, and mentoring goals..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#edf0f5]">
              <Button type="submit" variant="primary" isLoading={saveLoading} className="gap-2">
                <Save className="h-4 w-4" />
                <span>Save profile changes</span>
              </Button>
            </div>
          </form>
        </section>

        {/* Profile Strength & Verification Aside (Right Column) */}
        <aside className="space-y-5">
          <section className="panel profile-strength text-center">
            <h3 className="font-heading text-base text-[#15213b]">Profile Strength</h3>
            <div className="ring my-4">
              92<small className="text-xs">%</small>
            </div>
            <p className="text-xs text-[#66758e] leading-relaxed">
              Complete profile bios help alumni understand your context and speed up request review times.
            </p>
          </section>

          <section className="panel space-y-3">
            <h3 className="font-heading text-base text-[#15213b]">Account Governance</h3>
            <div className="space-y-2 text-xs text-[#66758e]">
              <div className="flex items-center justify-between py-1.5 border-b border-[#edf0f5]">
                <span>Registered Email</span>
                <span className="text-[#15213b] font-medium">{profile?.email || "user@example.com"}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#edf0f5]">
                <span>Role Allocation</span>
                <span className="badge soft text-[11px] capitalize">{profile?.role || "student"}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#edf0f5]">
                <span>Auth Provider</span>
                <span className="text-[#15213b] font-medium">Supabase Auth</span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
