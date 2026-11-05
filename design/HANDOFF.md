# Handoff prompt

Paste everything below the line into a new chat. Last updated 5 Nov 2026 (end of Phase 6, before checkpoint 7). Phases 0 to 6 are built and published. Phase 7 starts only after the owner has reviewed Phase 6 at checkpoint 7. The Phase 6 brief that came before this one is in git history (this file before 5 Nov 2026); what was decided and built in each phase is in DECISIONS.md and BUILD-ORDER.md.

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
| 6 Running a coach profile | 22 Coach profile settings, 23 Coach sessions | Built 5 Nov 2026; checkpoint 7 (coach side complete) is the owner's next review |
| **7 Account and system pages** | **24 Account settings, 25 System pages** | **Your task, once checkpoint 7 is closed** |

**The plan from here (the owner's order):** checkpoint 7, then Phase 7 with the research practice below. Only after Phase 7 does the owner review Phases 1 to 5 for improvements. Until then, earlier pages change only where a Phase 7 decision reaches them (a link, a new state, a shared component), and you say which ones. If checkpoint 7 asks for changes to 22 or 23, make those first.

**What Phase 6 settled that Phase 7 builds on** (DECISIONS.md, "Phase 6 decisions"):
- **22 Coach profile settings** (`/coach/profile`) is an **overview plus one page per section**: SettingsSection blocks in 02's order (photo and banner, about you, voice intro, showcase, games and prices, portfolio, availability), each showing what gamers see now, its status, anything checking or with the team (a dashed PendingSlot), and Edit. Section pages: "← Profile settings", a lead line that says how that section saves, the form card, then the action and Cancel. Coach dashboard stays highlighted (22 isn't a sidebar link). **24 Account settings should reuse this shape**: SettingsSection was made for both.
- **How things save:** typed content with **Save changes** (live at once, "Saved · 14:15. Gamers see this now."); image files straight to the automatic check (the current one stays until the new one passes); team items with **Send for review** (Withdraw while under review; declined with the reason, a TeamNote and Dismiss). Validation on leaving a field and on save, with an error summary. Leaving with unsaved changes uses the browser's own prompt (not drawn).
- **The profile photo** on 22 is also the account photo: 24 edits the same photo with the same states and lines (checking; live; refused with "This photo can't be used on Harbourly. Choose a different one."; the current one stays until the new one passes).
- **23 Coach sessions** mirrors 10. Kairo's coach-view 06 copies now cover every row (`coach-tamtam-pending`, `coach-ricebowl-completed`, `coach-nightjar-completed`, `coach-milo-completed`), and every coach-view "Coach sessions" back link opens 23.
- **New policy (G14):** voice intros and portfolio links must not include contact details or ask gamers to book outside Harbourly (a decline reason).
- **"Copy profile link"** sits beside "Preview my public profile" on 22's overview (`harbourly.gg/coaches/kairo.gg`, "Link copied" in place, never a toast).
- **Inert links you'll meet:** the account row in every top nav and burger menu (→ 24), Kairo's "Withdraw" on rank updates and the new game (no state drawn), and 22's time-shifted what-if states (their onward links stay inert, like Phase 3's).

**Your task (after checkpoint 7): build Phase 7, "Account and system pages".** The pages are:
- **24** Account settings
- **25** System pages

The full spec is in `design/BUILD-ORDER.md`, "Phase 7", and USER-FLOW diagram 10. Work the way Phases 4 to 6 were built:
1. Read everything below.
2. **Research first** (the next section).
3. Send me **one message** with what you looked at and what you're taking from it, your understanding of each page, a link map and every gap, with your recommendations.
4. **Build only after I answer.**
5. Build each page once, well.
6. Render and check every state at desktop and phone, and click through every link.
7. Publish each page.
8. Put the frames on the canvas under a "Phase 7 · Account and system pages" title (see "The canvas": it is full, and that has to be settled first).
9. **Stop for checkpoint 8** ("final consistency pass across every page"). After that, the owner reviews Phases 1 to 5.

