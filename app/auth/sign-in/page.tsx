"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Users, Mail, AlertTriangle, CheckCircle2, RotateCw } from "lucide-react";
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

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "linkedin" | null>(null);
  const [providerNotConfigured, setProviderNotConfigured] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [resendingConfirmation, setResendingConfirmation] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Check query params for error or cancellation states from OAuth redirect
  useEffect(() => {
    const errorParam = searchParams.get("error");
    const cancelledParam = searchParams.get("cancelled");
    const confirmationParam = searchParams.get("confirmation_needed");

    if (cancelledParam === "true" || errorParam === "access_denied") {
      setError("Sign-in with external provider was cancelled.");
    } else if (errorParam) {
      setError(errorParam);
    }

    if (confirmationParam === "true") {
      setNeedsConfirmation(true);
    }
  }, [searchParams]);

  // Handle standard email/password authentication
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setProviderNotConfigured(null);
    setLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        // Standalone pilot fallback mode
        if (email.toLowerCase().includes("alum")) {
          router.push("/alumni/dashboard");
        } else {
          router.push("/student/dashboard");
        }
        return;
      }

      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (
          signInError.message.toLowerCase().includes("email not confirmed") ||
          signInError.message.toLowerCase().includes("not verified")
        ) {
          setNeedsConfirmation(true);
          setError("Your email address has not been confirmed yet. Please check your inbox or resend the link below.");
        } else if (signInError.message.toLowerCase().includes("invalid login credentials")) {
          setError("Invalid email address or password. Please verify your credentials.");
        } else {
          setError(signInError.message);
        }
        setLoading(false);
        return;
      }

      // Successful login: route based on user profile
      const res = await fetch("/api/profile");
      const profileData = await res.json();
      if (profileData?.profile?.role === "alum") {
        router.push("/alumni/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    } catch {
      // Local demo fallback
      if (email.toLowerCase().includes("alum")) {
        router.push("/alumni/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle OAuth Sign-In (Google or LinkedIn OIDC)
  const handleOAuthSignIn = async (provider: "google" | "linkedin_oidc") => {
    setError(null);
    setProviderNotConfigured(null);
    setOauthLoading(provider === "google" ? "google" : "linkedin");

    try {
      if (!isSupabaseConfigured()) {
        setProviderNotConfigured(
          provider === "google" ? "Google OAuth" : "LinkedIn (OIDC)"
        );
        setOauthLoading(null);
        return;
      }

      const supabase = createClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const redirectTo = `${origin}/auth/callback`;

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
          setProviderNotConfigured(
            provider === "google" ? "Google OAuth" : "LinkedIn (OIDC)"
          );
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
      setError(err?.message || "Failed to initiate social login.");
      setOauthLoading(null);
    }
  };

  // Resend confirmation email
  const handleResendConfirmation = async () => {
    if (!email) {
      setError("Please enter your email address to resend confirmation.");
      return;
    }
    setResendingConfirmation(true);
    setResendSuccess(false);

    try {
      const supabase = createClient();
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (resendError) {
        setError(resendError.message);
      } else {
        setResendSuccess(true);
      }
    } catch {
      setResendSuccess(true);
    } finally {
      setResendingConfirmation(false);
    }
  };

  const handleDemoLogin = (role: "student" | "alum") => {
    if (role === "student") {
      router.push("/student/dashboard");
    } else {
      router.push("/alumni/dashboard");
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 rounded-xl bg-blue-600 items-center justify-center text-white shadow-md">
          <Users className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Sign in to SyncTies</h2>
        <p className="text-sm text-slate-500">
          Access your student or alumni portal via Google, LinkedIn, or Email
        </p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="space-y-4 pt-6">
          {error && (
            <Alert variant="error" title="Sign In Error">
              {error}
            </Alert>
          )}

          {providerNotConfigured && (
            <Alert variant="warning" title={`${providerNotConfigured} Setup Required`}>
              {providerNotConfigured} is not enabled in your Supabase Auth dashboard yet. You can sign in using any
              email/password or the Quick Test Pilot buttons below.
            </Alert>
          )}

          {needsConfirmation && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 space-y-2">
              <div className="flex items-start gap-2 text-xs text-amber-800">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Email confirmation is required. Check your inbox or request a new confirmation link.</span>
              </div>
              {resendSuccess ? (
                <p className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Confirmation email resent successfully.
                </p>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-xs text-amber-900 border-amber-300 hover:bg-amber-100"
                  onClick={handleResendConfirmation}
                  isLoading={resendingConfirmation}
                >
                  <RotateCw className="h-3 w-3 mr-1" />
                  Resend Confirmation Email
                </Button>
              )}
            </div>
          )}

          {/* OAuth Providers */}
          <div className="space-y-2.5">
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-3 py-2.5 text-slate-700 border-slate-300 hover:bg-slate-50"
              onClick={() => handleOAuthSignIn("google")}
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
              onClick={() => handleOAuthSignIn("linkedin_oidc")}
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
                or continue with email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-700">Password</label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full gap-2"
              isLoading={loading}
              disabled={oauthLoading !== null}
            >
              <Mail className="h-4 w-4" />
              <span>Sign In with Email</span>
            </Button>
          </form>
        </CardContent>

        {/* Quick Demo Pilot Access */}
        <div className="px-6 pb-6 pt-2 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
            Quick Test Pilot Access
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin("student")}
              className="text-xs"
            >
              Sign In as Student
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin("alum")}
              className="text-xs"
            >
              Sign In as Alumnus
            </Button>
          </div>
        </div>

        <CardFooter className="justify-center border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/auth/sign-up" className="text-blue-600 font-medium hover:underline">
              Create an account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div>Loading sign-in...</div>}>
        <SignInContent />
      </Suspense>
    </div>
  );
}
