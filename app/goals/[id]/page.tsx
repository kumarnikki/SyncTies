"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Clock,
  Send,
  Star,
  Users,
  ShieldCheck,
  ArrowLeft,
  Award,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GoalStatusBadge } from "@/components/ui/status-badge";
import { Alert } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Goal, Feedback } from "@/types/database";

export default function GoalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: goalId } = use(params);

  const [goal, setGoal] = useState<Goal | null>(null);
  const [updates, setUpdates] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  // New update state
  const [updateText, setUpdateText] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  // Confirm loading state
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Feedback form state
  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [referralStatus, setReferralStatus] = useState("none");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const fetchGoalData = () => {
    fetch(`/api/goals/${goalId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.goal) setGoal(d.goal);
        if (d?.updates) setUpdates(d.updates);
        if (d?.feedback) {
          setFeedback(d.feedback);
          if (d.feedback.length > 0) setFeedbackSubmitted(true);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGoalData();
  }, [goalId]);

  const handleConfirmCompletion = async () => {
    setConfirmLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/goals/${goalId}/confirm`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Confirmation failed");

      if (data.is_fulfilled) {
        setMessage("Both participants confirmed! Goal is now Mutually Fulfilled. 🎉");
      } else {
        setMessage("Your confirmation was recorded. Waiting for the other participant to confirm.");
      }

      fetchGoalData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateText.trim()) return;

    setUpdateLoading(true);
    try {
      const res = await fetch(`/api/goals/${goalId}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: updateText }),
      });

      if (res.ok) {
        setUpdateText("");
        fetchGoalData();
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackLoading(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal_id: goalId,
          rating: Number(rating),
          comments: feedbackComment,
          referral_status: referralStatus,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit feedback");
      }

      setFeedbackSubmitted(true);
      setMessage("Thank you! Your feedback has been recorded.");
      fetchGoalData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setFeedbackLoading(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-slate-500">Loading goal room...</div>;
  }

  if (!goal) {
    return <div className="p-12 text-center text-sm text-slate-500">Goal not found.</div>;
  }

  const isStudentConfirmed = Boolean(goal.student_confirmed_at);
  const isAlumConfirmed = Boolean(goal.alum_confirmed_at);
  const isFulfilled = goal.status === "fulfilled" || (isStudentConfirmed && isAlumConfirmed);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & Title */}
      <div>
        <Link
          href="/student/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {goal.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Collaborative Goal Room • Started {new Date(goal.created_at).toLocaleDateString()}
            </p>
          </div>
          <GoalStatusBadge status={isFulfilled ? "fulfilled" : goal.status} />
        </div>
      </div>

      {message && <Alert variant="success">{message}</Alert>}

      {/* Participants Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="shadow-xs bg-slate-50/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              S
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Student Partner</p>
              <h4 className="font-semibold text-slate-900 text-sm">
                {goal.student?.full_name || "Rohan Deshmukh"}
              </h4>
              <p className="text-xs text-slate-500">Year 4 Undergraduate</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-slate-50/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              A
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Alumnus Mentor</p>
              <h4 className="font-semibold text-slate-900 text-sm">
                {goal.alumnus?.full_name || "Priya Sharma"}
              </h4>
              <p className="text-xs text-slate-500">
                {goal.alumnus?.job_title || "Senior PM"} @ {goal.alumnus?.company || "Stripe"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dual Confirmation Status Panel */}
      <Card className="border-indigo-200/80 bg-indigo-50/20 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base text-indigo-950 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-600" />
              <span>Mutual Completion Dual-Confirmation Guardrail</span>
            </CardTitle>
            {isFulfilled ? (
              <Badge variant="success">Mutually Fulfilled 🎉</Badge>
            ) : (
              <Badge variant="warning">Confirmation Pending</Badge>
            )}
          </div>
          <CardDescription className="text-xs text-slate-600">
            Per SyncTies Core Principle #5: A goal is marked fulfilled only after BOTH student and alumnus explicitly confirm completion.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Student confirmation status */}
            <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
              <span className="font-medium text-slate-700">Student Confirmation:</span>
              {isStudentConfirmed ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" /> Confirmed
                </span>
              ) : (
                <span className="text-amber-600 font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Awaiting Student
                </span>
              )}
            </div>

            {/* Alumnus confirmation status */}
            <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
              <span className="font-medium text-slate-700">Alumnus Confirmation:</span>
              {isAlumConfirmed ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" /> Confirmed
                </span>
              ) : (
                <span className="text-amber-600 font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Awaiting Alumnus
                </span>
              )}
            </div>
          </div>

          {!isFulfilled && (
            <div className="flex items-center justify-between pt-2 border-t border-indigo-100">
              <span className="text-xs text-slate-500">
                Have you finished your mock interview / mentoring session?
              </span>
              <Button
                size="sm"
                variant="primary"
                onClick={handleConfirmCompletion}
                isLoading={confirmLoading}
                className="text-xs"
              >
                Confirm Completion
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress & Milestone Updates Thread */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span>Collaboration Notes & Milestones</span>
          <span className="text-xs font-normal text-slate-500">({updates.length} updates)</span>
        </h3>

        <Card className="shadow-xs">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              {updates.map((u) => (
                <div
                  key={u.id}
                  className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span>{u.author?.full_name || "Participant"}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {new Date(u.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{u.content}</p>
                </div>
              ))}
            </div>

            {/* Add update form */}
            <form onSubmit={handleAddUpdate} className="pt-3 border-t border-slate-100 space-y-2">
              <Textarea
                placeholder="Share a milestone note, interview prompt link, or feedback summary..."
                value={updateText}
                onChange={(e) => setUpdateText(e.target.value)}
                rows={2}
                className="text-xs"
              />
              <div className="flex justify-end">
                <Button size="sm" type="submit" variant="secondary" isLoading={updateLoading} className="text-xs gap-1.5">
                  <Send className="h-3 w-3" />
                  <span>Post Update</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Post-Fulfillment Feedback Section */}
      {isFulfilled && (
        <Card className="border-emerald-200/80 bg-emerald-50/10 shadow-xs">
          <CardHeader>
            <CardTitle className="text-base text-slate-900 flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-600" />
              <span>Goal Outcome Feedback & Reputation</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Feedback can only be submitted after mutual fulfillment. Ratings and referral outcomes build the alumnus&apos;s verified impact profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {feedbackSubmitted ? (
              <div className="p-4 rounded-lg bg-white border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Feedback Recorded</span>
                </div>
                <p>
                  Your feedback and verified outcome have contributed to the alumni impact metrics.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Rating (1 to 5 Stars)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className={`p-1 text-lg transition-transform ${
                          rating >= star ? "text-amber-500 scale-110" : "text-slate-300"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="text-xs text-slate-500 ml-2">{rating} of 5 stars</span>
                  </div>
                </div>

                <Select
                  label="Referral Outcome Tracking (Voluntary)"
                  value={referralStatus}
                  onChange={(e) => setReferralStatus(e.target.value)}
                  options={[
                    { value: "none", label: "No referral requested / General mentorship only" },
                    { value: "offered", label: "Referral offered by alumnus" },
                    { value: "submitted", label: "Formal internal referral submitted" },
                    { value: "interview", label: "Candidate secured company interview" },
                    { value: "hired", label: "Candidate hired / offer accepted! 🎉" },
                  ]}
                />

                <Textarea
                  label="Comments on Support Received"
                  rows={3}
                  placeholder="What was most helpful? Constructive details help alumni understand their impact."
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                />

                <div className="flex justify-end">
                  <Button size="sm" type="submit" variant="primary" isLoading={feedbackLoading}>
                    Submit Outcome Feedback
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
