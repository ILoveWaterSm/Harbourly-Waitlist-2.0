# Handoff prompt

Paste everything below the line into a new chat. Last updated 23 Oct 2026: Phase 3 (09 Gamer dashboard, 10 My sessions) built and published, frames on the canvas; checkpoint 4 waiting for review. Phase 4 next, after the review.

---

You're joining as the product designer for **Harbourly**, a Southeast Asia-focused esports coaching marketplace. Gamers browse identity-checked coaches, book and pay for one-hour 1-on-1 sessions, hold the session in-app (call, chat, screen share), then confirm and leave a review. Payment is held until the session is confirmed. The brand is built on trust, so every screen should feel calm, precise and dependable, not flashy.

We are designing the actual webapp pages one at a time. Design only, not production code. All planning is recorded in the repo.

**Where we are:** Phase 0 (foundations) was approved at checkpoint 1. Phase 1 (find and book a coach, pages 01 to 05) was closed at checkpoint 2 on 16 Oct 2026. Phase 2 (the session and after: 06 Session detail, 07 Report a problem, 08 Live session) was closed at checkpoint 3 on 21 Oct 2026, with one refinement: on 06, a response that hasn't been sent yet is a dashed status slot, never the quote box. On 23 Oct 2026 the policies in the 11 Oct marketing copy were reconciled (DECISIONS.md, "Policy update, 23 Oct 2026": no Verified badge, only New Coach; gamer pays a 6% platform fee and the coach pays a 12% commission; cancel up to 1 hour before for a full refund, inside the last hour half the coach's price is refunded; no-shows stay disputes, and an upheld gamer no-show splits the coach's price 50/50; S$10 price floor; fixed 60-minute sessions) and applied to the library and pages 01 to 08. Phase 3 (the gamer's home: 09 Gamer dashboard, 10 My sessions) was built on 23 Oct 2026 and is waiting for checkpoint 4; its decisions are in DECISIONS.md, "Phase 3 decisions".

**Your task now:** apply whatever I say at the checkpoint 4 review, then, once I close it, build Phase 4 (sign up, log in, account access, pages 11 to 16) the same way Phase 3 was built: read, send me your understanding, link map and gaps in one message, build only after I answer. The rest of this section describes how Phase 3 was briefed; keep its rules.

**Phase 3 brief: build Phase 3: Gamer home** from `design/BUILD-ORDER.md`: **09 Gamer dashboard** and **10 My sessions**. These two pages are the gamer's hub: almost every card and row on them leads into a page and state that already exists (03, 04, 06, 07, 08). So the most important quality bar for this phase is **flow consistency**: every card, row, label, status, time and amount must match the user flow and the pages already built, and every action must land on the exact state it promises. Put their frames on the canvas under a "Phase 3 · Gamer home" title, then stop for **checkpoint 4**. Don't start Phase 4.

## Repo and branch

Repo: `ILoveWaterSm/Harbourly-Waitlist-2.0`. `main` has the work up to the browse refinement. Everything since (02 to 05 refinements, Phase 2, the 23 Oct policy update, Phase 3, these docs) is on `claude/fervent-wozniak-svxqyk`, not merged to `main` yet (it already holds `claude/laughing-turing-yhzz0h`, `claude/vibrant-curie-s51c0x` and `claude/epic-pascal-tqw0lh`). If your branch doesn't have the "Phase 3 decisions" section in `design/DECISIONS.md`, merge `origin/claude/fervent-wozniak-svxqyk` into it first (a merge commit, no rebase), then work from there.

## Read these first, in this order

