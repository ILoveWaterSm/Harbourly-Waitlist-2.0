# Harbourly webapp design decisions

Decisions agreed during design that change or clarify the MVP feature list. Newest at the bottom.

## Output and code structure

- Mockups are standalone HTML, one per page, in `/design`, dark theme only.
- Stack they map to: Next.js 16, React 19, TypeScript, CSS Modules (one `.module.css` per component) plus one global token stylesheet. No Tailwind.
- Fictional gamer handles only; no real people.
- Geist Mono specimen: `explorations/mono-specimen.html`.

## Core product decisions

- **Games (5):** Mobile Legends, Call of Duty: Mobile, Valorant, Counter-Strike 2, Riftbound.
- **Coach games and rates:** games and rank per game are added in application phase A (step 2). Per-game price and up to 3 credential lines are set in profile setup phase B. Profile complete requires at least one game with a rate. Adding a game later goes through review.
- **Sign-in:** email and password, plus Google. No Discord or other social login.
- **KYC:** happens during payout setup, after approval, before going live.
- **Phone verification:** OTP at sign-up for everyone; needed by both gamers and coaches.
- **Sessions:** fixed 60 minutes, one slot per booking. Price is per session, shown as "S$45 / session"; cards show "from S$X".
- **Time:** all times in the viewer's local time zone with a zone label. Coaches set availability in their own time zone.
- **Payment hold:** a `pending_payment` booking holds the slot for 30 minutes, matching the Stripe Checkout minimum expiry; Xendit invoice expiry set the same. Shown as a quiet countdown.
- **Checkout:** hosted Stripe or Xendit page, then return to Harbourly. States: confirming your payment, payment didn't go through, slot no longer held.
- **Session detail page:** added for gamers and coaches.
- **Coach profile settings page:** added (bio, availability, games and rates, rank updates, voice intro, portfolio).
- **New Coach label:** shown publicly, in the same position as the Verified badge.
- **Logo:** goes to the dashboard when logged in, the marketing home when logged out.
- **Mobile sessions:** phones can watch a shared screen but not share their own; the share button is replaced by "To share your screen, join from a computer", also noted on session detail and the confirmation email.

## Ranks (feature list sections 6, 7 and 17)

- No official rank ladders are stored. Harbourly does not maintain tier lists for any game.
- Each coach game listing has one free-text field, "Rank or top achievement", about 40 characters, e.g. `Mythical Glory · 85★`, `Immortal 2`, `Premier 21,450`, `Regional Qualifier · Top 8`.
- The field is checked against proof screenshots at application review.
- When a live coach changes it, they upload a new screenshot; the previous rank stays visible until the team approves the new one.
- Shown in Geist Mono in a fixed position on the browse card and on each game section of the coach profile.
- Browse filters by game and price only; no rank filter. Sort stays: price, rating, most reviewed.
- Section 17's "rank stored as an orderable tier" is replaced by "rank stored as checked free text".

## Rescheduling (new, not in the feature list)

- Either party can request a reschedule up to 24 hours before the session start. After that the time is locked.
- The requester offers up to 3 one-hour slots from the coach's availability. Offered slots are held while the request is open.
- The other party picks one slot or declines. Declining keeps the original time.
- One open request per booking, and at most one accepted reschedule per booking.
- An unanswered request expires 48 hours after it was sent or 12 hours before the original start, whichever comes first. The original time stands.
- Payment stays held. Price and fee rates snapshotted at booking are unchanged.
- If a gamer declines a coach's request, the gamer chooses: keep the original time, or cancel for a full refund including the platform fee.
- In the sessions list the status stays `Confirmed`, with a `Reschedule requested` second line while a request is open.
- Both dashboards show a "Reschedule request" card with the offered slots and the time left to reply, whenever a request is waiting on that person.
- Session detail offers "Request a new time" and "Cancel booking" only when allowed, with the reason when not (e.g. "Changes close 24 hours before the session").

## Cancellation (new, not in the feature list)

- Gamer cancels 24 hours or more before the start: the coach's price is refunded in full; the platform fee is kept.
- Free cancellation within 1 hour of booking, as long as the session is still 24 hours or more away: full refund including the platform fee.
- Gamer cannot cancel inside 24 hours. A gamer no-show means the coach is paid.
- Gamer cancels after declining a coach's reschedule request: full refund including the platform fee.
- Coach can cancel at any time: full refund to the gamer including the platform fee. Harbourly absorbs the processing cost. Recorded against the coach.
- The rule is shown before payment at checkout ("Cancel up to 24 hours before for a refund of S$45.00. The S$2.70 platform fee isn't refundable."), again on a confirm step with exact amounts before cancelling, and in the Terms of Service with the same wording.

## Coach reliability and the Verified badge

