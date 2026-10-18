-- SyncTies Migration 007: Rich Demo Seed Data for Judge Showcase
-- Adds 7 alumni mentors, 3 student profiles, 8 offers, 3 intents,
-- 5 connection requests, 3 goals, and token/capacity records.
-- Safe to re-run: all inserts use ON CONFLICT DO NOTHING.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. DEMO AUTH USERS (create via Supabase auth admin API in production)
--    These UUIDs match the demo profiles below.
-- ─────────────────────────────────────────────────────────────────────────────
-- NOTE: Auth users cannot be created via SQL migration in Supabase.
-- Run `npx supabase functions invoke seed-demo-users` or use the Admin API.
-- The profiles below reference these UUIDs and will be orphaned until auth
-- users are created with matching IDs.

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. ALUMNI PROFILES (7 mentors — 3 tiers for showcase)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.profiles (
  id, email, full_name, avatar_url, role, institution,
  graduation_year, job_title, company, industry, bio,
  verification_status, is_active, last_active_at, created_at, updated_at
) VALUES

-- Guide Tier (2 mentees / fresh): Ananya Patel @ Vercel
('33333333-3333-3333-3333-333333333303',
 'ananya.patel@alumni.edu', 'Ananya Patel',
 'https://i.pravatar.cc/150?u=ananya',
 'alum', 'Tech University', 2024,
 'Full-Stack Software Engineer', 'Vercel', 'Developer Tools',
 'Recent 2024 graduate! Built web systems with Next.js, TypeScript, and edge computing at Vercel. Excited to review junior resumes and code portfolios.',
 'verified', true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '70 days', NOW() - INTERVAL '5 days'),

-- Guide Tier (fresh grad): Sana Mirza @ Figma
('33333333-3333-3333-3333-333333333306',
 'sana.mirza@alumni.edu', 'Sana Mirza',
 'https://i.pravatar.cc/150?u=sanam',
 'alum', 'Tech University', 2025,
 'UX Design Lead', 'Figma', 'Design & Creative Tools',
 'Leading design systems and product design at Figma. Open to reviewing portfolios, design case studies, and helping students break into UX. 3 mentees now work at top design studios.',
 'verified', true, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '60 days', NOW() - INTERVAL '3 hours'),

-- Senior Mentor (5 mentees): Priya Sharma @ Stripe
('33333333-3333-3333-3333-333333333301',
 'priya.sharma@alumni.edu', 'Priya Sharma',
 'https://i.pravatar.cc/150?u=priya',
 'alum', 'Tech University', 2023,
 'Senior Product Manager', 'Stripe', 'FinTech & Payments',
 'Ex-APM at Google, currently building global billing infrastructure at Stripe. Happy to conduct mock PM interviews and product sense drills. 8 mentees placed in top product companies.',
 'verified', true, NOW() - INTERVAL '4 hours', NOW() - INTERVAL '80 days', NOW() - INTERVAL '4 hours'),

-- Senior Mentor (6 mentees): Marcus Chen @ DeepMind
('33333333-3333-3333-3333-333333333302',
 'marcus.chen@alumni.edu', 'Marcus Chen',
 'https://i.pravatar.cc/150?u=marcus',
 'alum', 'Tech University', 2022,
 'Staff Machine Learning Engineer', 'DeepMind', 'Artificial Intelligence',
 'Working on generative AI systems at DeepMind. Can assist students with technical interview prep, AI capstone design, and PhD applications. Published 3 papers at NeurIPS/ICML.',
 'verified', true, NOW() - INTERVAL '2 days', NOW() - INTERVAL '90 days', NOW() - INTERVAL '2 days'),

-- Senior Mentor (5 mentees): Arjun Nair @ Goldman Sachs
('33333333-3333-3333-3333-333333333307',
 'arjun.nair@alumni.edu', 'Arjun Nair',
 'https://i.pravatar.cc/150?u=arjunn',
 'alum', 'Tech University', 2020,
 'Quantitative Analyst', 'Goldman Sachs', 'Investment Banking & Finance',
 'Five years in quantitative finance at Goldman Sachs. Deep expertise in algo trading, risk modelling, and breaking into investment banking from a CS background. Active referrer.',
 'verified', true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '100 days', NOW() - INTERVAL '3 days'),

