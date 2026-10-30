# Architecture

The technical design for the Harbourly webapp. Choices marked **(proposed, E-n)** wait for the owner's answer in the decisions table (`MILESTONES.md`, section E); gaps are `G-nnn` in `GAPS.md`.

## 1. Shape of the system

```
web/                       Next.js 16 app (App Router, React 19, TypeScript strict) — its own Vercel project (E-1)
  app/                     routes (section 4); each page.module.css lifted from its mockup
  components/<Name>/       one React component + <Name>.module.css per design/foundations/components/<Name>.css
  domain/                  pure TypeScript, no React, no I/O: money, time rules, status tables, availability
  server/                  server-only: Supabase clients, transitions, payments, calls, email, jobs, clock
  emails/                  React Email templates
  dev/                     dev tools (excluded from production builds)
  tests/                   Vitest unit + integration; Playwright e2e (IDs = TEST-SCRIPT.md)
supabase/
  migrations/              schema, RLS, functions (the status machines live here)
  tests/                   pgTAP: RLS and transition tests
  seed/                    scenario snapshots (section 9)
```

- **Server components by default.** Client components only where something is interactive (OtpInput, Field password toggle, Rating, ScrollArea, Tabs, countdowns, SlotPicker, Gallery, the call). Mutations are server actions; every one re-checks the session, the role and the input (Zod) on the server.
- **Domain logic is separate from UI.** `domain/` is pure and exhaustively unit-tested; `server/` composes it with I/O; pages only render.
- **Supabase clients:** a user-scoped client (RLS applies) for everything a person does; the service-role client only inside `server/jobs`, `server/webhooks` and the outbox worker, never imported by a page (enforced with `server-only` and a lint rule). No service key reaches the browser.

## 2. Data model

Postgres in Supabase. All times `timestamptz` (UTC). Money is `bigint` minor units plus a `currency` (`char(3)`). Every table has RLS on.

### Accounts and configuration
| Table | Key columns and constraints |
|---|---|
| `profiles` | `user_id` PK → `auth.users`; `username citext unique` (3–20, `^[a-z0-9][a-z0-9._]{1,18}[a-z0-9_]$`); `first_name`, `last_name` (private); `date_of_birth`; `country` → `countries`; `currency`; `time_zone` (IANA); `role_intent` (gamer/coach); `setup_completed_at`; `avatar_path`, `avatar_status`; `suspended_at`, `suspension_reason`; `deleted_at`. Phone lives in `auth.users.phone` (unique there: "one account per phone"). |
| `countries` | `code` PK, `name`, `gamer_allowed`, `coach_allowed`, `currency`, `dial_code`, `sort` — the 10 gamer countries; coach SG, MY, PH (Thailand false until G-002). |
| `currencies` | `code` PK, `symbol` ("S$", "RM ", "₱"…), `price_floor_minor` (SGD 1000, MYR 3500, PHP 43000), `display_round_to`, `max_price_steps` (G-010). |
| `fx_rates` | `(base, quote, as_of)` PK, `rate numeric` — daily snapshot (E-5). Display only; never used to charge. |
| `terms_versions` | `id`, `effective_on`, `points jsonb` (≤3), `url`, `published_at`. |
| `terms_acceptances` | `(user_id, terms_version_id)` PK, `accepted_at`. |
| `games` | the five games: `id`, `slug`, `name`. |

### Coaches
| Table | Key columns and constraints |
|---|---|
| `coaches` | `id` PK; `user_id unique`; `status` enum `draft, submitted, rejected, not_eligible, approved, live, suspended, banned`; `new_coach boolean`, `new_coach_progress smallint`; `country` (locked once `payout_accounts.verified`); `time_zone`; `bio` (≤500); `languages text[]`; `banner_path`, `banner_status`; `rejection_count`, `reapply_after`; `live_at`. |
| `coach_applications` | one row per submission: `coach_id`, `submitted_at`, `payload jsonb` (games, ranks, proof paths, link, motivation), `decision` (rejected/not_eligible/approved), `reason_category`, `note`, `flagged_section`, `decided_at`. Inputs are never wiped. |
| `coach_games` | `(coach_id, game_id)` unique; `rank_text` (≤40); `price_minor` whole units only (G-018), `currency`; `credentials text[]` (≤3); `status` `under_review, listed, declined`. Check: `price_minor >= floor(currency)`. |
| `rank_updates`, `voice_intros`, `portfolios` | pending/approved/declined review items with their uploads; the old value stays live until approved. |
| `availability_rules` | `coach_id`, `weekday` 0–6, `start_local time`, `end_local time` (whole hours) in `coaches.time_zone`. Expanded to concrete UTC slots per date (DST-safe). |
| `showcase_images` | `coach_id`, `position` 1–5, `path`, `caption` (≤80), `moderation_status` `checking, live, refused`, `replaces_id`. |
| `payout_accounts` | `coach_id` PK, `provider` (stripe/xendit), `provider_account_id`, `status` `not_started, in_progress, verified, failed, restricted`, `requirements jsonb`. |
| `reliability_incidents` | `coach_id` or `gamer_id`, `booking_id`, `kind` (coach_no_show, coach_late_cancel, coach_cancel, gamer_late_cancel, gamer_no_show), `at`. Feeds `ops.review_flags` view (G-023). |

