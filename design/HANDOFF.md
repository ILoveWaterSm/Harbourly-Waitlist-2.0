# Handoff prompt

Paste everything below the line into a new chat. Last updated 22 Oct 2026: checkpoint 2 closed; policy changes on `main` to reconcile; then Phase 2.

---

You're joining as the product designer for **Harbourly**, a Southeast Asia-focused esports coaching marketplace. Gamers browse verified coaches, book and pay for one-hour 1-on-1 sessions, hold the session in-app (call, chat, screen share), then confirm and leave a review. Payment is held until the session is confirmed. The brand is built on trust, so every screen should feel calm, precise and dependable, not flashy.

We are designing the actual webapp pages one at a time. Design only, not production code. All planning is recorded in the repo.

**Where we are:** Phase 0 (foundations) was approved at checkpoint 1. Phase 1 (find and book a coach, pages 01 to 05) was reviewed and closed at checkpoint 2 on 16 Oct 2026. Changes made during that review: a one-per-row browse card and a taller top nav (01); an optional Showcase gallery on the coach profile, with Availability after Games at one-column widths (02); one session per checkout for the MVP and fixed code entry (03); a "Book another time with Kairo" link on booking confirmed (05). 04 Checkout summary had no changes.

**Your task: build Phase 2: The session and after** from `design/BUILD-ORDER.md`: **06 Session detail** (gamer and coach), **07 Report a problem**, **08 Live session**. Put their frames on the canvas under a "Phase 2 · The session and after" title, then stop for **checkpoint 3**. Don't start Phase 3.

## Repo and branch

Repo: `ILoveWaterSm/Harbourly-Waitlist-2.0`. `main` has the design work up to the browse refinement, plus my 11 Oct marketing copy commit (`landing.html`, `verification-standard.html`). Everything else since (02 to 05 refinements, Gallery, OtpInput.js, these docs) is on `claude/vibrant-curie-s51c0x`, which already includes that `main` commit; it isn't merged to `main` yet. If your branch doesn't have `design/foundations/components/OtpInput.js`, merge `origin/claude/vibrant-curie-s51c0x` into it first (a merge commit, no rebase), then work from there.

## Read these first, in this order

