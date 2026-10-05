# Harbourly webapp design decisions

Decisions agreed during design that change or clarify the MVP feature list. Newest at the bottom.

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