### Bookings and money
| Table | Key columns and constraints |
|---|---|
| `bookings` | `id`; `gamer_id`, `coach_id`, `game_id`; `starts_at`, `ends_at` (= start + 60 min); `status` enum (section 3.1); **snapshot at hold:** `currency`, `price_minor`, `fee_rate_bp` (600), `commission_rate_bp` (1200), `fee_minor`, `total_minor`, `commission_minor`, `payout_minor`, `late_refund_minor` (half price), `late_payout_minor` (half − 12% of half); `provider`; `hold_expires_at`; `moved_from_starts_at`, `moved` boolean; `ended_at`, `release_due_at`; `completed_at`, `completion_kind` (confirmed/auto/dispute); `cancelled_at`, `cancelled_by`, `cancel_kind`; `refund_minor`; `review_closes_at`, `payment_problem_closes_at`. Checks tie every amount to the rates and price (e.g. `fee_minor = price_minor*fee_rate_bp/10000`). |
| `slot_claims` | `id`, `booking_id`, `coach_id`, `gamer_id`, `during tstzrange`, `kind` (`booking`, `reschedule_offer`), `active boolean`. **`EXCLUDE USING gist (coach_id WITH =, during WITH &&) WHERE (active)`** — no double booking, including holds and offered reschedule times. Person-level rule (G-025): a second exclusion on the coach's `user_id` and gamer `user_id` via `person_claims`. Releasing a claim sets `active = false` in the same transaction as the status change. |
| `booking_events` | audit: `booking_id`, `from_status`, `to_status`, `actor_kind` (gamer, coach, team, system, provider), `actor_id`, `reason`, `payload`, `at`. Insert-only. |
| `payments` | `booking_id`, `provider`, `provider_checkout_id unique`, `provider_payment_id`, `status` (open, paid, failed, expired, refunded_duplicate), `amount_minor`. |
| `money_movements` | `booking_id`, `kind` (refund, transfer), `amount_minor`, `idempotency_key unique`, `provider_ref`, `status` (pending, done, failed), `attempts`. The provider is called with the same idempotency key on every retry. |
| `webhook_events` | `(provider, event_id)` unique, `payload`, `received_at`, `processed_at`. Duplicate deliveries are no-ops. |
| `chargebacks` | `payment_id`, `provider_ref`, `status`, `amount_minor` (G-017). |

### Rescheduling, the call, disputes, reviews
| Table | Key columns and constraints |
|---|---|
| `reschedule_requests` | `booking_id`, `requested_by` (gamer/coach), `status` `open, accepted, declined, withdrawn, expired, cancelled`, `expires_at` (= min(sent + 48 h, start − 12 h)), `chosen_claim_id`, `declined_choice` (keep/cancel). **Partial unique index: one `open` per booking.** Offered times are `slot_claims` of kind `reschedule_offer` (1–3). |
| `call_presence` | `booking_id`, `user_id`, `joined_at`, `left_at`, `source` (provider webhook) — the join records the team checks for no-shows. |
| `end_requests` | `booking_id`, `requested_by`, `status` (open, withdrawn, declined, accepted). One open per booking. |
| `chat_messages` | `booking_id`, `sender_id`, `body` (text and links, ≤2,000), `sent_at`. Insert-only for participants while the call is open; read-only afterwards. |
| `disputes` | `booking_id`, `kind` (`window`, `payment`), `filed_by`, `filer_role`, `reason` (enum per role and window), `description` (≤1,000), `status` (`open, under_review, resolved_refunded, resolved_paid, resolved_split, resolved` for payment problems), `response_due_at` (48 h, or 24 h for coach no-show), `team_note`, `resolved_at`. **Partial unique: one unresolved `window` dispute per booking.** |
| `dispute_responses` | `dispute_id unique` (one response), `body` (≤1,000), `sent_at`. |
| `dispute_files` | `dispute_id` or `response_id`, `path`, `name`, `size`, `mime` (JPG, PNG, WebP, PDF; ≤10 MB; ≤5). |
| `reviews` | `booking_id unique`, `gamer_id`, `coach_id`, `stars` 1–5, `body` (≤500), `created_at`. Insert-only. `coach_rating` view gives average and count. |

