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
- **Sessions:** fixed 60 minutes, one slot per booking. Price is per session, shown as "S$45 / session"; cards show "from S$X". (Confirmed 23 Oct 2026: other session lengths and types are post-MVP. Price floor: see "Policy update, 23 Oct 2026".)
- **Time:** all times in the viewer's local time zone with a zone label. Coaches set availability in their own time zone.
- **Payment hold:** a `pending_payment` booking holds the slot for 30 minutes, matching the Stripe Checkout minimum expiry; Xendit invoice expiry set the same. Shown as a quiet countdown.
- **Checkout:** hosted Stripe or Xendit page, then return to Harbourly. States: confirming your payment, payment didn't go through, slot no longer held.
- **Session detail page:** added for gamers and coaches.
- **Coach profile settings page:** added (bio, availability, games and rates, rank updates, voice intro, portfolio).
- **New Coach label:** shown publicly beside the coach's name until it drops. There is no Verified badge; nothing replaces the label (changed 23 Oct 2026, see "Policy update, 23 Oct 2026").
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

- Either party can request a reschedule up to 24 hours before the session start. After that the time is locked. (Kept on 23 Oct 2026, though cancelling now closes later: offered slots are held and the other person needs time to answer.)
- The requester offers up to 3 one-hour slots from the coach's availability. Offered slots are held while the request is open.
- The other party picks one slot or declines. Declining keeps the original time.
- One open request per booking, and at most one accepted reschedule per booking.
- An unanswered request expires 48 hours after it was sent or 12 hours before the original start, whichever comes first. The original time stands.
- Payment stays held. Price and fee rates snapshotted at booking are unchanged.
- If a gamer declines a coach's request, the gamer chooses: keep the original time, or cancel for a full refund including the platform fee.
- In the sessions list the status stays `Confirmed`, with a `Reschedule requested` second line while a request is open.
- Both dashboards show a "Reschedule request" card with the offered slots and the time left to reply, whenever a request is waiting on that person.
- Session detail offers "Request a new time" and "Cancel booking" only when allowed, with the reason when not (e.g. "New times close 24 hours before the session").

## Cancellation (new, not in the feature list; rewritten 23 Oct 2026)

Replaced by the 11 Oct 2026 marketing copy, agreed 23 Oct 2026. Amounts use the Phase 1 booking: Kairo, ₱1,850.00 + ₱111.00 platform fee = ₱1,961.00 (same currency: Vexa, S$45.00 + S$2.70 = S$47.70).

