import {
  Profile,
  Domain,
  HelpType,
  Intent,
  Offer,
  MatchResult,
  ConnectionRequest,
  Goal,
  Feedback,
  TokenSummary,
  CapacitySummary,
} from "@/types/database";
import {
  calculateDomainOverlap,
  calculateHelpTypeScore,
  calculateCapacityScore,
  calculateRecentActivityScore,
  calculateTotalMatchScore,
  compareCandidates,
} from "@/lib/matching/score";

// Canonical Domains Seed
export const CANONICAL_DOMAINS: Domain[] = [
  { id: "11111111-1111-1111-1111-111111111101", slug: "computer-science", name: "Computer Science", category: "Technology", is_active: true },
  { id: "11111111-1111-1111-1111-111111111102", slug: "data-science", name: "Data Science", category: "Technology", is_active: true },
  { id: "11111111-1111-1111-1111-111111111103", slug: "ai-ml", name: "AI & Machine Learning", category: "Technology", is_active: true },
  { id: "11111111-1111-1111-1111-111111111104", slug: "web-development", name: "Web Development", category: "Technology", is_active: true },
  { id: "11111111-1111-1111-1111-111111111105", slug: "cybersecurity", name: "Cybersecurity", category: "Technology", is_active: true },
  { id: "11111111-1111-1111-1111-111111111106", slug: "product-management", name: "Product Management", category: "Business & Product", is_active: true },
  { id: "11111111-1111-1111-1111-111111111107", slug: "finance", name: "Finance & Investment", category: "Business & Finance", is_active: true },
  { id: "11111111-1111-1111-1111-111111111108", slug: "consulting", name: "Consulting & Strategy", category: "Business & Strategy", is_active: true },
  { id: "11111111-1111-1111-1111-111111111109", slug: "design", name: "UI/UX & Product Design", category: "Design", is_active: true },
  { id: "11111111-1111-1111-1111-111111111110", slug: "research", name: "Academic & Industrial Research", category: "Research", is_active: true },
  { id: "11111111-1111-1111-1111-111111111111", slug: "entrepreneurship", name: "Entrepreneurship & Startups", category: "Business", is_active: true },
  { id: "11111111-1111-1111-1111-111111111112", slug: "marketing", name: "Growth & Marketing", category: "Business", is_active: true },
  { id: "11111111-1111-1111-1111-111111111113", slug: "healthcare", name: "Healthcare & BioTech", category: "Life Sciences", is_active: true },
  { id: "11111111-1111-1111-1111-111111111114", slug: "other", name: "Other Professional Domains", category: "General", is_active: true },
];

// Canonical Help Types Seed
export const CANONICAL_HELP_TYPES: HelpType[] = [
  { id: "22222222-2222-2222-2222-222222222201", slug: "referral", name: "Job or Internship Referral", description: "Direct internal employee referral for an active opening", is_active: true },
  { id: "22222222-2222-2222-2222-222222222202", slug: "mock-interview", name: "Mock Interview & Feedback", description: "Technical, behavioral, or product case interview simulation", is_active: true },
  { id: "22222222-2222-2222-2222-222222222203", slug: "resume-review", name: "Resume & CV Review", description: "Constructive critique and line-by-line feedback on your resume", is_active: true },
  { id: "22222222-2222-2222-2222-222222222204", slug: "career-guidance", name: "Career & Field Guidance", description: "Strategic advice on role transitions, career roadmap, and industry trends", is_active: true },
  { id: "22222222-2222-2222-2222-222222222205", slug: "higher-ed-guidance", name: "Higher Education Guidance", description: "Advice on master degrees, PhD applications, GRE/GMAT, and universities", is_active: true },
  { id: "22222222-2222-2222-2222-222222222206", slug: "portfolio-review", name: "Portfolio & Code Review", description: "Review of design portfolio, GitHub projects, or open-source PRs", is_active: true },
  { id: "22222222-2222-2222-2222-222222222207", slug: "project-guidance", name: "Capstone & Project Mentorship", description: "Technical direction on university or side projects", is_active: true },
  { id: "22222222-2222-2222-2222-222222222208", slug: "other", name: "General Mentoring", description: "Custom professional discussion", is_active: true },
];