### Platform
| Table | Purpose |
|---|---|
| `outbox` | transactional outbox: `kind` (email, refund, transfer, provider_expire, moderation…), `dedupe_key unique`, `payload`, `run_after`, `attempts`, `last_error`, `done_at`. Written in the same transaction as the change that causes it. |
| `email_log` | every email sent (or captured in dev): template, recipient, booking, provider id. |
| `rate_limits` | `bucket` (e.g. `login:email:<hash>`, `login:ip:<ip>`, `reset:<hash>`), `window_start`, `count`. |
| `account_deletion_requests` | `user_id`, `requested_at`, `processed_at` (G-036). |
| `dev.clock`, `dev.outbox` | development and preview only (section 10). |

### RLS summary
- **Default deny** on every table; policies grant the minimum.
- `profiles`: owner reads and updates own row (except status columns). Public view `public_profiles` exposes `username`, avatar (if live), country, nothing else. First/last name, date of birth and phone are owner-only.
- `coaches`, `coach_games` (listed), `availability_rules`, `showcase_images` (live), `reviews`, `coach_rating`: readable by anyone (including logged out) **only for coaches with status `live`**; the coach reads and edits their own drafts; status columns are never writable by users.
- `bookings`: the gamer reads rows where `gamer_id = auth.uid()`; the coach reads rows where `coach_id` is theirs **and** status is not `pending_payment` or `expired`. **No user can insert, update or delete bookings directly**: all writes go through `SECURITY DEFINER` functions that check the caller.
- `chat_messages`, `call_presence`, `end_requests`, `reschedule_requests`, `disputes`, `dispute_responses`, `dispute_files`: readable by the booking's two parties (payment disputes: the filer only). Writes only through functions.
- Storage buckets: `avatars`, `banners`, `showcase` (public read only after moderation passes, via a `live/` prefix the moderation worker copies to); `proofs`, `evidence`, `portfolio` private (owner and, for evidence, both parties of the dispute; the team through the dashboard).
- `ops` schema (team functions) executable only by the `team` role; `dev` schema doesn't exist in production.
- Gamer and coach data never mix: coach pages query by `coach_id` through coach-scoped functions; gamer pages by `gamer_id`. pgTAP tests prove each role sees only its own rows (section 11).

## 3. Status machines

Both machines are Postgres functions — the single place a status changes, used by the app, the jobs, the webhooks and the team alike:

