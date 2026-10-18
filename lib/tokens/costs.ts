/**
 * SyncTies Differentiated Token Cost Engine
 * Enforces specific token costs per mentorship category:
 * - Referral: 1.0 token
 * - Interview Prep / Mock Interview: 0.5 token
 * - Resume Review: 0.5 token
 * - Field / Career Guidance: 0.25 token
 * - Higher Education Guidance: 0.75 token
 * - Portfolio / Project / Other: 0.75 token
 */

export const HELP_TYPE_TOKEN_COSTS: Record<string, number> = {
  referral: 1.0,
  "mock-interview": 0.5,
  "resume-review": 0.5,
  "career-guidance": 0.25,
  "higher-ed-guidance": 0.75,
  "portfolio-review": 0.75,
  "project-guidance": 0.75,
  other: 0.75,
};

export interface TokenCostMeta {
  cost: number;
  label: string;
  category: string;
  badgeTone: "referral" | "interview" | "resume" | "guidance" | "higherEd" | "other";
  description: string;
}

export function getTokenCostForHelpType(slugOrName?: string | null): number {
  if (!slugOrName) return 0.5;
  const normalized = slugOrName.toLowerCase().trim();

  // Explicit dictionary key match first
  if (HELP_TYPE_TOKEN_COSTS[normalized] !== undefined) {
    return HELP_TYPE_TOKEN_COSTS[normalized];
  }

  // 1. Referral (1.0)
  if (normalized.includes("referral")) {
    return 1.0;
  }
  // 2. Mock Interview / Interview Prep (0.5)
  if (normalized.includes("interview") || normalized.includes("mock")) {
    return 0.5;
  }
  // 3. Resume Review (0.5)
  if (normalized.includes("resume") || normalized.includes("cv")) {
    return 0.5;
  }
  // 4. Higher Education Guidance (0.75)
  if (normalized.includes("higher") || normalized.includes("grad") || normalized.includes("education")) {
    return 0.75;
  }
  // 5. Portfolio / Project Guidance (0.75)
  if (
    normalized.includes("project") ||
    normalized.includes("portfolio") ||
    normalized.includes("capstone") ||
    normalized.includes("code")
  ) {
    return 0.75;
  }
  // 6. Field / Career Guidance (0.25)
  if (
    normalized.includes("field") ||
    normalized.includes("career") ||
    normalized.includes("guidance") ||
    normalized.includes("roadmap")
  ) {
    return 0.25;
  }

  return 0.75;
}

export function getTokenCostMeta(slugOrName?: string | null): TokenCostMeta {
  const cost = getTokenCostForHelpType(slugOrName);
  const normalized = (slugOrName || "").toLowerCase();

  if (cost === 1.0) {
    return {
      cost: 1.0,
      label: "1.0 Token",
      category: "Job / Referral",
      badgeTone: "referral",
      description: "Direct employee referral request (highest commitment)",
    };
  }

  if (cost === 0.5) {
    if (normalized.includes("interview") || normalized.includes("mock")) {
      return {
        cost: 0.5,
        label: "0.5 Token",
        category: "Interview Prep",
        badgeTone: "interview",
        description: "30-45 min live mock interview & product/tech drill",
      };
    }
    return {
      cost: 0.5,
      label: "0.5 Token",
      category: "Resume Review",
      badgeTone: "resume",
      description: "Line-by-line CV/Resume review with written markup",
    };
  }

  if (cost === 0.25) {
    return {
      cost: 0.25,
      label: "0.25 Token",
      category: "Field Guidance",
      badgeTone: "guidance",
      description: "Career roadmap & industry transition Q&A (lightest ask)",
    };
  }

  if (normalized.includes("higher") || normalized.includes("grad")) {
    return {
      cost: 0.75,
      label: "0.75 Token",
      category: "Higher Education",
      badgeTone: "higherEd",
      description: "Master/PhD university admissions & SOP review",
    };
  }

  return {
    cost: 0.75,
    label: "0.75 Token",
    category: "Specialized Mentoring",
    badgeTone: "other",
    description: "In-depth code portfolio or capstone project mentorship",
  };
}

/**
 * Cleanly format token values (e.g. 0.25, 0.5, 0.75, 1, 4, 4.25)
 */
export function formatTokens(val: number): string {
  if (Number.isInteger(val)) {
    return val.toString();
  }
  return val.toFixed(2).replace(/\.?0+$/, "");
}

/**
 * How many times a student can afford an action with their remaining tokens
 */
export function calculateAffordability(remaining: number, cost: number): number {
  if (cost <= 0) return 0;
  return Math.floor(remaining / cost);
}