**What makes Phase 7 different:** 24 is where every account, gamer or coach, keeps the private facts Harbourly holds about them true: name, username, photo, email, password, phone, country, time zone and currency, and where they ask to delete the account. Several of those changes need proof before they take effect (a new email is verified first, with a notice to the old address; a new phone needs a code), some are locked for coaches (the country, once payouts are set up), and deleting is blocked while anything is still open. The quality bar is **nobody is ever unsure whether a change has happened yet, and nothing irreversible happens without a clear warning**. 25 is the short set of pages people land on when something goes wrong: 404, something went wrong, session expired, sign in to continue.

## Research before you design (new from Phase 6, and for every phase after)

Before you propose a page, study how the best products solve the same problem, so the layout and placement of every part rest on what's proven to work, not on guesswork.

**What to look at, for each page:**
- 3 to 5 well-regarded products that do the same job, in a similar spirit (calm, trustworthy, marketplace or account tools rather than flashy consumer apps). For 24: how calm, trusted products lay out account settings (for example a payments dashboard's account settings, a marketplace's account page, a password manager's or email provider's security settings, an account-deletion flow). For 25: well-regarded error, not-found and signed-out pages.
- What they put first and what they hide behind a click; how they group sections; where the primary action and Save sit; how they show "live now" against "pending review"; how they preview the public result; how they handle empty, error and pending states; what they do on a phone.
- The established principles behind good layouts: Nielsen's usability heuristics (visibility of system status, match with the real world, user control, consistency, error prevention, recognition over recall), WCAG 2.2 AA, Fitts's law for target size and placement, progressive disclosure, Gestalt grouping and proximity, form design best practice (one column, labels above fields, inline validation on leaving a field, errors that say how to fix them), and clear information hierarchy.

**How to use it:**
- **Inspiration, never a copy.** Take the pattern and the reason it works, then express it in Harbourly's own system. Never recreate a real product's design, and never put real product names, logos, branding or recognisable layouts in the mockups.
- **What's decided wins.** DECISIONS.md, the visual rules and the design system always beat research. If research suggests something that conflicts with them, or adds a feature, section or data that isn't decided, raise it as a recommendation for me to approve. Never build it quietly.
- **Keep it proportionate.** A bounded pass, about 3 to 5 references per page, is enough. Prefer well-known, current products and published design guidance; skip trend pieces and Dribbble-style concept shots, which look good but haven't been tested by real use.

**How to report it:** in your first message, a short section per page, **"What I looked at and what I'm taking from it"**: each reference in one line (what it is, the one thing worth borrowing and why), then how it shaped your proposal. Say where you deliberately did something different, and why. When a recommendation in your gaps list comes from research, say so.

## Phase 7 at a glance

This is drawn from the flow and decisions. Check it against them; don't trust this summary alone.

**Diagram 10 is the spec.**
- **Account settings (24):** name, username, avatar (photo checked automatically on upload); change email (verify the new one, notice to the old one); change password; change phone (OTP); country, time zone, currency (a coach's country can't be changed here once payout setup is done); delete account: blocked while there are upcoming sessions or open disputes ("Not yet: finish or resolve them first"), otherwise a confirm step with a clear warning, then "Deletion requested".
- **System pages (25):** 404, something went wrong, session expired (sign in again), sign in to continue on protected pages.

**Already decided that 24 must follow:**
- Username rules (DECISIONS "Phase 4 decisions"): 3 to 20 characters, lowercase letters, numbers, dots and underscores, starts with a letter or number, doesn't end with a dot, unique ignoring case, checked when the field is left, no suggestions, changeable in 24.
- First and last name are private (Harbourly only). Password: at least 8 characters, the breached-password check, the plain hint; Google accounts have no password, and setting one later belongs to 24. Saving a new password logs out other devices and sends "Password changed".
- Phone: 6-digit code, valid 10 minutes, resend after 60 seconds, a Verify button, 5 wrong codes cancel it, one account per number ("That number is already on another Harbourly account. Use a different number."). snapking's number shows as "+65 •••• 4567".
- Country sets the currency; the time zone comes from the device; both can be changed in 24. A coach's country locks once payouts are set up ("To change it, contact support@harbourly.gg.", as on 20 live).
- The photo is the same as 22's (see above). The account row in the top nav and burger menu opens 24.
- Emails (not drawn): "Password changed", "Email changed (sent to the old address)", "Verify your email", "Account suspended".

