# Handoff prompt

Paste everything below the line into a new chat. Last updated 4 Nov 2026 (start of Phase 6). Phases 0 to 5 are built and published, and checkpoint 6 is closed. The Phase 5 brief that came before this one is in git history (commit `2faa7df` and earlier). What was decided and built in each phase is in DECISIONS.md and BUILD-ORDER.md.

---

You're joining as the product designer for **Harbourly**, an esports coaching marketplace focused on Southeast Asia. Gamers browse coaches whose identity has been checked. They book and pay for one-hour 1-on-1 sessions and hold the session in the app (call, chat, screen share). Afterwards they confirm the session and leave a review. Payment is held until the session is confirmed. The brand is built on trust, so every screen should feel calm, precise and dependable, not flashy.

We are designing the real webapp pages one at a time. This is design only, not production code. All planning is recorded in the repo.

**Where we are:**

| Phase | Pages | Status |
|---|---|---|
| 0 Foundations | | Approved at checkpoint 1 |
| 1 Find and book a coach | 01 to 05 | Closed at checkpoint 2, 16 Oct 2026 |
| 2 The session and after | 06 Session detail, 07 Report a problem, 08 Live session | Closed at checkpoint 3, 21 Oct 2026 |
| 3 The gamer's home | 09 Gamer dashboard, 10 My sessions | Built 23 Oct 2026; 09 redesigned 28 Oct 2026 |
| 4 Sign up, log in, account access | 11 to 16 | Closed at checkpoint 5, 30 Oct 2026 |
| 5 Becoming a coach | 17 to 21 | Closed at checkpoint 6, 4 Nov 2026, no changes |
| **6 Running a coach profile** | **22 Coach profile settings, 23 Coach sessions** | **Your task now** |
| 7 Account and system pages | 24 Account settings, 25 System pages | Next, after checkpoint 7 |

