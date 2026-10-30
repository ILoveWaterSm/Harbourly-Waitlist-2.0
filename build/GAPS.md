# Gaps and conflicts

Written 30 Oct 2026, before any app code. Sources read in order: `design/DECISIONS.md`, `design/USER-FLOW.md`, `design/BUILD-ORDER.md`, every state of every page in `design/pages/` (walked in Chromium, text and links captured, all states rendered at 1440 and 390), `design/foundations/`, `design/HANDOFF.md` (Open items), `design-system/`.

Each gap: where, what, why it matters, recommendation (**Rec**) and alternatives (**Alt**), and whether it blocks a milestone (milestone numbers from `MILESTONES.md`). Blockers first, then by milestone. When the owner answers, the answer goes into `design/DECISIONS.md` ("Build decisions") and the gap is marked **Closed** here with a pointer.

Status key: **Open** · **Closed** (answered) · **Info** (recorded, no decision needed).

---

## Blocking gaps

### G-001 · Seed cast is incomplete · Blocks M1 (seed), M2
- **Status:** **Closed 30 Oct 2026** (DECISIONS.md "Build decisions"): drafted in `build/CAST-ADDITIONS.md`; seeded once you approve the draft.
- **Where:** 01 `results` ("19 coaches", "Showing 12 of 19"); DECISIONS "Phase 1 decisions" (cast additions); 02 reviews.
- **What:** Only 12 of the 19 browse coaches exist (Kairo, Vexa, nullpoint, Mirae, Ghostline, Lumen, Pallas, Marlowe, Kestrel, Tidewalker, Rook, Hanabi). The 7 coaches behind "Load more" have no names, games, ranks, prices or bios. Ratings such as Kairo 4.9 (57), Vexa 4.8 (32), Tidewalker 4.8 (41) need that many reviews, each from a gamer account, but only 5 reviews per coach (with reviewer handles) are drawn. Ratings must come from real review rows, not a stored number.
- **Why:** The brief says "use the existing cast only" and "never add data". Without 7 more coaches and the filler reviews, 01's load-more state and every rating on 01 and 02 can't be reproduced.
- **Rec:** I draft a `seed/cast-additions.md` with 7 fictional filler coaches (same style as Lumen…Hanabi, priced above S$60 or between existing prices so the first 12 stay as drawn) and filler reviewer handles plus star values that reproduce each drawn average and count exactly. You approve it before M1 seeds it.
- **Alt:** (a) You supply the 7 coaches and reviewers. (b) Seed only 12 coaches and change 01 to "12 coaches" (changes the mockup; not recommended).

### G-002 · Stripe platform setup for Singapore and Malaysia · Blocks M4 (real Stripe), M9
- **Where:** DECISIONS "Supported countries" ("To confirm directly with Stripe and Xendit before launch"); BUILD-ORDER "To confirm before code is built".
- **What:** Not yet confirmed: the country of Harbourly's legal entity (which decides the Stripe platform country); whether one Stripe platform can hold a gamer's payment and later transfer it to connected accounts in **both** Singapore and Malaysia (cross-border transfers are restricted by region); charging in MYR and SGD from that platform; Thailand.
- **Why:** The whole held-payment model (charge now, transfer to the coach at release, refund half on a late cancel) depends on "separate charges and transfers" working for every coach country.
- **Rec:** Confirm with Stripe: platform in Singapore, Express connected accounts in SG and MY, separate charges and transfers, presentment in SGD and MYR. Meanwhile M4 is built against a payment-provider interface with a **simulated provider** (dev only), so nothing waits on the answer except switching on real Stripe test mode.
- **Alt:** If MY transfers aren't allowed from an SG platform: a second Stripe platform account in Malaysia (two sets of keys, routing by coach country), or Xendit for Malaysia too.

