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

**Checkpoint 2:** the booking flow end to end. Built and published 6 Oct 2026; reviewed and closed 16 Oct 2026 (refinements to 01, 02, 03 and 05; 04 unchanged). Updated 23 Oct 2026 for the policy update (no Verified badge on 01 to 05; new cancellation lines on 04 and 05), republished at the same links with frames replaced on the canvas.

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
- **Disputed:** dispute section with status, details, the other person's response, outcome (refunded, paid to coach); filed against you, with respond (coach; and, since 30 Oct 2026, the gamer: `reported`, `reported-responded`); payment problem after completion.
- **Coach view:** the coach's payout: price, 12% commission, payout (₱1,850.00 − ₱222.00 = ₱1,628.00); a coach cancellation inside 24 hours counts like a no-show. *(Changed 23 Oct 2026; was the full price and "serious incident".)*
- **Also changed 23 Oct 2026:** no Verified badge; no "Booked" line; the gamer's confirm step says "This releases your payment to Kairo" (no amount, since the coach's payout is less the commission).
- **Also:** awaiting payment (continue to payment), expired, loading, error.

### 7. Report a problem · M
`/sessions/[id]/report` and `/coach/sessions/[id]/report` *proposed*. Focused layout (top nav, no sidebar).
- Reason list by role and timing: coach didn't show up (gamer, during the session); the after-session list (gamer, coach); payment reasons within 30 days after completion (gamer, coach). Description (required, up to 1,000 characters), optional evidence (up to 5 images or PDFs), submitted. *(Unchanged on 23 Oct 2026: no-shows stay disputes.)*
- Response form for the other person (one response within 48 hours, optional evidence); response sent. Both roles: coach (`respond`, `response-sent`) and, since 30 Oct 2026, gamer (`gamer-respond`, `gamer-response-sent`).
- States: each reason list, validation, upload error, submitted, response form, response sent.

### 8. Live session · L
`/sessions/[id]/live` *proposed*. Shared by gamer and coach. Full window: session bar, stage, chat, controls.
- Voice call (camera optional, off by default), chat (saved), screen share on computers, one at a time.
- States: waiting for the other person; no-show report available 15 minutes after start (gamer); coach waiting for an absent gamer ("If snapking doesn't join, you can report it after the session. You'd be paid half your price.", changed 23 Oct 2026); live; camera on; screen share on; mobile (watching only, with note); reminder banners at 10, 5 and 1 minutes; end request sent; end request received (End now, Keep going); you're reconnecting; the other person lost connection; microphone or camera blocked; session ended (gamer, coach).


**Checkpoint 3:** session lifecycle. Built and published 16 Oct 2026; reviewed and closed 21 Oct 2026 (one refinement on 06: a response not sent yet shows as a dashed status slot). Updated 23 Oct 2026 for the policy update (06 cancel states, coach payout, confirm step; 08 coach waiting line; no Verified badge), republished at the same links with frames replaced on the canvas.

---

## Phase 3: Gamer home

