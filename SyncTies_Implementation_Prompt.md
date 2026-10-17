# Master Coding-Agent Prompt — Build SyncTies

Copy the prompt below into your coding agent (Kiro, Antigravity, or another repository-aware coding assistant). It is intentionally specific about product behavior, data integrity, matching, and tests.

---

## PROMPT START

You are the lead full-stack engineer responsible for implementing **SyncTies**, a production-minded but hackathon-feasible AI-assisted alumni networking platform. Build a working application, not just static mockups. Inspect the existing repository first; preserve working code and conventions where sensible. If the repository is empty, create the project using the stack below. Work in small, verifiable phases, run available tests/type checks/builds, and fix issues instead of only listing them.

# 1. Product mission

SyncTies helps students find the right alumni for a specific goal. It is not merely an alumni directory. Students create an intent, the platform ranks eligible alumni using transparent SQL-based weighted scoring, and an AI-generated two- or three-sentence brief explains why the connection may be relevant. Monthly student tokens encourage thoughtful outreach. Alumni set a monthly limit on how many requests they are willing to review. Requests become purposeful goals that progress through a lifecycle and are only marked fulfilled after both participants confirm completion. An impact dashboard measures engagement and outcomes from real database records.

The product principle is: **Right people. Right purpose. Real opportunities.**

# 2. Required technology stack

Use the smallest maintainable stack that supports the product:

- Next.js App Router with React and TypeScript.
- Tailwind CSS, shadcn/ui where appropriate, and Lucide React icons.
- Next.js Route Handlers and server-only business logic.
- Supabase PostgreSQL, Supabase Auth, Supabase Storage where needed.
- Supabase Row Level Security (RLS) on private/user-owned tables.
- OpenAI API only for grounded connection briefs; call it server-side.
- Recharts for impact charts.
- Zod for server/input validation; React Hook Form where helpful.
- Vitest for unit/integration tests and Playwright for critical end-to-end flows, depending on the project setup.
- Vercel deployment support and Supabase SQL migrations.

Do not introduce a separate Python backend, microservices, Neo4j, vector database, custom-trained model, or mandatory Redis service for the MVP. Store brief cache entries in PostgreSQL. Keep external services optional if credentials are missing, with graceful fallbacks in local development.

# 3. Pilot roles and users

Implement the pilot for exactly two active user roles:

1. **Student:** currently in 3rd or 4th year; can create intents, browse matches, spend monthly tokens on requests, track goals, confirm outcomes, and submit eligible feedback.
2. **Alumnus:** working professional; can maintain expertise and offers, set monthly review capacity, respond to requests, collaborate on goals, confirm fulfillment, and view impact.

The database and code should be straightforward to extend to faculty/mentors, founders, recruiters, and institution administrators later. Do not expose unfinished role workflows in the MVP. Add a verification state; login through Google alone is not proof of institution affiliation. Institution SSO is future scope unless credentials and a working provider are explicitly configured.

Pilot cohort guidance: 3rd- and 4th-year students plus alumni from the most recent two or three graduating cohorts. Keep cohort eligibility configurable instead of scattering fixed dates/years across the code.

# 4. Required product capabilities

## Authentication and profiles

- Supabase Auth email/password and Google OAuth when configured.
- Role-safe onboarding and profile editing.
- Profile data: name, avatar, institution, role, verification status, year/cohort, domains, skills, activity timestamp, and role-specific fields.
- Alumni fields include job title, company, industry, expertise, and public professional summary.
- A user must only edit their own allowed profile fields. Do not trust role, user ID, token balance, capacity, match score, or reputation values sent by the client.

## Structured domains, help types, intents, and offers

- Create canonical domain records, not just free-text labels. Suggested initial domains: Computer Science, Data Science, AI/ML, Web Development, Cybersecurity, Product Management, Finance, Consulting, Design, Research, Entrepreneurship, Marketing, Healthcare, and Other.
- Create canonical help types: Referral, Mock Interview, Resume Review, Career/Field Guidance, Higher-Education Guidance, Portfolio Review, Project Guidance, and Other.
- Students create an intent with title, description, selected domains, requested help type, optional target role/opportunity tags, and lifecycle status.
- Alumni create one or more offers that state what they can provide, supported domains/help types, optional role/company/opportunity tags, and whether an opportunity is active.
- Offers can be draft, active, paused, or closed. Only active offers can power matching.
- Validate structured fields. If any AI-assisted text classification is later added, show proposed tags to the user and require confirmation; do not silently invent data.

