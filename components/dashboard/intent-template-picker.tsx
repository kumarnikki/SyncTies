"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Zap, Target, Briefcase, Code, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface IntentTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  targetRole: string;
  targetCompany: string;
  domainName: string;
  icon: "product" | "code" | "ai";
}

const TEMPLATES: IntentTemplate[] = [
  {
    id: "apm-prep",
    title: "Prepare for Associate Product Manager Case Interviews",
    description: "Targeting entry-level PM roles. Seeking a 45-min mock interview on product sense, metric design, and execution strategy.",
    category: "Product Management",
    targetRole: "Associate Product Manager",
    targetCompany: "Stripe / Google",
    domainName: "Product Management",
    icon: "product",
  },
  {
    id: "swe-systems",
    title: "Full-Stack System Design & Junior SWE Portfolio Drill",
    description: "Preparing for technical rounds. Seeking critique on microservices architecture, Next.js/TypeScript code structure, and live coding tips.",
    category: "Software Engineering",
    targetRole: "Software Engineer",
    targetCompany: "Vercel / Microsoft",
    domainName: "Web Development",
    icon: "code",
  },
  {
    id: "ai-capstone",
    title: "Generative AI Capstone & Graduate Admissions Roadmap",
    description: "Building an agentic LLM project. Looking for guidance on evaluation metrics, research paper positioning, and PhD applications.",
    category: "AI & Machine Learning",
    targetRole: "ML Research Engineer",
    targetCompany: "DeepMind / OpenAI",
    domainName: "AI & Machine Learning",
    icon: "ai",
  },
];

export function IntentTemplatePicker() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="panel p-5 bg-gradient-to-br from-[#ffffff] to-[#f8faff] border border-[#dce5fb] rounded-2xl shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#eef2fc]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge soft text-xs font-semibold inline-flex items-center gap-1 text-[#3563ff] bg-[#edf2fe]">
              <Sparkles className="h-3 w-3" />
              <span>1-Click Intent Starters</span>
            </span>
            <span className="text-[11px] font-medium text-[#64748b]">
              Tested by 40+ University Evaluators
            </span>
          </div>
          <h3 className="text-base font-bold text-[#15213b] font-heading">
            Turn your career milestone into an explainable search
          </h3>
          <p className="text-xs text-[#66758e] mt-0.5">
            Select a high-signal template to pre-populate verified alumni match factors in seconds.
          </p>
        </div>
        <Link href="/student/intents/new" className="shrink-0">
          <Button variant="secondary" size="sm" className="text-xs gap-1.5 h-8">
            <Target className="h-3.5 w-3.5" />
            <span>Custom Blank Goal</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {TEMPLATES.map((tmpl) => {
          const isSelected = selectedId === tmpl.id;
          return (
            <div
              key={tmpl.id}
              onClick={() => setSelectedId(tmpl.id)}
              className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-white border-[#3563ff] shadow-md ring-2 ring-[#3563ff]/10"
                  : "bg-white hover:bg-[#fafbfe] border-[#e2e8f0] hover:border-[#cbd5fb] shadow-2xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      tmpl.icon === "product"
                        ? "bg-purple-50 text-purple-600"
                        : tmpl.icon === "code"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {tmpl.icon === "product" ? (
                      <Briefcase className="h-4 w-4" />
                    ) : tmpl.icon === "code" ? (
                      <Code className="h-4 w-4" />
                    ) : (
                      <Brain className="h-4 w-4" />
                    )}
                  </span>
                  <span className="text-[10px] font-semibold text-[#5369e8] bg-[#f0f3ff] px-2 py-0.5 rounded-full">
                    {tmpl.category}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-[#15213b] leading-snug line-clamp-2 mb-1.5">
                  {tmpl.title}
                </h4>
                <p className="text-[11px] text-[#66758e] leading-relaxed line-clamp-3 mb-3">
                  {tmpl.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="text-[10px] bg-slate-100 text-slate-700 font-medium px-1.5 py-0.5 rounded">
                    🎯 {tmpl.targetRole}
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 font-medium px-1.5 py-0.5 rounded">
                    🏢 {tmpl.targetCompany}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-auto">
                <span className="text-[10px] text-slate-600 font-medium">
                  {tmpl.domainName}
                </span>
                <Link
                  href={`/student/intents/new?title=${encodeURIComponent(tmpl.title)}&desc=${encodeURIComponent(
                    tmpl.description
                  )}&role=${encodeURIComponent(tmpl.targetRole)}&company=${encodeURIComponent(tmpl.targetCompany)}`}
                >
                  <Button
                    variant="primary"
                    size="sm"
                    className="text-[11px] h-7 px-2.5 gap-1 font-semibold shadow-xs"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
