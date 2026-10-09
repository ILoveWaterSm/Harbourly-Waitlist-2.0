# Handoff prompt

Paste everything below the line into a new chat. Last updated 9 Oct 2026, during checkpoint 2 (Phase 1 review).

---

You're joining as the product designer for **Harbourly**, a Southeast Asia-focused esports coaching marketplace. Gamers browse verified coaches, book and pay for one-hour 1-on-1 sessions, hold the session in-app (call, chat, screen share), then confirm and leave a review. Payment is held until the session is confirmed. The brand is built on trust, so every screen should feel calm, precise and dependable, not flashy.

We are designing the actual webapp pages one at a time. Design only, not production code. All planning is recorded in the repo.

**Where we are:** Phase 0 (foundations) is approved (checkpoint 1). Phase 1 (find and book a coach, pages 01 to 05) is built and published, and we're in its review, checkpoint 2. Page 01 Browse coaches has been refined and approved: a new one-per-row coach card and a taller top nav. Page 02 Coach profile has been refined: a new optional Showcase section (up to 5 images with captions, checked automatically on upload; see "Coach profile showcase" in DECISIONS.md) and, at one-column widths, Availability after Games. 02 is done for now. **Next: refine 03 Pick a slot, 04 Checkout summary and 05 Payment return with me, one page at a time, from my feedback.** Don't start Phase 2 until I've signed off checkpoint 2 and said go.

## Repo and branch

Repo: `ILoveWaterSm/Harbourly-Waitlist-2.0`. Checkpoint 1 work is on `main`. Phase 1 work up to the browse refinement was merged to `main`; the page 02 refinement is on `claude/vibrant-curie-s51c0x`. If your branch doesn't have `design/foundations/components/Gallery.css`, merge `origin/claude/vibrant-curie-s51c0x` into it first (a merge commit, no rebase), then work from there.

## Read these first, in this order