## Matching engine

Build a deterministic SQL-based matching engine. Do not use the LLM to score or rank candidates.

Required steps:

1. Authenticate the student and verify ownership of the intent.
2. Load the selected open intent.
3. Retrieve eligible active, verified alumni with relevant active offers.
4. Exclude the current student, inactive/unverified users, candidates with no valid offer, candidates with no remaining monthly review capacity, blocked/ineligible relationships, and duplicate pending/active requests for the same student/intent/alumnus.
5. Calculate all match components on a scale of 0–100.
6. Calculate a weighted total score.
7. Return stable, paginated, descending-ranked results and their component scores.
8. Generate connection briefs only for displayed/selected results or cache them lazily; brief-generation failure must never alter numeric ranking.

Use this initial formula:

`TotalScore = 0.40 * D + 0.30 * H + 0.20 * C + 0.10 * R`

Where all factors are in `[0, 100]`:

### D — Domain overlap, 40%

- Let `S` be the canonical domain IDs from the student’s selected intent.
- Let `A` be canonical domain IDs from the alumnus’s active, relevant offer and declared expertise.
- Use Jaccard similarity: `D = 100 * |S ∩ A| / |S ∪ A|`.
- If either set is empty, D is 0.
- Example: S = `{Product Management, Technology, Startups}` and A = `{Product Management, Technology}` → D = `100 * 2/3 = 66.67`.
- Compare canonical IDs/slugs, not display labels or arbitrary free text.
- If an alumnus has multiple offers, use the highest domain score among valid offers applicable to the requested help type; identify the offer behind the match if relevant.

### H — Help-type compatibility, 30%

- Use a database-managed `help_type_compatibility` table. Do not ask an LLM to determine compatibility at request time.
- Exact supported type = 100.
- Approved strongly related type = 70.
- Approved partial/adjacent type = 40.
- Unsupported = 0.
- The table must be explicit and admin/product controlled. Example: Mock Interview to Mock Interview = 100; Resume Review to Career Guidance may be 70 only if configured; Higher-Education Guidance to Mock Interview = 0.
- Use the highest applicable help compatibility for the alumnus’s active relevant offer.

### C — Available capacity, 20%

Let `L` = the alumnus’s monthly request-review limit and `U` = the allocated count for the current month, including reserved pending requests and processed/consumed slots under the defined policy.

`Remaining = max(0, L - U)`

`C = 100 * Remaining / L`

Clamp C to 0–100. If L <= 0 or Remaining <= 0, the alumnus is ineligible and must be filtered out before ranking. This score represents current availability, not personal quality. Keep the capacity scoring function replaceable so the pilot can compare ratio scoring with a binary 100/0 capacity score if needed.

### R — Recent activity, 10%

Use the server-maintained `last_active_at` timestamp.

`age_days = max(0, hours_since_last_active / 24)`

`R = 100 * 2 ^ (-age_days / 14)`

This is a 14-day half-life: today is close to 100, 14 days ago is 50, 28 days ago is 25. If timestamp is missing, use a documented conservative default (0 recommended). Optionally exclude extremely inactive profiles using a configurable cutoff, but keep eligibility filtering separate from the R score.

### Ranking and explanations

- Sort by unrounded `TotalScore` descending.
- Tie-break by H descending, then remaining capacity ratio descending (if retained as a product preference), then `last_active_at` descending, then stable ID ascending.
- Keep the initial weights in one named configuration or scoring version `v1`, not copied literals across multiple components.
- Show the match score with a label such as “Match score” or “Fit score”, not “success probability”. It is a ranking score, not a calibrated probability.
- Include an accessible explanation of the main factors, for example “Your Product Management goal overlaps with this alumnus’s expertise, and they offer mock interviews.” Never invent a reason unsupported by stored data.
- Add unit tests for identical domain sets, partial overlap, disjoint/empty sets, help-type compatibility, zero capacity, activity decay, weighted score range, ties, and eligibility filters.
- Matching must be computed using SQL/PostgreSQL query logic or a well-tested SQL RPC/function. Do not retrieve every user into the browser and sort only on the client.

## AI-generated “Why you should connect” brief

