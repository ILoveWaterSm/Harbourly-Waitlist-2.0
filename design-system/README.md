# Harbourly

Harbourly is a marketplace for verified esports coaching in Southeast Asia. Players book coaches whose rank and identity Harbourly has checked. This system is extracted from the waitlist site (landing, verification standard, privacy and terms pages) and covers a single dark theme.

## Content fundamentals

- **Voice.** Plain and direct. Second person ("you"), British spelling (`lang="en-GB"`), no hype words. Lead with what the person gets: "Join the waitlist", "Find the coach you can actually trust."
- **Trust is the product.** Copy names what is checked (rank, identity) and shows the verified mark next to it.
- **Casing.** Sentence case for headings and buttons. Uppercase only for mono labels and eyebrows, set by CSS, never typed.
- **Numbers and prices** go in Geist Mono. Prices use the dollar sign.
- **No emoji** as markers or bullets. Use the green dot bullet, a check, or a number only when order matters.

## Visual foundations

- **Ground.** One dark navy (`bg`, `#030b17`) with a faint 80px line grid fading out at the left and right edges, 8% film grain over everything, and a slow breathing green radial glow behind the hero.
- **Accent.** Green (`green`, `#22d66f`) is the only accent hue. It means action, verified, active or positive. Amber (`amber`) is reserved for warnings and errors. Text on green is `green-ink`.
- **Type.** Sora (display, 700–800, tight negative tracking) for headlines and numbers; Geist (body) for reading and buttons; Geist Mono for eyebrows, figures and labels. All three load from Google Fonts. Heading sizes are fluid with `clamp()`; see Typography.
- **Shape.** Pills (`radius-pill`) for every button and tab, 16–20px radii for cards, circles for avatars and close buttons.
- **Light, not borders.** Cards are framed by a 1px green gradient line along their top edge and a deep black shadow. Dividers are 1px gradient hairlines that fade at both ends, drawn in green between major sections. Where a border is needed it is `line` (16% muted).
- **Glow.** Primary buttons, active tabs, check badges and chart highlights carry a green glow (`shadow-cta`, `green-glow`). Keep it to the one or two things that matter in view.
- **Layout.** Centred sections, content capped at 1180px (1440px for card grids), horizontal padding `clamp(28px, 6vw, 120px)`, sections separated by `clamp(80px, 10vh, 140px)`. Two-column splits collapse to one column below 1000px; a three-up card grid becomes a swipe row below 600px.
- **Motion.** Sections fade and rise 24px as they scroll in, headlines rise line by line, buttons press to 97%, cards lift 3–4px on hover. Everything honours `prefers-reduced-motion`.

## Iconography

Line icons only: 1.8–2px stroke, rounded caps and joins, drawn inline as SVG on a 24px grid, stroked in `green` (or `muted` when inactive). No fills, no emoji. Icons sit in a 60px rounded square chip (`green-tint` fill, `green-line` border) when they head a card.

## Using the system

- Load `tokens.css`, the Google Fonts link (Sora 400/600/700/800, Geist 400–700, Geist Mono 400–600) and `components/bundle.css`.
- Wrap pages in `.hb-ground`, or set `background: var(--bg)` and the body font yourself.
- Reach for tokens by name (`var(--green)`, `var(--radius-lg)`); do not introduce new hues.
- Keep body copy in `muted` or brighter. `subtle` and `footnote` fail 4.5:1 and are for placeholders and footers only.

## What this system does not contain

- A light theme (the site has none).
- A JavaScript component bundle. The site is hand-written HTML, so components here are CSS classes with previews. Behaviour (accordion, menu, form steps) stays in the consuming page.
- Sample names, quotes and prices in previews are placeholders, not real people or data.
