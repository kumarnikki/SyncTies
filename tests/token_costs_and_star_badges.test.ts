import { describe, it, expect } from "vitest";
import {
  getTokenCostForHelpType,
  getTokenCostMeta,
  formatTokens,
  calculateAffordability,
  HELP_TYPE_TOKEN_COSTS,
} from "@/lib/tokens/costs";
import { getAlumniStarLevel, getMentorBadges } from "@/lib/mentors/tiers";
import { validateRequestTransition, actionToRequestStatus } from "@/lib/connections/lifecycle";

describe("Token System & Cost Engine", () => {
  it("enforces exact token costs per category from specification", () => {
    // 1. Referral: 1.0 token
    expect(getTokenCostForHelpType("referral")).toBe(1.0);
    expect(getTokenCostForHelpType("Employee Referral Request")).toBe(1.0);
    expect(HELP_TYPE_TOKEN_COSTS["referral"]).toBe(1.0);

    // 2. Interview Prep / Mock Interview: 0.5 token
    expect(getTokenCostForHelpType("mock-interview")).toBe(0.5);
    expect(getTokenCostForHelpType("Mock Interview & Feedback")).toBe(0.5);
    expect(getTokenCostForHelpType("Interview Prep")).toBe(0.5);

    // 3. Resume Review: 0.5 token
    expect(getTokenCostForHelpType("resume-review")).toBe(0.5);
    expect(getTokenCostForHelpType("Resume & CV Review")).toBe(0.5);
    expect(getTokenCostForHelpType("CV Review")).toBe(0.5);

    // 4. Field Guidance / Career Guidance: 0.25 token
    expect(getTokenCostForHelpType("career-guidance")).toBe(0.25);
    expect(getTokenCostForHelpType("Field Guidance")).toBe(0.25);
    expect(getTokenCostForHelpType("Career Roadmap Guidance")).toBe(0.25);

    // 5. Higher Education: 0.75 token
    expect(getTokenCostForHelpType("higher-ed-guidance")).toBe(0.75);
    expect(getTokenCostForHelpType("Higher Education Guidance")).toBe(0.75);
    expect(getTokenCostForHelpType("Grad School Admissions")).toBe(0.75);

    // 6. Portfolio / Project / Other: 0.75 token
    expect(getTokenCostForHelpType("portfolio-review")).toBe(0.75);
    expect(getTokenCostForHelpType("project-guidance")).toBe(0.75);
    expect(getTokenCostForHelpType("other")).toBe(0.75);
    expect(getTokenCostForHelpType("Capstone & Project Mentorship")).toBe(0.75);
  });

  it("provides rich metadata and badges for token costs", () => {
    const refMeta = getTokenCostMeta("referral");
    expect(refMeta.cost).toBe(1.0);
    expect(refMeta.category).toBe("Job / Referral");

    const interviewMeta = getTokenCostMeta("Mock Interview");
    expect(interviewMeta.cost).toBe(0.5);
    expect(interviewMeta.category).toBe("Interview Prep");

    const guidanceMeta = getTokenCostMeta("Field Guidance");
    expect(guidanceMeta.cost).toBe(0.25);
    expect(guidanceMeta.category).toBe("Field Guidance");
  });

  it("cleanly formats tokens avoiding floating point precision artifacts", () => {
    expect(formatTokens(1.0)).toBe("1");
    expect(formatTokens(4)).toBe("4");
    expect(formatTokens(0.5)).toBe("0.5");
    expect(formatTokens(0.25)).toBe("0.25");
    expect(formatTokens(0.75)).toBe("0.75");
    expect(formatTokens(3.25)).toBe("3.25");
    expect(formatTokens(4.5)).toBe("4.5");
  });

  it("calculates correct affordability counts for remaining token balance", () => {
    // 4 tokens remaining
    expect(calculateAffordability(4, 1.0)).toBe(4); // 4 referrals
    expect(calculateAffordability(4, 0.5)).toBe(8); // 8 mock interviews
    expect(calculateAffordability(4, 0.25)).toBe(16); // 16 guidance sessions
    expect(calculateAffordability(4, 0.75)).toBe(5); // 5 project reviews

    // 1 token remaining
    expect(calculateAffordability(1, 1.0)).toBe(1);
    expect(calculateAffordability(1, 0.5)).toBe(2);
    expect(calculateAffordability(1, 0.25)).toBe(4);
    expect(calculateAffordability(1, 0.75)).toBe(1);

    // 0 tokens remaining
    expect(calculateAffordability(0, 0.5)).toBe(0);
  });
});