1. `design/DECISIONS.md`: every agreed decision. **Source of truth.** Anything not covered here or in the flow needs my approval before it's designed. Phase 2 leans most on: Rescheduling, Cancellation, Coach reliability, Emails, In-session timing, Disputes, Uploads (dispute evidence), Mobile sessions (core decisions), Labels, and the newest sections: "Coach profile showcase", "Automatic image check" and "One session per checkout, and code entry".
2. `design/USER-FLOW.md`: the full MVP user flow in 13 Mermaid diagrams. Phase 2 is diagrams 4 (before the session), 5 (the session), 6 (after: confirm, review), 7 (disputes) and 11 (booking status lifecycle). Every page maps to a node here. (Also at https://claude.ai/artifact/8QiSx8pFYigdVWvUsqqXBm; republish `design/user-flow.html` to that link when the flow changes.)
3. `design/BUILD-ORDER.md`: 25 pages in 8 phases, with every state each page must show, routes, sizes, checkpoints and published links. Phase 2 lists every state of 06, 07 and 08.
4. `design/foundations/`: tokens, components, icons, flags and the mockup harness (details below). Read `tokens.css` and the component files before designing anything. Phase 2 will use components built for it in Phase 0 but not yet used on a page: StatusLabel (every booking and dispute status), ConfirmStep (cancel, end session), Countdown (auto-release), Notice with CallBanner (in-call reminders), Rating input (review), ImageUpload (dispute evidence), SessionList.
5. The Phase 1 pages in `design/pages/`, to see the patterns already in use. 04 and 05 are the closest relatives: focused layouts, facts cards, PriceBreakdown, hold countdown.
6. `design-system/README.md` and `design-system/tokens.json`: the brand design system (also at https://claude.ai/artifact/4HHoqwJVacXMMDzG9XLp4n).
7. `design/explorations/mono-specimen.html`: what is set in Geist Mono. Where it differs from DECISIONS.md, DECISIONS.md wins.
8. `landing.html`: brand feel only, not a template.

## First: reconcile the policy changes on `main`

On 11 Oct I updated the marketing copy on `main` (commit adc8868, "Update copy for locked fee, New Coach, and coach policy decisions": `landing.html` FAQ and `verification-standard.html`). That copy states policies that **contradict `design/DECISIONS.md` and the Phase 1 designs**. DECISIONS.md hasn't been updated to match, and Phase 2 is built on exactly these rules. Before anything else, read that diff (`git show adc8868`), then put every conflict to me as a short list with the current DECISIONS.md rule beside the new copy, and ask which one stands. Don't change DECISIONS.md, the flow or any page until I answer. The conflicts I know of:

1. **Verified badge.** DECISIONS: New Coach, then Verified via a portfolio or 5 clean sessions; the Badge component and pages 01 to 05 show Verified. New copy: no badge at all. Every coach is "New Coach" until 5 completed sessions with no serious disputes, then the label simply stops showing. A reasonable dispute in that period resets progress to 0; a serious one (scamming, predatory or grooming conduct) is an immediate permanent ban. The portfolio is optional, only shown on the profile, and never grants a badge. Voice check is no longer part of verification.
2. **Fees.** DECISIONS: 6% platform fee paid by the gamer (S$2.70 on S$45). Commit message: coach commission 12%; the copy no longer states the gamer's fee. Ask what the gamer pays and what the coach pays.
3. **Games: settled, no change.** The commit message mentions swapping Counter-Strike 2 for Teamfight Tactics, but I confirmed on 22 Oct that Counter-Strike 2 stays. The five games remain Mobile Legends, Call of Duty: Mobile, Valorant, Counter-Strike 2 and Riftbound, as in DECISIONS.md; nullpoint and Rook are unchanged. Don't raise this one again.
4. **Cancellation.** DECISIONS: cancel 24 hours or more ahead for the coach's price back (fee kept); free within 1 hour of booking; no gamer cancellation inside 24 hours. New copy: cancel at least 1 hour before for a full refund; inside that hour, or a gamer no-show after a 15-minute grace window, the payment is split 50/50 between gamer and coach; repeated late cancellations or no-shows can lead to suspension. (DECISIONS also says no partial refunds in the MVP.) Affects 04's cancellation lines, rescheduling's 24-hour lock, and all of 06.
5. **Coach no-show and no-show reports.** DECISIONS: a gamer files a "coach didn't show up" dispute from 15 minutes after the start; the team decides. New copy: a coach no-show means a full refund (first time no other consequence; repeats get a warning, then suspension); either party can report a no-show, and a report not confirmed within 24 hours resolves automatically as a refund. Affects 06, 07 and 08.
6. **Rates.** DECISIONS: fixed 60-minute sessions, one price per game. New copy: a floor of S$10 per session; "rates can vary by session length or type"; a coach can't raise the price of a session already booked (matches the price snapshot).
7. **New features in the copy, not in DECISIONS:** fully non-exclusive coaches, and importing reviews from Metafy and Fiverr onto the Harbourly profile.
8. **Unchanged, for reference:** payout is automatic per session once the 72-hour hold clears; identity is checked by the payment partner at payout setup, before listing.

Once I've answered, record the outcome in DECISIONS.md (a new dated section, and correct the older sections it overrides), update USER-FLOW.md and `user-flow.html` (republished) and BUILD-ORDER.md, and list which already-built pages (01 to 05, the component library) need changing. Ask me whether to fix those before or after Phase 2. Then continue below.

## Before you build anything

Phase 2 has three large pages with many states. Read everything above, then come back to me with, in one message:
- your understanding of each page's layout and how its states differ, in a few lines per page;
- every gap or ambiguity you find in the decisions or flow (examples to check: what the live session shows on screen: video, voice only or avatars; where chat sits on a phone; what the coach's session detail shows that the gamer's doesn't; which "now" each state is set at);
- your recommendation for each, so I can answer quickly.

Build only after I answer. Build each page once, well: render it, look at every state at desktop and phone once, fix what the renders show, then publish.

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
| Coach card v2 (exploration) | https://claude.ai/artifact/WsAyxiSS39SwGyE3QYp3Xn | `design/explorations/coach-card-v2.html` |
| Canvas, "Harbourly webapp" | https://claude.ai/artifact/AqzF4kYNMmXf555w8KbJpZ | Every library section and every Phase 1 state, desktop and phone |

- `design/foundations/tokens.css`: the global stylesheet. Every design-system token by its exact name, plus `--shadow-flat` and `--shadow-cta-rest`, base styles and the webapp type scale.
- `design/foundations/components/<Name>.css`: one file per shared component, each lifting straight into `<Name>.module.css`. Every selector starts with the component's root class. Components: AppShell, TopNav, Sidebar, MobileMenu, Button, TextLink, IconButton, Field, Checkbox, OtpInput (plus behaviour in `OtpInput.js`), ImageUpload, StepCounter, StatusLabel, Badge, Avatar, Flag, Price, GameRank, Rating, Card, CoachCard, SessionList, Notice (with CallBanner), Countdown (with HoldTimer), ConfirmStep, EmptyState, Skeleton, ErrorState, Icon, OptionCard, SlotPicker, AudioPlayer, ReviewItem, PriceBreakdown, Spinner, Gallery. All of them are shown on the component library page.
- `design/foundations/icons.js`: the line icon sprite (24px grid, 1.8 stroke). Use `<svg class="icon"><use href="#i-name"/></svg>`. Add new icons here in the same style (Phase 2 will likely need microphone, camera, screen share, chat, end call). `design/foundations/flags.js`: simplified country flags (ph, sg, my).
- `design/foundations/mockup.css` and `mockup.js`: the mockup harness, not product code. Pages put each state in `<section data-state="id" data-label="Label">` inside `<div class="mk-frame" data-page="NN Page">`; the harness builds the state switcher and the desktop/phone toggle. `window.mk.set(stateId, "desktop" | "phone")` switches from script. A state with `data-shell="name"` is wrapped in `<template id="shell-name">` (the app shell, written once per page) and `data-nav="key"` marks the current sidebar link. The harness also wires the burger menu. Use a 2-digit `data-page` name, e.g. `06 Session detail`.
- Mockup behaviour (a page's own interactions) goes in a `<script>` in the page; behaviour that belongs to a shared component goes in `foundations/components/<Name>.js` beside its stylesheet (as `OtpInput.js`), included before `mockup.js`. `build.mjs` inlines local scripts.
- Responsive rules are container queries on a container named `app` (the app shell; the mockup frame in the harness), not media queries. Breakpoints in use: 1099px (two-column page bodies stack), 999px (sidebar folds into the burger menu), 640px, 560px, 520px, 400px.
- Top nav is 76px tall (68px below 1000px). Sticky elements sit under it: the sidebar at `top: 76px`, sticky side panels at `top: 100px`.

**Reuse these components on every page.** If a page needs a new shared part, add it as a new component file and to the component library page (and its section in canvas.py's library rows if you add a new library section), and tell me, rather than styling it inside the page. Page-only layout goes in the page's own `<style>` block (it becomes that page's `page.module.css`).

## How pages are built and published

- Build a publishable copy: `node design/tools/build.mjs design/pages/<page>.html <outDir>`. It inlines the CSS and JS and copies the logo next to the page.
- Publish the built file as a private artifact, passing the logo as a supporting file (`files: {"harbourly-logo.png": "<outDir>/harbourly-logo.png"}`). A new page is a new artifact (no `url`; give it an `icon`). To update an existing page, publish to its existing link (`url`) so the link never changes. Add each new page's link to its phase in BUILD-ORDER.md and to the table above.
- Publishing over a link this chat hasn't published is refused once with a diff of the live version. If the diff shows only your own edits (it should: these pages only change from the repo), publish the same file again; if that's refused as "identical content", publish it once more and it goes through.
- Render the frames: `node design/tools/render.mjs <outDir>/<page>.html <framesDir> <prefix>` (prefix `06`, `07`, `08`). It renders every state at 1440 and 390 wide, at 2x, as `<prefix>__<state>__<desktop|phone>.png`. Playwright is installed globally; a test script of your own loads it with `createRequire(import.meta.url)(execSync('npm root -g').toString().trim() + '/playwright')`. Use one to click through interactive behaviour before publishing.
- Review renders cheaply: `python3 design/tools/sheet.py out.png <cropHeightCss> <scale> frame1.png frame2.png …` makes a contact sheet.
- When replacing existing frames later, keep the previous renders and run `python3 design/tools/framediff.py <old> <new>`; spinners and skeletons animate, so a small box on one isn't a change.

## The canvas

- **Never create a second canvas.** All frames go on https://claude.ai/artifact/AqzF4kYNMmXf555w8KbJpZ.
- Each frame is one artboard: a `.dc.html` that only shows an uploaded PNG at its true CSS size (PNG pixels ÷ 2). Board titles follow "NN Page · State · Width", e.g. "06 Session detail · Pending confirmation · Phone". File names are `<prefix>-<state>-<desktop|phone>.dc.html`.
- Layout: each state is a pair (desktop, then phone 80 px to its right), 200 px between pairs, three pairs per row, 200 px between rows. A `title1` note names the phase and each page, and a green sticky to the left of each page links its interactive version and source file. Phase 1 runs from y = 20,720 to about y = 54,200; Phase 2 goes below it.
- For Phase 2: add its entry to `PHASES` in `design/tools/canvas.py` (`("phase2", "Phase 2 · The session and after", [("06", "06 Session detail", "06-session-detail.html", "<its artifact url>"), …])`), so publish the pages first. canvas.py only adds the checkpoint sticky for Phase 1: add the same for Phase 2 ("Checkpoint 3: session lifecycle, pages 06 to 08.").
- To place frames:
  1. Copy the PNGs into a temporary folder **inside the repo** (e.g. `.frames-upload/`; the uploader takes files from the working directory only), upload them as canvas assets in batches of up to 25 (`asset: true`, `file_paths`), and write each `<prefix>__<state>__<width> <asset id>` line into a blobs file. Every frame of a new page must be in the blobs file (new artboards have nothing to fall back on). Delete the folder afterwards; never commit it.
  2. canvas.py reads frames from `<framesDir>/<prefix>/<key>.png`, so put each page's renders in a folder named after its prefix.
  3. **Read `project/canvas.json` from the canvas right before publishing** (uploads and the editor both bump its version). When replacing existing artboards, read those `project/<file>.dc.html` files too, in the same call (`paths`); the publish is refused for any existing file you haven't read. New artboards need no read.
  4. Run `python3 design/tools/canvas.py <that canvas.json> <blobs file> <framesDir> <outRoot>`. It writes the artboards for the uploaded frames, re-flows every row and keeps everything else; it prints the `files` map.
  5. Publish with `url` = the canvas, `root` = outRoot, `file_path` = `<outRoot>/project/canvas.json`, `files` = the printed map. If it's refused for not having viewed the latest version, read the canvas url (no path), then publish again.
- Changes always go through the HTML page first, then the frames are re-rendered and replaced.

## Visual rules (summary; full list in DECISIONS.md)

- Dark theme only. Flat surfaces: page `--bg`, cards solid `--surface`, insets `--bg-mid`, one slight shadow `--shadow-flat`. Only the top nav keeps blur and transparency.
- Green glow only as a deliberate accent: a thin glowing top line on the one card that matters most, stronger on hover. Primary buttons rest with `--shadow-cta-rest` and get the halo on hover. Secondary button: outline pill with a `--line-strong` border. Inputs also use `--line-strong`.
- Amber outline button only for the final step of a cancel or delete. Confirm steps open in place, never as a pop-up. In-call reminders are banners, never modals.
- No background grid, film grain or hero glow in the webapp.
- Fonts: Sora headings, Geist body and UI, Geist Mono for data and labels. No other fonts.
- Status: mono label with a coloured dot. Green = confirmed, in session, completed, verified. Amber = needs action (awaiting payment, pending confirmation, disputed, reschedule requested). Muted = ended (expired, refunded, past, resolved disputes). No red.
- Icons: inline SVG line icons only, from the sprite.

## Avoid ("not AI-looking")

Purple, indigo or blue-to-pink gradients, gradient text, colours outside the palette; glassmorphism except the top nav; emoji, sparkle icons, mixed icon styles; three-column grids of identical icon-in-a-square feature cards; centring by default; identical padding and weight everywhere with no hierarchy; badges scattered everywhere (only where they carry real status); placeholder copy, "John Doe", invented stats, marketing filler; blobs, abstract illustrations, stock imagery; heavy shadows, glow everywhere, hover effects on non-interactive things. No charts, trends or analytics on dashboards.

## Content and copy

Realistic content: fictional gamer handles only (no real people), the 5 games (Mobile Legends, Call of Duty: Mobile, Valorant, Counter-Strike 2, Riftbound), free-text ranks, prices like "S$45 / session" and "from ≈ S$43", times in the viewer's zone (e.g. `20:00 SGT`), real session states. Sentence case, British English, short and direct, plain voice. Same action, same label everywhere ("View session", "Join session", "Request a new time", "Cancel booking", "Report a problem").

Keep using the same cast. Phase 1 mockups are set at Mon 5 Oct 2026, 14:10 SGT, viewer in Singapore (SGT, SGD). Phase 2 states need different "now"s (before, during and after a session): propose them in your first message. Full cast details (country, languages, time zone, ranks, prices) are in DECISIONS.md; bios are in `design/pages/01-browse-coaches.html`.
- **Kairo** `@kairo.gg`, Philippines, English and Filipino, PHT. Verified, 4.9 (57). Mobile Legends `Mythical Glory · 85★` at ₱1,850 (≈ S$43); Call of Duty: Mobile `Legendary · Top 500` at ₱2,100 (≈ S$49). Paid with Xendit.
- **Vexa** `@vexa`, Singapore, English and Mandarin, SGT. Verified, 4.8 (32). Valorant `Immortal 2` at S$45. Paid with Stripe.
- **nullpoint** `@nullpoint`, Malaysia, English and Malay, MYT. New Coach, no reviews. Counter-Strike 2 `Premier 21,450` at RM 150 (≈ S$43).
- **Mirae**, **Ghostline** and filler coaches Lumen, Pallas, Marlowe, Kestrel, Tidewalker, Rook, Hanabi.
- Logged-in gamer: **snapking**, with a booking with Kairo on Tue 6 Oct, 20:00 SGT. The booking made in Phase 1: Kairo, Mobile Legends, Wed 7 Oct, 20:00–21:00 SGT, ₱1,961.00 total (₱1,850.00 + ₱111.00 platform fee, 6%). Same-currency example: Vexa, S$45.00 + S$2.70 = S$47.70. Coach views of session detail are Kairo's view of snapking's booking.

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
- **Rank proof check (kept, 23 Oct 2026; may be dropped later):** ranks stay checked against proof screenshots at application and on every rank change, as DECISIONS.md "Ranks" says. "Credentials: optional" on the landing page means the portfolio only. If it's dropped later, this changes in the webapp: 17 Application step 1 loses "proof of your rank" from "What you'll need"; 18 Application step 2 loses the proof images (up to 5), their upload error state, and the rejection reasons about proof ("proof doesn't show the rank claimed", "proof images unclear"); 22 Coach profile settings: "Update rank" goes live at once (no screenshot, no pending state, no old rank held), and "Add a game" may need no proof (then no "under review" listing, also on the coach dashboard, 19); the "Rank update: approved or declined" email goes; DECISIONS.md "Ranks" ("checked against proof screenshots", "rank stored as checked free text"), "Coach location and identity" (what you'll need), "Rejected coach applications" (reason examples) and the Uploads table's rank-proof row change; USER-FLOW.md diagrams for the application (step 2) and coach settings (add a game) change. Pages 01 to 05 don't change: they show the rank the same way either way. The held-back idea of a "Rank checked by Harbourly" line would then be off the table.
- **Post-MVP:** several sessions in one checkout, and session packs.
- **When building:** confirm on a real iPhone that camera photos convert to JPEG on upload.
- **Before code is built (not before design):** confirm coach launch countries with Stripe and Xendit (including Thailand), pick an exchange-rate source, pick the image moderation service (options in BUILD-ORDER.md), finalise chat retention with the Terms of Service.

## Next step

First reconcile the policy changes on `main` with me (section above) and record the answers. Then send me your understanding of 06, 07 and 08, the gaps you found, and your recommendations. After I answer, build 06 Session detail, 07 Report a problem and 08 Live session, publish each as a new artifact, put their frames on the canvas under "Phase 2 · The session and after", update BUILD-ORDER.md with the links, commit and push, and stop for checkpoint 3.
