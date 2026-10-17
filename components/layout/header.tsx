"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Compass, Award, User, LogOut, ArrowRight, Menu, X, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/client";

export function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [profile, setProfile] = useState<{ role?: string; full_name?: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
        // fetch profile
        fetch("/api/profile")
          .then((r) => r.json())
          .then((d) => {
            if (d?.profile) setProfile(d.profile);
          })
          .catch(() => {});
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/auth/sign-in";
  };

  const isStudent = profile?.role === "student";
  const isAlum = profile?.role === "alum";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                SyncTies
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                Pilot
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                {isStudent && (
                  <>
                    <Link
                      href="/student/dashboard"
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        pathname.startsWith("/student/dashboard")
                          ? "bg-slate-100 text-blue-600"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/student/intents"
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        pathname.startsWith("/student/intents")
                          ? "bg-slate-100 text-blue-600"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      Intents
                    </Link>
                    <Link
                      href="/student/requests"
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        pathname.startsWith("/student/requests")
                          ? "bg-slate-100 text-blue-600"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      My Requests
                    </Link>
                  </>
                )}

                {isAlum && (
                  <>
                    <Link
                      href="/alumni/dashboard"
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        pathname.startsWith("/alumni/dashboard")
                          ? "bg-slate-100 text-blue-600"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/alumni/offers"
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        pathname.startsWith("/alumni/offers")
                          ? "bg-slate-100 text-blue-600"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      My Offers
                    </Link>
                    <Link
                      href="/alumni/requests"
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        pathname.startsWith("/alumni/requests")
                          ? "bg-slate-100 text-blue-600"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      Incoming Requests
                    </Link>
                  </>
                )}

                <Link
                  href="/impact"
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    pathname === "/impact"
                      ? "bg-slate-100 text-blue-600"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  Impact Metrics
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/#how-it-works"
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                >
                  How It Works
                </Link>
                <Link
                  href="/#matching"
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                >
                  Matching Engine
                </Link>
                <Link
                  href="/impact"
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                >
                  Impact
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Auth / Profile CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="gap-2 text-slate-700">
                  <User className="h-4 w-4" />
                  <span>{profile?.full_name || "Profile"}</span>
                  {profile?.role && (
                    <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded capitalize">
                      {profile.role}
                    </span>
                  )}
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="gap-1.5 text-slate-600 hover:text-rose-600"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/sign-in">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button variant="primary" size="sm" className="gap-1.5 shadow-xs">
                  <span>Get Started</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          {user ? (
            <>
              {isStudent && (
                <>
                  <Link
                    href="/student/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/student/intents"
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Intents
                  </Link>
                  <Link
                    href="/student/requests"
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Requests
                  </Link>
                </>
              )}
              {isAlum && (
                <>
                  <Link
                    href="/alumni/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/alumni/offers"
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Offers
                  </Link>
                  <Link
                    href="/alumni/requests"
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Incoming Requests
                  </Link>
                </>
              )}
              <Link
                href="/impact"
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Impact Metrics
              </Link>
              <Link
                href="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile ({profile?.full_name || user.email})
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-rose-600 hover:bg-rose-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/#how-it-works"
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/impact"
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Impact
              </Link>
              <div className="pt-2 flex flex-col gap-2">
                <Link href="/auth/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
