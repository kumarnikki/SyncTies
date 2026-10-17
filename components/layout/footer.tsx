import React from "react";
import Link from "next/link";
import { Users, Shield, Cpu, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Users className="h-4 w-4" />
              </div>
              <span className="font-bold text-slate-900 text-base">SyncTies</span>
            </div>
            <p className="text-slate-500 max-w-md text-sm leading-relaxed">
              Right people. Right purpose. Real opportunities. SyncTies is an outcome-driven alumni networking platform with deterministic SQL matching, capacity-aware reviews, and transparent goal fulfillment.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1">
                <Shield className="h-3.5 w-3.5 text-blue-600" /> Privacy by Default
              </span>
              <span className="flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5 text-indigo-600" /> SQL-Scored Matching
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Grounded AI Briefs
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/student/dashboard" className="hover:text-blue-600">
                  Student Portal
                </Link>
              </li>
              <li>
                <Link href="/alumni/dashboard" className="hover:text-blue-600">
                  Alumni Hub
                </Link>
              </li>
              <li>
                <Link href="/impact" className="hover:text-blue-600">
                  Impact Dashboard
                </Link>
              </li>
              <li>
                <Link href="/#matching" className="hover:text-blue-600">
                  Algorithm Transparency
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">Pilot Governance</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <span className="inline-block text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  Cohort: 3rd & 4th Year Students
                </span>
              </li>
              <li>
                <span className="inline-block text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  Alumni: Recent 3 Batches
                </span>
              </li>
              <li>
                <span className="inline-block text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                  Tokens: 5 / month
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 SyncTies. Deterministic alumni connection engine.</p>
          <p>Scoring Formula: 40% Domain + 30% Help Type + 20% Capacity + 10% Recency</p>
        </div>
      </div>
    </footer>
  );
}
