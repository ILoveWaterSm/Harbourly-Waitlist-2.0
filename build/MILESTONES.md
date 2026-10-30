# Milestones

The build order for code, by dependency. Each milestone ends with a checkpoint: you test its scenarios (`TEST-SCRIPT.md`), and the next milestone starts only after you approve. Emails are built inside the milestone that triggers them; M12 is the review pass over all of them.

Changes from the suggested order, and why:
- **10 My sessions moves into M5** with 06: it's the way into session detail and a small page.
- **09's brand-new state is built in M3** (where sign-up lands); the rest of 09 stays in M8, once every booking state it lists exists.
- **25 System pages (plain) move into M3**: every protected route needs "Sign in to continue", 404 and "Session expired" (G-008).

Every milestone's definition of done includes: every state of every designed page in it passes the screenshot check at 1440 and 390 (and layout checks at 1280, 1024, 820, 320 and 1280×720), its scenarios pass as Playwright tests with the same IDs, lint + typecheck + unit + e2e green, RLS tests for its tables, `build/HANDOFF.md` updated, and the checkpoint message sent.

---

## M1 · Foundations
- **Scope:** `web/` Next.js 16 project (TypeScript strict, ESLint, Vitest, Playwright, pgTAP); global stylesheet from `tokens.css`; fonts (Sora, Geist, Geist Mono via `next/font`, same files as the mockups); every component in `design/foundations/components/` as `<Name>.tsx` + `<Name>.module.css` (CSS copied as is), with `OtpInput`, `Field`, `Rating`, `ScrollArea`, `Tabs` and the AuthLayout brand panel behaviour ported; the icon sprite and flags; `/dev/components` rebuilt from 0.2 and screenshot-checked section by section; AppShell, TopNav (logged out, logged in, gate), Sidebar, MobileMenu. Full schema and RLS for every table in `ARCHITECTURE.md` §2; both status machines as Postgres functions with their pgTAP tests; the money module and named constants with unit tests; the clock; outbox and job tick skeleton; dev tools (clock, users, seed, jobs, outbox, faults); the cast seed and scenarios `fresh`, `phase1`.
- **Testable:** `/dev/components` against 0.2 (all 12 sections); T-11.F, T-12.F (forbidden transitions, as automated tests); the money worked examples; T-13.01 and T-13.02 shell behaviour on the library page.
- **Owner provides:** answers to the decisions table (at least E-1, E-4, E-12, E-13, E-14) and gaps G-001 (cast), G-005 (lifecycle edges), G-018 (whole-unit prices), G-025 (overlaps); a Supabase **staging** project (or approval for me to create one with the connected Supabase account) and a Vercel project for `web/` previews.
- **Done when:** the library page matches 0.2 at 1440 and 390 in every section; every transition and forbidden transition tested; money examples exact.

## M2 · Browse and coach profile (01, 02)
- **Scope:** `/coaches`, `/coaches/[username]` with every state; currency conversion and "≈"; time zone labels; next free times from availability; reviews paging; voice intro player; showcase gallery; own profile and preview mode; logged out.
- **Testable:** T-3.01, T-3.02, T-3.03, T-3.04, T-3.05; T-13.01 (logged out).
- **Owner provides:** G-010, G-011, G-012, G-013, G-027, G-028; Open Exchange Rates key (E-5) — until then, fixed seed rates matching the mockups (₱1,850 ≈ S$43, RM 150 ≈ S$43).
- **Done when:** all 15 states of 01 and 02 pass the screenshot check.

## M3 · Accounts (11–16, plain 25, 09 brand-new)
- **Scope:** sign up, verify, finish setting up (age, country, coach country, phone code, username), log in (email, Google), lockout, forgot and reset, accept updated terms; the post-login checks in diagram 2's order with return to the booking step; Send Email hook and auth emails; Turnstile; rate limits; 25 plain (awaiting design); 09 `new` state; sign-up as coach creates the coach record (G-021).
- **Testable:** T-2.01 – T-2.24 (T-2.12 ends at the coach record; 17 awaits design), T-3.10, T-10.08, T-10.10, T-10.11, T-13.01.
- **Owner provides:** G-008, G-009 (terms text and URLs), G-014, G-015, G-016 (approve auth email copy), G-021, G-047 (larger mark); Google OAuth client ID and secret; Twilio Verify service SID and keys (test numbers); Cloudflare Turnstile site and secret keys; Resend API key and domain records confirmed.
- **Done when:** all 32 states of 11–16 pass; every diagram 2 path works in both browsers.