**Not in Phase 7 unless you find they belong:** suspended and banned states (emails cover them; possibly a 19 state at checkpoint 8: ask).

## Repo and branch

Repo: `ILoveWaterSm/Harbourly-Waitlist-2.0`. `main` has the work up to the browse refinement. Everything since then is on `claude/nifty-goodall-o31ggr`, not merged to `main` yet: Phases 1 to 6, their refinements, the 23 Oct policy update and these docs. It already contains `claude/funny-johnson-7e9olg` and the branches before it.

If your branch doesn't have the "Phase 6 decisions" section in `design/DECISIONS.md`, merge `origin/claude/nifty-goodall-o31ggr` into it first, then work from there. Use a merge commit, not a rebase.

## Read these first, in this order

1. **`design/DECISIONS.md`:** every agreed decision, and the **source of truth**. Anything not covered here or in the flow needs my approval before it's designed. These are the sections Phase 7 leans on most:

   | Section | What it settles for Phase 7 |
   |---|---|
   | "Account and system pages" | What 24 holds; delete account blocked while sessions or disputes are open; the system pages |
   | "Navigation and identity" | The account row (avatar and name) opens `/account`; Sign out beside it |
   | "Phase 4 decisions" | Username, names, password, phone code, country and currency rules; Google accounts have no password |
   | "Sign-in services" | Supabase Auth, Resend, Twilio Verify: what happens behind an email, password or phone change |
   | "Supported countries", "Coach location and identity" | The country list; a coach's country locks once payouts are set up |
   | "Automatic image check for every public image" | The account photo: checking, live, refused |
   | "Phase 5 decisions" | 20 live's country lock line; the coach shells |
   | "Phase 6 decisions" | SettingsSection, how settings save, the shared photo, the labels, the review list for Phases 1 to 5 |
   | "Emails" | Account emails (password changed, email changed, suspended) |
   | "Visual rules for the webapp" | |

2. **`design/USER-FLOW.md`:** the full MVP user flow in 13 Mermaid diagrams.
   - **Phase 7 is diagram 10 (account and system pages), line by line.**
   - Also diagram 2 (sign up and log in: where "session expired" and "sign in to continue" return people) and diagram 13 (navigation: the account row).
   - It's also published at https://claude.ai/artifact/8QiSx8pFYigdVWvUsqqXBm. If the flow changes, run `python3 design/tools/flowsync.py` to copy every diagram and note into `design/user-flow.html`, then republish it to that link.

3. **`design/BUILD-ORDER.md`:** 25 pages in 8 phases, with every state each page must show, its route, size, checkpoint and published link. Phase 7 lists the states of 24 and 25.