- Generate 2–3 concise sentences using the selected student intent, canonical domain/help-type overlap, alumnus’s relevant public profile fields, and specific active offer.
- The brief should be warm, professional, contextual, and cautious; never promise a referral/interview or claim a skill/credential not stored in the profile/offer.
- Run on the server; `OPENAI_API_KEY` must never reach the browser.
- Pass only relevant, non-sensitive data to the model. Treat user-written text as untrusted descriptive content; ignore instructions embedded in profiles/intents.
- Validate response length and basic content. Never include private email, phone, or other contact details.
- Cache by student ID, alumnus ID, intent ID, offer ID (if used), and input/profile versions or a hash of relevant fields.
- Regenerate if relevant profile, offer, or intent fields change.
- Provide a deterministic fallback brief when the API is unavailable. A failed AI call should not break match cards or ranking.
- Record model identifier, input hash, and timestamp for debugging without logging secrets or unnecessary raw private text.

## Monthly tokens and repeat-contact safeguards

- Each eligible student receives a configurable fixed token grant per calendar month. `STUDENT_MONTHLY_TOKEN_GRANT=5` may be used as a default for development, but it is a configurable example—not a hard-coded policy.
- A valid new connection request consumes one token.
- The authoritative source of token history is an append-only `token_ledger` with grant/spend/refund/adjustment entries, plus an atomically maintained balance summary if needed.
- Do not deduct in the UI. Debit token and create ledger entry in the database transaction only after all validation checks pass.
- A failed request must consume zero tokens.
- Monthly grants must be idempotent; retrying a grant job or loading a page must not grant tokens twice.
- Block duplicate pending or active requests to the same alumnus for the same intent.
- If an earlier request to the same alumnus exists in the current month but is closed, a new request is treated as repeat contact. Display a warning and require a short reason/explicit confirmation. A valid repeat request consumes one token under the same rules and is tagged as repeat contact.
- Notify the alumnus that this is repeat contact and show `Review` or `Ignore`. Communicate the alumnus’s choice to the student. An ignored request must receive a visible terminal status.
- Enforce all these rules server-side and with database constraints/transactions where applicable.

## Alumni capacity

- Alumni choose a monthly maximum number of incoming requests they are willing to review.
- Reserve one slot when a valid request enters the review queue.
- Capacity and token updates must be atomic with request creation.
- Use row locks or conditional atomic updates so two concurrent request submissions cannot reserve the final slot twice.
- Separate `reserved` and `processed` counts, or use an equivalent clearly defined summary. Accepted/declined/explicitly ignored requests consume an allocated review slot for the period. A request withdrawn by the student before alumni review may release the reservation according to one documented policy.
- Candidates with no available capacity are not requestable matches.

## Request lifecycle and notifications

Statuses: `pending`, `accepted`, `declined`, `deferred`, `ignored`, `withdrawn`, `expired`.

- Only the target alumnus can accept/decline/defer/ignore.
- Only the requesting student can withdraw where status rules allow it.
- Validate every transition on the server/database.
- Use in-app notifications for sent request, response, repeat contact, goal progress, confirmation, mutual fulfillment, and feedback eligibility.
- A request and its initial goal must be created atomically. A declined/ignored request cannot lead to a fulfilled goal.
- Use a configurable expiration duration; 14 days can be a development default, not a scattered hard-coded value.

## Goal lifecycle and outcome tracking

Goal flow: `open` → `in_progress` → `fulfilled`, with optional terminal `closed`/`cancelled`.

- The goal belongs to exactly one request and records the participants.
- Either participant may move an accepted goal into `in_progress` according to validated transition rules.
- Each participant has a separate completion-confirmation timestamp.
- The goal becomes fulfilled only after both student and alumnus have confirmed.
- Perform the final transition in an atomic server/database operation; repeated confirmation must not double-count.
- If only one party confirms, show that the system is waiting for the other party.
- Store outcome events based on actual transitions, not on page views.

## Feedback and reputation

- After mutual fulfillment, allow the student to submit one 1–5 rating and optional comment about the alumnus’s support.
- Enforce unique feedback per goal/reviewer.
- Alumni impact should include mutually fulfilled goals, valid accepted connections, explicitly tracked successful referrals, rating mean/count, and repeat contribution.
- A referral counts as successful only when its status is actually recorded as such; an offered referral is not automatically a successful referral.
- Display clear definitions and counts; avoid an opaque one-number ranking that penalizes low-volume participants.
- Include safe reporting/moderation basics or at minimum a way to hide/flag abusive content for administrative review.

