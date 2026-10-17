"use client";

import React, { useState } from "react";
import Link from "next/link";
import { KeyRound, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        // Standalone demonstration mode
        setSubmitted(true);
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-xl bg-blue-600 items-center justify-center text-white shadow-md">
            <KeyRound className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Forgot your password?</h2>
          <p className="text-sm text-slate-500">
            Enter your account email and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <Card className="shadow-sm">
          {submitted ? (
            <CardContent className="space-y-4 pt-6 text-center">
              <div className="inline-flex h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 items-center justify-center mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Check your inbox</h3>
              <p className="text-sm text-slate-600">
                If an account exists for <span className="font-medium text-slate-900">{email}</span>, you will receive
                password reset instructions shortly.
              </p>

              {!isSupabaseConfigured() && (
                <Alert variant="info" title="Local Demo Mode">
                  Supabase credentials are in placeholder mode. In a connected cloud instance, an email containing an
                  authenticated recovery link will be dispatched.
                </Alert>
              )}

              <div className="pt-2">
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                  Send again
                </Button>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleReset}>
              <CardContent className="space-y-4 pt-6">
                {error && (
                  <Alert variant="error" title="Reset Request Failed">
                    {error}
                  </Alert>
                )}

                <Input
                  label="Email Address"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Button type="submit" variant="primary" className="w-full gap-2" isLoading={loading}>
                  <Mail className="h-4 w-4" />
                  <span>Send Reset Instructions</span>
                </Button>
              </CardContent>
            </form>
          )}

          <CardFooter className="justify-center border-t border-slate-100 pt-4">
            <Link
              href="/auth/sign-in"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