- A coach cancellation inside 24 hours counts as a serious incident, the same as a coach no-show. For a New Coach it delays Verified like a serious dispute.
- A coach cancellation 24 hours or more ahead does not count on its own.
- 3 or more coach cancellations of any kind in a rolling 30 days flags the coach for manual team review in Supabase. The team decides on badge removal and emails the coach the reason. Never removed automatically.
- No cancellation count is shown publicly in the MVP.

## Emails

Booking and sessions
- Payment received (both)
- Payment window expired, slot released (gamer)
- Session reminder 24 hours before (both)
- Session reminder 1 hour before, with session link (both)
- Session ended, please confirm, with 72-hour deadline (gamer)
- 24 hours left to confirm (gamer)
- Session confirmed or auto-confirmed (both)
- Payment released (coach)
- Leave a review (gamer, once completed)

Rescheduling and cancellation
- Reschedule requested (other party)
- Reschedule accepted, declined or expired (requester; accepted also to both with the new time)
- Booking cancelled, with refund amount (both)

Disputes
- Dispute filed (both: filer gets a receipt, the other party is told and invited to respond)
- Dispute outcome (both)

Coach journey
- Application submitted, approved, rejected (rejection includes the reason, and the reapply date when a wait applies)
- Still to finish before you go live (nudge after a few days stuck)
- You're live and bookable
- Rank update, new game listing, voice intro: approved or declined
- Portfolio result, Verified earned

Account
- Verify your email
- Reset password
- Password changed
- Email changed (sent to the old address)
- Terms updated

## In-session timing (feature list section 10)

- "Join session" activates 10 minutes before the start. Whoever joins first sees a waiting state naming the other person.
- Non-blocking reminder banners inside the call at 10 minutes and 5 minutes before the scheduled end, plus a "Session ends in 1 minute" note. Banners, not modals, so they never cover gameplay or a shared screen.
- The session ends at the scheduled end time, or early by mutual agreement: person A presses "End session", then confirms; person B sees "<name> wants to end the session" with "End now" and "Keep going"; it ends only when both agree.
- If someone disconnects, the session continues until the scheduled end and they can rejoin.
- "Pending confirmation" starts whenever the session ends, early or on time.

## Disputes (feature list section 12)

Two filing windows, with different reason lists per role.

Window: after the session ends, before confirmation or auto-release (funds held). Filing pauses the 72-hour auto-release.
- Gamer: coach didn't show up (available from 15 minutes after the start time, without waiting for the scheduled end); session ended early; coach was present but didn't coach; coach behaved inappropriately; session didn't match the listing; technical problems stopped the session; other.
- Coach: gamer didn't show up; gamer behaved inappropriately; gamer left early but the session should still be paid; other.
- "Gamer refusing to confirm without reason" is removed: the 72-hour auto-release already covers it.

After completion: payment problems only, up to 30 days after release.
- Gamer: charged the wrong amount; charged twice; refund hasn't arrived; other payment issue.
- Coach: payout not received; payout amount is wrong; other payment issue.

Status and outcome
- Shown as a dispute section on the session detail page, not a separate page.
- Statuses: Open, Under review, Resolved (refunded to gamer), Resolved (paid to coach). The team sets them in Supabase.
- Outcomes are always a full refund or a full release. No partial refunds in the MVP.
- The other party is emailed when a dispute is filed against them and can add one written response with optional evidence.
- Both parties are emailed the outcome.

## Rejected coach applications (feature list section 4)