## Impact dashboard

Build `/impact` or `/dashboard` using real database aggregates. Include:

- Accepted unique connections.
- Intents posted and a funnel: posted → requested → accepted → in progress → mutually fulfilled.
- Weekly active users (define a meaningful event and rolling window in code/docs).
- Average unique connections per active user.
- Top five network hubs by unique accepted connections, with proper access control.
- Connections by domain and role pair.
- Goal fulfillment rate with numerator/denominator and date range.
- Token usage and remaining balances in aggregate.
- Alumni capacity utilization and no-capacity search counts.
- Network connectivity coverage using this pilot definition:

`Connectivity % = 100 * accepted unique student–alumnus pairs / possible eligible student–alumnus pairs`

For the pilot, possible pairs = active verified students × active verified alumni eligible for discovery. This is pair coverage, not graph distance. Do not claim “within two connections of an industry professional” unless shortest-path distances are genuinely calculated from a documented graph. Do not hard-code metrics while presenting them as live data. Explicitly label seeded demo metrics as sample data.

## Opportunity information

At minimum, alumni offers can tag available job profiles, roles, opportunities, or referral availability. A full opportunity board and applications flow are Phase 2 unless time permits after core goals/tokens/matching work.

# 5. Database and transaction requirements

Create Supabase migrations for at least the following tables (names may be refined, but keep responsibilities clear):

- `profiles`
- `domains`, `profile_domains`
- `help_types`, `help_type_compatibility`
- `intents`, `intent_domains`
- `offers`, `offer_domains`
- `student_monthly_tokens`, `token_ledger`
- `alumni_capacity_monthly`
- `connection_requests`
- `goals`, optionally `goal_updates`
- `connection_briefs`
- `feedback`
- `notifications`
- `analytics_events`

Add foreign keys, uniqueness constraints, check constraints, useful indexes, timestamps, and RLS policies. Add a profile-creation trigger on auth signup if it is safe and compatible with role onboarding; otherwise create the profile through a validated server action. Do not use the service-role key in ordinary client code.

## Atomic request creation

Implement a PostgreSQL RPC/function or equivalent real database transaction that:

1. Resolves/authenticates the student.
2. Verifies intent ownership/open status and eligible alumnus/offer.
3. Checks duplicates and idempotency.
4. Flags/validates repeat contact.
5. Locks the student’s monthly token row and confirms balance > 0.
6. Locks the alumnus’s monthly capacity row and confirms capacity remains.
7. Reserves capacity.
8. Debits one token and writes the immutable ledger entry.
9. Creates request and goal.
10. Creates the in-app notification/outbox event.
11. Commits all changes together; any failure rolls back everything.

Use `SELECT ... FOR UPDATE`, safe conditional updates, idempotency keys, and database constraints where appropriate. Never rely only on disabled buttons. Write concurrency tests for last-token and last-capacity races.

## RLS and authorization

- Users can update only their own allowed profile fields.
- Only alumni can create/update their own offers and monthly capacity.
- Only students can create their own intents and outgoing requests.
- Only request participants can read private request/goal details.
- Only goal participants can update their progress/confirmation fields.
- Users can read only their own notifications and mark only their own notifications read.
- Users cannot directly write token ledger entries, balances, capacity counters, weighted scores, fulfillment timestamps, reputation aggregates, or system-managed notifications.
- Admin access should use an explicit role/authorization strategy, not a client-side hidden button.

# 6. Suggested app route map

Create sensible responsive pages, at minimum:

- `/` — public landing page and explanation.
- `/auth/sign-in`, `/auth/sign-up` — authentication.
- `/onboarding` — role-specific profile setup and verification status.
- `/student/dashboard` — tokens, intents, top matches, requests, goals.
- `/student/intents` and `/student/intents/new` — manage intents.
- `/student/matches?intentId=...` — match cards, scores, briefs, request CTA.
- `/student/requests` — sent request statuses and repeat warnings.
- `/alumni/dashboard` — capacity, offers, requests, goals, impact.
- `/alumni/offers` — create/edit offers.
- `/alumni/requests` — inbox, respond, repeat review/ignore.
- `/goals/[id]` — participants, progress, confirmation, outcome.
- `/impact` — authorized metrics dashboard.
- `/profile` — current user profile.

