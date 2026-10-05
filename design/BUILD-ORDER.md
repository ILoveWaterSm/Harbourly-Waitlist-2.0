# Harbourly webapp design build order

The order the webapp pages are designed in. Each numbered item is one HTML mockup in `/design`, built on the design-system tokens, with a state switcher and a desktop/mobile toggle.

Sources: `USER-FLOW.md` (what exists) and `DECISIONS.md` (how it behaves). Anything not listed here or in the flow needs agreeing before it is designed.

How it is ordered:

- Foundations first, so every page uses the same parts.
- Then the core loop, where most components are proven.
- Then supporting flows, which mostly reuse what exists.
- Each phase ends with a review checkpoint. The next phase starts only after you've reviewed.

Routes marked *proposed* are not in the feature list and can be renamed at build time. Size: **S** small, **M** medium, **L** large (many states).

---

## Phase 0: Foundations

Pages: [Tokens](https://claude.ai/artifact/BSQtCHx4vyrXbfw75WN6Ti) (`design/pages/0.1-tokens.html`) · [Components](https://claude.ai/artifact/H74MmqqDTxjtC5hv7zo5uu) (`design/pages/0.2-components.html`) · [Canvas](https://claude.ai/artifact/AqzF4kYNMmXf555w8KbJpZ)

### 0.1 Tokens and base styles · S
- `design/foundations/tokens.css`: every design-system token by its exact name, plus the two new ones, `--shadow-flat` and `--shadow-cta-rest`.
- Base page styles: `--bg` ground, fonts, type scale (page title `--text-kpi`, section title `--text-card-title`, card title `--text-h3`).
- A token sheet page to check colours, type and spacing.

### 0.2 Component library · L
One page showing every shared component in every state. Introduces:
- **App shell:** top nav (logged out, logged in) with blur; sidebar (gamer only; gamer plus coach blocks with the active one highlighted; "Become a coach" vs "Coach dashboard"); mobile navigation.
- **Buttons:** primary (resting glow, hover halo), secondary outline, text link, icon button; disabled and loading.
- **Form fields:** text, select, textarea with character counter, checkbox, date of birth, phone with OTP code entry, image upload (single and up to 5), step counter, field error.
- **Status label:** mono label with coloured dot, for every booking and dispute status.
- **Badges:** Verified, New Coach.
- **Avatar:** photo, default avatar.
- **Price:** exact and converted ("≈ S$43 / session", "from S$38").
- **Rank line, rating display, star rating input.**
- **Cards:** flat, and the one accent card with the glowing top line.
- **Coach card** (browse).
- **List row** (sessions lists).
- **Notices:** info, warning (amber), error; in-call reminder banner.
- **Countdown** (hold timer, auto-release timer).
- **Confirm step** (used for cancel booking, end session, delete account).
- **Patterns:** empty state, loading skeleton, error with retry.

**Checkpoint 1:** foundations and components.

---

## Phase 1: Find and book a coach

### 1. Browse coaches · M
`/coaches` *proposed*. Logged in and logged out.
- Filters: game, price. Sort: price (default, low to high), rating, most reviewed.
- States: results, filtered, no results, loading, load more, error, prices in the viewer's currency with "≈".

### 2. Coach profile · L
`/coaches/[username]` *proposed*. Viewable logged out.
- Avatar, banner, name, Verified or New Coach, bio, per-game sections (rank, credentials, price), availability preview, voice intro, reviews.
- States: Verified coach, New Coach, one game vs several, no reviews yet, no voice intro, converted price with "Kairo's price is ₱1,850" line, logged out (Book leads to log in), your own profile (no Book button), preview mode (used later by 22), loading, not found.

### 3. Pick a slot · M
`/coaches/[username]/book` *proposed*.
- Choose game, then a one-hour slot from weekly availability in your local time.
- States: slots available, nothing free this week, slot just taken, returning after log in, phone not verified (verify before continuing).

### 4. Checkout summary · M
`/checkout/[bookingId]` *proposed*.
- Coach price, platform fee, total in the coach's currency, the "your bank converts this" line, cancellation rule, how payment is held, hold countdown (30 minutes).
- States: same currency, different currency, hold nearly expired, hold expired, back after a failed payment.

### 5. Payment return · S
`/checkout/[bookingId]/return` *proposed*.
- States: confirming your payment, booking confirmed, payment didn't go through (try again while held), slot no longer held (pick another).

**Checkpoint 2:** the booking flow end to end.

---

## Phase 2: The session and after

### 6. Session detail, gamer and coach · L
`/sessions/[id]` and `/coach/sessions/[id]` *proposed*. One layout, two role views.
- **Upcoming, more than 24 hours:** Request a new time, Cancel booking.
- **Upcoming, under 24 hours:** locked, with the reason; coach can still cancel.
- **Reschedule:** request form (offer up to 3 slots); waiting on reply; request received (pick a slot or decline); coach's request declined (gamer chooses keep or cancel); expired.
- **Cancel:** confirm step with exact refund amounts for each case; cancelled.
- **Join:** opens 10 minutes before; mobile screen-share note.
- **Pending confirmation:** confirm or report a problem, auto-release countdown (gamer); waiting on gamer (coach).
- **Completed:** leave a review (5 stars, optional text); review left.
- **Disputed:** dispute section with status, details, the other person's response, outcome.
- **Also:** awaiting payment (continue to payment), expired, refunded, loading, error.

### 7. Report a problem · M
`/sessions/[id]/report` and `/coach/sessions/[id]/report` *proposed*.
- Reason list by role and timing (window vs within 30 days after completion), description, optional evidence upload, submitted.
- Response form for the other person (one response, optional evidence).
- States: each reason list, validation, upload error, submitted, response sent.

### 8. Live session · L
`/sessions/[id]/live` *proposed*. Shared by gamer and coach.
- Call, chat (saved), screen share on computers.
- States: waiting for the other person; no-show report available 15 minutes after start (gamer); live; screen share on; mobile (watching only, with note); reminder banners at 10, 5 and 1 minutes; end request sent; end request received (End now, Keep going); reconnecting; camera or microphone blocked; session ended.

**Checkpoint 3:** session lifecycle.

---

## Phase 3: Gamer home

### 9. Gamer dashboard · L
`/dashboard` *proposed*.
- Cards: next upcoming session, awaiting your confirmation (time left), awaiting payment (hold time left), reschedule request waiting on you, reviews you owe, open disputes you've filed, recent session history, quick links (browse coaches, all sessions).
- States: every card's empty state, brand-new account (all empty), busy account, loading, error.

### 10. My sessions · S
`/sessions` (feature list).
- Plain list: coach, date and time, status, "Reschedule requested" second line.
- States: list, empty, loading, error.

**Checkpoint 4:** gamer side complete.

---

## Phase 4: Sign up, log in, account access

### 11. Sign up · S
`/signup` *proposed*.
- Email and password, or Google.
- States: errors (email already used, weak password), loading.

### 12. Verify your email · S
`/verify-email` *proposed*.
- States: sent, resend, link expired, verified.

### 13. Finish setting up your account · M
`/signup/details` *proposed*.
- First name, last name, username, date of birth, phone with OTP on the same page, country, gamer or coach, terms checkbox.
- States: OTP sent, wrong code, resend timer, verified; username taken; under 18 (blocked); country not supported (blocked); coaching not available in your country (continue as gamer); submitting.

### 14. Log in · S
`/login` *proposed*.
- Email and password, or Google.
- States: wrong details, "log in to book with Kairo" context, loading.

### 15. Forgot and reset password · S
`/forgot-password`, `/reset-password` *proposed*.
- States: email sent, link expired, new password set.

### 16. Accept updated terms · S
`/terms/accept` *proposed*.
- Blocking screen before continuing.

**Checkpoint 5:** getting in.

---

## Phase 5: Becoming a coach

### 17. Coach application, step 1 · S
`/coach/apply` *proposed*.
- What coaching on Harbourly involves; what you'll need (government ID, bank account in your country, proof of rank).

### 18. Coach application, step 2 · L
`/coach/apply/details` *proposed*.
- Games and rank per game, proof images (up to 5), marketplace profile link (optional), what made you start coaching.
- States: empty, partly filled (draft saved), validation, upload error, submit confirm, submitted.
- Rejected: reason at the top, flagged section highlighted, resubmit disabled until it changes; third rejection (14-day wait with date); not eligible.

### 19. Coach dashboard · L
`/coach/dashboard` *proposed*.
- **Draft:** continue your application.
- **Submitted:** under review.
- **Rejected:** reason, edit and resubmit; or wait date.
- **Not eligible.**
- **Approved:** what's left before you go live (payout, phone, profile), each done or to do; payout couldn't be verified.
- **Live:** bookable confirmed, next upcoming session, reschedule request waiting on you, earnings (released and held), rating and recent reviews, game listings with manage link (listing under review), open disputes involving you.
- Every card's empty state, loading, error.

### 20. Payout setup and settings · M
`/coach/payout` *proposed*.
- Before handing off to Stripe or Xendit; back from it.
- States: not started, in progress, verified, couldn't verify (retry or contact support), live payout status with link to the provider dashboard, country locked.

### 21. Profile setup · L
`/coach/setup` *proposed*.
- Bio (500 characters), avatar or default, banner, weekly availability in your own time zone, price per game in your currency, up to 3 credential lines per game.
- States: each step, saved and resumed, validation, complete (moves to live once payout and phone are done).

**Checkpoint 6:** coach onboarding.

---

## Phase 6: Running a coach profile

### 22. Coach profile settings · L
`/coach/profile` *proposed*.
- Edit bio, avatar, banner, availability, prices.
- Update rank (screenshot, pending, old rank still shown).
- Add a game (proof, under review).
- Voice intro (record, pending, approved, declined).
- Portfolio for Verified (submit, under review, passed, didn't pass).
- Preview my public profile (opens 2 in preview mode).

### 23. Coach sessions · S
`/coach/sessions` (feature list).
- Plain list: gamer, date and time, status, "Reschedule requested" second line.
- States: list, empty, loading, error.

**Checkpoint 7:** coach side complete.

---

## Phase 7: Account and system pages

### 24. Account settings · M
`/account` *proposed*.
- Name, username, avatar; change email (verify new, notice to old); change password; change phone (OTP); country, time zone, currency (coach country locked after payout setup).
- Delete account: blocked while sessions or disputes are open; confirm step; requested.

### 25. System pages · S
- 404, something went wrong, session expired (sign in again), sign in to continue.

**Checkpoint 8:** final consistency pass across every page.

---

## Not in this order

- **Emails.** The agreed list is in `DECISIONS.md`. Designing the email templates would be a separate phase if wanted.
- **Stripe and Xendit hosted pages.** Owned by the providers.
- **Marketing home and the Verification Standard page.** Kept as they are.
- **Anything listed as out of scope** in the feature list.

## To confirm before code is built (not before design)

- Coach launch countries with Stripe and Xendit, including Thailand.
- Exchange-rate source for converted prices.
- Chat retention period, alongside the Terms of Service wording.
