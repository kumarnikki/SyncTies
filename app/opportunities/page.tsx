"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Clock,
  Briefcase,
  Sparkles,
  BarChart3,
  Calendar,
  Building,
  Check,
  X,
  ArrowRight,
} from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Offer } from "@/types/database";

interface OpportunityItem {
  id: string;
  title: string;
  subtitle: string;
  type: "Internship" | "Event" | "Project" | "Job";
  deadline: string;
  description: string;
  bannerClass: string;
  icon: any;
}

const DEFAULT_OPPORTUNITIES: OpportunityItem[] = [
  {
    id: "opp-1",
    title: "Product Design Intern",
    subtitle: "Helio Studio · Remote-friendly",
    type: "Internship",
    deadline: "Closes May 28",
    description:
      "Join our product team to conduct user research, create interactive Figma prototypes, and work closely with senior designers on developer workflow tooling.",
    bannerClass: "o0",
    icon: Briefcase,
  },
  {
    id: "opp-2",
    title: "AI Builder Weekend",
    subtitle: "Community event · Remote-friendly",
    type: "Event",
    deadline: "June 8–9",
    description:
      "A 48-hour hands-on hackathon and workshop connecting students with industry alumni building generative AI prototypes, LLM agents, and data apps.",
    bannerClass: "o1",
    icon: Sparkles,
  },
  {
    id: "opp-3",
    title: "Open-source research project",
    subtitle: "Alumni-led project · Remote-friendly",
    type: "Project",
    deadline: "Rolling",
    description:
      "Collaborate on a distributed systems telemetry library. Mentored by Staff Engineers with weekly code reviews and open source contributor credit.",
    bannerClass: "o2",
    icon: BarChart3,
  },
];

export default function OpportunitiesPage() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<OpportunityItem | null>(null);
  const [appliedMap, setAppliedMap] = useState<Record<string, boolean>>({});
  const [liveOffers, setLiveOffers] = useState<Offer[]>([]);

  useEffect(() => {
    fetch("/api/offers")
      .then((r) => r.json())
      .then((d) => {
        if (d?.offers && Array.isArray(d.offers) && d.offers.length > 0) {
          setLiveOffers(d.offers);
        }
      })
      .catch(() => {});
  }, []);

  // Map live offers into items if present, else use Figma defaults
  const allItems: OpportunityItem[] =
    liveOffers.length > 0
      ? liveOffers.map((o: any, idx) => ({
          id: o.id,
          title: o.opportunity_title || o.title,
          subtitle: `${o.opportunity_company || "SyncTies Alumni Network"} · Remote-friendly`,
          type: (idx % 3 === 0
            ? "Internship"
            : idx % 3 === 1
            ? "Event"
            : "Project") as any,
          deadline: "Rolling",
          description: o.description || "Alumni-posted career opportunity.",
          bannerClass: `o${idx % 3}`,
          icon: idx % 3 === 0 ? Briefcase : idx % 3 === 1 ? Sparkles : BarChart3,
        }))
      : DEFAULT_OPPORTUNITIES;

  const filtered = allItems.filter((item) => {
    const matchesSearch =
      (item.title + " " + item.subtitle + " " + item.description)
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesType =
      selectedType === "all" ||
      item.type.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <PortalShell>
      {/* Page Header */}
      <div className="page-head">
        <div>
          <h1>Opportunities</h1>
          <p>Internships, projects, events, and roles shared by alumni.</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-[var(--muted)] pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search opportunities"
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[var(--line)] bg-white text-sm focus:outline-none focus:border-[#3563ff] focus:ring-2 focus:ring-[#3563ff]/10"
          />
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setFilterMenuOpen(!filterMenuOpen)}
            className="btn secondary gap-2 text-xs font-semibold px-4 h-11 w-full sm:w-auto"
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Filters</span>
            {selectedType !== "all" && (
              <span className="badge soft text-[10px] py-0 px-1.5 ml-1">
                {selectedType}
              </span>
            )}
          </button>

          {/* Filter Dropdown */}
          {filterMenuOpen && (
            <div className="absolute right-0 top-12 z-20 w-48 p-2 rounded-xl bg-white border border-[var(--line)] shadow-lg space-y-1">
              {["all", "internship", "event", "project"].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setSelectedType(t);
                    setFilterMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                    selectedType === t
                      ? "bg-[#edf1ff] text-[#3563ff] font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {t === "all" ? "All types" : t}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      {selectedType !== "all" && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-[var(--muted)]">Filtered by:</span>
          <span className="badge soft text-xs flex items-center gap-1.5 py-1 px-2.5">
            <span className="capitalize">{selectedType}</span>
            <button
              onClick={() => setSelectedType("all")}
              className="text-gray-400 hover:text-gray-700 font-bold"
            >
              ×
            </button>
          </span>
        </div>
      )}

      {/* 3-Column Opportunity Cards Grid */}
      <div className="op-grid">
        {filtered.map((item) => {
          const IconComponent = item.icon;
          return (
            <article key={item.id} className="flex flex-col">
              {/* Colored Banner with Icon */}
              <div className={`opp-art ${item.bannerClass}`}>
                <IconComponent />
              </div>

              {/* Badge */}
              <div className="mb-2">
                <span className="badge text-xs font-semibold">{item.type}</span>
              </div>

              {/* Title & Subtitle */}
              <h2>{item.title}</h2>
              <p>{item.subtitle}</p>

              {/* Footer */}
              <div>
                <span>
                  <Clock className="h-3.5 w-3.5 text-[var(--muted)]" />
                  <span>{item.deadline}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setActiveItem(item)}
                  className="btn secondary text-xs font-semibold py-1.5 px-3 min-h-0 h-8"
                >
                  View details
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Detail Modal */}
      {activeItem && (
        <div className="modal-wrap" role="dialog">
          <button
            className="modal-backdrop"
            onClick={() => setActiveItem(null)}
            aria-label="Close modal"
          />
          <div className="dialog max-w-lg">
            <button
              className="x"
              onClick={() => setActiveItem(null)}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className={`opp-art ${activeItem.bannerClass} mb-4`}>
              <activeItem.icon />
            </div>

            <span className="badge text-xs font-semibold mb-2">
              {activeItem.type}
            </span>
            <h2 className="text-2xl font-bold font-heading text-[#15213b] mb-1">
              {activeItem.title}
            </h2>
            <p className="text-sm text-[#66758e] mb-4">{activeItem.subtitle}</p>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 mb-6 text-sm text-[#394761] leading-relaxed">
              {activeItem.description}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--line)]">
              <span className="text-xs text-[var(--muted)] flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>{activeItem.deadline}</span>
              </span>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setActiveItem(null)}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setAppliedMap({ ...appliedMap, [activeItem.id]: true });
                    setActiveItem(null);
                  }}
                  disabled={Boolean(appliedMap[activeItem.id])}
                >
                  {appliedMap[activeItem.id] ? "Expressed Interest" : "Express Interest"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalShell>
  );
}
