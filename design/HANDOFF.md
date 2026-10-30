# Handoff prompt

Paste everything below the line into a new chat. Last updated 30 Oct 2026 (start of Phase 5). Phases 0 to 4 are built and published, and checkpoint 5 is closed. The Phase 4 brief that came before this one is in git history (commit `70497f6` and earlier). What was decided and built in each phase is in DECISIONS.md and BUILD-ORDER.md.

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

On 23 Oct 2026 the policies in the 11 Oct marketing copy were reconciled (DECISIONS.md, "Policy update, 23 Oct 2026"):
- There is no Verified badge, only New Coach.
- The gamer pays a 6% platform fee and the coach pays a 12% commission.
- The price floor is S$10.
- Sessions are a fixed 60 minutes.

The same day, every Phase 3 item was settled (DECISIONS.md, "Checkpoint 5 outcomes"):
- 10 My sessions is full width.
- The prototype's sidebar links are wired only on shells where snapking is logged in. Kairo's coach-view shells stay inert until the coach pages exist, and that is now.
- A gamer can respond to a coach's report. This adds states on 06, 07 and 09 ("Gamer response to a coach's report").

On 29 and 30 Oct 2026, Sign up, Log in and Forgot password moved to a split layout with a brand panel ("Sign up and log in layout").

Nothing is open from earlier phases.

**Your task now: build Phase 5, "Becoming a coach".** The pages are:
- **17** Coach application, step 1
- **18** Coach application, step 2
- **19** Coach dashboard
- **20** Payout setup and settings
- **21** Profile setup

The full spec is in `design/BUILD-ORDER.md`, "Phase 5". Work the way Phase 4 was built:
1. Read everything below.
2. Send me **one message** with your understanding of each page, a link map and every gap, with your recommendations.
3. **Build only after I answer.**
4. Build each page once, well.
5. Render and check every state at desktop and phone, and click through every link.
6. Publish each page.
7. Put the frames on the canvas under a "Phase 5 · Becoming a coach" title.
8. **Stop for checkpoint 6** ("coach onboarding"). Don't start Phase 6.

**What makes Phase 5 different:** it is the first coach-side phase and the longest journey in the product. Someone goes from "Become a coach" through an application, a review by the team and possibly a rejection. They then set up payouts with Stripe or Xendit, including the identity check, and set up their profile before they are live. The pages are long forms that people leave and come back to over days. The quality bar is **a journey that never leaves a coach unsure where they stand**. At every stage the coach dashboard says what's done, what's waiting on Harbourly, what's waiting on them, and the one next step. The flow's diagrams 8 (coach journey) and 12 (coach status lifecycle) must be reproduced exactly: every branch, every rejection path and every gate.

## Phase 5 at a glance

This is drawn from the flow and decisions. Check it against them; don't trust this summary alone.

**Diagram 8 is the spec.**
- Become a coach → a coach record is created and the coach dashboard appears in the sidebar.
- Then Step 1 (what's involved, what you'll need) → Step 2 (games and rank per game, up to 5 proof images, an optional marketplace profile link, what made you start coaching).
- Leaving and coming back saves a draft ("continue your application" on the dashboard).
- Submit → under review → the team decides:
  - **Rejected:** the reason is shown, the flagged section is highlighted and the inputs are kept. After a first or second rejection they can resubmit straight away once the flagged section has changed. After a third they wait 14 days.
  - **Not eligible:** a plain message, with no way to reapply.
  - **Approved:** the dashboard shows "what's left before you go live".

**The four conditions to go live:**
1. Application approved.
2. Payout setup complete, including the Stripe or Xendit identity check. Its failure state is "Your payout account couldn't be verified" with Try again or contact support.
3. Phone verified.
4. Profile complete: at least one game with a rate.

When all four are done, the coach is live and bookable as a New Coach, and an email is sent.

**Diagram 12** (states): draft → submitted → rejected or not_eligible or approved → live (new_coach → established), plus suspended and banned. Suspended and banned are not Phase 5 pages unless you find they belong on 19. Ask.

**Where people come in:**
- The sidebar's "Become a coach" link. It shows on every snapking gamer shell "until a coach record exists" (diagram 13).
- 13 Finish setting up, when "I want to coach, and book sessions too" is chosen with a coach country (Singapore, Malaysia, Philippines). In the mockup today, 13's Finish setting up always goes to `09#new`; point it at 17 for the coach choice.
- Coaches are 18+ (sign-up checks it, and so does KYC).
- Coach countries are SG and MY (Stripe) and PH (Xendit). Thailand is not yet supported.

**Once a coach record exists:**
- The sidebar has a Gamer block and a Coach block (Coach dashboard `/coach/dashboard`, Coach sessions `/coach/sessions`). The block you're in has the green label, and the other block is the switcher (component library, "App shell"). "Become a coach" goes away.
- Gamer and coach data never mix. 09 never shows coach data.