**The plan from here (the owner's order):** build Phase 6, then Phase 7, both with the new research practice below. Only after both are done does the owner review Phases 1 to 5 for improvements. Until then, earlier pages change only where a Phase 6 or 7 decision reaches them (a link, a new state, a shared component), and you say which ones.

**What Phase 5 settled that Phase 6 builds on** (DECISIONS.md, "Phase 5 decisions"):
- **No coach dashboard before approval.** Draft, under review, changes needed, the 14-day wait and not eligible live on the application page (18), reached from "Your coach application" in the Gamer block. The Coach block appears at approval with Coach dashboard; **Coach sessions appears once the coach is live.**
- **19 Coach dashboard, live,** mirrors 09: banner with "Preview my public profile", a To do box (the accent), and Coming up, Money (held and released per session, no totals), Your games and Reviews. Kairo's live state is set at **Mon 5 Oct 2026, 14:12 PHT**. Its "Manage" links (one per game) and "All coach sessions" are the inert links Phase 6 brings to life.
- **Shared parts from Phase 5** that 22 reuses: WeekHours (availability editor), the checkbox grid (languages), Field `fieldPrefix` (price with currency mark) with the payout line, upload rows (uploading, checking, live, refused, failed, caption), single photo and banner (`uploadMedia`, `uploadBanner`), SaveStatus, the Notice error summary, Checklist. Rules for them: languages a fixed list, 1 to 4; credentials up to 3 per game, 60 characters; prices in whole units with the floor shown up front ("At least S$10 a session.", "The lowest price is S$10."); image checks never block the form.
- **Cast data already shown on 19 live** that 22 and 23 must agree with: Kairo's games (Mobile Legends `Mythical Glory · 85★` ₱1,850; Call of Duty: Mobile `Legendary · Top 500` ₱2,100); a **rank update under review** (Mobile Legends `Mythical Glory · 92★`, sent Sun 4 Oct, 85★ shown until approved); his bookings at 14:12 (snapking Tue 6 Oct and Wed 7 Oct 20:00 PHT; milo.exe Fri 9 Oct 20:00 with a reschedule request; ozzie Sat 3 Oct 17:00 disputed; tamtam Sat 3 Oct 21:00 pending, released Tue 6 Oct 22:00; ricebowl Thu 1 Oct, nightjar Mon 28 Sep and milo.exe Sun 27 Sep released). Kairo's other students are his reviewers from 02 (ricebowl, tamtam, nightjar, ozzie, milo.exe), all in the Philippines.

**Your task now: build Phase 6, "Running a coach profile".** The pages are:
- **22** Coach profile settings
- **23** Coach sessions

The full spec is in `design/BUILD-ORDER.md`, "Phase 6". Work the way Phases 4 and 5 were built:
1. Read everything below.
2. **Research first** (the next section).
3. Send me **one message** with what you looked at and what you're taking from it, your understanding of each page, a link map and every gap, with your recommendations.
4. **Build only after I answer.**
5. Build each page once, well.
6. Render and check every state at desktop and phone, and click through every link.
7. Publish each page.
8. Put the frames on the canvas under a "Phase 6 · Running a coach profile" title.
9. **Stop for checkpoint 7** ("coach side complete"). Don't start Phase 7 until I've reviewed.

**What makes Phase 6 different:** 22 is the place a live coach comes back to again and again, for years, to keep their public profile true: their bio and photos, the languages and hours they coach, their prices, their ranks, the games they offer, their voice intro, showcase and portfolio. Several of those changes go live at once, some wait for an automatic image check, and some wait for the team (a rank update, a new game, a voice intro, a portfolio), while the old version stays visible to gamers. The quality bar is **a coach always knows exactly what gamers see right now, what's waiting for a check or the team, and what will change when**. 23 is the coach's complete record of their sessions, the counterpart of 10 My sessions. Diagram 9 (managing a live profile) must be reproduced exactly.

## Research before you design (new from Phase 6, and for every phase after)

Before you propose a page, study how the best products solve the same problem, so the layout and placement of every part rest on what's proven to work, not on guesswork.

**What to look at, for each page:**
- 3 to 5 well-regarded products that do the same job, in a similar spirit (calm, trustworthy, marketplace or account tools rather than flashy consumer apps). For 22: how sellers, hosts and professionals manage a public listing or profile (for example a rental host's listing editor, a freelance marketplace's seller profile, a coaching or tutoring platform's coach settings, a scheduling tool's availability editor, a payments dashboard's settings). For 23: booking and session lists (scheduling tools, payments and orders lists).
- What they put first and what they hide behind a click; how they group sections; where the primary action and Save sit; how they show "live now" against "pending review"; how they preview the public result; how they handle empty, error and pending states; what they do on a phone.
- The established principles behind good layouts: Nielsen's usability heuristics (visibility of system status, match with the real world, user control, consistency, error prevention, recognition over recall), WCAG 2.2 AA, Fitts's law for target size and placement, progressive disclosure, Gestalt grouping and proximity, form design best practice (one column, labels above fields, inline validation on leaving a field, errors that say how to fix them), and clear information hierarchy.

**How to use it:**
- **Inspiration, never a copy.** Take the pattern and the reason it works, then express it in Harbourly's own system. Never recreate a real product's design, and never put real product names, logos, branding or recognisable layouts in the mockups.
- **What's decided wins.** DECISIONS.md, the visual rules and the design system always beat research. If research suggests something that conflicts with them, or adds a feature, section or data that isn't decided, raise it as a recommendation for me to approve. Never build it quietly.
- **Keep it proportionate.** A bounded pass, about 3 to 5 references per page, is enough. Prefer well-known, current products and published design guidance; skip trend pieces and Dribbble-style concept shots, which look good but haven't been tested by real use.

**How to report it:** in your first message, a short section per page, **"What I looked at and what I'm taking from it"**: each reference in one line (what it is, the one thing worth borrowing and why), then how it shaped your proposal. Say where you deliberately did something different, and why. When a recommendation in your gaps list comes from research, say so.

## Phase 6 at a glance

This is drawn from the flow and decisions. Check it against them; don't trust this summary alone.

**Diagram 9 is the spec.** From the Coach dashboard:
- **Coach profile settings (22):**
  - Edit bio, avatar, banner, languages. Photos checked automatically on upload.
  - Edit weekly availability, in your own time zone.
  - Edit price per game, not below the floor (S$10, RM 35, ₱430). A booked session keeps the price it was booked at.
  - Update rank: a new screenshot; the old rank is shown until the team approves the new one.
  - Add a game: rank and proof; the listing is under review until approved.
  - Record a voice intro: pending, then approved or declined.
  - Showcase: up to 5 images with optional captions (80 characters); add, replace, remove, reorder, edit captions; each checked automatically (checking, live, or refused with a reason); a replaced image stays live until its replacement passes; empty (no showcase).
  - Submit a portfolio: reviewed by hand, shown on your profile if it passes, or "didn't pass" with the reason. It never grants a badge and never shortens the New Coach period.
  - Preview my public profile: opens 02 in preview mode (02 `preview` exists, for Kairo, with "Back to profile settings").
- **Payout settings** (20 `live`, built).
- **Coach sessions list (23)** → Session detail, coach view (06's coach states).
- **Open disputes involving you** → Session detail (shown on 19 live's To do, built).

**23 Coach sessions** (BUILD-ORDER): a plain list: gamer, date and time, status, the amber "Reschedule requested" second line. States: list, empty, loading, error. Its gamer-side counterpart is 10 My sessions (two groups, Upcoming soonest first and Past newest first, rows open 06, "Load more" after 20, no amounts, no filters, full width). Coaches never see awaiting-payment or expired bookings.

**Uploads and checks** (DECISIONS.md "Uploads", "Automatic image check for every public image", "Coach profile showcase"): rank proof is private (no automatic check, up to 5, 10 MB, JPG, PNG or WebP); profile photo, banner and showcase are public and checked; uncertain counts as refused; no email for the image check; the fixed refusal lines.

**Emails** (not drawn): "Rank update, new game listing, voice intro: approved or declined" and "Portfolio result". Screens must not contradict them.

**Not in Phase 6:** 24 Account settings (the account photo outside coach settings, name, email, password, phone, country, delete account) and 25 System pages are Phase 7. Suspended and banned coach states stay out unless you find they belong here; ask.

## Repo and branch

Repo: `ILoveWaterSm/Harbourly-Waitlist-2.0`. `main` has the work up to the browse refinement. Everything since then is on `claude/funny-johnson-7e9olg`, not merged to `main` yet: Phases 1 to 5, their refinements, the 23 Oct policy update and these docs. It already contains `claude/serene-feynman-pavlc0` and the branches before it.

If your branch doesn't have the "Checkpoint 6 outcomes" section in `design/DECISIONS.md`, merge `origin/claude/funny-johnson-7e9olg` into it first, then work from there. Use a merge commit, not a rebase.

## Read these first, in this order

1. **`design/DECISIONS.md`:** every agreed decision, and the **source of truth**. Anything not covered here or in the flow needs my approval before it's designed. These are the sections Phase 6 leans on most:

   | Section | What it settles for Phase 6 |
   |---|---|
   | "Core product decisions" | Coach games and rates; adding a game later goes through review; the New Coach label |
   | "Ranks" | Free-text rank, about 40 characters; a rank change needs a new screenshot and the old rank stays visible until approved |
   | "Uploads" | Limits and error lines; voice intro length and portfolio format are **still to decide in Phase 6** |
   | "Automatic image check for every public image" | Photo, banner, showcase: checking, live, refused; a replaced image stays until its replacement passes |
   | "Coach profile showcase" | What it is; 22 adds, replaces, removes, reorders and edits captions |
   | "Policy update, 23 Oct 2026" | Portfolio (reviewed by hand, never a badge); price floor; booked sessions keep their price |
   | "Emails" | Coach journey: rank update, new game, voice intro, portfolio results |
   | "Account and system pages" | "Preview my public profile" |
   | "Phase 1 decisions" | 02's profile: voice intro player (mocked at 0:45), reviews, availability preview |
   | "Phase 2 decisions" | The coach view of 06 (price, commission, payout; times in the coach's zone) |
   | "Phase 3 decisions" | 10 My sessions, the model for 23 |
   | "Phase 5 decisions" | Everything 22 reuses (languages, credentials, availability, prices, image checks), the coach shells, 19 live's data and links |
   | "Checkpoint 6 outcomes" | The order of work and the research practice |
   | "Visual rules for the webapp", "Navigation and identity" | |

2. **`design/USER-FLOW.md`:** the full MVP user flow in 13 Mermaid diagrams.
   - **Phase 6 is diagram 9 (live coach: managing the profile), line by line.**
   - Also diagram 8's end (live, the New Coach period), diagram 12 (live, suspended, banned), diagram 13 (the Coach block: Coach sessions once live) and diagram 3 (what gamers see on the profile).
   - It's also published at https://claude.ai/artifact/8QiSx8pFYigdVWvUsqqXBm. If the flow changes, run `python3 design/tools/flowsync.py` to copy every diagram and note into `design/user-flow.html`, then republish it to that link.

3. **`design/BUILD-ORDER.md`:** 25 pages in 8 phases, with every state each page must show, its route, size, checkpoint and published link. Phase 6 lists the states of 22 and 23; Phase 7 lists 24 and 25, so you can see what is deliberately left out.

4. **`design/foundations/`:** tokens, components, icons, flags and the mockup harness (details below). Read `tokens.css` and the component files before designing anything.
   - The main parts for Phase 6: **WeekHours**, **Checkbox** (grid), **Field** (prefix, counter, error, label row), **ImageUpload** (rows, single media, banner), **SaveStatus**, **Notice** (error summary), **AudioPlayer** (the voice intro as gamers hear it), **Gallery** (the showcase as gamers see it), **GameRank**, **Price**, **PendingSlot** (anything waiting on the team is a dashed slot, never a quote box), **StatusLabel**, **ConfirmStep** (removing a game or an image, in place, never a pop-up), **Tabs**, **SessionList**, **EmptyState**, **Skeleton**, **ErrorState**, **Sidebar**, **AppShell**.
   - Things probably **not in the library yet**: a voice recorder (record, re-record, play back, the time limit), a way to reorder showcase images that works with a keyboard and on a phone, and whatever the portfolio needs once its format is decided. If one is missing, tell me and add it as a new component (and to the library page) rather than styling it inside a page.

5. **The built pages in `design/pages/`, all of them.** They are the reference for every pattern and every link target. For Phase 6:
   - **21 Profile setup:** the same fields as 22's profile parts, as a first-time setup. 22 is the same data, edited later.
   - **02 Coach profile:** what gamers see; `preview` is the preview mode 22 opens; `own` is Kairo looking at his own profile.
   - **19 Coach dashboard, `live` and `live-new`:** the links into 22 and 23.
   - **10 My sessions:** the list pattern 23 should match.
   - **06's coach states:** 23's row targets (`coach-upcoming`, `coach-cancel`, `coach-request-received`, `coach-pending`, `coach-completed`, `coach-dispute`, `coach-kairo-tue`, `coach-milo-request`, `coach-ozzie-dispute`).
   - **20 `live`:** a settings page in the app shell, the model for 22's shell.
   - **0.2 Components**, especially the "Coach onboarding" section.

6. **`design-system/README.md` and `design-system/tokens.json`:** the brand design system (also at https://claude.ai/artifact/4HHoqwJVacXMMDzG9XLp4n).
7. **`design/explorations/mono-specimen.html`:** what is set in Geist Mono. Where it differs from DECISIONS.md, DECISIONS.md wins.
8. **`landing.html`:** brand feel and the coach pitch only, not a template.

## Flow consistency: the rules for this phase

- **Every interactive element maps to a node in diagram 9 (or its neighbours) and to a state that exists.**
  - Before building, make a link map: each button, link, save, upload, record, submit, reorder, remove and error recovery on 22 and 23, the flow node it belongs to, and the page and state it leads to (`22#…`, `02#preview`, `06#coach-upcoming`, `19#live`…). Put the map in your first message.
  - Anything with no node or no existing target is a gap: ask, don't invent.
  - Targets in Phase 7 (24 Account settings, 25 System pages) are inert links, marked as such in the map.
- **Cover every branch of diagram 9:** each edit that goes live at once; each that waits for the automatic check (checking, live, refused); each that waits for the team (pending, approved, declined or didn't pass) with the old version still shown to gamers; the preview; and 23's list, empty, loading and error. Say in the map which state shows each node.
- **Gamers' view stays true.** Whatever 22 shows as "live" must match what 02 shows; whatever is pending must not be on 02 yet. Where a Phase 6 state changes what 02 shows (a new voice intro, a portfolio once it passes, an approved rank), say which 02 states that touches and ask before changing 02.
- **Same words everywhere.**
  - Reuse labels already in the product exactly: "Coach dashboard", "Coach sessions", "Preview my public profile", "Manage", "New Coach", "View session", "Back to coach dashboard", "Add images", "Remove", "Replace", "Add a photo", "Add a banner", "Add hours", "Add a credential", "Save and continue" (setup only), "Under review", the upload hint and error lines from DECISIONS.md "Uploads", the image-check refusal lines, and 21's field labels and hints.
  - Decide each new label once (e.g. "Save changes", "Update rank", "Add a game", "Record a voice intro", "Submit portfolio") and use it identically. List the new labels in your first message.
- **Same facts everywhere:**
  - Prices are in the coach's own currency, never "≈" on the coach's own pages; the floor per currency (S$10, RM 35, ₱430); the payout line as 21 shows it (₱1,850.00 − ₱222.00 = ₱1,628.00).
  - Dates and times use the product's format (`Mon 5 Oct`, 24-hour, zone label) in the coach's own time zone (PHT for Kairo). Write in British English.
  - Every number on 22 and 23 agrees with 19 live and 06 (the rank under review, the bookings, the amounts).
- **Plain, trustworthy copy.** Say what changes for gamers and when ("Gamers see this as soon as you save." / "Gamers keep seeing 85★ until our team approves 92★."), who is doing what, and never promise a review time I haven't agreed.
- **Navigation stays as built:** logged-in top nav, the sidebar with Gamer and Coach blocks, the burger below 1000px, the logo to the gamer dashboard. Decide with me which link each page highlights (22 isn't a sidebar link) and whether 22 is one page with sections, tabs or several pages.
- **Link the mockups together.**
  - `data-link="22#…"` on an `<a>` opens that page's mockup at that state in a new tab. Cross-page buttons must be `<a class="button">`, because the harness only sets `href` on `<a>`. `data-go="state"` switches state within the page.
  - Add 22 and 23 to the page table in `foundations/mockup.js` once published.
  - Then propose, don't just do, these changes, so a live coach's whole day can be walked: 19 live's "Manage" → 22 and "All coach sessions" → 23; the sidebar's Coach sessions on Kairo's shells → 23 (the harness's `KAIRO` table in `mockup.js`); 02 `preview`'s "Back to profile settings" → 22; 06's coach-view "Coach sessions" back links → 23; and republishing those pages (06 is about 260 KB built; see publishing below).
- **One story per account.** Kairo (live, established, Mon 5 Oct 2026, 14:12 PHT) is the natural owner of 22 and 23; snapking (just live as a New Coach, Sat 24 Oct 2026) owns `19#live-new`. Don't invent a new cast without asking. See the gaps below.

## Accessibility and mobile

- **Every field:** a visible label, not just a placeholder, and a helper line where useful; an inline error tied to the field; a counter where there's a limit (bio 500, captions 80, credentials 60, rank 40); errors signalled with more than colour (Field's amber border, an icon and a message; there is no red).
- **Long settings pages:** clear sections, each saying how it saves. Nothing is lost by leaving: say what happens to unsaved changes. Validation runs on save and on leaving a field, never while typing. On save, focus moves to the first error with a summary at the top.
- **Uploads:** a visible button (not drag-and-drop only), the hint, progress, one row per file with its own state and Remove, error lines that name the file, and a "Checking…" state that doesn't block the rest.
- **Reordering** works with a keyboard and on a 320px phone (for example Move up / Move down buttons), not only by dragging.
- **Recording audio** has a keyboard path, says plainly when the microphone is blocked and how to allow it (08 has the pattern), and offers an alternative if recording isn't possible.
- **Phone-first and the primary action:** one column on phones, 16px+ inputs (no iOS zoom), 44px minimum targets, the right `autocomplete`, `inputmode` and `type` hints, one primary action per screen, loading states that disable the button and say what's happening, nothing important only in a toast.
- **Layouts scale cleanly from 320px to a large desktop** (container queries, as everywhere else). Check 1440, 1280, 1024, 820, 390 and 320 wide, and a short desktop window (1280×720). 23 uses the width like 10.

## Before you build anything

Read everything above and do the research, then come back to me with all of this in one message:
- **What I looked at and what I'm taking from it**, per page (see "Research before you design").
- **Each page:** your understanding of its layout and how its states differ, in a few lines (22, 23).
- **The link map** (see the rules above), including which diagram 9 node each state shows.
- **The new labels and copy** you propose, in a short table: buttons, the status lines for live, checking, pending and declined, the save lines, the errors.
- **Every gap or ambiguity** you find in the decisions or flow, each with your recommendation, so I can answer quickly. The ones I already know about:
  - **Who and when.** Kairo at Mon 5 Oct 2026, 14:12 PHT for 22 and 23 (matching 19 live, including the rank update under review), and snapking at Sat 24 Oct for 23's empty state? Or another split? Give the "now" for each state, and how every fact agrees with 19 live, 06 and 02.
  - **22's structure.** One long page with sections, tabs (the Tabs component exists) or a hub with sub-pages? Which sections, in which order (profile, availability, games and prices, voice intro, showcase, portfolio)? Where "Preview my public profile" sits. Research should inform this.
  - **How 22 saves.** Per section ("Save changes" with a SaveStatus line), autosave, or one Save for the page? What happens to unsaved changes when someone leaves? Which edits go live at once, which wait for the image check, and which wait for the team.
  - **Prices.** The note that booked sessions keep their price, and where it shows.
  - **Availability changes.** What happens to sessions already booked outside the new hours, and to times held in an open reschedule request? Recommend: nothing changes for them, and say so on the page.
  - **Update rank.** One field and up to 5 screenshots per game? Can a pending update be withdrawn or replaced? What a declined update shows (the reason, and the old rank still live), and how 02 and 19 stay in step.
  - **Add a game.** Only games not listed yet; rank and proof; when the price is set (with the request, or after approval); what "under review" looks like on 22 and 19; declined.
  - **Voice intro.** The length (still to decide; 02 is mocked at 0:45), record in the browser or upload a file (and which formats), re-record before sending, review by the team (pending, approved, declined with a reason), and what gamers hear meanwhile (the old intro, or none). The microphone-blocked state.
  - **Portfolio.** The format (still to decide: links, images, PDFs?), what the team reviews, the states (submit, under review, shown on your profile, didn't pass with the reason), and how it shows on 02 once it passes (a change to a Phase 1 page: ask). Its images also go through the automatic image check once public.
  - **Showcase.** Reordering (keyboard and phone), editing a caption on a live image (does the caption get checked again?), the empty state, and what's shown while an image is checking.
  - **Photo and banner.** A replaced photo stays until the new one passes; the photo is also the account photo (24 in Phase 7 edits it too).
  - **Preview my public profile.** 02 `preview` is Kairo; does it need to show the pending rank as gamers see it (the old rank)? Where its "Back to profile settings" goes.
  - **23 Coach sessions.** Mirror 10 (Upcoming soonest first, Past newest first, rows open 06, "Load more" after 20)? Does a row show the coach's payout, or no amounts like 10? Which of Kairo's bookings appear, and which 06 coach states they open: some exist, others (tamtam's pending session, the released ones) would need new 06 copies or stay inert. Recommend which.
  - **New Coach progress.** 19 `live-new` shows "0 of 5". Does 22 or 23 show anything about it? Not specced, so ask before adding.
  - **Anything research suggests that isn't decided** (pausing bookings, hiding the profile, a public profile link to share, availability exceptions for holidays…): list it as a recommendation, don't add it.
  - **Emails.** Recommend not drawing the coach emails as pages.

Build only after I answer. Build each page once, well: render it, look at every state at desktop and phone once, and fix what the renders show. Click through every link and `data-go` with a Playwright script, and check every width for horizontal overflow. Then publish.

## What exists

Every page below is published as an interactive page, and its source file is in the repo.

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
| 11 Sign up | https://claude.ai/artifact/QkABonvTk67WnzxPHH1rrC | `design/pages/11-sign-up.html` |
| 12 Verify your email | https://claude.ai/artifact/MmPhavSEmaQbDFcxNtvcG4 | `design/pages/12-verify-your-email.html` |
| 13 Finish setting up your account | https://claude.ai/artifact/HoUgKYU9pkBwvGxiaCCDZh | `design/pages/13-finish-setting-up.html` |
| 14 Log in | https://claude.ai/artifact/KFSLVdswwSLN2HGsMyn8ed | `design/pages/14-log-in.html` |
| 15 Forgot and reset password | https://claude.ai/artifact/G9xYuLRFwRgfjnnBu7A1Y4 | `design/pages/15-forgot-and-reset-password.html` |
| 16 Accept updated terms | https://claude.ai/artifact/Ma6d46PmT2aacA6483XTeG | `design/pages/16-accept-updated-terms.html` |
| 17 Coach application, step 1 | https://claude.ai/artifact/UPdfZV5NDEKHgQk6A9m1vL | `design/pages/17-coach-application-step-1.html` |
| 18 Coach application, step 2 | https://claude.ai/artifact/UuoARHjHiK321bFmrrT3Ww | `design/pages/18-coach-application-step-2.html` |
| 19 Coach dashboard | https://claude.ai/artifact/PZWfUhEGXGatrN3DdtNneV | `design/pages/19-coach-dashboard.html` |
| 20 Payout setup and settings | https://claude.ai/artifact/VVKZYhCa86RgU13zH5EKU8 | `design/pages/20-payout-setup.html` |
| 21 Profile setup | https://claude.ai/artifact/7KKq11638mXPeYQNn17Cxb | `design/pages/21-profile-setup.html` |
| Coach card v2 (exploration) | https://claude.ai/artifact/WsAyxiSS39SwGyE3QYp3Xn | `design/explorations/coach-card-v2.html` |
| Sign up split layout (exploration) | https://claude.ai/artifact/QfL2PD3dCfK7wa6NpjD8qa | `design/explorations/auth-split.html` |
| Panel message (exploration) | https://claude.ai/artifact/JiEipPbboBorAiwpNxPW1W | `design/explorations/auth-panel-copy.html` |
| User flow | https://claude.ai/artifact/8QiSx8pFYigdVWvUsqqXBm | `design/USER-FLOW.md` (published copy `design/user-flow.html`) |
| Canvas, "Harbourly webapp" | https://claude.ai/artifact/AqzF4kYNMmXf555w8KbJpZ | Every library section and every Phase 1 to 5 state, desktop and phone |

### State ids you can link to

Link with `data-link="NN#id"`.

**01:** results, guest, filtered, empty, loading, more, error.

**02:** verified (Kairo, several games), one-game, new-coach, guest, own (Kairo's own profile), preview (preview mode, Kairo, "Back to profile settings"), loading, not-found.

**03:** available, guest, none, taken, returning, phone.

**04:** different-currency, same-currency, under-24h, nearly-expired, expired, failed.

**05:** confirming, confirmed, failed, released.

**06, gamer view:** upcoming, cancel-confirm (full refund), cancel-late (inside the last hour), cancelled, coach-cancelled, locked, reschedule-form, reschedule-waiting, reschedule-received, reschedule-keep-or-cancel, moved, reschedule-declined, reschedule-expired, join, in-session, pending, pending-soon, confirm-step, completed-review, review-posted, disputed-open, disputed-review, resolved-refunded, resolved-paid, payment-problem, awaiting-payment, expired, loading, error, reported (Kairo reported a problem, respond), reported-responded.

**06, the dashboard's other bookings (Phase 3):** kairo-tue, vexa-request, mirae-pending, mirae-confirm, ghostline-review, nullpoint-open. Their onward links are inert.

**06, coach view (Kairo):** coach-upcoming, coach-cancel, coach-request-received, coach-pending, coach-completed, coach-dispute.

**06, the coach dashboard's other bookings (Phase 5, Mon 5 Oct 14:12 PHT):** coach-kairo-tue (snapking, Tue 6 Oct), coach-milo-request (milo.exe asked to move Fri 9 Oct), coach-ozzie-dispute (ozzie reported "Session ended early"). Their onward links are inert.

**07:** gamer-after, mirae-after (Phase 3), gamer-noshow, gamer-payment, coach-after, coach-payment, validation, upload-error, submitted, respond, response-sent, coach-ozzie-respond (Phase 5), gamer-respond, gamer-response-sent.

**08:** waiting, no-show, coach-waiting, live, camera, share, banner-10, banner-5, banner-1, end-confirm, end-sent, end-received, reconnecting, other-dropped, blocked, ended, coach-ended.

**09:** busy, todo-all (the To do page), reported (Kairo reported a problem, Thu 8 Oct), quiet (nothing to do), new (brand-new account), loading, error.

**10:** list, empty, loading, error.

**11:** form, booking, errors, loading.

**12:** sent, resent, expired, verified, verified-other.

**13:** form, google, missing, phone, wrong-code, filled, username-taken, coach-unavailable, booking, submitting, under-18, not-available. The role choice is a live radio in every form state. Finish setting up in `filled` goes to `17#intro` when the coach option is chosen (Singapore is a coach country), otherwise `09#new`; `booking` goes to `03#returning`.

**14:** form, booking, wrong, too-many, loading.

**15:** request, sent, new-password, expired, done.

**16:** terms.

**17:** intro, not-available.

**18:** empty, draft, validation, upload-error, confirm, submitting, submitted, under-review, rejected, rejected-changed, rejected-wait, not-eligible.

**19:** approved, payout-checking, in-progress, payout-failed, live-new (snapking just live), live (Kairo), loading, error. There are no pre-approval states: 18 holds them.

**20:** start, confirming, unfinished, checking, verified, failed, live (Kairo).

**21:** about, about-checking, about-refused, about-errors, games, games-error, resumed, showcase, review, complete.

### The files

**`design/foundations/tokens.css`:** the global stylesheet. It has every design-system token by its exact name, plus `--shadow-flat` and `--shadow-cta-rest`, base styles and the webapp type scale.

**`design/foundations/components/<Name>.css`:** one file per shared component, each lifting straight into `<Name>.module.css`. Every selector starts with the component's root class.

| Component | Notes |
|---|---|
| AppShell | Options `narrow` and `wide`, and `noSidebar` |
| TopNav | `gate`: logo and Sign out only |
| Sidebar | Gamer and Coach blocks; the "Become a coach" link |
| MobileMenu | |
| Button | |
| TextLink | |
| IconButton | |
| Field | Text, select, textarea, counter, date of birth, phone, `password` with Show and Hide, label row |
| Checkbox | |
| OtpInput | |
| ImageUpload | |
| StepCounter | |
| StatusLabel | |
| Badge | New Coach only |
| Avatar | |
| Flag | |
| Price | |
| GameRank | |
| Rating | |
| Card | |
| CoachCard | |
| SessionList | `compact` |
| Notice | With CallBanner |
| Countdown | With HoldTimer |
| ConfirmStep | |
| EmptyState | |
| Skeleton | |
| ErrorState | |
| PendingSlot | `stacked` |
| ScrollArea | |
| Icon | |
| OptionCard | |
| SlotPicker | |
| AudioPlayer | |
| ReviewItem | |
| PriceBreakdown | |
| Spinner | |
| Gallery | |
| ParticipantTile | |
| CallControls | |
| ChatPanel | |
| GoogleButton | Added in Phase 4 |
| Tabs | Added in Phase 4 |
| AuthLayout | Added in Phase 4. Its mark image ships as `harbourly-mark.png` beside the page, so pass it as a supporting file when publishing 11, 14, 15 and the library |
| ResultPanel | Added in Phase 4. A whole-page outcome: icon, title, text, one way on |
| Checklist | Added in Phase 5. 19's "Before you go live" rows: done, waiting, needs you, to do |
| SaveStatus | Added in Phase 5. "Draft saved · 21:34", "Saving…", "Saved" |
| WeekHours | Added in Phase 5, with `WeekHours.js`. Weekly hours in whole-hour ranges, in the coach's zone |
| (additions) | Phase 5 also added ImageUpload rows, single media and banner; the Checkbox grid; Field `fieldPrefix`; Notice `noticeLinks` (error summary); the Sidebar's "Your coach application" status link |

**Behaviour files** sit beside the components: `OtpInput.js`, `Rating.js` (star input), `Field.js` (character counter, password Show and Hide), `ScrollArea.js`, `WeekHours.js` (fills the hour selects, adds and removes ranges, counts slots). Every component is shown on the component library page.

**`design/foundations/icons.js`:** the line icon sprite (24px grid, 1.8 stroke). Use `<svg class="icon"><use href="#i-name"/></svg>`, and add new icons in the same style. `design/foundations/flags.js` has simplified country flags (ph, sg, my).

**`design/foundations/mockup.css` and `mockup.js`:** the mockup harness, not product code.
- Pages put each state in `<section data-state="id" data-label="Label">` inside `<div class="mk-frame" data-page="NN Page">`. The harness builds the state switcher and the desktop/phone toggle. `window.mk.set(stateId, "desktop" | "phone")` switches state from a script.
- A state with `data-shell="name"` is wrapped in `<template id="shell-name">`. That is the app shell, written once per page; copy the gamer shell from 09 and the coach shells from 06. `data-nav="key"` marks the current sidebar link.
- The harness wires the burger menu and the `data-link` cross-page links. Sidebar targets come from two tables near the top of `mockup.js`, chosen by the shell's `.topNavUser` aria-label: **snapking** (`NAV`: Dashboard → `09#busy`, Browse coaches → `01#results`, My sessions → `10#list`, "Become a coach" → `17#intro`, the logo → `09#busy`) and **Kairo** (`KAIRO`: Coach dashboard → `19#live`; his Gamer links and logo stay inert, since he has no gamer pages). Coach sessions has no target yet: adding `'coach-sessions': '23#list'` to `KAIRO` is part of Phase 6's wiring. A state's `data-coach="19#…"` sets that state's Coach dashboard link (used by 18 to 21, where the journey moves on day by day). `window.mkPages` exposes the page table to page scripts (13 uses it for its coach choice).
- `.mk-hint` (dashed "Mockup: …" line) is a mockup-only shortcut for steps that happen outside the app or take time, such as opening an email link, coming back from Stripe or a check finishing. It is hidden in canvas renders.
- Use a 2-digit `data-page` name, e.g. `19 Coach dashboard`.

**Page behaviour:** a page's own interactions (like `data-go` steps) go in a `<script>` in the page. Behaviour that belongs to a shared component goes in `foundations/components/<Name>.js`, included before `mockup.js`. `build.mjs` inlines local scripts.

**Editing pages:** every earlier page was generated once by scratch scripts that aren't in the repo. The HTML files are the source now, so edit them directly. Phase 5's pages were generated by scratch scripts too (not in the repo); edit their HTML directly. If you generate Phase 6 pages with a script, treat the HTML as the source once it's committed.

**Outside edits:** once in Phase 4, another process changed pages and files in the working tree between turns. Before every commit, run `git status` and read the diff. Never commit a change you can't explain; stash it and tell me.

**`<meta charset>`:** a page without its own `<meta charset>` can render with garbled characters ("Â·") in local renders. 0.1 Tokens still doesn't declare it, so add it there before re-rendering that page.

**Responsive rules** are container queries on a container named `app` (the app shell; the mockup frame in the harness), not media queries. The breakpoints in use are 1188px (09's columns stack), 1099px (two-column page bodies stack), 999px (the sidebar folds into the burger menu), 640px, 560px, 520px, 400px and 360px.

**Top nav and sticky elements:** the top nav is 76px tall (68px below 1000px). Sticky elements sit under it: the sidebar at `top: 76px`, sticky side panels at `top: 100px`.

**Reuse these components on every page.** If a page needs a new shared part:
- add it as a new component file and to the component library page
- add a library row in canvas.py if you add a new library section
- tell me

Don't style it inside the page. Page-only layout goes in the page's own `<style>` block, which becomes that page's `page.module.css`.

## How pages are built and published

**Build:**
- Build a publishable copy with `node design/tools/build.mjs design/pages/<page>.html <outDir>`. It inlines the CSS and JS and copies the images the page uses (the logo, and the mark on 11, 14, 15 and the library) next to the page.
- Publish the built file as a private artifact, passing each copied image as a supporting file (`files: {"harbourly-logo.png": "<outDir>/harbourly-logo.png"}`).
- A new page is a new artifact: no `url`, and give it an `icon`. To update an existing page, publish to its existing link (`url`) so the link never changes.
- Add each new page's link to its phase in BUILD-ORDER.md, to the table above and to the page table (`PAGES`) in `mockup.js`.

**Publishing over a link this chat hasn't published** is refused once, with a diff of the live version.
- If the diff shows only your own edits (it should, because these pages only change from the repo), publish the same file again. If that's refused as "identical content", publish it once more and it goes through.
- In Phase 5 every page came back with a line diff (06 included, about 260 KB built), which is quick to check. If a page instead comes back with its whole live source inline or saved to a file and asks you to read it, compare it against a build of the repo version, then publish.

**Watching:** each chat can watch at most 10 artifacts for changes. A "wake subscription not registered" notice after that is harmless.

**Render the frames** with `node design/tools/render.mjs <outDir>/<page>.html <framesDir> <prefix>`. The prefix is `22` and `23`. An optional 4th argument sets the window height (default 900; 09 uses 700 because of its fixed-height desktop columns). It renders every state at 1440 and 390 wide, at 2x, as `<prefix>__<state>__<desktop|phone>.png`.

**Test before publishing:**
- Playwright is installed globally. A test script of your own loads it with `createRequire(import.meta.url)(execSync('npm root -g').toString().trim() + '/playwright')`.
- Write one that, for every state, clicks every `[data-link]` and `[data-go]` in the visible state (`[data-state]:not([hidden])`) and checks the target exists.
- Write another that loads every state at 320, 390, 820, 1024, 1280×720 and 1440 and reports any horizontal overflow.
- The Phase 5 versions were scratch files and are gone; write your own.

**Review renders cheaply:** `python3 design/tools/sheet.py out.png <cropHeightCss> <scale> frame1.png frame2.png …` makes a contact sheet.

**Replacing existing frames:** keep the previous renders and run `python3 design/tools/framediff.py <oldDir> <newDir>`. Spinners, skeletons and ticking countdowns can differ by a few pixels, which isn't a change.

## The canvas

**Rules:**
- **Never create a second canvas.** All frames go on https://claude.ai/artifact/AqzF4kYNMmXf555w8KbJpZ.
- Each frame is one artboard: a `.dc.html` that only shows an uploaded PNG at its true CSS size (PNG pixels ÷ 2).
- Board titles follow "NN Page · State · Width", e.g. "19 Coach dashboard · Approved · Phone". File names are `<prefix>-<state>-<desktop|phone>.dc.html`.

**Layout:**
- Each state is a pair: desktop, then phone 80 px to its right. Pairs are 200 px apart, three pairs to a row, and rows are 200 px apart.
- A `title1` note names the phase and each page. A green sticky to the left of each page links its interactive version and source file.
- The phase titles are at y = 28,552 (Phase 1), 62,639 (Phase 2), 113,694 (Phase 3), 123,724 (Phase 4) and 145,565 (Phase 5). The canvas ends at y = 180,696 (2 Nov 2026).
- Phase 6 goes below Phase 5. After publishing its pages, add `("phase6", "Phase 6 · Running a coach profile", [...])` to `PHASES` and `"phase6": ("check7", "Checkpoint 7: coach side complete, pages 22 and 23.")` to `CHECKS` in canvas.py, following Phase 5's entries.
- New states added to an existing page (for example new 06 copies) need their frames uploaded too: canvas.py places every state of every listed page.
- Library rows hold three sections each (canvas.py `PX` has three slots). The Phase 5 "Coach onboarding" section (`coach`) has a row of its own; add the next section beside it.

**To place frames:**
1. Copy the PNGs into a temporary folder **inside the repo** (e.g. `.frames-upload/`), because the uploader takes files from the working directory only.
   - Upload them as canvas assets in batches of up to 25 (`url` = the canvas, `asset: true`, `file_paths`).
   - Write each `<prefix>__<state>__<width> <asset id>` line into a blobs file. Every frame of a new page must be in the blobs file.
   - Delete the folder afterwards. Never commit it.
2. canvas.py reads frames from `<framesDir>/<prefix>/<key>.png`, so put each page's renders in a folder named after its prefix.
3. **Read `project/canvas.json` from the canvas right before publishing**, because uploads and the editor both bump its version. When replacing existing artboards, read those `project/<file>.dc.html` files too, in the same call (`paths`). New artboards need no read.
4. Run `python3 design/tools/canvas.py <that canvas.json> <blobs file> <framesDir> <outRoot>`. It writes the artboards for the uploaded frames, re-flows every row and keeps everything else. It prints the `files` map.
5. Publish with `url` = the canvas, `root` = outRoot, `file_path` = `<outRoot>/project/canvas.json` and `files` = the printed map. If it's refused for not having viewed the latest version, read the canvas url (no path), then publish again.

**Changes** always go through the HTML page first. Then the frames are re-rendered and replaced.

## Visual rules (summary; full list in DECISIONS.md)

- **Surfaces:** dark theme only, and flat. The page is `--bg`, cards are solid `--surface`, insets are `--bg-mid`, with one slight shadow, `--shadow-flat`. Only the top nav keeps blur and transparency.
- **Green glow** is only a deliberate accent: a thin glowing top line on the one card that matters most in view, stronger on hover. On a dashboard that means one card, not every card that needs action.
- **Buttons and inputs:**
  - Primary buttons rest with `--shadow-cta-rest` and get the halo on hover.
  - The secondary button is an outline pill with a `--line-strong` border. Inputs also use `--line-strong`.
  - The amber outline button is only for the final step of a cancel or delete.
  - Confirm steps open in place, never as a pop-up.
- **Waiting on someone:** a response, review, reply or decision that hasn't come yet is a dashed slot with a status line, never a quote box (Checkpoint 3 refinements). That includes "Our team is reviewing your application".
- **Backgrounds:** no background grid, film grain or hero glow in the webapp. The only exception is the brand panel on 11, 14 and 15.
- **Fonts:** Sora for headings, Geist for body and UI, Geist Mono for data and labels (ranks, prices, dates, status labels). No other fonts.
- **Status:** a mono label with a coloured dot.
  - Green: confirmed, in session, completed, live, verified.
  - Amber: needs action (awaiting payment, pending confirmation, disputed, reschedule requested, a rejection to fix, payout couldn't verify).
  - Muted: ended or waiting on others (expired, refunded, cancelled, resolved disputes, under review).
  - No red. "Under review", "Checking" and "Not eligible" are muted; "Changes needed" and "Couldn't verify" are amber (Phase 5).
- **Icons:** inline SVG line icons only, from the sprite.

## Avoid ("not AI-looking")

- **Colour:** purple, indigo or blue-to-pink gradients; gradient text; colours outside the palette.
- **Effects:** glassmorphism (except the top nav); heavy shadows; glow everywhere; hover effects on things that aren't interactive.
- **Icons and decoration:** emoji, sparkle icons, mixed icon styles; blobs, abstract illustrations, stock imagery.
- **Layout:** three-column grids of identical icon-in-a-square feature cards (a settings overview is the obvious risk: lay settings out as plain, specific sections); centring by default; identical padding and weight everywhere with no hierarchy.
- **Badges** scattered everywhere. Use them only where they carry real status.
- **Content:** placeholder copy, "John Doe", invented stats, marketing filler; "earn up to" promises.
- **No charts, trends, totals tiles or analytics on dashboards.** A dashboard here is a list of things to do and things coming up, not a report. That includes 19.

## Content and copy

**Realistic content:**
- fictional gamer handles only (no real people)
- the 5 games: Mobile Legends, Call of Duty: Mobile, Valorant, Counter-Strike 2, Riftbound
- free-text ranks (`Mythical Glory · 85★`, `Immortal 2`, `Premier 21,450`)
- prices like "S$45 / session"
- times in the viewer's zone (e.g. `20:00 SGT`, `20:00 PHT`)
- real states

Write in sentence case and British English, short and direct, in a plain voice. The same action always has the same label.

**Mockup times:** Phase 1 mockups are set at Mon 5 Oct 2026, 14:10 SGT. The "now"s for Phases 2 to 4 are in DECISIONS.md: "Mockup times (Phase 2)", "Booking set and mockup times (Phase 3)", "Phase 4 decisions" and "Gamer response to a coach's report". Phase 5's are in "Phase 5 decisions". Phase 6 needs its own; see the gaps. Full cast details are in DECISIONS.md, and bios are in `design/pages/01-browse-coaches.html`.

**Keep using the same cast:**

| Who | Details |
|---|---|
| **Kairo** `@kairo.gg` | Philippines, English and Filipino, PHT. Past the New Coach period (no label), 4.9 (57). Mobile Legends `Mythical Glory · 85★` at ₱1,850 (≈ S$43); Call of Duty: Mobile `Legendary · Top 500` at ₱2,100 (≈ S$49). Paid with Xendit (bank account ending 3307). Payout per Mobile Legends session ₱1,628.00, per Call of Duty: Mobile session ₱1,848.00. He is the coach in every coach-view state of 02, 06, 07, 08, 19 `live` and 20 `live`. A Mobile Legends rank update (`Mythical Glory · 92★`) is under review since Sun 4 Oct. His other students: ricebowl, tamtam, nightjar, ozzie, milo.exe (Philippines). |
| **Vexa** `@vexa` | Singapore, English and Mandarin, SGT. Past the New Coach period (no label), 4.8 (32). Valorant `Immortal 2` at S$45. Paid with Stripe. |
| **nullpoint** `@nullpoint` | Malaysia, English and Malay, MYT. New Coach, no reviews. Counter-Strike 2 `Premier 21,450` at RM 150 (≈ S$43). |
| **Mirae**, **Ghostline** | |
| Filler coaches | Lumen, Pallas, Marlowe, Kestrel, Tidewalker, Rook, Hanabi |
| **snapking** | Ryan Tan, born 14 Mar 1999, snapking@example.com, +65 9182 4567 (shown as "+65 •••• 4567"), Singapore (SGT, SGD). Signed up Thu 24 Sep 2026, 11:00 SGT. His bookings with Kairo, Vexa, Mirae, nullpoint and Ghostline are listed in DECISIONS.md ("Booking set and mockup times (Phase 3)"). In Phase 5 he applied (Mon 19 Oct) and went live as a **New Coach** on Sat 24 Oct 2026, 10:48 SGT: Valorant `Ascendant 1` at S$25 and Counter-Strike 2 `Premier 18,200` at S$20, Stripe (bank account ending 4821), English and Mandarin. Before that date his pages show "Become a coach". |

## How I like to work

- Explain any non-obvious design decision in one sentence.
- If anything in the feature list, flow or decisions is ambiguous, **ask me before guessing**. Never add features, sections or data without asking.
- When I ask for a layout change I haven't seen, confirm your understanding first. If the change is big, make a quick exploration in `design/explorations/`, publish it, show me the renders, and build only after I approve.
- **Research before designing** each page (the section near the top), and report it in your first message. Inspiration, never a copy; what's decided always wins.
- Record every new decision I approve in `design/DECISIONS.md` (a "Phase 6 decisions" section). Keep `USER-FLOW.md` (and `user-flow.html`, republished) and `BUILD-ORDER.md` in sync if anything changes. When a decision reaches other pages or later phases, say which and update their entries.
- Commit and push work to the designated branch as you go (the repo's stop hook requires it). Don't open pull requests unless I ask.
- I'm not a design specialist on token and type-scale questions. Recommend a choice and explain briefly.
- I care about Pro usage: build each page once, well, rather than duplicating work.
- When I ask to see a page, open its artifact in the chat.
- Each phase ends with a review checkpoint. Don't start the next phase until I've reviewed.
- Keep this handoff (`design/HANDOFF.md`) current at the end of each phase.

## Open items

**For Phase 6:**
- **Still to decide in Phase 6:** voice intro length and how it's made (record or upload), and the portfolio's format and how it shows on 02.
- **Rank proof check (kept, 23 Oct 2026; may be dropped later):** ranks stay checked against proof screenshots at application and on every rank change. If it's dropped later: 22's "Update rank" goes live at once (no screenshot, no pending state, no old rank held), "Add a game" may need no proof, 19's "Rank update under review" goes, 17 and 18 lose the proof parts, the "Rank update: approved or declined" email goes, and DECISIONS.md ("Ranks", "Coach location and identity", "Rejected coach applications", Uploads) and USER-FLOW diagrams 8 and 9 change.
- **When building:** confirm on a real iPhone that camera photos convert to JPEG on upload (18's proof, 21's and 22's photos).
- **Mockup times in coach-view copies:** 06 `coach-upcoming` still shows its own moment (Mon 5 Oct 18:00, "Opens in 49h 50m"); from 19 live (14:12) the same booking would read 53h 38m. Left as is, like 04's hold countdown. Keep 23's rows consistent with 19 live.
- **Not drawn, by decision:** suspended and banned coach states; the coach-journey emails.

**For the review of Phases 1 to 5 (after Phase 7, the owner's plan):**
- Keep a short running list in DECISIONS.md or HANDOFF.md of anything the Phase 6 and 7 research suggests for earlier pages (a better pattern, a placement, a missing state). Don't change those pages for it now; it feeds the review.
- **The component library at 320 px:** two specimens overflow at a 320 px window (the logged-out top bar in "App shell" and the coach card's "Next free" line in "Cards and lists"). The pages themselves don't. Left for the review.

**Carried forward:**
- **Avatar and showcase images:** I'll supply fictional avatar and showcase images. Until then, avatars show the default (first letter in Sora) and showcase images and uploads are marked empty slots.
- **Mockup-only hints:** 12, 15, 18, 20 and 21 carry a dashed "Mockup: …" line (`.mk-hint`) so the prototype can be walked. It's hidden in canvas renders and isn't part of the design.
- **03 "Phone not verified" state:** everyone verifies their phone at sign-up, so this state is an edge case (for example, a number removed by support). Kept as built.
- **Logged-out currency (assumed, not confirmed):** logged-out visitors see SGD in the mockups. How their currency is chosen is still to decide.
- **Ideas held back (not approved):** a "Rank checked by Harbourly" line under ranks; a one-line explanation of "New coach" for gamers; a sticky Continue bar on phone for Pick a slot. Raise them only if relevant.
- **Next-session card in the dashboard banner (removed 28 Oct 2026, kept for later):** kept in `design/explorations/dashboard-v2-banner-next-session.html` (and in git, commit `19214aa`). If it comes back, the accent line moves from the To do box to this card on 09, and the same choice applies to 19.
- **Post-MVP:** several sessions in one checkout, and session packs; importing reviews from Metafy and Fiverr (DECISIONS.md, "Policy update, 23 Oct 2026"); other session lengths and types.
- **Landing copy (the owner's to change, don't edit it):** two lines in `landing.html`'s FAQ go further than the webapp: it says either side can report a no-show and an unconfirmed report becomes a refund (the webapp keeps no-shows as disputes, and only a coach no-show refunds automatically after 24 hours), and it promises importing reviews from Metafy and Fiverr, which is post-MVP.
- **04's hold countdown:** 04#same-currency shows 28:41 left, while 06 and 09 show 24:12 for the same Vexa hold at 14:12. Left as is, because 04 shows the hold as it was when first opened.
- **Sign-in services (agreed 28 Oct 2026):** Supabase Auth, Resend for auth emails (as Supabase's SMTP) and Twilio Verify for phone codes. Details are in DECISIONS.md, "Sign-in services".
- **Before code is built (not before design):** confirm coach launch countries with Stripe and Xendit (including Thailand); pick an exchange-rate source; pick the image moderation service (options in BUILD-ORDER.md); finalise chat retention with the Terms of Service.

## After Phase 6

Phase 7 ("Account and system pages": 24 Account settings, 25 System pages, checkpoint 8) follows after checkpoint 7, with the same research practice, in this chat or a new one. Keep this handoff (`design/HANDOFF.md`) current at the end of Phase 6 so it can brief Phase 7. After Phase 7, the owner reviews Phases 1 to 5.

## Next step

Read everything above, do the research, then send me your Phase 6 message: what you looked at and what you're taking from it, your understanding of 22 and 23, the link map, the new labels and copy, and every gap with your recommendation. Build only after I answer.
