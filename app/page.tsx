import Link from "next/link";
import {
  Users,
  Target,
  Cpu,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Clock,
  Compass,
  Briefcase,
  TrendingUp,
  BarChart3,
  Calendar,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200/80 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="absolute inset-0 bg-radial-[at_top_right] from-blue-50/50 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold tracking-wide">
              <Sparkles className="h-3.5 w-3.5" />
              Outcome-Driven Alumni Networking Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Right people. Right purpose.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Real opportunities.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Replace blind cold emails with purpose-driven connections. Deterministic SQL ranking matches students with alumni based on specific goals, active offers, and real monthly review capacity.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link href="/auth/sign-up?role=student">
                <Button size="lg" className="w-full sm:w-auto gap-2 shadow-md">
                  <span>Student Sign Up (3rd/4th Year)</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/sign-up?role=alum">
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                  <span>Join as Alumnus</span>
                </Button>
              </Link>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> Server-Enforced Limits
              </span>
              <span className="flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-blue-600" /> Pure SQL Ranking Engine
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-indigo-600" /> Mutual Goal Confirmation
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs SyncTies Contrast */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Why Traditional Alumni Directories Fail
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Static directories are repositories of contacts with no intent, no capacity awareness, and no tracked outcomes. SyncTies fixes all three.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Old Way */}
            <Card className="border-rose-200/80 bg-rose-50/20 shadow-xs">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-rose-900 text-lg">The Old Way: Cold Outreach</CardTitle>
                  <Badge variant="danger">Unstructured</Badge>
                </div>
                <CardDescription className="text-rose-700/80">
                  Frustrating for students, overwhelming for alumni
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                <div className="flex items-start gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-rose-500 mt-2 shrink-0" />
                  <span>
                    <strong>Blind blast messaging:</strong> Students send generic LinkedIn cold DMs without knowing if the alum is willing or available.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-rose-500 mt-2 shrink-0" />
                  <span>
                    <strong>Alumni inbox burnout:</strong> Active professionals receive dozens of unstructured requests with vague asks.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-rose-500 mt-2 shrink-0" />
                  <span>
                    <strong>Zero outcome tracking:</strong> Neither students nor universities know if any advice was given, resume reviewed, or opportunity materialized.
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* The SyncTies Way */}
            <Card className="border-blue-200 bg-blue-50/20 shadow-xs">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-blue-950 text-lg">The SyncTies Way: Intent & Capacity</CardTitle>
                  <Badge variant="default">Outcome-Driven</Badge>
                </div>
                <CardDescription className="text-blue-700/80">
                  Targeted, structured, respectful, and verifiable
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                <div className="flex items-start gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 shrink-0" />
                  <span>
                    <strong>Intent-first matching:</strong> Students declare structured goals (Mock Interview, Resume Review, Referral) and specific domains.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 shrink-0" />
                  <span>
                    <strong>Protected alumni capacity:</strong> Alumni set a monthly review limit (e.g., 3 reviews/month). Over-capacity alumni are never overwhelmed.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 shrink-0" />
                  <span>
                    <strong>Dual-confirmed fulfillment:</strong> Outcomes are marked fulfilled only when both student and alumnus confirm completion.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="indigo" className="mb-2">
              Five-Step Cycle
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">How SyncTies Works</h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              A transparent, financial-like lifecycle from initial student goal to confirmed community impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                step: "01",
                title: "Student Intent",
                desc: "Student creates an intent with domain tags and target help type (e.g. Mock Interview in Product Management).",
                icon: Target,
              },
              {
                step: "02",
                title: "SQL Match Engine",
                desc: "Database evaluates domain overlap (40%), help fit (30%), alumni capacity (20%), and recency (10%).",
                icon: Cpu,
              },
              {
                step: "03",
                title: "AI Brief & Request",
                desc: "Grounded 2-sentence brief explains the fit. Student spends 1 monthly token to atomically request review.",
                icon: Sparkles,
              },
              {
                step: "04",
                title: "Alumni Review",
                desc: "Alumnus reviews contextual request. Accepts, defers, or declines within their monthly capacity pool.",
                icon: Briefcase,
              },
              {
                step: "05",
                title: "Mutual Confirmation",
                desc: "Both participants confirm goal completion. Evidence-based impact metric increments in real-time.",
                icon: CheckCircle,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative rounded-xl border border-slate-200/80 bg-white p-5 flex flex-col justify-between shadow-xs hover:border-blue-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-slate-200">{item.step}</span>
                    <item.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-base mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Deterministic Algorithm Section */}
      <section id="matching" className="py-16 sm:py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <Badge variant="outline" className="text-blue-400 border-blue-800">
                Transparent Matching Formula
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Deterministic SQL Scoring. <br />
                <span className="text-blue-400">Zero Black-Box Bias.</span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                SyncTies does not use an opaque neural net to rank human beings. Candidates are evaluated directly in PostgreSQL using a versioned weighted formula:
              </p>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 font-mono text-xs sm:text-sm text-blue-300 space-y-2">
                <div className="text-slate-400 text-xs">-- SyncTies Scoring Formula v1</div>
                <div>
                  <span className="text-amber-400">TotalScore</span> ={" "}
                  <span className="text-emerald-400">0.40 * D</span> +{" "}
                  <span className="text-blue-400">0.30 * H</span> +{" "}
                  <span className="text-purple-400">0.20 * C</span> +{" "}
                  <span className="text-rose-400">0.10 * R</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60">
                  <div className="font-semibold text-emerald-400 mb-1">D: Domain Overlap (40%)</div>
                  <div className="text-slate-400">Jaccard similarity on canonical domain tags |S ∩ A| / |S ∪ A|</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60">
                  <div className="font-semibold text-blue-400 mb-1">H: Help Fit (30%)</div>
                  <div className="text-slate-400">Database compatibility table: 100 exact, 70 strong, 40 partial</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60">
                  <div className="font-semibold text-purple-400 mb-1">C: Capacity (20%)</div>
                  <div className="text-slate-400">Remaining monthly review slots / monthly limit ratio</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60">
                  <div className="font-semibold text-rose-400 mb-1">R: Recency (10%)</div>
                  <div className="text-slate-400">Smooth 14-day half-life decay from last active timestamp</div>
                </div>
              </div>
            </div>

            {/* Simulated Match Card Preview */}
            <div className="lg:col-span-6">
              <Card className="border-slate-700 bg-slate-800 text-white shadow-xl">
                <CardHeader className="border-b border-slate-700 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
                        Sample Match Result
                      </span>
                      <h4 className="text-lg font-bold text-white mt-1">Priya Sharma</h4>
                      <p className="text-xs text-slate-400">Product Lead @ Stripe • Class of 2023</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-emerald-400">79.5%</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Fit Score</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {/* Factor Breakdown Bars */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Domain Overlap (PM, Fintech)</span>
                      <span className="font-mono text-emerald-400">80 / 100</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[80%]" />
                    </div>

                    <div className="flex justify-between text-slate-300">
                      <span>Help Type (Mock Interview)</span>
                      <span className="font-mono text-blue-400">100 / 100</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full w-[100%]" />
                    </div>

                    <div className="flex justify-between text-slate-300">
                      <span>Remaining Capacity (2 slots left)</span>
                      <span className="font-mono text-purple-400">50 / 100</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full w-[50%]" />
                    </div>
                  </div>

                  {/* AI Grounded Brief Preview */}
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-700/80 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-blue-400 font-medium">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Why You Should Connect</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed italic">
                      &quot;Priya is an alumnus in Product Management offering Mock Interviews, which matches your active intent. She currently has 2 review slots open this month.&quot;
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-700 text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Lock className="h-3 w-3 text-amber-400" /> Cost: 1 Monthly Token
                    </span>
                    <Button size="sm" variant="primary" className="h-8 text-xs">
                      Send Connection Request
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pilot Scope & Rules */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Pilot Guidelines & Scope</h2>
            <p className="mt-3 text-slate-600 text-sm">
              Engineered specifically for the initial university pilot with strict rules that preserve trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-900">Eligible Cohorts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Students must be currently in their 3rd or 4th year of study. Alumni focus is on graduates from the most recent 3 graduating classes.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="h-10 w-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-900">Anti-Spam Tokens</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Students receive 5 tokens per calendar month. Each request consumes 1 token from an auditable ledger. Repeat requests to the same alumnus are clearly flagged.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-900">Verifiable Metrics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Impact metrics come from actual database records. Network connectivity score uses pair coverage: 100 * unique pairs / (eligible students * eligible alumni).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-gradient-to-tr from-blue-600 to-indigo-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready for Purposeful Alumni Networking?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto">
            Get started today. Whether you are a student preparing for your career or an alumnus ready to make a high-impact contribution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg">
                Create Free Account
              </Button>
            </Link>
            <Link href="/impact">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                View Live Impact Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