**Money:**
- Coaches price per game in their own currency, at or above the floor: S$10, RM 35, ₱430.
- Their payout is the price minus 12% (₱1,850.00 − ₱222.00 = ₱1,628.00; S$45.00 − S$5.40 = S$39.60), released automatically 72 hours after the session unless it's disputed.
- A coach's country locks once payout is set up. Changes go through support.

**Uploads:**
- Rank proof is private. The team looks at it, and it gets no automatic check: JPG, PNG or WebP, 10 MB each, up to 5.
- Profile photo, banner and showcase images (with captions) are public, so each one goes through the automatic image check. The states are "Checking…", then live, or refused with a plain reason. Uncertain counts as refused. There's no email, and a replaced image stays live until its replacement passes.
- The exact limits and error copy are in DECISIONS.md, "Uploads".

**Not in Phase 5:**
- 22 Coach profile settings: rank updates, adding a game, voice intro, portfolio, and "Preview my public profile" in preview mode.
- 23 Coach sessions.
- Every email. The coach-journey emails are listed in DECISIONS.md, "Emails", but they aren't drawn as pages.

## Repo and branch

Repo: `ILoveWaterSm/Harbourly-Waitlist-2.0`. `main` has the work up to the browse refinement. Everything since then is on `claude/serene-feynman-pavlc0`, not merged to `main` yet. That covers Phases 1 to 4, their refinements, the 23 Oct policy update and these docs. It already contains `claude/fervent-wozniak-svxqyk` and the branches before it.

If your branch doesn't have the "Gamer response to a coach's report" section in `design/DECISIONS.md`, merge `origin/claude/serene-feynman-pavlc0` into it first, then work from there. Use a merge commit, not a rebase.

## Read these first, in this order

1. **`design/DECISIONS.md`:** every agreed decision, and the **source of truth**. Anything not covered here or in the flow needs my approval before it's designed. These are the sections Phase 5 leans on most:

   | Section | What it settles for Phase 5 |
   |---|---|
   | "Core product decisions" | Coach games and rates: phase A is the application, phase B is profile setup; KYC at payout setup; the New Coach label |
   | "Ranks" | Free-text "Rank or top achievement", about 40 characters, Geist Mono, checked against proof |
   | "Rejected coach applications" | Reason categories, flagged section, resubmit rules, the 14-day wait, not eligible |
   | "Supported countries" and "Coach location and identity" | What you'll need; payout couldn't be verified; the country lock |
   | "Uploads" | |
   | "Automatic image check for every public image" | |
   | "Coach profile showcase" | |
   | "Currency display" | |
   | "Policy update, 23 Oct 2026" | New Coach rules, fees, price floor |
   | "Coach reliability" | |
   | "Emails" | Coach journey: what each email covers, so screens don't contradict it |
   | "Account and system pages" | Coach payout settings; "Preview my public profile" |
   | "Visual rules for the webapp" | |
   | "Navigation and identity" | |
   | "Phase 2 decisions" | The coach view of 06: price, commission and payout; times in the coach's zone |
   | "Phase 3 decisions" | Dashboard rules that 19 should mirror or deliberately differ from: To do box, one accent, each item once, no analytics; coach data never on 09; the dual-role switcher |
   | "Phase 4 decisions" | 13's role choice and the coach-country notice; snapking's details |

2. **`design/USER-FLOW.md`:** the full MVP user flow in 13 Mermaid diagrams.
   - **Phase 5 is diagram 8 (coach journey, application to live), line by line, and diagram 12 (coach status lifecycle).**
   - Also diagram 13 (navigation: the Coach block, the switcher, "Become a coach" until a coach record exists), diagram 2 (the coach exit from Finish setting up) and diagram 9 (managing a live profile). Diagram 9 is Phase 6, so read it to know what 19's live links point at later.
   - Every node in diagram 8 is a state of one of pages 17 to 21.
   - It's also published at https://claude.ai/artifact/8QiSx8pFYigdVWvUsqqXBm. If the flow changes, run `python3 design/tools/flowsync.py` to copy every diagram and note into `design/user-flow.html`, then republish it to that link.

3. **`design/BUILD-ORDER.md`:** 25 pages in 8 phases, with every state each page must show, its route, size, checkpoint and published link. Phase 5 lists the states of 17 to 21. It also lists Phase 6 (22, 23), so you can see what is deliberately left out.