The exact routing can follow established repository conventions, but core workflows must be reachable and linked. Each page must include loading, empty, error, and unauthorized states. Build accessible keyboard navigation, labels, validation feedback, and responsive layouts. Keep the visual style modern, clean, calm, and consistent; do not make every page a dense admin dashboard.

# 7. API/service design

Use typed service modules and route handlers. Suggested APIs:

- `GET/PATCH /api/profile`
- `GET /api/domains`, `GET /api/help-types`
- `GET/POST /api/intents`, `PATCH /api/intents/:id`
- `GET/POST /api/offers`, `PATCH /api/offers/:id`
- `GET /api/matches?intentId=...&limit=...&cursor=...`
- `GET /api/matches/:id/brief`
- `GET /api/tokens/balance`
- `POST /api/connection-requests`
- `GET /api/connection-requests`
- `PATCH /api/connection-requests/:id`
- `PATCH /api/capacity`
- `GET /api/goals/:id`, `POST /api/goals/:id/updates`, `POST /api/goals/:id/confirm`
- `POST /api/feedback`
- `GET /api/dashboard/metrics`
- `GET /api/notifications`, `PATCH /api/notifications/:id`

Use Zod validation, consistent error responses, proper HTTP status codes, and server-side authorization. Avoid exposing database details in errors. Keep business logic in service modules or SQL RPC functions rather than duplicating it in React components.

# 8. Suggested folder structure

Adapt if the repo already has a clean organization:

```text
app/
  (public)/page.tsx
  auth/sign-in/page.tsx
  auth/sign-up/page.tsx
  onboarding/page.tsx
  student/dashboard/page.tsx
  student/intents/page.tsx
  student/intents/new/page.tsx
  student/matches/page.tsx
  student/requests/page.tsx
  alumni/dashboard/page.tsx
  alumni/offers/page.tsx
  alumni/requests/page.tsx
  goals/[id]/page.tsx
  impact/page.tsx
  api/...
components/
  ui/
  layout/
  profile/
  intents/
  offers/
  matches/
  requests/
  goals/
  dashboard/
lib/
  auth/
  supabase/
  validation/
  matching/
  connections/
  tokens/
  capacity/
  goals/
  ai/
  metrics/
  notifications/
types/
supabase/migrations/
supabase/seed.sql
tests/
```

Potential pure functions worth unit testing:

- `calculateDomainOverlap(studentDomainIds, alumniDomainIds)`
- `calculateHelpTypeScore(requestedType, offeredTypes, compatibilityMap)`
- `calculateCapacityScore(limit, allocated)`
- `calculateRecentActivityScore(lastActiveAt, now)`
- `calculateTotalMatchScore(components, weights)`
- `getAllowedRequestTransition(currentStatus, action, actorRole)`
- `shouldFulfillGoal(studentConfirmedAt, alumConfirmedAt)`

# 9. Implementation order

Do not attempt every future feature before the core loop works. Implement in these phases:

### Phase A — inspect and bootstrap

- Inspect repository, package manager, tests, environment, and existing components.
- If empty, bootstrap Next.js TypeScript with Tailwind.
- Add `.env.example`, README, lint/type-check/build scripts, and Supabase client helpers for server/browser contexts.

### Phase B — schema, auth, and profile

- Add migrations, constraints, RLS, seed domains/help types/compatibility values.
- Implement signup/sign-in, profile creation, role onboarding, verification states, and profile editing.
- Confirm a student cannot edit an alumnus and vice versa.

### Phase C — intents, offers, and SQL matching

- Build structured forms and CRUD flows.
- Implement SQL eligibility filters and score components.
- Add deterministic ordering and match score explanations.
- Add matching unit/integration tests before adding AI.

### Phase D — token, capacity, and requests

- Implement idempotent monthly grants/ledger summaries.
- Implement atomic request RPC with row locks and duplicate checks.
- Implement capacity editing, request inbox, request responses, repeat-contact review/ignore, and notifications.
- Test last-token and last-capacity concurrency cases.

### Phase E — AI briefs

- Implement grounded server-side generation, versioned cache, validation, and fallback.
- Ensure the match list still works with no API key/network.

### Phase F — goals, feedback, reputation

- Implement progress, two-party confirmation, feedback eligibility, and outcome events.
- Use database constraints/transactions to avoid double fulfillment or duplicate feedback.

### Phase G — impact dashboard and deployment

