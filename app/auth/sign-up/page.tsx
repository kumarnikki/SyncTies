"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Users, GraduationCap, Briefcase, ArrowRight, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

// Official Google "G" SVG Icon
function GoogleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

// Official LinkedIn SVG Icon
function LinkedInIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="#0A66C2" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get("role") as "student" | "alum") || "student";

  const [role, setRole] = useState<"student" | "alum">(initialRole);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "linkedin" | null>(null);
  const [providerNotConfigured, setProviderNotConfigured] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  // Handle standard email/password registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setProviderNotConfigured(null);
    setLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        // Standalone demo fallback
        router.push(`/onboarding?role=${role}&name=${encodeURIComponent(fullName)}`);
        return;
      }

      const supabase = createClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // If email confirmation is enabled and session was not immediately established
      if (data?.user && !data.session) {
        setConfirmationSent(true);
        setLoading(false);
        return;
      }

      // If session exists immediately (e.g. email confirmation disabled), proceed to profile onboarding
      router.push(`/onboarding?role=${role}&name=${encodeURIComponent(fullName)}`);
    } catch {
      router.push(`/onboarding?role=${role}&name=${encodeURIComponent(fullName)}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle OAuth Registration / Sign-In
  const handleOAuthSignUp = async (provider: "google" | "linkedin_oidc") => {
    setError(null);
    setProviderNotConfigured(null);
    setOauthLoading(provider === "google" ? "google" : "linkedin");

    try {
      if (!isSupabaseConfigured()) {
        setProviderNotConfigured(provider === "google" ? "Google OAuth" : "LinkedIn (OIDC)");
        setOauthLoading(null);
        return;
      }

      const supabase = createClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const redirectTo = `${origin}/auth/callback?next=${role === "alum" ? "/alumni/dashboard" : "/student/dashboard"}`;

      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (oauthError) {
        if (
          oauthError.message.toLowerCase().includes("not enabled") ||
          oauthError.message.toLowerCase().includes("provider is not configured") ||
          oauthError.message.toLowerCase().includes("unsupported provider")
        ) {
          setProviderNotConfigured(provider === "google" ? "Google OAuth" : "LinkedIn (OIDC)");
        } else {
          setError(oauthError.message);
        }
        setOauthLoading(null);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err?.message || "Failed to initiate registration.");
      setOauthLoading(null);
    }
  };

  if (confirmationSent) {
    return (
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-xl bg-emerald-600 items-center justify-center text-white shadow-md">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Check your email</h2>
          <p className="text-sm text-slate-500">
            We&apos;ve sent a verification link to <span className="font-semibold text-slate-800">{email}</span>.
          </p>
        </div>

        <Card className="shadow-sm">
          <CardContent className="space-y-4 pt-6 text-center">
            <p className="text-sm text-slate-600">
              Please click the link in the confirmation email to activate your account. You do not need an
              institutional or college email address to join.
            </p>
            <div className="pt-2">
              <Link href="/auth/sign-in">
                <Button variant="primary" className="w-full">
                  Proceed to Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 rounded-xl bg-blue-600 items-center justify-center text-white shadow-md">
          <Users className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Join SyncTies</h2>
        <p className="text-sm text-slate-500">
          The outcome-driven alumni networking network. Open to all students &amp; professionals.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="space-y-4 pt-6">
          {error && (
            <Alert variant="error" title="Sign Up Error">
              {error}
            </Alert>
          )}

          {providerNotConfigured && (
            <Alert variant="warning" title={`${providerNotConfigured} Setup Required`}>
              {providerNotConfigured} is not enabled in your Supabase project yet. You can sign up using email &amp; password
              below.
            </Alert>
          )}

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              I am joining as a:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm font-medium transition-all ${
                  role === "student"
                    ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/20"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <GraduationCap className="h-5 w-5 mb-1 text-blue-600" />
                <span>Student</span>
                <span className="text-xs text-slate-500 font-normal mt-0.5">3rd or 4th Year</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("alum")}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm font-medium transition-all ${
                  role === "alum"
                    ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/20"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Briefcase className="h-5 w-5 mb-1 text-indigo-600" />
                <span>Alumnus</span>
                <span className="text-xs text-slate-500 font-normal mt-0.5">Working Professional</span>
              </button>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-2.5 pt-1">
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-3 py-2.5 text-slate-700 border-slate-300 hover:bg-slate-50"
              onClick={() => handleOAuthSignUp("google")}
              isLoading={oauthLoading === "google"}
              disabled={loading || oauthLoading !== null}
            >
              <GoogleIcon className="h-4 w-4" />
              <span>Continue with Google</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-3 py-2.5 text-slate-700 border-slate-300 hover:bg-slate-50"
              onClick={() => handleOAuthSignUp("linkedin_oidc")}
              isLoading={oauthLoading === "linkedin"}
              disabled={loading || oauthLoading !== null}
            >
              <LinkedInIcon className="h-4 w-4" />
              <span>Continue with LinkedIn</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-medium tracking-wider">
                or register with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              required
              placeholder="e.g. Alex Morgan"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <Input
              label="Email Address"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password (min 6 characters)"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full gap-2"
              isLoading={loading}
              disabled={oauthLoading !== null}
            >
              <span>Continue to Profile Setup</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="text-blue-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div>Loading sign-up...</div>}>
        <SignUpForm />
      </Suspense>
    </div>
  );
}