## M4 · Booking and payment (03–05)
- **Scope:** pick a slot (games, weeks, availability minus claims, ≥2 h, ≤4 weeks), the hold with the database exclusion constraint, checkout, simulated provider, Stripe and Xendit test mode, webhooks (verified, idempotent), return-page reconciliation, hold expiry sweep, "Payment received" and expiry emails.
- **Testable:** T-3.06 – T-3.21, T-11.01 – T-11.03.
- **Owner provides:** G-002, G-003, G-004, G-017, G-042; Stripe test keys (platform account) and webhook secret; Xendit test keys and callback token.
- **Done when:** all 16 states of 03–05 pass; no double booking under a concurrent-booking test; webhooks replayed and reordered without effect.

## M5 · Session detail, rescheduling, cancelling, confirming, reviewing (06, 10)
- **Scope:** 06 gamer and coach views; reschedule requests with held offers and expiry; every cancel case with its refund and payout; reminders; join button timing; nobody-joined → pending confirmation; confirm step; auto-release with transfers; reviews; 10 My sessions; related emails.
- **Testable:** T-4.01 – T-4.19, T-5.01, T-5.05, T-6.01 – T-6.06, T-6.10, T-11.04 – T-11.08, T-11.12, T-11.17, T-11.19, T-13.07, T-13.08.
- **Owner provides:** G-007 (coach states: design or approve my drafted copy), G-023, G-033, G-043, G-045.
- **Done when:** every drawn 06 state (gamer, dashboard-link and coach) and 10's four states pass; refund and payout amounts match the worked examples in the provider test dashboards.

## M6 · Report a problem and disputes (07)
- **Scope:** reason lists by role and window, evidence uploads (private), the response (coach; gamer when designed), Under review, coach-no-show automatic refund, team functions to resolve (refund, release, split, payment-problem), dispute emails, New Coach effects.
- **Testable:** T-6.07 – T-6.09, T-7.01 – T-7.14 (T-7.07 step 2 when G-006 is designed), T-11.13 – T-11.16, T-11.18.
- **Owner provides:** G-006 (design), G-019, G-020, G-029, G-030, G-031.
- **Done when:** all 11 states of 07 and 06's dispute states pass; each outcome moves the right money once.

