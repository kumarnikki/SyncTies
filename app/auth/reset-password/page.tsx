"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Check URL query parameters and hash for expired token / auth error
    const err = searchParams.get("error");
    const errCode = searchParams.get("error_code");
    const errDesc = searchParams.get("error_description");

    if (err || errCode === "otp_expired" || (errDesc && errDesc.includes("expired"))) {
      setIsExpired(true);
      setError(errDesc || "Your password reset link has expired or is invalid.");
    }

    if (typeof window !== "undefined" && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      if (
        hashParams.get("error") ||
        hashParams.get("error_code") === "otp_expired" ||
        hashParams.get("error_description")?.includes("expired")
      ) {
        setIsExpired(true);
        setError(hashParams.get("error_description") || "Your password reset link has expired or is invalid.");
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        setIsSuccess(true);
        setTimeout(() => router.push("/auth/sign-in"), 2500);
        return;
      }

      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        if (updateError.message.includes("expired") || updateError.message.includes("session")) {
          setIsExpired(true);
        }
        setError(updateError.message);
        setLoading(false);
        return;
      }

      setIsSuccess(true);
      setTimeout(() => router.push("/auth/sign-in"), 2000);
    } catch (err: any) {
      setError(err?.message || "Failed to update password. Please request a new reset link.");
    } finally {
      setLoading(false);
    }
  };

  if (isExpired) {
    return (
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-xl bg-amber-500 items-center justify-center text-white shadow-md">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Reset Link Expired</h2>
          <p className="text-sm text-slate-500">
            For security, password reset links expire after a short time or once used.
          </p>
        </div>

        <Card className="shadow-sm">
          <CardContent className="space-y-4 pt-6 text-center">
            <Alert variant="warning" title="Link No Longer Valid">
              {error || "This recovery link has expired or has already been used. Please request a new one."}
            </Alert>
            <Link href="/auth/forgot-password">
              <Button variant="primary" className="w-full gap-2 mt-2">
                <span>Request New Reset Link</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
          <CardFooter className="justify-center border-t border-slate-100 pt-4">
            <Link href="/auth/sign-in" className="text-xs text-blue-600 hover:underline">
              Back to Sign In
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 rounded-xl bg-blue-600 items-center justify-center text-white shadow-md">
          <Lock className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Set New Password</h2>
        <p className="text-sm text-slate-500">Please choose a strong password for your account.</p>
      </div>

      <Card className="shadow-sm">
        {isSuccess ? (
          <CardContent className="space-y-4 pt-6 text-center">
            <div className="inline-flex h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Password Updated!</h3>
            <p className="text-sm text-slate-600">
              Your password has been changed successfully. Redirecting you to sign in...
            </p>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              {error && (
                <Alert variant="error" title="Password Reset Error">
                  {error}
                </Alert>
              )}

              <Input
                label="New Password (min 6 characters)"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Input
                label="Confirm New Password"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
                Update Password
              </Button>
            </CardContent>
          </form>
        )}

        <CardFooter className="justify-center border-t border-slate-100 pt-4">
          <Link href="/auth/sign-in" className="text-xs text-slate-500 hover:text-slate-800">
            Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div>Loading password reset...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