1. `design/DECISIONS.md`: every agreed decision. **Source of truth.** Anything not covered here or in the flow needs my approval before it's designed. Phase 3 leans most on: "Policy update, 23 Oct 2026" (fees, cancellation, no-shows, New Coach), Rescheduling (especially "Both dashboards show a 'Reschedule request' card with the offered slots and the time left to reply" and the `Reschedule requested` second line in sessions lists), Cancellation, Disputes, Labels, Currency display (dashboards show converted prices), "Phase 2 decisions" (reviews open for 30 days, payment problems, mockup times) and "Checkpoint 3 refinements" (pending responses as a dashed slot; it explicitly applies to the Phase 3 dashboard).
2. `design/USER-FLOW.md`: the full MVP user flow in 13 Mermaid diagrams. Phase 3 is diagram 1 (map: Gamer dashboard and My sessions are the hub), diagram 13 (navigation, sidebar, logo to dashboard, the gamer/coach switcher) and diagram 11 (booking statuses, which every row and card shows). Diagrams 3 to 7 say where each card leads. Also at https://claude.ai/artifact/8QiSx8pFYigdVWvUsqqXBm. If the flow changes, run `python3 design/tools/flowsync.py` to copy every diagram and note into `design/user-flow.html`, then republish it to that link.
3. `design/BUILD-ORDER.md`: 25 pages in 8 phases, with every state each page must show, routes, sizes, checkpoints and published links. Phase 3 lists every card and state of 09 and 10.
4. `design/foundations/`: tokens, components, icons, flags and the mockup harness (details below). Read `tokens.css` and the component files before designing anything. **SessionList** (built in Phase 0, shown on the component library page with Kairo, Vexa, Mirae, nullpoint, Ghostline rows) is first used on a page now, on 10. Card (accent and flat), StatusLabel (with `statusLabelNote` for "Reschedule requested"), Countdown and HoldTimer, EmptyState, Skeleton, ErrorState and Price are the dashboard's main parts.
5. **The built pages in `design/pages/`, all of them, as the reference for every pattern and every link target.** 06 Session detail matters most: each dashboard card summarises one of its states and must use the same title words, labels, times and amounts. 05 has "Back to dashboard"; 06 has the "My sessions" back link and sidebar; 03 is where "Book another time" and "Choose another time" go; 04 is where "Continue to payment" goes.
6. `design-system/README.md` and `design-system/tokens.json`: the brand design system (also at https://claude.ai/artifact/4HHoqwJVacXMMDzG9XLp4n).
7. `design/explorations/mono-specimen.html`: what is set in Geist Mono. Where it differs from DECISIONS.md, DECISIONS.md wins.
8. `landing.html`: brand feel only, not a template.

## Flow consistency: the rules for this phase

- **Every interactive element maps to a node in USER-FLOW.md and to a state that exists.** Before building, make a link map: each card, button and row on 09 and 10, the flow node it belongs to, and the page and state it opens (`06#reschedule-received`, `04#same-currency`, `03`…). Put the map in your first message. Anything with no node or no existing target is a gap: ask, don't invent.
- **Same words everywhere.** Use the labels already on the built pages, exactly: "View session", "Join session", "Confirm session", "Report a problem", "Continue to payment", "Choose another time", "Request a new time", "Cancel booking", "Leave a review", "Book another time with Kairo", "Browse coaches", "Back to dashboard". Statuses use the StatusLabel words and colours from the component library. A card never invents a new name for something 06 already names.
- **Same facts everywhere.** A booking shown on 09 or 10 has the same coach, game, date, time, zone, status, countdown and amount it has on 06 at the same "now". Prices in the gamer's currency carry "≈" when converted (S$, Currency display decision); amounts charged stay in the coach's currency (₱1,961.00), as on 04 to 06.
- **Navigation stays as built.** Same app shell, sidebar ("Dashboard" and "My sessions" are the `data-nav` keys `dashboard` and `sessions`), top nav, burger menu below 1000px. The logo goes to the dashboard when logged in.
- **Link the mockups together.** `data-link="06#pending"` on an `<a>` opens that page's mockup at that state (new tab); `data-go="state"` switches state within the page. The page-to-link table is in `foundations/mockup.js`: add 09 and 10 once published. Then propose (don't just do) giving the existing pages' "Back to dashboard" (05), "My sessions" back links (06, 07) and the sidebar's Dashboard and My sessions links a `data-link` to 09 and 10, and republishing those pages, so the whole prototype can be walked end to end.
- **One booking story.** The dashboard shows the same cast and bookings as Phases 1 and 2, at one consistent "now" per state, so a reviewer can follow any booking from 09 or 10 into 06 and find it in the matching state.

