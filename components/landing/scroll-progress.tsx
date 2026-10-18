"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showCapsule, setShowCapsule] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));

      setShowCapsule(currentScroll > 280);

      // Detect active section based on scroll offset
      const sections = ["hero", "walkthrough", "algorithm-lab", "audiences", "impact-stats"];
      for (const sectionId of [...sections].reverse()) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* 1. Ultra-sleek top scroll progress bar */}
      <div
        className="fixed top-0 left-0 right-0 h-[3.5px] z-[100] pointer-events-none origin-left"
        style={{
          background: "linear-gradient(90deg, #3563ff 0%, #7c5ce7 50%, #00d2ff 100%)",
          transform: `scaleX(${scrollProgress / 100})`,
          boxShadow: "0 0 12px rgba(53, 99, 255, 0.65)",
          transition: "transform 100ms ease-out",
        }}
      />

      {/* 2. Floating Quick-Jump Navigation Capsule (Appears on scroll) */}
      <aside
        aria-label="Page navigation"
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 pointer-events-auto ${
          showCapsule
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_16px_40px_rgba(21,33,59,0.18)] rounded-full text-xs font-semibold text-[#66758e]">
          <a
            href="#walkthrough"
            onClick={(e) => scrollToSection(e, "walkthrough")}
            className={`px-3 py-1.5 rounded-full transition-all duration-200 ${
              activeSection === "walkthrough"
                ? "bg-[#3563ff] text-white shadow-xs"
                : "hover:text-[#15213b] hover:bg-[#edf2fe]"
            }`}
          >
            Journey
          </a>

          <a
            href="#algorithm-lab"
            onClick={(e) => scrollToSection(e, "algorithm-lab")}
            className={`px-3 py-1.5 rounded-full transition-all duration-200 hidden xs:inline-flex items-center gap-1 ${
              activeSection === "algorithm-lab"
                ? "bg-[#7c5ce7] text-white shadow-xs"
                : "hover:text-[#15213b] hover:bg-[#edf2fe]"
            }`}
          >
            <Sparkles className="h-3 w-3" />
            <span>Algorithm Lab</span>
          </a>

          <a
            href="#audiences"
            onClick={(e) => scrollToSection(e, "audiences")}
            className={`px-3 py-1.5 rounded-full transition-all duration-200 hidden sm:inline-block ${
              activeSection === "audiences"
                ? "bg-[#3563ff] text-white shadow-xs"
                : "hover:text-[#15213b] hover:bg-[#edf2fe]"
            }`}
          >
            Compare
          </a>

          <a
            href="#impact-stats"
            onClick={(e) => scrollToSection(e, "impact-stats")}
            className={`px-3 py-1.5 rounded-full transition-all duration-200 hidden md:inline-block ${
              activeSection === "impact-stats"
                ? "bg-[#3563ff] text-white shadow-xs"
                : "hover:text-[#15213b] hover:bg-[#edf2fe]"
            }`}
          >
            Impact
          </a>

          <div className="h-4 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

          <Link
            href="/auth/sign-up?role=student"
            className="btn text-xs py-1.5 px-3.5 rounded-full shadow-xs gap-1"
          >
            <span>Start Free</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </aside>
    </>
  );
}