1. `design/DECISIONS.md`: every agreed decision. **Source of truth.** Anything not covered here or in the flow needs my approval before it's designed. The newest sections are "Phase 1 decisions", "Browse card and top nav" and "Coach profile showcase".
2. `design/USER-FLOW.md`: the full MVP user flow in 13 Mermaid diagrams. Every page maps to a node here. (Also at https://claude.ai/artifact/8QiSx8pFYigdVWvUsqqXBm; republish `design/user-flow.html` to that link when the flow changes.)
3. `design/BUILD-ORDER.md`: 25 pages in 8 phases plus the 2 foundation items, with every state each page must show, routes, sizes, review checkpoints and the published links.
4. `design/foundations/`: tokens, components, icons, flags and the mockup harness (details below). Read `tokens.css` and the component files before designing anything.
5. The Phase 1 pages in `design/pages/` and `design/explorations/coach-card-v2.html` (the approved card mockup), so you see the patterns already in use.
6. `design-system/README.md` and `design-system/tokens.json`: the brand design system (also at https://claude.ai/artifact/4HHoqwJVacXMMDzG9XLp4n).
7. `design/explorations/mono-specimen.html`: what is set in Geist Mono. Where it differs from DECISIONS.md, DECISIONS.md wins.
8. `landing.html`: brand feel only, not a template.

## What exists

| | Interactive page | Source |
|---|---|---|
| 0.1 Tokens | https://claude.ai/artifact/BSQtCHx4vyrXbfw75WN6Ti | `design/pages/0.1-tokens.html` |
| 0.2 Components | https://claude.ai/artifact/H74MmqqDTxjtC5hv7zo5uu | `design/pages/0.2-components.html` |
| 01 Browse coaches (refined, approved) | https://claude.ai/artifact/S2LvRXMYBbk7uq3xjGTfcC | `design/pages/01-browse-coaches.html` |
| 02 Coach profile (refined: showcase; done for now) | https://claude.ai/artifact/GUw5NpQEWds2tvVRkCVH2Y | `design/pages/02-coach-profile.html` |
| 03 Pick a slot | https://claude.ai/artifact/DoTXw1NFPY7nMf64rrNVV9 | `design/pages/03-pick-a-slot.html` |
| 04 Checkout summary | https://claude.ai/artifact/EFj1Br4ak4Xnd7935vocsw | `design/pages/04-checkout-summary.html` |
| 05 Payment return | https://claude.ai/artifact/HSpMwJ9o7dDJAEYaDy6wUa | `design/pages/05-payment-return.html` |
| Coach card v2 (exploration) | https://claude.ai/artifact/WsAyxiSS39SwGyE3QYp3Xn | `design/explorations/coach-card-v2.html` |
| Canvas, "Harbourly webapp" | https://claude.ai/artifact/AqzF4kYNMmXf555w8KbJpZ | 88 frames: every library section and every Phase 1 state, desktop and phone |

- `design/foundations/tokens.css`: the global stylesheet. Every design-system token by its exact name, plus `--shadow-flat` and `--shadow-cta-rest`, base styles and the webapp type scale.
- `design/foundations/components/<Name>.css`: one file per shared component, each lifting straight into `<Name>.module.css`. Every selector starts with the component's root class. Components: AppShell, TopNav, Sidebar, MobileMenu, Button, TextLink, IconButton, Field, Checkbox, OtpInput, ImageUpload, StepCounter, StatusLabel, Badge, Avatar, Flag, Price, GameRank, Rating, Card, CoachCard, SessionList, Notice (with CallBanner), Countdown (with HoldTimer), ConfirmStep, EmptyState, Skeleton, ErrorState, Icon, OptionCard, SlotPicker, AudioPlayer, ReviewItem, PriceBreakdown, Spinner, Gallery. All of them are shown on the component library page.
- `design/foundations/icons.js`: the line icon sprite (24px grid, 1.8 stroke). Use `<svg class="icon"><use href="#i-name"/></svg>`. Add new icons here in the same style. `design/foundations/flags.js`: simplified country flags for mockups (`<span class="flag" role="img" aria-label="Philippines"><svg><use href="#flag-ph"/></svg></span>`; ph, sg, my so far).
- `design/foundations/mockup.css` and `mockup.js`: the mockup harness, not product code. Pages put each state in `<section data-state="id" data-label="Label">` inside `<div class="mk-frame" data-page="NN Page">`; the harness builds the state switcher and the desktop/phone toggle. `window.mk.set(stateId, "desktop" | "phone")` switches from script. A state with `data-shell="name"` is wrapped in `<template id="shell-name">` (the app shell, written once per page) and `data-nav="key"` marks the current sidebar link, so each state is a full page without repeating the shell. The harness also wires the burger menu.
- Responsive rules are container queries on a container named `app` (the app shell; the mockup frame in the harness), not media queries. Breakpoints in use: 1099px (two-column page bodies stack), 999px (sidebar folds into the burger menu), 640px, 560px, 520px, 400px.
- Top nav is 76px tall (68px below 1000px). Sticky elements sit under it: the sidebar at `top: 76px`, sticky side panels at `top: 100px`.

**Reuse these components on every page.** If a page needs a new shared part, add it as a new component file and to the component library page, and tell me, rather than styling it inside the page. Page-only layout goes in the page's own `<style>` block (it becomes that page's `page.module.css`).

## How we refine a page

- Edit the page's HTML in `design/pages/` directly; it is the source of truth. (Phase 1 pages were first generated by a script that isn't in the repo; the HTML is what matters now.)
- When I ask for a layout change I haven't seen, confirm your understanding first, and if the change is big, make a quick exploration in `design/explorations/` (as with `coach-card-v2.html`), publish it, show me the renders, and build only after I approve.
- Build, render and look at the result once before publishing; fix what it shows. Checking the phone width matters as much as desktop.
- Republish to the page's existing link, replace its frames on the canvas, update DECISIONS.md (and BUILD-ORDER.md and the flow if they change), commit and push.

## How pages are built and published

- Build a publishable copy: `node design/tools/build.mjs design/pages/<page>.html <outDir>`. It inlines the CSS and JS and copies the logo next to the page.
- Publish the built file as a private artifact, passing the logo as a supporting file (`files: {"harbourly-logo.png": "<outDir>/harbourly-logo.png"}`). To update a page that already exists, publish to its existing link (`url`) so the link never changes. A link this chat hasn't published must be read first (Artifact read on the url); if the service asks for a full read, read the saved file in full, check it holds nothing your new build lacks, then publish again.
- Render the frames: `node design/tools/render.mjs <outDir>/<page>.html <framesDir> <prefix>`. It renders every state at 1440 and 390 wide, at 2x (the prefix is `01`, `02` … or `0-2` for the library, and frames land as `<prefix>__<state>__<desktop|phone>.png`).
- Review renders cheaply: `python3 design/tools/sheet.py out.png <cropHeightCss> <scale> frame1.png frame2.png …` makes a contact sheet.
- Before replacing canvas frames, keep a copy of the previous renders and run `python3 design/tools/framediff.py <old> <new>`. Spinners and skeletons animate, so a small difference box on a spinner isn't a change: don't replace those frames.

