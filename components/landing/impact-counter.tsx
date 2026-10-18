"use client";

import React, { useState, useEffect, useRef } from "react";
import { Users, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";

interface CounterItem {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  desc: string;
  icon: any;
  tone: "blue" | "violet" | "green" | "cyan";
}

const STATS: CounterItem[] = [
  {
    id: "response-rate",
    label: "Response Rate",
    value: 94.8,
    suffix: "%",
    desc: "Mentors review incoming asks vs. 18% standard cold InMail.",
    icon: CheckCircle2,
    tone: "green",
  },
  {
    id: "median-time",
    label: "Average Turnaround",
    value: 36,
    prefix: "< ",
    suffix: " hrs",
    desc: "Speedy responses backed by 14-day auto-expiration SLA.",
    icon: Clock,
    tone: "blue",
  },
  {
    id: "spam-rate",
    label: "Unsolicited Spam",
    value: 0,
    suffix: "%",
    desc: "Zero mass cold-pitching thanks to monthly tokens & strict limits.",
    icon: ShieldCheck,
    tone: "violet",
  },
  {
    id: "fulfillment-rate",
    label: "Dual Goal Fulfillment",
    value: 92,
    suffix: "%",
    desc: "Collaborative goals confirmed completed by both parties.",
    icon: Users,
    tone: "cyan",
  },
];

export function ImpactCounter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({
    "response-rate": 0,
    "median-time": 0,
    "spam-rate": 0,
    "fulfillment-rate": 0,
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const duration = 1600; // ms
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(1, elapsed / duration);
            // Ease-out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);

            const nextCounts: Record<string, number> = {};
            for (const stat of STATS) {
              const currentVal = stat.value * easeOut;
              nextCounts[stat.id] =
                stat.value % 1 === 0 ? Math.round(currentVal) : Math.round(currentVal * 10) / 10;
            }
            setCounts(nextCounts);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <div ref={containerRef} className="space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="uppercase tracking-widest text-xs font-bold text-[#5369e8] block mb-2">
          Measurable Community Outcomes
        </span>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-[#15213b] tracking-tight">
          Real metrics, verified by dual confirmation
        </h3>
        <p className="mt-3 text-base text-[#66758e]">
          Every introduction on SyncTies is tracked toward tangible outcomes, not vanity connection counts.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          const displayVal = hasAnimated ? counts[stat.id] : stat.value;

          return (
            <div
              key={stat.id}
              className="p-6 rounded-[22px] bg-white border border-[#e5eaf2] shadow-sm hover:-translate-y-1 hover:border-[#cad9fb] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="h-10 w-10 rounded-xl bg-[#edf1ff] text-[#3563ff] flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#15213b] font-heading tracking-tight mb-1">
                  {stat.prefix}
                  {displayVal}
                  {stat.suffix}
                </div>
                <h4 className="font-heading font-bold text-sm text-[#15213b] mb-1.5">
                  {stat.label}
                </h4>
              </div>
              <p className="text-xs text-[#66758e] leading-relaxed pt-2 border-t border-[var(--line-soft)] mt-4">
                {stat.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