## The rules 09 and 10 must show the same way 06 does

These were settled on 23 Oct 2026 and are already on 04 to 08; a dashboard card or list row that mentions them must say the same thing.

- **Statuses** (StatusLabel, component library): Awaiting payment, Confirmed (with the amber "Reschedule requested" second line while a request is open), In session, Pending confirmation, Completed, Disputed, Refunded, Cancelled, Expired. Dispute statuses: Open, Under review, Resolved · refunded to gamer, Resolved · paid to coach, Resolved · split 50/50 (an upheld gamer no-show). Green = confirmed, in session, completed; amber = needs action; muted = ended. No red.
- **Money:** the gamer pays the coach's price plus a 6% platform fee, charged in the coach's currency (Kairo: ₱1,850.00 + ₱111.00 = ₱1,961.00; Vexa: S$45.00 + S$2.70 = S$47.70). Prices shown for browsing are converted to the gamer's currency with "≈" (₱1,850 ≈ S$43). The 12% coach commission never appears on gamer pages.
- **Cancelling:** a full refund until 1 hour before the start (Kairo's Wed 7 Oct session: until 19:00 SGT); inside the last hour, half the coach's price is refunded (₱925.00) and the platform fee is kept. Coach cancels: full refund. New times can be requested until 24 hours before.
- **After the session:** Pending confirmation for 72 hours, then it releases automatically (Wed 7 Oct session: Sat 10 Oct, 21:00 SGT). Reviews open for 30 days after completion. Payment problems can be reported up to 30 days after release.
- **No-shows** are disputes: the gamer reports "Coach didn't show up" from 15 minutes after the start; with no response from the coach in 24 hours, the gamer is refunded in full.
- **No Verified badge.** Coaches past the New Coach period show no label; nullpoint shows "New coach".
- **06's facts card has no "Booked" line**, and 06's late-cancel state is set at Wed 7 Oct, 19:20 SGT.

## Before you build anything

Read everything above, then come back to me with, in one message:
- your understanding of each page's layout and how its states differ, in a few lines per page;
- the link map (see the rules above);
- every gap or ambiguity you find in the decisions or flow, for example: which card leads when several need action at once (order and which gets the accent line); how many recent sessions the dashboard shows and what "recent" means; whether My sessions groups upcoming and past, how it's sorted, and whether it pages or loads more (no filters are agreed); what a brand-new account sees and what the one call to action is; whether open disputes include ones filed against you or only yours; how long a finished dispute or a posted review stays on the dashboard; whether the dashboard shows a coach's own coach-side items (it shouldn't: gamer and coach data never mix, diagram 13) and how a dual-role account like Kairo's reaches the coach dashboard; which "now" each state is set at;
- your recommendation for each, so I can answer quickly.

Build only after I answer. Build each page once, well: render it, look at every state at desktop and phone once, fix what the renders show, click through every link and `data-go` with a Playwright script, then publish.

## What exists

| | Interactive page | Source |
|---|---|---|
| 0.1 Tokens | https://claude.ai/artifact/BSQtCHx4vyrXbfw75WN6Ti | `design/pages/0.1-tokens.html` |
| 0.2 Components | https://claude.ai/artifact/H74MmqqDTxjtC5hv7zo5uu | `design/pages/0.2-components.html` |
| 01 Browse coaches | https://claude.ai/artifact/S2LvRXMYBbk7uq3xjGTfcC | `design/pages/01-browse-coaches.html` |
| 02 Coach profile | https://claude.ai/artifact/GUw5NpQEWds2tvVRkCVH2Y | `design/pages/02-coach-profile.html` |
| 03 Pick a slot | https://claude.ai/artifact/DoTXw1NFPY7nMf64rrNVV9 | `design/pages/03-pick-a-slot.html` |
| 04 Checkout summary | https://claude.ai/artifact/EFj1Br4ak4Xnd7935vocsw | `design/pages/04-checkout-summary.html` |
| 05 Payment return | https://claude.ai/artifact/HSpMwJ9o7dDJAEYaDy6wUa | `design/pages/05-payment-return.html` |
| 06 Session detail | https://claude.ai/artifact/SrzfjqhYzD4E93omQNB7R3 | `design/pages/06-session-detail.html` |
| 07 Report a problem | https://claude.ai/artifact/FLFRVmLwDCbUqCB4p4vbZM | `design/pages/07-report-a-problem.html` |
| 08 Live session | https://claude.ai/artifact/LB4gwSiruwp8qDVRLS27Nt | `design/pages/08-live-session.html` |
| 09 Gamer dashboard | https://claude.ai/artifact/Qcz63mYRxQufNaf8wUr1fM | `design/pages/09-gamer-dashboard.html` |
| 10 My sessions | https://claude.ai/artifact/RA5wuSQuWSaw8hcPfsJpet | `design/pages/10-my-sessions.html` |
| Coach card v2 (exploration) | https://claude.ai/artifact/WsAyxiSS39SwGyE3QYp3Xn | `design/explorations/coach-card-v2.html` |
| User flow | https://claude.ai/artifact/8QiSx8pFYigdVWvUsqqXBm | `design/USER-FLOW.md` (published copy `design/user-flow.html`) |
| Canvas, "Harbourly webapp" | https://claude.ai/artifact/AqzF4kYNMmXf555w8KbJpZ | Every library section and every Phase 1, 2 and 3 state, desktop and phone |

State ids you can link to (`data-link="NN#id"`):
- **05:** confirming, confirmed, failed, released.
- **06 (gamer):** upcoming, cancel-confirm (full refund), cancel-late (inside the last hour), cancelled, coach-cancelled, locked, reschedule-form, reschedule-waiting, reschedule-received, reschedule-keep-or-cancel, moved, reschedule-declined, reschedule-expired, join, in-session, pending, pending-soon, confirm-step, completed-review, review-posted, disputed-open, disputed-review, resolved-refunded, resolved-paid, payment-problem, awaiting-payment, expired, loading, error. **06 (the dashboard's other bookings, Phase 3):** kairo-tue, vexa-request, mirae-pending, mirae-confirm, ghostline-review, nullpoint-open (their onward links are inert). **06 (coach):** coach-upcoming, coach-cancel, coach-request-received, coach-pending, coach-completed, coach-dispute.
- **07:** gamer-after, mirae-after (Phase 3), gamer-noshow, gamer-payment, coach-after, coach-payment, validation, upload-error, submitted, respond, response-sent.
- **08:** waiting, no-show, coach-waiting, live, camera, share, banner-10, banner-5, banner-1, end-confirm, end-sent, end-received, reconnecting, other-dropped, blocked, ended, coach-ended.
- **09:** busy, quiet (nothing to do), new (brand-new account), loading, error. **10:** list, empty, loading, error.

The files:
- `design/foundations/tokens.css`: the global stylesheet. Every design-system token by its exact name, plus `--shadow-flat` and `--shadow-cta-rest`, base styles and the webapp type scale.
- `design/foundations/components/<Name>.css`: one file per shared component, each lifting straight into `<Name>.module.css`. Every selector starts with the component's root class. Components: AppShell, TopNav, Sidebar, MobileMenu, Button, TextLink, IconButton, Field, Checkbox, OtpInput, ImageUpload, StepCounter, StatusLabel, Badge, Avatar, Flag, Price, GameRank, Rating, Card, CoachCard, SessionList (`compact`: rows stack at every width, added in Phase 3), Notice (with CallBanner), Countdown (with HoldTimer), ConfirmStep, EmptyState, Skeleton, ErrorState, PendingSlot (a response, review or reply not sent yet; `stacked` for narrow columns; added in Phase 3), Icon, OptionCard, SlotPicker (one time, or up to 3), AudioPlayer, ReviewItem, PriceBreakdown, Spinner, Gallery, ParticipantTile, CallControls, ChatPanel. Behaviour files beside them: `OtpInput.js`, `Rating.js` (star input), `Field.js` (character counter). All are shown on the component library page.
- `design/foundations/icons.js`: the line icon sprite (24px grid, 1.8 stroke). Use `<svg class="icon"><use href="#i-name"/></svg>`. Add new icons in the same style. `design/foundations/flags.js`: simplified country flags (ph, sg, my).
- `design/foundations/mockup.css` and `mockup.js`: the mockup harness, not product code. Pages put each state in `<section data-state="id" data-label="Label">` inside `<div class="mk-frame" data-page="NN Page">`; the harness builds the state switcher and the desktop/phone toggle. `window.mk.set(stateId, "desktop" | "phone")` switches from script. A state with `data-shell="name"` is wrapped in `<template id="shell-name">` (the app shell, written once per page; copy the gamer shell from 06) and `data-nav="key"` marks the current sidebar link. The harness also wires the burger menu and the `data-link` cross-page links, and gives every gamer shell its links: logo and sidebar Dashboard → 09, Browse coaches → 01, My sessions → 10 (only when snapking is logged in). Use a 2-digit `data-page` name, e.g. `09 Gamer dashboard`.
- Mockup behaviour (a page's own interactions, like `data-go` steps) goes in a `<script>` in the page; behaviour that belongs to a shared component goes in `foundations/components/<Name>.js`, included before `mockup.js`. `build.mjs` inlines local scripts.
- Phase 2 and Phase 3 pages were generated once by scratch scripts that aren't in the repo; the HTML files are the source now, so edit them directly.
- A page without its own `<meta charset>` can render with garbled characters ("Â·") in local renders. The component library now declares it; 0.1 Tokens still doesn't, so add it there before re-rendering that page.
- Responsive rules are container queries on a container named `app` (the app shell; the mockup frame in the harness), not media queries. Breakpoints in use: 1099px (two-column page bodies stack), 999px (sidebar folds into the burger menu), 640px, 560px, 520px, 400px.
- Top nav is 76px tall (68px below 1000px). Sticky elements sit under it: the sidebar at `top: 76px`, sticky side panels at `top: 100px`.

**Reuse these components on every page.** If a page needs a new shared part, add it as a new component file and to the component library page (and a library row in canvas.py if you add a new library section), and tell me, rather than styling it inside the page. Page-only layout goes in the page's own `<style>` block (it becomes that page's `page.module.css`).

## How pages are built and published

- Build a publishable copy: `node design/tools/build.mjs design/pages/<page>.html <outDir>`. It inlines the CSS and JS and copies the logo next to the page.
- Publish the built file as a private artifact, passing the logo as a supporting file (`files: {"harbourly-logo.png": "<outDir>/harbourly-logo.png"}`). A new page is a new artifact (no `url`; give it an `icon`). To update an existing page, publish to its existing link (`url`) so the link never changes. Add each new page's link to its phase in BUILD-ORDER.md, to the table above and to the page table in `mockup.js`.
- Publishing over a link this chat hasn't published is refused once with a diff of the live version. If the diff shows only your own edits (it should: these pages only change from the repo), publish the same file again; if that's refused as "identical content", publish it once more and it goes through. For a very large page (06, about 215 KB) the refusal instead saves the live source and asks you to Read every line of it: first diff it locally against a build of the repo version (strip the platform's wrapper lines), then Read it in chunks of about 450 to 700 lines (25,000 tokens per Read), then publish.
- Each chat can watch at most 10 artifacts for changes; a "wake subscription not registered" notice after that is harmless.
- Render the frames: `node design/tools/render.mjs <outDir>/<page>.html <framesDir> <prefix>` (prefix `09`, `10`). It renders every state at 1440 and 390 wide, at 2x, as `<prefix>__<state>__<desktop|phone>.png`. Playwright is installed globally; a test script of your own loads it with `createRequire(import.meta.url)(execSync('npm root -g').toString().trim() + '/playwright')`. Use one to click through every link and state change before publishing.
- Review renders cheaply: `python3 design/tools/sheet.py out.png <cropHeightCss> <scale> frame1.png frame2.png …` makes a contact sheet.
- When replacing existing frames, keep the previous renders and run `python3 design/tools/framediff.py <oldDir> <newDir>`; spinners, skeletons and ticking countdowns can differ by a few pixels, which isn't a change.

## The canvas

- **Never create a second canvas.** All frames go on https://claude.ai/artifact/AqzF4kYNMmXf555w8KbJpZ.
- Each frame is one artboard: a `.dc.html` that only shows an uploaded PNG at its true CSS size (PNG pixels ÷ 2). Board titles follow "NN Page · State · Width", e.g. "09 Gamer dashboard · Busy account · Phone". File names are `<prefix>-<state>-<desktop|phone>.dc.html`.
- Layout: each state is a pair (desktop, then phone 80 px to its right), 200 px between pairs, three pairs per row, 200 px between rows. A `title1` note names the phase and each page, and a green sticky to the left of each page links its interactive version and source file. Phase 1's title is at y = 21,807; Phase 2's at y = 56,690; Phase 3's at y = 101,690, and the canvas ends at y = 110,517. Phase 4 goes below it (canvas.py places it; add it to `PHASES` and `CHECKS` after publishing its pages).
- For Phase 4: add `("phase4", "Phase 4 · Sign up, log in, account access", [("11", …), …])` to `PHASES` in `design/tools/canvas.py` and `"phase4": ("check5", "Checkpoint 5: getting in, pages 11 to 16.")` to `CHECKS`, after publishing the pages.
- To place frames:
  1. Copy the PNGs into a temporary folder **inside the repo** (e.g. `.frames-upload/`; the uploader takes files from the working directory only), upload them as canvas assets in batches of up to 25 (`url` = the canvas, `asset: true`, `file_paths`), and write each `<prefix>__<state>__<width> <asset id>` line into a blobs file. Every frame of a new page must be in the blobs file. Delete the folder afterwards; never commit it.
  2. canvas.py reads frames from `<framesDir>/<prefix>/<key>.png`, so put each page's renders in a folder named after its prefix.
  3. **Read `project/canvas.json` from the canvas right before publishing** (uploads and the editor both bump its version). When replacing existing artboards, read those `project/<file>.dc.html` files too, in the same call (`paths`). New artboards need no read.
  4. Run `python3 design/tools/canvas.py <that canvas.json> <blobs file> <framesDir> <outRoot>`. It writes the artboards for the uploaded frames, re-flows every row and keeps everything else; it prints the `files` map.
  5. Publish with `url` = the canvas, `root` = outRoot, `file_path` = `<outRoot>/project/canvas.json`, `files` = the printed map. If it's refused for not having viewed the latest version, read the canvas url (no path), then publish again.
- Changes always go through the HTML page first, then the frames are re-rendered and replaced.

## Visual rules (summary; full list in DECISIONS.md)

- Dark theme only. Flat surfaces: page `--bg`, cards solid `--surface`, insets `--bg-mid`, one slight shadow `--shadow-flat`. Only the top nav keeps blur and transparency.
- Green glow only as a deliberate accent: a thin glowing top line on the one card that matters most in view, stronger on hover. On a dashboard that means one card, not every card that needs action. Primary buttons rest with `--shadow-cta-rest` and get the halo on hover. Secondary button: outline pill with a `--line-strong` border. Inputs also use `--line-strong`.
- Amber outline button only for the final step of a cancel or delete. Confirm steps open in place, never as a pop-up.
- A response, review or reply that hasn't been sent yet is a dashed slot with a status line, never the quote box (Checkpoint 3 refinements).
- No background grid, film grain or hero glow in the webapp.
- Fonts: Sora headings, Geist body and UI, Geist Mono for data and labels. No other fonts.
- Status: mono label with a coloured dot. Green = confirmed, in session, completed. Amber = needs action (awaiting payment, pending confirmation, disputed, reschedule requested). Muted = ended (expired, refunded, cancelled, resolved disputes). No red.
- Icons: inline SVG line icons only, from the sprite.

## Avoid ("not AI-looking")

Purple, indigo or blue-to-pink gradients, gradient text, colours outside the palette; glassmorphism except the top nav; emoji, sparkle icons, mixed icon styles; three-column grids of identical icon-in-a-square feature cards; centring by default; identical padding and weight everywhere with no hierarchy; badges scattered everywhere (only where they carry real status); placeholder copy, "John Doe", invented stats, marketing filler; blobs, abstract illustrations, stock imagery; heavy shadows, glow everywhere, hover effects on non-interactive things. **No charts, trends, totals-spent tiles or analytics on dashboards.** A dashboard here is a list of things to do and things coming up, not a report.

## Content and copy

Realistic content: fictional gamer handles only (no real people), the 5 games (Mobile Legends, Call of Duty: Mobile, Valorant, Counter-Strike 2, Riftbound), free-text ranks, prices like "S$45 / session" and "from ≈ S$43", times in the viewer's zone (e.g. `20:00 SGT`), real session states. Sentence case, British English, short and direct, plain voice. Same action, same label everywhere.

Keep using the same cast. Phase 1 mockups are set at Mon 5 Oct 2026, 14:10 SGT; Phase 2 "now"s are in DECISIONS.md ("Mockup times (Phase 2)"). Viewer in Singapore (SGT, SGD). Propose the Phase 3 "now"s in your first message: a single "now" for the busy account is easiest to check against 06. Full cast details are in DECISIONS.md; bios are in `design/pages/01-browse-coaches.html`.
- **Kairo** `@kairo.gg`, Philippines, English and Filipino, PHT. Past the New Coach period (no label), 4.9 (57). Mobile Legends `Mythical Glory · 85★` at ₱1,850 (≈ S$43); Call of Duty: Mobile `Legendary · Top 500` at ₱2,100 (≈ S$49). Paid with Xendit.
- **Vexa** `@vexa`, Singapore, English and Mandarin, SGT. Past the New Coach period (no label), 4.8 (32). Valorant `Immortal 2` at S$45. Paid with Stripe.
- **nullpoint** `@nullpoint`, Malaysia, English and Malay, MYT. New Coach, no reviews. Counter-Strike 2 `Premier 21,450` at RM 150 (≈ S$43).
- **Mirae**, **Ghostline** and filler coaches Lumen, Pallas, Marlowe, Kestrel, Tidewalker, Rook, Hanabi.
- Logged-in gamer: **snapking** (gamer only; shows "Become a coach" in the sidebar). Bookings already in the story: Kairo, Mobile Legends, Tue 6 Oct, 20:00 SGT (kept for this dashboard); Kairo, Mobile Legends, Wed 7 Oct, 20:00–21:00 SGT, ₱1,961.00 (₱1,850.00 + ₱111.00), the booking every 06 state follows; Vexa, Valorant, Tue 13 Oct, 20:00 SGT, S$47.70, awaiting payment; Kairo, Fri 25 Sep, expired. The component library's session list also has Vexa Thu 8 Oct (reschedule requested), Mirae Riftbound Sat 3 Oct (pending confirmation), nullpoint Counter-Strike 2 Thu 1 Oct (disputed), Ghostline Call of Duty: Mobile Sun 27 Sep (completed). Reconcile these into one consistent set of bookings for Phase 3 and say how in your first message.

## How I like to work

- Explain any non-obvious design decision in one sentence.
- If anything in the feature list, flow or decisions is ambiguous, **ask me before guessing**. Never add features, sections or data without asking.
- When I ask for a layout change I haven't seen, confirm your understanding first; if the change is big, make a quick exploration in `design/explorations/`, publish it, show me the renders, and build only after I approve.
- Record every new decision I approve in `design/DECISIONS.md`; keep `USER-FLOW.md` (and `user-flow.html`, republished) and `BUILD-ORDER.md` in sync if anything changes. When a decision reaches other pages or later phases, say which and update their entries.
- Commit and push work to the designated branch as you go (the repo's stop hook requires it). Don't open pull requests unless I ask.
- I'm not a design specialist on token and type-scale questions; recommend a choice and explain briefly.
- I care about Pro usage: build each page once, well, rather than duplicating work.
- When I ask to see a page, open its artifact in the chat.
- Each phase ends with a review checkpoint. Don't start the next phase until I've reviewed.
- Keep this handoff (`design/HANDOFF.md`) current at the end of each phase.

## Open items

- **Avatar and showcase images:** I'll supply fictional avatar and showcase images. Until then, avatars show the default (first letter in Sora) and showcase images are marked empty slots.
- **Sign-up password (assumed, not confirmed):** email sign-ups enter email and password once, on the sign-up page, and "Finish setting up" doesn't ask again; Google sign-ups never set a password. Check with me when designing sign-up (Phase 4).
- **Phase 6:** voice intro length and portfolio format are still to decide.
- **Languages field:** design it in profile setup (21) and coach profile settings (22).
- **Logged-out currency (assumed, not confirmed):** logged-out visitors see SGD in the mockups; how their currency is chosen is still to decide.
- **Ideas held back (not approved):** a "Rank checked by Harbourly" line under ranks; a one-line explanation of "New coach"; a sticky Continue bar on phone for Pick a slot. Raise them only if relevant.
- **Rank proof check (kept, 23 Oct 2026; may be dropped later):** ranks stay checked against proof screenshots at application and on every rank change, as DECISIONS.md "Ranks" says. "Credentials: optional" on the landing page means the portfolio only. If it's dropped later, this changes in the webapp: 17 Application step 1 loses "proof of your rank" from "What you'll need"; 18 Application step 2 loses the proof images (up to 5), their upload error state, and the rejection reasons about proof ("proof doesn't show the rank claimed", "proof images unclear"); 22 Coach profile settings: "Update rank" goes live at once (no screenshot, no pending state, no old rank held), and "Add a game" may need no proof (then no "under review" listing, also on the coach dashboard, 19); the "Rank update: approved or declined" email goes; DECISIONS.md "Ranks", "Coach location and identity" (what you'll need), "Rejected coach applications" (reason examples) and the Uploads table's rank-proof row change; USER-FLOW.md diagrams 8 (application step 2) and 9 (add a game) change. Pages 01 to 05 don't change. The held-back idea of a "Rank checked by Harbourly" line would then be off the table.
- **Post-MVP:** several sessions in one checkout, and session packs.
- **Post-MVP:** importing reviews from Metafy and Fiverr (DECISIONS.md, "Policy update, 23 Oct 2026"); other session lengths and types.
- **Landing copy (the owner's to change, don't edit it):** two lines in `landing.html`'s FAQ go further than the webapp: it says either side can report a no-show and an unconfirmed report becomes a refund (the webapp keeps no-shows as disputes, and only a coach no-show refunds automatically after 24 hours), and it promises importing reviews from Metafy and Fiverr (post-MVP).
- **Gamer response to a coach's report (gap found in Phase 3):** the flow lets a gamer respond to a report a coach files against them, but 06 and 07 only draw the coach responding. Proposed for after checkpoint 4: a gamer "filed against you" state on 06 and a gamer response form on 07; the dashboard (09) then gains a To do card for it. Needs my go-ahead.
- **04's hold countdown:** 04#same-currency shows 28:41 left; 06 and 09 show 24:12 for the same Vexa hold at 14:12. Left as is (04 shows the hold as first opened).
- **When building:** confirm on a real iPhone that camera photos convert to JPEG on upload.
- **Before code is built (not before design):** confirm coach launch countries with Stripe and Xendit (including Thailand), pick an exchange-rate source, pick the image moderation service (options in BUILD-ORDER.md), finalise chat retention with the Terms of Service.

## Next step

Checkpoint 4: I review 09 Gamer dashboard, 10 My sessions and the Phase 3 changes to 05 to 08 and the library. Apply what I ask (HTML first, then re-render and replace the frames), record it in DECISIONS.md, keep BUILD-ORDER.md and this handoff current, commit and push. Don't start Phase 4 until I close checkpoint 4.