4. **`design/foundations/`:** tokens, components, icons, flags and the mockup harness (details below). Read `tokens.css` and the component files before designing anything.
   - The main parts for Phase 7: **SettingsSection** (24's overview), **Field** (text, password with Show and Hide, phone, select, label row, counter, error), **OtpInput**, **ImageUpload** (single media), **SaveStatus**, **Notice** (error summary), **ConfirmStep** (delete account, in place, amber final button), **PendingSlot** (an email change waiting for verification), **ResultPanel** (system pages), **AuthLayout** and TopNav `gate` (signed-out layouts), **EmptyState**, **ErrorState**, **Skeleton**, **Sidebar**, **AppShell**.

5. **The built pages in `design/pages/`, all of them.** They are the reference for every pattern and every link target. For Phase 7:
   - **22 Coach profile settings:** the overview-and-section-pages pattern and the photo states 24 reuses.
   - **13 Finish setting up:** the same fields (names, username, phone with code, country) as a first-time form.
   - **11, 14, 15:** password rules and messages, the AuthLayout used by signed-out pages; **12:** verifying an email.
   - **20 `live`:** the coach's country lock line.
   - **0.2 Components**, especially "Sign up and log in" and "Running a coach profile".

6. **`design-system/README.md` and `design-system/tokens.json`:** the brand design system (also at https://claude.ai/artifact/4HHoqwJVacXMMDzG9XLp4n).
7. **`design/explorations/mono-specimen.html`:** what is set in Geist Mono. Where it differs from DECISIONS.md, DECISIONS.md wins.
8. **`landing.html`:** brand feel and the coach pitch only, not a template.

## Flow consistency: the rules for this phase

- **Every interactive element maps to a node in diagram 10 (or its neighbours) and to a state that exists.** Before building, make a link map: each button, link, save, upload, code entry, confirm and error recovery on 24 and 25, the flow node it belongs to, and the page and state it leads to. Put it in your first message. Anything with no node or no existing target is a gap: ask, don't invent.
- **Cover every branch of diagram 10:** each change that saves at once; each that needs proof first (email, phone) with what shows while it waits; the coach's locked country; delete account blocked, confirm, requested; and each system page.
- **Same words everywhere.** Reuse labels already in the product exactly (Phase 4's: "Send code", "Verify", "Resend code", "Change number", "Save new password", "Send a new link"…; Phase 6's: "Save changes", "Cancel", "Replace", "Remove", "Add a photo"). Decide each new label once and list them in your first message.
- **Same facts everywhere:** snapking's details (Ryan Tan, snapking@example.com, "+65 •••• 4567", Singapore, SGT, SGD; a coach since Sat 24 Oct with Stripe), Kairo's (Philippines, PHT, PHP, Xendit, country locked). Dates and times in the product's format, British English.
- **Navigation stays as built.** 24 isn't a sidebar link: decide with me what it highlights (nothing, as the top nav's account row opens it?). The account row's link in every shell is set in `mockup.js`, so wiring it reaches every page: propose it, with the list of pages to republish.
- **Link the mockups together:** `data-link="24#…"` on an `<a>`; `data-go` within the page; add 24 and 25 to `PAGES` in `mockup.js` once published.
- **One story per account.** Don't invent a new cast without asking.

## Accessibility and mobile

- **Every field:** a visible label, not just a placeholder, and a helper line where useful; an inline error tied to the field; a counter where there's a limit (bio 500, captions 80, credentials 60, rank 40); errors signalled with more than colour (Field's amber border, an icon and a message; there is no red).
- **Long settings pages:** clear sections, each saying how it saves. Nothing is lost by leaving: say what happens to unsaved changes. Validation runs on save and on leaving a field, never while typing. On save, focus moves to the first error with a summary at the top.
- **Uploads:** a visible button (not drag-and-drop only), the hint, progress, one row per file with its own state and Remove, error lines that name the file, and a "Checking…" state that doesn't block the rest.
- **Codes and passwords:** OtpInput's rules (digits only, paste, `autocomplete="one-time-code"`), password Show and Hide, `autocomplete="new-password"` / `"current-password"` and `"email"`.
- **Irreversible actions:** a confirm step in place, with exactly what happens and what can't be undone.
- **Phone-first and the primary action:** one column on phones, 16px+ inputs (no iOS zoom), 44px minimum targets, the right `autocomplete`, `inputmode` and `type` hints, one primary action per screen, loading states that disable the button and say what's happening, nothing important only in a toast.
- **Layouts scale cleanly from 320px to a large desktop** (container queries, as everywhere else). Check 1440, 1280, 1024, 820, 390 and 320 wide, and a short desktop window (1280×720).

## Before you build anything