## The canvas

- **Never create a second canvas.** All frames go on https://claude.ai/artifact/AqzF4kYNMmXf555w8KbJpZ.
- Each frame is one artboard: a `.dc.html` that only shows an uploaded PNG at its true CSS size (PNG pixels ÷ 2). Board titles follow "NN Page · State · Width", e.g. "01 Browse coaches · No results · Phone". File names are `<prefix>-<state>-<desktop|phone>.dc.html`.
- Layout: each state is a pair (desktop, then phone 80 px to its right), 200 px between pairs, three pairs per row, 200 px between rows. A `title1` note names the phase and each page, and a green sticky to the left of each page links its interactive version and source file. Phase 0 ends at about y = 20,100; Phase 1 runs from y = 20,720 to about y = 54,150.
- To replace frames:
  1. Copy the changed PNGs into a temporary folder **inside the repo** (e.g. `.frames-upload/`; the uploader takes files from the working directory only), upload them as canvas assets in batches of up to 25 (`asset: true`, `file_paths`), and write each `<prefix>__<state>__<width> <asset id>` line into a blobs file. Delete the folder afterwards; never commit it.
  2. **Read `project/canvas.json` from the canvas right before publishing** (uploads and the editor both bump its version).
  3. Run `python3 design/tools/canvas.py <that canvas.json> <blobs file> <framesDir> <outRoot>`. It writes the artboards for the uploaded frames, re-flows every row to the new heights and keeps everything else; it prints the `files` map. Frames without a new upload keep their current artboard.
  4. Publish with `url` = the canvas, `root` = outRoot, `file_path` = `<outRoot>/project/canvas.json`, `files` = the printed map. If it's refused for not having viewed the latest version, read the canvas url (no path), then publish again.
- For a new phase, add it to `PHASES` in `design/tools/canvas.py`.
- Changes always go through the HTML page first, then the frames are re-rendered and replaced.

## Visual rules (summary; full list in DECISIONS.md)

- Dark theme only. Flat surfaces: page `--bg`, cards solid `--surface`, insets `--bg-mid`, one slight shadow `--shadow-flat`. Only the top nav keeps blur and transparency.
- Green glow only as a deliberate accent: a thin glowing top line on the one card that matters most, stronger on hover. Primary buttons rest with `--shadow-cta-rest` and get the halo on hover. Secondary button: outline pill with a `--line-strong` border. Inputs also use `--line-strong`.
- Amber outline button only for the final step of a cancel or delete. Confirm steps open in place, never as a pop-up.
- No background grid, film grain or hero glow in the webapp.
- Fonts: Sora headings, Geist body and UI, Geist Mono for data and labels. No other fonts.
- Status: mono label with a coloured dot. Green = confirmed, in session, completed, verified. Amber = needs action. Muted = ended. No red.
- Icons: inline SVG line icons only, from the sprite.

## Avoid ("not AI-looking")

Purple, indigo or blue-to-pink gradients, gradient text, colours outside the palette; glassmorphism except the top nav; emoji, sparkle icons, mixed icon styles; three-column grids of identical icon-in-a-square feature cards; centring by default; identical padding and weight everywhere with no hierarchy; badges scattered everywhere (only where they carry real status); placeholder copy, "John Doe", invented stats, marketing filler; blobs, abstract illustrations, stock imagery; heavy shadows, glow everywhere, hover effects on non-interactive things. No charts, trends or analytics on dashboards.

## Content and copy

Realistic content: fictional gamer handles only (no real people), the 5 games (Mobile Legends, Call of Duty: Mobile, Valorant, Counter-Strike 2, Riftbound), free-text ranks, prices like "S$45 / session" and "from ≈ S$43", times in the viewer's zone (e.g. `20:00 SGT`), real session states. Sentence case, British English, short and direct, plain voice.

