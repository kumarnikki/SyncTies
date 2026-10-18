import Link from "next/link";
import {
  Sparkles,
  Target,
  Shield,
  BarChart3,
  ArrowRight,
  Check,
  Search,
  Inbox,
  CheckCircle2,
  Cpu,
  Clock,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ScrollProgress } from "@/components/landing/scroll-progress";
import { InteractiveJourney } from "@/components/landing/interactive-journey";
import { AlgorithmLab } from "@/components/landing/algorithm-lab";
import { ImpactCounter } from "@/components/landing/impact-counter";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen relative selection:bg-[#3563ff]/15">
      {/* 0. Top Scroll Progress Line & Floating Quick-Jump Capsule */}
      <ScrollProgress />

      {/* 1. HERO SECTION */}
      <section id="hero" className="relative overflow-hidden py-16 lg:py-24 max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          {/* Left Copy */}
          <div className="space-y-6 text-center lg:text-left">
            <Badge variant="soft" className="gap-1.5 py-1 px-3 text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Purposeful connections, built around your goal</span>
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#15213b] tracking-tight leading-[1.05]">
              The right connection changes{" "}
              <em className="not-italic bg-gradient-to-r from-[#315cf1] to-[#7c5ce7] bg-clip-text text-transparent">
                what’s possible.
              </em>
            </h1>

            <p className="text-lg sm:text-xl text-[#66758e] leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Connect with alumni who match your goals, not just your search terms. Clear intent in, relevant
              guidance out—powered by deterministic SQL matching and capacity safeguards.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link href="/auth/sign-up?role=student" className="w-full sm:w-auto">
                <span className="btn w-full sm:w-auto gap-2 py-3 px-6 text-base shadow-sm hover:shadow-md transition-all">
                  <span>Find your mentor</span>
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
              <Link href="/auth/sign-up?role=alum" className="w-full sm:w-auto">
                <span className="btn secondary w-full sm:w-auto py-3 px-6 text-base">
                  <span>Become a mentor</span>
                </span>
              </Link>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#66738b] font-medium">
              <span className="flex items-center gap-1.5">
                <Target className="h-4 w-4 text-[#3563ff]" /> Goal-based matching
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-[#2d9667]" /> Mentor-controlled capacity
              </span>
              <span className="flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4 text-[#7c5ce7]" /> Progress you can measure
              </span>
            </div>
          </div>

          {/* Right Product Preview Card (Figma Glass Artifact) */}
          <div className="relative mx-auto lg:mx-0 w-full max-w-[560px]">
            <div className="relative p-5 sm:p-6 rounded-[28px] border border-white/90 bg-white/60 shadow-[0_35px_85px_rgba(57,79,127,0.18)] backdrop-blur-xl lg:rotate-1 hover:rotate-0 transition-transform duration-300">
              {/* Ambient Glow behind card */}
              <div className="absolute -inset-6 -z-10 bg-radial from-[#6687ff]/20 to-transparent blur-2xl pointer-events-none" />

              {/* Card Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[var(--line-soft)] text-xs text-[#66758e]">
                <span className="tracking-widest text-slate-300 font-bold">● ● ●</span>
                <Badge variant="demo" className="text-[11px]">Interactive preview</Badge>
              </div>

              {/* Mini Goal Title with Match Orb */}
              <div className="flex items-center justify-between py-4">
                <div>
                  <small className="text-xs text-[#66758e] block">Recommended for your goal</small>
                  <strong className="font-heading text-base sm:text-lg text-[#15213b]">Move into AI product management</strong>
                </div>
                <div className="score-orb">
                  <span className="font-heading text-lg">94</span>
                  <small className="text-[8px] text-[#334fd1] font-semibold">match</small>
                </div>
              </div>

              {/* Feature Match Candidate Box */}
              <div className="bg-white border border-[var(--line)] rounded-[20px] p-4 sm:p-5 shadow-[var(--small-shadow)] space-y-3.5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar initials="MP" tone="violet" size="md" />
                    <div className="leading-tight min-w-0">
                      <h3 className="font-bold text-sm text-[#15213b]">Maya Patel</h3>
                      <p className="text-xs text-[#66758e] truncate">Senior Product Manager · Northstar Labs</p>
                    </div>
                  </div>
                  <Badge variant="success" className="text-[11px] shrink-0">Available (3 slots)</Badge>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="badge text-[11px]">Product</span>
                  <span className="badge text-[11px]">AI / ML</span>
                  <span className="badge text-[11px]">Interview prep</span>
                </div>

                {/* Grounded Brief */}
                <div className="flex gap-2.5 p-3.5 bg-[#f3f5ff] border border-[#e1e6ff] rounded-[13px] text-xs text-[#5363c7]">
                  <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-[#536df0]" />
                  <p className="text-[#657191] leading-relaxed m-0 text-xs">
                    <strong className="text-[#15213b] block mb-0.5">Why this connection</strong>
                    Maya’s product leadership and AI platform experience directly align with your transition goal.
                  </p>
                </div>

                {/* Factor Breakdown Bars */}
                <div className="space-y-2 pt-2 border-t border-[var(--line-soft)] text-[11px] text-[#7b8799]">
                  <div className="grid grid-cols-[85px_1fr_30px] items-center gap-2">
                    <span>Domain fit</span>
                    <div className="h-1.5 rounded-full bg-[#edf0f5] overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#536df0] to-[#7d6fe8] rounded-full w-[96%]" />
                    </div>
                    <span className="text-right font-semibold text-[#15213b]">96%</span>
                  </div>
                  <div className="grid grid-cols-[85px_1fr_30px] items-center gap-2">
                    <span>Help type</span>
                    <div className="h-1.5 rounded-full bg-[#edf0f5] overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#536df0] to-[#7d6fe8] rounded-full w-[92%]" />
                    </div>
                    <span className="text-right font-semibold text-[#15213b]">92%</span>
                  </div>
                  <div className="grid grid-cols-[85px_1fr_30px] items-center gap-2">
                    <span>Capacity</span>
                    <div className="h-1.5 rounded-full bg-[#edf0f5] overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#536df0] to-[#7d6fe8] rounded-full w-[88%]" />
                    </div>
                    <span className="text-right font-semibold text-[#15213b]">88%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE PRODUCT WALKTHROUGH & 4 STEPS */}
      <section id="walkthrough" className="py-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="uppercase tracking-widest text-xs font-bold text-[#5369e8] block mb-2">
              Interactive Product Walkthrough
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#15213b] tracking-tight">
              From intent to impact, in four clear steps
            </h2>
            <p className="mt-3 text-base text-[#66758e]">
              Click or scroll through the stages below to test drive the live student and alumni journey.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delayMs={150}>
          <InteractiveJourney />
        </ScrollReveal>
      </section>

      {/* 3. ALGORITHM SANDBOX & SIMULATOR */}
      <section id="algorithm-lab" className="py-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <AlgorithmLab />
        </ScrollReveal>
      </section>

      {/* 4. SPLIT AUDIENCE SECTION (STUDENTS VS ALUMNI) */}
      <section id="audiences" className="py-20 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="uppercase tracking-widest text-xs font-bold text-[#5369e8] block mb-2">
              Designed For Both Sides
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#15213b] tracking-tight">
              Built for student focus and alumni sustainability
            </h2>
            <p className="mt-3 text-base text-[#66758e]">
              Respecting alumni time is the foundation of getting students real, high-quality answers.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Students */}
          <ScrollReveal delayMs={100}>
            <div className="h-full p-5 sm:p-8 lg:p-10 rounded-[28px] border border-white shadow-[var(--small-shadow)] bg-gradient-to-br from-[#eef3ff] via-[#f7f9ff] to-white relative overflow-hidden flex flex-col justify-between">
              <div>
                <Badge variant="soft" className="mb-4">For Students (3rd/4th Yr)</Badge>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#15213b] tracking-tight leading-snug mb-3 font-heading">
                  Less cold outreach.<br />More relevant guidance.
                </h3>
                <p className="text-sm text-[#66758e] leading-relaxed mb-6 max-w-md">
                  Use a focused goal to find people whose experience, available time, and active offers match what you need now.
                </p>
                <ul className="space-y-3 text-sm font-semibold text-[#15213b]">
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-[#2d9667] shrink-0" />
                    <span>Explainable recommendations with transparent score factors</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-[#2d9667] shrink-0" />
                    <span>5 monthly request tokens to prevent burnout and spam</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-[#2d9667] shrink-0" />
                    <span>Private goal rooms with structured progress milestones</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <Link href="/auth/sign-up?role=student">
                  <span className="btn text-sm py-2.5 px-5">Join as a Student</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* For Alumni */}
          <ScrollReveal delayMs={200}>
            <div className="h-full p-5 sm:p-8 lg:p-10 rounded-[28px] border border-white shadow-[var(--small-shadow)] bg-gradient-to-br from-[#eefaf8] via-[#f5fdfb] to-white relative overflow-hidden flex flex-col justify-between">
              <div>
                <Badge variant="success" className="mb-4">For Alumni &amp; Professionals</Badge>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#15213b] tracking-tight leading-snug mb-3 font-heading">
                  Share your experience,<br />strictly on your terms.
                </h3>
                <p className="text-sm text-[#66758e] leading-relaxed mb-6 max-w-md">
                  Choose what you help with, cap your monthly review capacity, and see the real-world impact of your mentorship time.
                </p>
                <ul className="space-y-3 text-sm font-semibold text-[#15213b]">
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-[#2d9667] shrink-0" />
                    <span>Strict monthly capacity limits (default 3 reviews/mo)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-[#2d9667] shrink-0" />
                    <span>Structured incoming asks with expected review duration</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-[#2d9667] shrink-0" />
                    <span>1-click pause or deferral when your schedule gets busy</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <Link href="/auth/sign-up?role=alum">
                  <span className="btn secondary text-sm py-2.5 px-5">Become an Alumni Mentor</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 5. LIVE ANIMATED COMMUNITY IMPACT METRICS */}
      <section id="impact-stats" className="py-20 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <ImpactCounter />
        </ScrollReveal>
      </section>

      {/* 6. CALL TO ACTION BAND */}
      <section id="cta" className="py-12 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-[30px] p-10 sm:p-16 text-center text-white bg-gradient-to-r from-[#17254b] via-[#2a3474] to-[#523c91] shadow-[0_24px_60px_rgba(35,48,102,0.25)]">
            {/* Ambient Glow Orbs */}
            <div className="absolute -left-16 -top-20 w-64 h-64 rounded-full bg-[#2fc4da]/20 blur-2xl pointer-events-none" />
            <div className="absolute -right-12 -bottom-20 w-72 h-72 rounded-full bg-[#a96aea]/25 blur-2xl pointer-events-none" />

            <Badge variant="dark" className="mx-auto mb-4">
              One focused goal. One relevant person.
            </Badge>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 font-heading">
              Make one good connection today.
            </h2>

            <p className="text-base sm:text-lg text-[#ccd5f0] max-w-xl mx-auto mb-8 leading-relaxed">
              Build career momentum with guidance that fits where you’re going. No spam, no cold pitch guesswork.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link href="/auth/sign-up?role=student">
                <span className="btn w-full sm:w-auto py-3 px-6 shadow-md">Join as a student</span>
              </Link>
              <Link href="/auth/sign-up?role=alum">
                <span className="btn light w-full sm:w-auto py-3 px-6 text-[#283a74]">Join as an alumnus</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
