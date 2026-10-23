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
- **Badges:** New Coach. (Verified removed on 23 Oct 2026: there is no Verified badge.)
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

**Checkpoint 1:** foundations and components. Reviewed and approved on 6 Oct 2026.

---

## Phase 1: Find and book a coach

Pages: [01 Browse coaches](https://claude.ai/artifact/S2LvRXMYBbk7uq3xjGTfcC) (`design/pages/01-browse-coaches.html`) · [02 Coach profile](https://claude.ai/artifact/GUw5NpQEWds2tvVRkCVH2Y) (`design/pages/02-coach-profile.html`) · [03 Pick a slot](https://claude.ai/artifact/DoTXw1NFPY7nMf64rrNVV9) (`design/pages/03-pick-a-slot.html`) · [04 Checkout summary](https://claude.ai/artifact/EFj1Br4ak4Xnd7935vocsw) (`design/pages/04-checkout-summary.html`) · [05 Payment return](https://claude.ai/artifact/HSpMwJ9o7dDJAEYaDy6wUa) (`design/pages/05-payment-return.html`) · frames on the [canvas](https://claude.ai/artifact/AqzF4kYNMmXf555w8KbJpZ)

### 1. Browse coaches · M
`/coaches` *proposed*. Logged in and logged out.
- Filters: game, price. Sort: price (default, low to high), rating, most reviewed.
- One card per row: identity with flag, languages and time zone, one-line bio that opens on hover, rank and rating, price and next free time.
- States: results, filtered, no results, loading, load more, error, prices in the viewer's currency with "≈".

### 2. Coach profile · L
`/coaches/[username]` *proposed*. Viewable logged out.
- Avatar, banner, name, New Coach label while new, country with flag, languages, time zone, bio, showcase (up to 5 images with optional captions, straight after About; left out when there are none), per-game sections (rank, credentials, price), availability preview, voice intro, reviews.
- One column (below 1100px): About, Showcase, Games, Availability, Reviews.
- "Book a session" in the header; with two or more games, each game section also has "Choose a time", which opens Pick a slot with that game chosen.
- States: established coach (past the New Coach period, no label), New Coach, one game vs several, showcase with several images / one image / none, no reviews yet, no voice intro, converted price with "Kairo's price is ₱1,850" line, logged out (Book leads to log in), your own profile (no Book button), preview mode (used later by 22), loading, not found.

### 3. Pick a slot · M
`/coaches/[username]/book` *proposed*.
- Choose game, then one one-hour slot from weekly availability in your local time (one session per checkout in the MVP).
- States: slots available, logged out (log in to continue), nothing free this week, slot just taken, returning after log in, phone not verified (verify before continuing).

### 4. Checkout summary · M
`/checkout/[bookingId]` *proposed*.
- Coach price, platform fee, total in the coach's currency, the "your bank converts this" line, cancellation rule, how payment is held, hold countdown (30 minutes).
- States: same currency, different currency, session in under 24 hours (its time can't be moved; cancellation rule unchanged), hold nearly expired, hold expired, back after a failed payment.

### 5. Payment return · S
`/checkout/[bookingId]/return` *proposed*.
- States: confirming your payment, booking confirmed (with "Book another time with Kairo": Pick a slot, same game chosen), payment didn't go through (try again while held), slot no longer held (pick another).

**Checkpoint 2:** the booking flow end to end. Built and published 6 Oct 2026; reviewed and closed 16 Oct 2026 (refinements to 01, 02, 03 and 05; 04 unchanged).

---

## Phase 2: The session and after

Pages: [06 Session detail](https://claude.ai/artifact/SrzfjqhYzD4E93omQNB7R3) (`design/pages/06-session-detail.html`) · [07 Report a problem](https://claude.ai/artifact/FLFRVmLwDCbUqCB4p4vbZM) (`design/pages/07-report-a-problem.html`) · [08 Live session](https://claude.ai/artifact/LB4gwSiruwp8qDVRLS27Nt) (`design/pages/08-live-session.html`) · frames on the [canvas](https://claude.ai/artifact/AqzF4kYNMmXf555w8KbJpZ)

### 6. Session detail, gamer and coach · L
`/sessions/[id]` and `/coach/sessions/[id]` *proposed*. One layout, two role views: header with status, then what to do now and changes on the left, session facts and payment on the right.
- **Upcoming, more than 24 hours:** Request a new time, Cancel booking.
- **Upcoming, under 24 hours:** no new times, with the reason; Cancel booking still offered (full refund until 1 hour before, 50/50 split inside the last hour; coach any time, counted like a no-show inside 24 hours). *(Changed 23 Oct 2026; was locked for the gamer.)*
- **Reschedule:** request form (offer up to 3 times, at least 24 hours away); waiting on reply (withdraw); request received (pick a time or decline); coach's request declined (gamer chooses keep or cancel with a full refund); declined; expired; moved (can't be moved again).
- **Cancel:** confirm step with exact refund amounts for each case (full refund until 1 hour before; inside the last hour, half the coach's price; coach cancels: full refund); cancelled by you; cancelled by the coach. *(Changed 23 Oct 2026; was fee kept, or free within 1 hour of booking.)*
- **Join:** opens 10 minutes before; screen-share note; in session (rejoin).
- **Pending confirmation:** confirm (confirm step) or report a problem, auto-release countdown, under 24 hours left (gamer); waiting on gamer (coach).
- **Completed:** leave a review (5 stars, optional text up to 500 characters); review posted; released amount and the gamer's review (coach); session chat, read-only.
- **Disputed:** dispute section with status, details, the other person's response, outcome (refunded, paid to coach); filed against you, with respond (coach); payment problem after completion.
- **Coach view:** the coach's payout: price, 12% commission, payout (₱1,850.00 − ₱222.00 = ₱1,628.00); a coach cancellation inside 24 hours counts like a no-show. *(Changed 23 Oct 2026; was the full price and "serious incident".)*
- **Also changed 23 Oct 2026:** no Verified badge; no "Booked" line; the gamer's confirm step says "This releases your payment to Kairo" (no amount, since the coach's payout is less the commission).
- **Also:** awaiting payment (continue to payment), expired, loading, error.

### 7. Report a problem · M
`/sessions/[id]/report` and `/coach/sessions/[id]/report` *proposed*. Focused layout (top nav, no sidebar).
- Reason list by role and timing: coach didn't show up (gamer, during the session); the after-session list (gamer, coach); payment reasons within 30 days after completion (gamer, coach). Description (required, up to 1,000 characters), optional evidence (up to 5 images or PDFs), submitted. *(Unchanged on 23 Oct 2026: no-shows stay disputes.)*
- Response form for the other person (one response within 48 hours, optional evidence); response sent.
- States: each reason list, validation, upload error, submitted, response form, response sent.

### 8. Live session · L
`/sessions/[id]/live` *proposed*. Shared by gamer and coach. Full window: session bar, stage, chat, controls.
- Voice call (camera optional, off by default), chat (saved), screen share on computers, one at a time.
- States: waiting for the other person; no-show report available 15 minutes after start (gamer); coach waiting for an absent gamer ("If snapking doesn't join, you can report it after the session. You'd be paid half your price.", changed 23 Oct 2026); live; camera on; screen share on; mobile (watching only, with note); reminder banners at 10, 5 and 1 minutes; end request sent; end request received (End now, Keep going); you're reconnecting; the other person lost connection; microphone or camera blocked; session ended (gamer, coach).


**Checkpoint 3:** session lifecycle. Built and published 16 Oct 2026; reviewed and closed 21 Oct 2026 (one refinement on 06: a response not sent yet shows as a dashed status slot).

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
- Bio (500 characters), avatar or default, banner, languages you coach in, weekly availability in your own time zone, price per game in your currency (not below the floor, about S$10: S$10, RM 35, ₱430), up to 3 credential lines per game, showcase (optional: up to 5 images, caption up to 80 characters each).
- Photo, banner and showcase uploads: checking, passed (live), refused with a reason (automatic check; see DECISIONS.md "Automatic image check").
- States: each step, saved and resumed, validation, complete (moves to live once payout and phone are done).

**Checkpoint 6:** coach onboarding.

---

## Phase 6: Running a coach profile

### 22. Coach profile settings · L
`/coach/profile` *proposed*.
- Edit bio, avatar, banner, languages, availability, prices (not below the floor; booked sessions keep their price). A new photo or banner is checked automatically: checking, live, or refused with a reason (the old one stays until the new one passes).
- Showcase: add, replace, remove, reorder, edit captions; each image checking, live, or refused with a reason (replaced image stays live until the new one passes); empty (no showcase).
- Update rank (screenshot, pending, old rank still shown).
- Add a game (proof, under review).
- Voice intro (record, pending, approved, declined).
- Portfolio (submit, under review, shown on your profile, didn't pass). Never grants a badge.
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
- Name, username, avatar (checked automatically: checking, live, refused with a reason; old photo stays until the new one passes); change email (verify new, notice to old); change password; change phone (OTP); country, time zone, currency (coach country locked after payout setup).
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
- Moderation service for every public image (profile photos, banners, showcase images and captions): a dedicated image-moderation API (cheapest per image, catches nudity, violence and similar) or a vision AI model (also reads text inside images, e.g. contact details or slurs). Both cost a fraction of a cent per image; none is perfect, so uncertain results are refused.