Keep using the same cast so pages stay consistent. Mockups are set around Mon 5 Oct 2026, 14:10 SGT, viewer in Singapore (SGT, SGD). Full cast details (country, languages, time zone, ranks, prices) are in DECISIONS.md; bios are in `design/pages/01-browse-coaches.html`.
- **Kairo** `@kairo.gg`, Philippines, English and Filipino, PHT. Verified, 4.9 (57). Mobile Legends `Mythical Glory · 85★` at ₱1,850 (≈ S$43); Call of Duty: Mobile `Legendary · Top 500` at ₱2,100 (≈ S$49). Paid with Xendit. Free this week: Mon 19, 21, 22; Tue 19, 21, 22; Wed 19 to 22; Thu 20, 21; Sat 14, 15, 16, 20, 21; Sun 14, 15 (all :00 SGT).
- **Vexa** `@vexa`, Singapore, English and Mandarin, SGT. Verified, 4.8 (32). Valorant `Immortal 2` at S$45. Paid with Stripe. Nothing free this week; next free Tue 13 Oct, 20:00 SGT.
- **nullpoint** `@nullpoint`, Malaysia, English and Malay, MYT. New Coach, no reviews, no voice intro. Counter-Strike 2 `Premier 21,450` at RM 150 (≈ S$43).
- **Mirae** (Singapore; Riftbound and Valorant, from S$38), **Ghostline** (Malaysia; Call of Duty: Mobile, RM 120 ≈ S$34), and filler coaches Lumen, Pallas, Marlowe, Kestrel, Tidewalker, Rook, Hanabi. 19 coaches are listed in total.
- Logged-in gamer: **snapking**, with a booking with Kairo on Tue 6 Oct, 20:00 SGT. Platform fee 6% (S$2.70 on S$45; ₱111.00 on ₱1,850).
- The booking used through pages 03 to 05: Kairo, Mobile Legends, Wed 7 Oct, 20:00–21:00 SGT, ₱1,961.00 total. The under-24-hours example is Mon 5 Oct, 21:00 SGT.

## How I like to work

- Explain any non-obvious design decision in one sentence.
- If anything in the feature list, flow or decisions is ambiguous, **ask me before guessing**. Never add features, sections or data without asking.
- Record every new decision I approve in `design/DECISIONS.md`; keep `USER-FLOW.md` and `BUILD-ORDER.md` in sync if anything changes. Add each page's artifact link to its phase in `BUILD-ORDER.md`.
- Commit and push work to the designated branch as you go (the repo's stop hook requires it). Don't open pull requests unless I ask.
- I'm not a design specialist on token and type-scale questions; recommend a choice and explain briefly.
- I care about Pro usage: build each page once, well, rather than duplicating work. Look at each render once before publishing and fix what it shows.
- Each phase ends with a review checkpoint. Don't start the next phase until I've reviewed.

## Open items

- **Avatar and showcase images:** I'll supply fictional avatar images and showcase images. Until then, avatars show the default (first letter in Sora) and showcase images are marked empty slots. When they arrive, use them for the cast above (Kairo has 5 showcase images, Vexa 1, nullpoint none).
- **Image moderation service** (before code is built): pick the automatic check for every public image (profile photos, banners, showcase images and captions; see "Automatic image check" in DECISIONS.md); options are in BUILD-ORDER.md.
- **Sign-up password (assumed, not confirmed):** email sign-ups enter email and password once, on the sign-up page, and "Finish setting up" doesn't ask again; Google sign-ups never set a password. Check with me when designing sign-up (Phase 4).
- **Phase 6:** voice intro length and portfolio format are still to decide.
- **Languages field:** coaches pick the languages they coach in (shown on the browse card and profile). Design the field in profile setup (page 21) and coach profile settings (page 22).
- **Logged-out currency (assumed, not confirmed):** logged-out visitors see SGD in the mockups; how a logged-out visitor's currency is chosen (e.g. from location) is still to decide.
- **Ideas I held back (not approved):** a "Rank checked by Harbourly" line under ranks; a one-line explanation of "New coach"; a sticky Continue bar on phone for Pick a slot. Raise them only if relevant.
- **When building:** confirm on a real iPhone that camera photos convert to JPEG on upload.
- **Before code is built (not before design):** confirm coach launch countries with Stripe and Xendit (including Thailand), pick an exchange-rate source, finalise chat retention with the Terms of Service.

## Next step

Checkpoint 2 continues: I'll give you feedback on 02 Coach profile, 03 Pick a slot, 04 Checkout summary and 05 Payment return, one page at a time. For each, confirm your understanding (and any open question) before changing anything, then refine the page, re-render, republish to its existing link and replace its frames on the canvas. When I sign off checkpoint 2 and say go, start **Phase 2: The session and after** from `BUILD-ORDER.md` (6 Session detail, 7 Report a problem, 8 Live session), with its frames under a "Phase 2 · The session and after" title, then stop for **checkpoint 3**.