Once checkpoint 7 is closed, read everything above and do the research, then come back to me with all of this in one message:
- **What I looked at and what I'm taking from it**, per page.
- **Each page:** your understanding of its layout and how its states differ, in a few lines (24, 25).
- **The link map**, including which diagram 10 node each state shows.
- **The new labels and copy**, in a short table.
- **Every gap or ambiguity**, each with your recommendation. The ones I already know about:
  - **Who and when.** snapking (gamer and new coach, Singapore, Stripe) for most of 24, and Kairo for the coach's locked country? Give the "now" for each state.
  - **24's structure.** An overview of SettingsSection blocks with a page per section, as 22? Which sections, in which order? What the top nav's account row highlights.
  - **Email change.** What shows while the new address is unverified (the old one stays in use?), the notice to the old address, resending, expiry.
  - **Password.** Change (current password needed?), set one for a Google account, logging out other devices.
  - **Phone change.** The code flow from 13, and one account per number.
  - **Country, time zone, currency.** What a gamer's country change does to their currency and to prices already paid; the coach lock and its wording; whether currency is its own choice or follows country.
  - **Delete account.** Exactly what blocks it for a gamer and for a coach (upcoming sessions, open disputes, money still held?); what "Deletion requested" means (a grace period? an email?); what happens to reviews written and sessions in the history.
  - **System pages.** Which shell each uses (signed-out pages with AuthLayout or the gate nav; signed-in errors inside the app shell?), what each offers as the way on, and how "sign in to continue" returns people to where they were.
  - **The photo.** 24 and 22 edit the same photo: say how each shows it.
  - **Anything research suggests that isn't decided** (two-step sign-in, active sessions list, data export…): list it as a recommendation, don't add it.
  - **Emails.** Recommend not drawing them.

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
| 22 Coach profile settings | https://claude.ai/artifact/QLJBYMizAiBYA8eCW1BuJG | `design/pages/22-coach-profile-settings.html` |
| 23 Coach sessions | https://claude.ai/artifact/TsLQ1ZB6C3stYYVgKE2myS | `design/pages/23-coach-sessions.html` |
| Coach card v2 (exploration) | https://claude.ai/artifact/WsAyxiSS39SwGyE3QYp3Xn | `design/explorations/coach-card-v2.html` |
| Sign up split layout (exploration) | https://claude.ai/artifact/QfL2PD3dCfK7wa6NpjD8qa | `design/explorations/auth-split.html` |
| Panel message (exploration) | https://claude.ai/artifact/JiEipPbboBorAiwpNxPW1W | `design/explorations/auth-panel-copy.html` |
| User flow | https://claude.ai/artifact/8QiSx8pFYigdVWvUsqqXBm | `design/USER-FLOW.md` (published copy `design/user-flow.html`) |
| Canvas, "Harbourly webapp" | https://claude.ai/artifact/AqzF4kYNMmXf555w8KbJpZ | Every library section to "Coach onboarding" and every Phase 1 to 5 state, desktop and phone. Phase 6's frames are uploaded but not placed (see "The canvas") |

### State ids you can link to

Link with `data-link="NN#id"`.

**01:** results, guest, filtered, empty, loading, more, error.