Pages: [09 Gamer dashboard](https://claude.ai/artifact/Qcz63mYRxQufNaf8wUr1fM) (`design/pages/09-gamer-dashboard.html`) · [10 My sessions](https://claude.ai/artifact/RA5wuSQuWSaw8hcPfsJpet) (`design/pages/10-my-sessions.html`) · frames on the [canvas](https://claude.ai/artifact/AqzF4kYNMmXf555w8KbJpZ)

### 9. Gamer dashboard · L
`/dashboard` *proposed*. Rules in DECISIONS.md, "Phase 3 decisions".
- Floating welcome banner (avatar, date, greeting, Browse coaches), then two columns on a full-width page. To do box (3 items in full, soonest deadline first, accent on the box): awaiting payment (hold time left), awaiting your confirmation (time left), reschedule request waiting on you (offered times, time left to reply), reviews you owe; "N more to do · View all" opens the To do page. Coming up: next session block (Join session) then rows. Problems you've reported (dashed slot for a response not sent yet). Recent sessions, then "All sessions". No quick-links card. On desktop the columns scroll separately and the page doesn't; on a phone one page scroll (DECISIONS.md, "Phase 3 decisions").
- States: busy account (Mon 5 Oct, 14:12 SGT), **todo-all** (the To do page, `/dashboard/to-do`: every item, "← Dashboard"), nothing to do (To do and Coming up empty; Thu 24 Sep, 13:05), brand-new account (one block, Browse coaches; Thu 24 Sep, 11:00), **reported** (Kairo reported a problem first in To do; Thu 8 Oct, 09:00; added 30 Oct 2026), loading, error.
- Every card and row opens its own booking on 06 (or 04, 03, 07): 06 gained kairo-tue, vexa-request, mirae-pending, mirae-confirm, ghostline-review and nullpoint-open, and 07 gained mirae-after, for the dashboard's other bookings.

### 10. My sessions · S
`/sessions` (feature list).
- Full width beside the sidebar, like 09 (AppShell `wide`, since 30 Oct 2026). Plain list in two groups, Upcoming (soonest first) and Past (newest first): coach, date and time, status, "Reschedule requested" second line. Past loads 20 at a time ("Load more"; not drawn).
- States: list (Mon 5 Oct, 14:12), empty (Thu 24 Sep, 11:00), loading, error.

Also in Phase 3: PendingSlot component and a compact SessionList (library page); the logo and sidebar link to 09, 01 and 10 on every page; 05, 06 and 07 buttons linked into the prototype; 08 coach payout corrected to ₱1,628.00; the library's Confirm step follows the 23 Oct cancellation rule.

**Checkpoint 4:** gamer side complete. Built and published 23 Oct 2026; 09 redesigned on 28 Oct 2026 (full-width, floating banner, To do box and page, separate column scrolling); waiting for review.

---

## Phase 4: Sign up, log in, account access

Pages: [11 Sign up](https://claude.ai/artifact/QkABonvTk67WnzxPHH1rrC) (`design/pages/11-sign-up.html`) · [12 Verify your email](https://claude.ai/artifact/MmPhavSEmaQbDFcxNtvcG4) (`design/pages/12-verify-your-email.html`) · [13 Finish setting up your account](https://claude.ai/artifact/HoUgKYU9pkBwvGxiaCCDZh) (`design/pages/13-finish-setting-up.html`) · [14 Log in](https://claude.ai/artifact/KFSLVdswwSLN2HGsMyn8ed) (`design/pages/14-log-in.html`) · [15 Forgot and reset password](https://claude.ai/artifact/G9xYuLRFwRgfjnnBu7A1Y4) (`design/pages/15-forgot-and-reset-password.html`) · [16 Accept updated terms](https://claude.ai/artifact/Ma6d46PmT2aacA6483XTeG) (`design/pages/16-accept-updated-terms.html`) · frames on the [canvas](https://claude.ai/artifact/AqzF4kYNMmXf555w8KbJpZ)

Rules in DECISIONS.md, "Phase 4 decisions" and "Sign-in services". 11, 14 and 15 use a split layout with no top nav (full-height animated brand panel left with the logo, form right; panel hidden below 1000px, logo above the form; DECISIONS.md, "Sign up and log in layout"); 12, 13 and 16 a centred column (440px; 13 600px, 16 560px). No sidebar. 11, 14 and 15 use the logged-out nav; 12, 13 and 16 the gate nav (logo, Sign out).

### 11. Sign up · S
`/signup` *proposed*.
- Log in | Sign up tabs, "Create your account", Continue with Google, "or", email, password (Show), Create account.
- States: `form`, `booking` (came from 03: "Sign up to book with Kairo"), `errors` (email format, breached password), `loading` ("Creating your account…"). No "email already used" state: no screen says whether an email has an account.

### 12. Verify your email · S
`/verify-email` *proposed*.
- States: `sent` (resend timer), `resent`, `expired` (Send a new link), `verified` (Continue to 13), `verified-other` (opened on another device: Log in).

### 13. Finish setting up your account · M
`/signup/details` *proposed*.
- About you (first name, last name, username, date of birth), where you are (country, phone with code on the same page), how you'll use Harbourly (gamer or coach), terms, Finish setting up.
- States: `form` (email sign-up), `google` (name filled in), `missing` (details missing), `phone` (code sent, resend timer), `wrong-code`, `filled` (phone verified; Finish setting up → 09 `new`), `username-taken`, `coach-unavailable` (Indonesia: notice before submitting, then 09 `new`), `booking` (back to 03 `returning`), `submitting`, `under-18` (blocked), `not-available` (blocked).

### 14. Log in · S
`/login` *proposed*.
- Log in | Sign up tabs, "Welcome back", Continue with Google, "or", email, password (Show) with "Forgot password?", Log in.
- States: `form` (→ 09 `busy`), `booking` ("Log in to book with Kairo" → 03 `returning`), `wrong` (wrong details), `too-many` (wait 15 minutes), `loading`.

### 15. Forgot and reset password · S
`/forgot-password`, `/reset-password` *proposed*.
- States: `request`, `sent` ("If that email has an account…"), `new-password`, `expired`, `done` (Log in).

### 16. Accept updated terms · S
`/terms/accept` *proposed*.
- Blocking screen: what's changed (3 points), the update date, Read the full Terms of Service, Accept and continue, or sign out. State: `terms`.

Also in Phase 4: new shared parts on the component library ("Sign up and log in": Field password and label row, GoogleButton, ResultPanel, TopNav gate, icons mail and globe; the phone field's code select is wider so "+65 SG" fits; logged-out Log in and Sign up fit at 320px); 01, 02 and 03's logged-out Log in and Sign up open 14 and 11, and 03's "Log in to continue" and "Sign up" open 14 and 11 with the booking; USER-FLOW diagram 2 updated (sign-up from a booking, email verified check, Google with no account, blocked screens keep nothing).

**Checkpoint 5:** getting in. Built and published 28 Oct 2026. 29 and 30 Oct 2026: 11, 14 and 15 moved to the split layout with tabs, no top nav, Back to home and the panel headline (new Tabs and AuthLayout components). Reviewed and closed 30 Oct 2026.

---

## Phase 5: Becoming a coach

Pages: [17 Coach application, step 1](https://claude.ai/artifact/UPdfZV5NDEKHgQk6A9m1vL) (`design/pages/17-coach-application-step-1.html`) · [18 Coach application, step 2](https://claude.ai/artifact/UuoARHjHiK321bFmrrT3Ww) (`design/pages/18-coach-application-step-2.html`) · [19 Coach dashboard](https://claude.ai/artifact/PZWfUhEGXGatrN3DdtNneV) (`design/pages/19-coach-dashboard.html`) · [20 Payout setup and settings](https://claude.ai/artifact/VVKZYhCa86RgU13zH5EKU8) (`design/pages/20-payout-setup.html`) · [21 Profile setup](https://claude.ai/artifact/7KKq11638mXPeYQNn17Cxb) (`design/pages/21-profile-setup.html`) · frames on the [canvas](https://claude.ai/artifact/AqzF4kYNMmXf555w8KbJpZ)

Rules in DECISIONS.md, "Phase 5 decisions" (2 Nov 2026). snapking applies (Singapore, Stripe, S$); Kairo is the live coach on 19 and 20 (Philippines, Xendit, ₱). 17, 18 and 21 use the focused layout (top nav, no sidebar, 680px column); 19 and 20 the app shell with the Coach block. **No coach dashboard before approval:** until then the Gamer block's "Your coach application" link (with its status) opens 18.

### 17. Coach application, step 1 · S
`/coach/apply` *proposed*.
- What coaching on Harbourly involves; what you'll need (government ID, bank account in your country, proof of rank), each with why; money; the coach's country. Start your application creates the coach record.
- States: `intro`, `not-available` (a country outside Singapore, Malaysia and the Philippines: nothing created).

### 18. Coach application, step 2 · L
`/coach/apply/details` *proposed*. Also the application's status page until approval.
- Your games (1 to 5: game, rank or top achievement, up to 5 proof images each), coaching elsewhere (optional link), what made you start coaching (up to 1,000 characters). Saves as you go.
- States: `empty`, `draft` (draft saved), `validation`, `upload-error`, `confirm` (submit confirm in place), `submitting`, `submitted`, `under-review` (read-only, dashed slot), `rejected` (Changes needed: reason, flagged section, resubmit disabled), `rejected-changed` (resubmit enabled), `rejected-wait` (third rejection: reapply from Thu 12 Nov), `not-eligible`.

### 19. Coach dashboard · L
`/coach/dashboard` *proposed*. From approval on.
- **Before you go live** (approval to live): the four rows (application, payouts, phone, profile), each done, waiting or to do, one next step. States: `approved`, `payout-checking`, `in-progress`, `payout-failed`.
- **Live:** `live-new` (just live, New Coach line, every card's empty state) and `live` (Kairo: To do with a report to answer and a request to move a session, Coming up with Join session, Money held and released per session, Your games with a rank update under review, Reviews).
- `loading`, `error`.

### 20. Payout setup and settings · M
`/coach/payout` *proposed*.
- What Stripe or Xendit will ask and why, the country lock, Continue to Stripe; back from it.
- States: `start`, `confirming`, `unfinished` (left part-way), `checking` (provider checking), `verified`, `failed` (couldn't verify: Try again, Contact support), `live` (Kairo's payout settings, Open Xendit dashboard).

### 21. Profile setup · L
`/coach/setup` *proposed*.
- Five steps: about you (photo, banner, bio 500, languages), games and prices (price per game not below the floor, payout line, up to 3 credential lines), availability (WeekHours, in the coach's zone), showcase (optional, up to 5 images with captions up to 80), review.
- Photo, banner and showcase: checking, live, refused with a reason (automatic check), never blocking the form.
- States: `about`, `about-checking`, `about-refused`, `about-errors`, `games`, `games-error`, `resumed` (availability, "Welcome back"), `showcase`, `review`, `complete` (You're live).

Also in Phase 5: new shared parts in the library, section "Coach onboarding" (Checklist, WeekHours, SaveStatus, ImageUpload rows, checkbox grid, the sidebar's status link); 06 gains `coach-kairo-tue`, `coach-milo-request`, `coach-ozzie-dispute` and 07 `coach-ozzie-respond` for 19 live; the prototype links "Become a coach" and 13's coach choice to 17, and Kairo's coach shells to 19.

**Checkpoint 6:** coach onboarding. Built and published 2 Nov 2026; closed 4 Nov 2026 with no changes.

---

## Phase 6: Running a coach profile

Pages: [22 Coach profile settings](https://claude.ai/artifact/QLJBYMizAiBYA8eCW1BuJG) (`design/pages/22-coach-profile-settings.html`) · [23 Coach sessions](https://claude.ai/artifact/TsLQ1ZB6C3stYYVgKE2myS) (`design/pages/23-coach-sessions.html`) · frames uploaded to the [canvas](https://claude.ai/artifact/AqzF4kYNMmXf555w8KbJpZ), not yet placed: the canvas is at its 512-file limit (HANDOFF.md, "The canvas")

### 22. Coach profile settings · L
`/coach/profile` *proposed*. Kairo, Mon 5 Oct 2026, 14:12 PHT; outcomes Tue 6 and Wed 7 Oct (DECISIONS.md, "Phase 6 decisions").
- An overview (what gamers see now, what's checking or with the team, Preview my public profile, Copy profile link) and one page per section, in 02's order: photo and banner, about you, voice intro, showcase, games and prices, portfolio, availability.
- Typed content saves with Save changes and goes live at once; images go to the automatic check (the current one stays until the new one passes); rank updates, new games, voice intros and portfolios go with Send for review (the version gamers see stays until approved; withdraw while under review; declined with the reason, Dismiss).
- States: `overview`, `loading`, `error`; `about`, `about-errors`, `about-saved`; `photos`, `photos-checking`, `photos-refused`; `voice`, `voice-blocked`, `voice-recording`, `voice-recorded`, `voice-pending`, `voice-declined`; `showcase`, `showcase-checking`, `showcase-refused`, `showcase-remove`, `showcase-empty`; `games`, `games-saved`, `games-error`, `games-remove`; `rank`, `rank-sent`, `rank-declined`, `rank-approved`; `add-game`, `add-game-pending`, `add-game-declined`; `portfolio`, `portfolio-pending`, `portfolio-live`, `portfolio-declined`; `availability`.

### 23. Coach sessions · S
`/coach/sessions` (feature list). 10's layout in the coach shell.
- Plain list: gamer, date and time, status, "Reschedule requested" second line. Upcoming soonest first, Past newest first, rows open 06's coach view, no amounts, "Load more" after 20.
- States: `list` (Kairo, Mon 5 Oct 14:12 PHT), `empty` (snapking, Sat 24 Oct), `loading`, `error`.

Also in Phase 6: new shared parts in the library, section "Running a coach profile" (SettingsSection, VoiceRecorder, ImageUpload move controls, TeamNote, PortfolioList); 06 gains `coach-tamtam-pending`, `coach-ricebowl-completed`, `coach-nightjar-completed`, `coach-milo-completed`, and its coach-view back links open 23; 02 gains `portfolio`, and its preview and own states link to 22; 19 live's Manage and All coach sessions open 22 and 23; Kairo's and snapking's coach shells link Coach sessions to 23.

**Checkpoint 7:** coach side complete. Built and published 5 Nov 2026; waiting for the owner's review.

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
- Sign-in services are chosen (DECISIONS.md, "Sign-in services": Supabase Auth, Resend, Twilio Verify). Before launch: check current Twilio Verify prices for the 10 supported countries, add Resend's domain records, and move to Supabase Pro and Resend's paid plan.
- Exchange-rate source for converted prices.
- Chat retention period, alongside the Terms of Service wording.
- Moderation service for every public image (profile photos, banners, showcase images and captions): a dedicated image-moderation API (cheapest per image, catches nudity, violence and similar) or a vision AI model (also reads text inside images, e.g. contact details or slurs). Both cost a fraction of a cent per image; none is perfect, so uncertain results are refused.