### G-003 · Xendit setup for the Philippines · Blocks M4 (real Xendit), M9
- **Where:** DECISIONS "Supported countries", "Checkout", "Cancellation"; 04 "You'll pay on Xendit's secure page".
- **What:** Not confirmed: xenPlatform sub-account type (MANAGED gives the coach their own Xendit KYC and dashboard, which 20's "link to the provider dashboard" needs); hosted page product (Invoice or Payment Session) with a 30-minute expiry; whether gamers from Singapore, Malaysia and the rest of SEA can pay a PHP charge with their cards; and **whether partial refunds work for every payment method we offer** (the 50/50 split refunds half).
- **Why:** A method that can't be partly refunded would make the late-cancel and gamer-no-show rules impossible to apply.
- **Rec:** Confirm with Xendit: MANAGED sub-accounts, Invoice with `invoice_duration` 1800s, cards accepted internationally, partial refund support per method. Offer only methods that support partial refunds (see G-004).
- **Alt:** OWNED sub-accounts (we run KYC ourselves; more work and compliance on us; not recommended).

### G-004 · Which payment methods checkout offers · Blocks M4
- **Where:** 04, 05; DECISIONS "Payment hold" (30 minutes), "Cancellation".
- **What:** The decisions name the providers but not the methods (cards, Apple Pay, Google Pay, PayNow, GrabPay, FPX, GCash, Maya, bank transfer, over-the-counter).
- **Why:** Methods that settle later (bank transfer, over-the-counter, some e-wallets) can't finish inside the 30-minute hold, and some don't support partial refunds.
- **Rec:** Only methods that confirm within seconds and support partial refunds: cards plus Apple Pay and Google Pay on Stripe; cards plus GCash and Maya on Xendit if G-003 confirms partial refunds for them. No delayed methods.
- **Alt:** Cards only for launch (simplest, lowest risk).

### G-005 · Booking lifecycle (diagram 11) is missing edges the other diagrams need · Blocks M1 (status machine), M5, M7
- **Status:** **Closed 30 Oct 2026**: the three transitions are in diagram 11 (USER-FLOW.md, `user-flow.html` regenerated); cancelling closes at the start time for both people.
- **Where:** USER-FLOW diagram 11 against diagrams 4 and 5; 06 `join` (offers Cancel booking while join is open); 08 `no-show` (the gamer is already in the call).
- **What:**
  1. **Nobody joins:** diagram 5 sends "nobody joins by the scheduled end" to Ended (pending confirmation), but diagram 11 only has `in_session → pending_confirmation`. Missing: `confirmed → pending_confirmation`.
  2. **Coach no-show:** diagram 11 has `confirmed → disputed: coach no-show reported`, but the gamer reports it from the waiting room (08 `no-show`), and joining already moved the booking to `in_session`. Missing: `in_session → disputed`.
  3. **Cancel after someone joins early:** join opens 10 minutes before the start, and the gamer may cancel "up to the start time", so a booking can be `in_session` before the start while cancelling is still allowed. Missing: `in_session → cancelled` (before the start only).
  4. **Coach cancels "any time":** after the start, a coach cancel and a coach no-show overlap.
- **Why:** The transition function rejects anything not in the table; these paths would fail in the app.
- **Rec:** Add `confirmed → pending_confirmation` (scheduled end, nobody joined), `in_session → disputed` (gamer reports coach no-show), `in_session → cancelled` (gamer or coach, only before the start). Coach cancel closes at the start time; after that the gamer reports a no-show. Update diagram 11 and regenerate `user-flow.html`.
- **Alt:** Make `in_session` start at the scheduled start (not at the first join), so joining early doesn't change the status; then only edges 1 and 2 are needed. Simpler table, but "in session" would be shown while nobody is in the call.

### G-006 · Gamer response to a coach's report is not designed · Blocks M6
- **Where:** USER-FLOW diagram 7 (the other person can respond); DECISIONS "Phase 3 decisions, Still open"; HANDOFF Open items.
- **What:** 06 and 07 only draw the coach responding. When a coach reports a gamer (e.g. "Gamer didn't show up"), the gamer needs a "filed against you" state on 06, a response form on 07, and a To do card on 09.
- **Why:** Without it the gamer can't answer a report that can cost them half the price; the flow requires it.
- **Rec:** The design chat draws it (06 gamer "filed against you", 07 gamer respond and response sent, 09 To do card), mirroring the coach versions. M6 builds everything else first.
- **Alt:** A plain version built by mirroring the coach states with role-swapped copy, marked `awaiting design`.

### G-007 · Session detail (06) states that the flow needs but the mockup doesn't draw · Blocks M5, M6
- **Where:** 06 (coach states drawn: upcoming, cancel, request received, pending, completed, dispute respond); diagrams 4, 6, 7; BUILD-ORDER page 6.
- **What:** Not drawn:
  - **Coach view:** cancelled by the gamer (early: nothing paid; late: "you're paid ₱814.00"), cancelled by you, the coach's own reschedule request (form, waiting, declined, expired, withdrawn), moved, join open, in session, dispute under review, resolved (each outcome), the coach as the one who reported, payment problem after completion, review not yet left.
  - **Both views:** resolved, split 50/50 (upheld gamer no-show): the status label text, the amounts (gamer ₱925.00 back, coach ₱814.00) and the copy.
  - **Gamer:** the coach-no-show dispute on 06 (24-hour response window, automatic full refund if no response); 07 `gamer-noshow` has this copy but 06 `disputed-open` shows the 48-hour version.
- **Why:** These states will happen with real data; "every state must exist" and "don't invent UI or copy".
- **Rec:** The design chat draws the coach set and the split outcome (they are copies of drawn states with the coach's words). Until then M5 and M6 build them from the drawn gamer layouts with copy I draft in `build/COPY-DRAFTS.md`, which you approve before release; each is marked `awaiting design`.
- **Alt:** Wait for the design before starting M5.

### G-008 · System pages (25) are needed from the first protected route · Blocks M3
- **Where:** USER-FLOW diagram 10 (System pages); BUILD-ORDER 25 (not designed).
- **What:** 404, "Something went wrong", "Session expired: sign in again" and "Sign in to continue" are needed by every milestone from M2 (unknown coach handles fall back to 02 `not-found`, but every other route needs a 404) and M3 (protected pages). There is also no screen for a **suspended** account (see G-022).
- **Rec:** Plain functional versions built only from library parts (ResultPanel with an icon, title, line and one button, as 05 and 13's blocked states do), copy drafted for your approval, marked `awaiting design`, built in M3.
- **Alt:** Redirect protected pages straight to Log in (with the return path) and use Next.js defaults for 404 and errors until 25 is designed.

### G-009 · Terms of Service and Privacy Policy for the webapp · Blocks M3
- **Where:** 13 ("I agree to the Terms of Service and Privacy Policy"), 16 ("Read the full Terms of Service"); DECISIONS "Phase 4 decisions" ("Terms links in the mockups are inert: the repo's `terms-of-service.html` is the waitlist-era terms").
- **What:** No webapp Terms or Privacy text exists, no URL for them, and no terms version for 13 to record acceptance of. The live `terms-of-service.html` and `privacy-policy.html` must not be touched.
- **Why:** Acceptance must point to a real, versioned document; 16 depends on versions.
- **Rec:** You provide the webapp Terms and Privacy text. They're published on the marketing site at new URLs (your change to the live site) and each version is a row in `terms_versions` (date, the "What's changed" points, URL). Until then M3 seeds version "Thu 1 Oct 2026" pointing at the current pages, clearly marked as a placeholder.
- **Alt:** Serve them from the webapp at `/terms` and `/privacy` (two new routes; needs your approval and a design).

### G-010 · Display currencies other than SGD, MYR and PHP · Blocks M2
- **Where:** DECISIONS "Currency display (option B)", "Phase 1 decisions" (Max price: "Up to S$30 … S$60"), "Phase 4 decisions" ("Country sets the currency").
- **What:** Gamers in Indonesia, Thailand, Vietnam, Brunei, Cambodia, Laos and Myanmar see prices in their own currency, but the docs don't say: which currency each country uses (e.g. Cambodia uses USD widely), the symbol and format (Rp, ฿, ₫, B$, ៛, ₭, K), how "≈" prices are rounded (whole units? nearest 1,000 for IDR and VND?), and what the Max price options are in those currencies.
- **Why:** Browse, profile and dashboard prices and the price filter can't be built for those viewers.
- **Rec:** One currency per country: IDR, THB, VND, BND, KHR, LAK, MMK (SGD, MYR, PHP as now). Converted prices rounded to whole units, except IDR, VND, KHR, LAK and MMK to the nearest 1,000. Max price options: the four SGD steps converted at today's rate and rounded to a clean number, stored in a config table the team can edit. Formats in a config table too.
- **Alt:** Show converted prices in USD for every non-SGD/MYR/PHP country (one extra currency, simpler; less familiar to those gamers).

### G-011 · Logged-out visitors' currency and time zone · Blocks M2
- **Where:** HANDOFF Open items ("Logged-out currency (assumed, not confirmed)"); 01–03 guest states (SGD, SGT).
- **Rec:** SGD prices, and the browser's time zone for times (read once on the device, kept in a cookie). No location detection, consistent with "No location detection in the MVP".
- **Alt:** Guess the currency from the visitor's country (Vercel's IP country). More relevant prices, but location-based and sometimes wrong.

### G-012 · Time zone labels outside SGT, MYT and PHT · Blocks M2
- **Where:** DECISIONS "Time", "Browse card" ("1 hour behind you").
- **What:** Gamers can be in UTC+7 (Thailand, Vietnam, Cambodia, Laos, western Indonesia), UTC+6:30 (Myanmar), UTC+8 (Brunei, central Indonesia), UTC+9 (eastern Indonesia). Coaches living abroad are allowed ("Southeast Asians living abroad"), so a coach could be in e.g. Europe/London, with daylight saving. Labels like "20:00 SGT" need a fixed abbreviation per zone; browsers give "GMT+7" for most of these.
- **Rec:** A fixed label table: SGT, MYT, PHT, WIB, WITA, WIT, ICT (Thailand, Vietnam, Cambodia, Laos), MMT, BNT; for any other zone the standard short name (e.g. BST, GMT, AEDT). Slots start on the hour in the **coach's** zone, so a Myanmar gamer sees e.g. 18:30 MMT.
- **Alt:** Always show "UTC+7"-style offsets outside the three coach zones.

### G-013 · Whose time zone: the account setting or the device · Blocks M2
- **Where:** DECISIONS "Phase 4 decisions" ("the time zone comes from the device; can be changed in Account settings").
- **Rec:** Times are shown in the account's time zone (set from the device at sign-up, changeable on 24). Emails use the same zone. A travelling gamer changes it in 24.
- **Alt:** Always the device's current zone in the app (emails would still need the account zone).

### G-014 · Auth emails: what Supabase can and can't do as specified · Blocks M3
- **Where:** DECISIONS "Sign-in services" (Resend as Supabase's SMTP; links valid 24 hours for verify, 1 hour for reset), "Phase 4 decisions" (sign-up with an existing email: "that email says so"; Google-only account reset email "tells them they log in with Google").
- **What:** Through plain SMTP, Supabase (a) uses one expiry for all its email links (to confirm when building), so verify 24 hours and reset 1 hour can't both be set; (b) sends nothing when someone signs up with an email that already has an account; (c) can't vary the reset email for Google-only accounts. Its templates also can't be previewed in a dev outbox.
- **Rec:** Use Supabase's **Send Email hook** instead of SMTP: Supabase calls our endpoint, and we send every auth email through Resend with our own templates. That lets us send the "you already have an account" email, the Google-only reset email, enforce the 1-hour reset limit ourselves, and show every auth email in the dev outbox. The screens don't change. (Resend is still the sender, from Harbourly's domain.)
- **Alt:** Keep SMTP, set the link expiry to 24 hours for both, and drop the two custom emails (changes agreed decisions; not recommended).

### G-015 · CAPTCHA isn't drawn · Blocks M3
- **Where:** DECISIONS "Sign-in services" (Turnstile on sign-up, log in, sending a phone code); 11, 13, 14 mockups.
- **Rec:** Turnstile in invisible mode: nothing shows unless Cloudflare is unsure, in which case its small challenge box appears directly above the submit button. No layout change in the normal case.
- **Alt:** A visible Turnstile box on every form (changes the drawn layouts).

### G-016 · Email templates and copy don't exist · Blocks M3, M4
- **Where:** DECISIONS "Emails" (the list); BUILD-ORDER "Not in this order" (designing templates would be a separate phase).
- **Rec:** One plain, text-first branded template (logo, one heading, short lines, one button, footer), copy for each email drafted by me from DECISIONS wording and shown in the dev outbox; you approve each milestone's emails at its checkpoint.
- **Alt:** A design phase for emails before M3.

### G-017 · Payments that arrive late, twice, or are charged back · Blocks M4
- **Where:** 05 `released`; diagram 3 (Result); diagram 11.
- **What:** Undefined: (a) a payment that completes at the hold's last second and its webhook arrives after the hold job ran; (b) a gamer who pays twice (two tabs); (c) a card chargeback filed with the bank (not a Harbourly dispute).
- **Rec:** (a) Before expiring a hold, the job expires the provider's checkout first; if the provider says it's already paid, the booking is confirmed instead. If a payment still lands after release, it's refunded in full automatically and the gamer gets the "Payment window expired" email with a line saying the refund is on its way. (b) A second payment for the same booking is refunded automatically. (c) A chargeback is recorded and the team is flagged; if the money hasn't been released yet, release is paused. No new screens.
- **Alt:** Leave (a)–(c) to the team by hand.

### G-018 · Prices in whole units, and rounding · Blocks M1 (money module)
- **Status:** **Closed 30 Oct 2026**: whole-unit prices (DECISIONS.md "Build decisions"; BUILD-ORDER 21 and 22 updated).
- **Where:** DECISIONS "Fees", "Cancellation" (6%, 12%, half of the price).
- **What:** No rounding rule is written. With prices in whole currency units (S$45, RM 150, ₱1,850, as every mockup shows) every fee, commission and half comes out exact to the cent.
- **Rec:** Coach prices are whole units only (no cents). The money module still rounds half up to the minor unit if a rate ever changes, and every booking stores its computed amounts.
- **Alt:** Allow cents, round half up everywhere (amounts like S$22.53 can then appear).

### G-019 · When a dispute becomes "Under review" · Blocks M6
- **Where:** Diagram 7 (Notify → Review); 06 `disputed-open` vs `disputed-review`.
- **Rec:** Automatically, when the other person sends their response or their window ends without one. The team can also set it.
- **Alt:** Only the team sets it.

### G-020 · Payment problems after completion: statuses and outcomes · Blocks M6
- **Where:** Diagram 7 (PayOpen: "Handled between you and Harbourly. Outcome emailed"); DECISIONS "Disputes" (statuses list covers window disputes only).
- **Rec:** Statuses Open → Under review → Resolved, with a required team note that the outcome email carries. Any money fix (e.g. refunding a double charge) is done by the team in the provider dashboard and recorded through a team function. The booking status doesn't change.
- **Alt:** Give payment problems the same outcome statuses as window disputes (refunded, paid) – they don't fit "charged twice".

### G-021 · Coach record when "coach" is chosen at sign-up · Blocks M3
- **Where:** Diagram 2 (CoachCountry → AppIntro) vs diagram 8 (Become a coach → "Coach record created").
- **Rec:** Finishing 13 as a coach in a coach country creates the coach record (`draft`) and opens 17, exactly as "Become a coach" does, so the coach block appears in the sidebar at once.
- **Alt:** Open 17 without a record; the record is created when they continue from step 1.

---

## Non-blocking gaps (by milestone)

### G-022 · Suspension and ban: what happens · M9 (coach), M11 (gamer)
- **Where:** Diagram 12 (live → suspended → live; banned); DECISIONS "Coach reliability", "Account suspended" email (gamer or coach). No gamer suspension in any lifecycle; no screen for a suspended person.
- **Rec:** Coach suspended: hidden from browse and not bookable; upcoming bookings cancelled with full refunds (not counted as reliability incidents); held payments for sessions already done follow their normal course unless the team pauses them. Banned: the whole account is suspended permanently. Gamer suspended: can't log in (a system-page state, "Your account is suspended", with the reason in the email); upcoming bookings cancelled with full refunds. All applied through team functions.
- **Alt:** Keep existing bookings for a suspended coach and only hide the profile.

### G-023 · Thresholds for reliability flags · M5
- **Where:** DECISIONS "Coach reliability" ("a repeat pattern gets a warning"), "Cancellation" ("Repeated late cancellations or no-shows by a gamer are flagged").
- **Rec:** Coach: flag at the 2nd no-show or late cancel within 90 days (plus the agreed 3 cancellations of any kind in 30 days). Gamer: flag at the 2nd late cancel or upheld no-show within 30 days. Flags are a list the team reads in Supabase; nothing automatic.
- **Alt:** You set the numbers.

### G-024 · A live coach whose payout account becomes restricted · M9
- **Where:** Diagram 8/12 (only the pre-live "couldn't verify" state).
- **Rec:** Hidden from browse until the provider clears it; existing bookings go ahead; releases retry until the account works; coach dashboard shows the existing "couldn't be verified" state.

### G-025 · Overlaps and holds · M4 (schema in M1)
- **Status:** **Closed 30 Oct 2026**: one session at a time per person, in either role; holds and offers stand.
- **What:** Undefined: a coach editing availability while a hold or reschedule offer is open; a dual-role person booked as a gamer at a time they're bookable as a coach; a gamer booking two coaches at the same time.
- **Rec:** Holds and offered times stand once made. One person can't be in two sessions at once, in either role (enforced in the database alongside the coach-level rule).
- **Alt:** Only the coach-level rule (a gamer may double-book themselves).

### G-026 · Availability exceptions (blocking a single date) · M10
- **Rec:** Weekly pattern only in the MVP, as the flow says. A coach who can't make a booked session cancels it.

### G-027 · A coach with no free time in the next 4 weeks · M2
- **Where:** 01 card ("Next free …"), 02 availability preview.
- **Rec:** Still listed; the card's Next free line reads "No free times in the next 4 weeks" (copy for your approval); 02 shows each day as "No times" and the Next free block reads the same line.
- **Alt:** Hide such coaches from browse.

### G-028 · Sort tie-breaks · M2
- **Rec:** Lowest and highest price: ties by rating, then name. Highest rating: coaches with no reviews last. Most reviewed: ties by rating. Stable order so "Load more" never repeats a coach.

### G-029 · Mockup error: coach payment problem shows the price, not the payout · M6
- **Where:** 07 `coach-payment` ("RELEASED ₱1,850.00 · Wed 7 Oct").
- **What:** Since 23 Oct 2026 the coach is paid ₱1,628.00 (after the 12% commission), as 06 and 08 show.
- **Rec:** Build ₱1,628.00; the design chat fixes the mockup.

### G-030 · Mockup link: "Keep waiting" on the no-show report · M6
- **Where:** 07 `gamer-noshow` links "Keep waiting" to 06 `pending`; diagram 5 keeps the gamer in the waiting room.
- **Rec:** Back to the live session waiting room (08 `no-show`).

### G-031 · "What happens next" when a coach reports a gamer no-show · M6
- **Where:** 07 `coach-after` ("your payment released, or a full refund to snapking"); DECISIONS "No-shows" (upheld gamer no-show splits 50/50).
- **Rec:** When "Gamer didn't show up" is chosen, the line reads "You're both emailed the outcome: half your price paid to you, or a full refund to snapking." (copy for approval).

### G-032 · Coach no-show report: the coach joins after it's filed · M7
- **Where:** 08 (no state for a coach arriving after the gamer reported a no-show).
- **Rec:** The coach's Join goes to 06's coach dispute state (respond), which already explains the report.

### G-033 · Emails not on the list, and timing · M5, M6, M12
- **What:** (a) no email tells the reporter the other person responded (07 `response-sent` says "We've told snapking"); (b) no email when a reschedule request is withdrawn (the other person was emailed the request); (c) "Leave a review" lands at the same moment as "Session confirmed"; (d) no email confirms an account deletion request.
- **Rec:** Add (a) "Response received" and (b) "Reschedule request withdrawn". (c) Send "Leave a review" only when the gamer didn't confirm in the app (auto-release, or resolved for the coach), 1 hour after completion. (d) Add "Deletion requested".

### G-034 · "Still to finish before you go live" nudge timing · M9
- **Where:** DECISIONS "Emails" ("after a few days stuck").
- **Rec:** 3 days after approval if not live, then once more at 10 days.

### G-035 · Rejections after the third, and the reason list · M9
- **Where:** DECISIONS "Rejected coach applications".
- **Rec:** The third and every later rejection waits 14 days. You give the full reason category list, each mapped to the section it highlights (games and ranks; proof; profile link; "why you coach").

### G-036 · Account deletion: what's removed and when · M11
- **Where:** DECISIONS "Account and system pages" ("Deletion requested").
- **Rec:** The team processes requests within 30 days through a team function: sign-in, name, phone, date of birth, photos and chat authorship are removed; bookings, payments and disputes stay for legal and tax records with the person shown as "Deleted account"; their reviews stay under "Deleted account". You confirm with your legal adviser.

### G-037 · Chat retention · Before launch
- **Where:** BUILD-ORDER "To confirm before code is built".
- **Rec:** Keep chat 12 months after the session (covers the 30-day payment window and any late dispute), then delete automatically; state it in the Terms.

### G-038 · Phase 6 formats and the languages list · M9, M10
- **Where:** HANDOFF Open items (voice intro length, portfolio format, languages field).
- **Rec:** Decided with the design of 21 and 22. Built after design.

### G-039 · Removing a game, and a coach changing time zone · M10, M11
- **Rec:** Removing a game isn't in the flow: not offered in the MVP. A coach who changes time zone keeps the same wall-clock availability in the new zone; booked sessions don't move.

### G-040 · Upper limit on a coach's price · M10
- **Rec:** A typo guard only (e.g. no more than 50× the floor: S$500, RM 1,750, ₱21,500), shown as a field error.

### G-041 · Log-in lockout details · M3
- **Where:** DECISIONS "Phase 4 decisions" ("after 10 tries").
- **Rec:** 10 failed tries for one email within 15 minutes, counted whether or not the email has an account, lock that email for 15 minutes from the last try; a separate per-IP limit stops one device trying many emails.

### G-042 · Payment return while the provider hasn't answered · M4
- **Where:** 05 `confirming`.
- **Rec:** 05 asks the provider directly (not only the webhook) every few seconds. It stays on "Confirming your payment" until the provider answers or the hold ends, then shows confirmed, failed or released.

### G-043 · "Within 4 weeks" for reschedule offers · M5
- **Rec:** 4 weeks from now, the same window as booking.

### G-044 · Mockup data differs between pages · M1 (seed approach)
- **Where:** Kairo's free times on 03 (Mon 5 Oct 14:10) and on 06 `reschedule-form` (Mon 5 Oct 18:00) don't come from one weekly pattern; Vexa's hold on 09 starts 14:06 but snapking logs in at 14:11 (14) and books Kairo at 14:12 (03, 05). 04 shows 28:41 left and 06 and 09 24:12 for the same hold (HANDOFF Open items).
- **Rec:** Seed by **scenario**: each mockup state (or group of states) has a named seed snapshot and a dev-clock time, loaded from the dev tools. The real app then shows exactly what each state draws, without forcing one timeline.

### G-045 · 10 My sessions width · M5
- **Where:** HANDOFF Open items (10 uses the 1080px cap, 09 is full width).
- **Rec:** Build as drawn (1080px) unless you choose `wide`.

### G-046 · Sidebar links for dual-role accounts · Info
- **Where:** HANDOFF Open items (the mockup harness wires Kairo's sidebar to snapking's pages).
- **Rec:** A mockup-harness issue only; in the app every link goes to the signed-in person's own pages. Close it.

### G-047 · Brand mark image size · M3
- **Where:** DECISIONS "Sign up and log in layout" (256px PNG is slightly soft at 200px).
- **Rec:** You supply a 512px PNG or an SVG of the mark; the 256px PNG is used until then.

### G-048 · Google sign-in cancelled or failed · M3
- **Where:** DECISIONS "Phase 4 decisions" ("isn't drawn").
- **Rec:** Back to the same tab (Log in or Sign up) with a Notice above the form: "Google sign-in didn't finish. Try again, or use your email." (copy for approval).

### G-049 · Error states on Set a new password · M3
- **Where:** 15 `new-password` (no error state drawn).
- **Rec:** The same field errors as 11 `errors` ("Use at least 8 characters." and the breached-password line).

### G-050 · Updated terms while someone is already logged in · M3
- **Where:** Diagram 2 runs the terms check at log in.
- **Rec:** The check runs on every page load of a logged-in page, so a new version sends people to 16 at their next click, then back where they were.

### G-051 · Avatars and showcase images · Info
- **Where:** HANDOFF Open items.
- **Rec:** Default avatars and marked empty showcase slots, as the mockups show, until you supply images. Screenshot checks use the same placeholders.

### G-052 · HEIC from iPhone cameras · M10
- **Where:** DECISIONS "Uploads".
- **Rec:** Check on a real iPhone during M10, as agreed.

### G-053 · 03 "Verify your phone to book" is hard to reach · Info
- **Where:** DECISIONS "Elsewhere" (Phase 4).
- **Rec:** Built as drawn and reachable with a dev tool that removes a seeded phone number.

### G-054 · Landing copy and held-back ideas · Info
- **Where:** HANDOFF Open items (landing FAQ goes further than the webapp on no-shows and imported reviews; next-session card held back; rank proof kept; post-MVP items).
- **Rec:** No build action. The landing copy is yours to change.

### G-055 · "Becoming a coach" from a non-coach country later · M9
- **Where:** Diagram 8 (Become a coach) vs "Supported countries" (coach list); 17 not designed.
- **Rec:** "Become a coach" for an account in a non-coach country shows the same line as 13 ("Coaching isn't available in Indonesia yet. You can still book sessions as a gamer.") on 17, with no record created. Needs 17's design.

### G-056 · End early: when the 72 hours start · M7
- **Where:** DECISIONS "In-session timing" ("Pending confirmation starts whenever the session ends, early or on time").
- **Rec:** The 72 hours (and the 24-hour reminder) count from the actual end.

### G-057 · Pages 17 to 25 have no design · M9, M10, M11
- **Rec:** For each, ask at the start of its milestone. My default recommendation is to wait for the design for 17–24 (they're large and carry trust-heavy copy), and to build 25 plain now (G-008).

---

## From HANDOFF "Open items" and BUILD-ORDER "To confirm before code is built"

| Item | Where it's tracked |
|---|---|
| Coach launch countries with Stripe and Xendit, Thailand | G-002, G-003 |
| Exchange-rate source | Decisions table (E-5) |
| Chat retention | G-037 |
| Image moderation service | Decisions table (E-6) |
| Sign-in services: Twilio Verify prices, Resend domain records, Supabase Pro and Resend paid plan before launch | M13 launch checklist |
| Avatar and showcase images | G-051 |
| Mockup-only hints on 12 and 15 | Not built (harness only) |
| 03 Phone not verified | G-053 |
| 10 width | G-045 |
| Sidebar links for dual-role accounts | G-046 |
| Phase 6 formats, languages field | G-038 |
| Logged-out currency | G-011 |
| Held-back ideas, next-session card, rank proof, post-MVP, landing copy | G-054 |
| Gamer response to a coach's report | G-006 |
| 04's hold countdown | G-044 |
| iPhone JPEG conversion | G-052 |