**02:** verified (Kairo, several games), portfolio (with a portfolio, after it passes review; Phase 6), one-game, new-coach, guest, own (Kairo's own profile; Edit profile opens 22), preview (preview mode, Kairo, "Back to profile settings" opens 22), loading, not-found.

**03:** available, guest, none, taken, returning, phone.

**04:** different-currency, same-currency, under-24h, nearly-expired, expired, failed.

**05:** confirming, confirmed, failed, released.

**06, gamer view:** upcoming, cancel-confirm (full refund), cancel-late (inside the last hour), cancelled, coach-cancelled, locked, reschedule-form, reschedule-waiting, reschedule-received, reschedule-keep-or-cancel, moved, reschedule-declined, reschedule-expired, join, in-session, pending, pending-soon, confirm-step, completed-review, review-posted, disputed-open, disputed-review, resolved-refunded, resolved-paid, payment-problem, awaiting-payment, expired, loading, error, reported (Kairo reported a problem, respond), reported-responded.

**06, the dashboard's other bookings (Phase 3):** kairo-tue, vexa-request, mirae-pending, mirae-confirm, ghostline-review, nullpoint-open. Their onward links are inert.

**06, coach view (Kairo):** coach-upcoming, coach-cancel, coach-request-received, coach-pending, coach-completed, coach-dispute.

**06, the coach dashboard's other bookings (Phase 5, Mon 5 Oct 14:12 PHT):** coach-kairo-tue (snapking, Tue 6 Oct), coach-milo-request (milo.exe asked to move Fri 9 Oct), coach-ozzie-dispute (ozzie reported "Session ended early"). Their onward links are inert.

**06, coach sessions' other rows (Phase 6, Mon 5 Oct 14:12 PHT):** coach-tamtam-pending, coach-ricebowl-completed, coach-nightjar-completed, coach-milo-completed (no review yet). Their onward links are inert. Every coach-view "Coach sessions" back link opens `23#list`.

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

**22:** overview, loading, error; about, about-errors, about-saved; photos, photos-checking, photos-refused; voice, voice-blocked, voice-recording, voice-recorded, voice-pending, voice-declined; showcase, showcase-checking, showcase-refused, showcase-remove, showcase-empty; games, games-saved, games-error, games-remove; rank, rank-sent, rank-declined, rank-approved; add-game, add-game-pending, add-game-declined; portfolio, portfolio-pending, portfolio-live, portfolio-declined; availability. Kairo, Mon 5 Oct 14:12 to 14:40 PHT; the declined, approved and portfolio outcomes are what-ifs on Tue 6 and Wed 7 Oct.

**23:** list (Kairo), empty (snapking, Sat 24 Oct), loading, error.

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
| SettingsSection | Added in Phase 6. A settings overview: one card of plain sections, each with its summary, status, any dashed slot and Edit. 24 reuses it |
| VoiceRecorder | Added in Phase 6. Ready (record, or upload instead), recording, recorded, microphone blocked |
| TeamNote | Added in Phase 6. "Note from the Harbourly team" with its sent time; `inset` on a card |
| PortfolioList | Added in Phase 6. The portfolio as gamers see it (linked entries) and its editor entries |
| (additions) | Phase 6 also added ImageUpload move controls (Move up, Move down) and the replacement row (a new image checking, or refused, under the live one); icons arrow-up, arrow-down, stop, external, link, copy |

**Behaviour files** sit beside the components: `OtpInput.js`, `Rating.js` (star input), `Field.js` (character counter, password Show and Hide), `ScrollArea.js`, `WeekHours.js` (fills the hour selects, adds and removes ranges, counts slots). Every component is shown on the component library page.

**`design/foundations/icons.js`:** the line icon sprite (24px grid, 1.8 stroke). Use `<svg class="icon"><use href="#i-name"/></svg>`, and add new icons in the same style. `design/foundations/flags.js` has simplified country flags (ph, sg, my).

**`design/foundations/mockup.css` and `mockup.js`:** the mockup harness, not product code.
- Pages put each state in `<section data-state="id" data-label="Label">` inside `<div class="mk-frame" data-page="NN Page">`. The harness builds the state switcher and the desktop/phone toggle. `window.mk.set(stateId, "desktop" | "phone")` switches state from a script.
- A state with `data-shell="name"` is wrapped in `<template id="shell-name">`. That is the app shell, written once per page; copy the gamer shell from 09 and the coach shells from 06. `data-nav="key"` marks the current sidebar link.
- The harness wires the burger menu and the `data-link` cross-page links. Sidebar targets come from two tables near the top of `mockup.js`, chosen by the shell's `.topNavUser` aria-label: **snapking** (`NAV`: Dashboard → `09#busy`, Browse coaches → `01#results`, My sessions → `10#list`, "Become a coach" → `17#intro`, the logo → `09#busy`) and **Kairo** (`KAIRO`: Coach dashboard → `19#live`, Coach sessions → `23#list`; his Gamer links and logo stay inert, since he has no gamer pages). snapking's Coach sessions (on his just-live shells) → `23#empty`. The account row has no target yet: 24 is Phase 7. A state's `data-coach="19#…"` sets that state's Coach dashboard link (used by 18 to 21, where the journey moves on day by day). `window.mkPages` exposes the page table to page scripts (13 uses it for its coach choice).
- `.mk-hint` (dashed "Mockup: …" line) is a mockup-only shortcut for steps that happen outside the app or take time, such as opening an email link, coming back from Stripe or a check finishing. It is hidden in canvas renders.
- Use a 2-digit `data-page` name, e.g. `19 Coach dashboard`.

**Page behaviour:** a page's own interactions (like `data-go` steps) go in a `<script>` in the page. Behaviour that belongs to a shared component goes in `foundations/components/<Name>.js`, included before `mockup.js`. `build.mjs` inlines local scripts.

**Editing pages:** every earlier page was generated once by scratch scripts that aren't in the repo. The HTML files are the source now, so edit them directly. Phase 5's and Phase 6's pages were generated by scratch scripts too (not in the repo); edit their HTML directly. If you generate Phase 7 pages with a script, treat the HTML as the source once it's committed. 22 prefixes every element id with its state id so ids stay unique on the page (Field.js finds counters by id); do the same on any page that repeats a form across states.

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

**Render the frames** with `node design/tools/render.mjs <outDir>/<page>.html <framesDir> <prefix>`. The prefix is `24` and `25`. An optional 4th argument sets the window height (default 900; 09 uses 700 because of its fixed-height desktop columns). It renders every state at 1440 and 390 wide, at 2x, as `<prefix>__<state>__<desktop|phone>.png`.

**Test before publishing:**
- Playwright is installed globally. A test script of your own loads it with `createRequire(import.meta.url)(execSync('npm root -g').toString().trim() + '/playwright')`.
- Write one that, for every state, clicks every `[data-link]` and `[data-go]` in the visible state (`[data-state]:not([hidden])`) and checks the target exists.
- Write another that loads every state at 320, 390, 820, 1024, 1280×720 and 1440 and reports any horizontal overflow.
- The Phase 6 versions were scratch files and are gone; write your own. Hide the harness's state bar (`.mk-bar`) before measuring overflow: it overflows narrow windows by itself and isn't part of any page.

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
- New states added to an existing page (for example new 06 copies) need their frames uploaded too: canvas.py places every state of every listed page.
- Library rows hold three sections each (canvas.py `PX` has three slots). Row five holds "Coach onboarding" (`coach`) and "Running a coach profile" (`profile`); a third section can join them.

**The canvas is full (found 5 Nov 2026, the owner to decide at checkpoint 7):**
- One version of an artifact can hold at most **512 files**. The canvas holds 434 (412 artboards, the index, and the Design type's own files). Phase 6 adds 92 frames (22 ×72, 23 ×8, 02 `portfolio` ×2, the four 06 copies ×8, the library's "Running a coach profile" ×2), which would make 527, so the publish is refused ("manifest exceeds 512 entries").
- The 92 frames are **already uploaded** to the canvas's asset store; their ids are in `design/tools/canvas-blobs-phase6.txt` (the blobs file canvas.py takes), and canvas.py already lists Phase 6 in `PHASES` and `CHECKS` and the `profile` library section. Once the owner decides, re-render nothing: place them.
- The options put to the owner: **(a, recommended) one artboard per state**: desktop and phone side by side in one `.dc.html` (titles "NN Page · State"), for the whole canvas, about halving it to ~260 files and leaving room for Phase 7 and later; canvas.py's `artboard()` and `place()` change, and every existing artboard is rewritten once (the images are already uploaded, so it's one publish of rewritten small files, split into calls of up to 255). **(b)** pair only Phase 6 onwards (fits Phase 6, but Phase 7 would hit the cap again). **(c)** a second canvas, which the rules forbid.

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