export const HELP_TYPE_COMPATIBILITY_MAP: Record<string, number> = {
  // exact matches are 100
  "22222222-2222-2222-2222-222222222201:22222222-2222-2222-2222-222222222201": 100,
  "22222222-2222-2222-2222-222222222202:22222222-2222-2222-2222-222222222202": 100,
  "22222222-2222-2222-2222-222222222203:22222222-2222-2222-2222-222222222203": 100,
  "22222222-2222-2222-2222-222222222204:22222222-2222-2222-2222-222222222204": 100,
  "22222222-2222-2222-2222-222222222205:22222222-2222-2222-2222-222222222205": 100,
  "22222222-2222-2222-2222-222222222206:22222222-2222-2222-2222-222222222206": 100,
  "22222222-2222-2222-2222-222222222207:22222222-2222-2222-2222-222222222207": 100,
  "22222222-2222-2222-2222-222222222208:22222222-2222-2222-2222-222222222208": 100,
  // related
  "22222222-2222-2222-2222-222222222202:22222222-2222-2222-2222-222222222204": 70, // mock interview -> career guidance
  "22222222-2222-2222-2222-222222222203:22222222-2222-2222-2222-222222222204": 70, // resume review -> career guidance
  "22222222-2222-2222-2222-222222222206:22222222-2222-2222-2222-222222222203": 70, // portfolio -> resume review
  "22222222-2222-2222-2222-222222222207:22222222-2222-2222-2222-222222222204": 70, // capstone -> career guidance
  "22222222-2222-2222-2222-222222222201:22222222-2222-2222-2222-222222222202": 40, // referral -> mock interview
  "22222222-2222-2222-2222-222222222201:22222222-2222-2222-2222-222222222203": 40, // referral -> resume review
  "22222222-2222-2222-2222-222222222205:22222222-2222-2222-2222-222222222204": 70, // higher ed -> career guidance
};