-- Distinguished Mentor (15 mentees): Rahul Gupta @ McKinsey
('33333333-3333-3333-3333-333333333305',
 'rahul.gupta@alumni.edu', 'Rahul Gupta',
 'https://i.pravatar.cc/150?u=rahulg',
 'alum', 'Tech University', 2021,
 'Senior Consultant', 'McKinsey & Company', 'Consulting & Strategy',
 '4+ years in management consulting across APAC and North America. Passionate about case interview prep and strategy career transitions. 15 students mentored into consulting.',
 'verified', true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '110 days', NOW() - INTERVAL '1 day'),

-- Distinguished Mentor (12 mentees): Nisha Verma @ Microsoft
('33333333-3333-3333-3333-333333333308',
 'nisha.verma@alumni.edu', 'Nisha Verma',
 'https://i.pravatar.cc/150?u=nishav',
 'alum', 'Tech University', 2019,
 'Engineering Manager', 'Microsoft', 'Enterprise Software',
 'Led 20+ engineers on Microsoft Azure. Happy to discuss FAANG interview strategies, engineering leadership paths, and referral opportunities. Distinguished Mentor with 12 successful mentees.',
 'verified', true, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '120 days', NOW() - INTERVAL '6 hours')

ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url,
  job_title = EXCLUDED.job_title,
  company = EXCLUDED.company,
  industry = EXCLUDED.industry,
  bio = EXCLUDED.bio,
  verification_status = EXCLUDED.verification_status,
  is_active = EXCLUDED.is_active,
  last_active_at = EXCLUDED.last_active_at,
  updated_at = EXCLUDED.updated_at;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. STUDENT PROFILES (3 students — years 2, 3, 4)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.profiles (
  id, email, full_name, avatar_url, role, institution,
  study_year, expected_graduation_year, bio,
  verification_status, is_active, last_active_at, created_at, updated_at
) VALUES

-- 4th Year: Rohan Deshmukh (primary demo student)
('33333333-3333-3333-3333-333333333304',
 'rohan.deshmukh@student.edu', 'Rohan Deshmukh',
 'https://i.pravatar.cc/150?u=rohand',
 'student', 'Tech University',
 4, 2027,
 'Final year Computer Science student targeting associate product manager and software engineering graduate roles at Stripe, Razorpay, and Google.',
 'verified', true, NOW(), NOW() - INTERVAL '45 days', NOW()),

-- 3rd Year: Dev Mehta (UX/design focus)
('33333333-3333-3333-3333-333333333310',
 'dev.mehta@student.edu', 'Dev Mehta',
 'https://i.pravatar.cc/150?u=devm',
 'student', 'Tech University',
 3, 2028,
 '3rd-year CS student with strong passion for UI/UX design and front-end engineering. Seeking portfolio reviews and design mentorship to pivot into product design roles.',
 'verified', true, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '20 days', NOW() - INTERVAL '30 minutes'),

-- 2nd Year: Aisha Khan (AI/ML research focus)
('33333333-3333-3333-3333-333333333309',
 'aisha.khan@student.edu', 'Aisha Khan',
 'https://i.pravatar.cc/150?u=aishak',
 'student', 'Tech University',
 2, 2029,
 'Second-year student diving deep into AI/ML and data science. Looking for research guidance and summer 2027 internship referrals. Building an NLP sentiment analysis capstone project.',
 'verified', true, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '15 days', NOW() - INTERVAL '2 hours')

ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url,
  study_year = EXCLUDED.study_year,
  expected_graduation_year = EXCLUDED.expected_graduation_year,
  bio = EXCLUDED.bio,
  verification_status = EXCLUDED.verification_status,
  is_active = EXCLUDED.is_active,
  last_active_at = EXCLUDED.last_active_at,
  updated_at = EXCLUDED.updated_at;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. ALUMNI OFFERS (8 active offers)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.offers (
  id, user_id, title, description, help_type_id, status,
  opportunity_available, opportunity_title, opportunity_company,
  created_at, updated_at
) VALUES

-- Priya: PM Mock Interview + Stripe referral
('44444444-4444-4444-4444-444444444401',
 '33333333-3333-3333-3333-333333333301',
 'Product Management Mock Interviews & Portfolio Critique',
 '45-minute structured mock interview with real product design, prioritization, and analytical case prompts, followed by detailed feedback and score breakdown.',
 '22222222-2222-2222-2222-222222222202', 'active', true,
 'APM Fall 2027 Referral at Stripe', 'Stripe',
 NOW() - INTERVAL '80 days', NOW() - INTERVAL '80 days'),

