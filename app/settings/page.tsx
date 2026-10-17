"use client";

import React, { useState, useEffect } from "react";
import { Shield, User, Bell, Check, AlertTriangle } from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [profile, setProfile] = useState<{ role?: string; full_name?: string } | null>(null);
  const [tokens, setTokens] = useState<{
    tokens_remaining: number;
    tokens_granted: number;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"role" | "notifications" | "account">("role");
  const [matchNotifications, setMatchNotifications] = useState(true);
  const [opportunityUpdates, setOpportunityUpdates] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d?.profile) setProfile(d.profile);
      })
      .catch(() => {});

    fetch("/api/tokens/balance")
      .then((r) => r.json())
      .then((t) => setTokens(t))
      .catch(() => {});
  }, []);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const isStudent = profile?.role !== "alum";
  const allocation = tokens?.tokens_granted ?? 5;
  const currentBalance = tokens?.tokens_remaining ?? 2;
  const spentCount = Math.max(0, allocation - currentBalance);

  return (
    <PortalShell>
      {/* Page Header */}
      <div className="page-head">
        <div>
          <h1>Settings</h1>
          <p>Control availability, account preferences, and notifications.</p>
        </div>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm flex items-center gap-2">
          <Check className="h-4 w-4 text-green-600" />
          <span>Preferences saved successfully.</span>
        </div>
      )}

      {/* 2-Column Settings Layout */}
      <div className="settings-layout">
        {/* Main Settings Form Card */}
        <section className="panel settings-form">
          {/* Tabs */}
          <div className="tabs">
            <button
              type="button"
              className={activeTab === "role" ? "active" : ""}
              onClick={() => setActiveTab("role")}
            >
              {isStudent ? "Student" : "Alumni"}
            </button>
            <button
              type="button"
              className={activeTab === "notifications" ? "active" : ""}
              onClick={() => setActiveTab("notifications")}
            >
              Notifications
            </button>
            <button
              type="button"
              className={activeTab === "account" ? "active" : ""}
              onClick={() => setActiveTab("account")}
            >
              Account
            </button>
          </div>

          <h2>Goal &amp; matching preferences</h2>

          {/* New match recommendations */}
          <div className="setting-row">
            <span>
              <b>New match recommendations</b>
              <small>Notify me when relevant alumni become available.</small>
            </span>
            <input
              type="checkbox"
              checked={matchNotifications}
              onChange={(e) => setMatchNotifications(e.target.checked)}
              aria-label="New match recommendations"
            />
          </div>

          {/* Opportunity updates */}
          <div className="setting-row">
            <span>
              <b>Opportunity updates</b>
              <small>Relevant opportunities based on my domains.</small>
            </span>
            <input
              type="checkbox"
              checked={opportunityUpdates}
              onChange={(e) => setOpportunityUpdates(e.target.checked)}
              aria-label="Opportunity updates"
            />
          </div>

          {/* Token Ledger */}
          <h2>Token ledger</h2>
          <div className="ledger">
            <span>
              Monthly allocation <b>+{allocation}</b>
            </span>
            <span>
              Outreach requests used <b>−{spentCount}</b>
            </span>
            <span>
              Current balance <b>{currentBalance}</b>
            </span>
          </div>

          <Button variant="primary" onClick={handleSave}>
            Save preferences
          </Button>
        </section>

        {/* Account Side Card */}
        <aside className="panel flex flex-col justify-between" style={{ minHeight: 320 }}>
          <div>
            <h3 className="font-heading text-lg font-semibold text-[#15213b] mb-4">Account</h3>

            <ul className="simple-list space-y-3 text-sm text-[#66758e]">
              <li className="flex items-center gap-2.5 hover:text-[#15213b] cursor-pointer">
                <Shield className="h-4 w-4 text-[#3563ff]" />
                <span>Password &amp; security</span>
              </li>
              <li className="flex items-center gap-2.5 hover:text-[#15213b] cursor-pointer">
                <User className="h-4 w-4 text-[#7c5ce7]" />
                <span>Connected providers</span>
              </li>
              <li className="flex items-center gap-2.5 hover:text-[#15213b] cursor-pointer">
                <Bell className="h-4 w-4 text-[#38b9d8]" />
                <span>Email preferences</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors text-center"
            >
              Request account deletion
            </button>
          </div>
        </aside>
      </div>

      {/* Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-wrap" role="dialog">
          <button
            className="modal-backdrop"
            onClick={() => setShowDeleteModal(false)}
            aria-label="Close modal"
          />
          <div className="dialog">
            <div className="dialog-icon text-red-600 bg-red-50">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h2>Request account deletion?</h2>
            <p>
              Your account, profile information, and connection history will be permanently queued for deletion in accordance with data retention policies.
            </p>
            <div className="dialog-actions mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => {
                  alert("Account deletion request submitted.");
                  setShowDeleteModal(false);
                }}
              >
                Confirm Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </PortalShell>
  );
}
