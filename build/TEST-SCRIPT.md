# User-flow test script

The acceptance script for every milestone. You follow it by hand; the Playwright end-to-end tests use the same IDs (`T-3.04` is diagram 3, scenario 4), so the manual test and the automated test are the same script.

## How to use it

- **Dev tools** (development and preview only) live at `/dev`. Every scenario starts with:
  1. **Load scenario:** `/dev` → Seed → choose the named seed (e.g. `busy`). This resets the database to that snapshot.
  2. **Set clock:** `/dev` → Clock → enter the time given (all times SGT unless stated). The whole app, the timed jobs and the emails use this clock.
  3. **Be someone:** `/dev` → Users → choose the account. (Or log in normally; every seeded password is `harbour-tide-42`.)
- **Run jobs:** `/dev` → Jobs → "Run due jobs now" processes everything the clock says is due (hold expiry, reminders, auto-release, expiries). Moving the clock never runs jobs by itself, so you control when they happen.
- **Payments:** in development the hosted payment page is a simulated Stripe or Xendit page (`/dev/pay`) with Pay, Fail and "Pay, but delay the webhook" buttons. In preview, real Stripe and Xendit **test mode** pages are used with test cards.
- **Emails:** nothing leaves the app. `/dev` → Outbox lists every email with recipient, subject and body.
- **Calls:** open two browsers (or a normal and a private window) logged in as the two people.
- **Expected results** name the page and mockup state as `06#upcoming`. Compare against the mockup at `design/pages/` in that state. "Status" is the booking's status. Amounts are exact.
- Steps marked **[awaiting design]** depend on a page or state that isn't designed yet (gap ID given); they become testable when it is.

## The cast (seeded)

| Account | Role | Country, zone, currency | Notes |
|---|---|---|---|
| snapking (Ryan Tan) `snapking@example.com` | gamer only | Singapore, SGT, SGD | born 14 Mar 1999, +65 9182 4567 |
| Kairo `@kairo.gg` `kairo@example.com` | coach (and gamer) | Philippines, PHT, PHP | Xendit; Mobile Legends ₱1,850, Call of Duty: Mobile ₱2,100; past New Coach |
| Vexa `@vexa` | coach | Singapore, SGT, SGD | Stripe; Valorant S$45 |
| nullpoint `@nullpoint` | coach, New Coach | Malaysia, MYT, MYR | Stripe; Counter-Strike 2 RM 150; no reviews |
| Mirae `@mirae` | coach | Singapore | Riftbound S$38, Valorant S$40 |
| Ghostline `@ghostline` | coach | Malaysia | Call of Duty: Mobile RM 120 |
| Lumen, Pallas, Marlowe, Kestrel, Tidewalker, Rook, Hanabi | coaches | as DECISIONS | browse filler |
| 7 more filler coaches (Juniper, Wren, Solstice, Orrin, Brightwater, Cobalt, Ferro), filler reviewers | coaches, gamers | `build/CAST-ADDITIONS.md` | pending your approval of the draft (G-001) |

## Seed scenarios

| Seed | What it holds | Used by |
|---|---|---|
| `fresh` | Cast coaches, live, with their availability and reviews. No snapking account. | Diagram 2 sign-up |
| `phase1` | `fresh` plus snapking, set up, no bookings; Kairo's week as 03 draws it | 01–05 |
| `kairo-wed` | `phase1` plus Kairo, Mobile Legends, Wed 7 Oct 20:00–21:00, confirmed, booked Mon 5 Oct 14:12, paid ₱1,961.00 | 06, 07, 08 |
| `busy` | The Phase 3 booking set (DECISIONS "Booking set and mockup times (Phase 3)") | 09, 10, 06 dashboard links |
| `quiet` | snapking with only the expired Kairo booking (Fri 25 Sep) | 09 quiet |
| `new` | snapking just signed up, nothing booked | 09 new, 10 empty |
| `terms` | `phase1`, with a newer terms version (Thu 1 Oct 2026) snapking hasn't accepted | 16 |
| `coach-draft`, `coach-approved`, `coach-live-new` | a fresh coach account at each stage (cast to approve, G-001) | Diagram 8, 9, 12 |

---

## Diagram 2 · Sign up and log in