describe("Star Badge System & Alumni Rating Levels", () => {
  it("computes 5-Star Master Mentor for top tier alumni", () => {
    const star5 = getAlumniStarLevel({
      distinctMentees: 5,
      completedGoals: 3,
      avgRating: 5.0,
      reviewCount: 3,
      responseTimeHours: 12,
    });

    expect(star5.starCount).toBe(5);
    expect(star5.starsText).toBe("★★★★★");
    expect(star5.title).toBe("5-Star Master Mentor");
    expect(star5.badgeLabel).toBe("Hall of Fame");
    expect(star5.perks.length).toBeGreaterThanOrEqual(3);
  });

  it("computes 4-Star Distinguished Mentor when rating is between 4.8 and 4.9", () => {
    const star4 = getAlumniStarLevel({
      distinctMentees: 2,
      completedGoals: 1,
      avgRating: 4.8,
      responseTimeHours: 36,
    });

    expect(star4.starCount).toBe(4);
    expect(star4.title).toBe("4-Star Distinguished Mentor");
    expect(star4.badgeLabel).toBe("Distinguished");
  });

  it("computes baseline 1-Star Verified Alumnus for new verified alumni", () => {
    const star1 = getAlumniStarLevel({
      distinctMentees: 0,
      completedGoals: 0,
      avgRating: 5.0,
    });

    expect(star1.starCount).toBe(1);
    expect(star1.title).toBe("1-Star Verified Alumnus");
  });

  it("includes all requested star badges in the badge shelf", () => {
    const badges = getMentorBadges({
      distinctMentees: 2,
      completedGoals: 2,
      avgRating: 5.0,
      reviewCount: 2,
      confirmedHours: 8,
    });

    const badgeIds = badges.map((b) => b.id);
    expect(badgeIds).toContain("verified_alumnus");
    expect(badgeIds).toContain("five_star");
    expect(badgeIds).toContain("lightning_star");
    expect(badgeIds).toContain("goal_finisher");
    expect(badgeIds).toContain("superstar_referrer");
    expect(badgeIds).toContain("diamond_star");

    const fiveStarBadge = badges.find((b) => b.id === "five_star");
    expect(fiveStarBadge?.name).toBe("5.0 Star Mentor");
    expect(fiveStarBadge?.earned).toBe(true);

    const lightningBadge = badges.find((b) => b.id === "lightning_star");
    expect(lightningBadge?.name).toBe("Lightning Star (< 18h)");
    expect(lightningBadge?.earned).toBe(true);

    const perfectionBadge = badges.find((b) => b.id === "goal_finisher");
    expect(perfectionBadge?.name).toBe("Perfection Star");
    expect(perfectionBadge?.earned).toBe(true);
  });
});

describe("Repeat Contact Review / Ignore Workflow", () => {
  it("allows alumni to ignore a pending repeat contact request", () => {
    const validation = validateRequestTransition("pending", "ignore", "alum");
    expect(validation.allowed).toBe(true);
    expect(actionToRequestStatus("ignore")).toBe("ignored");
  });

  it("prevents students from ignoring a request", () => {
    const validation = validateRequestTransition("pending", "ignore", "student");
    expect(validation.allowed).toBe(false);
  });

  it("treats ignored as terminal state that cannot be transitioned", () => {
    const validation = validateRequestTransition("ignored", "accept", "alum");
    expect(validation.allowed).toBe(false);
  });
});