## M7 · Live session (08)
- **Scope:** LiveKit rooms per booking, tokens, join records, voice, camera off by default, one screen share (computers only), saved chat with Realtime, banners, end-by-agreement, leave and rejoin, reconnecting, blocked microphone, ended screens, no-show report from the waiting room.
- **Testable:** T-5.01 – T-5.13, T-11.09, T-11.11.
- **Owner provides:** E-2 decision; LiveKit Cloud project keys; G-032, G-056.
- **Done when:** all 17 states of 08 pass (video and shared screens as the mockup's marked slots in screenshots); a real two-browser call on a phone and a computer works.

## M8 · The gamer's home (09)
- **Scope:** the dashboard and To do page with every rule in "Phase 3 decisions" (one place per booking, ordering, join-open first, 7-day resolved disputes, separate scrolling on desktop).
- **Testable:** T-13.03 – T-13.06.
- **Owner provides:** nothing new expected.
- **Done when:** all 6 states of 09 pass at 1440×900, 1280×720 and 390.

## M9 · The coach journey (17–21)
- **Scope:** application, drafts, submission, team functions (approve, reject with reason and section, not eligible), reapply rules, payout onboarding (Stripe Express, Xendit MANAGED) and its webhooks, the gates, profile setup with uploads and moderation, going live, New Coach progress, coach emails.
- **Testable:** T-8.01 – T-8.13, T-12.01 – T-12.11, T-2.12 (end to end).
- **Owner provides:** designs for 17–21 (or choose plain versions, G-057); G-022, G-024, G-034, G-035, G-038, G-055; moderation decision (E-6) and its key.
- **Done when:** a new coach goes from sign-up to bookable in both providers' test modes.

## M10 · Running a coach profile (22, 23)
- **Scope:** coach profile settings (bio, photos, languages, availability, prices, rank updates, new games, voice intro, showcase, portfolio, preview) and coach sessions list; team review functions and emails.
- **Testable:** T-9.01 – T-9.12.
- **Owner provides:** designs for 22 and 23; G-026, G-038, G-039, G-040, G-052.

## M11 · Account and system pages (24, 25)
- **Scope:** account settings (name, username, avatar, email change, password, phone, country/time zone/currency, delete request), suspension handling for gamers, 25 replaced by its design.
- **Testable:** T-10.01 – T-10.11.
- **Owner provides:** designs for 24 and 25; G-022 (gamer), G-036.

## M12 · Emails
- **Scope:** every email in `ARCHITECTURE.md` §9 reviewed together in the outbox: copy, consistency of labels and amounts, time zones, links, plain-text versions, Resend domain set-up.
- **Testable:** the email checks inside every scenario, all at once.
- **Owner provides:** final copy approval; email design if you want one (G-016).

## M13 · Hardening and launch readiness
- **Scope:** security review (RLS, authorization on every action, rate limits, upload checks), load test of browse and booking, failure drills (provider down, webhook storm, job runner stopped for an hour), accessibility audit (WCAG 2.2 AA), performance on a mid-range Android over 4G, Sentry alerts, backups, the launch checklist (Supabase Pro, Resend paid plan, Twilio Verify prices for the 10 countries, live keys, domain, terms published).
- **Owner provides:** G-037 (chat retention), go-ahead for production.

---

## E · Decisions needed from the owner

Answers go into `design/DECISIONS.md` under "Build decisions".

| # | Decision | Recommendation | Why |
|---|---|---|---|
| E-1 | Where the app lives | **Agreed 30 Oct 2026:** this repo, `web/` folder, its own Vercel project (DECISIONS.md, "Build decisions"). Domain still proposed: `app.harbourly.gg` | The waitlist site and its Vercel project stay untouched. |
| E-2 | Call provider for 08 | LiveKit Cloud (Singapore region) | Voice, optional camera, screen share and signed join/leave webhooks in one SDK, with server-side control of who may share. |
| E-3 | Chat storage | Postgres table + Supabase Realtime | Chat is saved, covered by RLS and readable by the team in Supabase without a second system. |
| E-4 | Timed jobs | Supabase pg_cron calls a per-minute tick; idempotent sweeps + outbox | Minute precision for the 30-minute hold, no extra vendor, safe to run twice. |
| E-5 | Exchange rates | Open Exchange Rates, daily | Covers all 10 currencies; display only, so daily is enough. |
| E-6 | Image moderation | Claude (Haiku) vision, refuse when unsure | Also reads text inside images and checks captions in the same call. Alt: AWS Rekognition plus a separate text check. |
| E-7 | Error monitoring | Sentry | Best Next.js support; PII scrubbing. |
| E-8 | Validation | Zod, shared by client and server; React 19 server actions, no form library | One schema per form, always re-checked on the server. |
| E-9 | Tests | Vitest, Playwright, pgTAP | Unit, end-to-end with the script's IDs, and RLS proven in the database. |
| E-10 | Rate limiting | Postgres-backed counters | No extra vendor; per-email and per-IP for log in, codes and resets. |
| E-11 | Auth emails | Supabase Send Email hook → our templates → Resend (G-014) | Makes the agreed email behaviours possible and shows them in the dev outbox. |
| E-12 | Payment model | Stripe Connect Express with separate charges and transfers; Xendit xenPlatform MANAGED sub-accounts (G-002, G-003) | Holds the gamer's money on the platform until release, then pays the coach their payout. |
| E-13 | Status machines | Postgres functions shared by app, jobs, webhooks and team; side effects via the outbox | One transition path for everyone, including team actions in Supabase. |
| E-14 | Seed data | Named scenarios per mockup state, loaded with the dev clock (G-044) | Reproduces every mockup exactly without forcing one timeline. |
| E-15 | Package manager and runtime | pnpm, Node 22 | Fast installs; matches Vercel. |
| G-001 | Missing 7 coaches and filler reviews | I draft them; you approve | Needed to reproduce 01 and every rating. |
| G-005 | Booking lifecycle edges | Add the three edges | The flow's own paths otherwise fail. |
| G-006, G-007 | Undesigned 06/07 states | Design chat draws them | They carry money and trust copy. |
| G-008 | System pages | Plain now, awaiting design | Needed from M3. |
| G-009 | Webapp Terms and Privacy | You provide; published on the marketing site | 13 and 16 need a real, versioned document. |
| G-010 – G-013 | Currencies, logged-out viewers, zone labels, whose zone | As recommended in GAPS.md | Browse can't be built for non-SGD viewers without them. |
| G-014 – G-016 | Auth emails, CAPTCHA, email copy | Send Email hook; invisible Turnstile; I draft copy | Agreed behaviours need them. |
| G-017 | Late, duplicate, charged-back payments | Automatic refunds; flag chargebacks | Nobody pays for a time they don't get. |
| G-018 | Whole-unit prices | Yes | Every amount is then exact. |
| G-019 – G-021 | Under review trigger; payment-problem outcomes; coach record at sign-up | As recommended | Needed to code M3 and M6. |
| G-025 | Person can't be in two sessions | Yes | Protects coaches who also book as gamers. |

## What I need before M1

1. Your answers to E-4, E-12 (at least in principle), E-13, E-14, and gaps G-001, G-005, G-018, G-025 (the rest can come at later checkpoints).
2. A Supabase **staging** project for previews (or your go-ahead for me to create it with the connected Supabase account), and a Vercel project for `web/` (root directory `web`). Local work uses the Supabase CLI.