- Gamer cancels at least 1 hour before the start: full refund including the platform fee (₱1,961.00).
- Gamer cancels inside the last hour, up to the start time: the coach's price is split 50/50. The gamer gets half the coach's price back (₱925.00; S$22.50); the platform fee is kept; the coach is paid the other half less the 12% commission on that half (₱925.00 − ₱111.00 = ₱814.00; S$22.50 − S$2.70 = S$19.80).
- Gamer no-show (hasn't joined by 15 minutes after the start): the same 50/50 split, once the team upholds the coach's report. See "No-shows" in "Policy update, 23 Oct 2026".
- The old "free cancellation within 1 hour of booking" rule is gone: every booking starts at least 2 hours away, so a full refund is always available until 1 hour before.
- Gamer cancels after declining a coach's reschedule request: full refund including the platform fee.
- Coach can cancel at any time: full refund to the gamer including the platform fee. Harbourly absorbs the processing cost. Recorded against the coach (see "Coach reliability").
- Repeated late cancellations or no-shows by a gamer are flagged for team review and can lead to suspension. Never automatic.
- The 50/50 split is the one fixed exception to "no partial refunds": dispute outcomes stay a full refund or a full release.
- The rule is shown before payment at checkout ("Cancel up to 1 hour before the start for a full refund of ₱1,961.00. Cancel later, or don't join within 15 minutes of the start, and ₱925.00 is refunded."), again on a confirm step with exact amounts before cancelling, and in the Terms of Service with the same wording.

## Coach reliability (rewritten 23 Oct 2026; was "Coach reliability and the Verified badge")

- A coach no-show means a full refund to the gamer. The first carries no other consequence; a repeat pattern gets a warning (email), then suspension. Flagged automatically, applied by the team.
- A coach cancellation inside 24 hours counts the same as a coach no-show towards that pattern. A coach cancellation 24 hours or more ahead does not count on its own.
- For a New Coach, a coach no-show or a coach cancellation inside 24 hours also resets New Coach progress to 0.
- 3 or more coach cancellations of any kind in a rolling 30 days flags the coach for manual team review in Supabase. The team decides on a warning or suspension and emails the coach the reason. Never applied automatically.
- No cancellation or no-show count is shown publicly in the MVP.

## Emails

Booking and sessions
- Payment received (both)
- Payment window expired, slot released (gamer)
- Session reminder 24 hours before (both)
- Session reminder 1 hour before, with session link (both)
- Session ended, please confirm, with 72-hour deadline (gamer)
- 24 hours left to confirm (gamer)
- Session confirmed or auto-confirmed (both)
- Payment released (coach, with the 12% commission and the payout amount)
- Leave a review (gamer, once completed)

Rescheduling and cancellation
- Reschedule requested (other party)
- Reschedule accepted, declined or expired (requester; accepted also to both with the new time)
- Booking cancelled, with refund amount (both; for a late cancellation, the coach's email shows their half)

Disputes
- Dispute filed (both: filer gets a receipt, the other party is told and invited to respond)
- Dispute outcome (both)

Coach journey
- Application submitted, approved, rejected (rejection includes the reason, and the reapply date when a wait applies)
- Still to finish before you go live (nudge after a few days stuck)
- You're live and bookable
- Rank update, new game listing, voice intro: approved or declined
- Portfolio result (shown on your profile, or not, with the reason) (was "Portfolio result, Verified earned")
- Your New Coach label has dropped (added 23 Oct 2026)
- Your New Coach progress was reset, with the reason (added 23 Oct 2026)
- Reliability warning (added 23 Oct 2026)

Account
- Verify your email
- Reset password
- Password changed
- Email changed (sent to the old address)
- Terms updated
- Account suspended, with the reason (added 23 Oct 2026; gamer or coach)

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
- No-shows stay disputes (confirmed 23 Oct 2026). An upheld "gamer didn't show up" now ends in the 50/50 split, not a full release (see "Policy update, 23 Oct 2026").
- "Gamer refusing to confirm without reason" is removed: the 72-hour auto-release already covers it.

After completion: payment problems only, up to 30 days after release.
- Gamer: charged the wrong amount; charged twice; refund hasn't arrived; other payment issue.
- Coach: payout not received; payout amount is wrong; other payment issue.

Status and outcome
- Shown as a dispute section on the session detail page, not a separate page.
- Statuses: Open, Under review, Resolved (refunded to gamer), Resolved (paid to coach), and since 23 Oct 2026 Resolved (split 50/50) for an upheld gamer no-show. The team sets them in Supabase.
- Outcomes are always a full refund or a full release. No partial refunds in the MVP. (One exception since 23 Oct 2026: an upheld "gamer didn't show up" dispute ends in the 50/50 split.)
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
- Secondary button: outline pill, `--line-strong` border, `--ink` text. Inputs use the same `--line-strong` border. (Changed at checkpoint 1 from `--line`, which almost disappears on the dark ground.)
- Green glow only as a deliberate accent: a thin glowing top line on the one card that matters most in view.
- The top nav keeps its blur and transparency. Nothing else is frosted.
- No background grid, film grain or breathing glow in the webapp; those stay on marketing pages.
- Type scale reuses existing tokens: page title `--text-kpi` (32px), section title `--text-card-title` (24px), card title `--text-h3` (19px).
- Status colours: green for confirmed, completed; amber for anything needing action (awaiting payment, pending confirmation, disputed, reschedule requested); muted for ended or neutral (expired, refunded, past). Shown as a mono label with a coloured dot, not filled pills. No red.
- Brief overrides the design system on three points: no 60px icon chips heading cards, no centring by default, hover lift only on clickable elements.
- Prices use `S$` for SGD; other currencies per the currency display decision.
- Geist Mono for data and labels: money, dates, times, durations, countdowns, statuses, ranks, ratings and counts, eyebrows, small labels, column headers, step and character counters, references, @handles. Geist for names, body, buttons, links, field labels, chat, game names, credential lines. Sora for headings.
- Dark theme only.

## Design deliverables and canvas

- The HTML pages are the single source of truth: one file per page in `design/pages/`, shared tokens in `design/foundations/tokens.css`, each with a state switcher and a desktop/mobile toggle, published as a private artifact link.
- One Claude Design canvas holds the overview. Its frames are exact renders of each HTML page's states (desktop and phone), grouped by phase in build order, labelled "NN Page · State · Width", with a note linking each page's interactive version. Frames are images, so they can't drift from the HTML.
- Changes go through the HTML pages (asked for in chat or as a canvas comment), then the frames are re-rendered.
- Only one canvas: create it once, in Phase 0, and add each phase's frames to it. Don't create a new canvas per phase.
- Figma only if hand-editable frames are needed later; it can be generated from the finished HTML pages.
- The canvas is **Harbourly webapp**: https://claude.ai/artifact/AqzF4kYNMmXf555w8KbJpZ. Add every phase's frames to it.
- File layout: component styles in `design/foundations/components/<Name>.css`, one per component, each becoming `<Name>.module.css`; every selector starts with the component's root class so nothing leaks between modules. The mockup harness (state switcher, width toggle) is `design/foundations/mockup.css` and `mockup.js` and is not product code. Icons are a sprite in `design/foundations/icons.js`.
- Publishing and frames: `node design/tools/build.mjs <page> <outDir>` inlines the shared CSS and JS into one publishable file; `node design/tools/render.mjs <built page> <outDir> <prefix>` renders every state at 1440 and 390 wide for the canvas.
- Responsive rules use container queries on a container named `app` (the app shell), so components follow the space they're given. In the app the root layout element carries `container: app / inline-size`.

## Navigation and identity (agreed at Phase 0)

- Account settings: the avatar and name in the top bar link to `/account`; "Sign out" sits beside them. On phones the menu sheet starts with the same account row.
- Avatars: photos use fictional avatar images you supply. Until they arrive, mockups show the default avatar (first letter of the display name in Sora on `--bg-mid`) and the component library shows the photo state as a marked slot.

## Browse coach card (agreed at Phase 0)

- With no game filter, the card shows the coach's cheapest game: that game's name and rank, and "from" its price, plus "+1 game" (or "+2 games") when there are more.
- With a game filter set, the card shows that game's rank and its exact price.
- "from" appears only when the coach lists more than one game. A single-game card shows the exact price, e.g. "S$45 / session".

## Checkpoint 1 outcomes

- Status colours follow this file, not the Geist Mono specimen: `Completed` is green. `In session` is green; resolved dispute statuses are muted; "Reschedule requested" is an amber mono second line.
- Phone verification codes are 6 digits.

## Uploads (agreed after checkpoint 1)

| Upload | File types | Max size | Other limits |
|---|---|---|---|
| Profile photo | JPG, PNG, WebP | 5 MB | At least 256 × 256 px, cropped to a circle; checked automatically (see "Automatic image check") |
| Banner | JPG, PNG, WebP | 10 MB | At least 1200 px wide; checked automatically (see "Automatic image check") |
| Rank proof (application, rank update, new game) | JPG, PNG, WebP | 10 MB each | Up to 5 |
| Dispute evidence | JPG, PNG, WebP, PDF | 10 MB each | Up to 5 |
| Showcase (coach profile) | JPG, PNG, WebP | 10 MB each | Up to 5; optional caption up to 80 characters; checked automatically (see "Automatic image check") |

- No GIF (animated avatars pull attention) and no video evidence in the MVP; a clip can be linked in the dispute description.
- No HEIC. iPhone screenshots are PNG already; iPhone Safari is expected to convert camera photos to JPEG on upload when HEIC isn't accepted. Confirm on a real iPhone when building.
- Build note: strip location and other metadata from uploaded images before storing them.
- Upload hint line, e.g. "JPG, PNG or WebP · up to 10 MB". Errors: "season-stats.png is 14.2 MB. Images can be up to 10 MB." and "rank-proof.heic isn't a JPG, PNG or WebP. Save it as one of those and try again."
- Still to decide in Phase 6: voice intro length, portfolio format.

## Booking from the coach profile (agreed before Phase 1)

- Gamers book a coach, never a game. The game only says what the session with that coach is about.
- The profile header has one primary "Book a session" button. It opens Pick a slot, where the gamer chooses the game (if the coach has more than one) and then a time.
- Each game section on a profile with two or more games also has a secondary "Choose a time" button, beside that game's price. It opens the same Pick a slot page with that game already chosen.
- A coach with one game shows only the header button.

## Labels (agreed before Phase 1)

- Short labels that say what happens next and who it's with, e.g. "Book a session", "Choose a time", "Continue to payment", "View session".
- Never phrase a label as if the gamer books or buys a game.
- The same action keeps the same label on every page and in every email.

## Phase 1 decisions (agreed before Phase 1)

Browse
- Price filter: a "Max price" select in the viewer's currency: Any price, Up to S$30, Up to S$40, Up to S$50, Up to S$60. Converted prices are compared at their converted value.
- Sort labels: "Lowest price" (default), "Highest rating", "Most reviewed".
- 12 coaches per page, then "Load more".
- A line under the filters explains "≈": prices are in your currency, ≈ means converted from the coach's.

Cast additions (fictional, used across all pages; since 23 Oct 2026 "Verified" in the cast means past the New Coach period, with no label shown)
- **Mirae** `@mirae`, Singapore, Verified, 4.7 (19). Riftbound `Regional Qualifier · Top 8` at S$38; Valorant `Ascendant 3` at S$40.
- **Ghostline** `@ghostline`, Malaysia, Verified, 4.6 (24). Call of Duty: Mobile `Legendary · Top 2,000` at RM 120 (≈ S$34, at the same rate as RM 150 ≈ S$43).
- Browse filler: **Lumen** `@lumen` (Philippines, New Coach, Riftbound `Regional Qualifier · Top 16`, ₱1,250 ≈ S$29); **Pallas** `@pallas` (Singapore, Verified, 4.6 (8), Mobile Legends `Mythical Glory · 64★`, S$30); **Marlowe** `@marlowe` (Malaysia, New Coach, Valorant `Immortal 1`, RM 110 ≈ S$32); **Kestrel** `@kestrel.cod` (Singapore, Verified, 4.5 (11), Call of Duty: Mobile `Legendary · Top 1,000`, S$33); **Tidewalker** `@tidewalker` (Philippines, Verified, 4.8 (41), Mobile Legends `Mythical Immortal · 112★`, ₱1,500 ≈ S$35); **Rook** `@rookcs` (Malaysia, Verified, 4.7 (15), Counter-Strike 2 `Premier 24,800`, RM 180 ≈ S$52); **Hanabi** `@hanabi.vlr` (Singapore, Verified, 4.9 (26), Valorant `Radiant · #312 APAC`, S$60).
- 19 coaches are listed in total; the first page shows 12.

Coach profile
- Availability preview: the next 7 days, each with its number of free one-hour slots, the next free time, and "See all times" (opens Pick a slot). No clickable times on the profile.
- Banner: until real images exist, and for any coach without one, a plain `--bg-mid` band.
- Reviews: the 5 newest, then "Show more reviews" (5 more each time). Each shows the reviewer's username, stars, game, month and text. No rating breakdown, no coach replies.
- Voice intro: a shared audio player (play or pause, duration in mono, a thin progress line). Mocked at 0:45 until the length is decided in Phase 6.
- Logged out: "Book a session" still opens Pick a slot; log in or sign up comes after a time is chosen, and returns to the same choice.

Pick a slot
- Bookable up to 4 weeks ahead. Slots start on the hour. The earliest slot starts at least 2 hours from now.
- Picking a time and pressing "Continue to checkout" creates the 30-minute hold.

Checkout and payment return
- Both pages drop the sidebar and keep the top nav, so attention stays on the amounts and the hold.
- The page names the payment provider: Xendit for coaches in the Philippines, Stripe for Singapore and Malaysia ("You'll pay on Xendit's secure page.").
- "Choose another time" on checkout releases the hold at once and returns to Pick a slot. The same label is used wherever a hold has ended.
- Booking less than 24 hours ahead: checkout adds "This session starts in under 24 hours, so its time can't be moved." under the cancellation rule. (Changed 23 Oct 2026: it used to say it couldn't be cancelled either.)
- The "Cancel within 1 hour of booking for a full refund" line is removed (23 Oct 2026); the cancellation rule is in "Cancellation".
- Booking confirmed: a session summary, "View session" and "Back to dashboard". No calendar export.

New shared components for Phase 1: OptionCard (choice card with a radio), SlotPicker, AudioPlayer, ReviewItem, PriceBreakdown, Spinner.

## Browse card and top nav (agreed 7 Oct 2026, after Phase 1 review)

Browse coaches
- One coach card per row at every width (was two per row on desktop).
- The result count ("19 coaches") is set in Geist bold, and the filter summary after it in Geist regular, muted. A deliberate exception to "counts in Geist Mono", because the count works as a heading for the list.

Coach card (CoachCard component; mockup in `design/explorations/coach-card-v2.html`)
- Desktop reads in three zones: who they are, proof they can coach your game, then price and when you can start. The proof and decision columns have fixed widths so ranks, ratings and prices line up down the list.
- Who: 72px avatar centred vertically; name and Verified or New Coach badge; @handle, flag and country; "Speaks English, Filipino · PHT, same time as you"; the coach's About text on one line.
- The bio shows one line (two on phone) and fades at its end when it doesn't fit. On hover, after a 150 ms pause so scanning the list doesn't make cards jump, or on keyboard focus, it opens smoothly to its full length. Phones don't expand it; tapping opens the profile. The hover lift is dropped; the card lightens instead.
- Proof: game, rank and rating, behind a hairline. Decision: price as the largest figure, then "Next free" with the next free time in the viewer's zone ("Today, 19:00 SGT", "Tue 13 Oct, 20:00 SGT"). A chevron marks the whole card as a link.
- Phone: 72px avatar beside name, handle and flag (no country name), and "English, Filipino · PHT"; two lines of bio; then rank with the rating on its line; then price with the next free time.
- Time zone is phrased from the viewer's side: "same time as you", or e.g. "1 hour behind you".
- Ratings use a filled green star everywhere.

New coach data
- Coaches choose the languages they coach in during profile setup and can change them in coach profile settings. Shown on the browse card and on the coach profile under the name, with country (flag and name) and time zone.
- Flags are the one place colours outside the palette appear. Mockups use simplified flags (`foundations/flags.js`); the app uses a full flag icon set in the same 3:2 box (Flag component).

Top nav (all pages)
- 76px tall on desktop with a 42px logo, a 40px avatar and 16px name and Sign out; Log in and Sign up use full-size buttons. 68px tall below 1000px with a 36px logo (32px at 400px and under) and a 44px menu button. Edge padding 32px on desktop, 16px on phone.

Cast details (fictional)
- Languages: Kairo English, Filipino; Vexa English, Mandarin; nullpoint English, Malay; Mirae English, Korean; Ghostline English, Malay; Lumen English, Filipino; Pallas English; Marlowe English, Malay; Kestrel English, Mandarin; Tidewalker English, Filipino; Rook English, Malay; Hanabi English, Mandarin. Time zones follow country (PHT, SGT, MYT), all UTC+8.
- Every cast coach has a short bio; the browse page source holds the text.

## Coach profile showcase (agreed 9 Oct 2026, checkpoint 2)

A new, optional part of the coach profile. Not in the feature list.

What it is
- Coaches can add up to 5 images of anything they want to show gamers: rank screenshots, tournament photos, notes they share with students. With no images, the profile leaves the section out entirely.
- Each image can have an optional caption, up to 80 characters, e.g. "MPL Philippines 2024, with the team as substitute jungler".
- Separate from the portfolio: the portfolio is reviewed by the team and, once it passes, shown on the profile (changed 23 Oct 2026; how it shows is decided with its format in Phase 6). The showcase isn't reviewed by hand.

On the profile (page 02)
- A "Showcase" section straight after About.
- Gallery component: one large image at a time in a fixed 16:9 frame on `--bg-deep`, shown whole and never cropped, so screenshots and photos of any shape sit in the same box. Under it, the caption (Geist) and the position, e.g. "2 / 5" (Geist Mono). Below that, a row of thumbnails; the current one has a green ring. Previous and next buttons sit on the image's sides on computers; phones swipe. Thumbnails share the row so all five always fit.
- One image: no arrows, no position, no thumbnails.
- No full-size view or pop-up in the MVP.
- Mockups show marked empty image slots until real images are supplied (as with avatars).

Where coaches manage it
- Profile setup (page 21): an optional showcase step.
- Coach profile settings (page 22): add, replace, remove and reorder images, and edit captions.

Automatic check, no manual review
- Every showcase image and caption is checked automatically by a moderation service when it's uploaded or changed, so the team never reviews showcase images by hand.
- Passes: it's live straight away. Fails: it isn't published, and the coach is told in place, while uploading, with a plain reason (e.g. "This image can't be shown on Harbourly. Choose a different one."). No email, because the coach sees the result as it happens.
- A replaced image stays live until its replacement passes. Uncertain results count as a fail, so nothing waits for a person.
- Settings and setup show a short "Checking…" state per image while the check runs.
- Which service to use is to confirm before code is built (see BUILD-ORDER.md).

Elsewhere
- Browse coaches (page 01) doesn't change: the showcase lives on the profile only, and the approved card stays as it is.

Profile order at one-column widths (below 1100px)
- About, Showcase, Games, then Availability, then Reviews. (Was Availability first.) Desktop keeps Availability in the right-hand column.

## Automatic image check for every public image (agreed 9 Oct 2026)

Extends the showcase check above to every image other people can see.

- Covered: profile photos (every account, gamer or coach: they show in the top nav, on reviews and on coach profiles), coach banners, and showcase images with their captions.
- Not covered: private uploads only the team sees (rank proof, dispute evidence, a portfolio under review). The team already looks at those. A portfolio that passes review is public, so its images also go through this check before they show (added 23 Oct 2026).
- Same behaviour everywhere: checked when uploaded or changed; passes, live at once; fails, not used, and the person is told in place with a plain reason ("This photo can't be used on Harbourly. Choose a different one."); uncertain counts as a fail; no email; no manual review.
- A replaced photo or banner stays until its replacement passes. A first photo that fails leaves the default avatar (first letter); a first banner that fails leaves the plain `--bg-mid` band.
- Where it's designed: profile setup (21: photo, banner, showcase), coach profile settings (22: the same), account settings (24: photo). Each upload shows a short "Checking…" state, then passed or refused.
- One moderation service for all of it, to confirm before code is built.

## One session per checkout, and code entry (agreed 16 Oct 2026, checkpoint 2)

One session per checkout for the MVP
- Pick a slot stays one time per checkout: choosing a new time replaces the old one. "One slot per booking" (core decisions) stands.
- Why: one payment, one session, one release or refund keeps every agreed rule simple (24-hour cancellation, free cancellation within 1 hour, reschedules, disputes, auto-release) on both Stripe and Xendit; holding several times would block coaches' calendars; mixed rules would crowd checkout.
- Post-MVP: choosing several times in one checkout, and session packs, once real demand shows. Each session already stands alone, so nothing after booking would need redesigning.
- Booking again is made quick instead: the booking-confirmed state of Payment return (05) has a "Book another time with Kairo" text link under its buttons. It opens Pick a slot for the same coach with the same game already chosen.

Code entry (OtpInput, everywhere a 6-digit code is entered)
- Digits 0–9 only; letters and symbols never land. Each box has `inputmode="numeric"` so phones show the number pad.
- Typing a digit moves to the next box. Backspace on an empty box moves back one and clears it. Arrow keys move between boxes.
- Pasting a code, or the phone's text-message suggestion (`autocomplete="one-time-code"` on the first box), fills all six, ignoring spaces.
- Mockup behaviour lives in `foundations/components/OtpInput.js`, beside its stylesheet.


## Phase 2 decisions (agreed 16 Oct 2026, before Phase 2)

Live session (page 08)
- Voice call with screen share. Cameras are optional and off by default. With cameras off each person is a tile with their avatar, name and a green ring while they speak. A shared screen takes the stage and the tiles shrink to a strip beside it. Camera video and shared screens are marked empty slots in the mockups (no stock imagery).
- Full window: no top nav, no sidebar, so the call keeps its space and nothing invites a click away. A slim session bar holds "Session with Kairo · Mobile Legends", the clock (`12:34 / 60:00`) and "Ends 21:00 SGT".
- "Leave" is separate from "End session". Leave: you can rejoin until the scheduled end. End session: asks the other person (core flow unchanged).
- Chat: desktop, a 360px column on the right on `--bg-mid`, always open. Phone: the stage on top (16:9), chat fills the space below, controls pinned to the bottom.
- Chat holds text and links only, no files. It opens when you join, including the waiting state; there is no messaging before the session. A note on the panel: saved with the session, and the Harbourly team can read it if a problem is reported.
- After the session, session detail shows the chat read-only in a collapsed "Session chat" section.
- Banners (10, 5 and 1 minutes, and "Kairo wants to end the session"): on desktop in the centre of the session bar, so nothing moves and nothing is covered; on phone in a strip between the stage and the chat.
- End request: the person who asked sees "Waiting for Kairo to agree" with "Withdraw". The other person's prompt stays until answered; no timeout.
- One screen share at a time. While the other person shares, your button is disabled and reads "Kairo is sharing". Mockups show the coach sharing a replay. Known MVP limit: Mobile Legends and Call of Duty: Mobile are phone games, so gamers usually can't share live gameplay; coaches review replays or share their own screen.
- Reconnecting: two states. Yours: the stage dims and controls pause until you're back. Theirs: "Kairo lost connection. They can rejoin until 21:00."
- No separate device check before joining. If the browser blocks the microphone or camera, a notice sits in place of your tile with how to allow it; you can still listen and chat.
- No-show: from 15 minutes after the start the gamer's waiting state offers "Report a no-show", which opens Report a problem with that reason already chosen. Once filed, the session closes for both. A coach waiting for an absent gamer sees no button, only "If snapking doesn't join, you're still paid." (Changed 23 Oct 2026: the line now reads "If snapking doesn't join, you can report it after the session. You'd be paid half your price.")
- If nobody joins, the booking moves to Pending confirmation at the scheduled end, as usual.
- Session ended screen: the gamer gets "Confirm session" (session detail, confirm step open) and "Report a problem"; the coach gets "View session".

Session detail (page 06)
- Coach view: names the gamer with flag, country and time zone; times in the coach's zone (PHT); shows "Your price ₱1,850.00" and when it's paid, never the gamer's fee or total. Coaches receive their full price. (Changed 23 Oct 2026: a 12% commission is taken, so the coach view shows price, commission and payout, ₱1,850.00 − ₱222.00 = ₱1,628.00.) Coach cancel confirm says the gamer is refunded in full; inside 24 hours it adds that it's recorded as a serious incident. (Changed 23 Oct 2026: it counts like a no-show; see "Coach reliability".) Pending confirmation reads "Waiting for snapking to confirm" with the release countdown. Completed shows the released amount and the gamer's review. Disputes: the coach can respond. Coaches never see awaiting-payment or expired bookings.
- Confirming the session is a confirm step (it releases payment and can't be undone), with the primary button, not amber: "Kairo is paid ₱1,850.00. After this you can only report payment problems."
- Review: 5 stars, optional text up to 500 characters, not editable, one per booking, open for 30 days after completion, including after a dispute resolved for the coach. "Shown on Kairo's profile with your username."
- Moved: a session moved by an accepted reschedule shows the new time with "Moved from Wed 7 Oct · 20:00 SGT", and "Request a new time" is replaced by "This session has already been moved once."
- The requester can withdraw an open request ("Withdraw request"): the held times are released and it doesn't use up the one accepted move. A declined request shows "Kairo declined your request" and the original time stands; a new request can be sent while changes are still open.
- Offered times: from the coach's free times, at least 24 hours away, within 4 weeks, up to 3, no message. The coach's request form is the same as the gamer's.
- Cancelling while a request is open is allowed and cancels the request too.
- The screen-share note ("Screen sharing needs a computer. On a phone you can talk, chat and watch.") sits with the join details at every width.
- Extra states: In session (you left the call; Join session rejoins) and Pending confirmation with under 24 hours left (amber).
- No booking reference and no activity history. The session facts include "Booked Mon 5 Oct, 14:12 SGT", because the free-cancel hour depends on it. (23 Oct 2026: the free-cancel hour is gone, so this line has no job left.)

Disputes (pages 06 and 07)
- Reason lists. Gamer: "Coach didn't show up" alone during the session (from 15 minutes after the start); the full window list after the session ends; payment reasons after completion. Coach: the window list after the session ends; payment reasons after completion.
- Description required, up to 1,000 characters. Evidence optional: up to 5 files, JPG, PNG, WebP or PDF, 10 MB each; the hint says to paste a link for a video clip. A line says the team can read the session chat, so screenshots of it aren't needed.
- The other person sees the reason, description and evidence, and can send one response (text up to 1,000 characters, up to 5 files) within 48 hours; after that the team decides without it. The filer sees the response.
- Coach no-show reports: the coach has 24 hours to respond; with no response the gamer is refunded in full automatically (matches the landing page FAQ). Everything else is decided by the team.
- One dispute per booking at a time; the other person responds rather than filing their own. A payment problem after completion is a separate dispute, handled between that person and Harbourly: the other person isn't asked to respond. A report can't be withdrawn in the MVP.
- Outcome: an optional one-line note from the team, plus refund timing ("It can take up to 10 working days to show, depending on your bank"). No promise of how long the team takes.

Mockup times (Phase 2)
- Every state follows the Phase 1 booking: Kairo, Mobile Legends, Wed 7 Oct, 20:00–21:00 SGT, booked Mon 5 Oct at 14:12 SGT. Awaiting payment uses Vexa (Tue 13 Oct, S$47.70); Expired uses Kairo, Fri 25 Sep. The Tue 6 Oct booking stays for the Phase 3 dashboard.
- "Now" per state: upcoming and cancel Mon 5 Oct 18:00 (free cancel 14:40); reschedule received Tue 6 Oct 09:00; locked Wed 7 Oct 11:00; join 19:52; no-show 20:16; live 20:12 to 20:42; banners 20:50, 20:55, 20:59; ended 21:00; pending 21:20 (releases Sat 10 Oct 21:00); pending under 24 hours Fri 9 Oct 22:00; disputes Wed 7 to Mon 12 Oct; payment problem Thu 15 Oct. (23 Oct 2026: the free-cancel time no longer applies.)

New shared parts for Phase 2: ParticipantTile, CallControls and ChatPanel (page 08); SlotPicker choosing up to 3 times (reschedule request); Rating.js and Field.js (star input and character counter behaviour, moved out of the component library page); icons for microphone, camera, screen share, chat, send and end call.

## Checkpoint 3 refinements (from 18 Oct 2026)

- Session detail, dispute section (06): a response that hasn't been sent yet is shown as a dashed, empty slot with a clock icon, "No response from Kairo yet", the deadline and the time left. It never uses the quote box, which is kept for words someone actually sent (with its "Sent …" line), so the app's own status text can't be mistaken for the other person's response. Applies wherever a pending response, review or reply is shown later (dashboards in Phase 3, coach dashboard in Phase 5).

## Policy update, 23 Oct 2026 (reconciling the 11 Oct marketing copy)

The marketing copy on `main` (commit `adc8868`, 11 Oct 2026: `landing.html` FAQ and `verification-standard.html`) stated policies that differed from this file. Agreed 23 Oct 2026; the older sections above are corrected to match and point here.

New Coach label, no Verified badge
- There is no Verified badge. Every coach clears the identity check at payout setup, then goes live labelled New Coach.
- The label drops automatically after 5 completed sessions (confirmed or auto-confirmed, including a dispute resolved as paid to the coach) with no upheld dispute. Nothing replaces it: the label simply stops showing.
- Only an upheld dispute (resolved as refunded to the gamer) during the New Coach period resets progress to 0. A dispute resolved as paid to the coach doesn't count against them. A coach no-show or a coach cancellation inside 24 hours also resets it (see "Coach reliability").
- Sessions that end as a gamer no-show or a cancellation don't count towards the 5, and don't reset them.
- Scamming, predatory or grooming conduct is an immediate permanent ban, at any stage, decided by the team.
- Emails: "Your New Coach label has dropped" and "Your New Coach progress was reset" (with the reason).
- In the design: the Badge component keeps only New Coach; coaches shown as Verified in pages 01 to 05 and the cast are past their New Coach period and show no label. Webapp copy doesn't call coaches "verified".

Portfolio
- Optional, reviewed by the team by hand. If it holds up, it's shown on the coach's profile. It never gates bookings, never shortens the New Coach period and never grants a badge.
- How it shows on the profile is decided with its format in Phase 6. Once public, its images also go through the automatic image check. The Showcase stays separate and isn't reviewed by hand.

Rank proof (kept)
- Ranks stay checked against proof screenshots at application and on every rank change ("Ranks" above). "Credentials: optional" in the landing copy refers to the portfolio only. What dropping this later would change is noted in `HANDOFF.md`, Open items.

Fees
- Gamer: the coach's price plus a 6% platform fee (₱1,850.00 + ₱111.00 = ₱1,961.00; S$45.00 + S$2.70 = S$47.70).
- Coach: a 12% commission on the coach's price, taken from the payout; never charged on the gamer's fee. Kairo's payout: ₱1,850.00 − ₱222.00 = ₱1,628.00; Vexa's: S$45.00 − S$5.40 = S$39.60.
- Both rates are snapshotted at booking. Payout stays automatic per session once the 72-hour hold clears.

Cancellation
- Cancel at least 1 hour before for a full refund; inside the last hour, or an upheld gamer no-show, the coach's price is split 50/50. Full rules and amounts in "Cancellation" above.

No-shows (the 16 Oct rule stays; only the gamer no-show outcome changes)
- Kept as built in Phase 2, for simplicity: a no-show is a dispute. The gamer reports "Coach didn't show up" on Report a problem from 15 minutes after the start; the coach reports "Gamer didn't show up" after the session.
- Coach no-show: the coach has 24 hours to respond; with no response the gamer is refunded in full automatically, platform fee included. Otherwise the team decides from the call's join records. Consequences in "Coach reliability".
- Gamer no-show: the team decides. If upheld, the coach's price is split 50/50, as a late cancellation (the gamer gets ₱925.00 back, the coach is paid ₱814.00), instead of the coach being paid in full.
- Considered and not taken (23 Oct 2026): either person reporting, with automatic settlement when the other doesn't contest. Revisit if no-show disputes take up too much of the team's time.

Rates
- Sessions stay a fixed 60 minutes with one price per game for the MVP. Other session lengths or types are post-MVP (the landing copy's "rates can vary by session length or type" goes further than the MVP).
- Price floor: about S$10 per session, set by the team as a fixed floor in each coach currency (S$10, RM 35, ₱430 at the mockups' rates). Price fields in profile setup (21) and coach profile settings (22) enforce it.
- Coaches can change prices any time; a booked session keeps the price it was booked at (the price snapshot).

Coaches aren't exclusive
- Coaches are free to coach on other platforms too. No design change.

Post-MVP: importing reviews from other platforms
- Coaches importing their reviews from Metafy and Fiverr onto their Harbourly profile is wanted, but after the MVP. For the MVP the profile shows Harbourly reviews only.
- Notes for later: Harbourly can't confirm imported reviews are real, so show them in a separate, labelled block (e.g. "From Metafy") that doesn't count towards the Harbourly rating or review count. It would touch the coach profile (02), coach profile settings (22) and possibly the browse card rating (01).
- The landing FAQ still promises it; the copy is the owner's to change.

Unchanged
- The five games; the identity check at payout setup before listing; the 72-hour hold and auto-release; the 72-hour dispute window and 30-day payment disputes; rescheduling (still closes 24 hours before).

## Phase 3 decisions (agreed 23 Oct 2026, before Phase 3)

Gamer dashboard (page 09)
- A list of things to do and things coming up, never a report. **Layout (agreed 28 Oct 2026, replaces the 23 Oct two-column sketch):** the AppShell's "wide" option, so the page uses the full width beside the sidebar. At the top a **welcome banner floats on the page** (no card): the avatar, the date in mono ("Monday, 5 October", with the comma), the Sora greeting ("Good afternoon, snapking") and a "Browse coaches" button on the right. Below it two columns (2fr : 1fr): **To do** on the left in one box, **Coming up**, **Problems you've reported** and **Recent sessions** on the right. Section titles sit above their cards, outside them, and carry no numbers. The columns stack below 1188px of app width (the To do box first), and on a phone the page scrolls once.
- **Scrolling**: on a desktop window (app at least 1188px wide, window at least 760px tall) the page itself doesn't scroll: the banner stays put and the two columns fill the window and scroll separately (the ScrollArea component: thin 6px thumb, brighter on hover or while scrolling, soft fade at an edge with more content past it). In every other case (stacked, short window, tablet, phone) there is one normal page scroll and no inner scrollbars. Space above the banner equals the gap below it (32px, 24px under 1000px).
- **To do box**: shows at most 3 items in full. More than 3: a footer line "N more to do" with "View all", which opens the **To do page** (09 state `todo-all`, route `/dashboard/to-do`): "← Dashboard" back link, the title "To do" as the h1, and every item in the same box; the sidebar keeps Dashboard highlighted. The accent (glowing top line) sits on the To do box, since it holds what needs you; it stays there even when nothing needs you.
- **Next-session card in the banner: removed, kept for later** (HANDOFF.md, "Held back").
- **To do** (the items in the box): one entry per thing waiting on you, soonest deadline first. Each card says what's needed in 06's own words (status, the same title, the booking's coach, game, date and time, the countdown) and offers the action 06 offers. In the busy account: Awaiting payment (Continue to payment, Choose another time), Did the session go ahead? (Confirm session, Report a problem), the coach asked to move this session (the offered times read only, the time left, View session; picking or declining happens on 06), How was your session? (Leave a review, with the date reviews close).
- **Accent line**: the To do box (see Layout). Primary button only on the first item (Continue to payment); the others use secondary buttons, so one thing glows. When a session's Join is open (from 10 minutes before the start to the end), that session moves to the top of To do.
- **Each booking appears once**, in the most urgent place it fits: To do, Problems you've reported, Coming up or Recent. My sessions stays the complete list.
- **Coming up**: one card. The next session first (who, game, date and time, "Join opens 10 minutes before the start, at 19:50 SGT.", Join session disabled until then with "Opens in 29h 38m", View session), then up to 3 rows for the rest.
- **Reviews**: one card lists every completed session still open for review (30 days), each with its date; an entry goes once the review is posted. Posted reviews never show on the dashboard.
- **Problems you've reported**: disputes you filed only, each as 06 shows it ("Problem reported", Open or Under review, reason, sent time); a response not sent yet is the dashed PendingSlot. A resolved dispute stays 7 days with its outcome status, then lives on in My sessions and 06. Hidden when there are none.
- **Recent sessions**: the last 3 finished bookings not shown elsewhere (completed and reviewed or past the review window, cancelled, refunded, expired, disputes resolved more than 7 days ago), then "All sessions". Hidden when there are none.
- **No quick-links card**: the sidebar has Browse coaches and My sessions; "All sessions" sits under Recent and "Browse coaches" is the action in the empty states.
- **Change actions** (Request a new time, Cancel booking) stay on 06; the dashboard never cancels.
- **Money**: only the awaiting payment card shows an amount, in the coach's currency as charged (S$47.70). No "≈" figures on the dashboard.
- **Empty**: To do ("Nothing needs you right now") and Coming up ("No sessions coming up", Browse coaches) always show. A brand-new account sees one block instead: "Book your first session" with Browse coaches as the one action.
- **Coach data never shows here.** A dual-role account reaches the coach dashboard through the sidebar's Coach block (the switcher, as in the component library). No dual-role state on 09.
- No join-open state is drawn on 09 (it would need more 06 copies); the ordering rule above covers it.

My sessions (page 10)
- Two plain SessionList groups: **Upcoming**, soonest first (awaiting payment, confirmed, in session), and **Past**, newest first (pending confirmation, disputed, completed, refunded, cancelled, expired). Coach and game, date and time, status, the amber "Reschedule requested" line; the whole row opens 06. No amounts, no filters, no accent line.
- Past shows 20, then "Load more" (browse's label). Not drawn: the mockup has 4 past bookings.

Booking set and mockup times (Phase 3)
- Busy dashboard and My sessions: **Mon 5 Oct 2026, 14:12 SGT**, the moment 05's "Back to dashboard" lands after booking Kairo for Wed 7 Oct, and the moment 06's awaiting-payment state is set (24:12 left, held until 14:36).
- The bookings at that moment (the component library's session list, reconciled): Kairo, Mobile Legends, Tue 6 Oct 20:00–21:00, Confirmed, ₱1,961.00 (join in 29h 38m). Kairo, Mobile Legends, Wed 7 Oct 20:00–21:00, Confirmed (the 06 booking). Vexa, Valorant, Thu 8 Oct 21:00–22:00, Confirmed with Reschedule requested: Vexa asked on Mon 5 Oct, 10:00, offering Wed 14 Oct 20:00, Thu 15 Oct 21:00 and Sat 17 Oct 15:00; reply by Wed 7 Oct, 10:00 (43h 48m). Vexa, Valorant, Tue 13 Oct 20:00–21:00, Awaiting payment, S$47.70. Mirae, Riftbound, Sat 3 Oct 18:00–19:00, Pending confirmation, S$38.00 + S$2.28 = S$40.28; paid automatically Tue 6 Oct, 19:00 (28h 48m). nullpoint, Counter-Strike 2, Thu 1 Oct 19:00–20:00, Disputed, RM 150.00 + RM 9.00 = RM 159.00; "Session ended early" reported Sun 4 Oct, 18:30; nullpoint can respond until Tue 6 Oct, 18:30 (28h 18m). Ghostline, Call of Duty: Mobile, Sun 27 Sep 15:00–16:00, Completed (confirmed that day), RM 120.00 + RM 7.20 = RM 127.20; review until Tue 27 Oct. Kairo, Mobile Legends, Fri 25 Sep, Expired.
- Nothing to do (09): Thu 24 Sep, 13:05 SGT, just after the first hold ran out (only the expired Kairo booking). Brand-new (09) and empty (10): Thu 24 Sep, 11:00 SGT, snapking just signed up.
- 06 follows one booking, so the dashboard's other bookings got their own states on 06 (kairo-tue, vexa-request, mirae-pending, mirae-confirm, ghostline-review, nullpoint-open) and 07 (mirae-after): copies of existing states with that booking's facts, so every card and row opens its own booking. Their onward links stay inert (only their own steps work), so a walk-through never lands on a different booking.

Shared parts and prototype links
- New component **PendingSlot** (the dashed "not sent yet" slot, moved out of 06; a `stacked` option for narrow columns) and a **compact** SessionList (rows stack at every width, for the dashboard's side column). Both on the component library page.
- The mockup harness links every gamer shell: logo and sidebar Dashboard → 09, Browse coaches → 01, My sessions → 10. 05's View session, Back to dashboard and Book another time; 06's My sessions back link, Browse coaches, Book another time with Kairo, Choose another time and View profile; 07's Back to dashboard are linked.

Fixed while checking Phase 3 (23 Oct 2026)
- 08 coach session ended said "You're paid ₱1,850.00"; it now says ₱1,628.00 (after the 12% commission, as on 06).
- The component library's Confirm step section still showed the old cancellation rule; it now shows the 23 Oct rule (full refund ₱1,961.00 until 1 hour before; ₱925.00 inside the last hour).

Still open
- A gamer can respond to a report a coach files against them (USER-FLOW diagram 7), but 06 and 07 only draw the coach responding. Proposed for after checkpoint 4: a gamer "filed against you" state on 06 and a gamer response form on 07; the dashboard then gains a To do card for it.

## Sign-in services (agreed 28 Oct 2026, before Phase 4 is built)

How pages 11 to 16 work when the app is built. The screens don't change.

- **Supabase Auth** for accounts: email and password, verification and reset links, Google sign-in, and adding a phone to an existing account with a code (page 13).
- **Resend** sends every auth email (verify, reset, password changed, terms updated) as Supabase's custom SMTP, from Harbourly's own domain (DNS records added in Resend). Supabase's built-in email is for testing only.
- **Twilio Verify** sends the 6-digit phone codes, through Supabase's phone provider setting. Chosen over plain Twilio SMS for its built-in fraud blocking.
- **Google sign-in:** a Google Cloud OAuth client (free), set up in Supabase.
- Recommended with it, to set up when building: Supabase Pro for production (free projects pause after a week without activity; Pro includes leaked-password protection, which the breached-password check on 11 and 15 needs); Cloudflare Turnstile (free) as Supabase's CAPTCHA on sign-up, log in and sending a phone code, against SMS fraud; Resend's paid plan before public launch (the free plan allows 100 emails a day).
- Supabase settings to match the design: email confirmation required; minimum password length 8; verification links valid 24 hours, reset links 1 hour; PKCE sign-in flow. Rules still to agree in Phase 4 (password rules, code timings) are set here once agreed.

## Phase 4 decisions (agreed 28 Oct 2026, before Phase 4)

Every recommendation in the Phase 4 brief was taken (gaps G1 to G26). Pages 11 to 16.

Accounts and passwords
- Email sign-ups set their password once, on Sign up (11). Finish setting up (13) never asks for one. Google accounts have no password (setting one later belongs to Account settings, 24).
- Password: at least 8 characters, no rules about character types, checked against known-breached passwords. A plain hint ("At least 8 characters. Don't reuse a password from another site."), no strength meter. Errors: "Use at least 8 characters." and "This password has shown up in a data breach, so it isn't safe to use. Choose another."
- No screen reveals whether an email has an account. Sign up always goes on to "Check your email"; if the address already has an account, that email says so and offers log in or a password reset instead of a verify link. (Replaces 11's "email already used" state.) Log in's wrong details: "That email and password don't match. Try again, or reset your password." Forgot password: "If that email has an account, we've sent a link."
- The terms checkbox is on 13 only, as the flow has it.
- Repeated wrong logins: after 10 tries, "Too many tries. Wait 15 minutes, or reset your password." (14 `too-many`).

Verify your email (12)
- The link works for 24 hours; only the latest link works; resend unlocks after 60 seconds. It opens "Your email is verified" with one button, Continue, to 13 (it doesn't move on by itself).
- Opened on another device or browser: the email is still verified, but that browser isn't logged in, so the button is Log in (12 `verified-other`); after log in the setup check sends them to 13. The original tab moves on to 13 by itself when they come back to it (behaviour, not a state).
- Google sign-ups never see 12: Google has already checked the email.
- "Use a different email" discards the unverified account and returns to Sign up.
- Logging in with an email that was never verified sends a new link and shows 12 (`resent`). Added to USER-FLOW diagram 2.

Navigation on these pages
- Sign up, Log in and Forgot password (11, 14, 15) have no top nav since 29 Oct 2026 (see "Sign up and log in layout").
- Verify your email, Finish setting up and Accept updated terms (12, 13, 16) use the **gate** nav (TopNav `gate`): the logo, not a link (every other page would send them back here), and Sign out, visible at every width; no burger, no sidebar. The two blocked screens on 13 show the logo only, as a link to the marketing home (they're signed out by then). 12 `verified-other` uses the logged-out nav.

Finish setting up (13)
- Order: about you (first name, last name, username, date of birth), where you are (country, then phone, so the dialling code follows the country), how you'll use Harbourly (gamer or coach), terms, Finish setting up.
- First and last name are private (Harbourly only; coaches and other gamers see the username). From Google they're filled in, editable.
- Country: the 10 supported countries in alphabetical order, then "Somewhere else", which leads to the blocked state. No location detection in the MVP (VPNs and travel make it unreliable). Country sets the currency; the time zone comes from the device; both can be changed in Account settings (24).
- Coach countries: Singapore, Malaysia and the Philippines. Thailand counts as not yet until Stripe confirms. When "coach" and a country outside that list are both chosen, a notice shows at once, before submitting: "Coaching isn't available in Indonesia yet. You can still book sessions as a gamer." Finish setting up then goes to the dashboard.
- Date of birth: the library's three fields. The checks run on submit in the flow's order (age, then country). A blocked screen replaces the form; the account and everything entered are deleted and they're signed out ("We haven't kept your details."); one action, Go to the home page. No way back to the form: someone who mistyped signs up again.
- Phone code: 6 digits, valid 10 minutes, resend after 60 seconds, a Verify button (no automatic submit), 5 wrong codes cancel the code ("Too many tries. Send a new code."). The rest of the form stays as typed and editable while the code is open. Submitting without a verified phone: "Verify your phone number to continue." Dialling codes: every country, the 10 supported first. One account per phone number ("That number is already on another Harbourly account. Use a different number.").
- Username: 3 to 20 characters, lowercase letters, numbers, dots and underscores; starts with a letter or number, doesn't end with a dot; unique ignoring case; checked when the field is left; no suggestions; changeable later in Account settings (24).
- The role choice is two option cards, "I want to book sessions" and "I want to coach, and book sessions too", with "This only decides where we take you next. Every account can book sessions."

The booking hand-off
- Signing up from a booking returns to it, like logging in: 03's "New to Harbourly? Sign up" opens 11 with the booking shown; after 13 they go back to 03's returning state, whatever they chose as their role ("Become a coach" stays in the sidebar). Added to USER-FLOW diagram 2.
- Sign up and Log in show the booking in a small inset at the top of the form card: Kairo's avatar, "Sign up to book with Kairo" or "Log in to book with Kairo", "Mobile Legends · Wed 7 Oct · 20:00–21:00 SGT", and 03's line "We'll bring you back to this time. It's held once you continue to checkout." 13 shows a notice that it will take them back.

Log in, Google and password reset
- Continue with Google (the same label on 11 and 14): an account that hasn't finished setup goes to 13; a Google address with no account creates one and goes to 13; a Google address that already has a password account logs into it. A password tried on a Google-only account gets the usual wrong-details message, and a reset email tells them they log in with Google.
- Reset links work for 1 hour. Saving a new password logs out other devices and sends the "Password changed" email; the page then offers Log in (the flow returns to log in rather than signing them in).
- Google sign-in cancelled or failed isn't drawn.

Accept updated terms (16)
- "We've updated our Terms of Service", the update date, up to 3 plain points on what changed (written by the team for each update), "Read the full Terms of Service", and one button, Accept and continue, with the line "By pressing Accept and continue, you agree to the Terms of Service updated on Thu 1 Oct 2026." No checkbox. The only other way out is Sign out. After accepting: back to the booking step if they came from one, otherwise the dashboard.
- The mockup's points are the 23 Oct 2026 policy (cancelling, fees, gamer no-shows), dated Thu 1 Oct 2026 so they fit before the Mon 5 Oct story. Terms links in the mockups are inert: the repo's `terms-of-service.html` is the waitlist-era terms.

Labels (new, used the same on every page)
- Create account · Continue with Google · Log in · Forgot password? · Send reset link · Save new password · Send a new link · Resend email · Use a different email · Continue · Send code · Verify · Resend code · Change number · Finish setting up · Go to the home page · Accept and continue · Sign out. Loading: "Creating your account…", "Logging in…", "Setting up your account…".

Mockup data and times
- snapking: Ryan Tan, born 14 Mar 1999, snapking@example.com, +65 9182 4567 (03 shows it as "+65 •••• 4567"), Singapore, gamer only.
- Sign-up journey: Thu 24 Sep 2026, 10:52 to 11:00 SGT, ending on 09's new-account state. Log in, Forgot password and Accept updated terms: Mon 5 Oct 2026, 14:11 SGT, a minute before 03's booking and hold at 14:12. The what-if states change only the deciding field: under 18 (born 2 May 2010), Somewhere else, coach in Indonesia, username "snap" taken. The booking variants of 11 and 13 show the same Kairo choice as 03.
- Emails (verify, reset, password changed, terms updated) aren't drawn as pages.

New shared parts for Phase 4: Field `password` (Show and Hide, in Field.js) and a label row for a link beside a label; GoogleButton (with the "or" divider; Google's full-colour mark is the second exception to the palette, after flags); ResultPanel (05's result layout as a component: icon, title, text, actions); TopNav `gate`; icons `mail` and `globe`. All on the component library page, section "Sign up and log in".

Elsewhere
- 03's "Verify your phone to book" state can't normally be reached now (everyone verifies at sign-up). Kept as an edge case, for example a number removed by support.

## Sign up and log in layout (agreed 29 Oct 2026, after Phase 4 was built)

Replaces the centred single column on 11 Sign up, 14 Log in and 15 Forgot and reset password. Exploration: `design/explorations/auth-split.html`.

- **Split layout (AuthLayout component):** a full-height brand panel on the left, the form on the right, half each. **No top nav** on these pages: the Log in and Sign up buttons would only repeat the tabs. The Harbourly logo sits top left on the panel and goes to the marketing home. Below 1000px the panel is hidden and the logo sits above the form, where the nav would be. (Revised 29 Oct 2026: the first version had the panel on the right as a rounded box under the top nav.)
- **Brand panel:** the Harbourly mark centred on `--bg-deep`, over the landing page's faint 80px line grid, with a soft green glow behind it that slowly brightens and dims (9 seconds) and the mark floating up and down 8px (6 seconds). No text. Built in CSS; still for reduced motion. **Exception:** the grid and breathing glow otherwise stay on marketing pages ("Visual rules"); this panel is the one webapp place they appear, as the doorway between the two.
- **Tabs (Tabs component):** "Log in | Sign up" as a pill switch above the form on 11 and 14; the selected tab is raised with the green glow. Switching happens in place, with no page load; the address changes between /login and /signup, and a typed email and the booking context carry over. The "Already have an account? Log in" and "New to Harbourly? Sign up" lines are removed. 15 has no tabs (its "← Log in" back link stays).
- **Titles:** Sign up "Create your account" (was "Create your Harbourly account"); Log in "Welcome back" (was "Log in"; the tab and the button keep "Log in").
- **Back to home (11 and 14):** a quiet "‹ Back to home" text link at the top right of the form side, level with the logo on the panel; on narrow screens it shares the top row with the logo, on the right. It goes to the marketing home, like the logo. 15 keeps its "← Log in" back link instead.
- **Spacing on 11 and 14:** 40px between the tabs and the title, 32px between the title and the form card (32px and 24px below 1000px), so the column uses the window height calmly.
- 12, 13 and 16 keep the centred column and the gate nav.
- For the build: the mark is a 256px PNG, slightly soft at 200px on sharp screens; supply a larger PNG (about 512px) or a vector.