- `booking_transition(booking_id, to_status, actor_kind, actor_id, reason, payload)` and `coach_transition(...)`.
- Each one: locks the row (`FOR UPDATE`), reads the allowed-transition table, checks the actor and the condition (using `app_now()`, section 6), writes the status, releases or creates slot claims, inserts the `*_events` audit row and the `outbox` rows (emails, refunds, transfers) **in one transaction**, then returns. Calling it twice with the same intent is a no-op (it returns the current state), so retries are safe.
- A trigger rejects any `UPDATE` of `status` (and of the money columns) that doesn't come from these functions (a transaction-local flag set only inside them), so a raw edit in the Supabase table editor fails with a clear message.
- Side effects that leave the database (Stripe/Xendit calls, Resend) run in the **outbox worker** after commit, each with an idempotency key. If one fails it retries with backoff and alerts after 5 attempts.
- `web/domain/status/` holds the same transition tables as TypeScript constants (for types and the UI's "what can I do now" logic); a test compares them to the SQL table so they can't drift.

### 3.1 Booking (diagram 11, plus G-005 proposals marked †)

| From | To | Who | Condition | Side effects | Emails |
|---|---|---|---|---|---|
| — | pending_payment | gamer | slot free (exclusion constraint), ≥2 h away, ≤4 weeks, coach live and bookable, gamer phone verified, not own coach profile | snapshot price and amounts; claim slot; `hold_expires_at` = now + 30 min; create provider checkout (expires at the same time) | — |
| pending_payment | confirmed | provider | provider says paid (webhook or return/reconcile check) | `payments.paid`; claim stays | Payment received (both) |
| pending_payment | expired | system / gamer | hold passed (job) after the provider checkout is expired; or gamer pressed Choose another time | release claim | Payment window expired (gamer; job only) |
| confirmed | confirmed | gamer or coach (the one who didn't ask) | open request, chosen time still claimed; not moved before | move booking; release other offers; `moved = true`; recompute deadlines | Reschedule accepted (requester; both with new time) |
| confirmed | cancelled | gamer | now ≤ start − 1 h | full refund `total_minor` | Booking cancelled (both) |
| confirmed | cancelled | gamer | start − 1 h < now < start | refund `late_refund_minor`; transfer `late_payout_minor`; gamer incident | Booking cancelled (both; coach's shows their half) |
| confirmed | cancelled | gamer | declined a coach's request (any time before start) | full refund | Booking cancelled (both) |
| confirmed | cancelled | coach | now < start (G-005) | full refund; incident (`coach_late_cancel` if < 24 h, else `coach_cancel`); New Coach reset if < 24 h | Booking cancelled (both); progress reset (coach) |
| confirmed | in_session | system | first join (provider webhook), now ≥ start − 10 min | presence row | — |
| confirmed | disputed | gamer | coach no-show report, now ≥ start + 15 min, nobody joined | dispute (24 h window); pause release | Dispute filed (both) |
| confirmed † | pending_confirmation | system | now ≥ end, nobody joined | `release_due_at` = end + 72 h | Session ended, please confirm (gamer) |
| in_session † | disputed | gamer | coach no-show report from the waiting room, coach never joined | close the call; dispute (24 h) | Dispute filed (both) |
| in_session † | cancelled | gamer, coach | now < start | as the matching confirmed → cancelled row | as above |
| in_session | pending_confirmation | system | scheduled end, or both agreed to end | close call; `ended_at`; `release_due_at` = ended + 72 h | Session ended, please confirm (gamer) |
| pending_confirmation | completed | gamer / system | gamer confirms, or now ≥ `release_due_at` with no open dispute | transfer `payout_minor`; `review_closes_at` = +30 days; New Coach progress +1 | Session confirmed or auto-confirmed (both); Payment released (coach); Leave a review (gamer, G-033) |
| pending_confirmation | disputed | gamer or coach | before release; no open dispute | pause release | Dispute filed (both) |
| disputed | refunded | team / system | team refund; or coach no-show with no response by `response_due_at` | full refund; New Coach reset; coach no-show incident | Dispute outcome (both) |
| disputed | completed | team | release to coach | transfer `payout_minor`; review window opens | Dispute outcome (both) |
| disputed | split | team | upheld gamer no-show | refund `late_refund_minor`; transfer `late_payout_minor`; gamer incident | Dispute outcome (both) |

Terminal: cancelled, expired, refunded, split, completed. Payment problems after completion live on the dispute row only.

**Reschedule requests** (sub-machine on `reschedule_requests`): open → accepted / declined / withdrawn (requester) / expired (job at `expires_at`) / cancelled (booking cancelled). Rules: only while status `confirmed` and now < start − 24 h; offers 1–3, each ≥ 24 h from now, ≤ 4 weeks, from the coach's free times; one open per booking; none after one accepted.

**Disputes** (sub-machine): open → under_review (response sent or window passed; or team, G-019) → resolved_*; coach-no-show open → resolved_refunded automatically after 24 h with no response.

### 3.2 Coach (diagram 12)

| From | To | Who | Condition | Side effects | Emails |
|---|---|---|---|---|---|
| — | draft | person | country allows coaching; no coach record | sidebar coach block | — |
| draft | submitted | coach | required step-2 fields; proofs uploaded | `coach_applications` row | Application submitted |
| submitted | rejected | team (`ops.reject_application`) | reason category, optional note, flagged section | `rejection_count + 1`; 3rd+ → `reapply_after` = +14 days | Application rejected (reason, reapply date) |
| rejected | submitted | coach | flagged section changed; now ≥ `reapply_after` | new application row | Application submitted |
| submitted | not_eligible | team | — | — | Application rejected (not eligible) |
| submitted | approved | team | — | gates listed | Application approved |
| approved | live | system | payout verified, phone verified, profile complete (≥1 game with a rate, bio, availability) | `new_coach = true`, progress 0; listed | You're live and bookable |
| live | live (progress) | system | completion / reset events | label drop at 5 | Your New Coach label has dropped / progress was reset |
| live | suspended | team | — | hidden; upcoming bookings cancelled with full refunds (G-022) | Account suspended |
| suspended | live | team | — | listed again | — |
| live, suspended | banned | team | — | account suspended permanently | Account suspended |

## 4. Route map

| Route | Page | Mockup | Flow nodes |
|---|---|---|---|
| `/coaches` | 01 Browse coaches | 01 | 3 Browse, Card; 1 Browse |
| `/coaches/[username]` | 02 Coach profile (`?preview=1` for the coach's preview) | 02 | 3 Profile, Own, NoBook; 9 Preview |
| `/coaches/[username]/book` (`?game=&start=` carries a choice through log in) | 03 Pick a slot | 03 | 3 Game, Slot, LoggedIn, Phone, VerifyPhone, Hold |
| `/checkout/[bookingId]` | 04 Checkout summary | 04 | 3 Summary, Hosted |
| `/checkout/[bookingId]/return` | 05 Payment return | 05 | 3 Back, Result, Confirmed, Failed, Expired |
| `/sessions/[id]` | 06 Session detail, gamer | 06 | 4 all; 5 Join; 6 GamerAct, Review; 7 dispute section |
| `/coach/sessions/[id]` | 06 Session detail, coach | 06 coach-* | 4, 6, 7 (coach side); 9 Detail |
| `/sessions/[id]/report`, `/coach/sessions/[id]/report` | 07 Report a problem (and respond: `?respond=1`) | 07 | 7 Start…Form, PayForm, Notify |
| `/sessions/[id]/live` | 08 Live session (both roles) | 08 | 5 all |
| `/dashboard` | 09 Gamer dashboard | 09 | 13 GDash; 2 GDash |
| `/dashboard/to-do` | 09 To do page | 09 todo-all | 13 GTodo |
| `/sessions` | 10 My sessions | 10 | 13 GSess; 1 GSessions |
| `/signup` | 11 Sign up | 11 | 2 Start, Method, Email |
| `/verify-email` (+ `/auth/confirm` handler) | 12 Verify your email | 12 | 2 Verify |
| `/signup/details` | 13 Finish setting up | 13 | 2 Details…AppIntro |
| `/login` | 14 Log in | 14 | 2 Login, LMethod, Creds |
| `/auth/callback` | Google return (no UI) | — | 2 Google, Checks |
| `/forgot-password`, `/reset-password` | 15 | 15 | 2 Forgot, ResetEmail, Reset |
| `/terms/accept` | 16 Accept updated terms | 16 | 2 Terms, AcceptTerms |
| `/coach/apply`, `/coach/apply/details` | 17, 18 **[awaiting design]** | — | 8 Step1, Step2, Draft, Rejected |
| `/coach/dashboard` | 19 **[awaiting design]** | — | 8 Gates; 9 CDash, Disputes; 13 CDash |
| `/coach/payout` | 20 **[awaiting design]** | — | 8 Payout, PayoutFail; 9 PayoutSet |
| `/coach/setup` | 21 **[awaiting design]** | — | 8 Setup |
| `/coach/profile` | 22 **[awaiting design]** | — | 9 Settings… |
| `/coach/sessions` | 23 **[awaiting design]** | — | 9 CSessions; 13 CSess |
| `/account` | 24 **[awaiting design]** | — | 10 Account… |
| `not-found`, `error`, `/session-expired`, `/sign-in` | 25 **[plain, awaiting design]** | — | 10 System… |
| `/api/webhooks/{stripe,xendit,livekit}` | webhooks | — | 3 Result; 5 join records |
| `/api/auth/email-hook` | Supabase Send Email hook (G-014) | — | 2 emails |
| `/api/jobs/tick` | job runner (section 5) | — | timers |
| `/dev/*` | dev tools (section 10) | 0.2 → `/dev/components` | — |

**Middleware order** for every logged-in page (diagram 2's checks): session valid → email verified → setup finished → latest terms accepted → suspended? → page. Each failure redirects with `next=` so the person returns afterwards (including the booking choice on 03).

## 5. Timed jobs

**(proposed, E-4)** Supabase `pg_cron` calls `/api/jobs/tick` every minute through `pg_net`, with a secret header. The tick:

1. Reads the time from the clock (section 6).
2. Runs each **sweep**: a query for rows whose deadline has passed and whose status says the work isn't done, processed with `FOR UPDATE SKIP LOCKED` in small batches, each through the transition function. Sweeps are naturally idempotent: a row already moved is no longer selected.
3. Drains the outbox (emails, refunds, transfers, provider calls) with idempotency keys.

| Sweep | Due when | Action |
|---|---|---|
| Hold expiry | `pending_payment` and `hold_expires_at ≤ now` | expire the provider checkout first; if already paid → confirm; else → `expired` |
| Payment reconcile | `pending_payment` with a checkout older than 2 min | ask the provider; confirm if paid |
| Reminders | confirmed, `starts_at − 24 h` / `− 1 h` passed | email, dedupe key `reminder:24h:<booking>` |
| No-one joined | confirmed, `ends_at ≤ now` | → `pending_confirmation` (G-005) |
| Session end | in_session, `ends_at ≤ now` | → `pending_confirmation`; close the room |
| Confirm reminder | pending_confirmation, `release_due_at − 24 h` passed | "24 hours left to confirm" |
| Auto-release | pending_confirmation, `release_due_at ≤ now`, no open dispute | → `completed` |
| Reschedule expiry | open request, `expires_at ≤ now` | → `expired`; release offers; email requester |
| Dispute window | open dispute, `response_due_at ≤ now` | coach no-show without response → `refunded`; else → `under_review` |
| New Coach nudge | approved coach not live at +3 / +10 days | nudge email (G-034) |
| Leave a review | completed (auto or dispute) + 1 h | email (G-033) |
| FX rates | daily 00:05 UTC | fetch and store |
| Retention | daily | delete chat past retention (G-037) |

The UI never waits on a sweep: anything time-based shown on a page is computed from the stored deadlines and the clock (e.g. a passed hold reads as "no longer held" even if the sweep runs a minute later), but the status itself only ever changes in the transition function.

Alternatives considered: Vercel Cron (minute schedules need Pro and add another place jobs live); Inngest or Trigger.dev (good, but another vendor for what a tick and a table do).

## 6. Time

- **One clock.** `server/clock.ts` exports `now()`. In production it is `new Date()`. In development and preview it adds the offset stored in `dev.clock`. In SQL, `app_now()` returns `now()` plus the same offset; in production the `dev` schema doesn't exist and the function body is plain `now()` (the migration branches on a database setting `app.env`, set only on dev and preview databases). Two independent locks: the app also checks `VERCEL_ENV !== 'production'`.
- **Storage:** UTC everywhere. Coaches' availability is wall-clock hours in their IANA zone, expanded per date, so daylight saving (for coaches living abroad) is handled.
- **Display:** every time is formatted on the server in the viewer's account zone (logged out: browser zone cookie, G-011) with `Intl.DateTimeFormat('en-GB')` and the zone label table (G-012): `Mon 5 Oct`, `20:00 SGT`, `Wed 7 Oct · 20:00–21:00 SGT`, countdowns `49h 50m`, `24:12`.
- **Named constants** — `web/domain/rules.ts`, each with its source:

| Constant | Value | Source |
|---|---|---|
| `SESSION_LENGTH` | 60 min | Core: Sessions |
| `HOLD_DURATION` | 30 min | Core: Payment hold |
| `HOLD_WARNING` | 5 min | 04 nearly-expired |
| `MIN_LEAD_TIME` | 2 h | Phase 1: Pick a slot |
| `BOOKING_HORIZON` | 28 days | Phase 1: Pick a slot |
| `RESCHEDULE_CUTOFF` | 24 h before start | Rescheduling |
| `RESCHEDULE_OFFER_MIN_LEAD` | 24 h from now | Phase 2: Offered times |
| `RESCHEDULE_OFFER_HORIZON` | 28 days from now (G-043) | Phase 2 |
| `RESCHEDULE_MAX_OFFERS` | 3 | Rescheduling |
| `RESCHEDULE_REPLY_WINDOW` | 48 h after sent | Rescheduling |
| `RESCHEDULE_REPLY_LATEST` | 12 h before start | Rescheduling |
| `FULL_REFUND_CUTOFF` | 1 h before start | Cancellation (23 Oct) |
| `COACH_LATE_CANCEL` | 24 h before start | Coach reliability |
| `JOIN_OPENS` | 10 min before start | In-session timing |
| `NO_SHOW_REPORT_AFTER` | 15 min after start | Disputes; Phase 2 |
| `CALL_BANNERS` | 10, 5, 1 min before end | In-session timing |
| `REMINDERS` | 24 h and 1 h before start | Emails |
| `AUTO_RELEASE` | 72 h after the session ends | Core; In-session timing |
| `CONFIRM_REMINDER` | 24 h before auto-release | Emails |
| `PENDING_SOON` | under 24 h left (amber) | Phase 2: extra states |
| `DISPUTE_RESPONSE_WINDOW` | 48 h | Phase 2: Disputes |
| `COACH_NO_SHOW_RESPONSE_WINDOW` | 24 h | Policy update: No-shows |
| `PAYMENT_PROBLEM_WINDOW` | 30 days after release | Disputes |
| `REVIEW_WINDOW` | 30 days after completion | Phase 2: Review |
| `RESOLVED_DISPUTE_ON_DASHBOARD` | 7 days | Phase 3 |
| `REAPPLY_WAIT` | 14 days after the 3rd rejection | Rejected applications |
| `NEW_COACH_SESSIONS` | 5 | Policy update |
| `COACH_CANCEL_FLAG` | 3 in 30 days | Coach reliability |
| `VERIFY_LINK_TTL` | 24 h | Phase 4: Verify |
| `RESET_LINK_TTL` | 1 h | Phase 4: Log in |
| `EMAIL_RESEND_COOLDOWN` | 60 s | Phase 4: Verify |
| `OTP_TTL`, `OTP_RESEND`, `OTP_MAX_TRIES` | 10 min, 60 s, 5 | Phase 4: Phone code |
| `LOGIN_MAX_TRIES`, `LOGIN_LOCK` | 10, 15 min | Phase 4 (G-041) |
| `MIN_AGE` | 18 | Age |
| `PAGE_SIZES` | browse 12, reviews 5, past sessions 20, to do 3, recent 3, coming-up rows 3 | Phase 1, Phase 3 |
| `REFUND_TIMING_COPY` | "up to 10 working days" | Phase 2: Disputes |

## 7. Money

`web/domain/money/` — pure, exhaustive tests, no floats (integer minor units; rates in basis points).

- `quote(price)` → `{ price, fee (6%), total, commission (12%), payout, lateRefund (½ price), latePayout (½ price − 12% of ½), fullRefund (= total) }`, stored on the booking at hold time.
- `cancellationOutcome(booking, actor, now, context)` → full refund / late split / coach cancel, from the snapshot and the named constants.
- `disputeOutcome(booking, outcome)` → refund / release / split amounts.
- `priceFloor(currency)`, `isWholeUnits(price)` (G-018), `convertForDisplay(price, from, to, rates)` → rounded "≈" value (G-010).
- `format(amount, currency)` → `₱1,850.00`, `S$47.70`, `RM 159.00`; `formatSessionPrice` → `S$45 / session`, `≈S$43 / session`, `from ≈S$43 / session`.
- **Worked examples as tests:** ₱1,850.00 + ₱111.00 = ₱1,961.00; payout ₱1,850.00 − ₱222.00 = ₱1,628.00; late cancel ₱925.00 back, coach ₱925.00 − ₱111.00 = ₱814.00; Vexa S$45.00 + S$2.70 = S$47.70, payout S$39.60, late S$22.50 / S$19.80; Mirae S$40.28; nullpoint RM 159.00; Ghostline RM 127.20; floors S$10, RM 35, ₱430. Property tests: refund + payout + platform share always equals the amount charged.

Money moves:
- **Stripe** (SG, MY coaches) **(proposed, E-12)**: Connect Express accounts; Checkout Session on the platform in the coach's currency with `expires_at` = hold end and metadata `booking_id`; "separate charges and transfers": at completion a Transfer of `payout_minor` with `source_transaction`; refunds on the platform charge. Fees: Harbourly keeps 6% + 12%, and pays processing (including on coach cancels).
- **Xendit** (PH coaches): xenPlatform MANAGED sub-accounts; an Invoice (30-minute duration) on the platform; at completion a transfer of `payout_minor` to the sub-account; refunds through the Refund API (G-003).
- Both behind one `PaymentProvider` interface (`createCheckout`, `getCheckoutStatus`, `expireCheckout`, `refund`, `transfer`, `verifyWebhook`, `onboardingLink`, `dashboardLink`), with a third **simulated** implementation for development (section 10).
- Webhooks: signature verified (Stripe signing secret; Xendit callback token), stored in `webhook_events` by unique event id first, then processed; a replay is a no-op. "Paid" is only ever the provider's word.

## 8. Integrations

| Service | Use | Notes |
|---|---|---|
| Supabase | Postgres, Auth, Storage, Realtime, pg_cron | Auth settings per DECISIONS "Sign-in services": email confirmation on, minimum 8, PKCE, CAPTCHA (Turnstile), leaked-password protection (Pro); our HIBP range check gives the exact error everywhere (also in local dev). Send Email hook (G-014). |
| Google Cloud OAuth | Continue with Google | Owner creates the OAuth client. |
| Twilio Verify | 6-digit phone codes via Supabase's phone provider | Fraud Guard on; dev uses Supabase test OTPs for seeded numbers. |
| Cloudflare Turnstile | CAPTCHA on sign-up, log in, send code | Invisible mode (G-015). |
| Resend | every email | React Email templates; domain harbourly.gg (already used by the waitlist). |
| Stripe, Xendit | payments, payouts, KYC | Test mode until launch. |
| LiveKit Cloud **(proposed, E-2)** | voice, optional camera, one screen share | Tokens minted server-side per booking with publish rules (screen share only from desktop browsers; one sharer enforced server-side); `participant_joined` / `participant_left` webhooks → `call_presence` (the no-show join records); room closes at the scheduled end. Region: Singapore. |
| Supabase Realtime | chat delivery, end requests, "other person joined" | Messages are written to `chat_messages` through a function (saved) and broadcast. |
| Open Exchange Rates **(proposed, E-5)** | daily rates for "≈" prices | Covers all 10 currencies (the free ECB feed lacks VND, BND, KHR, LAK, MMK). |
| Image moderation **(proposed, E-6)** | avatars, banners, showcase images and captions, public portfolio | Claude (Haiku) vision with a strict "pass / refuse with reason" output; uncertain → refuse. Images are stripped of metadata, resized, then checked before they're copied to the public path. |
| Sentry **(proposed, E-7)** | errors, performance | PII scrubbing; no chat or evidence contents. |

## 9. Emails

All from Resend through one `sendEmail(template, to, data, dedupeKey)` (outbox). Copy drafted per G-016.

| Email | To | Trigger |
|---|---|---|
| Verify your email | new email account | sign-up; log-in while unverified; Send a new link |
| You already have an account | existing account | sign-up with that email (G-014) |
| Reset password (or "you log in with Google") | the email, if an account | Send reset link |
| Password changed | account | reset or change password |
| Email changed | old address | email change verified |
| Terms updated | everyone | team publishes a terms version |
| Account suspended | gamer or coach | `ops.suspend_*`, ban |
| Deletion requested | account | delete request (G-033) |
| Payment received | gamer, coach | pending_payment → confirmed |
| Payment window expired, slot released | gamer | hold expiry sweep |
| Session reminder 24 h / 1 h (with link) | both | reminder sweep |
| Session ended, please confirm (72 h deadline) | gamer | → pending_confirmation |
| 24 hours left to confirm | gamer | confirm-reminder sweep |
| Session confirmed / auto-confirmed | both | → completed |
| Payment released (12% and payout) | coach | → completed, → cancelled (late), → split |
| Leave a review | gamer | G-033 |
| Reschedule requested | other party | request sent |
| Reschedule accepted / declined / expired | requester (accepted: both, new time) | request resolved |
| Reschedule request withdrawn | other party | G-033 |
| Booking cancelled (refund amount; coach's half for late cancel) | both | → cancelled |
| Dispute filed (receipt / invited to respond) | filer / other party | → disputed; payment problem (filer only) |
| Response received | filer | G-033 |
| Dispute outcome (with team note, refund timing) | both (payment problem: filer) | → refunded, completed, split; payment dispute resolved |
| Application submitted / approved / rejected | coach | coach transitions |
| Still to finish before you go live | coach | nudge sweep |
| You're live and bookable | coach | → live |
| Rank update / new game / voice intro approved or declined | coach | team review functions |
| Portfolio result | coach | team review |
| New Coach label dropped / progress reset | coach | progress changes |
| Reliability warning | coach | `ops.warn_coach` |

## 10. Dev tooling

All under `/dev`, compiled only when `NODE_ENV !== 'production'` **and** `VERCEL_ENV !== 'production'`; every dev route and server action also checks at runtime and returns 404 in production; the production database has no `dev` schema.

- **Clock:** set "now" (offset), reset to real time. Shown as an amber bar across the top of every page while time travel is on.
- **Users:** switch to any seeded account (server issues a session for that user via the admin API); remove a phone; mark email unverified.
- **Seed:** reset the database to a named scenario (section 11), which also sets the clock.
- **Payments:** simulated provider pages for Stripe and Xendit styles (Pay, Fail, Pay but delay or drop the webhook, Pay after the hold, Pay twice); replay a webhook. Preview uses real test mode.
- **Jobs:** list due sweeps; run all now; run one.
- **Outbox:** every email (and SMS code) the app would send, rendered.
- **Faults:** make a chosen page's data load fail or hang (for loading and error states).
- **Terms:** publish a new terms version.
- **Components:** `/dev/components` — the rebuilt 0.2 library.

## 11. Seed data

- `supabase/seed/` holds the cast (accounts, profiles, coaches, games, availability, reviews; G-001 for the missing parts) and **scenarios** (G-044): `fresh`, `phase1`, `kairo-wed`, `busy`, `quiet`, `new`, `terms`, `coach-*`, plus one per mockup state that needs its own facts. Each scenario = cast + bookings + a clock time, written as SQL calling the same functions the app uses (so seeded bookings have consistent snapshots, claims and events).
- Fictional only: the cast in DECISIONS and HANDOFF; emails `<handle>@example.com`; phone numbers from the reserved test ranges.

## 12. Testing

- **Unit (Vitest):** `domain/` (money, rules, availability expansion, formatting, status tables) — every rule, boundary (±1 second) and forbidden transition.
- **Database (pgTAP via `supabase test db`):** transition functions (allowed, forbidden, wrong actor, idempotent), exclusion constraints (holds, offers, person-level), RLS per role (gamer, coach, other gamer, anonymous, team).
- **Integration (Vitest + local Supabase):** webhooks (signature, replay, out-of-order), outbox retries, sweeps run twice.
- **End to end (Playwright):** `tests/e2e/T-x.yy.spec.ts` per scenario, driven through the dev tools; plus the screenshot check (1440 and 390 against `design/tools/render.mjs` output, `framediff.py`), and layout checks at 1280, 1024, 820, 320 and 1280×720. Comparison images go to `web/.screenshots/` (git-ignored).
- **Accessibility:** axe in Playwright on every state; keyboard walks for forms, tabs, OTP, rating, slot picker, call controls.
- **Before every commit:** lint (ESLint, `next lint` rules + no service-role imports in client code), `tsc --noEmit`, unit, e2e for the milestone.

## 13. Environments and deploy

| Environment | App | Database | Payments | Email / SMS |
|---|---|---|---|---|
| Local | `pnpm dev` in `web/` | Supabase CLI (Docker), `app.env = dev` | simulated | dev outbox; Supabase test OTPs |
| Preview | Vercel preview deploys of the branch (separate Vercel project, root `web/`) | one hosted **staging** Supabase project, `app.env = preview` | Stripe and Xendit test mode | dev outbox (no real sends); real Twilio only to allow-listed test numbers |
| Production | `app.harbourly.gg` **(proposed, E-1)**, only when you say launch | Supabase Pro project, no `dev` schema | live keys, only when you say | Resend live, Twilio live |

- Secrets only in environment variables (Vercel and Supabase); `web/.env.example` lists every one with a comment; nothing secret committed.
- Migrations applied by the Supabase CLI from CI to staging; to production only with your approval.
- The marketing and waitlist site (`landing.html`, `api/`, `vercel.json`, …) stays in its own Vercel project and is never touched.
