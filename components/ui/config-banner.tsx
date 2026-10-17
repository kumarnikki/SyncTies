"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, Database } from "lucide-react";

export function ConfigBanner() {
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        setIsConfigured(data.supabaseConfigured);
      })
      .catch(() => {
        setIsConfigured(false);
      });
  }, []);

  if (isConfigured === null || isConfigured === true) {
    return null;
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-amber-900 text-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
          <span>
            <strong>Setup Required:</strong> Supabase credentials are not configured. Run the database migration script in <code>supabase/migrations/</code> and configure <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in <code>.env.local</code>.
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 font-medium bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
            <Database className="h-3 w-3" /> Standalone Demo Mode Active
          </span>
        </div>
      </div>
    </div>
  );
}
