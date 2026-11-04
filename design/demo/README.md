# Harbourly webapp demo (gamer side, Phases 1 to 4)

A clickable demo of design pages 01 to 16 linked as one app. Open `index.html` (the start screen) from a local server at the repo root, for example `python3 -m http.server` and then `http://localhost:8000/design/demo/`.

## What it does

- **One app.** Links between pages open in the same tab at the right state, for example `06-session-detail.html#upcoming`.
- **Logged in or out.** The demo remembers whether you're logged in as snapking. Logged out, 01 to 03 show their logged-out states, and Book leads to Log in or Sign up. Logging in or finishing setup from a booking returns you to the same time (03 "Returning after log in").
- **Timed steps.** In-between states move on by themselves when you reach them through the flow: Creating your account, Setting up your account, Logging in, Confirming your payment, Waiting for Kairo, and End request sent. Opened from the Demo panel, they stay put.
- **Demo panel** (bottom left). Jump to any screen and state, preview at phone width, or show clickable areas.
- **Gamer side only.** The coach-side states inside 02, 06, 07 and 08 are left out (Phase 5 onwards). Become a coach, account settings and the coach choice on 13 show a short note.
- **Notes.** Where the next screen is designed with a different booking or coach (for example, only Kairo, Vexa and nullpoint have profile designs), a short note says so.

## Files

- `NN-*.html`: generated copies of `design/pages/NN-*.html`. Don't edit them: edit the source page, then run `node design/tools/demo.mjs`.
- `demo.js`: the demo harness (replaces `mockup.js`), including the wiring for controls the mockups leave inert (`WIRES`).
- `demo.css`: the Demo panel, toast and full-window layout.
- `index.html`: the start screen, with journeys and every screen. The generator fills in the state counts.

## Publishing

`node design/tools/demo.mjs --publish <outDir>` also writes a flat, self-contained copy: styles and scripts inlined, images beside the pages, and the start screen as `index.html` (without its document skeleton) plus `start.html`.

## Presenter walkthrough (20 minutes)

`walkthrough.html` runs the same pages on a fixed 30-step route for presenting in a meeting. Next (→ or Page Down) clicks the highlighted control, a bar at the top shows the chapter and a clock against the 20-minute plan, and N shows the talking points. `guide.html` is the presenter guide: run sheet, talk track for every step, what to cut, likely questions and answers, and what to do if something breaks.

- The route, timings and talking points live in `tour.js` (`CHAPTERS`, `STEPS`); the guide and the walkthrough's run sheet are built from them, so editing a step updates both.
- `node design/tools/demo.mjs --publish <outDir> --start walkthrough.html` writes the walkthrough's publishable copy (walkthrough as the start screen, plus the guide).