// ─────────────────────────────────────────────────────────────────────────────
// SEED PROFILES — 7 alumni (Tiers: Guide × 2, Senior × 3, Distinguished × 2)
//                  3 students (Study Years: 4th, 3rd, 2nd)
// ─────────────────────────────────────────────────────────────────────────────
export const SEED_PROFILES: Profile[] = [
  // ===== ALUMNI =====
  {
    id: "33333333-3333-3333-3333-333333333301",
    email: "priya.sharma@alumni.edu",
    full_name: "Priya Sharma",
    avatar_url: "https://i.pravatar.cc/150?u=priya",
    role: "alum",
    institution: "Tech University",
    graduation_year: 2023,
    job_title: "Senior Product Manager",
    company: "Stripe",
    industry: "FinTech & Payments",
    bio: "Ex-APM at Google, currently building global billing infrastructure at Stripe. Happy to conduct mock PM interviews and product sense drills. 8 mentees placed in top product companies.",
    verification_status: "verified",
    is_active: true,
    last_active_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4h ago
    created_at: "2026-08-01T00:00:00Z",
    updated_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333302",
    email: "marcus.chen@alumni.edu",
    full_name: "Marcus Chen",
    avatar_url: "https://i.pravatar.cc/150?u=marcus",
    role: "alum",
    institution: "Tech University",
    graduation_year: 2022,
    job_title: "Staff Machine Learning Engineer",
    company: "DeepMind",
    industry: "Artificial Intelligence",
    bio: "Working on generative AI systems at DeepMind. Can assist students with technical interview prep, AI capstone design, and PhD applications. Published 3 papers at NeurIPS/ICML.",
    verification_status: "verified",
    is_active: true,
    last_active_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    created_at: "2026-08-01T00:00:00Z",
    updated_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333303",
    email: "ananya.patel@alumni.edu",
    full_name: "Ananya Patel",
    avatar_url: "https://i.pravatar.cc/150?u=ananya",
    role: "alum",
    institution: "Tech University",
    graduation_year: 2024,
    job_title: "Full-Stack Software Engineer",
    company: "Vercel",
    industry: "Developer Tools",
    bio: "Recent 2024 graduate! Built web systems with Next.js, TypeScript, and edge computing at Vercel. Excited to review junior resumes and code portfolios — I know exactly what SWE hiring teams look for.",
    verification_status: "verified",
    is_active: true,
    last_active_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    created_at: "2026-08-01T00:00:00Z",
    updated_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333305",
    email: "rahul.gupta@alumni.edu",
    full_name: "Rahul Gupta",
    avatar_url: "https://i.pravatar.cc/150?u=rahulg",
    role: "alum",
    institution: "Tech University",
    graduation_year: 2021,
    job_title: "Senior Consultant",
    company: "McKinsey & Company",
    industry: "Consulting & Strategy",
    bio: "4+ years in management consulting across APAC and North America. Passionate about guiding students through case interview prep and strategy career transitions. 15 students mentored into consulting.",
    verification_status: "verified",
    is_active: true,
    last_active_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
    created_at: "2026-08-10T00:00:00Z",
    updated_at: "2026-08-10T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333306",
    email: "sana.mirza@alumni.edu",
    full_name: "Sana Mirza",
    avatar_url: "https://i.pravatar.cc/150?u=sanam",
    role: "alum",
    institution: "Tech University",
    graduation_year: 2025,
    job_title: "UX Design Lead",
    company: "Figma",
    industry: "Design & Creative Tools",
    bio: "Leading design systems and product design at Figma. Open to reviewing portfolios, design case studies, and helping students break into UX. 3 mentees now work at top design studios.",
    verification_status: "verified",
    is_active: true,
    last_active_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3h ago
    created_at: "2026-08-15T00:00:00Z",
    updated_at: "2026-08-15T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333307",
    email: "arjun.nair@alumni.edu",
    full_name: "Arjun Nair",
    avatar_url: "https://i.pravatar.cc/150?u=arjunn",
    role: "alum",
    institution: "Tech University",
    graduation_year: 2020,
    job_title: "Quantitative Analyst",
    company: "Goldman Sachs",
    industry: "Investment Banking & Finance",
    bio: "5 years in quantitative finance at Goldman Sachs. Deep expertise in algo trading, risk modelling, and breaking into investment banking from a CS background. Active referrer for qualified candidates.",
    verification_status: "verified",
    is_active: true,
    last_active_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    created_at: "2026-08-05T00:00:00Z",
    updated_at: "2026-08-05T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333308",
    email: "nisha.verma@alumni.edu",
    full_name: "Nisha Verma",
    avatar_url: "https://i.pravatar.cc/150?u=nishav",
    role: "alum",
    institution: "Tech University",
    graduation_year: 2019,
    job_title: "Engineering Manager",
    company: "Microsoft",
    industry: "Enterprise Software",
    bio: "Led 20+ engineers on Microsoft Azure. Happy to discuss FAANG interview strategies, engineering leadership paths, and referral opportunities. Distinguished Mentor with 12 successful mentees.",
    verification_status: "verified",
    is_active: true,
    last_active_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6h ago
    created_at: "2026-07-20T00:00:00Z",
    updated_at: "2026-07-20T00:00:00Z",
  },
  // ===== STUDENTS =====
  // 4th Year — Rohan (primary demo student, grad 2027)
  {
    id: "33333333-3333-3333-3333-333333333304",
    email: "rohan.deshmukh@student.edu",
    full_name: "Rohan Deshmukh",
    avatar_url: "https://i.pravatar.cc/150?u=rohand",
    role: "student",
    institution: "Tech University",
    study_year: 4,
    expected_graduation_year: 2027,
    bio: "Final year Computer Science student targeting associate product manager and software engineering graduate roles at Stripe, Razorpay, and Google.",
    verification_status: "verified",
    is_active: true,
    last_active_at: new Date().toISOString(),
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-09-01T00:00:00Z",
  },
  // 3rd Year — Dev (grad 2028)
  {
    id: "33333333-3333-3333-3333-333333333310",
    email: "dev.mehta@student.edu",
    full_name: "Dev Mehta",
    avatar_url: "https://i.pravatar.cc/150?u=devm",
    role: "student",
    institution: "Tech University",
    study_year: 3,
    expected_graduation_year: 2028,
    bio: "3rd-year CS student with strong passion for UI/UX design and front-end engineering. Seeking portfolio reviews and design mentorship to pivot into product design roles.",
    verification_status: "verified",
    is_active: true,
    last_active_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    created_at: "2026-09-10T00:00:00Z",
    updated_at: "2026-09-10T00:00:00Z",
  },
  // 2nd Year — Aisha (grad 2029)
  {
    id: "33333333-3333-3333-3333-333333333309",
    email: "aisha.khan@student.edu",
    full_name: "Aisha Khan",
    avatar_url: "https://i.pravatar.cc/150?u=aishak",
    role: "student",
    institution: "Tech University",
    study_year: 2,
    expected_graduation_year: 2029,
    bio: "Second-year student diving deep into AI/ML and data science. Looking for research guidance and summer 2027 internship referrals. Building an NLP sentiment analysis capstone project.",
    verification_status: "verified",
    is_active: true,
    last_active_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2h ago
    created_at: "2026-09-05T00:00:00Z",
    updated_at: "2026-09-05T00:00:00Z",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SEED OFFERS — 8 active alumni offers across diverse industries & help types
// ─────────────────────────────────────────────────────────────────────────────
export const SEED_OFFERS: (Offer & { domain_ids: string[] })[] = [
  // Priya — Product Management Mock Interview (with APM referral at Stripe)
  {
    id: "44444444-4444-4444-4444-444444444401",
    user_id: "33333333-3333-3333-3333-333333333301",
    title: "Product Management Mock Interviews & Portfolio Critique",
    description: "45-minute structured mock interview with real product design, prioritization, and analytical case prompts, followed by detailed feedback and score breakdown.",
    help_type_id: "22222222-2222-2222-2222-222222222202", // Mock Interview
    status: "active",
    opportunity_available: true,
    opportunity_title: "APM Fall 2027 Referral at Stripe",
    opportunity_company: "Stripe",
    domain_ids: [
      "11111111-1111-1111-1111-111111111106", // Product Management
      "11111111-1111-1111-1111-111111111107", // Finance
    ],
    created_at: "2026-08-01T00:00:00Z",
    updated_at: "2026-08-01T00:00:00Z",
  },
  // Marcus — AI/ML Career Guidance (PhD applications)
  {
    id: "44444444-4444-4444-4444-444444444402",
    user_id: "33333333-3333-3333-3333-333333333302",
    title: "AI/ML Systems Technical Architecture & Interview Prep",
    description: "Deep-dive on ML modelling, inference optimization, graduate research directions, and PhD application strategy for top CS programmes.",
    help_type_id: "22222222-2222-2222-2222-222222222204", // Career Guidance
    status: "active",
    opportunity_available: false,
    domain_ids: [
      "11111111-1111-1111-1111-111111111103", // AI/ML
      "11111111-1111-1111-1111-111111111102", // Data Science
      "11111111-1111-1111-1111-111111111101", // CS
    ],
    created_at: "2026-08-01T00:00:00Z",
    updated_at: "2026-08-01T00:00:00Z",
  },
  // Marcus — Higher Ed Guidance (bonus offer)
  {
    id: "44444444-4444-4444-4444-444444444409",
    user_id: "33333333-3333-3333-3333-333333333302",
    title: "PhD & Research Masters Application Guidance",
    description: "How to choose the right research lab, craft a strong Statement of Purpose, and reach out to potential advisors. Covers GRE, TOEFL, and fellowship applications.",
    help_type_id: "22222222-2222-2222-2222-222222222205", // Higher Ed Guidance
    status: "active",
    opportunity_available: false,
    domain_ids: [
      "11111111-1111-1111-1111-111111111103", // AI/ML
      "11111111-1111-1111-1111-111111111110", // Research
    ],
    created_at: "2026-08-01T00:00:00Z",
    updated_at: "2026-08-01T00:00:00Z",
  },
  // Ananya — Resume Review (SWE openings at Vercel)
  {
    id: "44444444-4444-4444-4444-444444444403",
    user_id: "33333333-3333-3333-3333-333333333303",
    title: "Frontend & Full-Stack Resume Line-by-Line Review",
    description: "Detailed actionable feedback on presenting GitHub projects, Next.js applications, and system design on your resume. I'll review it as a hiring manager would.",
    help_type_id: "22222222-2222-2222-2222-222222222203", // Resume Review
    status: "active",
    opportunity_available: true,
    opportunity_title: "Software Engineer I — New Grad 2027",
    opportunity_company: "Vercel",
    domain_ids: [
      "11111111-1111-1111-1111-111111111104", // Web Dev
      "11111111-1111-1111-1111-111111111101", // CS
    ],
    created_at: "2026-08-01T00:00:00Z",
    updated_at: "2026-08-01T00:00:00Z",
  },
  // Rahul — Consulting Case Interview Prep
  {
    id: "44444444-4444-4444-4444-444444444404",
    user_id: "33333333-3333-3333-3333-333333333305",
    title: "McKinsey-Style Case Interview Coaching & Fit Interview Prep",
    description: "Structured case interview coaching with market sizing, profitability, and M&A cases. Includes fit interview story frameworks (STAR method) and office selection advice.",
    help_type_id: "22222222-2222-2222-2222-222222222202", // Mock Interview
    status: "active",
    opportunity_available: true,
    opportunity_title: "Business Analyst 2027 Referral",
    opportunity_company: "McKinsey & Company",
    domain_ids: [
      "11111111-1111-1111-1111-111111111108", // Consulting
      "11111111-1111-1111-1111-111111111106", // Product Management
    ],
    created_at: "2026-08-10T00:00:00Z",
    updated_at: "2026-08-10T00:00:00Z",
  },
  // Sana — UX Portfolio Review
  {
    id: "44444444-4444-4444-4444-444444444405",
    user_id: "33333333-3333-3333-3333-333333333306",
    title: "UX Portfolio Review & Design Case Study Walkthrough",
    description: "30-minute review of your design portfolio, critique of case studies, and guidance on presenting design decisions confidently during interviews. Figma file reviews welcome.",
    help_type_id: "22222222-2222-2222-2222-222222222206", // Portfolio Review
    status: "active",
    opportunity_available: false,
    domain_ids: [
      "11111111-1111-1111-1111-111111111109", // Design
      "11111111-1111-1111-1111-111111111106", // Product Management
    ],
    created_at: "2026-08-15T00:00:00Z",
    updated_at: "2026-08-15T00:00:00Z",
  },
  // Arjun — Finance Referral & Career Guidance
  {
    id: "44444444-4444-4444-4444-444444444406",
    user_id: "33333333-3333-3333-3333-333333333307",
    title: "Investment Banking & Quant Finance Career Guidance",
    description: "Advice on breaking into IB, asset management, or quantitative roles from a CS/engineering background. Includes resume tips for financial roles and technical screening prep.",
    help_type_id: "22222222-2222-2222-2222-222222222201", // Referral
    status: "active",
    opportunity_available: true,
    opportunity_title: "Analyst 2027 Openings — Markets Division",
    opportunity_company: "Goldman Sachs",
    domain_ids: [
      "11111111-1111-1111-1111-111111111107", // Finance
      "11111111-1111-1111-1111-111111111101", // CS
    ],
    created_at: "2026-08-05T00:00:00Z",
    updated_at: "2026-08-05T00:00:00Z",
  },
  // Nisha — FAANG Mock Interview & Referral (full capacity — Distinguished Mentor)
  {
    id: "44444444-4444-4444-4444-444444444407",
    user_id: "33333333-3333-3333-3333-333333333308",
    title: "FAANG Technical Mock Interview & System Design Review",
    description: "2-hour mock coding + system design session mirroring real Microsoft/Google interviews. Detailed debrief afterwards. Occasional referral slots available for exceptional candidates.",
    help_type_id: "22222222-2222-2222-2222-222222222202", // Mock Interview
    status: "active",
    opportunity_available: true,
    opportunity_title: "SWE New Grad 2027 — Azure Infra Team",
    opportunity_company: "Microsoft",
    domain_ids: [
      "11111111-1111-1111-1111-111111111101", // CS
      "11111111-1111-1111-1111-111111111104", // Web Dev
    ],
    created_at: "2026-07-20T00:00:00Z",
    updated_at: "2026-07-20T00:00:00Z",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SEED CAPACITIES — distinct_mentees drives tier:
//   Guide (1-3), Senior Mentor (4-7), Distinguished Mentor (8+)
// ─────────────────────────────────────────────────────────────────────────────
export const SEED_CAPACITIES: Record<string, CapacitySummary> = {
  // Priya — Senior Mentor (5 mentees), 2 of 4 slots used, 2 open
  "33333333-3333-3333-3333-333333333301": {
    monthly_limit: 4,
    reserved_count: 1,
    processed_count: 1,
    remaining_capacity: 2,
    period_start: "2026-10-01",
  },
  // Marcus — Senior Mentor (6 mentees), 1 of 3 slots used, 2 open
  "33333333-3333-3333-3333-333333333302": {
    monthly_limit: 3,
    reserved_count: 0,
    processed_count: 1,
    remaining_capacity: 2,
    period_start: "2026-10-01",
  },
  // Ananya — Guide (2 mentees), 0 of 5 slots used, fully open
  "33333333-3333-3333-3333-333333333303": {
    monthly_limit: 5,
    reserved_count: 0,
    processed_count: 0,
    remaining_capacity: 5,
    period_start: "2026-10-01",
  },
  // Rahul — Distinguished Mentor (15 mentees), 1 of 3 used, 2 open
  "33333333-3333-3333-3333-333333333305": {
    monthly_limit: 3,
    reserved_count: 1,
    processed_count: 0,
    remaining_capacity: 2,
    period_start: "2026-10-01",
  },
  // Sana — Senior Mentor (3 mentees), 2 of 4 used, 2 open
  "33333333-3333-3333-3333-333333333306": {
    monthly_limit: 4,
    reserved_count: 0,
    processed_count: 2,
    remaining_capacity: 2,
    period_start: "2026-10-01",
  },
  // Arjun — Senior Mentor (8 mentees), 3 of 3 used, 0 open (full this month)
  "33333333-3333-3333-3333-333333333307": {
    monthly_limit: 3,
    reserved_count: 1,
    processed_count: 2,
    remaining_capacity: 0,
    period_start: "2026-10-01",
  },
  // Nisha — Distinguished Mentor (12 mentees), 1 of 5 used, 4 open
  "33333333-3333-3333-3333-333333333308": {
    monthly_limit: 5,
    reserved_count: 1,
    processed_count: 0,
    remaining_capacity: 4,
    period_start: "2026-10-01",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SEED INTENTS — 3 students' active help requests
// ─────────────────────────────────────────────────────────────────────────────
export const SEED_INTENTS: (Intent & { domain_ids: string[] })[] = [
  // Rohan (4th year) — APM Mock Interview Prep
  {
    id: "55555555-5555-5555-5555-555555555501",
    user_id: "33333333-3333-3333-3333-333333333304",
    title: "Prepare for Associate Product Manager Case Interviews",
    description: "Looking for advice and mock case interviews focused on product sense, metric definitions, and fintech trade-offs before upcoming campus placements. Target companies: Stripe, Razorpay, Google.",
    help_type_id: "22222222-2222-2222-2222-222222222202", // Mock Interview
    status: "open",
    target_role: "Associate Product Manager",
    target_company: "Stripe, Razorpay, or Google",
    domain_ids: [
      "11111111-1111-1111-1111-111111111106", // Product Management
      "11111111-1111-1111-1111-111111111107", // Finance
    ],
    created_at: "2026-10-10T10:00:00Z",
    updated_at: "2026-10-10T10:00:00Z",
  },
  // Dev (3rd year) — UX Portfolio Review
  {
    id: "55555555-5555-5555-5555-555555555502",
    user_id: "33333333-3333-3333-3333-333333333310",
    title: "UX Portfolio Critique & Product Design Interview Guidance",
    description: "I have 4 design projects in my portfolio and need feedback on how to present design decisions clearly. Preparing for summer 2027 internship applications at Figma, Notion, and Linear.",
    help_type_id: "22222222-2222-2222-2222-222222222206", // Portfolio Review
    status: "open",
    target_role: "Product Designer / UX Intern",
    target_company: "Figma, Notion, or Linear",
    domain_ids: [
      "11111111-1111-1111-1111-111111111109", // Design
      "11111111-1111-1111-1111-111111111106", // Product Management
    ],
    created_at: "2026-10-12T09:00:00Z",
    updated_at: "2026-10-12T09:00:00Z",
  },
  // Aisha (2nd year) — AI/ML Research Guidance
  {
    id: "55555555-5555-5555-5555-555555555503",
    user_id: "33333333-3333-3333-3333-333333333309",
    title: "AI/ML Research Direction & PhD Application Advice",
    description: "Currently building an NLP capstone project for sentiment analysis. Seeking advice on strengthening my research profile, finding the right ML labs, and preparing a strong PhD application for 2028 intake.",
    help_type_id: "22222222-2222-2222-2222-222222222205", // Higher Ed Guidance
    status: "open",
    target_role: "ML Research Intern / PhD Candidate",
    target_company: "DeepMind, OpenAI, CMU, Stanford",
    domain_ids: [
      "11111111-1111-1111-1111-111111111103", // AI/ML
      "11111111-1111-1111-1111-111111111102", // Data Science
      "11111111-1111-1111-1111-111111111110", // Research
    ],
    created_at: "2026-10-13T11:00:00Z",
    updated_at: "2026-10-13T11:00:00Z",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SEED REQUESTS — 5 connection requests across all statuses
// ─────────────────────────────────────────────────────────────────────────────
export const SEED_REQUESTS: ConnectionRequest[] = [
  // 1. Rohan → Priya: ACCEPTED (fulfilled goal)
  {
    id: "66666666-6666-6666-6666-666666666601",
    student_id: "33333333-3333-3333-3333-333333333304",
    alum_id: "33333333-3333-3333-3333-333333333301",
    intent_id: "55555555-5555-5555-5555-555555555501",
    offer_id: "44444444-4444-4444-4444-444444444401",
    status: "accepted",
    student_message: "Hi Priya! I loved your article on Stripe billing APIs. I'm preparing for APM interviews and would value your feedback on my product design drill. Would 45 minutes this week work?",
    repeat_contact_in_month: false,
    alumni_response_note: "Happy to help Rohan! Let's schedule 45 mins this Saturday at 10 AM IST. I'll send a calendar invite.",
    expires_at: "2026-10-24T10:00:00Z",
    responded_at: "2026-10-11T14:30:00Z",
    created_at: "2026-10-10T12:00:00Z",
    updated_at: "2026-10-11T14:30:00Z",
  },
  // 2. Rohan → Marcus: PENDING
  {
    id: "66666666-6666-6666-6666-666666666602",
    student_id: "33333333-3333-3333-3333-333333333304",
    alum_id: "33333333-3333-3333-3333-333333333302",
    intent_id: "55555555-5555-5555-5555-555555555501",
    offer_id: "44444444-4444-4444-4444-444444444402",
    status: "pending",
    student_message: "Hi Marcus! I saw your NeurIPS paper on efficient transformers. I'm also building a side project using HuggingFace and would love 30 minutes of guidance on AI career paths vs. product roles.",
    repeat_contact_in_month: false,
    expires_at: "2026-10-25T10:00:00Z",
    created_at: "2026-10-15T08:00:00Z",
    updated_at: "2026-10-15T08:00:00Z",
  },
  // 3. Rohan → Nisha: REJECTED
  {
    id: "66666666-6666-6666-6666-666666666603",
    student_id: "33333333-3333-3333-3333-333333333304",
    alum_id: "33333333-3333-3333-3333-333333333308",
    intent_id: "55555555-5555-5555-5555-555555555501",
    offer_id: "44444444-4444-4444-4444-444444444407",
    status: "rejected",
    student_message: "Hi Nisha, I'm targeting SWE + APM roles this placement season. Could we schedule a mock interview focused on system design?",
    repeat_contact_in_month: false,
    alumni_response_note: "Hi Rohan, I'm fully booked for October. Please re-request in November — I'll have capacity then. Best of luck!",
    expires_at: "2026-10-22T10:00:00Z",
    responded_at: "2026-10-16T10:00:00Z",
    created_at: "2026-10-14T09:00:00Z",
    updated_at: "2026-10-16T10:00:00Z",
  },
  // 4. Dev → Sana: PENDING
  {
    id: "66666666-6666-6666-6666-666666666604",
    student_id: "33333333-3333-3333-3333-333333333310",
    alum_id: "33333333-3333-3333-3333-333333333306",
    intent_id: "55555555-5555-5555-5555-555555555502",
    offer_id: "44444444-4444-4444-4444-444444444405",
    status: "pending",
    student_message: "Hi Sana! I'm a 3rd-year student preparing my design portfolio for internship applications at Figma. I have 4 case studies — would you be open to reviewing them and giving feedback?",
    repeat_contact_in_month: false,
    expires_at: "2026-10-26T09:00:00Z",
    created_at: "2026-10-16T07:00:00Z",
    updated_at: "2026-10-16T07:00:00Z",
  },
  // 5. Aisha → Marcus: ACCEPTED
  {
    id: "66666666-6666-6666-6666-666666666605",
    student_id: "33333333-3333-3333-3333-333333333309",
    alum_id: "33333333-3333-3333-3333-333333333302",
    intent_id: "55555555-5555-5555-5555-555555555503",
    offer_id: "44444444-4444-4444-4444-444444444409",
    status: "accepted",
    student_message: "Hi Marcus! I'm a 2nd-year student building an NLP sentiment analysis project using BERT. I'm interested in PhD programmes in ML and would appreciate guidance on finding the right lab and crafting my SOP.",
    repeat_contact_in_month: false,
    alumni_response_note: "Great initiative, Aisha! Let's chat this week — I can share my own PhD application journey and give feedback on your project direction.",
    expires_at: "2026-10-27T11:00:00Z",
    responded_at: "2026-10-14T12:00:00Z",
    created_at: "2026-10-13T14:00:00Z",
    updated_at: "2026-10-14T12:00:00Z",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SEED GOALS — goals tied to accepted requests
// ─────────────────────────────────────────────────────────────────────────────
export const SEED_GOALS: Goal[] = [
  // Rohan + Priya — FULFILLED (mock interview completed)
  {
    id: "77777777-7777-7777-7777-777777777701",
    request_id: "66666666-6666-6666-6666-666666666601",
    student_id: "33333333-3333-3333-3333-333333333304",
    alum_id: "33333333-3333-3333-3333-333333333301",
    title: "Complete APM Mock Interview with Priya Sharma",
    description: "Complete 1 structured 45-minute mock PM interview covering product sense, prioritization, and fintech metrics. Review written debrief notes afterwards.",
    status: "fulfilled",
    student_confirmed_at: "2026-10-14T16:00:00Z",
    alum_confirmed_at: "2026-10-14T17:00:00Z",
    fulfilled_at: "2026-10-14T17:00:00Z",
    created_at: "2026-10-10T12:00:00Z",
    updated_at: "2026-10-14T17:00:00Z",
  },
  // Aisha + Marcus — IN PROGRESS
  {
    id: "77777777-7777-7777-7777-777777777702",
    request_id: "66666666-6666-6666-6666-666666666605",
    student_id: "33333333-3333-3333-3333-333333333309",
    alum_id: "33333333-3333-3333-3333-333333333302",
    title: "AI Research Direction & PhD Application Strategy Session",
    description: "60-minute discussion covering ideal ML research topics for Aisha's profile, shortlist of 5 target PhD programmes, and a first-draft review of her Statement of Purpose.",
    status: "in_progress",
    student_confirmed_at: null,
    alum_confirmed_at: null,
    fulfilled_at: null,
    created_at: "2026-10-14T12:00:00Z",
    updated_at: "2026-10-14T12:00:00Z",
  },
  // Rohan — OPEN (pending outcome of Marcus request)
  {
    id: "77777777-7777-7777-7777-777777777703",
    request_id: "66666666-6666-6666-6666-666666666602",
    student_id: "33333333-3333-3333-3333-333333333304",
    alum_id: "33333333-3333-3333-3333-333333333302",
    title: "AI Career Path Exploration with Marcus Chen",
    description: "Understand the trade-offs between AI research, SWE, and product roles from Marcus's experience. Decide whether to apply for SWE or APM tracks at AI-first companies.",
    status: "open",
    student_confirmed_at: null,
    alum_confirmed_at: null,
    fulfilled_at: null,
    created_at: "2026-10-15T08:00:00Z",
    updated_at: "2026-10-15T08:00:00Z",
  },
];

// In-Memory Database Store for Graceful Standalone/Local Operation
class LocalDataStore {
  profiles: Profile[] = [...SEED_PROFILES];
  domains: Domain[] = [...CANONICAL_DOMAINS];
  helpTypes: HelpType[] = [...CANONICAL_HELP_TYPES];
  offers: (Offer & { domain_ids: string[] })[] = [...SEED_OFFERS];
  intents: (Intent & { domain_ids: string[] })[] = [...SEED_INTENTS];
  requests: ConnectionRequest[] = [...SEED_REQUESTS];
  goals: Goal[] = [...SEED_GOALS];
  capacities: Record<string, CapacitySummary> = { ...SEED_CAPACITIES };
  // Token balances for 3 demo students
  studentTokens: Record<string, TokenSummary> = {
    // Rohan — 4th year, active: 4 of 5 tokens remaining
    "33333333-3333-3333-3333-333333333304": {
      tokens_granted: 5,
      tokens_spent: 1,
      tokens_remaining: 4,
      period_start: "2026-10-01",
    },
    // Dev — 3rd year, new: all 5 tokens available
    "33333333-3333-3333-3333-333333333310": {
      tokens_granted: 5,
      tokens_spent: 0,
      tokens_remaining: 5,
      period_start: "2026-10-01",
    },
    // Aisha — 2nd year, used 2 tokens (Marcus + pending request)
    "33333333-3333-3333-3333-333333333309": {
      tokens_granted: 5,
      tokens_spent: 1,
      tokens_remaining: 4,
      period_start: "2026-10-01",
    },
  };
  feedback: Feedback[] = [];

  getProfile(id: string): Profile | undefined {
    return this.profiles.find((p) => p.id === id);
  }

  saveProfile(profile: Partial<Profile> & { id: string }): Profile {
    const existingIndex = this.profiles.findIndex((p) => p.id === profile.id);
    if (existingIndex >= 0) {
      this.profiles[existingIndex] = {
        ...this.profiles[existingIndex],
        ...profile,
        updated_at: new Date().toISOString(),
      };
      return this.profiles[existingIndex];
    } else {
      const newP: Profile = {
        email: "user@example.com",
        full_name: "New User",
        role: "student",
        institution: "University Pilot",
        study_year: 3,
        verification_status: "verified",
        is_active: true,
        last_active_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...profile,
        id: profile.id,
      };
      this.profiles.push(newP);
      return newP;
    }
  }

  // Matching logic
  getMatchesForIntent(intentId: string, studentId: string): MatchResult[] {
    const intent = this.intents.find((i) => i.id === intentId && i.status === "open");
    if (!intent) return [];

    const requestedHelpTypeId = intent.help_type_id;
    const studentDomainIds = intent.domain_ids || [];

    const results: MatchResult[] = [];

    // Filter active alumni
    const alumni = this.profiles.filter(
      (p) => p.role === "alum" && p.is_active && p.id !== studentId
    );

    for (const alum of alumni) {
      // Find candidate's active offers
      const alumOffers = this.offers.filter((o) => o.user_id === alum.id && o.status === "active");
      if (alumOffers.length === 0) continue;

      const cap = this.capacities[alum.id] || {
        monthly_limit: 3,
        reserved_count: 0,
        processed_count: 0,
        remaining_capacity: 3,
        period_start: "2026-10-01",
      };

      if (cap.remaining_capacity <= 0) continue; // Exclude zero capacity

      // Check duplicate pending/accepted request
      const hasDuplicate = this.requests.some(
        (r) =>
          r.student_id === studentId &&
          r.alum_id === alum.id &&
          r.intent_id === intentId &&
          (r.status === "pending" || r.status === "accepted")
      );
      if (hasDuplicate) continue;

      // Repeat contact in current month?
      const isRepeat = this.requests.some(
        (r) => r.student_id === studentId && r.alum_id === alum.id
      );

      // Score best offer
      let bestOfferScore = -1;
      let bestOfferResult: MatchResult | null = null;

      for (const offer of alumOffers) {
        const dScore = calculateDomainOverlap(studentDomainIds, offer.domain_ids || []);
        const hScore = calculateHelpTypeScore(
          requestedHelpTypeId,
          [offer.help_type_id],
          HELP_TYPE_COMPATIBILITY_MAP
        );
        const cScore = calculateCapacityScore(cap.monthly_limit, cap.reserved_count + cap.processed_count);
        const rScore = calculateRecentActivityScore(alum.last_active_at);

        const totalScore = calculateTotalMatchScore(dScore, hScore, cScore, rScore);

        const helpTypeObj = this.helpTypes.find((ht) => ht.id === offer.help_type_id);
        const matchedDomains = this.domains
          .filter((d) => (offer.domain_ids || []).includes(d.id) && studentDomainIds.includes(d.id))
          .map((d) => ({ id: d.id, name: d.name, slug: d.slug }));

        const candidateResult: MatchResult = {
          alum_id: alum.id,
          full_name: alum.full_name,
          avatar_url: alum.avatar_url,
          job_title: alum.job_title || undefined,
          company: alum.company || undefined,
          industry: alum.industry || undefined,
          bio: alum.bio || undefined,
          graduation_year: alum.graduation_year || undefined,
          last_active_at: alum.last_active_at,
          offer_id: offer.id,
          offer_title: offer.title,
          offer_help_type_id: offer.help_type_id,
          offer_help_type_name: helpTypeObj?.name || "General Guidance",
          d_score: dScore,
          h_score: hScore,
          c_score: cScore,
          r_score: rScore,
          total_score: totalScore,
          matched_domains: matchedDomains,
          remaining_capacity: cap.remaining_capacity,
          monthly_limit: cap.monthly_limit,
          is_repeat_contact: isRepeat,
        };

        if (totalScore > bestOfferScore) {
          bestOfferScore = totalScore;
          bestOfferResult = candidateResult;
        }
      }

      if (bestOfferResult) {
        results.push(bestOfferResult);
      }
    }

    results.sort(compareCandidates);
    return results;
  }
}

// Global singleton instance for local runtime demo
export const localStore = new LocalDataStore();
