# Harbourly webapp design decisions

Settled decisions that change or clarify the MVP feature list and the design system. Newest changes are added to the relevant section.

## Output and code structure

- Mockups are standalone HTML, one per page, in `/design`, dark theme only.
- Stack they map to: Next.js 16, React 19, TypeScript, CSS Modules (one `.module.css` per component) plus one global token stylesheet. No Tailwind.
- Token names match `design-system/tokens.json` exactly. Spacing uses `--space-1` to `--space-20` (no `--pad`).
- Fictional gamer handles only; no real people.

## Design system adjustments for the webapp

- Flat surfaces: cards are solid `--surface` with one slight shadow. Page is `--bg`, inset areas `--bg-mid`.
- New token `--shadow-flat` (single slight card shadow).
- New token `--shadow-cta-rest`: softer resting glow on primary buttons; hover goes to `--shadow-cta-hover` with the halo.
- No background grid, film grain or hero glow in the webapp.
- Top nav keeps its blur and transparency; nothing else is frosted.
- Green glow only as a deliberate accent (thin top glow line, stronger on hover).
- Type: page titles `--text-kpi`, section titles `--text-card-title`, card titles `--text-h3`.
- Status colours: green = confirmed, completed, verified; amber = needs action (awaiting payment, pending confirmation, disputed); muted = neutral or ended. No red.
- Secondary button: outline pill, `--line` border, `--ink` text.
- No icon chips, no default centring, hover lift only on interactive cards.
- Geist Mono for data and labels: prices, fees, earnings, dates, times, durations, countdowns, statuses, ranks, ratings, review counts, eyebrows, small labels, column headers, step and character counters, references, @handles. See `explorations/mono-specimen.html`.

## Product decisions

- **Games (5):** Mobile Legends, Call of Duty: Mobile, Valorant, Counter-Strike 2, Riftbound.
- **Ranks (changes feature list sections 6 and 17):** no rank ladders stored by Harbourly. Each game listing has a free-text "Rank or top achievement" field (about 40 characters), checked by the team against proof screenshots. Changing it later needs a new screenshot and stays pending until approved; the old rank shows meanwhile. Shown in Geist Mono on coach cards and profiles. Browse has no rank filter: filter by game and price; sort by price, rating, most reviewed.
- **Coach games and rates:** games and rank per game are added in application phase A (step 2). Per-game price and up to 3 credential lines are set in profile setup phase B. Profile complete requires at least one game with a rate. Adding a game later goes through review.
- **Sign-in:** email and password, plus Google. No Discord or other social login.
- **KYC:** happens during payout setup, after approval, before going live.
- **Phone verification:** OTP at sign-up for everyone; needed by both gamers and coaches.
- **Sessions:** fixed 60 minutes, one slot per booking. Price is per session, shown as "S$45 / session"; cards show "from S$X".
- **Currency:** S$ for now (local-currency pricing under discussion).
- **Time:** all times in the viewer's local time zone with a zone label.
- **Join session:** active 10 minutes before start.
- **Session end:** at scheduled end, with banners at 10 and 5 minutes before. Early end needs both parties to agree.
- **Checkout:** hosted Stripe or Xendit page, then return to Harbourly. Includes a "confirming your payment" state.
- **Session detail page:** added for gamers and coaches.
- **Coach profile settings page:** added (bio, availability, games and rates, voice intro, portfolio).
- **New Coach label:** shown publicly, in the same position as the Verified badge.
- **Rejected applications:** coaches can reapply.
- **Account pages:** forgot and reset password, email verification, finish account setup, terms re-acceptance, account settings, payout settings, delete account, 404, error and expired-session pages.
- **Logo:** goes to the dashboard when logged in, the marketing home when logged out.
- **Verification Standard page:** design stays as is.
- **Mobile sessions:** phones can watch a shared screen but not share their own; the share button is replaced by a note.

## Still open

- Rescheduling: the coach-initiated case and cancellation policy.
- Rejection handling: cooldown length and recorded reasons.
- Dispute reasons per role and timing, the response feature, and partial refunds.
- `pending_payment` hold length (30 minutes proposed).
- Local-currency pricing and supported countries.
- Age requirements for gamers.
- Whether "background checks are rolling out" stays on the Verification Standard page.
- The mutual end-session interaction.
