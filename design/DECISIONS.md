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
- Dispute filed (both; depends on the response feature decision)
- Dispute outcome (both)

Coach journey
- Application submitted, approved, rejected (rejection includes reason and reapply date)
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