### T-2.01 · Sign up with email, as a gamer
- **Covers:** Start → Method → Email → Verify → Details → Fields → Age(yes) → Country(yes) → SBooking(no) → Role(no) → GDash.
- **Account:** new person (becomes snapking). **Pre:** seed `fresh`; clock Thu 24 Sep 2026 10:52.
1. Open `/signup`. → 11#form: brand panel left, "Log in | Sign up" tabs with Sign up selected, "Create your account", Continue with Google, "or", Email, Password with "At least 8 characters. Don't reuse a password from another site." No top nav.
2. Enter `snapking@example.com` and `harbour-tide-42`, press Create account. → button reads "Creating your account…" (11#loading) → `/verify-email` 12#sent: "We've sent a link to snapking@example.com…", "Resend email in 0:59" counting down, "The link works for 24 hours."
3. Outbox: one "Verify your email" email to snapking@example.com.
4. Open its link (same browser). → 12#verified "Your email is verified" with Continue. Press Continue. → `/signup/details` 13#form, "Signing up as snapking@example.com · EMAIL VERIFIED".
5. Fill First name Ryan, Last name Tan, Username snapking, date of birth 14 / March / 1999, Country Singapore, phone +65 9182 4567, press Send code. → 13#phone: "Enter the code we sent to +65 9182 4567", "It works for 10 minutes.", "Resend code in 0:59". (Dev: the code is in `/dev` → SMS.)
6. Enter the 6 digits, press Verify. → phone shows VERIFIED with Change (13#filled).
7. Choose "I want to book sessions", tick the terms box, press Finish setting up. → "Setting up your account…" (13#submitting) → `/dashboard` 09#new: "Welcome to Harbourly, snapking" with Browse coaches. Sidebar shows the gamer block with "Become a coach".
- **Data:** profile country SG, currency SGD, time zone Asia/Singapore, terms version accepted, phone verified.

### T-2.02 · Sign-up form errors
- **Covers:** Email (error recovery). **Pre:** `fresh`, 10:52.
1. `/signup`, email `snapking@example`, password `password1`, Create account. → 11#errors: "Enter an email address like name@example.com." under Email; "This password has shown up in a data breach, so it isn't safe to use. Choose another." under Password. Errors use the amber border, an icon and text, not colour alone.
2. Password `short1`. → "Use at least 8 characters."
3. Fix both. → continues as T-2.01 step 2.

### T-2.03 · Verify email: resend and expired link
- **Covers:** Verify (resend, 24-hour link, only the latest link works). **Pre:** after T-2.01 step 2.
1. Wait for "Resend email" to unlock (60 s), press it. → 12#resent: "We sent a new link at 10:55 SGT", "Only the latest link works, so use the newest email." Outbox: a second email.
2. Open the **first** email's link. → 12#expired "This link has expired".
3. Set clock to Fri 25 Sep 10:56 (24 h after the second email), open the second link. → 12#expired. Press Send a new link → 12#resent; the newest link opens 12#verified.

### T-2.04 · Verify link opened on another device
- **Covers:** Verify → Login ("Link opened on another device: log in"); Creds → EmailOK(yes) → Checks(setup not finished) → Details.
1. After T-2.01 step 2, open the link in a different browser. → 12#verified-other with the logged-out nav: "snapking@example.com is confirmed. You opened the link on a different device or browser…" and Log in.
2. In the **first** browser, return to the tab. → it moves on to 13 by itself.
3. In the second browser press Log in, log in. → 13#form (setup not finished).

### T-2.05 · Use a different email
1. On 12#sent press "Use a different email". → `/signup` 11#form, empty. The unverified account is gone: signing up again with the same email works and sends a fresh link.

### T-2.06 · Sign up with an email that already has an account
- **Pre:** `phase1`.
1. `/signup` with `snapking@example.com` and any valid password. → 12#sent, exactly as for a new email (no hint the account exists).
2. Outbox: an email to snapking telling them they already have an account, with Log in and Reset password buttons, and no verify link.

### T-2.07 · Sign up with Google
- **Covers:** Method → Google → Details (no 12); Checks.
1. `/signup` → Continue with Google → (dev: simulated Google account chooser; preview: real Google) choose snapking@example.com. → 13#google: "Signed up with Google as snapking@example.com", First name Ryan and Last name Tan filled in and editable. 12 never shows.
2. Complete as T-2.01 steps 5–7. → 09#new.

### T-2.08 · Finish setting up: missing details, username, phone code rules
- **Pre:** at 13 after T-2.01 step 4.
1. Press Finish setting up with nothing filled. → 13#missing: "A few details are missing" and under each field "Choose a username.", "Enter your date of birth.", "Choose your country.", "Verify your phone number to continue.", "Accept the terms to continue."
2. Username `snap`, leave the field. → 13#username-taken "That username is taken. Try another." (`snap` is seeded). `Snapking`, `snap.`, `.snap`, `sn` and 21 characters are rejected with the field's rule.
3. Send code, enter a wrong code, Verify. → 13#wrong-code "That code doesn't match. Check the latest text and try again." with Resend code.
4. Enter wrong codes until 5 tries. → "Too many tries. Send a new code."
5. Set clock 10 minutes past sending, enter the right code. → expired; Resend code works after 60 s.
6. Change number to a number already on another seeded account. → "That number is already on another Harbourly account. Use a different number."
7. Throughout, the rest of the form keeps what was typed.

### T-2.09 · Under 18
- **Covers:** Age(no) → Under18.
1. At 13 enter date of birth 2 May 2010, everything else valid, Finish setting up. → 13#under-18: "You need to be 18 or older to use Harbourly", "We haven't kept your details.", Go to the home page. Logo only, linking to the marketing home.
2. The account, profile and phone are deleted and you're signed out. Logging in with that email fails with the normal wrong-details message.

### T-2.10 · Country not supported
- **Covers:** Country(no) → NotAvail.
1. At 13 choose "Somewhere else", Finish setting up. → 13#not-available "Harbourly isn't available in your country yet" with the list of countries. Account deleted, signed out, as T-2.09.
2. Age is checked first: under 18 and "Somewhere else" together → 13#under-18.

### T-2.11 · Coach in a country where coaching isn't open
- **Covers:** Role(yes) → CoachCountry(no) → NoCoach → GDash.
1. At 13 choose Indonesia, then "I want to coach, and book sessions too". → 13#coach-unavailable notice appears at once: "Coaching isn't available in Indonesia yet. You can still book sessions as a gamer."
2. Finish setting up. → 09#new. No coach record; sidebar shows "Become a coach".

### T-2.12 · Coach in a coach country
- **Covers:** CoachCountry(yes) → AppIntro.
1. At 13 choose the Philippines and the coach option, finish. → coach record created (`draft`, G-021); sidebar gains the Coach block; lands on 17 Coach application step 1 **[awaiting design, G-057]**.

### T-2.13 · Sign up from a booking
- **Covers:** SBooking(yes) → BackToSlot; diagram 3 Auth → Slot.
- **Pre:** `fresh` plus one unrelated account; clock Mon 5 Oct 2026 14:10; logged out.
1. `/coaches/kairo.gg/book`, choose Mobile Legends, Wed 7 Oct 20:00. → 03#guest: "Log in to continue", "New to Harbourly? Sign up".
2. Press Sign up. → 11#booking: inset "Sign up to book with Kairo · Mobile Legends · Wed 7 Oct · 20:00–21:00 SGT · We'll bring you back to this time…".
3. Switch to the Log in tab and back. → the booking inset and any typed email stay; the address changes between `/login` and `/signup` without a page load.
4. Complete sign-up and verification. → 13#booking with "After this, we'll take you back to your time with Kairo".
5. Finish as a **coach** in the Philippines. → still returns to 03#returning ("You're logged in, and your choice is still here"), not 17; "Become a coach"/Coach block as T-2.12.
6. Repeat with Continue with Google. → same return.

### T-2.14 · Log in with email
- **Covers:** Login → LMethod → Creds → EmailOK(yes) → Checks(yes) → Terms(yes) → Return(no) → GDash.
- **Pre:** `busy`; clock Mon 5 Oct 14:11; logged out.
1. `/login`. → 14#form: tabs with Log in selected, "Welcome back", Continue with Google, Email, Password with "Forgot password?", Log in, "‹ Back to home" top right.
2. Log in as snapking. → "Logging in…" (14#loading) → `/dashboard` 09#busy.

### T-2.15 · Wrong details
1. `/login`, snapking with a wrong password. → 14#wrong: "That email and password don't match. Try again, or reset your password." ("reset your password" links to 15).
2. An email with no account. → exactly the same message.

### T-2.16 · Too many tries
1. Wrong password 10 times for one email. → 14#too-many: "Too many tries. Wait 15 minutes, or reset your password.", Log in disabled. The correct password is also refused now.
2. Set clock +15 minutes. → Log in works.
3. An email with no account behaves the same.

### T-2.17 · Log in from a booking
- **Covers:** Return(yes) → BackToSlot.
1. As T-2.13 step 1, press "Log in to continue". → 14#booking "Log in to book with Kairo".
2. Log in as snapking. → `/coaches/kairo.gg/book` 03#returning with Mobile Legends and Wed 7 Oct 20:00 still chosen. No hold yet.

### T-2.18 · Log in with Google
- **Covers:** LMethod → Google → Checks; "Google, no account yet: creates one".
1. snapking's Google identity (seeded): Continue with Google → 09#busy.
2. A Google address with no account → account created → 13#google.
3. A Google address that matches a password account → logs into that account (identity linked) → 09.
4. A password tried on a Google-only account → the wrong-details message.

### T-2.19 · Log in before verifying the email
- **Covers:** EmailOK(no) → Verify.
1. Sign up (T-2.01 steps 1–2) but don't verify. Log in with those details. → a new link is sent (Outbox) and 12#resent shows.

### T-2.20 · Log in with setup unfinished
- **Covers:** Checks(no) → Details.
1. Verified account that never finished 13: log in. → 13#form. Any other app address also sends them to 13.

### T-2.21 · Accept updated terms
- **Covers:** Terms(no) → AcceptTerms → Return.
- **Pre:** seed `terms`; clock Mon 5 Oct 14:11.
1. Log in as snapking. → `/terms/accept` 16#terms: gate nav (logo not a link, Sign out), "We've updated our Terms of Service", "Updated Thu 1 Oct 2026", the three points, "Read the full Terms of Service", Accept and continue.
2. Try opening `/dashboard`. → back to 16.
3. Press "sign out" in "Not ready? You can sign out and come back later." → signed out, marketing home.
4. Log in again, Accept and continue. → 09#busy. Acceptance stored with time and version.
5. Repeat from a booking (T-2.17 step 1 with the `terms` seed). → after accepting, 03#returning.
6. While logged in elsewhere, the team publishes a new version (dev: `/dev` → Terms → publish). Next click → 16, then back to the page you were going to (G-050).

### T-2.22 · Forgot and reset password
- **Covers:** Creds → Forgot → ResetEmail → Reset → Login.
- **Pre:** `phase1`; clock Mon 5 Oct 14:11; log snapking in on a second browser first.
1. `/login` → Forgot password? → `/forgot-password` 15#request "Reset your password", "← Log in".
2. Enter snapking@example.com, Send reset link. → 15#sent: "If snapking@example.com has an account, we've sent it a link… The link works for 1 hour." Outbox: Reset password email.
3. Open the link. → `/reset-password` 15#new-password "For snapking@example.com".
4. Enter a breached password → the breached-password error (G-049). Enter a new valid password, Save new password. → 15#done "Your password is changed", Log in.
5. Outbox: "Password changed" email. The second browser is logged out on its next click (system page "Session expired" **[awaiting design, G-008]**).
6. Log in with the new password → 09.

### T-2.23 · Reset link expired, unknown email
1. Send a reset link, set clock +61 minutes, open it. → 15#expired "This link has expired" with Send a new link → 15#request.
2. Send reset link for `nobody@example.com`. → 15#sent, same wording; Outbox empty.

### T-2.24 · Reset for a Google-only account
1. Send reset link for a Google-only account. → 15#sent. Outbox: an email saying they log in with Google, with no reset link.

---

## Diagram 3 · Browse, profile and booking

### T-3.01 · Browse coaches, logged in
- **Covers:** Browse, Card, Browse → Load more; filters; sorts.
- **Pre:** `phase1`; clock Mon 5 Oct 14:10; snapking.
1. Sidebar Browse coaches → `/coaches` 01#results: "19 coaches · Prices in SGD. ≈ means converted from the coach's currency.", 12 cards, Lowest price first (Lumen ≈S$29 … Hanabi S$60), Kairo "from ≈S$43 / session", "+1 game", "Next free Today, 19:00 SGT".
2. Hover Lumen's bio. → after a short pause it opens to full length.
3. Load more coaches → "Loading more coaches…" (01#more) → 19 cards, the button gone.
4. Game Mobile Legends, Max price Up to S$50 → 01#filtered "3 coaches · Mobile Legends · up to S$50" (Pallas, Tidewalker, Kairo with exact price, no "from"), Clear filters.
5. Counter-Strike 2, Up to S$30 → 01#empty "No Counter-Strike 2 coaches up to S$30 · The lowest Counter-Strike 2 price right now is ≈ S$43 a session." Show all prices → filter cleared.
6. Sort Highest rating, Most reviewed → order changes per G-028.
7. Dev: `/dev` → Faults → "Browse fails" → 01#error "We couldn't load coaches", Try again keeps filters. Slow network → 01#loading skeleton.

### T-3.02 · Browse and profile logged out
- **Covers:** Visitor → Browse → Profile; Profile → Book (needs login).
1. Logged out, `/coaches` → 01#guest: top nav with Log in and Sign up, no sidebar. Logo → marketing home.
2. Open Kairo → 02#guest: "You'll log in or sign up after choosing a time." under Book a session.
3. Book a session → 03#guest.

### T-3.03 · Coach profile variants
- **Covers:** Card → Profile.
1. Kairo → `/coaches/kairo.gg` 02#verified: two games each with Choose a time and "Kairo's price is ₱1,850. Your bank converts at checkout."; Voice intro 0:45; Showcase 1 / 5 with arrows and thumbnails; 5 reviews then Show more reviews (5 more each time); Availability Mon 5 to Sun 11 Oct with counts, NEXT FREE Mon 5 Oct · 19:00 SGT, See all times.
2. Vexa → 02#one-game: one game, no Choose a time, S$45 with no ≈ and no "price is" line.
3. nullpoint → 02#new-coach: NEW COACH label, no voice intro, "No reviews yet · nullpoint is new to Harbourly…".
4. A coach with one showcase image: no arrows, position or thumbnails. No images: no Showcase section.
5. `/coaches/nobody` → 02#not-found "We couldn't find that coach". Slow network → 02#loading.
6. Below 1100px the order is About, Showcase, Games, Availability, Reviews.

### T-3.04 · Your own profile
- **Covers:** Own(yes) → NoBook.
1. As Kairo, `/coaches/kairo.gg` → 02#own: "This is your profile · Gamers see a Book a session button here. You can't book yourself." with Edit profile (→ 22, **[awaiting design]**). No Book or Choose a time buttons.
2. Open `/coaches/kairo.gg/book` directly → back to the profile.

### T-3.05 · Preview mode
1. As Kairo, open the preview link (from 22 **[awaiting design]**; for now `/coaches/kairo.gg?preview=1`). → 02#preview banner "Preview of your public profile · This is exactly what gamers see. Buttons don't work in preview." with Back to profile settings. Buttons inert.

### T-3.06 · Book from the header and hold the time
- **Covers:** Own(no) → Game → Slot → LoggedIn(yes) → Phone(yes) → Hold → Summary.
- **Pre:** `phase1`; Mon 5 Oct 14:12; snapking.
1. Kairo's profile → Book a session → `/coaches/kairo.gg/book` 03#available: game choice (Mobile Legends ≈S$43, Call of Duty: Mobile ≈S$49), week 5–11 Oct, "TIMES IN SGT", earliest slot today 19:00 (≥ 2 hours away), Fri 9 Oct "No free times".
2. Choose Mobile Legends, Wed 7 Oct 20:00. → summary "Wed 7 Oct · 20:00–21:00 SGT · 60 min · ≈ S$43 (₱1,850)", "Plus a 6% platform fee, shown at checkout."
3. Next week arrow → weeks up to 4 weeks ahead only.
4. Continue to checkout. → `/checkout/<id>` 04#different-currency, hold 30:00 counting down. Status `pending_payment`. Amounts: Kairo's price ₱1,850.00, Platform fee (6%) ₱111.00, Total ₱1,961.00, "Charged in Philippine pesos. Your bank converts ₱1,961.00 to SGD.", cancellation lines with ₱1,961.00 and ₱925.00, "You'll pay on Xendit's secure page."
5. In another browser as a different gamer, Kairo's Wed 7 Oct 20:00 is no longer offered.

### T-3.07 · Choose a time from a game section
- **Covers:** Own(no, Choose a time) → Slot.
1. Kairo's profile → Call of Duty: Mobile → Choose a time. → 03 with Call of Duty: Mobile already chosen, ≈S$49.

### T-3.08 · Nothing free this week
1. Vexa → Book a session. → 03#none "Vexa has no free times this week · The next free time is Tue 13 Oct · 20:00 SGT." Go to next week → that week. Continue to checkout disabled until a time is chosen ("Choose a time to continue.").

### T-3.09 · Slot just taken
1. Two gamers choose Kairo Wed 7 Oct 20:00. The first presses Continue to checkout. The second presses it after. → second sees 03#taken "That time was just booked · Someone booked Wed 7 Oct · 20:00 SGT just before you. Choose another time." No second hold exists (database constraint).

### T-3.10 · Pick a time logged out, then log in
- **Covers:** LoggedIn(no) → Auth → Slot. Same as T-2.17 / T-2.13; check that no hold exists until Continue to checkout on 03#returning.

### T-3.11 · Phone not verified
- **Covers:** Phone(no) → VerifyPhone → Hold.
1. Dev: `/dev` → Users → snapking → "Remove phone". Choose a time, Continue to checkout. → 03#phone "Verify your phone to book · We've texted a 6-digit code to +65 •••• 4567." Enter the code, Verify and continue. → hold, 04.

### T-3.12 · Checkout in the same currency
1. Vexa, Valorant, Tue 13 Oct 20:00 → 04#same-currency: Vexa's price S$45.00, fee S$2.70, Total S$47.70, no conversion line; "Cancel later, or don't join within 15 minutes of the start, and S$22.50 is refunded."; "You'll pay on Stripe's secure page."

### T-3.13 · Session in under 24 hours
1. Kairo, Mon 5 Oct 21:00 → 04#under-24h: "Cancel up to 1 hour before the start for a full refund of ₱1,961.00. After that, ₱925.00 is refunded." and "This session starts in under 24 hours, so its time can't be moved."

### T-3.14 · Hold nearly expired, then expired on checkout
- **Covers:** Hold expired → Expired → Slot; email to gamer.
1. On 04, set clock +26 minutes. → 04#nearly-expired: "Less than 5 minutes left to pay. After that, the time is released." amber.
2. Clock +31 minutes from the hold, Run due jobs. → 04#expired "This time is no longer held…you haven't been charged." Status `expired`. Outbox: "Payment window expired, slot released" to snapking.
3. Choose another time → 03; the same time is offered again if still free.

### T-3.15 · Choose another time from checkout
- **Covers:** Summary → Slot ("hold released").
1. On 04 press Choose another time. → 03 with the game kept; the hold is released at once (another gamer can book it). Status `expired`, reason "released by the gamer"; no email.

### T-3.16 · Pay and confirm
- **Covers:** Summary → Hosted → Back → Result(Paid) → Confirmed.
1. On 04 press Continue to payment → provider page (dev: `/dev/pay`, Xendit style). Pay.
2. → `/checkout/<id>/return` 05#confirming "Xendit is confirming your payment…" then 05#confirmed "You're booked with Kairo", PAID ₱1,961.00, View session, Back to dashboard, Book another time with Kairo, "What happens next" (Join session opens at 19:50 SGT on Wed 7 Oct…).
3. Status `confirmed`. Outbox: "Payment received" to snapking and to Kairo (Kairo's shows ₱1,850.00 price and ₱1,628.00 payout, in PHT).
4. View session → 06#upcoming. Back to dashboard → 09.

### T-3.17 · Webhook late
- **Covers:** Back (confirming) → Result.
1. On `/dev/pay` choose "Pay, but delay the webhook 2 minutes". → 05#confirming stays, then 05#confirmed once the app checks the provider (G-042), before the webhook arrives. When the webhook arrives, nothing changes and no second email is sent.
2. "Pay, drop the webhook": still confirmed by the return-page check; and if the gamer closes the tab, the reconciliation job confirms it.

### T-3.18 · Payment failed
- **Covers:** Result(Not paid, hold active) → Failed → Summary.
1. On `/dev/pay` press Fail. → 05#failed "Your payment didn't go through · You haven't been charged. Your time with Kairo, Wed 7 Oct · 20:00 SGT, is still held…" with the remaining hold and Try again, Choose another time.
2. Try again → 04#failed "Your payment didn't go through · Still held, so you can try again" → Continue to payment → Pay → 05#confirmed.

### T-3.19 · Hold runs out during payment
- **Covers:** Result(Hold expired) → Expired.
1. Open the provider page, set clock past the hold, Run due jobs, then return. → 05#released "This time is no longer held…we've emailed you about it." Outbox: the expiry email.
2. Paying on the expired page is refused by the provider (its session was expired first).

### T-3.20 · Book another time with this coach
- **Covers:** Confirmed → Slot (same game chosen).
1. From 05#confirmed press Book another time with Kairo. → 03 with Mobile Legends chosen.

### T-3.21 · Late and duplicate payments
- **Covers:** G-017 (pending your decision).
1. `/dev/pay` "Pay after the hold" → automatic full refund; email per G-017.
2. Pay twice (two tabs) → the second payment refunded automatically; one booking.

---

## Diagram 4 · Before the session

All on seed `kairo-wed` as snapking unless stated (Kairo, Mobile Legends, Wed 7 Oct 20:00–21:00, paid ₱1,961.00).

### T-4.01 · Upcoming, more than 24 hours
- **Covers:** Confirmed → Window(yes) → Options.
1. Clock Mon 5 Oct 18:00, `/sessions/<id>` → 06#upcoming: CONFIRMED, "Join opens 10 minutes before the start", Join session disabled "Opens in 49h 50m", screen-share note, "Request a new time until Tue 6 Oct, 20:00 SGT, 24 hours before the session. Cancel for a full refund until Wed 7 Oct, 19:00 SGT.", Request a new time, Cancel booking; payment card ₱1,850.00 / ₱111.00 / Paid ₱1,961.00.

### T-4.02 · Under 24 hours: time locked
- **Covers:** Window(no) → Locked; Locked → CancelWho.
1. Clock Wed 7 Oct 11:00 → 06#locked: "New times closed 24 hours before the session, at Tue 6 Oct, 20:00 SGT…", "You can still cancel: a full refund of ₱1,961.00 until 19:00 SGT, then ₱925.00 back." No Request a new time.
2. Boundary: at Tue 6 Oct 19:59:59 Request a new time shows; at 20:00:00 it's gone.

### T-4.03 · Gamer asks for a new time
- **Covers:** Options → Req; times held; email to other party.
1. Clock Mon 5 Oct 18:00. Request a new time → 06#reschedule-form: Kairo's free times at least 24 h away, Mon shows "Less than 24 hours away", up to 3 ("2 of 3 chosen"), "Kairo has until Wed 7 Oct, 08:00 SGT to reply."
2. Choose Thu 8 Oct 20:00 and Sat 10 Oct 15:00, Send request. → 06#reschedule-waiting "Reschedule requested · Waiting for Kairo to reply", the two times, countdown, Withdraw request. Status stays `confirmed`; 10 shows the amber "Reschedule requested" line.
3. Outbox: "Reschedule requested" to Kairo.
4. Another gamer can't book Kairo at Thu 8 Oct 20:00 or Sat 10 Oct 15:00.
5. A fourth time can't be chosen; Send request is disabled with none chosen.
6. As Kairo, `/coach/sessions/<id>` → 06#coach-request-received "snapking asked to move this session… They're held in your calendar until you reply.", times in PHT.

### T-4.04 · The other person picks a time
- **Covers:** Other → Moved.
1. As Kairo (T-4.03), pick Sat 10 Oct 15:00, Move to this time. → booking starts at the new time; status `confirmed`.
2. As snapking → 06#moved layout (the mockup shows Fri 9 Oct 21:00, picked from Kairo's own request; seed `kairo-wed` + Kairo's request at Tue 6 Oct 09:00 reproduces it exactly): "Moved to Sat 10 Oct · 15:00 SGT", "This session has already been moved once, so it can't be moved again.", the facts show "Moved from Wed 7 Oct · 20:00 SGT". The other offered time is released.
3. Outbox: "Reschedule accepted" to snapking (requester) with the new time, and the new time to Kairo.

### T-4.05 · Coach declines the gamer's request
- **Covers:** Other(Declines) → WhoAsked(Gamer) → Stands.
1. As Kairo press Decline. → snapking sees 06#reschedule-declined "Kairo declined your request", original time stands, "You can still request other times until Tue 6 Oct, 20:00 SGT…". Outbox: "Reschedule declined" to snapking. A new request can be sent.

### T-4.06 · Requester withdraws
- **Covers:** Req → Stands (withdraws).
1. On 06#reschedule-waiting press Withdraw request. → 06#upcoming; offered times bookable again; the one accepted move is still available. Outbox per G-033.

### T-4.07 · Request expires
- **Covers:** Other(No reply in 48 h, or 12 h before start) → Stands.
1. Request sent Mon 5 Oct 18:00; set clock Wed 7 Oct 08:00 (12 h before start comes first), Run due jobs. → 06#reschedule-expired "Your request expired · Kairo didn't reply by 08:00 SGT, so your session stays on today at 20:00 SGT." Outbox: "Reschedule expired" to snapking.
2. A request sent Mon 5 Oct 10:00 for a session on Sat 10 Oct expires Wed 7 Oct 10:00 (48 h).

### T-4.08 · Coach asks; gamer picks
- **Covers:** Req (coach) → Other → Moved.
- **Pre:** `busy`; Mon 5 Oct 14:12.
1. snapking opens Vexa Thu 8 Oct → 06#vexa-request "Vexa asked to move this session", times Wed 14 Oct, Thu 15 Oct, Sat 17 Oct, "Reply by Wed 7 Oct, 10:00 SGT", 43h 48m.
2. Choose Thu 15 Oct, Move to this time. → moved; emails as T-4.04.
3. Coach side of making a request: as Vexa → Request a new time (same form) **[coach states awaiting design, G-007]**.

### T-4.09 · Gamer declines the coach's request and keeps the time
- **Covers:** WhoAsked(Coach) → GamerChoice(Keep) → Stands.
1. On 06#vexa-request press Decline. → 06#reschedule-keep-or-cancel "Keep your original time?" with Keep original time and Cancel booking. Outbox: "Reschedule declined" to Vexa.
2. Keep original time → 06#upcoming (Vexa's facts).

### T-4.10 · Gamer declines and cancels for a full refund
- **Covers:** GamerChoice(Cancel) → FullRefund.
1. As T-4.09, press Cancel booking. → cancelled; refund S$47.70 in full including the fee, even inside the last hour. Outbox: "Booking cancelled" to both.

### T-4.11 · Gamer cancels at least 1 hour before
- **Covers:** CancelWho(Gamer, ≥1 h) → FullRefund.
1. Clock Mon 5 Oct 18:04. Cancel booking → 06#cancel-confirm "Cancel your session with Kairo on Wed 7 Oct?", Kairo's price ₱1,850.00, Platform fee ₱111.00, You get back ₱1,961.00, Keep booking, Cancel booking (amber outline).
2. Keep booking → 06#upcoming. Cancel again → confirm → 06#cancelled "You cancelled this session · Cancelled on Mon 5 Oct, 18:04 SGT…", "₱1,961.00 refunded in full on Mon 5 Oct." Status `cancelled`, refund ₱1,961.00, coach payout 0.
3. Outbox: "Booking cancelled" to snapking (₱1,961.00) and Kairo. The time is bookable again.

### T-4.12 · The 1-hour boundary
1. Clock Wed 7 Oct 19:00:00 → full refund ₱1,961.00. Clock 19:00:01 → late (T-4.13).

### T-4.13 · Gamer cancels inside the last hour
- **Covers:** CancelWho(Gamer, inside last hour) → Split.
1. Clock Wed 7 Oct 19:20 → 06#join is not open yet; Cancel booking → 06#cancel-late "Half of Kairo's price, refunded ₱925.00 · Platform fee, not refundable", "You get back ₱925.00".
2. Confirm. → cancelled; refund ₱925.00; Kairo's payout ₱814.00 (₱925.00 − ₱111.00), released on cancel. Outbox: gamer email (₱925.00 back), Kairo's email (₱814.00).
3. Also from 06#join at 19:52: "You can still cancel, with ₱925.00 refunded." Same result.

### T-4.14 · No cancelling after the start
1. Clock Wed 7 Oct 20:00:01 → Cancel booking is gone for both people (G-005).

### T-4.15 · Coach cancels more than 24 hours before
- **Covers:** CancelWho(Coach, any time) → CoachCancel (no reliability incident).
1. As Kairo, clock Mon 5 Oct 18:00, Cancel booking → confirm "snapking is refunded in full, including the platform fee." → cancelled. Gamer sees 06#coach-cancelled "Kairo cancelled this session…₱1,961.00 refunded in full". Outbox to both. No reliability incident.

### T-4.16 · Coach cancels inside 24 hours
- **Covers:** CoachCancel; "recorded against coach"; New Coach reset.
1. As Kairo, clock Wed 7 Oct 11:00 → 06#coach-cancel "…Because it's less than 24 hours before the start, it counts like a no-show on your coach account." Confirm → cancelled; full refund; reliability incident recorded.
2. Repeat with nullpoint (New Coach, seeded with 3 completed sessions): progress resets to 0; Outbox: "Your New Coach progress was reset" with the reason.

### T-4.17 · Cancel while a request is open
1. With T-4.03's request open, snapking cancels. → request cancelled too, times released, one cancellation email each (no separate reschedule email).

### T-4.18 · Reminder emails
- **Covers:** Confirmed → Remind → Join.
1. Clock Tue 6 Oct 20:00, Run due jobs → "Session reminder 24 hours before" to both. Clock Wed 7 Oct 19:00 → "1 hour before" with the session link. Running jobs again sends nothing new.

### T-4.19 · Coach reliability flag
1. Seed three coach cancellations by Kairo within 30 days (dev tool). → Kairo appears in the team's flags list in Supabase (`ops.review_flags`). Nothing visible to gamers. Thresholds per G-023.

---

## Diagram 5 · The session

Seed `kairo-wed`. Two browsers: snapking and Kairo.

### T-5.01 · Join opens 10 minutes before
- **Covers:** Join.
1. Clock Wed 7 Oct 19:49 → Join session disabled with "Opens in 1m". 19:50 → enabled. 19:52 → 06#join "Your session starts in 8 minutes · Join now and chat while you wait. Kairo hasn't joined yet." Join session → `/sessions/<id>/live`.

### T-5.02 · Waiting, then live
- **Covers:** Waiting(no) → Room → Waiting(yes) → Live.
1. snapking joins at 19:53 → 08#waiting "Waiting for Kairo · The session starts at 20:00 SGT. You can chat while you wait.", chat "You joined · 19:53". Status `in_session`. Join record stored.
2. Send a chat message. Kairo joins at 19:58 → 08#live for both: two tiles, chat "Kairo joined · 19:58", session bar "12:34 / 60:00" style clock, "Ends 21:00 SGT".

### T-5.03 · Coach waiting for an absent gamer
1. Kairo joins first; clock 20:02 → 08#coach-waiting "snapking hasn't joined · If snapking doesn't join, you can report it after the session. You'd be paid half your price." No report button.

### T-5.04 · Gamer reports a coach no-show
- **Covers:** Room → NoShow.
1. snapking waiting, clock 20:14 → no report button. 20:15 → 08#no-show "Kairo hasn't joined… You can keep waiting until 21:00, or report a no-show." with Report a no-show.
2. Report a no-show → 07#gamer-noshow, reason fixed "Coach didn't show up". Keep waiting → back to 08 (G-030).
3. Send → submitted; the call closes for both; status `disputed` (G-005). Continues in T-7.08.

### T-5.05 · Nobody joins
- **Covers:** Room → Ended (nobody joins).
1. Nobody joins; clock 21:00, Run due jobs → status `pending_confirmation` (G-005); release due Sat 10 Oct 21:00.

### T-5.06 · Camera and screen share
1. Start camera → 08#camera "Your camera" tile, Stop camera. Cameras start off.
2. Kairo shares a screen (computer) → 08#share: the screen takes the stage, tiles shrink to a strip; snapking's button reads "Kairo is sharing", disabled.
3. On a phone (390 wide) the share button is replaced by "To share your screen, join from a computer"; the phone can watch Kairo's screen.

### T-5.07 · Reminder banners
- **Covers:** Live → Banners.
1. Clock 20:50 → 08#banner-10 "Session ends in 10 min, at 21:00 SGT" in the session bar (phone: strip between stage and chat). 20:55 → 08#banner-5. 20:59 → 08#banner-1 "Session ends in 1 minute". Nothing covers the stage.

### T-5.08 · Leave and rejoin
- **Covers:** Live → Rejoin → Live.
1. snapking presses Leave at 20:23 → 06#in-session "Your session is on until 21:00 SGT · You left the call at 20:23…", Join session rejoins → 08#live. Leave and rejoin are recorded.

### T-5.09 · Connection drops
1. Dev: cut snapking's network → 08#reconnecting (stage dims, controls disabled). Restore → live.
2. Cut Kairo's → snapking sees 08#other-dropped "Kairo lost connection · Kairo can rejoin until 21:00 SGT."

### T-5.10 · Microphone blocked
1. Block the microphone in the browser, join → 08#blocked "Your browser blocked the microphone…You can still listen and chat." Try again after allowing → live.

### T-5.11 · End early by agreement
- **Covers:** EndHow(End session) → Ask → Ended(End now).
1. snapking presses End session at 20:42 → 08#end-confirm "End the session now? Kairo will be asked to agree." Keep going → live. End session → 08#end-sent "Waiting for Kairo to agree to end" with Withdraw.
2. Kairo sees 08#end-received "Kairo wants…" (snapking's name) with End now and Keep going; the prompt stays until answered.
3. End now → snapking 08#ended "The session has ended…Kairo is paid automatically on Sat 10 Oct, 20:42 SGT · 72h 00m" (G-056), Confirm session, Report a problem, View session; Kairo 08#coach-ended "…You're paid ₱1,628.00 when snapking confirms, or automatically after 72 hours." Status `pending_confirmation`.

### T-5.12 · Keep going, or withdraw
- **Covers:** Ask → Live.
1. Kairo presses Keep going → both live. snapking presses Withdraw on end-sent → live, Kairo's prompt disappears.

### T-5.13 · Scheduled end
- **Covers:** EndHow(Scheduled end time) → Ended.
1. Clock 21:00 → both see the ended screens; the call closes; status `pending_confirmation`. Outbox: "Session ended, please confirm" to snapking with the 72-hour deadline.

---

## Diagram 6 · After the session

### T-6.01 · Pending confirmation
- **Covers:** Ended → Emails; GamerAct.
- **Pre:** `kairo-wed` advanced to ended (dev: "End session now"); clock Wed 7 Oct 21:20.
1. snapking → 06#pending "Did the session go ahead?", "Kairo is paid automatically on Sat 10 Oct, 21:00 SGT · 71h 40m", Confirm session, Report a problem, collapsed Session chat (read-only, message count).
2. Kairo → 06#coach-pending "Waiting for snapking to confirm · You're paid ₱1,628.00 when snapking confirms…" with Report a problem.

### T-6.02 · Under 24 hours left
1. Clock Fri 9 Oct 21:00, Run due jobs → Outbox "24 hours left to confirm". Clock Fri 9 Oct 22:00 → 06#pending-soon (amber) "Less than a day left…".

### T-6.03 · Gamer confirms
- **Covers:** GamerAct(confirms) → Done.
1. Confirm session → 06#confirm-step "Confirm your session with Kairo went ahead? This releases your payment to Kairo. After this you can only report payment problems, for up to 30 days." Not yet → back. Confirm session → 06#completed-review.
2. Status `completed`. Transfer to Kairo ₱1,628.00 (commission ₱222.00). Outbox: "Session confirmed" to both, "Payment released" to Kairo with ₱1,850.00 − ₱222.00 = ₱1,628.00.
3. Kairo → 06#coach-completed "You've been paid ₱1,628.00".

### T-6.04 · Auto-release after 72 hours
- **Covers:** GamerAct(no action 72 h) → Done.
1. Clock Sat 10 Oct 21:00, Run due jobs → `completed` (auto-confirmed), same transfer and emails ("auto-confirmed" wording). Running jobs again changes nothing.

### T-6.05 · Leave a review
- **Covers:** Done → Review → Shown.
1. On 06#completed-review choose stars (5 stars input, keyboard works), write text (counter "133 / 500"; 501 characters refused), Post review → 06#review-posted. "You can review until Fri 6 Nov."
2. Kairo's profile shows the review first with "snapking", Mobile Legends · Oct 2026; the rating and count update.
3. No second review for the same booking; no editing.

### T-6.06 · Review window closes
1. Seed `busy`, clock Mon 5 Oct 14:12 → 06#ghostline-review "You can review until Tue 27 Oct." Clock Wed 28 Oct → the review form is gone.

### T-6.07 · Gamer reports a problem → dispute
- **Covers:** GamerAct(gamer reports) → Dispute. Continues in T-7.01.

### T-6.08 · Coach reports a problem → dispute
- **Covers:** GamerAct(coach reports) → Dispute. Continues in T-7.07.

### T-6.09 · Payment problem later
- **Covers:** Done → Later. Continues in T-7.10.

### T-6.10 · Session chat after the session
1. 06 pending and completed states: "Session chat" collapsed; opening it shows the call's messages read-only, for both people.

---

## Diagram 7 · Disputes

### T-7.01 · Gamer reports after the session
- **Covers:** Start → When(after the session) → WindowReasons → Form → Open → Notify.
- **Pre:** `kairo-wed` ended; clock Wed 7 Oct 21:41.
1. 06#pending → Report a problem → `/sessions/<id>/report` 07#gamer-after: the 7 gamer reasons, description (required, 1,000), evidence (optional, up to 5), note about the chat, Send report.
2. Choose "Technical problems stopped the session", describe, attach two PNGs, Send report → 07#submitted "We've got your report" with View session, Back to dashboard.
3. Status `disputed`; dispute Open; auto-release paused (Sat 10 Oct passes with nothing released). Outbox: "Dispute filed" receipt to snapking; notice to Kairo inviting a response.
4. 06#disputed-open: report, dashed slot "No response from Kairo yet · Kairo can send one response, with evidence, until Fri 9 Oct, 21:41 SGT…", "47h 51m left".

### T-7.02 · Validation and upload errors
1. Send with nothing → 07#validation "Two things to fix before sending".
2. Add `share-freeze.mov` and a 14.2 MB PNG → 07#upload-error with both messages; a sixth file refused.

### T-7.03 · Coach responds
- **Covers:** Notify (other person responds) → Review.
1. As Kairo → 06#coach-dispute "snapking reported a problem", Respond → 07#respond, write, attach, Send response → 07#response-sent.
2. Dispute → Under review (G-019). snapking sees 06#disputed-review with Kairo's response in the quote box "Sent Thu 8 Oct, 09:12 SGT". Outbox: "Response received" to snapking (G-033).
3. A second response is refused.

### T-7.04 · No response in 48 hours
1. Clock Fri 9 Oct 21:41, Run due jobs → Under review (G-019); the slot reads that the window closed.

### T-7.05 · Team refunds the gamer
- **Covers:** Review → Outcome(Refund) → Refunded → Email.
1. Team runs `ops.resolve_dispute(<dispute>, 'refund', 'The screen share failed for most of the session, so it couldn't go ahead as booked.')` in Supabase.
2. Status `refunded`; refund ₱1,961.00. snapking 06#resolved-refunded "You've been refunded in full: ₱1,961.00" with the team note. Outbox: "Dispute outcome" to both.
3. For a New Coach (nullpoint), progress resets; reset email.

### T-7.06 · Team releases to the coach
- **Covers:** Outcome(Release) → Paid → Email.
1. `ops.resolve_dispute(…, 'release', …)` → status `completed`; transfer ₱1,628.00; 06#resolved-paid with "You can still leave a review for Kairo until Wed 11 Nov." Outbox to both. Counts towards New Coach progress.

### T-7.07 · Coach reports a gamer no-show; upheld
- **Covers:** When(after, coach) → Form → … → Outcome(Gamer no-show upheld) → Split.
1. Nobody but Kairo joined; after 21:00 Kairo → 06#coach-pending → Report a problem → 07#coach-after, "Gamer didn't show up", send (G-031 copy).
2. snapking sees the report and responds **[awaiting design, G-006]**.
3. `ops.resolve_dispute(…, 'split', …)` → status `split`; refund ₱925.00 to snapking; Kairo paid ₱814.00. Both see the split outcome on 06 **[awaiting design, G-007]**. Outbox to both. Doesn't count towards or reset New Coach progress.

### T-7.08 · Coach no-show, no response in 24 hours
- **Covers:** NoShowReason → Form → Open → Notify(coach no-show, no response 24 h) → Refunded.
1. After T-5.04, clock +24 h, Run due jobs → status `refunded`; ₱1,961.00 refunded automatically. Outbox: outcome to both. Reliability incident recorded; New Coach reset if applicable.

### T-7.09 · Coach no-show, coach responds
1. After T-5.04, Kairo responds within 24 h → Under review; team decides as T-7.05 or T-7.06.

### T-7.10 · Gamer payment problem
- **Covers:** When(within 30 days after completion) → PayReasons → PayForm → PayOpen.
1. After T-6.03, clock Thu 15 Oct 10:04, 06 → Report a problem → 07#gamer-payment: the 4 payment reasons, "PAID ₱1,961.00 · Mon 5 Oct", "This is between you and Harbourly. Kairo isn't involved."
2. "Charged twice", send → 06#payment-problem. Kairo isn't emailed. Booking stays `completed`.
3. Team resolves with a note (G-020) → outcome email to snapking only.

### T-7.11 · Coach payment problem
1. As Kairo after release → 07#coach-payment (released ₱1,628.00, G-029), "Payout not received", send. snapking isn't involved.

### T-7.12 · One dispute at a time, no withdrawing
1. While T-7.01's dispute is open, Kairo's Report a problem isn't offered (he responds instead); snapking can't file a second one; no Withdraw.

### T-7.13 · From the dashboard (Mirae)
1. `busy`, Mon 5 Oct 14:12: 09 → Mirae's Report a problem → 07#mirae-after → Back to session → 06#mirae-pending.

### T-7.14 · The 30-day payment window closes
1. Clock 30 days after release + 1 minute → Report a problem gone from 06.

---

## Diagram 8 · Coach journey

Pages 17–21 are **[awaiting design, G-057]**; these scenarios test data, rules and emails now and the screens once designed.

### T-8.01 · Become a coach
- **Covers:** Become → Row → Step1.
1. snapking (Singapore) presses "Become a coach" → coach record `draft`; sidebar shows the Coach block (Coach dashboard, Coach sessions) and drops "Become a coach"; 17.
2. A gamer in Indonesia → G-055.

### T-8.02 · Draft saved
- **Covers:** Step2 → Draft → Step2.
1. Fill part of step 2 (games and rank, proof images ≤ 5, optional profile link, "what made you start coaching"), leave, come back → still filled; 19 shows "continue your application".

### T-8.03 · Submit
- **Covers:** Step2 → Submitted. Status `submitted`; Outbox "Application submitted"; 19 "under review".

### T-8.04 · First and second rejection
- **Covers:** Decision(Rejected) → Rejected → Attempts(first or second) → Fix → Submitted.
1. Team: `ops.reject_application(coach, 'proof_unclear', 'note')` → `rejected`; Outbox with reason; 18 shows the reason, highlights the section, inputs kept; Resubmit disabled until that section changes; resubmit at once.

### T-8.05 · Third rejection: 14-day wait
- **Covers:** Attempts(third) → Wait → Submitted.
1. Third rejection → "You can reapply from <date+14>", email with the date; resubmit refused until then (dev clock).

### T-8.06 · Not eligible
- **Covers:** Decision(Not eligible) → Closed. `not_eligible`; plain message; no reapply.

### T-8.07 · Approved; payout setup
- **Covers:** Decision(Approved) → Gates → Payout → PayoutFail → Payout; PhoneGate.
1. `ops.approve_application` → `approved`; email; 19 lists payout, phone (done), profile.
2. Payout setup → Stripe (SG/MY) or Xendit (PH) test onboarding; return → in progress / verified. Simulate "couldn't verify" → "Your payout account couldn't be verified" with retry and contact support; retry → verified. Country locks.

### T-8.08 · Profile setup
- **Covers:** Gates → Setup → Setup (leave and come back).
1. Bio ≤ 500, avatar, banner, languages, weekly availability in own zone, price per game ≥ floor (S$10, RM 35, ₱430: "below the floor" error), up to 3 credential lines, optional showcase. Photo uploads show Checking… then live or refused with the reason.

### T-8.09 · All four done: live
- **Covers:** AllDone(yes) → Live. Status `live` (New Coach); Outbox "You're live and bookable"; appears on 01 with NEW COACH.

### T-8.10 · New Coach label drops
- **Covers:** NewCoach → Dropped. Five completed sessions (dev tool), no upheld dispute → label gone on 01/02; email.

### T-8.11 · New Coach progress reset
- **Covers:** NewCoach → Reset → NewCoach. Upheld gamer dispute, coach no-show, or coach cancel inside 24 h → progress 0; email with the reason.

### T-8.12 · What doesn't count
1. Gamer no-show (split) and cancellations neither count towards the 5 nor reset.

---

## Diagram 9 · Running a coach profile

**[awaiting design: 22, 23, 19, 20, G-057]**. Seed `coach-live-new` or Kairo.

| ID | Covers | Steps and expected result |
|---|---|---|
| T-9.01 | CDash → Settings → Bio | Edit bio, avatar, banner, languages; photos checked; old photo stays until the new one passes |
| T-9.02 | Settings → Avail | Edit weekly availability in own zone; existing bookings, holds and offers unchanged (G-025) |
| T-9.03 | Settings → Rates | Change a price; below the floor refused; booked sessions keep their price; new holds use the new price |
| T-9.04 | Settings → Rank | Update rank with a screenshot; old rank shown on 01/02 until `ops.approve_rank_update`; email approved or declined |
| T-9.05 | Settings → AddGame | Add a game with proof; listing under review, not bookable; approved → bookable; email |
| T-9.06 | Settings → Voice | Record voice intro; pending; approved → shows on 02; declined email (G-038) |
| T-9.07 | Settings → Showcase | Add up to 5 images with captions; Checking…; pass live at once, fail refused with reason; replace keeps old live until new passes; reorder |
| T-9.08 | Settings → Portfolio | Submit; under review; shown on profile, or not with the reason; email |
| T-9.09 | Settings → Preview | Preview my public profile → 02#preview |
| T-9.10 | CDash → PayoutSet | Payout status and link to the provider dashboard |
| T-9.11 | CDash → CSessions → Detail | Coach sessions list (gamer, date and time in PHT, status, reschedule line) → 06 coach view; never shows awaiting-payment or expired bookings |
| T-9.12 | CDash → Disputes → Detail | Open disputes involving the coach → 06 coach dispute |

---

## Diagram 10 · Account and system pages

**[24 and 25 awaiting design; 25 plain version per G-008]**.

| ID | Covers | Steps and expected result |
|---|---|---|
| T-10.01 | Account → Profile | Change name, username (same rules as 13), avatar (checked) |
| T-10.02 | Account → EmailChange | New email gets a verify link; old email gets "Email changed"; change applies after verifying |
| T-10.03 | Account → Password | Change password (current required; breached refused); "Password changed" email; Google-only accounts can set one |
| T-10.04 | Account → PhoneChange | New number with code (same rules as 13) |
| T-10.05 | Account → Locale | Change country (gamer list), time zone, currency; a coach's country locked after payout setup |
| T-10.06 | Delete → Blocked | With an upcoming session or open dispute: "Not yet: finish or resolve them first" |
| T-10.07 | Delete → Confirm → Gone | Nothing open: confirm step with warning → deletion requested; email (G-033, G-036) |
| T-10.08 | System → NotFound | Any unknown address → 404 |
| T-10.09 | System → Error | Dev fault "server error" → Something went wrong |
| T-10.10 | System → SessionExp | After a password reset elsewhere (T-2.22) → Session expired: sign in again → after log in, back to the page |
| T-10.11 | System → Protected | Logged out, open `/sessions` → Sign in to continue → log in → `/sessions` |

---

## Diagram 11 · Booking status lifecycle

Every allowed transition is reached by a scenario above; every forbidden one is an automated unit test (`T-11.F`).

| ID | Transition | Who | Scenario |
|---|---|---|---|
| T-11.01 | [*] → pending_payment | gamer (Continue to checkout) | T-3.06 |
| T-11.02 | pending_payment → confirmed | provider (webhook or return check) | T-3.16, T-3.17 |
| T-11.03 | pending_payment → expired | job (30 min) or gamer (Choose another time) | T-3.14, T-3.15, T-3.19 |
| T-11.04 | confirmed → confirmed (reschedule accepted) | other party | T-4.04, T-4.08 |
| T-11.05 | confirmed → cancelled (gamer ≥1 h, full) | gamer | T-4.11, T-4.12 |
| T-11.06 | confirmed → cancelled (gamer inside last hour, 50/50) | gamer | T-4.13 |
| T-11.07 | confirmed → cancelled (coach) | coach | T-4.15, T-4.16 |
| T-11.08 | confirmed → cancelled (gamer after declining coach's request, full) | gamer | T-4.10 |
| T-11.09 | confirmed → in_session | first join | T-5.02 |
| T-11.10 | confirmed → disputed (coach no-show, nobody joined) | gamer | T-5.04 (variant) |
| T-11.11 | in_session → pending_confirmation | end (scheduled or agreed) | T-5.11, T-5.13 |
| T-11.12 | pending_confirmation → completed | gamer confirms / job 72 h | T-6.03, T-6.04 |
| T-11.13 | pending_confirmation → disputed | either party | T-7.01, T-7.07 |
| T-11.14 | disputed → refunded | team / job (coach no-show 24 h) | T-7.05, T-7.08 |
| T-11.15 | disputed → completed | team | T-7.06 |
| T-11.16 | disputed → split | team | T-7.07 |
| T-11.17 | confirmed → pending_confirmation (nobody joined) | job | T-5.05 |
| T-11.18 | in_session → disputed (coach no-show from the waiting room) | gamer | T-5.04 |
| T-11.19 | in_session → cancelled (before the start) | gamer, coach | T-4.13 step 3 |
| T-11.F | Every other pair, every wrong actor, every client-side status write | — | Unit and RLS tests: rejected, nothing written |

## Diagram 12 · Coach status lifecycle

| ID | Transition | Who | Scenario |
|---|---|---|---|
| T-12.01 | [*] → draft | person (Become a coach / sign-up as coach) | T-8.01, T-2.12 |
| T-12.02 | draft → submitted | coach | T-8.03 |
| T-12.03 | submitted → rejected | team | T-8.04 |
| T-12.04 | rejected → submitted | coach (after changes; wait after the 3rd) | T-8.04, T-8.05 |
| T-12.05 | submitted → not_eligible | team | T-8.06 |
| T-12.06 | submitted → approved | team | T-8.07 |
| T-12.07 | approved → live (new_coach) | system, when all four gates are done | T-8.09 |
| T-12.08 | new_coach → new_coach (reset) | system | T-8.11 |
| T-12.09 | new_coach → established | system | T-8.10 |
| T-12.10 | live → suspended → live | team | Team runs `ops.suspend_coach` / `ops.lift_suspension`; hidden from browse while suspended; emails (G-022) |
| T-12.11 | live → banned | team | `ops.ban`; whole account suspended permanently (G-022) |
| T-12.F | Every other pair and actor | — | Unit and RLS tests |

## Diagram 13 · Navigation and dual-role routing

### T-13.01 · Logo and top bar
1. Logged out: logo → marketing home (harbourly.gg); Log in and Sign up buttons. Logged in: logo → `/dashboard`; avatar and name → `/account`; Sign out signs out.
2. On 11, 14, 15 the logo is on the brand panel (or above the form below 1000px) → marketing home. On 12, 13, 16 the gate nav: logo not a link, Sign out.

### T-13.02 · Sidebar and switcher
1. snapking (no coach record): GAMER block (Dashboard, Browse coaches, My sessions) and "Become a coach". Below 1000px the burger opens the sheet with the account row first.
2. Kairo: GAMER block and COACH block (Coach dashboard, Coach sessions); the block you're in has the green label; switching is one click.
3. Kairo's `/sessions` lists only bookings Kairo made as a gamer; `/coach/sessions` only Kairo's coaching bookings. Opening a coaching booking at `/sessions/<id>` redirects to `/coach/sessions/<id>`, and the reverse.

### T-13.03 · Gamer dashboard, busy
- **Pre:** `busy`; Mon 5 Oct 14:12; snapking.
1. `/dashboard` → 09#busy: banner "MONDAY, 5 OCTOBER · Good afternoon, snapking" with Browse coaches; To do (accent line) with 3 items in deadline order: Vexa awaiting payment (S$47.70, 24:12, Continue to payment primary, Choose another time), Mirae pending confirmation (28h 48m), Vexa reschedule (43h 48m, View session); "1 more to do · View all". Coming up: Kairo Tue 6 Oct block with Join session "Opens in 29h 38m", then Kairo Wed 7 Oct row. Problems you've reported: nullpoint, dashed slot, 28h 18m. Recent sessions: Kairo Fri 25 Sep EXPIRED, All sessions.
2. At 1440×900 the page doesn't scroll; the columns scroll separately. At 1280×720 and on a phone, one page scroll.
3. Each card and row opens its own booking (06 kairo-tue, upcoming, vexa-request, nullpoint-open, expired; 04 for Continue to payment; 03 for Choose another time; 07 mirae-after).

### T-13.04 · To do page
1. View all → `/dashboard/to-do` 09#todo-all: "← Dashboard", h1 "To do", all 4 items including Ghostline "How was your session with Ghostline?" Leave a review "You can review until Tue 27 Oct." Sidebar keeps Dashboard highlighted. ← Dashboard → 09.

### T-13.05 · Join open moves to the top
1. Clock Tue 6 Oct 19:50 → Kairo Tue 6 Oct is the first To do item with Join session.

### T-13.06 · Nothing to do, brand new, loading, error
1. `quiet`, Thu 24 Sep 13:05 → 09#quiet "Nothing needs you right now", "No sessions coming up", Recent shows the expired booking.
2. `new`, Thu 24 Sep 11:00 → 09#new.
3. Dev faults → 09#loading, 09#error "We couldn't load your dashboard".

### T-13.07 · My sessions
1. `busy` → `/sessions` 10#list: Upcoming 4 (Kairo Tue, Kairo Wed, Vexa Thu with "Reschedule requested", Vexa Tue 13 AWAITING PAYMENT), Past 4 (Mirae PENDING CONFIRMATION, nullpoint DISPUTED, Ghostline COMPLETED, Kairo EXPIRED). Rows open 06. No amounts.
2. More than 20 past → Load more.
3. `new` → 10#empty "No sessions yet". Faults → 10#loading, 10#error.

### T-13.08 · Coach never sees a gamer's unpaid or expired bookings
1. Kairo's coach sessions and coach dashboard never list snapking's Fri 25 Sep expired booking or any `pending_payment` booking; `/coach/sessions/<that id>` → 404.

---

## Coverage matrix

### Flow nodes and edges

Edges are written `From → To`. Every node appears in at least one edge.

**Diagram 2:** Start→Method T-2.01 · Method→Email T-2.01, T-2.02 · Email→Verify T-2.01, T-2.06 · Verify→Login (other device) T-2.04 · Verify→Details T-2.01, T-2.03 · Method→Details (Google) T-2.07 · Details→Fields T-2.01, T-2.08 · Fields→Age T-2.01, T-2.09 · Age(no)→Under18 T-2.09 · Age(yes)→Country T-2.01 · Country(no)→NotAvail T-2.10 · Country(yes)→SBooking T-2.01 · SBooking(yes)→BackToSlot T-2.13 · SBooking(no)→Role T-2.01 · Role(no)→GDash T-2.01 · Role(yes)→CoachCountry T-2.11, T-2.12 · CoachCountry(no)→NoCoach T-2.11 · NoCoach→GDash T-2.11 · CoachCountry(yes)→AppIntro T-2.12 · Login→LMethod T-2.14 · LMethod→Creds T-2.14 · LMethod→Google T-2.18 · Creds→Creds (wrong, too many) T-2.15, T-2.16 · Creds→Forgot T-2.22 · Forgot→ResetEmail T-2.22, T-2.23, T-2.24 · ResetEmail→Reset T-2.22 · Reset→Login T-2.22 · Creds→EmailOK T-2.14 · EmailOK(no)→Verify T-2.19 · EmailOK(yes)→Checks T-2.14 · Google→Checks T-2.18 · Checks(no)→Details T-2.04, T-2.20 · Checks(yes)→Terms T-2.14 · Terms(no)→AcceptTerms T-2.21 · AcceptTerms→Return T-2.21 · Terms(yes)→Return T-2.14 · Return(yes)→BackToSlot T-2.17, T-2.21 · Return(no)→GDash T-2.14.

**Diagram 3:** Browse→Card T-3.01 · Browse→Browse (Load more) T-3.01 · Card→Profile T-3.03 · Profile→Own T-3.04, T-3.06 · Own(yes)→NoBook T-3.04 · Own(no)→Game T-3.06 · Game→Slot T-3.06 · Own(no, Choose a time)→Slot T-3.07 · Slot→LoggedIn T-3.06, T-3.08 · LoggedIn(no)→Auth T-3.02, T-3.10 · Auth→Slot T-2.13, T-2.17 · LoggedIn(yes)→Phone T-3.06 · Phone(no)→VerifyPhone T-3.11 · VerifyPhone→Hold T-3.11 · Phone(yes)→Hold T-3.06, T-3.09 · Hold→Summary T-3.06, T-3.12, T-3.13 · Summary→Hosted T-3.16 · Summary→Slot (Choose another time) T-3.15 · Hosted→Back T-3.16, T-3.17 · Back→Result T-3.16 · Result(Paid)→Confirmed T-3.16, T-3.17 · Confirmed→Slot T-3.20 · Result(Not paid)→Failed T-3.18 · Failed→Summary T-3.18 · Result(Hold expired)→Expired T-3.14, T-3.19 · Expired→Slot T-3.14. Diagram 1's map edges are covered by diagrams 2–13 (Visitor→Browse T-3.02, Auth→GDash T-2.01, GDash→Become T-8.01, Apply→Setup T-8.07, CDash→Account T-10.01).

**Diagram 4:** Confirmed→Window T-4.01, T-4.02 · Window(yes)→Options T-4.01 · Window(no)→Locked T-4.02 · Options→Req T-4.03, T-4.08 · Req→Stands (withdraws) T-4.06 · Req→Other T-4.03 · Other(picks)→Moved T-4.04, T-4.08 · Other(declines)→WhoAsked T-4.05, T-4.09 · WhoAsked(Gamer)→Stands T-4.05 · WhoAsked(Coach)→GamerChoice T-4.09 · GamerChoice(Keep)→Stands T-4.09 · GamerChoice(Cancel)→FullRefund T-4.10 · Other(no reply)→Stands T-4.07 · Options→CancelWho T-4.11 · Locked→CancelWho T-4.02, T-4.13 · CancelWho(gamer ≥1 h)→FullRefund T-4.11, T-4.12 · CancelWho(gamer last hour)→Split T-4.13 · CancelWho(coach)→CoachCancel T-4.15, T-4.16 · Confirmed→Remind T-4.18 · Remind→Join T-4.18, T-5.01 · Locked→Join T-5.01. Note line (one open request; cancel cancels request; coach late cancel counts) T-4.17, T-4.16.

**Diagram 5:** Join→Waiting T-5.01, T-5.02 · Waiting(no)→Room T-5.02, T-5.03 · Room→Waiting T-5.02 · Room→NoShow T-5.04 · Room→Ended (nobody joins) T-5.05 · Waiting(yes)→Live T-5.02 · Live→Banners T-5.07 · Live→Rejoin T-5.08, T-5.09 · Rejoin→Live T-5.08 · Live→EndHow T-5.11, T-5.13 · EndHow(scheduled)→Ended T-5.13 · EndHow(End session)→Ask T-5.11 · Ask(Keep going, withdraw)→Live T-5.12 · Ask(End now)→Ended T-5.11. Live features (camera, share, phone, blocked mic): T-5.06, T-5.10.

**Diagram 6:** Ended→Emails T-5.13, T-6.02 · Ended→GamerAct T-6.01 · GamerAct(confirms)→Done T-6.03 · GamerAct(72 h)→Done T-6.04 · GamerAct(gamer reports)→Dispute T-6.07, T-7.01 · GamerAct(coach reports)→Dispute T-6.08, T-7.07 · Done→Review T-6.05, T-6.06 · Review→Shown T-6.05 · Done→Later T-6.09, T-7.10. Chat read-only: T-6.10.

**Diagram 7:** Start→When T-7.01, T-5.04 · When(during)→NoShowReason T-5.04 · When(after)→WindowReasons T-7.01, T-7.07 · When(after completion)→PayReasons T-7.10, T-7.11 · NoShowReason→Form T-5.04 · WindowReasons→Form T-7.01, T-7.02 · PayReasons→PayForm T-7.10 · PayForm→PayOpen T-7.10, T-7.11 · Form→Open T-7.01 · Open→Notify T-7.01 · Notify(coach no-show, 24 h)→Refunded T-7.08 · Notify→Review T-7.03, T-7.04, T-7.09 · Review→Outcome T-7.05 · Outcome(Refund)→Refunded T-7.05 · Outcome(Release)→Paid T-7.06 · Outcome(Split)→Split T-7.07 · Refunded/Paid/Split→Email T-7.05, T-7.06, T-7.07. Note line rules: T-7.12, T-7.14.

**Diagram 8:** Become→Row T-8.01 · Row→Step1 T-8.01 · Step1→Step2 T-8.02 · Step2→Draft T-8.02 · Draft→Step2 T-8.02 · Step2→Submitted T-8.03 · Submitted→Decision T-8.04 · Decision(Rejected)→Rejected T-8.04 · Rejected→Attempts T-8.04, T-8.05 · Attempts(1st/2nd)→Fix T-8.04 · Attempts(3rd)→Wait T-8.05 · Fix→Submitted T-8.04 · Wait→Submitted T-8.05 · Decision(Not eligible)→Closed T-8.06 · Decision(Approved)→Gates T-8.07 · Gates→Payout T-8.07 · Payout(fail)→PayoutFail T-8.07 · PayoutFail→Payout T-8.07 · Gates→PhoneGate T-8.07 · Gates→Setup T-8.08 · Setup→Setup T-8.08 · Payout/PhoneGate/Setup→AllDone T-8.09 · AllDone→Live T-8.09 · Live→NewCoach T-8.09 · NewCoach→Dropped T-8.10 · NewCoach→Reset T-8.11 · Reset→NewCoach T-8.11.

**Diagram 9:** CDash→Settings T-9.01 · Settings→Bio T-9.01 · →Avail T-9.02 · →Rates T-9.03 · →Rank T-9.04 · →AddGame T-9.05 · →Voice T-9.06 · →Showcase T-9.07 · →Portfolio T-9.08 · →Preview T-9.09, T-3.05 · CDash→PayoutSet T-9.10 · CDash→CSessions T-9.11 · CSessions→Detail T-9.11 · CDash→Disputes T-9.12 · Disputes→Detail T-9.12.

**Diagram 10:** Account→Profile T-10.01 · →EmailChange T-10.02 · →Password T-10.03 · →PhoneChange T-10.04 · →Locale T-10.05 · →Delete T-10.06 · Delete(open)→Blocked T-10.06 · Delete(nothing open)→Confirm T-10.07 · Confirm→Gone T-10.07 · System→NotFound T-10.08 · →Error T-10.09 · →SessionExp T-10.10 · →Protected T-10.11.

**Diagram 11:** see T-11.01 to T-11.F. **Diagram 12:** see T-12.01 to T-12.F.

**Diagram 13:** Top→GDash (logo, logged in) T-13.01 · Top→Home (logo, logged out) T-13.01 · GDash, GBrowse, GSess, GBecome T-13.02 · GDash→GTodo T-13.04 · GTodo→GDash T-13.04 · GDash↔CDash (switcher) T-13.02 · CDash, CSess T-13.02, T-9.11 · "data never mix" T-13.02, T-13.08.

### Mockup states

| Page | State → scenario |
|---|---|
| 01 | results T-3.01 · guest T-3.02 · filtered T-3.01 · empty T-3.01 · loading T-3.01 · more T-3.01 · error T-3.01 |
| 02 | verified T-3.03 · one-game T-3.03 · new-coach T-3.03 · guest T-3.02 · own T-3.04 · preview T-3.05 · loading T-3.03 · not-found T-3.03 |
| 03 | available T-3.06 · guest T-2.13, T-3.02 · none T-3.08 · taken T-3.09 · returning T-2.17 · phone T-3.11 |
| 04 | different-currency T-3.06 · same-currency T-3.12 · under-24h T-3.13 · nearly-expired T-3.14 · expired T-3.14 · failed T-3.18 |
| 05 | confirming T-3.16, T-3.17 · confirmed T-3.16 · failed T-3.18 · released T-3.19 |
| 06 gamer | upcoming T-4.01 · cancel-confirm T-4.11 · cancel-late T-4.13 · cancelled T-4.11 · coach-cancelled T-4.15 · locked T-4.02 · reschedule-form T-4.03 · reschedule-waiting T-4.03 · reschedule-received T-4.08 (Kairo variant: coach request on `kairo-wed`, Tue 6 Oct 09:00) · reschedule-keep-or-cancel T-4.09 · moved T-4.04 · reschedule-declined T-4.05 · reschedule-expired T-4.07 · join T-5.01 · in-session T-5.08 · pending T-6.01 · pending-soon T-6.02 · confirm-step T-6.03 · completed-review T-6.03, T-6.05 · review-posted T-6.05 · disputed-open T-7.01 · disputed-review T-7.03 · resolved-refunded T-7.05 · resolved-paid T-7.06 · payment-problem T-7.10 · awaiting-payment T-13.03 · expired T-13.03 · loading, error T-13.06 (06 faults) |
| 06 dashboard links | kairo-tue, vexa-request, nullpoint-open T-13.03 · mirae-pending, mirae-confirm T-7.13 · ghostline-review T-6.06, T-13.04 |
| 06 coach | coach-upcoming T-4.15 · coach-cancel T-4.16 · coach-request-received T-4.03 · coach-pending T-6.01 · coach-completed T-6.03 · coach-dispute T-7.03 |
| 07 | gamer-after T-7.01 · mirae-after T-7.13 · gamer-noshow T-5.04 · gamer-payment T-7.10 · coach-after T-7.07 · coach-payment T-7.11 · validation T-7.02 · upload-error T-7.02 · submitted T-7.01 · respond T-7.03 · response-sent T-7.03 |
| 08 | waiting T-5.02 · no-show T-5.04 · coach-waiting T-5.03 · live T-5.02 · camera T-5.06 · share T-5.06 · banner-10, banner-5, banner-1 T-5.07 · end-confirm, end-sent T-5.11 · end-received T-5.11 · reconnecting, other-dropped T-5.09 · blocked T-5.10 · ended, coach-ended T-5.11, T-5.13 |
| 09 | busy T-13.03 · todo-all T-13.04 · quiet T-13.06 · new T-2.01, T-13.06 · loading, error T-13.06 |
| 10 | list T-13.07 · empty T-13.07 · loading, error T-13.07 |
| 11 | form T-2.01 · booking T-2.13 · errors T-2.02 · loading T-2.01 |
| 12 | sent T-2.01 · resent T-2.03, T-2.19 · expired T-2.03 · verified T-2.01 · verified-other T-2.04 |
| 13 | form T-2.01 · google T-2.07 · missing T-2.08 · phone T-2.01 · wrong-code T-2.08 · filled T-2.01 · username-taken T-2.08 · coach-unavailable T-2.11 · booking T-2.13 · submitting T-2.01 · under-18 T-2.09 · not-available T-2.10 |
| 14 | form T-2.14 · booking T-2.17 · wrong T-2.15 · too-many T-2.16 · loading T-2.14 |
| 15 | request T-2.22 · sent T-2.22, T-2.23 · new-password T-2.22 · expired T-2.23 · done T-2.22 |
| 16 | terms T-2.21 |
| 0.2 Components | every section (shell, buttons, fields, status, identity, cards, notices, confirm, patterns, booking, session, access): M1 library check, not a flow scenario |

### Not yet coverable

| What | Why | Gap |
|---|---|---|
| Gamer responds to a coach's report | Not designed | G-006 |
| 06 coach-side states beyond the six drawn, and the split outcome | Not designed | G-007 |
| Pages 17–25 screens | Not designed | G-057, G-008 |
| Late and duplicate payments T-3.21 | Need your approval | G-017 |
