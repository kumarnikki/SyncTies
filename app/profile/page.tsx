"use client";

import React, { useState, useEffect } from "react";
import { User, ShieldCheck, Save, Sparkles, Building, GraduationCap, Briefcase, CheckCircle, Edit3 } from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/types/database";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tokens, setTokens] = useState<{
    tokens_remaining: number;
    tokens_granted: number;
  } | null>(null);
  const [fullName, setFullName] = useState("");
  const [institution, setInstitution] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/profile").then((r) => r.json()),
      fetch("/api/tokens/balance").then((r) => r.json()),
    ])
      .then(([profData, tokenData]) => {
        if (profData?.profile) {
          const p = profData.profile;
          setProfile(p);
          setFullName(p.full_name || "");
          setInstitution(p.institution || "Tech University");
          setBio(p.bio || "");
        }
        if (tokenData) {
          setTokens(tokenData);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/auth/sign-in";
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          institution,
          bio,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save profile");
      }

      const data = await res.json();
      setProfile(data.profile);
      setMessage("Profile saved successfully.");
      setEditing(false);
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    } finally {
      setSaveLoading(false);
    }
  };

  const isStudent = profile?.role !== "alum";
  const rawName = fullName || profile?.full_name || (isStudent ? "jordan" : "paris");
  const displayName = rawName.toLowerCase();
  const initial = (rawName[0] || (isStudent ? "J" : "P")).toUpperCase();

  const allocation = tokens?.tokens_granted ?? 5;
  const remaining = tokens?.tokens_remaining ?? 2;
  const spent = Math.max(0, allocation - remaining);

  // SVG Ring calculation for tokens
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(100, Math.max(0, (remaining / allocation) * 100));
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <PortalShell>
      {/* Page Header */}
      <div className="page-head">
        <div>
          <h1>Your profile</h1>
          <p>Manage the context that powers better matches.</p>
        </div>
      </div>

      {message && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>{message}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-xs underline font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {/* 2-Column Profile Layout */}
      <div className="settings-layout">
        {/* Left Panel: User Profile Header + Ledger + Edit */}
        <section className="panel space-y-6">
          {/* User Card */}
          <div className="flex items-center justify-between pb-6 border-b border-[var(--line)]">
            <div className="flex items-center gap-4">
              <span
                className="avatar"
                style={{
                  width: 64,
                  height: 64,
                  fontSize: 22,
                  borderRadius: 20,
                  boxShadow: "0 8px 20px rgba(53,99,255,0.22)",
                }}
              >
                {initial}
              </span>
              <div>
                <h2 className="text-2xl font-bold text-[#15213b] capitalize font-heading">
                  {displayName}
                </h2>
                <p className="text-sm text-[#66758e]">
                  {isStudent ? "Student (3rd/4th year)" : "Alumni mentor"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setEditing(!editing)}
                className="btn secondary text-xs h-9 px-3"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>{editing ? "Cancel" : "Edit details"}</span>
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="btn secondary text-xs h-9 px-3"
              >
                Sign out
              </button>
            </div>
          </div>

          {/* Token Allocation Table */}
          <div className="ledger mb-0">
            <span>
              Monthly token allocation <b>{allocation}</b>
            </span>
            <span>
              Tokens remaining <b>{remaining}</b>
            </span>
            <span>
              Tokens spent <b>{spent}</b>
            </span>
          </div>

          {/* Inline Edit Form */}
          {editing && (
            <form onSubmit={handleSaveProfile} className="pt-4 border-t border-[var(--line)] space-y-4">
              <h3 className="font-heading text-base font-semibold text-[#15213b]">
                Edit Profile Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="field">
                  <span>Full name</span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full name"
                  />
                </label>
                <label className="field">
                  <span>Institution</span>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="University"
                  />
                </label>
              </div>
              <label className="field">
                <span>Bio &amp; Goals</span>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell alumni what career goals you are working toward..."
                  rows={3}
                />
              </label>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={saveLoading}>
                  {saveLoading ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </form>
          )}
        </section>

        {/* Right Panel: Tokens Left Ring Gauge Card */}
        <aside className="panel text-center flex flex-col items-center justify-between" style={{ minHeight: 300 }}>
          <div className="w-full">
            <h3 className="font-heading text-lg font-semibold text-[#15213b] mb-4">Tokens left</h3>

            {/* Circular Ring Gauge */}
            <div className="relative w-32 h-32 mx-auto my-6 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Track */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#edf1f7"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Active Arc */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#3563ff"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-3xl font-extrabold text-[#15213b] leading-none">
                  {remaining}
                </span>
                <span className="text-xs font-semibold text-[#3563ff] mt-0.5">tok</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#66758e] leading-relaxed max-w-xs mx-auto">
            Spend tokens on your best-matched alumni. Each request costs one token.
          </p>
        </aside>
      </div>
    </PortalShell>
  );
}