-- Marcus: AI/ML Career Guidance
('44444444-4444-4444-4444-444444444402',
 '33333333-3333-3333-3333-333333333302',
 'AI/ML Systems Technical Architecture & Interview Prep',
 'Deep-dive on ML modelling, inference optimization, graduate research directions, and PhD application strategy for top CS programmes.',
 '22222222-2222-2222-2222-222222222204', 'active', false,
 NULL, NULL,
 NOW() - INTERVAL '90 days', NOW() - INTERVAL '90 days'),

-- Marcus: Higher Ed Guidance (bonus offer)
('44444444-4444-4444-4444-444444444409',
 '33333333-3333-3333-3333-333333333302',
 'PhD & Research Masters Application Guidance',
 'How to choose the right research lab, craft a strong SOP, and reach out to advisors. Covers GRE, TOEFL, and fellowship applications.',
 '22222222-2222-2222-2222-222222222205', 'active', false,
 NULL, NULL,
 NOW() - INTERVAL '90 days', NOW() - INTERVAL '90 days'),

-- Ananya: Resume Review + Vercel opening
('44444444-4444-4444-4444-444444444403',
 '33333333-3333-3333-3333-333333333303',
 'Frontend & Full-Stack Resume Line-by-Line Review',
 'Detailed actionable feedback on presenting GitHub projects, Next.js applications, and system design. I''ll review it as a hiring manager would.',
 '22222222-2222-2222-2222-222222222203', 'active', true,
 'Software Engineer I — New Grad 2027', 'Vercel',
 NOW() - INTERVAL '70 days', NOW() - INTERVAL '70 days'),