**Mockup times:** Phase 1 mockups are set at Mon 5 Oct 2026, 14:10 SGT. The "now"s for Phases 2 to 4 are in DECISIONS.md: "Mockup times (Phase 2)", "Booking set and mockup times (Phase 3)", "Phase 4 decisions" and "Gamer response to a coach's report". Phase 5's are in "Phase 5 decisions", Phase 6's in "Phase 6 decisions". Phase 7 needs its own; see the gaps. Full cast details are in DECISIONS.md, and bios are in `design/pages/01-browse-coaches.html`.

**Keep using the same cast:**

| Who | Details |
|---|---|
| **Kairo** `@kairo.gg` | Philippines, English and Filipino, PHT. Past the New Coach period (no label), 4.9 (57). Mobile Legends `Mythical Glory · 85★` at ₱1,850 (≈ S$43); Call of Duty: Mobile `Legendary · Top 500` at ₱2,100 (≈ S$49). Paid with Xendit (bank account ending 3307). Payout per Mobile Legends session ₱1,628.00, per Call of Duty: Mobile session ₱1,848.00. He is the coach in every coach-view state of 02, 06, 07, 08, 19 `live` and 20 `live`. A Mobile Legends rank update (`Mythical Glory · 92★`) is under review since Sun 4 Oct. His other students: ricebowl, tamtam, nightjar, ozzie, milo.exe (Philippines). Weekly hours (PHT): Mon 19:00–20:00 and 21:00–23:00, Tue and Wed 19:00–23:00, Thu 20:00–22:00, Fri 20:00–21:00, Sat 14:00–17:00 and 20:00–22:00, Sun 14:00–16:00 (21 slots). Live photo, banner, 0:45 voice intro and five showcase images; no portfolio at 14:12. His Phase 6 what-ifs (₱1,950 Mobile Legends price, `Legendary · Top 200`, Valorant `Ascendant 2`) are in "Phase 6 decisions". |
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
- Record every new decision I approve in `design/DECISIONS.md` (a "Phase 7 decisions" section). Keep `USER-FLOW.md` (and `user-flow.html`, republished) and `BUILD-ORDER.md` in sync if anything changes. When a decision reaches other pages or later phases, say which and update their entries.
- Commit and push work to the designated branch as you go (the repo's stop hook requires it). Don't open pull requests unless I ask.
- I'm not a design specialist on token and type-scale questions. Recommend a choice and explain briefly.
- I care about Pro usage: build each page once, well, rather than duplicating work.
- When I ask to see a page, open its artifact in the chat.
- Each phase ends with a review checkpoint. Don't start the next phase until I've reviewed.
- Keep this handoff (`design/HANDOFF.md`) current at the end of each phase.

## Open items

**For checkpoint 7 (the owner):**
- **The canvas is full:** choose (a), (b) or (c) above; Phase 6's frames go on as soon as that's settled.
- **Inert by design in 22:** "Withdraw" on a rank update or a new game (no state drawn; voice intro and portfolio withdraw back to their pages), and the onward links in the what-if states.

**For Phase 7:**
- **Rank proof check (kept, 23 Oct 2026; may be dropped later):** if it's dropped, 22's "Update rank" goes live at once (no screenshot, no pending state), "Add a game" may need no proof, 19's "Rank update under review" goes, 17 and 18 lose the proof parts, the "Rank update: approved or declined" email goes, and DECISIONS.md and USER-FLOW diagrams 8 and 9 change.
- **When building:** confirm on a real iPhone that camera photos convert to JPEG on upload (18's proof, 21's, 22's and 24's photos).
- **Not drawn, by decision:** suspended and banned coach states; the coach-journey and account emails.

**For the review of Phases 1 to 5 (after Phase 7, the owner's plan):** the running list is in DECISIONS.md, "Phase 6 decisions", at the end. In short:
- 02 `preview` shows a Singapore gamer's prices and times (≈ S$43, SGT) without saying whose view it is.
- 03 (Phase 1) shows Sat 10 Oct 20:00 and Sun 11 Oct 15:00 as free; since Phase 5, milo.exe's open reschedule request holds them.
- 21's Review summary could use SettingsSection; 18's team note could use TeamNote.
- 06 `loading` overflows a 320 px window by 48 px (a skeleton line). Found by Phase 6's overflow test; not a Phase 6 change.
- **The component library at 320 px:** the logged-out top bar in "App shell" and the coach card's "Next free" line in "Cards and lists" overflow (the pages themselves don't).
- 06 `coach-upcoming` shows its own moment (Mon 5 Oct 18:00, "Opens in 49h 50m"); from 19 live (14:12) it would read 53h 38m. Left as is, like 04's hold countdown.

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

## After Phase 7

Checkpoint 8 ("final consistency pass across every page") closes Phase 7. Then the owner reviews Phases 1 to 5 with the running list above. Keep this handoff (`design/HANDOFF.md`) current at the end of Phase 7.

## Next step

Wait for checkpoint 7. When the owner has reviewed Phase 6 (and decided the canvas question), make any changes asked for, place Phase 6's frames, then read everything above, do the research for Phase 7, and send your Phase 7 message: what you looked at and what you're taking from it, your understanding of 24 and 25, the link map, the new labels and copy, and every gap with your recommendation. Build only after the owner answers.