4. **`design/foundations/`:** tokens, components, icons, flags and the mockup harness (details below). Read `tokens.css` and the component files before designing anything.
   - The main parts for Phase 5:
     - **StepCounter**
     - **Field** (text, select, textarea, counter, amber error, label row)
     - **ImageUpload**
     - **Checkbox**
     - **OptionCard**
     - **Button**
     - **TextLink**
     - **Notice**
     - **Card**
     - **StatusLabel**
     - **Badge** (New Coach)
     - **GameRank**
     - **Price**
     - **ConfirmStep** (the submit confirm opens in place, never as a pop-up)
     - **PendingSlot** (anything waiting on someone else is a dashed slot, never a quote box)
     - **EmptyState**, **Skeleton** and **ErrorState** (every card on 19)
     - **ScrollArea** (if 19 copies 09's desktop columns)
     - **SessionList**
     - **ReviewItem**
     - **Rating**
     - **Gallery** (the showcase as gamers will see it)
     - **Sidebar** (the Coach block and the switcher)
     - **AppShell** (with `narrow` and `wide`)
   - Things probably **not in the library yet**: a weekly availability editor in the coach's own time zone, a languages picker, an upload row with the "Checking…" / live / refused states, a checklist for "what's left before you go live", and maybe a stepper for 21's steps. If one is missing, tell me and add it as a new component (and to the library page) rather than styling it inside a page.

5. **The built pages in `design/pages/`, all of them.** They are the reference for every pattern and every link target. For Phase 5:
   - **09 Gamer dashboard:** the dashboard pattern 19 should match, with its banner, To do box, side column, states and empty states.
   - **02 Coach profile:** what a finished coach profile looks like to gamers. 21's fields feed it.
   - **06's coach states and 07's coach states:** link targets from 19 live.
   - **03 and 04:** a focused flow and the hosted-checkout hand-off and return, which is the model for 20's hand-off to Stripe or Xendit.
   - **13:** the role choice and coach-country notice that send people to 17.
   - **0.2 Components.**

6. **`design-system/README.md` and `design-system/tokens.json`:** the brand design system (also at https://claude.ai/artifact/4HHoqwJVacXMMDzG9XLp4n).
7. **`design/explorations/mono-specimen.html`:** what is set in Geist Mono. Where it differs from DECISIONS.md, DECISIONS.md wins.
8. **`landing.html`:** brand feel and the coach pitch ("coaches who want to teach") only, not a template.

## Flow consistency: the rules for this phase

- **Every interactive element maps to a node in diagram 8 (or its neighbours) and to a state that exists.**
  - Before building, make a link map: each button, link, form submit, save, upload and error recovery on 17 to 21, the flow node it belongs to, and the page and state it leads to (`18#draft`, `19#approved`, `20#verified`, `06#coach-upcoming`…). Put the map in your first message.
  - Anything with no node or no existing target is a gap: ask, don't invent.
  - Targets in later phases (22 Coach profile settings, 23 Coach sessions, the 02 preview mode) are inert links, marked as such in the map.
- **Cover every branch of diagrams 8 and 12:**
  - draft and resume
  - submit
  - under review
  - each kind of rejection (first or second, third with its date, not eligible)
  - approved with each gate done or to do
  - payout in progress, verified and couldn't verify
  - profile steps, saved and resumed, and complete
  - live

  Say in the map which state shows each node.
- **The coach dashboard (19) is the hub.** Every stage of the journey has a 19 state, and that state's one primary action is the next step (Continue your application, Set up payouts, Finish your profile…). Every page in the journey has a way back to 19.
- **Same words everywhere.**
  - Reuse labels already in the product exactly: "Become a coach", "Coach dashboard", "Coach sessions", "New Coach", "Browse coaches", "Back to dashboard", "View session", the upload hint and error lines from DECISIONS.md "Uploads", and the image-check refusal lines.
  - Decide each new label once (e.g. "Start your application", "Save and continue", "Submit application", "Set up payouts", "Try again", "Contact support") and use it identically on every Phase 5 page. List the new labels in your first message.
  - The fixed wording from DECISIONS.md: "Your payout account couldn't be verified", "You can reapply from {date}" with the reason why, the coach-country line, and the image check's "This image can't be shown on Harbourly. Choose a different one." and "This photo can't be used on Harbourly. Choose a different one."
- **Same facts everywhere:**
  - The coach country list is the payout list.
  - Prices are in the coach's own currency, never "≈" on the coach's own pages.
  - Payout figures show the 12% commission as 06's coach view does.
  - Dates and times use the product's format (`Mon 5 Oct`, 24-hour, zone label) in the coach's own time zone. Write in British English.
- **Plain, trustworthy copy.**
  - Say why each thing is asked. Proof of rank: the team checks the rank you claim. Government ID: Stripe or Xendit checks it, and Harbourly never sees or stores it. Bank account: where your payouts go.
  - Say who is doing what and roughly when ("Our team reviews applications. We'll email you with the outcome.") without promising a review time I haven't agreed.
  - Rejections are respectful and specific: the reason, what to change and where. Never blame the person.
- **Navigation stays as built:**
  - Logged-in top nav, the sidebar with Gamer and Coach blocks, the burger below 1000px, the logo to the dashboard.
  - Decide with me which blocks and which highlighted link each Phase 5 page shows, and whether 17, 18, 20 and 21 sit in the full app shell with the sidebar or in a focused narrow layout like 04.
- **Link the mockups together.**
  - `data-link="19#approved"` on an `<a>` opens that page's mockup at that state in a new tab. Cross-page buttons must be `<a class="button">`, because the harness only sets `href` on `<a>`. `data-go="state"` switches state within the page.
  - Add 17 to 21 to the page table in `foundations/mockup.js` once published.
  - Then propose, don't just do, these changes, so the whole prototype can be walked from a new account to a live coach:
    - wiring the sidebar "Become a coach" link (and the mobile menu's) on snapking shells to 17
    - pointing 13's Finish setting up at 17 when the coach option is chosen
    - adding coach sidebar keys to the harness: Coach dashboard → 19, Coach sessions inert until 23
    - wiring Kairo's coach-view shells on 02, 06, 07 and 08 to 19 live
    - republishing those pages
- **One story per account.** Phase 5 needs one applicant whose journey runs from draft to live, and one live coach for 19's live state. Don't invent a new cast without asking. See the gaps below.

## Accessibility and mobile (matters most on long forms)

- **Every field:**
  - has a visible label, not just a placeholder, and a helper line where useful
  - shows an inline error tied to the field
  - has a counter where there's a limit (bio 500, captions 80)
  - signals errors with more than colour: there is no red in this product, so errors use Field's amber border plus an icon and a message, as in the library
- **Long forms:** they are split into steps or clear sections. Each one has a quiet "Draft saved" / "Saved" line, and none loses anything when you leave. Validation runs on submit and on leaving a field, never while typing. On submit, focus moves to the first error with a summary at the top.
- **Uploads:**
  - A visible "Add images" button (not drag-and-drop only), the file-type and size hint, and progress.
  - Each file in its own row or tile with its own state and its own Remove.
  - Error lines that name the file.
  - A "Checking…" state that doesn't block the rest of the form.
- **Weekly availability** works with a keyboard and on a 320px phone (no tiny grid cells), and always shows the time zone.
- **Phone-first and the primary action:**
  - One column on phones, 16px+ inputs (no iOS zoom), and 44px minimum targets.
  - The right `autocomplete`, `inputmode` and `type` hints in the markup (url for the marketplace link, decimal for prices).
  - One primary action per screen. Loading states disable the submit and say what's happening ("Submitting your application…").
  - Nothing important sits only in a toast.
- **Layouts scale cleanly from 320px to a large desktop** (container queries, as everywhere else). Check 1440, 1280, 1024, 820, 390 and 320 wide, and a short desktop window (1280×720). Forms sit centred at a readable width on desktop; 19 uses the width like 09.

## Before you build anything

Read everything above, then come back to me with all of this in one message:
- **Each page:** your understanding of its layout and how its states differ, in a few lines (17 to 21).
- **The link map** (see the rules above), including which diagram 8 or 12 node each state shows.
- **The new labels and copy** you propose, in a short table: buttons, the status lines for each stage, the rejection reason lines, the price-floor error and the upload errors.
- **Every gap or ambiguity** you find in the decisions or flow, each with your recommendation, so I can answer quickly. The ones I already know about:
  - **Who applies.** snapking (gamer only so far, Singapore, so Stripe and SGD with a S$10 floor) arriving from the sidebar's "Become a coach" after the Phase 3 story? Or a new cast member arriving from 13's coach choice? 19's **live** state: Kairo (past New Coach, Philippines, Xendit, ₱, already the coach in 06's coach states, 02 is his profile) or the applicant once live? Say how the data stays consistent with Phases 1 to 3 either way. For example, a snapking who is a coach means the Gamer block's links still go to snapking's 09 and 10.
  - **The mockup "now"s for each stage** of the applicant's journey. They must come after the Phase 3 story (whose last "now" is Thu 15 Oct 2026) if the applicant is snapking. Also give the "now" for 19 live (Mon 5 Oct 2026, 14:12 PHT matches 09's busy moment and 06's coach states). DECISIONS.md's example "You can reapply from 19 Oct" needs reconciling with whichever dates you pick.
  - **The "Phone verified" gate.** Everyone verifies a phone at sign-up now, so it is always done. Recommend how 19's checklist shows it: done with the masked number, kept for the edge case where support removed a number.
  - **18's details:**
    - Whether proof images are up to 5 per game or 5 for the whole application.
    - Whether a game's "Rank or top achievement" is one free-text field (about 40 characters, as "Ranks" says).
    - The length limit for "What made you start coaching".
    - How the optional marketplace link is validated.
    - How many games one application can list.
  - **Rejection reasons.** The categories in DECISIONS.md are proof doesn't show the rank claimed, proof images unclear, and rank below our minimum. "Rank below our minimum" has no defined minimum (ranks are free text and there are no ladders). Ask what it means or drop it. Also ask which section each reason flags, and what changes count as "something in the flagged section has changed".
  - **19 layout and states:**
    - Should it mirror 09: wide shell, welcome banner, a To do box with the one accent line, a side column?
    - How many states it draws: draft, submitted, rejected (resubmit now), rejected (wait), not eligible, approved with gates to do, approved with payout couldn't verify, live, plus empty, loading and error.
    - Propose a compact set for "every card's empty, loading and error" rather than one state per card per case.
  - **Earnings on 19 live (released and held).** "No charts, trends, totals or analytics on dashboards" is a firm rule. Propose a plain way to show released and held money (e.g. "Held until released" per session with dates, and "Paid out" with the latest payout) that isn't a totals tile, and ask.
  - **19 live's links:**
    - The next session → `06#coach-upcoming`.
    - The reschedule request → `06#coach-request-received`.
    - The open dispute → `06#coach-dispute`.
    - Game listings with "Manage" and "Under review" → 22, inert.
    - "Coach sessions" → 23, inert.
    - "Preview my public profile" → 02 as built, until 22 adds preview mode.
    - Check which 06 coach states exist and fit, and which are missing.
  - **20 Payout setup:**
    - The hand-off to the provider's hosted onboarding and back. Recommend not drawing Stripe's or Xendit's pages, like checkout in 04 and 05.
    - What "in progress" means: they left the provider's flow part-way, or the provider is still checking.
    - Where the country lock shows.
    - What the provider link is called.
    - What a live coach's payout settings show. Status only? Recent payouts? Ask.
  - **21 steps:** the step order (e.g. about you, languages, availability, games and prices, showcase, review), and whether it's one long page with sections or one step per screen.
  - **21 fields:**
    - The languages field: a fixed list or free text, and which languages.
    - The weekly availability editor: whole hours, since sessions are fixed at 60 minutes; per-day ranges or a grid.
    - The length of the up-to-3 credential lines.
    - Whether the coach's avatar is the same photo as their account photo in the top nav (recommend yes, one photo).
  - **The price floor.** The copy when a price is under it, and whether the field shows the floor up front.
  - **Image check states.** Which states 21 draws per upload type (photo, banner, showcase: checking, live, refused), and what's shown while a check is running and the coach presses Save and continue.
  - **The New Coach label.** Does 19 or 21 tell a new coach about it (5 completed sessions, no upheld dispute)? Not specced, so ask before adding anything.
  - **Suspended and banned.** Whether these need 19 states in Phase 5 or later.
  - **Emails.** Recommend not drawing the coach-journey emails as pages.
  - **Phase 6 items.** The voice intro and portfolio are Phase 6 and still to be decided. Nothing in 21 should ask for them.

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
| Coach card v2 (exploration) | https://claude.ai/artifact/WsAyxiSS39SwGyE3QYp3Xn | `design/explorations/coach-card-v2.html` |
| Sign up split layout (exploration) | https://claude.ai/artifact/QfL2PD3dCfK7wa6NpjD8qa | `design/explorations/auth-split.html` |
| Panel message (exploration) | https://claude.ai/artifact/JiEipPbboBorAiwpNxPW1W | `design/explorations/auth-panel-copy.html` |
| User flow | https://claude.ai/artifact/8QiSx8pFYigdVWvUsqqXBm | `design/USER-FLOW.md` (published copy `design/user-flow.html`) |
| Canvas, "Harbourly webapp" | https://claude.ai/artifact/AqzF4kYNMmXf555w8KbJpZ | Every library section and every Phase 1 to 4 state, desktop and phone |

### State ids you can link to

Link with `data-link="NN#id"`.

**05:** confirming, confirmed, failed, released.

**06, gamer view:** upcoming, cancel-confirm (full refund), cancel-late (inside the last hour), cancelled, coach-cancelled, locked, reschedule-form, reschedule-waiting, reschedule-received, reschedule-keep-or-cancel, moved, reschedule-declined, reschedule-expired, join, in-session, pending, pending-soon, confirm-step, completed-review, review-posted, disputed-open, disputed-review, resolved-refunded, resolved-paid, payment-problem, awaiting-payment, expired, loading, error, reported (Kairo reported a problem, respond), reported-responded.

**06, the dashboard's other bookings (Phase 3):** kairo-tue, vexa-request, mirae-pending, mirae-confirm, ghostline-review, nullpoint-open. Their onward links are inert.

**06, coach view (Kairo):** coach-upcoming, coach-cancel, coach-request-received, coach-pending, coach-completed, coach-dispute.

**07:** gamer-after, mirae-after (Phase 3), gamer-noshow, gamer-payment, coach-after, coach-payment, validation, upload-error, submitted, respond, response-sent, gamer-respond, gamer-response-sent.

**08:** waiting, no-show, coach-waiting, live, camera, share, banner-10, banner-5, banner-1, end-confirm, end-sent, end-received, reconnecting, other-dropped, blocked, ended, coach-ended.

**09:** busy, todo-all (the To do page), reported (Kairo reported a problem, Thu 8 Oct), quiet (nothing to do), new (brand-new account), loading, error.

**10:** list, empty, loading, error.

**11:** form, booking, errors, loading.

**12:** sent, resent, expired, verified, verified-other.

**13:** form, google, missing, phone, wrong-code, filled, username-taken, coach-unavailable, booking, submitting, under-18, not-available. The role choice is a live radio in every form state. Finish setting up in `filled` and `booking` is a `data-link`, today always to `09#new` (or `03#returning` for booking).

**14:** form, booking, wrong, too-many, loading.

**15:** request, sent, new-password, expired, done.

**16:** terms.

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
| ResultPanel | Added in Phase 4. A whole-page outcome: icon, title, text, one way on. Useful for "Application submitted" and "Not eligible" if they are full-page outcomes |

**Behaviour files** sit beside the components: `OtpInput.js`, `Rating.js` (star input), `Field.js` (character counter, password Show and Hide), `ScrollArea.js`. Every component is shown on the component library page.

**`design/foundations/icons.js`:** the line icon sprite (24px grid, 1.8 stroke). Use `<svg class="icon"><use href="#i-name"/></svg>`, and add new icons in the same style. `design/foundations/flags.js` has simplified country flags (ph, sg, my).

**`design/foundations/mockup.css` and `mockup.js`:** the mockup harness, not product code.
- Pages put each state in `<section data-state="id" data-label="Label">` inside `<div class="mk-frame" data-page="NN Page">`. The harness builds the state switcher and the desktop/phone toggle. `window.mk.set(stateId, "desktop" | "phone")` switches state from a script.
- A state with `data-shell="name"` is wrapped in `<template id="shell-name">`. That is the app shell, written once per page; copy the gamer shell from 09 and the coach shells from 06. `data-nav="key"` marks the current sidebar link.
- The harness wires the burger menu and the `data-link` cross-page links. It gives sidebar links and the logo their targets (Dashboard → `09#busy`, Browse coaches → `01#results`, My sessions → `10#list`) **only on shells whose `.topNavUser` aria-label starts with "snapking,"** (the `NAV` table near the top of `mockup.js`). For coach shells you'll need coach keys and a matching rule. Propose them.
- `.mk-hint` (dashed "Mockup: …" line) is a mockup-only shortcut for steps that happen outside the app, such as opening an email link. It is hidden in canvas renders. 20 may want one for "back from Stripe".
- Use a 2-digit `data-page` name, e.g. `19 Coach dashboard`.

**Page behaviour:** a page's own interactions (like `data-go` steps) go in a `<script>` in the page. Behaviour that belongs to a shared component goes in `foundations/components/<Name>.js`, included before `mockup.js`. `build.mjs` inlines local scripts.

**Editing pages:** every earlier page was generated once by scratch scripts that aren't in the repo. The HTML files are the source now, so edit them directly. If you generate Phase 5 pages with a script, treat the HTML as the source once it's committed.

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
- For a very large page (06, about 215 KB) the refusal instead saves the live source and asks you to Read every line of it:
  1. Diff it locally against a build of the repo version (strip the platform's wrapper lines).
  2. Read it in chunks of about 450 to 700 lines (25,000 tokens per Read).
  3. Publish.

**Watching:** each chat can watch at most 10 artifacts for changes. A "wake subscription not registered" notice after that is harmless.

**Render the frames** with `node design/tools/render.mjs <outDir>/<page>.html <framesDir> <prefix>`. The prefix is `17` to `21`. An optional 4th argument sets the window height (default 900; 09 uses 700 because of its fixed-height desktop columns). It renders every state at 1440 and 390 wide, at 2x, as `<prefix>__<state>__<desktop|phone>.png`.

**Test before publishing:**
- Playwright is installed globally. A test script of your own loads it with `createRequire(import.meta.url)(execSync('npm root -g').toString().trim() + '/playwright')`.
- Write one that, for every state, clicks every `[data-link]` and `[data-go]` in the visible state (`[data-state]:not([hidden])`) and checks the target exists.
- Write another that loads every state at 320, 390, 820, 1024, 1280×720 and 1440 and reports any horizontal overflow.
- The Phase 4 versions were scratch files and are gone.

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
- The phase titles are at y = 22,971 (Phase 1), 57,058 (Phase 2), 105,255 (Phase 3) and 115,285 (Phase 4). The canvas ends at y = 136,526 (30 Oct 2026).
- Phase 5 goes below Phase 4. After publishing its pages, add these to canvas.py: `("phase5", "Phase 5 · Becoming a coach", [...])` to `PHASES` and `"phase5": ("check6", "Checkpoint 6: coach onboarding, pages 17 to 21.")` to `CHECKS`, following Phase 4's entries.
- If you add a library section, add its id to the last library row (it ends with `access`, the "Sign up and log in" section).

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
  - No red. Decide with me which colour "Under review" and "Not eligible" use.
- **Icons:** inline SVG line icons only, from the sprite.

## Avoid ("not AI-looking")

- **Colour:** purple, indigo or blue-to-pink gradients; gradient text; colours outside the palette.
- **Effects:** glassmorphism (except the top nav); heavy shadows; glow everywhere; hover effects on things that aren't interactive.
- **Icons and decoration:** emoji, sparkle icons, mixed icon styles; blobs, abstract illustrations, stock imagery.
- **Layout:** three-column grids of identical icon-in-a-square feature cards (17's "what's involved" is the obvious risk: write it as plain, specific copy); centring by default; identical padding and weight everywhere with no hierarchy.
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

**Mockup times:** Phase 1 mockups are set at Mon 5 Oct 2026, 14:10 SGT. The "now"s for Phases 2 to 4 are in DECISIONS.md: "Mockup times (Phase 2)", "Booking set and mockup times (Phase 3)", "Phase 4 decisions" and "Gamer response to a coach's report". Phase 5 needs its own; see the gaps. Full cast details are in DECISIONS.md, and bios are in `design/pages/01-browse-coaches.html`.

**Keep using the same cast:**

| Who | Details |
|---|---|
| **Kairo** `@kairo.gg` | Philippines, English and Filipino, PHT. Past the New Coach period (no label), 4.9 (57). Mobile Legends `Mythical Glory · 85★` at ₱1,850 (≈ S$43); Call of Duty: Mobile `Legendary · Top 500` at ₱2,100 (≈ S$49). Paid with Xendit. Payout per Mobile Legends session ₱1,628.00. He is the coach in every coach-view state of 02, 06, 07 and 08. |
| **Vexa** `@vexa` | Singapore, English and Mandarin, SGT. Past the New Coach period (no label), 4.8 (32). Valorant `Immortal 2` at S$45. Paid with Stripe. |
| **nullpoint** `@nullpoint` | Malaysia, English and Malay, MYT. New Coach, no reviews. Counter-Strike 2 `Premier 21,450` at RM 150 (≈ S$43). |
| **Mirae**, **Ghostline** | |
| Filler coaches | Lumen, Pallas, Marlowe, Kestrel, Tidewalker, Rook, Hanabi |
| **snapking** | Ryan Tan, born 14 Mar 1999, snapking@example.com, +65 9182 4567 (shown as "+65 •••• 4567"), Singapore (SGT, SGD). Gamer only so far; the sidebar shows "Become a coach". Signed up Thu 24 Sep 2026, 11:00 SGT. His bookings with Kairo, Vexa, Mirae, nullpoint and Ghostline are listed in DECISIONS.md ("Booking set and mockup times (Phase 3)"). |

## How I like to work

- Explain any non-obvious design decision in one sentence.
- If anything in the feature list, flow or decisions is ambiguous, **ask me before guessing**. Never add features, sections or data without asking.
- When I ask for a layout change I haven't seen, confirm your understanding first. If the change is big, make a quick exploration in `design/explorations/`, publish it, show me the renders, and build only after I approve.
- Record every new decision I approve in `design/DECISIONS.md` (a "Phase 5 decisions" section). Keep `USER-FLOW.md` (and `user-flow.html`, republished) and `BUILD-ORDER.md` in sync if anything changes. When a decision reaches other pages or later phases, say which and update their entries.
- Commit and push work to the designated branch as you go (the repo's stop hook requires it). Don't open pull requests unless I ask.
- I'm not a design specialist on token and type-scale questions. Recommend a choice and explain briefly.
- I care about Pro usage: build each page once, well, rather than duplicating work.
- When I ask to see a page, open its artifact in the chat.
- Each phase ends with a review checkpoint. Don't start the next phase until I've reviewed.
- Keep this handoff (`design/HANDOFF.md`) current at the end of each phase.

## Open items

**For Phase 5:**
- **13's coach choice:** in the mockup, Finish setting up goes to 09 whichever role is chosen. Now that 17 exists, point it at 17 when "coach" is chosen with a coach country (Singapore, Malaysia, Philippines). Gamers, and coaches in other countries (13 `coach-unavailable`), keep going to `09#new`. A booking sign-up keeps returning to `03#returning`.
- **Languages field:** design it in profile setup (21). Coach profile settings (22) reuses it.
- **Rank proof check (kept, 23 Oct 2026; may be dropped later):** ranks stay checked against proof screenshots at application and on every rank change, as DECISIONS.md "Ranks" says. "Credentials: optional" on the landing page means the portfolio only. If it's dropped later, this changes in the webapp:
  - 17 loses "proof of your rank" from "What you'll need".
  - 18 loses the proof images (up to 5), their upload error state, and the rejection reasons about proof ("proof doesn't show the rank claimed", "proof images unclear").
  - 22: "Update rank" goes live at once (no screenshot, no pending state, no old rank held), and "Add a game" may need no proof. Then there's no "under review" listing, also on the coach dashboard (19).
  - The "Rank update: approved or declined" email goes.
  - In DECISIONS.md, "Ranks", "Coach location and identity" (what you'll need), "Rejected coach applications" (reason examples) and the Uploads table's rank-proof row change.
  - In USER-FLOW.md, diagrams 8 (application step 2) and 9 (add a game) change.
  - Pages 01 to 05 don't change. The held-back idea of a "Rank checked by Harbourly" line would then be off the table.
- **Phase 6:** voice intro length and portfolio format are still to decide. Nothing in Phase 5 asks for them.
- **When building:** confirm on a real iPhone that camera photos convert to JPEG on upload. This matters for 18's proof images and 21's photos.

**Carried forward:**
- **Avatar and showcase images:** I'll supply fictional avatar and showcase images. Until then, avatars show the default (first letter in Sora) and showcase images and uploads are marked empty slots.
- **Mockup-only hints:** 12 and 15 carry a dashed "Mockup: open the link in the email" line (`.mk-hint`) so the prototype can be walked. It's hidden in canvas renders and isn't part of the design.
- **03 "Phone not verified" state:** everyone verifies their phone at sign-up, so this state is an edge case (for example, a number removed by support). Kept as built.
- **Logged-out currency (assumed, not confirmed):** logged-out visitors see SGD in the mockups. How their currency is chosen is still to decide.
- **Ideas held back (not approved):** a "Rank checked by Harbourly" line under ranks; a one-line explanation of "New coach"; a sticky Continue bar on phone for Pick a slot. Raise them only if relevant.
- **Next-session card in the dashboard banner (removed 28 Oct 2026, kept for later):**
  - In the dashboard v2 exploration, a compact card on the right of the welcome banner showed the next session: who, game, date and time, "Join opens at 19:50 SGT, in 29h 38m", with Join session and View session stacked on its right. It carried the green accent line.
  - It was removed to give the To do and side columns more height.
  - The full version is kept in `design/explorations/dashboard-v2-banner-next-session.html` (and in git, commit `19214aa`).
  - If it comes back: the accent line moves from the To do box to this card, the banner is two columns again, and "Coming up" drops its first block (the next session with Join session) and lists only the later sessions.
  - If 19 mirrors 09, the same choice applies there.
- **Post-MVP:**
  - several sessions in one checkout, and session packs
  - importing reviews from Metafy and Fiverr (DECISIONS.md, "Policy update, 23 Oct 2026")
  - other session lengths and types
- **Landing copy (the owner's to change, don't edit it):** two lines in `landing.html`'s FAQ go further than the webapp:
  - It says either side can report a no-show and an unconfirmed report becomes a refund. The webapp keeps no-shows as disputes, and only a coach no-show refunds automatically after 24 hours.
  - It promises importing reviews from Metafy and Fiverr, which is post-MVP.
- **04's hold countdown:** 04#same-currency shows 28:41 left, while 06 and 09 show 24:12 for the same Vexa hold at 14:12. Left as is, because 04 shows the hold as it was when first opened.
- **Sign-in services (agreed 28 Oct 2026):** Supabase Auth, Resend for auth emails (as Supabase's SMTP) and Twilio Verify for phone codes. Details are in DECISIONS.md, "Sign-in services".
- **Before code is built (not before design):**
  - confirm coach launch countries with Stripe and Xendit (including Thailand)
  - pick an exchange-rate source
  - pick the image moderation service (options in BUILD-ORDER.md)
  - finalise chat retention with the Terms of Service

## Next step

Read everything above, then send me your Phase 5 message: your understanding of 17 to 21, the link map, the new labels and copy, and every gap with your recommendation. Build only after I answer.