- A rejected application keeps all the coach's previous inputs and uploads. Nothing is wiped.
- On rejection the team records a reason category in Supabase (e.g. proof doesn't show the rank claimed, proof images unclear, rank below our minimum) plus an optional short note. No admin UI.
- The reapply screen shows the reason at the top and highlights the affected section.
- Resubmit only enables once something in the flagged section has changed.
- First and second rejection: resubmit immediately.
- Third rejection: 14-day wait before the next attempt. The screen shows the date ("You can reapply from 19 Oct") and why.
- "Not eligible" rejection (fraud, fake proof): plain message, no reapply option.
- The coach dashboard gains a `rejected` state alongside draft, submitted, approved and live.

## Currency display (option B)

- Coaches set their per-game price in their own currency (e.g. ₱1,850, RM 150, S$45).
- Gamers see every price converted to their own currency on browse cards, profiles and dashboards, so prices compare and the price filter and sort work.
- Converted prices carry "≈" (e.g. "≈ S$43 / session"). Prices already in the viewer's currency show without it.
- The coach profile adds one line under the price: "Kairo's price is ₱1,850. Your bank converts at checkout."
- Checkout charges in the coach's currency and says so plainly: "You'll be charged ₱1,850.00 + ₱111.00 platform fee = ₱1,961.00. Your bank converts this to SGD."
- Harbourly pays no extra conversion fee. The gamer's bank does the conversion.
- Revisit charging in the gamer's own currency (option A, about +2% on Stripe) once volume justifies it or Xendit multi-currency is confirmed.

## Supported countries

Coaches (limited by where payouts work)
- Launch list: Singapore and Malaysia (Stripe), Philippines (Xendit). Thailand only if Stripe confirms support for the platform's setup.
- Indonesia and Vietnam left out until Xendit or Stripe cross-border payout coverage is confirmed.
- To confirm directly with Stripe and Xendit before launch.

Gamers
- Southeast Asia only at launch: Singapore, Malaysia, Philippines, Indonesia, Thailand, Vietnam, Brunei, Cambodia, Laos, Myanmar.
- Reasons: brand and coach time zones, lower fraud and chargeback risk, simpler tax on the platform fee, fewer display currencies for option B.

In the design
- The sign-up country dropdown lists supported countries only.
- If "coach" is chosen with a country outside the coach list, say so before the application starts: "Coaching isn't available in Indonesia yet. You can still book sessions as a gamer."
- A coach's country locks once their payout account is set up. Changes go through support.
- Unsupported countries see "Harbourly isn't available in your country yet." instead of the sign-up form.

## Coach location and identity

- Harbourly doesn't verify location itself. Stripe or Xendit KYC during payout setup checks a government ID (with selfie or liveness check) and requires a bank account or e-wallet in the chosen country. A coach who fakes their country fails payout setup and can never go live.
- Southeast Asians living abroad with a home-country bank account are allowed.
- Borrowed or rented identities are an accepted risk, handled through disputes and complaints.
- The application intro (step 1) lists "What you'll need": a government ID, a bank account in your country, and proof of your rank.
- The team treats a non-Southeast Asian phone number on an application as a reason to look closer, not a hard block.
- The coach dashboard has a "Your payout account couldn't be verified" state with a way to retry or contact support.

## Account and system pages (new, not in the feature list)

- Forgot password and reset password.
- Verify your email (email sign-ups), with resend.
- Finish setting up your account: the second sign-up layer shown after Google sign-in.
- Updated terms: a blocking screen to accept a new Terms of Service version before continuing.
- Account settings: name, username, avatar; email change (re-verify); password change; phone change (OTP); country, time zone, currency.
- Coach payout settings: status, plus a link out to the Stripe or Xendit dashboard.
- Delete account: a request with a clear warning, blocked while there are upcoming sessions or open disputes.
- System pages: 404, something went wrong, session expired (sign in again), and a sign-in prompt on protected pages.
- Coaches get a "Preview my public profile" link showing exactly what gamers see.

## Verification Standard page

- Kept exactly as it is, design and copy. Not redesigned as part of the webapp.

## Age (feature list section 2, replaces "no age gate, to be confirmed")

- MVP: 18+ only. Date of birth at sign-up is checked; anyone under 18 sees "You need to be 18 or older to use Harbourly." and can't continue.
- Coaches are 18+ in any case through Stripe and Xendit KYC.
- Future: consider ages 13–17 with parental consent (parent approves by email, possibly per booking), after legal advice and once the core product is running.

## Visual rules for the webapp (design system adaptations)

- Tokens are used by their exact design-system names (`--bg`, `--surface`, `--space-*`, `--radius-*`, `--text-*`, `--font-*`). No `--pad`.
- Flat surfaces: page `--bg`, cards solid `--surface`, inset areas (chat panel, list rows) `--bg-mid`. No gradients on cards.
- One new shadow token for all cards: `--shadow-flat` (about `0 1px 2px #00000059`).
- Primary buttons keep a softer resting glow via a new token `--shadow-cta-rest` (about half of `--shadow-cta`); on hover they move to `--shadow-cta-hover` and the blurred halo fades in.
- Secondary button: outline pill, `--line` border, `--ink` text.
- Green glow only as a deliberate accent: a thin glowing top line on the one card that matters most in view.
- The top nav keeps its blur and transparency. Nothing else is frosted.
- No background grid, film grain or breathing glow in the webapp; those stay on marketing pages.
- Type scale reuses existing tokens: page title `--text-kpi` (32px), section title `--text-card-title` (24px), card title `--text-h3` (19px).
- Status colours: green for confirmed, completed, verified; amber for anything needing action (awaiting payment, pending confirmation, disputed, reschedule requested); muted for ended or neutral (expired, refunded, past). Shown as a mono label with a coloured dot, not filled pills. No red.
- Brief overrides the design system on three points: no 60px icon chips heading cards, no centring by default, hover lift only on clickable elements.
- Prices use `S$` for SGD; other currencies per the currency display decision.
- Geist Mono for data and labels: money, dates, times, durations, countdowns, statuses, ranks, ratings and counts, eyebrows, small labels, column headers, step and character counters, references, @handles. Geist for names, body, buttons, links, field labels, chat, game names, credential lines. Sora for headings.
- Dark theme only.