- Implement real aggregate metrics and charts, access control, date ranges, and definitions.
- Add end-to-end test and deployment instructions.
- Deploy to Vercel and verify configured Supabase callbacks/RLS.

At each phase: run lint, type checking, tests, and production build where configured; fix issues before moving on. If a live provider credential is missing, write a documented setup step and ensure the app shows a safe configuration message rather than crashing.

# 10. Mandatory acceptance tests

Implement automated tests for all the cases below, adapting the test framework to the repo:

### Matching

- Same domain sets score 100 for D.
- Partially overlapping sets return the correct Jaccard result.
- Empty/disjoint domains do not divide by zero.
- Exact help type ranks above approved partial/related type when other factors match.
- Zero-capacity alumni never appear as requestable matches.
- Recent activity decays according to the 14-day half-life.
- Total score is between 0 and 100; sorting uses full precision and stable tie-breaks.
- AI outage does not affect numeric rank or remove all matches.

### Tokens and capacity

- Zero-token student request is rejected with no side effects.
- Invalid/unauthorized request consumes no token.
- Successful request consumes exactly one token and reserves exactly one capacity slot.
- Two concurrent submissions for the last student token cannot both succeed.
- Two concurrent submissions for the alumnus’s final capacity slot cannot both succeed.
- Retrying the same idempotency key cannot double-charge.
- Duplicate pending/active request is rejected.
- A repeat request is flagged and follows the explicit confirmation/reason policy.
- Alumni review/ignore state is shown to the student.
- Monthly grant retries do not double grant.

### Goals and reputation

- One participant’s confirmation alone does not fulfill the goal.
- The second confirmation completes it once.
- Repeated confirm calls do not duplicate outcome analytics.
- Nonparticipants cannot confirm or read private goal detail.
- Feedback before fulfillment is rejected; duplicate feedback is prevented.

### Security and dashboard

- A student cannot edit alumni profile/offer/capacity.
- A user cannot directly edit token balance, ledger, match score, or fulfilled timestamps.
- Users cannot read another user’s private intent/request/notifications.
- No secret API key is bundled in client code.
- Metrics are sourced from records and have a documented denominator/date range.
- Only authorized users can access institution-wide dashboard data.

### End-to-end flow

Test a student and alumnus through registration, profile setup, intent/offer creation, match discovery, AI brief or fallback, request submission, token debit, capacity reservation, alumni response, goal progress, mutual confirmation, feedback, and dashboard updates.

# 11. UX requirements

- Keep the interface simple, trustworthy, and modern; use a consistent SyncTies design system with clear hierarchy and restrained pastel accents.
- Student match cards must show: alumnus name/title/company (only if public), main overlap, match score, availability/requestable status, and “Why you should connect” brief.
- Do not display private contact data or confidential company/opportunity details.
- Request CTA must show token cost and current balance; repeat requests require an explicit warning/confirmation.
- Alumni inbox must clearly distinguish new, repeat, pending, and expired requests.
- Goal page must show both confirmation states and explain when one side is still pending.
- Dashboard charts must show period, labels, data definitions, and appropriate empty states.
- No fake metrics should be presented as real; seed data must be labeled as sample/demo.
- Build for mobile and desktop with accessible forms, visible focus states, alt text, and meaningful errors.

# 12. Documentation and deliverables

When implementation is complete, leave these artifacts in the repository:

1. Working Next.js application.
2. Supabase migrations, RLS policies, indexes, constraints, and seed data.
3. `.env.example` with no real secrets.
4. README with setup, environment variables, migration/seed commands, tests, and deploy steps.
5. Matching algorithm documentation showing formula, factor definitions, tie-breaks, and current score version.
6. A concise product decision/configuration section for tokens, capacity, expiration, verification, compatibility, and scoring weights.
7. Automated tests for matching, concurrency-sensitive request logic, goals, authorization, and critical end-to-end flow.
8. A short implementation report listing what works, commands run, test/build results, and any remaining limitations honestly.

Do not stop after creating a beautiful landing page. The key demonstration is the complete functional loop: **student intent → SQL-ranked alumni → grounded connection brief → token/capacity-protected request → alumnus response → goal progress → mutual confirmation → measurable dashboard impact**.

If time is limited, prioritize a reliable end-to-end vertical slice over polishing secondary screens. Build Phase 2 opportunity board and additional stakeholder roles only after the primary flow is sound.

## PROMPT END