-- Rahul: Consulting Case Interview + McKinsey referral
('44444444-4444-4444-4444-444444444404',
 '33333333-3333-3333-3333-333333333305',
 'McKinsey-Style Case Interview Coaching & Fit Interview Prep',
 'Structured case interview coaching with market sizing, profitability, and M&A cases. Includes fit interview STAR story frameworks and office selection advice.',
 '22222222-2222-2222-2222-222222222202', 'active', true,
 'Business Analyst 2027 Referral', 'McKinsey & Company',
 NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days'),

-- Sana: UX Portfolio Review
('44444444-4444-4444-4444-444444444405',
 '33333333-3333-3333-3333-333333333306',
 'UX Portfolio Review & Design Case Study Walkthrough',
 '30-minute review of your design portfolio, critique of case studies, and guidance on presenting design decisions confidently during interviews. Figma file reviews welcome.',
 '22222222-2222-2222-2222-222222222206', 'active', false,
 NULL, NULL,
 NOW() - INTERVAL '55 days', NOW() - INTERVAL '55 days'),

-- Arjun: Finance Referral + Goldman opening
('44444444-4444-4444-4444-444444444406',
 '33333333-3333-3333-3333-333333333307',
 'Investment Banking & Quant Finance Career Guidance',
 'Advice on breaking into IB, asset management, or quantitative roles from a CS/engineering background. Includes resume tips and technical screening prep.',
 '22222222-2222-2222-2222-222222222201', 'active', true,
 'Analyst 2027 Openings — Markets Division', 'Goldman Sachs',
 NOW() - INTERVAL '100 days', NOW() - INTERVAL '100 days'),

-- Nisha: FAANG Mock Interview + Microsoft referral
('44444444-4444-4444-4444-444444444407',
 '33333333-3333-3333-3333-333333333308',
 'FAANG Technical Mock Interview & System Design Review',
 '2-hour mock coding + system design session mirroring real Microsoft/Google interviews. Detailed debrief afterwards. Referral slots for exceptional candidates.',
 '22222222-2222-2222-2222-222222222202', 'active', true,
 'SWE New Grad 2027 — Azure Infra Team', 'Microsoft',
 NOW() - INTERVAL '120 days', NOW() - INTERVAL '120 days')

ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  help_type_id = EXCLUDED.help_type_id,
  status = EXCLUDED.status,
  opportunity_available = EXCLUDED.opportunity_available,
  opportunity_title = EXCLUDED.opportunity_title,
  opportunity_company = EXCLUDED.opportunity_company,
  updated_at = EXCLUDED.updated_at;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. OFFER → DOMAIN LINKS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.offer_domains (offer_id, domain_id) VALUES
-- Priya (PM + Finance)
('44444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111106'),
('44444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111107'),
-- Marcus career guidance (AI/ML + Data Science + CS)
('44444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111103'),
('44444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111102'),
('44444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111101'),
-- Marcus higher ed (AI/ML + Research)
('44444444-4444-4444-4444-444444444409', '11111111-1111-1111-1111-111111111103'),
('44444444-4444-4444-4444-444444444409', '11111111-1111-1111-1111-111111111110'),
-- Ananya (Web Dev + CS)
('44444444-4444-4444-4444-444444444403', '11111111-1111-1111-1111-111111111104'),
('44444444-4444-4444-4444-444444444403', '11111111-1111-1111-1111-111111111101'),
-- Rahul (Consulting + PM)
('44444444-4444-4444-4444-444444444404', '11111111-1111-1111-1111-111111111108'),
('44444444-4444-4444-4444-444444444404', '11111111-1111-1111-1111-111111111106'),
-- Sana (Design + PM)
('44444444-4444-4444-4444-444444444405', '11111111-1111-1111-1111-111111111109'),
('44444444-4444-4444-4444-444444444405', '11111111-1111-1111-1111-111111111106'),
-- Arjun (Finance + CS)
('44444444-4444-4444-4444-444444444406', '11111111-1111-1111-1111-111111111107'),
('44444444-4444-4444-4444-444444444406', '11111111-1111-1111-1111-111111111101'),
-- Nisha (CS + Web Dev)
('44444444-4444-4444-4444-444444444407', '11111111-1111-1111-1111-111111111101'),
('44444444-4444-4444-4444-444444444407', '11111111-1111-1111-1111-111111111104')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. STUDENT INTENTS (3 help requests)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.intents (
  id, user_id, title, description, help_type_id, status,
  target_role, target_company, created_at, updated_at
) VALUES

-- Rohan: APM Mock Interview
('55555555-5555-5555-5555-555555555501',
 '33333333-3333-3333-3333-333333333304',
 'Prepare for Associate Product Manager Case Interviews',
 'Looking for advice and mock case interviews focused on product sense, metric definitions, and fintech trade-offs before upcoming campus placements.',
 '22222222-2222-2222-2222-222222222202', 'open',
 'Associate Product Manager', 'Stripe, Razorpay, or Google',
 NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),

-- Dev: UX Portfolio Review
('55555555-5555-5555-5555-555555555502',
 '33333333-3333-3333-3333-333333333310',
 'UX Portfolio Critique & Product Design Interview Guidance',
 'I have 4 design projects in my portfolio and need feedback on how to present design decisions clearly. Preparing for summer 2027 internship applications.',
 '22222222-2222-2222-2222-222222222206', 'open',
 'Product Designer / UX Intern', 'Figma, Notion, or Linear',
 NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),

-- Aisha: AI/ML Research PhD Guidance
('55555555-5555-5555-5555-555555555503',
 '33333333-3333-3333-3333-333333333309',
 'AI/ML Research Direction & PhD Application Advice',
 'Currently building an NLP capstone project. Seeking advice on strengthening my research profile, finding the right ML labs, and preparing a strong PhD application for 2028 intake.',
 '22222222-2222-2222-2222-222222222205', 'open',
 'ML Research Intern / PhD Candidate', 'DeepMind, OpenAI, CMU, Stanford',
 NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days')

ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  target_role = EXCLUDED.target_role,
  target_company = EXCLUDED.target_company,
  updated_at = EXCLUDED.updated_at;

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. INTENT → DOMAIN LINKS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.intent_domains (intent_id, domain_id) VALUES
-- Rohan: PM + Finance
('55555555-5555-5555-5555-555555555501', '11111111-1111-1111-1111-111111111106'),
('55555555-5555-5555-5555-555555555501', '11111111-1111-1111-1111-111111111107'),
-- Dev: Design + PM
('55555555-5555-5555-5555-555555555502', '11111111-1111-1111-1111-111111111109'),
('55555555-5555-5555-5555-555555555502', '11111111-1111-1111-1111-111111111106'),
-- Aisha: AI/ML + Data Science + Research
('55555555-5555-5555-5555-555555555503', '11111111-1111-1111-1111-111111111103'),
('55555555-5555-5555-5555-555555555503', '11111111-1111-1111-1111-111111111102'),
('55555555-5555-5555-5555-555555555503', '11111111-1111-1111-1111-111111111110')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. CONNECTION REQUESTS (5 — all statuses: accepted, pending, rejected)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.connection_requests (
  id, student_id, alum_id, intent_id, offer_id, status,
  student_message, alumni_response_note, repeat_contact_in_month,
  expires_at, responded_at, created_at, updated_at
) VALUES

-- Rohan → Priya: ACCEPTED (fulfilled)
('66666666-6666-6666-6666-666666666601',
 '33333333-3333-3333-3333-333333333304',
 '33333333-3333-3333-3333-333333333301',
 '55555555-5555-5555-5555-555555555501',
 '44444444-4444-4444-4444-444444444401',
 'accepted',
 'Hi Priya! I loved your article on Stripe billing APIs. I''m preparing for APM interviews and would value your feedback on my product design drill. Would 45 minutes this week work?',
 'Happy to help Rohan! Let''s schedule 45 mins this Saturday at 10 AM IST. I''ll send a calendar invite.',
 false,
 NOW() + INTERVAL '6 days', NOW() - INTERVAL '7 days',
 NOW() - INTERVAL '8 days', NOW() - INTERVAL '7 days'),

-- Rohan → Marcus: PENDING
('66666666-6666-6666-6666-666666666602',
 '33333333-3333-3333-3333-333333333304',
 '33333333-3333-3333-3333-333333333302',
 '55555555-5555-5555-5555-555555555501',
 '44444444-4444-4444-4444-444444444402',
 'pending',
 'Hi Marcus! I saw your NeurIPS paper on efficient transformers. I''m also building a side project using HuggingFace and would love 30 minutes of guidance on AI career paths vs. product roles.',
 NULL,
 false,
 NOW() + INTERVAL '7 days', NULL,
 NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

-- Rohan → Nisha: REJECTED (capacity full)
('66666666-6666-6666-6666-666666666603',
 '33333333-3333-3333-3333-333333333304',
 '33333333-3333-3333-3333-333333333308',
 '55555555-5555-5555-5555-555555555501',
 '44444444-4444-4444-4444-444444444407',
 'rejected',
 'Hi Nisha, I''m targeting SWE + APM roles this placement season. Could we schedule a mock interview focused on system design?',
 'Hi Rohan, I''m fully booked for October. Please re-request in November — I''ll have capacity then. Best of luck!',
 false,
 NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days',
 NOW() - INTERVAL '4 days', NOW() - INTERVAL '2 days'),

-- Dev → Sana: PENDING
('66666666-6666-6666-6666-666666666604',
 '33333333-3333-3333-3333-333333333310',
 '33333333-3333-3333-3333-333333333306',
 '55555555-5555-5555-5555-555555555502',
 '44444444-4444-4444-4444-444444444405',
 'pending',
 'Hi Sana! I''m a 3rd-year student preparing my design portfolio for internship applications at Figma. I have 4 case studies — would you be open to reviewing them and giving feedback?',
 NULL,
 false,
 NOW() + INTERVAL '8 days', NULL,
 NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

-- Aisha → Marcus: ACCEPTED (in progress goal)
('66666666-6666-6666-6666-666666666605',
 '33333333-3333-3333-3333-333333333309',
 '33333333-3333-3333-3333-333333333302',
 '55555555-5555-5555-5555-555555555503',
 '44444444-4444-4444-4444-444444444409',
 'accepted',
 'Hi Marcus! I''m a 2nd-year student building an NLP sentiment analysis project using BERT. I''m interested in PhD programmes in ML and would appreciate guidance on finding the right lab and crafting my SOP.',
 'Great initiative, Aisha! Let''s chat this week — I can share my own PhD application journey and give feedback on your project direction.',
 false,
 NOW() + INTERVAL '9 days', NOW() - INTERVAL '4 days',
 NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days')

ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  alumni_response_note = EXCLUDED.alumni_response_note,
  responded_at = EXCLUDED.responded_at,
  updated_at = EXCLUDED.updated_at;

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. GOALS (tied to accepted requests)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.goals (
  id, request_id, student_id, alum_id, title, description,
  status, student_confirmed_at, alum_confirmed_at, fulfilled_at,
  created_at, updated_at
) VALUES

-- Rohan + Priya: FULFILLED
('77777777-7777-7777-7777-777777777701',
 '66666666-6666-6666-6666-666666666601',
 '33333333-3333-3333-3333-333333333304',
 '33333333-3333-3333-3333-333333333301',
 'Complete APM Mock Interview with Priya Sharma',
 'Complete 1 structured 45-minute mock PM interview covering product sense, prioritization, and fintech metrics. Review written debrief notes afterwards.',
 'fulfilled',
 NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days',
 NOW() - INTERVAL '8 days', NOW() - INTERVAL '4 days'),

-- Aisha + Marcus: IN PROGRESS
('77777777-7777-7777-7777-777777777702',
 '66666666-6666-6666-6666-666666666605',
 '33333333-3333-3333-3333-333333333309',
 '33333333-3333-3333-3333-333333333302',
 'AI Research Direction & PhD Application Strategy Session',
 '60-minute discussion covering ideal ML research topics, shortlist of 5 target PhD programmes, and a first-draft review of Statement of Purpose.',
 'in_progress',
 NULL, NULL, NULL,
 NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),

-- Rohan: OPEN (pending Marcus response)
('77777777-7777-7777-7777-777777777703',
 '66666666-6666-6666-6666-666666666602',
 '33333333-3333-3333-3333-333333333304',
 '33333333-3333-3333-3333-333333333302',
 'AI Career Path Exploration with Marcus Chen',
 'Understand the trade-offs between AI research, SWE, and product roles. Decide whether to apply for SWE or APM tracks at AI-first companies.',
 'open',
 NULL, NULL, NULL,
 NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days')

ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  student_confirmed_at = EXCLUDED.student_confirmed_at,
  alum_confirmed_at = EXCLUDED.alum_confirmed_at,
  fulfilled_at = EXCLUDED.fulfilled_at,
  updated_at = EXCLUDED.updated_at;

-- ─────────────────────────────────────────────────────────────────────────────
-- 10. STUDENT TOKEN BALANCES
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.student_tokens (
  student_id, tokens_granted, tokens_spent, tokens_remaining, period_start
) VALUES
-- Rohan: 4 of 5 remaining (spent 1 on accepted Priya request)
('33333333-3333-3333-3333-333333333304', 5, 1, 4, DATE_TRUNC('month', NOW())),
-- Dev: all 5 available (pending request not yet spent)
('33333333-3333-3333-3333-333333333310', 5, 0, 5, DATE_TRUNC('month', NOW())),
-- Aisha: 4 of 5 remaining (spent 1 on accepted Marcus request)
('33333333-3333-3333-3333-333333333309', 5, 1, 4, DATE_TRUNC('month', NOW()))
ON CONFLICT (student_id, period_start) DO UPDATE SET
  tokens_granted = EXCLUDED.tokens_granted,
  tokens_spent = EXCLUDED.tokens_spent,
  tokens_remaining = EXCLUDED.tokens_remaining;

-- ─────────────────────────────────────────────────────────────────────────────
-- 11. ALUMNI CAPACITY RECORDS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.alumni_capacity (
  alum_id, monthly_limit, reserved_count, processed_count,
  remaining_capacity, period_start
) VALUES
-- Priya: 2 of 4 used (1 reserved + 1 processed)
('33333333-3333-3333-3333-333333333301', 4, 1, 1, 2, DATE_TRUNC('month', NOW())),
-- Marcus: 1 of 3 used (0 reserved + 1 processed)
('33333333-3333-3333-3333-333333333302', 3, 0, 1, 2, DATE_TRUNC('month', NOW())),
-- Ananya: fully open (new mentor)
('33333333-3333-3333-3333-333333333303', 5, 0, 0, 5, DATE_TRUNC('month', NOW())),
-- Rahul: 1 of 3 used (1 reserved)
('33333333-3333-3333-3333-333333333305', 3, 1, 0, 2, DATE_TRUNC('month', NOW())),
-- Sana: 2 of 4 used (0 reserved + 2 processed)
('33333333-3333-3333-3333-333333333306', 4, 0, 2, 2, DATE_TRUNC('month', NOW())),
-- Arjun: FULL — 3 of 3 used (1 reserved + 2 processed)
('33333333-3333-3333-3333-333333333307', 3, 1, 2, 0, DATE_TRUNC('month', NOW())),
-- Nisha: 1 of 5 used (1 reserved)
('33333333-3333-3333-3333-333333333308', 5, 1, 0, 4, DATE_TRUNC('month', NOW()))
ON CONFLICT (alum_id, period_start) DO UPDATE SET
  monthly_limit = EXCLUDED.monthly_limit,
  reserved_count = EXCLUDED.reserved_count,
  processed_count = EXCLUDED.processed_count,
  remaining_capacity = EXCLUDED.remaining_capacity;
