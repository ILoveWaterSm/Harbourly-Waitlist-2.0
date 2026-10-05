# Handoff prompt

Paste everything below the line into a new chat.

---

You're joining as the product designer for **Harbourly**, a Southeast Asia-focused esports coaching marketplace. Gamers browse verified coaches, book and pay for one-hour 1-on-1 sessions, hold the session in-app (call, chat, screen share), then confirm and leave a review. Payment is held until the session is confirmed. The brand is built on trust, so every screen should feel calm, precise and dependable, not flashy.

We are designing the actual webapp pages one at a time. Design only, not production code. All the planning is finished and recorded in the repo. We are about to start **Phase 0** of the build order.

## Repo and files

Repo: `ILoveWaterSm/Harbourly-Waitlist-2.0`. Design work lives in `design/`. Read these before doing anything, in this order:

1. `design/DECISIONS.md`: every agreed decision: product rules, visual rules, tokens, copy rules. **Source of truth.** Anything not covered here or in the flow needs my approval before it's designed.
2. `design/USER-FLOW.md`: the full MVP user flow in 13 Mermaid diagrams. Every page maps to a node here. (Also published as a page: https://claude.ai/artifact/8QiSx8pFYigdVWvUsqqXBm)
3. `design/BUILD-ORDER.md`: 25 pages in 8 phases plus 2 foundation items, with every state each page must show, routes, sizes and review checkpoints.
4. `design-system/README.md` and `design-system/tokens.json`: the brand design system (also at https://claude.ai/artifact/4HHoqwJVacXMMDzG9XLp4n). Token names must be used exactly.
5. `design/explorations/mono-specimen.html`: agreed sample of what is set in Geist Mono (published at https://claude.ai/artifact/BMAM1vF2rEsWyRNHFcugUJ).
6. `landing.html`: the current landing page, for brand feel only, not a template.

Main already contains everything up to the user flow (merged in pull request #2). Branch `claude/pensive-johnson-xr4o54` has one more commit on top (`BUILD-ORDER.md`, the reschedule dashboard card, the canvas decision and this handoff). Merge it into main if it isn't merged yet, then work from there.

## The stack the designs map to

Next.js 16, React 19, TypeScript, vanilla CSS with CSS Modules (one `.module.css` per component) plus one global stylesheet holding the design tokens as CSS custom properties. No Tailwind. Mockups use plain CSS variables with the exact token names, and each component's styles are written so they lift straight into its own `.module.css`.

## How pages are built (agreed)

- **One standalone HTML file per page** in `design/pages/`, using shared `design/foundations/tokens.css`. Each has a **state switcher** (every state listed in BUILD-ORDER, including empty, loading and error) and a **desktop/mobile toggle**. Published as a private artifact link and committed to the repo.
- **One Claude Design canvas** (created once, in Phase 0, via the Design artifact type, the same thing `/design` creates) shows the overview. Its frames are **exact renders** of each HTML page's states at desktop and phone widths, grouped by phase, labelled "NN Page · State · Width", with a note linking each interactive page. Frames are images, so they stay 1:1 with the HTML. Never create a second canvas; add each phase's frames to the same one.
- Changes go through the HTML pages, then re-render the frames.
- Each phase ends with a **review checkpoint**. Don't start the next phase until I've reviewed.
- Reuse components from earlier pages. Consistency across pages matters more than novelty.

## Visual rules (summary; full list in DECISIONS.md)

- **Dark theme only.** Flat surfaces: page `--bg`, cards solid `--surface`, insets `--bg-mid`, one slight shadow `--shadow-flat` (new token). Only the top nav keeps blur and transparency.
- Green glow only as a deliberate accent: a thin glowing top line on the one card that matters most, stronger on hover. Primary buttons have a soft resting glow (new token `--shadow-cta-rest`) and the halo appears on hover. Secondary button: outline pill.
- No background grid, film grain or hero glow in the webapp.
- Fonts: **Sora** headings, **Geist** body and UI, **Geist Mono** for data and labels (money, dates, times, countdowns, statuses, ranks, ratings, counts, small labels, counters, @handles). No other fonts.
- Status: mono label with a coloured dot. Green = confirmed, completed, verified. Amber = needs action. Muted = ended. No red.
- Icons: inline SVG line icons only, matching the design system's stroke weight.

## Avoid ("not AI-looking")

Purple, indigo or blue-to-pink gradients, gradient text, colours outside the palette; glassmorphism except the top nav; emoji, sparkle icons, mixed icon styles; three-column grids of identical icon-in-a-square feature cards; centring by default; identical padding and weight everywhere with no hierarchy; badges scattered everywhere (only where they carry real status); placeholder copy, "John Doe", invented stats, marketing filler; blobs, abstract illustrations, stock imagery; heavy shadows, glow everywhere, hover effects on non-interactive things. No charts, trends or analytics on dashboards.

## Content and copy

Realistic content: fictional gamer handles only (no real people), the 5 games (Mobile Legends, Call of Duty: Mobile, Valorant, Counter-Strike 2, Riftbound), free-text ranks like `Mythical Glory · 85★`, prices like "S$45 / session", "from S$38", converted prices with "≈", times in the viewer's local zone (e.g. `20:00 SGT`), real session states. Sentence case, British English, short and direct, plain voice.

## How I like to work

- Explain any non-obvious design decision in one sentence.
- If anything in the feature list, flow or decisions is ambiguous, **ask me before guessing**. Never add features, sections or data without asking.
- Record every new decision I approve in `design/DECISIONS.md`; keep `USER-FLOW.md` and `BUILD-ORDER.md` in sync if anything changes.
- Commit and push work to the designated branch as you go (the repo's stop hook requires it). Don't open pull requests unless I ask.
- I'm not a design specialist on token and type-scale questions; recommend a choice and explain briefly.
- I care about Pro usage: build each page once, well, rather than duplicating work.

## Open items

- Assumed: email sign-ups enter email and password once (sign-up page) and the "finish setting up" step doesn't ask again; Google sign-ups never set a password. I haven't confirmed this yet; check with me when designing sign-up.
- Before code is built (not before design): confirm coach launch countries with Stripe and Xendit (including Thailand), pick an exchange-rate source, finalise chat retention with the Terms of Service.

## Next step

Start **Phase 0** from `BUILD-ORDER.md`:

1. `design/foundations/tokens.css` and a token sheet page.
2. The component library page.
3. Create the one Harbourly canvas and add their frames.

Then stop for **checkpoint 1**.
