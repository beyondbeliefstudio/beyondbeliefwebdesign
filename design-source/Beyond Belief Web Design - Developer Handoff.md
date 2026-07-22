# Beyond Belief Web Design — Developer Handoff

**Prepared for the Astro build. Everything you need to rebuild the site faithfully without seeing the design.**

---

## 0. How to read this document

This is the complete specification for the **Beyond Belief Web Design** marketing site: a 7-screen static site (Home, Web Design, About, Work, Contact, Blog landing, and an individual Blog Post template). It is built **mobile-first responsive, light "paper" ground with an electric-lime signal color and near-black "ink" dark anchor sections.**

The document is ordered so you can build foundations first, then components, then drop pages together:

1. **Design system / foundations** — every color, type token, spacing, radius, shadow, gradient.
2. **Global & repeating components** — header, overlay menu, footer, buttons, forms, cards, CTA. Documented once; pages reference them.
3. **Iconography & abstract graphics** — the logo, icon set, textures, glows.
4. **Motion & interaction system** — libraries, scroll behavior, hover states, marquee, parallax.
5. **Responsive system** — breakpoints and how each section + the nav collapses.
6. **Pages, section by section** — top-to-bottom structure, exact copy, layout, hierarchy.
7. **Asset inventory** — what's bundled alongside this doc and where each asset is used.

> **Exact values.** Wherever you see a `clamp(min, preferred, max)` value, that is the production value verbatim — keep the fluid scaling, don't substitute a fixed size. Where a value is a token (e.g. `--lime`), the hex is in §1.

### Tech context (as currently built)

- **Three Google Fonts:** Bricolage Grotesque (display), Space Grotesk (body/UI), Space Mono (labels/code). One `@import`/`<link>` loads all three with the weights listed in §1.2.
- **Libraries used:** [Lenis](https://github.com/darkroomengineering/lenis) 1.1.14 (smooth scroll), [GSAP](https://gsap.com/) 3.12.5 + ScrollTrigger (all scroll animation), [Three.js](https://threejs.org/) 0.149.0 (the hero "watercolor wash" canvas only). These can be ported as-is into Astro client scripts/islands. None are required for the page to be *legible* — there is a full static fallback (see §4.10).
- **No build framework in the source.** The current files are hand-coded HTML + CSS + vanilla JS. The CSS variables and class structure map cleanly to Astro components.
- **A Tweaks panel** (React/Babel block at the bottom of each page) is a *design-review tool only* — it is **not part of the production site.** Do not port it. The only thing it does that matters to production is set three `<html>` attributes (`data-motion`, `data-grain`, `data-field`); their default values are baked into the markup already.

### Page → file map (current source)

| Page | Source file | Page-specific CSS |
|---|---|---|
| Home | `Beyond Belief Homepage V2.html` | `v2/v2.css` (shared) |
| Web Design (Services) | `Beyond Belief Services.html` | `v2/services.css` |
| About | `Beyond Belief About.html` | `v2/about.css` |
| Work | `Beyond Belief Work.html` | `v2/work.css` |
| Contact | `Beyond Belief Contact.html` | `v2/contact.css` |
| Blog (landing) | `Beyond Belief Blog.html` | `v2/blog.css` |
| Blog Post (template) | `Beyond Belief Blog Post.html` | `v2/blog.css` |

Every page loads, in order: the Google Fonts link → `colors_and_type.css` (design tokens) → `v2/v2.css` (master stylesheet: globals + all homepage sections + every shared component) → the page-specific CSS. **`v2.css` is the backbone — read it as the source of truth alongside this doc.** Both `colors_and_type.css` and `v2.css` are bundled in `reference-css/`.

---

# 1. Design System / Foundations

All tokens below are defined as CSS custom properties on `:root`. The site runs in a single "light ground" theme (`data-theme="light"` is set on `<html>` but the v2 build hard-codes the light palette in `v2.css`, so you can treat the light values as the only theme).

## 1.1 Color

### Raw palette

| Token | Hex | Role |
|---|---|---|
| **Lime (signal)** | | The brand's one loud voice. Use sparingly — one lime element per view. |
| `--lime` | `#CCFF00` | Primary signal: CTA fills, highlight marker, accent dots, active states. |
| `--lime-bright` | `#D4FF1A` | Hover / max-energy state of lime buttons & links. |
| `--lime-deep` | `#A6CC00` | Pressed state; **lime-on-light text** (the neon fails contrast on paper, so text/strokes use this deeper olive-lime). Also used for small accent dots & icon color on the light ground. |
| `--lime-wash` | `rgba(204,255,0,0.12)` | Tints, focus rings, glow fills. |
| **Tangerine (secondary accent)** | | Used *only* for small "negative/technical" marks — the `//` in eyebrows, the strike-through color, the ✕ in "the bad way" lists. Never a fill or CTA. |
| `--tangerine` | `#FF6A3D` | Tangerine accent (on dark). |
| `--tangerine-deep` | `#E04E22` | Tangerine on light (eyebrow `//` numerals, strike lines). |
| `--tangerine-wash` | `rgba(255,106,61,0.12)` | (declared; rarely used) |
| **Ink (near-black ground)** | | Cool green-tinted near-black. **Never pure `#000`.** |
| `--ink-900` | `#0B0E0A` | Deepest ground — dark sections, footer, price panel, primary text on light. |
| `--ink-800` | `#11140F` | Raised dark surface (contact band bg, dark cards). |
| `--ink-700` | `#1A1E17` | Dark cards / panels. |
| `--ink-600` | `#262B22` | Hairline borders on dark, hover fills. |
| `--ink-500` | `#3A4034` | Faint strokes / disabled on dark; also `--fg2` body text on light. |
| **Stone (olive-gray mid-tones)** | | The grounded connective tissue. |
| `--stone-400` | `#6B7268` | Muted text / captions (`--fg3`). |
| `--stone-300` | `#8B9384` | Secondary text on dark. |
| `--stone-200` | `#B7BDAF` | Tertiary text on dark; light hairline-strong. |
| `--stone-100` | `#D7DBCF` | Hairlines on light (`--border`). |
| **Paper (warm off-white)** | | Light ground. |
| `--paper` | `#F5F6EF` | Page background, primary text on dark. |
| `--paper-raised` | `#FBFCF6` | Raised surface on light (cards, inputs, form card). |
| `--paper-sunken` | `#ECEEE2` | Sunken wells (browser-frame toolbar, image slots, the `.band` section bg). |
| `--white` | `#FFFFFF` | Pure white (used inside the glass header only). |

### Semantic tokens (light theme — the build default)

| Token | Resolves to | Meaning |
|---|---|---|
| `--bg` | `--paper` `#F5F6EF` | Page background |
| `--surface` | `--paper-raised` `#FBFCF6` | Card / input surface |
| `--border` | `--stone-100` `#D7DBCF` | Default 1px hairline |
| `--border-strong` | `--stone-200` `#B7BDAF` | Stronger hairline / input border |
| `--fg1` | `--ink-900` `#0B0E0A` | Primary text |
| `--fg2` | `#3A4034` | Secondary / body text |
| `--fg3` | `--stone-400` `#6B7268` | Muted text, captions, eyebrows on light |

**Dark sections** (`.sec-dark`, `#contact`, footer, price panel, dark inset panels) flip to: background `--ink-900`/`--ink-800`, text `--paper`, secondary `--stone-200`/`--stone-300`, borders `--ink-600`, and lime stays `--lime` (it passes contrast on dark, so it may be used as stroke/text there).

### Color usage rules

- **Lime is a signal, never a background field.** One lime moment per viewport: a primary CTA, *or* a highlight marker, *or* an accent — not several.
- **On light/paper, lime never appears as text or stroke** (neon fails contrast). It only appears as a *fill behind ink text* (the CTA button, the highlight marker bar, chips). Text that needs to read "lime" on paper uses `--lime-deep`.
- **On dark, lime is free** to be text, stroke, icon, or fill.
- **Tangerine is reserved** for the `//` comment glyph, strike-throughs, and the ✕ "bad list" marks. Never a CTA or large fill.
- `::selection` is `background:var(--lime); color:var(--ink-900)`.

## 1.2 Typography

### Families

```
--font-display: 'Bricolage Grotesque', 'Space Grotesk', system-ui, sans-serif;  /* headlines */
--font-body:    'Space Grotesk', system-ui, sans-serif;                          /* body / UI  */
--font-mono:    'Space Mono', ui-monospace, monospace;                           /* labels / code */
```

Google Fonts load (one request):
`Bricolage Grotesque` opsz 12–96, weights **400, 500, 600, 700, 800**; `Space Grotesk` **400, 500, 600, 700**; `Space Mono` **400, 700**.

### Tracking tokens

```
--track-display: -0.03em;   /* large display headlines */
--track-tight:   -0.02em;   /* h2 / h3 / sub-display */
--track-label:    0.18em;   /* mono uppercase eyebrows */
```

### Type scale (exact, as used in v2)

Display headlines use **Bricolage 800**; section headings (`.h2`) use **Bricolage 700**; body uses **Space Grotesk 400**; labels use **Space Mono 700 uppercase**.

| Role | Font / weight / size / line-height | Tracking | Notes |
|---|---|---|---|
| **Display** `.display` | Bricolage **800** · `clamp(3rem, 7.2vw, 7rem)` / 0.94 | `-0.03em` | Hero & big statements. Per-page hero overrides shrink it (see each page). |
| Hero H1 (home) | `clamp(2.5rem, 5.1vw, 5.3rem)` | `-0.03em` | `#hero .display` override. |
| **Section H2** `.h2` | Bricolage **700** · `clamp(2.1rem, 3.6vw, 3.4rem)` / 1.02 | `-0.02em` | `text-wrap:balance`. |
| **Problem statement** | Bricolage **700** · `clamp(2.2rem, 4.6vw, 4.4rem)` / 1.08 | `-0.02em` | `max-width:21ch`; word-fill animated. |
| **Card H3** (solution) | Bricolage **700** · 21px / 1.12 | `-0.02em` | |
| **Process step H3** | Bricolage **700** · 24px / 1.08 | `-0.02em` | |
| **Big numbers** (process, price) | Bricolage **800** · `clamp(3.4rem, 5.4vw, 5rem)` (process) / `clamp(3.6rem, 6vw, 5.4rem)` (price) | `-0.04em` / `-0.03em` | `font-variant-numeric:tabular-nums`; process number is outline (`-webkit-text-stroke`). |
| **Lead paragraph** `.lead` | Space Grotesk **400** · `clamp(1.05rem, 1.4vw, 1.3rem)` / 1.55 | — | color `--fg2`; `text-wrap:pretty`. |
| **Body** (in-card `p`) | Space Grotesk **400** · `0.9375rem` (15px) / 1.6 | — | color `--fg2`. |
| **Body** (prose, problem/about) | Space Grotesk **400** · `1.0625rem` (17px) / 1.65 | — | |
| **Article body** (blog post) | Space Grotesk **400** · `1.16rem` / 1.78 | — | `max-width:720px` measure. |
| **Eyebrow / label** `.eyebrow` | Space Mono **700** · `0.75rem` / 1 · UPPERCASE | `0.18em` | inline-flex, gap 10px; color `--fg2` (light) / `--lime` or `--stone-300` (dark). |
| **Mono small** `.mono-sm` | Space Mono **400** · `0.72rem` / 1.5 · UPPERCASE | `0.08em` | color `--fg3`. |
| **Button label** | Space Grotesk **600/700** · 15px / 1 | `-0.01em` | |
| **Footer wordmark** (giant ghost) | Bricolage **800** · `clamp(3rem, 10.5vw, 9.5rem)` / 0.95 | `-0.04em` | decorative, `user-select:none`. |
| **Overlay menu links** | Bricolage **800** · `clamp(2.2rem, 5.6vw, 4.4rem)` / 1.16 | `-0.03em` | |

### Casing rules

- Body & most headlines: **sentence case.**
- Display headlines may mix weight/color for emphasis (a lime-marker highlighted word).
- Eyebrows / kickers / technical labels: **UPPERCASE mono, wide tracking**, often prefixed `//` (e.g. `// HAND-CODED IN MONROE, NC`).
- Service/section indexes: `// 01`, `// 02` … (mono, tangerine numeral).
- **No emoji, ever.** The only glyphs used decoratively are the four-point star **✦** and the right arrow **→** (and ← / ↓ as directional cues). Em-dashes for asides.

## 1.3 Spacing

4px base rhythm. Section vertical padding is the big rhythm; component padding lives at 16–46px.

```
--space-1: 4px    --space-2: 8px    --space-3: 12px   --space-4: 16px
--space-5: 24px   --space-6: 32px   --space-7: 48px   --space-8: 64px
--space-9: 96px   --space-10: 128px
```

- **Section padding** `.sec-pad`: `clamp(88px, 11vw, 150px)` top & bottom.
- **Content max-width** `--maxw: 1280px` (note: the design-system default is 1200px, but the v2 build uses **1280px**). `.wrap` = `max-width:1280px; margin:0 auto; padding:0 clamp(20px, 4vw, 48px)`.
- **Section head** block: `max-width:760px; margin-bottom:clamp(40px, 5vw, 72px)`.
- **Card grid gaps:** 20px (solution/process), `clamp(18px, 2.2vw, 26px)` (blog grid).

## 1.4 Border radius

```
--radius-sm: 4px      /* small chips, the lime "cp-label" */
--radius-md: 8px      /* inputs, icon boxes, FAQ items — the workhorse */
--radius-lg: 14px     /* cards, panels, browser frames, image frames */
--radius-xl: 22px     /* large panels: price, compare, reach cards, feat card */
--radius-pill: 999px  /* buttons, tags, chips, menu button */
```

Corners are **crisp, not pill-soft** — pill radius is reserved for buttons/tags only. Header bar uses a bespoke `18px`.

## 1.5 Shadows & elevation

Flat by default. **Shadow = genuine lift (frames, panels). Glow = the live/energized lime state.** Never both at once on the same element.

```
--shadow-md: 0 8px 24px -10px rgba(20,30,15,0.18);
--shadow-lg: 0 28px 70px -28px rgba(20,30,15,0.32);
--glow-soft: 0 0 40px rgba(204,255,0,0.30);   /* lime halo behind CTAs / pinned tags */
```

- Dark image frames use a deeper custom shadow: `0 40px 90px -38px rgba(0,0,0,0.8)`.
- The floating header has a layered glass shadow (see §2.1).
- **Card hover** does not add a drop shadow — it adds a lime **border + 1px lime ring + `--shadow-md`** and a `translateY(-4px)` lift (see §2.6).

## 1.6 Gradients & glows (exact)

All "glows" are soft radial gradients painted on an absolutely-positioned `::before`/child div behind content. No blob/mesh gradients, no glassmorphism beyond the header.

| Where | Definition |
|---|---|
| **Lime halo — overlay menu** (`.mo-glow`) | `radial-gradient(640px 460px at 14% 112%, rgba(204,255,0,0.20), transparent 62%)` |
| **Price panel glow** (`.pp-glow`) | `radial-gradient(420px 300px at 18% 115%, rgba(204,255,0,0.24), transparent 65%)` |
| **Contact glow** (`.cta-glow`, follows cursor) | `radial-gradient(560px 420px at var(--mx,25%) var(--my,110%), rgba(204,255,0,0.16), transparent 62%)` — `--mx/--my` updated on pointermove. |
| **Dark inset panels** (SEO / Everywhere / reach call-card) | two stacked radials: `radial-gradient(560px 420px at 88% -10%, rgba(204,255,0,0.18), transparent 62%)` + `radial-gradient(480px 380px at -8% 110%, rgba(204,255,0,0.10), transparent 65%)` |
| **Footer wordmark glow** (`.fw-glow`) | `radial-gradient(closest-side, rgba(204,255,0,0.13), transparent 70%)`, 900×440px centered at top. |
| **Newsletter strip** (`.sub-glow`) | `radial-gradient(620px 460px at 82% 120%, rgba(204,255,0,0.16), transparent 62%)` |
| **Blog end-CTA** (`.ec-glow`) | `radial-gradient(closest-side, rgba(204,255,0,0.5), transparent 70%)`, 760×520px centered. |
| **About photo glow** (`.ap-glow`) | `radial-gradient(closest-side, rgba(204,255,0,0.5), transparent 72%)` behind the tilted portrait. |
| **Hero field fade** (homepage) | `linear-gradient(to bottom, rgba(245,246,239,0.5), rgba(245,246,239,0) 30%, rgba(245,246,239,0) 62%, var(--paper) 96%)` — fades the canvas into paper. |
| **Image band caption scrim** (`#monroe`) | `linear-gradient(to top, rgba(11,14,10,0.55), transparent)` |
| **Timeline spine** (services) | `linear-gradient(to bottom, var(--lime-deep), var(--lime-deep) 60%, var(--border-strong))` |

These gradients are **static** (painted, not animated) **except** the contact glow, which tracks the cursor, and the homepage hero map, which slowly drifts (see §4).

## 1.7 Film grain

A fixed, full-viewport noise overlay sits above content at `z-index:650`, `pointer-events:none`, `opacity:0.5`, `mix-blend-mode:multiply`. It's an inline SVG `feTurbulence` (fractalNoise, baseFrequency 0.9, 2 octaves) tiled at 160×160. Toggled off via `html[data-grain="off"]`. Keep it subtle — it adds tooth, it should never be visible as "texture."

## 1.8 Motion tokens

```
--ease-out:    cubic-bezier(0.16, 1, 0.3, 1);   /* entrances, hovers */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--dur-fast: 140ms;   --dur: 240ms;   --dur-slow: 520ms;
```

Motion is **quick and confident, never bouncy.** Hover ramps ~140–240ms. Press = scale 0.97 + lime-deep, no color flash. Full behavior in §4.

---

# 2. Global & Repeating Components

These appear on every (or most) page(s). Build them once as Astro components. Each page section in §6 references them by name.

## 2.1 Header — floating glass bar

Fixed, full-width, `z-index:700`, `padding:14px clamp(14px,3vw,28px)`. Inside sits a centered **glass pill bar**, `max-width:1120px`, `padding:9px 9px 9px 20px`, `border-radius:18px`:

- Background `rgba(255,255,255,0.66)`, `backdrop-filter:blur(18px) saturate(1.5)`, 1px border `rgba(255,255,255,0.7)`.
- Layered shadow: `0 1px 0 rgba(255,255,255,0.7) inset, 0 14px 38px -16px rgba(20,30,15,0.26), 0 2px 8px -4px rgba(20,30,15,0.12)`.
- **On scroll** (`.scrolled`, toggled when `scrollY>12`): background bumps to `rgba(255,255,255,0.85)` and the shadow deepens.
- **When the menu is open** (`html.menu-open`): the bar goes transparent (no glass, no shadow) so it floats over the dark overlay; the wordmark + menu button text flip to paper/lime.

**Layout:** flex space-between. Left = **logo lockup** (see §3.2). Right = `.head-right` flex gap 10px containing a **primary CTA button** ("Get started →", smaller padding `13px 22px`, font 14px) and the **MENU button**.

- The CTA button is **hidden below 620px** (`#header .btn-cta{display:none}`).
- **Menu button** `#menu-btn`: pill, `background:var(--surface)`, 1.5px border `--border-strong`, `padding:14px 21px`, Space Mono 700 11.5px uppercase tracking 0.16em, label "MENU" preceded by a 2-line hamburger glyph (`.mb-lines` — two 1.8px bars, 18px wide, gap 5px). On `menu-open` the two bars rotate into an **✕** (`translateY(±3.4px) rotate(±45deg)`).

**Behavior:** the header hides on scroll-down (past 300px) and shows on scroll-up via a GSAP `yPercent:-130 ↔ 0` transform (§4.4). On the homepage it also animates in from `yPercent:-130` during the intro.

## 2.2 Overlay menu (primary navigation)

The site's real nav. Triggered by the MENU button; `#menu-overlay` is a full-screen `z-index:600` panel, `background:var(--ink-900)`, text paper, `padding:96px clamp(24px,6vw,84px) 32px`.

- **Open/close** via `clip-path:inset(0 0 100% 0)` → `inset(0 0 0% 0)` over **0.72s `--ease-out`** (wipes down from the top). Closed state also sets `visibility:hidden` (delayed).
- A lime halo (`.mo-glow`, §1.6) sits bottom-left.
- **Nav list** `.mo-nav`: 5 large links, each a row with `border-bottom:1px solid var(--ink-600)`:
  - `.mo-num` — mono index `01`–`05`, stone-400.
  - `.mo-inner` — the word, Bricolage 800 `clamp(2.2rem,5.6vw,4.4rem)`. Animates **up from `translateY(112%)`** on open, staggered (`transition-delay` 0.09s → 0.29s per item).
  - `.mo-arr` — a lime `→`, hidden until hover (`opacity:0 → 1`, `translateX(-14px) → 0`).
  - **Hover marquee:** on hover the word is replaced by a rolling repeated-word marquee (`.mo-marq` — the word + ✦ separators, Bricolage 800, lime/tangerine, scrolling `translateX(0 → -50%)` over 13s linear). The static word slides up and out; the marquee fades in.
- **Nav items (in order):** `01 Work`, `02 Web Design`, `03 About`, `04 Blog`, `05 Contact`. **The current page's item links to `#top`** (self) instead of the other file.
- **Footer of overlay** `.mo-foot`: left = "Get in touch" label + phone `(908) 419-9566` + email `contact@beyondbeliefstudio.com`; right = tag `// HAND-CODED IN MONROE, NC / SERVING THE CHARLOTTE METRO`. Fades + rises in (delay 0.45s).
- **Esc** closes; clicking any link closes; opening locks Lenis scroll.

> **Astro note:** this overlay is identical on every page except which item points to `#top`. Build it as one component taking a `current` prop.

## 2.3 Footer (dark)

`background:var(--ink-900)`, paper text, `padding:0 0 44px`, `border-top:1px solid var(--ink-600)`, `overflow:hidden`.

Top to bottom:
1. **Giant ghost wordmark** `.foot-wordmark` — `BEYOND ✦ BELIEF` centered, Bricolage 800 `clamp(3rem,10.5vw,9.5rem)`, the ✦ in lime at 0.55em. Below it, justified sub-label `WEB · DESIGN · MONROE · NC` (Space Mono 700, tracking 0.42em, stone-400). A lime glow (`.fw-glow`, §1.6) sits behind the top. On scroll it parallaxes up from `y:110` (§4.7).
2. **`.foot-top`** flex row, wrap:
   - Left: the **logo lockup** + blurb — *"Hand-coded websites for local businesses in and around Monroe, North Carolina. Proudly serving Monroe, Waxhaw, Matthews, Charlotte, and surrounding areas."* (max-width 340px, stone-300).
   - Right `.foot-cols` (gap 72px): **"Site"** column — links Work / Web Design / About / Blog / Contact; **"Get in touch"** column — `(908) 419-9566`, `contact@beyondbeliefstudio.com`. Column titles are mono uppercase stone-400; links stone-200 → lime on hover.
3. **`.foot-bottom`** — top border, flex space-between: `© 2026 Beyond Belief Web Design. All rights reserved.` and `// Built from scratch in Monroe, NC`.

In the footer the logo lockup flips to paper/lime (mark blades paper, star lime).

## 2.4 Buttons & links

| Variant | Spec |
|---|---|
| **`.btn` (base)** | Space Grotesk 600, 15px, `letter-spacing:-0.01em`, `border-radius:pill`, `padding:17px 30px`, `border:1.5px solid transparent`, inline-flex gap 10px, `white-space:nowrap`. Transitions bg/border/transform at `--dur --ease-out`. |
| **`.btn-primary`** | `background:var(--lime)`, text `--ink-900`, **weight 700**, `border-color:var(--ink-900)` (1.5px ink outline), `box-shadow:var(--glow-soft)` (lime halo). Hover → `--lime-bright`. Active → `--lime-deep` + `scale(0.97)`. |
| **`.btn-secondary`** | transparent bg, text `--fg1`, border `--border-strong`. Hover → border `--ink-900`. On the homepage hero it gets `background:var(--surface)`. |
| **`.btn-cta`** (header) | a `.btn-primary` with reduced padding `13px 22px`, 14px. |
| **`.arr`** (the `→` inside buttons) | Space Mono. On `.btn:hover` it **marches**: `@keyframes arr-march { to { translateX(6px) } }`, 0.45s ease-in-out infinite alternate. |
| **`.link`** (quiet text link w/ circle arrow) | inline-flex gap 11px, Space Grotesk 600 15px, text `--fg1`. The arrow `.larr` is a 30px circle, 1.5px ink border, mono `→`. Hover → gap widens to 14px, arrow circle fills **lime** with ink border, `translateX(2px)`. Active → `--lime-deep` + `scale(0.94)`. On dark, the link is paper and the arrow border is stone-300 → fills lime on hover. |
| **Work-page live link** (`.proj-link a`) | text + mono URL + lime `→`, with a `border-bottom` that turns lime-deep on hover; arrow nudges `translateX(3px)`. |

## 2.5 Form fields

Used in the homepage/services/about contact forms and the contact-page form (and newsletter input).

- **`.field`** — block, `margin-bottom:16px`. Label `.fl` = Space Mono 700 0.6875rem uppercase, tracking 0.18em, color `--fg3`, `margin-bottom:8px`. An optional `(optional)` qualifier `.opt` is stone-300 normal-weight.
- **`input` / `textarea`** — full width, Space Grotesk 400 1rem, `background:var(--paper-raised)`, `border:1.5px solid var(--border-strong)`, `border-radius:md (8px)`, `padding:13px 14px`, `color:--fg1`, `resize:none`. Placeholder color stone-300.
- **Focus** — `border-color:var(--lime-deep)` + `box-shadow:0 0 0 3px var(--lime-wash)` (lime focus ring).
- **Contact-page long label** `.fl-long` — non-uppercase, Space Mono 700 0.82rem, line-height 1.45.
- **Form card** wrapper — paper bg, `border-radius:lg`, `padding:32px` (homepage) or paper-raised surface w/ border (contact). On dark sections the form card stays **paper** (light island on dark).
- **Newsletter input** (`.sub-form input`, dark band) — pill, translucent `rgba(255,255,255,0.04)` bg, 1.5px `--ink-600` border, `padding:16px 22px`, paper text; same lime focus.

The forms are non-functional placeholders (`onsubmit="return false;"`) — wire to your backend/Formspree/etc. Fields, in the homepage/services/about form: **Your name** / **Your business name** / **Your email** / **What does your business do?** (textarea). The contact page adds **Your phone number (optional)** and uses a longer textarea prompt (exact copy in §6.5).

## 2.6 Cards

The site uses one card "physics" with several skins. **Shared hover:** border → `rgba(166,204,0,0.6)` lime, `box-shadow:var(--shadow-md), 0 0 0 1px rgba(166,204,0,0.2)` (lime ring), `transform:translateY(-4px)`. On dark cards the hover ring/glow uses lime at higher alpha.

| Card | Where | Distinct traits |
|---|---|---|
| **Solution card** `.card` | Home "Solution" (dark), About "What I believe" | surface bg, border, `radius-lg`, `padding:34px 30px 36px`. Has a giant outline **ghost number** top-right (Bricolage 800 64px, paper-sunken fill, stone stroke) and a 50px **icon box** (paper bg, ink border, lime-deep icon) that fills lime on hover. H3 21px + body 15px. |
| **Process step** `.step` | Home "Process" | surface card, `radius-lg`. Top **rule** (1.5px line with a lime dot at left) that animates `scaleX(0→1)` on reveal. Big outline number `clamp(3.4rem,5.4vw,5rem)` that fills lime on hover. H3 24px. |
| **Plan include row** `.incl-row` | Services "The plan" (dark) | grid `auto 1fr`, divided by 1px `--ink-600` top borders (list, not boxes). 52px icon tile (ink-800) → fills lime on hover. Mono index `01 —`, H3 ~20px paper, body stone-300. |
| **Add-on card** `.ao-card` | Services "Add-ons" | surface card; one **`.featured`** variant is fully dark (`--ink-900`) with a lime price chip. Has a `.ao-price` mono chip top-left. |
| **Post card** `.post-card` | Blog grid + related | surface card, `radius-lg`, overflow hidden. 16:10 media on top (image zooms `scale(1.04)` on hover), body with cat-tag + H3 + excerpt + foot (read-time + "Read →"). |
| **Featured post** `.feat-card` | Blog landing | large horizontal split (`1.05fr 0.95fr`), `radius-xl`, 4:3 media w/ a lime **"✦ Featured"** pin. |
| **Reach card** `.reach-card` | Contact | two variants: dark **call-card** (lime phone) and paper **form-card**. `radius-xl`. |
| **Inline CTA** `.inline-cta` | Blog post body | surface bar, text + primary button, lime ring on hover. |
| **Work CTA / dashed card** `.cta-card .inner` | Home work strip | dashed `--border-strong` border, centers a headline + button; hover → lime-deep border + `--lime-wash` fill. |

## 2.7 CTA / Contact section (recurring)

A near-identical "final CTA" block closes Home, Services, and About. It's a **two-column grid** (`1fr 1fr`, `gap:clamp(40px,5vw,72px)`):

- **Left:** eyebrow (lime dot + scramble label), H2, body, then a **"text me" block** — `.text-me` bordered box with H3 *"Or honestly, just text me."*, the phone `(908) 419-9566` in big lime Space Mono, and a reassurance line.
- **Right:** the **form card** (§2.5).
- On the homepage this section is `#contact` with `background:var(--ink-800)` (dark) and a cursor-following lime glow. On Services/About the contact section adds a `.cta-free` "free homepage" line above the text-me block.

Exact copy per page in §6.

## 2.8 Eyebrow, index labels & the lime marquee

- **Eyebrow** `.eyebrow` (§1.2) — mono uppercase, often `<span class="num">// 0N</span>` + a scramble-animated label. The `//` numeral is tangerine-deep on light, stone-400 on dark. A `.dot` variant prefixes a small lime-deep dot (the hero "NOW ACCEPTING NEW CLIENTS" badge animates the dot with a 2.4s blink).
- **Hero badge** `.eyebrow.hero-badge` — the eyebrow in a pill: 1px stone-200 border, surface bg, `padding:10px 18px`.
- **Lime marquee** `.marquee` (homepage, between Trust and Problem) — full-bleed **lime band**, 1.5px ink top/bottom borders. `.marquee-track` scrolls `translateX(0 → -50%)` over **90s linear infinite**. Text = Bricolage 800 `clamp(28px,2.4vw,36px)` ink, each phrase separated by a tangerine-deep `//`. The track is duplicated for a seamless loop. (Phrases listed in §6.1.) Paused under reduced motion.

## 2.9 Frames & media wrappers

- **Browser frame** `.bframe` — `radius-lg`, 1px border, paper-raised bg, `--shadow-lg`. Header `.tb` = paper-sunken toolbar, 3 stone dots (10px) + a mono URL. Body holds a 16:10 screenshot or `<image-slot>`. On dark sections the frame border + shadow deepen.
- **Photo frame** `.ap-frame` (About/home portrait) — paper-raised, 1px border, `radius-lg`, `padding:13px 13px 0`, `--shadow-lg`, **rotated -2.4°**. Caption row underneath (mono uppercase + lime ✦). Parallaxes & de-rotates slightly on scroll; a lime **sticker** ("real person, actually responds") pops in rotated +5°.
- **Image band** `#monroe` — full-bleed photo, desaturated (`saturate(0.72) contrast(1.04) brightness(0.97)`), a top paper-fade so the sky melts into the page, and a bottom caption over a dark scrim (mono uppercase, lime `//`). Slow scroll zoom anchored to top edge.
- **`<image-slot>`** — a custom element used as a fillable image placeholder in several spots (work screenshots, services hero photos, about photos, blog post images). **For production, replace each `<image-slot id="…" placeholder="…">` with a real `<img>`** (or your image component) at the aspect ratio noted on it. The IDs and placeholders in §6 tell you what image goes where.

## 2.10 Preloader (homepage only)

`#preloader` is a fixed paper panel shown on first load of the **homepage only**. Layout: top row = brand text `BEYOND BELIEF / WEB · DESIGN` + the mark; bottom row = a huge counter `000`→`100` (Bricolage 800 `clamp(5rem,16vw,11rem)`) and a status `// HAND-CODED IN MONROE, NC / LOADING THE GOOD STUFF`; a 3px progress bar fills lime along the bottom. After count completes it slides up (`yPercent:-100`, expo.inOut) and triggers the hero intro (§4.2). Has a 4.5s failsafe + a stall guard that snaps to finished state if the rAF ticker is throttled. **Optional for production** — it's a flourish; if you keep it, gate it so it only runs once / on the homepage.

## 2.11 Custom cursor (desktop, pointer:fine only)

Two elements follow the pointer: a 7px ink dot (`#cursor-dot`, near-instant) and a 38px ring (`#cursor-ring`, eased trail). States:
- over any link/button/input/`[data-cursor="grow"]` → ring grows to 56px, border lime-deep, `--lime-wash` fill (`body.cur-hover`).
- over `[data-cursor="view"]` (work cards, post cards, featured card) → ring grows to 86px, **solid lime**, shows a `VIEW` label, dot hides (`body.cur-view`).

Native cursor is hidden only when `data-cursor="on"`. Disabled on touch and under reduced motion. **Optional** — purely an enhancement.

---

# 3. Iconography & Abstract Graphics

## 3.1 Icon set

All UI icons are **inline SVG**, drawn on a **24×24 grid**, `stroke-width:1.8`, `fill:none`, `stroke:currentColor`, **round caps & joins**. They inherit `color` from context (lime-deep on light, lime on dark icon boxes; flip to ink when an icon box fills lime on hover). Sizes: 22px (trust strip), 26px (card/plan icon boxes).

Inventory (by where they appear; redraw on the same 24/1.8/round grid if you need more):

| Concept | Glyph description | Appears in |
|---|---|---|
| **Custom / no-template** | `</>` code chevrons | Home trust strip #1 |
| **Fast / performance** | lightning bolt | Home trust strip #2 |
| **Local** | map pin | Home trust strip #3 |
| **Rank on Google / SEO** | magnifier with a rising check-line inside | Home solution card 1, Services plan 02, About believe 01 |
| **Convert / leads** | bar chart with an up-arrow | Home solution card 2 |
| **Stand out** | overlapping cross/plus burst | Home solution card 3 |
| **Five pages / window** | browser window + tab | Services plan 01 |
| **Hosting / servers** | two stacked server racks | Services plan 03 |
| **Updates** | circular refresh arrows | Services plan 04 |
| **Mobile** | phone outline | Services plan 05 |
| **Support / message** | speech bubble with lines | Services plan 06 |
| **Trust / shield** | shield with a check | About believe 02 |
| **Grow** | upward line-chart with arrow tip | About believe 03 |

## 3.2 Logo

**The mark** — a comet-orbit around a four-point star: two tapered comet "blades" sweeping around a tall north-star. Three SVG paths in a `0 0 96 96` viewBox:
- Two blade paths (the orbit).
- One star path.

**Color rule:**
- On **dark** grounds → two-tone: blades **paper**, star **lime**.
- On **white/paper** grounds → **all ink (`#0B0E0A`)**, including the star (the neon lime fails contrast on light, so it never appears as ink/stroke on paper — only as a *fill behind text*, e.g. the CTA).

In the live build the mark is **inlined** in every header and footer (so `currentColor`/per-path fills resolve). Bundled variants in `assets/`: `mark.svg` (currentColor blades + `#CCFF00` star — inline this), `mark-onlight.svg` (all-ink, img-safe for light grounds).

**Wordmark lockup** `.lockup` — the inline mark (32px) + a two-line text block: `.lk-name` = "Beyond Belief" (Bricolage 800 18px, `-0.03em`) over `.lk-desc` = "WEB · DESIGN" justified across the name's width with a 1px hairline above it (Space Mono 700 7.5px, tracking 0.06em, stone-400). On dark grounds name → paper, desc → stone-300, hairline → ink-500.

## 3.3 Abstract / decorative graphics

| Element | What it is | Where |
|---|---|---|
| **Star ✦** | four-point star glyph, the brand's only decorative symbol — in eyebrows, captions, the footer wordmark, sticker, featured pin, "fin" timeline node. | site-wide |
| **Hero "watercolor wash"** | a Three.js fragment-shader field (fbm noise) in paper / cream / lime-wash / sage / warm tones that drifts slowly and warms toward the cursor. Rendered at 45% res for a soft, grainless blur. Toggle `data-field`. Falls back to clean paper if WebGL is unavailable. (Home, Services, About, Work, Contact, Blog heroes.) | hero backgrounds |
| **Hero topo map** | `assets/hero-map.png` — a faint topographic/street map, `opacity:0.3`, masked by a radial fade, `contrast(1.04) saturate(0.92)`. Slowly drifts (42s) and zooms on scroll. | Homepage hero only |
| **Lime glows** | the radial gradients in §1.6. | dark panels / CTAs |
| **Film grain** | §1.7. | site-wide overlay |
| **Dot grid** `.ap-dots` | `radial-gradient(var(--stone-200) 1.4px, transparent 1.9px)` at 13×13px, ~0.7 opacity — a halftone block behind the portrait. | Home/Services portrait |
| **Textures (bundled, optional)** | `assets/texture-topo.svg`, `assets/texture-glow.svg` — abstract topo-signal + glow textures available if you want them; the v2 build mostly uses the painted gradients above. | — |

> Do **not** hand-draw new illustrative SVGs. If you need imagery, use real photography treated cool/desaturated with lime as the only chromatic pop (the existing screenshots & portrait follow this), or the abstract gradients above.

---

# 4. Motion & Interaction System

Built on **Lenis** (smooth scroll), **GSAP + ScrollTrigger** (all reveal/scrub animation), and **Three.js** (hero wash only). Global tokens in §1.8. Everything below degrades to a clean static page (§4.10).

## 4.1 Smooth scroll
Lenis with `lerp:0.105, smoothWheel:true`, driven by the GSAP ticker; ScrollTrigger updates on Lenis scroll. In-page `#anchor` clicks are intercepted and Lenis-scrolled with a `-90px` offset over 1.4s (and close the menu first if open).

## 4.2 Homepage hero intro (after preloader)
A GSAP timeline: the field wash fades in; the three headline lines rise from `yPercent:115` (expo.out, stagger 0.09); the eyebrow scrambles in; lead + CTAs + foot fade/rise (staggered); the header drops in from `yPercent:-130`; the lime highlight marker fills last. Subpage heroes use the same line-mask + reveal vocabulary without the preloader gate.

## 4.3 Reveal vocabulary (ScrollTrigger, fire once)
- **`[data-reveal]`** — `y:34, opacity:0 → 0, 1`, 1s power3.out, at `top 88%`.
- **`[data-reveal-stagger]`** — children animate `y:40, opacity:0 → in`, stagger 0.12, at `top 85%`.
- **`[data-wipe]`** (headlines) — `clip-path:inset(0 0 100% 0)` + `y:26` → revealed, 1.05s power3.out, at `top 87%`.
- **Dark sections** wipe in as panels: `clip-path:inset(4% 3% 8% 3% round 26px)` → `inset(0 round 0)`, **scrubbed** `top 92% → top 30%` (the dark block "unfolds" as it enters).
- **`[data-scramble]` / `[data-scramble-st]`** — text scrambles through a glyph pool (`#</>*+=··—A–Z0–9`) and resolves left-to-right (~0.9s). On the eyebrow labels.

## 4.4 Header show/hide
Class `.scrolled` toggles past 12px (deepens glass). A ScrollTrigger hides the header (`yPercent:-130`) when scrolling **down past 300px** and reveals it on scroll up — both 0.5s power3.out. Suspended while the menu is open.

## 4.5 Word-fill statement (`[data-fill-words]`)
The "problem"/"short version" statement is split into word `<span>`s starting at `--stone-200` (faded) and **scrubbed to full ink** (`#0B0E0A`, or paper in dark sections) as it scrolls through `top 78% → bottom 45%`, stagger 0.05 — words "ink in" one by one.

## 4.6 Lime highlight marker (`.hl`)
A word wrapped in `.hl` has a lime bar (`.hl-bar`) behind it that scales `scaleX(0 → 1)` from the left over **0.8s** when the section activates (class `.on` added by script, or always-on under no-JS/reduced-motion). This is the "drawn highlighter" emphasis on a key word per headline.

## 4.7 Parallax & scrub (homepage + about)
- Hero topo map: `scale:1 → 1.16, yPercent:0 → -6` across the hero.
- Problem browser frame: `y:48 → -38` scrub.
- Monroe image band: `scale:1 → 1.035` anchored top (never crops the steeple).
- About portrait: `y:50 → -24, rotate:-4.5° → -1.4°`; the sticker pops `scale:0→1, rotate:-14°→5°` (back.out).
- Footer ghost wordmark: `y:110 → 0` scrub.

## 4.8 Counters
`[data-count]` numbers (the `$149` price, the `200+` stat) tween 0 → target over ~1.6s when scrolled into view.

## 4.9 Marquees & loops
- **Lime marquee** (home): `translateX(0 → -50%)` 90s linear infinite (§2.8).
- **Overlay-menu hover marquee:** 13s linear (§2.2).
- **Services hero photo columns:** two columns scroll vertically in opposite directions — column A up (`translateY(0 → -50%)` 80s), column B down (`-50% → 0` 100s); each track duplicates its 5 images for a seamless loop; desaturated `saturate(0.62) contrast(1.03)`; whole group opacity `--hero-photo-opacity` default 0.71. (§6.2)
- **About hero collage:** 4 columns of stacked 4:5 tiles, alternating up/down at 44–58s durations, faded into paper by a radial+linear scrim. (§6.3)
- All loops pause/stop under reduced motion (snap to a static mid-position).

## 4.10 Horizontal "Work" scroll (homepage)
Desktop (≥901px): the Work section pins and scrolls its card track horizontally — GSAP `x: -(trackWidth - viewport)`, `pin:true, scrub:0.6`, end `+= track distance + 20vh`. Below 901px (and under reduced motion) the track **stacks vertically** and the pin is dropped. The dedicated **Work page** (§6.4) does *not* use this — it's a vertical alternating layout.

## 4.11 Hover-state summary
| Element | Hover |
|---|---|
| Primary button | bg → lime-bright; arrow marches; active → lime-deep + scale 0.97 |
| Secondary button | border → ink-900 |
| `.link` / arrow links | gap widens, circle arrow fills lime, nudge right |
| Cards (all skins) | lime border + 1px lime ring + `--shadow-md` + `translateY(-4px)` |
| Icon boxes | fill lime, icon → ink |
| Outline big-numbers | fill lime (stroke → fill) |
| Post-card media | image `scale(1.04)` |
| Overlay nav link | word → lime, marquee rolls in, arrow appears |
| Filter chip (blog) | border → ink; active chip = solid lime + glow |
| FAQ row | border → olive-lime tint + 1px ring |
| Contact section | lime glow follows the cursor |

## 4.12 Reduced motion / static fallback
Under `prefers-reduced-motion: reduce` **or** if GSAP fails / the rAF ticker stalls, the page sets `data-motion="off"`: the preloader is removed, all hidden entrance states are cleared to their final values, highlight markers turn on, scramble text resolves, loops freeze at a static position, and the horizontal Work scroll becomes a vertical stack. **The page must be fully legible and complete with zero JS** — keep this guarantee in the Astro build (render final states by default; layer animation on top).

---

# 5. Responsive System

Mobile-first in spirit; the source uses `max-width` breakpoints. Key breakpoints:

| Breakpoint | What changes |
|---|---|
| **≤1180px** | Left progress rail (if present) hidden. |
| **≤920px** | Work-page projects → single column; blog post grid → 1 col. |
| **≤900px** | The workhorse "stack" breakpoint: all multi-column grids → 1 column (solution cards, process steps, price grid, about grid, contact grid, plan, SEO/everywhere panels, add-ons, reach grid, posts grid → 2 then 1). Homepage horizontal Work → vertical stack. |
| **≤860px** | Services hero → stacked (copy over photo strip); About collage drops to 3 columns; blog featured card → stacked. |
| **≤820px** | Newsletter strip → single column. |
| **≤700px** | Homepage hero meta line hidden; Monroe band aspect → 4:3. |
| **≤620px** | Header CTA button hidden (MENU only). |
| **≤600px** | Blog posts grid → 1 column. |
| **≤560px** | About collage → 2 columns; timeline & milestones tighten their gutters. |
| **≤540px** | About collage → 2 columns; hero foot line shrinks. |

### Navigation collapse
The nav is an **overlay menu on every breakpoint** — there is no inline desktop nav bar; the header always shows just the logo + (optional) CTA + MENU button. So "collapse" is really: **below 620px the header's "Get started" CTA disappears, leaving only the logo and MENU button.** The overlay menu itself is responsive (font sizes shrink via clamp; on short viewports `max-height:760px` the link size & top padding reduce).

### Section-level responsive notes
- **Trust strip:** 3-up → 1 column at ≤860px; dividers switch from left-border to top-border, items left-align.
- **Hero (home):** centered; padding `120px 24px 130px`; the foot row (scroll cue + meta) is absolutely pinned bottom — meta hides ≤700px.
- **Cards / steps / price / about / contact grids:** all → 1 column at ≤900px.
- **Services hero:** `1fr 1.1fr` split → block stack at ≤860px; the photo columns become a fixed-height (56vw, max 420px) strip under the copy.
- **Work page projects:** alternating `1.04fr 0.96fr` (flipped every other) → single column at ≤920px; the sticky browser frame becomes static.
- **Blog:** featured card 2-col → 1-col at ≤860px; posts grid 3→2→1 at 920/600px; newsletter 2→1 at ≤820px.
- **Blog post:** prose column is a fixed `max-width:720px` measure centered at all sizes; cover image `max-width:1080px`; related grid 3→1 at ≤860px; inline-CTA & author card stack at ≤680px.

---

# 6. Pages, section by section

Each page shares: the **floating header** (§2.1), **overlay menu** (§2.2), **footer** (§2.3), grain overlay, and (except where noted) a hero **watercolor-wash** canvas. Those are not repeated below — only page-unique sections are detailed. Copy is given **exactly as written**; reproduce it verbatim.

`<html>` attributes per page (entrance defaults; the Tweaks panel is not shipped):
- Home: `data-theme="light" data-grain="on" data-field="on" data-motion="full"`
- Services/Work/Contact/Blog/Blog Post: same, `data-field="on"`
- About: `data-field="off"` (hero uses the photo collage instead of the wash)

---

## 6.1 Home — `Beyond Belief Homepage V2.html`

SEO: title *"Beyond Belief Web Design — Custom websites in Monroe, NC"*. Sections top→bottom: Preloader → Header → Hero → Trust strip → Lime marquee → Problem → Monroe band → Solution (dark) → Process → Pricing → Work (horizontal) → About → Contact (dark) → Footer.

### Hero  `#hero` — full-viewport, centered
- **Layout:** `min-height:100vh`, content grid-centered. Background layers (back→front): watercolor-wash canvas → faint topo map (`hero-map.png`, opacity 0.3, radial-masked, drifts) → field-fade gradient → centered copy. Foot row pinned to bottom.
- **Eyebrow badge** (pill): lime blink-dot + `NOW ACCEPTING NEW CLIENTS` (scrambles in).
- **H1** (`.display.lines`, 3 lines, line-mask reveal; the word "searching" carries the lime highlight marker):
  > Your neighbors are already
  > **[searching]** for what you offer.
  > Let's make sure they find you.
- **Lead:** *"I build custom websites for local businesses that look incredible, rank on Google, and turn visitors into real customers."* (max-width 54ch, centered)
- **CTA row:** primary `Let's talk about your business →` + secondary `See how it works`.
- **Foot row** (space-between, bottom): left `SCROLL` with an animated cue line (a bar sweeps L→R, 2.2s loop); right meta `No templates. No page builders. / Every line written by hand.` (mono, right-aligned, hidden ≤700px).
- **Hierarchy:** display dominates; everything centered; generous `120px/130px` vertical padding.

### Trust strip  `#trust`
- Full-width, top+bottom hairline. **3 equal columns** (divided by left borders), each = a 22px lime-deep icon + label, centered, `padding:26px 20px`:
  1. `100% custom, no templates ever`
  2. `Sites that load in under a second`
  3. `Proudly Based in Monroe, NC`
- ≤860px → stacked, left-aligned, top-border dividers.

### Lime marquee  `.marquee`
Full-bleed lime band (§2.8), 90s scroll. Phrases (each followed by a tangerine `//`):
> Your business deserves better than a GoDaddy Airo site · …than a Wix template · …than a basic Squarespace website · …than a WordPress site your cousin threw together
(The four phrases repeat to fill the loop.)

### Problem  `#problem` — `.sec-pad`
- Eyebrow `// 01  THE PROBLEM`.
- **Statement** (word-fill ink-in animation, max-width 21ch): *"Most local business websites look like they were built in an afternoon. Because honestly — a lot of them were."*
- **Two-column grid** (`1.05fr 0.95fr`, centered): left copy, right a browser-frame illustration (`assets/problem-illustration.png`, parallax).
  - Copy P1: *"GoDaddy Airo. Wix. A template someone threw together real quick. They look fine at first glance — but they load slow, they don't rank on Google, and they don't make your business look like the best option in town."*
  - P2: *"A huge number of local businesses either don't have a website at all, or have one so outdated it's doing more harm than good. A brand-new, well-built site immediately puts you ahead of most of your competition before the phone even rings."*
  - P3 (strong): *"That's the difference between winning the job and losing it to whoever shows up better online."*
- ≤900px → single column.

### Monroe image band  `#monroe`
Full-bleed photo of downtown Monroe (`uploads/Monroe.png`), desaturated, top paper-fade, slow top-anchored zoom. Bottom caption over dark scrim: left `// MONROE, NORTH CAROLINA` (lime `//`), right `34.9854° N · 80.5495° W`. Max-height `min(82vh, 780px)`.

### Solution  `#services` — **dark** `.sec-dark .sec-pad`
- Section head: eyebrow `// 02  THE SOLUTION`; H2 *"A website that actually [grows] your business."* ("grows" = lime marker); lead *"I build every site from scratch, specifically for your business. It loads fast, shows up when people in your area are searching, and looks like you're the obvious choice."* (max-width 60ch).
- **3 solution cards** (dark `.card`, stagger-reveal), each icon box + H3 + body:
  1. **Show up higher on Google** — *"Your site is built from the ground up to rank in local search. When someone nearby searches for what you do, you show up."*
  2. **Turn visitors into actual leads** — *"A good-looking site is great. A site that gets people to call, text, or fill out a form is better. That's what I build."*
  3. **Look like the best option in town** — *"First impressions happen online now. Your website should make people feel confident before they ever pick up the phone."*
- The whole dark section wipes in as a rounded panel on scroll (§4.3).

### Process  `#process` — `.sec-pad`
- Section head: eyebrow `// 03  HOW IT WORKS`; H2 *"Getting started is easier than you think."*
- **3 step cards** (light `.step`, top rule + lime dot + outline big-number):
  1. **We talk about your business** — *"A quick conversation about what you do, who your customers are, and what you need your website to accomplish."*
  2. **I build your site** — *"I design and build everything from scratch. You'll see it before it goes live and we dial it in until it feels right."*
  3. **You start getting found** — *"Once it's live it's working for you around the clock. I handle everything on the back end so you never have to think about it."*

### Pricing  `#pricing` — `.sec-pad`
- Section head: eyebrow `// 04  PRICING`; H2 *"One simple plan. No surprises."*; lead *"Most web designers charge thousands upfront, bill for every change, and disappear after launch."* **"That's not how I work."** (the last sentence in full-strength ink).
- **Two-column grid** (`0.92fr 1.08fr`):
  - **Price panel** (dark, `radius-xl`, lime glow bottom-left): label `// EVERYTHING INCLUDED`; big price `$149 / month` (the 149 counts up; `$` superscript lime); terms *"No hidden fees. A 12-month commitment to start, because building a real online presence takes time and I want to make sure we do it right. After that it's completely month to month."*; primary button `See everything that's included →`; then a top-bordered free line *"Not ready to commit? I'll design your homepage completely free, so you can see exactly what your site could look like before you decide anything."*
  - **Compare panel** (light, `radius-xl`): two blocks split by a divider.
    - `The way it usually goes` — **strike-through** list, tangerine ✕ marks: `$3,000 to $8,000 upfront cost` · `Hourly fees for every update or change` · `You're responsible for hosting and maintenance` · `No guarantee it ranks or brings in business` · `On your own after launch`.
    - `THE BEYOND BELIEF WAY` (label = lime chip) — lime ✓ marks: `$149 per month, no large upfront cost` · `Unlimited content updates, just ask` · `Hosting and maintenance fully handled` · `Built specifically to rank and convert` · `Ongoing support whenever you need it`.

### Work  `#work` — horizontal pinned scroll (§4.10)
Band background (`paper-sunken`, top/bottom hairlines). A horizontal track of cards:
- **Head card** (`min(38vw,470px)`): eyebrow `// 05  THE WORK`; H2 *"Real businesses. / Real results."*; lead *"Live sites built for local businesses like yours — hand-coded, fast, and already winning customers."*
- **Project card 1 — FD Cigar Company:** browser frame `fdcigarcompany.com` (screenshot `uploads/Screenshot 2026-06-10 at 4.10.56 PM.png`); meta H3 **FD Cigar Company** + *"Waxhaw's premier cigar lounge. The site carries the same warmth as the room itself — and puts memberships, the cigar selection, and directions one tap away."* + link `View the site →` (→ fdcigarcompany.com).
- **Project card 2 — Lambo's Garage Door Service:** browser frame `lambosgaragedoorservice.com` (screenshot `…4.11.05 PM.png`); H3 + *"Local, owner-operated garage door repair. Built to win the emergency search — clear services, real reviews, and a phone number you can't miss."* + `View the site →`.
- **CTA card** (dashed): eyebrow dot `NEXT UP`; headline *"Your business could be sitting right here."*; primary button `Start a project →` (→ #contact).
- ≤900px / reduced-motion → vertical stack.

### About  `#about` — `.sec-pad`
- **Two-column grid** (`0.92fr 1.08fr`, centered).
  - **Left:** tilted portrait frame (`uploads/pasted-1781119849800-1.png`) with dot-grid + lime glow behind it, caption `CHRIS · FOUNDER & DEVELOPER ✦`, and a lime **sticker** `// REAL PERSON. ACTUALLY RESPONDS.` (pops in).
  - **Right:** eyebrow `// 06  ABOUT`; H2 *"You're not hiring an agency. You're hiring [Chris]."* ("Chris" = lime marker); two paragraphs:
    - *"I've been building websites and helping local businesses grow their online presence for years. I'm based right here in Monroe, and most of my clients are neighbors, referrals, and local business owners I've met along the way."*
    - *"I'm not trying to be the biggest web design company around. I'm trying to be the most useful one to the businesses in this community. Your website reflects on both of us — and I take that seriously."*
  - **Facts list** (3 rows, label↔value): `Based in → Monroe, North Carolina` · `Works with → Local businesses — neighbors & referrals` · `When you reach out → You get Chris, not a ticket queue`.
  - Link `A little more about me →` (→ About page).

### Contact  `#contact` — **dark** `.sec-pad` (the recurring CTA, §2.7)
- Background `ink-800`, cursor-following lime glow.
- **Left:** eyebrow dot `LET'S BUILD SOMETHING`; H2 *"Ready for a website that actually works for you?"*; body *"A new site built the right way immediately makes you look more professional, more trustworthy, and more worth calling than the majority of your competition. Let's make that happen."*; **text-me block** — H3 *"Or honestly, just text me."*, phone **(908) 419-9566** (lime), *"No forms, no back and forth, no pressure. Just shoot me a text and we'll go from here. I'm a real person and I actually respond."*
- **Right:** form card `// START A PROJECT` with fields Your name / Your business name / Your email / What does your business do? + button `Get started today →`.

---

## 6.2 Web Design (Services) — `Beyond Belief Services.html`

SEO title *"Custom Website Design for Local Businesses | Beyond Belief Web Design"*. Sections: Header → Hero (split) → The Plan (dark) → Timeline → Add-ons (band) → Local SEO Expansion → The Difference → FAQ (band) → Contact → Footer. Overlay nav item 02 self-links.

### Hero  `#hero` — split, full-viewport
- `100vh`, flex column. **Split grid `1fr 1.1fr`:** left copy column (vertically centered), right **twin scrolling-photo columns** (§4.9 — column A scrolls up 80s, B down 100s; desaturated; group opacity 0.71; rounded 6px tiles).
- **Left copy:** eyebrow badge `CUSTOM WEB DESIGN · MONROE, NC`; H1 (left-aligned, "you do." = lime marker):
  > A website that works
  > as hard as **[you do.]**
  - Lead: *"One simple plan covers everything. Design, build, hosting, maintenance, and unlimited updates. No giant upfront cost, no hourly fees, no technical headaches. Just a website that brings in customers."*
  - CTA row: primary `Get started today →` + secondary `See what's included`.
- **Right photos:** 10 `<image-slot>`s (5 unique + 5 dupes per column) of tradespeople/owners — placeholders: plumber, landscaper, electrician, painter, contractor (col A); professional, restaurant owner, electrician, retail owner, tradesperson (col B). *(Currently Unsplash URLs — swap for owned imagery.)*
- ≤860px → copy stacks above a fixed-height (56vw, max 420px) photo strip.

### The Plan  `#plan` — **dark** `.sec-dark .sec-pad`
- **Two-column grid `0.82fr 1.18fr`.** Left = **sticky aside** (`top:108px`): eyebrow `// 01  THE PLAN`; H2 *"One plan. Everything included."*; big price `$149 / month`; note *"Here is exactly what you get from day one."*
- Right = **6 include-rows** (icon tile + index + H3 + body, divided by hairlines):
  1. `01 — Five custom pages` · **A fully custom five-page website** — *"Your site is designed and hand-coded from scratch. That is your homepage plus four more pages built around what your business actually needs. Most businesses go with something like About, Services, Contact, and a Gallery, but these four pages are completely yours to shape. Some clients use one for a calendar, a menu, a private events page — whatever helps your business most."*
  2. `02 — Local search` · **Built to rank on Google** — *"Every site is built for local search from the very first line of code. When someone nearby searches for what you do, your business shows up."*
  3. `03 — Hosting` · **Hosting and maintenance fully handled** — *"Fast, reliable hosting with every technical update, security patch, and performance check handled behind the scenes. You never think about it."*
  4. `04 — Updates` · **Unlimited content updates** — *"Hours, services, photos, pricing — anything. Just reach out and it gets done. No hourly fees. No waiting weeks for a simple change."*
  5. `05 — Mobile` · **Mobile optimized on every device** — *"More than half of all searches happen on a phone. Your site looks and works perfectly on mobile, tablet, and desktop."*
  6. `06 — Support` · **Ongoing support, directly from me** — *"You are not handed off to a support ticket. You always talk to Chris. Always."*

### Timeline  `#timeline` — `.sec-pad`
- Section head: eyebrow `// 02  TIMELINE`; H2 *"From first conversation to live website in under 30 days."*; lead *"Most web designers drag projects out for months. That is not how I work."*
- **Vertical spine** with circular nodes (lime gradient line). 4 items:
  1. **Week one** — *"We talk about your business and goals. Your homepage design is typically ready to review within the first week."*
  2. **Weeks two and three** — *"You give feedback on the homepage, then I build out the rest of your site with your input at every step."*
  3. **By the end of month one** — *"Your site is live, fully built and optimized, and working for your business before your second payment ever processes."*
  4. **(✦ node)** **Live before your second payment.** — *"That is the goal every single time. I do not start building until your first payment, and my aim is always to have you [live before the second one hits.]"* ("live before…" = lime marker)

### Add-ons  `#addons` — `.band .sec-pad`
- Section head: eyebrow `// 03  ADD-ONS`; H2 *"Need more? Add it whenever you are ready."*; lead *"Your plan covers everything most local businesses need. But if you want to grow your site, here are a few optional add-ons. None of these change your monthly rate."*
- **3 cards** (3rd is dark `.featured`), each a mono price chip + H3 + body:
  1. `$149 · one-time, per page` · **Additional pages** — *"Want more than your five included pages? Any additional page is a one-time $149 to design and build. Your monthly fee stays exactly the same."*
  2. `$499 · one-time` · **Blog setup** — *"I build out a full content management system on the back end of your site and give you direct access, so you can write and publish your own blog posts anytime without needing me. Great for businesses that want to post updates, news, or articles on their own."*
  3. `$999 · one-time` · **Local SEO Expansion** — *"The most powerful way to dominate local search in your area."* + link `More on this below ↓`.

### Local SEO Expansion  `#seo` — `.sec-pad`
- **Dark inset panel** (`radius-xl`, dual lime glow). **Two-column grid:**
  - Left: eyebrow `// 04  LOCAL SEO EXPANSION`; H2 *"Want to own local search? This is how."*; body *"Once your site is up and running, the single best way to pull in more local customers is to expand your reach across every town and service you offer. That is what the Local SEO Expansion package does."*; price `$999 one-time`; close *"This is the difference between showing up for one search and showing up for dozens. It is available exclusively to clients on the monthly plan, because it builds directly on the foundation your main site is already set up for."* (lead sentence bold).
  - Right: intro `// WHAT YOU GET FOR $999 ONE-TIME`; sub *"Ten additional pages, built and optimized specifically to rank in local search:"*; two **mini-blocks**:
    - **Five location pages** (×5 chip) — *"Dedicated pages targeting the specific towns and areas you serve. So when someone in a nearby town searches for what you do, you show up for their area, not just your home base."* + URL list: `/service-areas/monroe-nc`, `/waxhaw-nc`, `/matthews-nc`, `/indian-trail-nc`, `/charlotte-nc`.
    - **Five service pages** (×5 chip) — *"Dedicated pages for each of your individual services. So instead of competing on one general page, you have a focused, optimized page for every single thing you offer."* + URL list: `/services/your-first-service` … `/your-fifth-service`.

### The Difference  `#different` — `.sec-pad`
- Reuses the home About **two-column grid** (portrait left, copy right).
- Eyebrow `// 05  THE DIFFERENCE`; H2 *"This is not a template. It is a real website, built by a real person."*
- **Strike-row chips:** ~~GoDaddy Airo~~ ~~Wix~~ ~~Drag-and-drop~~ → **Hand-coded from scratch** (lime chip).
- Copy: *"Most local business websites are slapped together on GoDaddy Airo, Wix, or some drag-and-drop builder. They look fine until you look closely. They load slow, they do not rank, and they all look the same."* / *"Every site I build is hand-coded from scratch, specifically for your business. That means it is faster, ranks better, and looks like you actually invested in your business. Because you did."* / (strong) *"And you are not working with an agency or a faceless company. You are working with me, directly, every step of the way."*

### FAQ  `#faq` — `.band .sec-pad`
- Eyebrow `// 06  FAQ`; H2 *"Questions people always ask."*
- **Accordion** (`<details>`, max-width 940px) — each row: mono index + question (Bricolage 700) + a lime **plus toggle** (the vertical bar collapses when open). First item open by default. Q&A:
  1. **Do I own my domain?** — *"Yes, always. Your domain belongs to you and stays in your name, under your control, forever. If you already have one we will use it. If you need one I will walk you through getting it set up."*
  2. **What about transferring my existing domain?** — *"Easy. If your domain is registered somewhere like GoDaddy or Namecheap, pointing or transferring it to your new site is straightforward. I handle the technical side and walk you through anything that needs your login."*
  3. **Do I have to write the content myself?** — *"No, and I do not charge extra for it. You know your business better than anyone, so I will ask the right questions and turn your answers into copy that sounds like you and works for Google. You do not need to be a writer."*
  4. **What if I do not have good photos?** — *"No problem. If you have great photos we will use them. If you do not, or if the ones you have are not great quality, I will help generate professional looking imagery so your site still looks sharp. A lack of photos has never stopped a great website from getting built."*
  5. **What does the 12-month commitment mean?** — *"It means I ask you to stay on the plan for the first year, because building a real online presence takes time and I want to do it right. After that first year, you are completely month to month and can cancel anytime."*
  6. **When do you start building my site?** — *"Once your first payment comes through. From there my goal is always to have your site fully live before your second payment ever processes."*
  7. **Can I add more pages later?** — *"Absolutely. Additional pages are a one-time $149 each to build, and your monthly rate never changes."*
  8. **Is there a big upfront cost?** — *"No. That is the whole point. Instead of charging you thousands upfront like most web designers, everything is rolled into one simple monthly rate."*

### Contact  `#contact`
Same recurring CTA (§2.7) with a Services-specific intro: H2 *"Let's build something your business is proud of."*; body *"If you are ready to stop losing customers to competitors with better websites, this is where it starts. Reach out and we will have a straightforward conversation about your business and what your new site could look like."*; plus a free line *"Not ready to commit yet? I will design your homepage completely free so you can see exactly what your site could look like first."* Text-me block + form as standard.

---

## 6.3 About — `Beyond Belief About.html`

SEO title *"About Chris Nervegna | Beyond Belief Web Design in Monroe, NC"*. `data-field="off"` (hero uses photo collage, not wash). Sections: Header → Hero (collage) → The Short Version → How I Got Here (dark) → Why Local → What I Believe (band) → Open Everywhere → Contact → Footer.

### Hero  `#hero` — centered copy over photo collage
- `100vh`, flex column. Background = **4-column scrolling photo collage** (`uploads/chris-computer.png` tiles, 4:5, alternating up/down 44–58s) faded into paper by a radial + linear **scrim** so the centered copy stays crisp.
- **Centered copy:** eyebrow badge `THE PERSON BEHIND THE PIXELS · MONROE, NC`; H1 (3 lines, "Chris." = lime marker):
  > Hi, I'm **[Chris.]**
  > I build websites
  > for local businesses.
  - Lead: *"And when I say I build them, I mean I build them. Every design, every line of code, every update down the road. It is all me. When you reach out to Beyond Belief Web Design, you are reaching out to one person, and that is the whole point."*
  - CTA row: primary `Get started today →` + secondary `See how I work` (→ Services).
- ≤860px collage drops to 3 cols, ≤540px to 2.

### The Short Version  `#short` — `.sec-pad`
- Eyebrow `// 01  THE SHORT VERSION`.
- **Word-fill statement** (max-width 21ch, ink-in animation): *"No agency. No account managers. No overseas team you will never meet. Just me."*
- Body (max-width 64ch): *"I am a web designer and developer based right here in Monroe, North Carolina. I build fast, custom, hand-coded websites for local businesses that need to look great, get found on Google, and actually bring in customers."* + emphasized (left lime border): *"Just me, doing work I genuinely care about, for businesses I genuinely want to see win."*

### How I Got Here  `#story` — **dark** `.sec-dark .sec-pad`
- **Two-column grid `0.88fr 1.12fr`.** Left = **sticky aside:** eyebrow `// 02  HOW I GOT HERE`; H2 *"A decade of design. One clear focus."*; **stat** `200+ websites built professionally, and counting` (the 200 counts up); a photo frame (`<image-slot id="ab-working">` 4:3, placeholder *"Chris at work"*) captioned `DEEP IN IT, EVERY DAY ✦`.
- Right = **year-milestone feed** (rows: big lime year + H3 + body):
  - **2016 · Where it started** — *"I started doing design work in 2016. Beyond Belief was born the same year, as something else entirely — a screen printing studio, a side project and a creative escape from the digital world I worked in all day. I loved the analog side of it. The ink, the print, the hands-on work."*
  - **2018 · Going full-time** — *"I went full-time as a graphic and web designer in 2018, building for every kind of business you can imagine."*
  - **2020 · Everything clicked** — *"By 2020 I had narrowed my focus entirely to web design and development. That is when everything really clicked. My design, development, and SEO skills took off, and I have been deep in it every day since."* / *"Well over 200 websites later, that experience taught me what actually works — what makes a site rank, what makes a visitor trust you, and what turns that visitor into a paying customer."*
  - **2025 · What it was always meant to be** — *"Over time my passion for web design outgrew everything else. I realized I had something real to offer the businesses around me, and I wanted a way to focus on it fully and get more involved in my own community. So in 2025, Beyond Belief became what it was always meant to be: a web design studio built to help local businesses grow."*

### Why Local  `#local` — `.sec-pad` (padding-bottom 0)
- **Two-column grid `0.82fr 1.18fr`.** Left head: eyebrow `// 03  WHY LOCAL`; H2 *"Their customers are right here. [So am I.]"* ("So am I." = lime marker).
- Right body (max-width 64ch):
  - *"I could chase clients all over the country and compete with thousands of other designers for businesses I will never meet. That has never interested me."*
  - *"Local businesses like working with local people. Their customers are right here. So am I. You can call me. You can text me. You might run into me at the coffee shop or in line at Target. I am part of this community, which means I understand the people and businesses you are trying to reach, because they are my neighbors too."*
  - *"I was born in New Jersey and bounced around between Jersey, Florida, and North Carolina growing up. But Monroe was always the place I knew I would come back to. It is where I went to high school, and it is where my family and I have chosen to plant our roots. We love the people here. We love the area. **This is home.**"*
  - Facts: `Born → New Jersey` · `High school → Central Academy of Technology and Arts, Monroe` · `Home → Monroe, North Carolina — roots planted`.
- **Full-bleed Monroe band** (`<image-slot id="ab-monroe">` 21:9, placeholder *"Downtown Monroe, NC — wide street-level shot"*), caption `DOWNTOWN MONROE · NORTH CAROLINA` / `✦ HOME`.

### What I Believe  `#believe` — `.band .sec-pad`
- Section head: eyebrow `// 04  WHAT I BELIEVE`; H2 *"A website is not a box to check."*; two leads:
  - *"Too many people treat it like one. Start a business, get a website, done. But just having a website does not mean anyone will see it, trust it, or turn into a customer because of it."*
  - *"A website has to actually work for you. To me, that means three things."*
- **3 principle cards** (ghost number + icon + H3 + body):
  1. **It has to be found.** — *"If your site does not show up when people search for what you do, it does not matter how nice it looks. Getting you found is step one."*
  2. **It has to build trust.** — *"Once someone lands on your site, it has seconds to make them feel confident enough to call, text, or fill out a form. That trust is what turns a visitor into a real lead."*
  3. **It has to grow with you.** — *"I am not here to crank out a quick website, hand it off, and disappear. I want to build a real relationship with you, understand what you are trying to accomplish, and grow your site into a living, breathing part of your business that keeps working and keeps ranking over time."*
- **Closing line** (centered, Bricolage): *"That last part is the difference. Your website is never really finished, and [I am here for the long haul.]"* (lime marker).

### Open Everywhere  `#everywhere` — `.sec-pad`
- **Dark inset panel** (`radius-xl`, dual glow). **Two-column grid `1.05fr 0.95fr`.**
  - Left: eyebrow `// 05  OPEN FOR BUSINESS EVERYWHERE`; H2 *"Local roots. Open for business everywhere."*; two bodies:
    - *"Here is something worth saying clearly. While my heart is in Monroe and most of my outreach is focused on my local community here in the greater Charlotte area, I work with businesses anywhere."*
    - *"I have clients right outside Nashville, Tennessee, and others up in New Jersey. Where you are located does not matter one bit. Whether you are down the street from me or across the country, I can build you the same fast, custom, high-performing website and give you the same direct, personal support."*
    - close: *"Local is where my roots are. But [great work travels.]"* (lime marker).
  - Right: intro `// WHERE THE WORK GOES`; **location list** (index · place · role):
    `01 · Monroe, NC · Home base` · `02 · Greater Charlotte area · Local community` · `03 · Nashville, TN · Clients` · `04 · New Jersey · Clients` · `→ · Your town · Wherever you are` (last row lime, "you" highlight).

### Contact  `#contact`
Recurring CTA (§2.7): eyebrow dot `NO PRESSURE, NO SALES PITCH`; H2 *"Let's build something great together."*; body *"Whether you are right here in Monroe or somewhere across the country, I would love to hear about your business and what you are trying to accomplish. No pressure, no sales pitch, just a real conversation."*; free line *"Not ready yet? I will design your homepage completely free so you can see what your site could look like first."*; text-me block (H3 *"Or just text me."*, *"I am a real person and I actually respond."*) + standard form.

---

## 6.4 Work — `Beyond Belief Work.html`

SEO title *"Our Work | Beyond Belief Web Design | Monroe, NC"*. Header CTA → Contact page. Sections: Header → Hero → Projects → Closing CTA (dark) → Footer. (No horizontal scroll here — it's a vertical alternating layout.)

### Hero  `#hero`
- Short hero (`min-height:0`), watercolor wash + fade. Centered-left copy (max-width 1060px): eyebrow badge `SELECTED WORK · MONROE, NC`; H1 (2 lines, "Real results." = lime marker):
  > Real businesses. Real websites.
  > **[Real results.]**
  - Lead: *"Every site here was built from scratch — no templates, no shortcuts. Just clean, fast, custom websites designed to get found and turn visitors into customers."*

### Projects  `#projects`
**4 alternating project rows** (`.proj`, grid `1.04fr 0.96fr`, every other `.flip` reverses sides; divided by top hairlines). Each row = a **sticky browser frame** (left/right) + copy block: index number (lime-deep, huge) + tag (mono, two lines) + H2 + 1–2 paragraphs + a **testimonial** (lime quote-mark, blockquote, cite) + a **live link** (text + mono URL + lime →).

**01 · All The Rage Carpet Cleaning** — tag `Carpet Cleaning / Monroe, NC`; frame `alltheragecarpetcleaning.com` (`<image-slot id="work-alltherage">`).
- *"All The Rage Carpet Cleaning had the reputation, the reviews, and the loyal customers. What they did not have was a website. Before working together they had zero online presence, meaning anyone searching for carpet cleaning in Monroe was finding their competitors first — regardless of how good the actual service was."*
- *"We built them their very first website from the ground up. Clean, fast, and built specifically to rank in local search for carpet cleaning services in the Monroe area. Within weeks of launching they had a professional online presence that matched the quality of the work they had been doing for years, and new customers started finding them online for the first time."*
- Quote: *"Before this we had nothing online at all. Now we have a site that looks incredible and people are actually finding us on Google. Chris made the whole process easy and we could not be happier with how it turned out."* — **Owner · All The Rage Carpet Cleaning**
- Link → `alltheragecarpetcleaning.com`

**02 · Lambo's Garage Door** (flipped) — tag `Garage Door Services / Estill Springs, TN`; frame `lambosgaragedoorservice.com` (screenshot `…4.11.05 PM.png`).
- *"Lambo's Garage Door is a local garage door installation and repair company serving homeowners in the area. Like a lot of trade businesses, their work spoke for itself but their website was not keeping up. They needed something that looked as professional as the service they were providing and could start pulling in leads from local search."*
- *"We built them a fully custom site focused on converting visitors into service calls. Every page was built with local search in mind so that homeowners searching for garage door repair in their area could find Lambo's first. The result is a site that looks sharp, loads fast, and works around the clock to bring in new business."*
- Quote: *"Working with Chris was straightforward from start to finish. He knew exactly what our business needed and delivered a site we are genuinely proud of. We are already seeing more calls coming in from people who found us online."* — **Owner · Lambo's Garage Door**
- Link → `lambosgaragedoorservice.com`

**03 · FD Cigar Company** — tag `Cigar Lounge / Waxhaw, NC`; frame `fdcigarcompany.com` (screenshot `…4.10.56 PM.png`).
- *"FD Cigar Company is a premium cigar brand with a loyal following and a distinct identity. They needed a website that matched the quality and character of what they offer — something that felt elevated and intentional without losing the warmth and personality that makes them who they are."*
- *"We built them a custom site that reflects the brand they have spent years building. Bold design, fast performance, and a layout that guides visitors exactly where they need to go — whether that is exploring the product lineup, learning the story, or getting in touch. The site feels like FD Cigar Company, not like a template."*
- Quote: *"Chris captured exactly what we were going for. The site feels like us, looks amazing, and our customers have been commenting on it since we launched. Exactly what we needed."* — **Owner · FD Cigar Company**
- Link → `fdcigarcompany.com`

**04 · Andiamo Away Travel** (flipped) — tag `Travel Agency / Monroe, NC`; frame `andiamowaytravel.com` (`<image-slot id="work-andiamo">`).
- *"Andiamo Away Travel is a boutique travel agency helping clients plan unforgettable trips with a personal touch. In an industry dominated by large booking platforms and generic travel sites, they needed a website that immediately set them apart and communicated the personalized, high-end experience they provide."*
- *"We built them a custom site that leads with the feeling of travel before it ever gets to the details. The design is warm, inviting, and confident — positioning Andiamo Away exactly where they belong: as the go-to choice for anyone who wants a travel experience that is actually planned by a real person who cares. The site works beautifully on mobile, loads instantly, and makes it easy for visitors to reach out and start planning."*
- Quote: *"I knew I wanted something different from the typical travel agency website and Chris delivered exactly that. The whole process was smooth, he listened to everything we wanted, and the final product exceeded our expectations."* — **Owner · Andiamo Away Travel**
- Link → `andiamowaytravel.com`

### Closing CTA  `#work-cta` — **dark**, centered
- Dual lime glow, centered content (max-width 860px). Eyebrow dot `LET'S BUILD SOMETHING`; H2 *"Want to be on this page?"*; body *"Every business you see here started with a conversation. If you are ready to have a website that actually works for your business, let's talk. And if you are not quite ready to commit, I will design your homepage for free — so you can see exactly what is possible first."*; primary button `Get started today →` (→ Contact); text line *"Or just text me — (908) 419-9566. No pressure, no forms, just a real conversation."* (phone is a lime mono link).

---

## 6.5 Contact — `Beyond Belief Contact.html`

SEO title *"Contact Beyond Belief Web Design | Monroe, NC Web Designer"*. Header CTA → `#form`. Sections: Header → Hero (type-led) → Two Ways To Reach Me → Free Homepage Offer (dark) → Closing → Footer.

### Hero  `#hero` — type-led
- Short hero, wash + fade. Left copy (max-width 1020px): eyebrow badge `LET'S TALK · MONROE, NC`; H1 (2 lines, "your business." = lime marker):
  > Let's talk about
  > **[your business.]**
  - Lead: *"Whether you are ready to get started or just have a few questions, reach out. You will talk to me directly, not a sales team or a chatbot. I am a real person and I actually respond."*
  - CTA row: primary `Call or text me →` (tel:) + secondary `Fill out the form` (→ #form).

### Two Ways To Reach Me  `#reach` — `.sec-pad`
- Section head: eyebrow `// 01  TWO WAYS TO REACH ME`; H2 *"Reach me whichever way works for you."*
- **Two-column grid `0.9fr 1.1fr`:**
  - **Call card** (dark, lime glow): tag `// THE FASTEST WAY`; H3 *"Just text or call me"*; body *"No forms, no waiting. Shoot me a text or give me a call and we will go from here."*; big lime phone **(908) 419-9566**; a meta list (label↔value rows): `Email → contact@beyondbeliefstudio.com` · `Response time → Usually same day` · `Based in → Monroe, North Carolina` · `Serving → Monroe, Waxhaw, Matthews & Charlotte — plus businesses anywhere in the country.` (last row full-width).
  - **Form card** `#form` (paper surface): eyebrow `// OR FILL OUT THE FORM`; sub *"Prefer to send the details over? Fill this out and I will get back to you, usually same day."*; fields: Your name / Your business name / Your email / **Your phone number (optional)** / **What does your business do? And what are you hoping a new website can help with?** (4-row textarea, placeholder *"A sentence or two is plenty — I'll follow up with the rest."*); button `Send it over →`.

### The Free Homepage Offer  `#free` — **dark** `.sec-dark .sec-pad`
- Dual lime glow, top/bottom hairlines. **Two-column grid `1.02fr 0.98fr`:**
  - Left: eyebrow dot `ZERO RISK · ZERO OBLIGATION`; H2 *"Still on the fence? Let me build you [something first.]"* (lime marker).
  - Right: body *"If you are curious but not quite ready to commit, I will design a free homepage concept for your business, completely free and with zero obligation. You get to see exactly what your new site could look like before you decide anything."*; **chips** (lime dot each): `No risk` · `No pressure` · `Yours to see first`; cue *"Just mention it when you reach out and we will get started."*; primary button `Claim a free homepage →` (→ #form).

### Closing  `#closing` — centered
- Kick `✦ LOOKING FORWARD TO HEARING FROM YOU`; big statement (Bricolage 800, max-width 18ch): *"Let's make your business [impossible to miss] online."* (lime marker, wipe-in).

---

## 6.6 Blog (landing) — `Beyond Belief Blog.html`

SEO title *"Web Design & Local SEO Tips for Small Businesses | Beyond Belief Web Design"*. Header CTA → Contact. Sections: Header → Hero (editorial) → Featured Post → Posts Grid (filterable) → Newsletter (dark) → End CTA → Footer.

### Hero  `#hero.blog-hero` — left-aligned editorial
- Block layout (not full-viewport), wash + fade, generous top padding `clamp(150px,20vh,220px)`. Left-aligned: eyebrow badge `THE BLOG · MONROE, NC`; H1 (3 lines, "Straight answers" = lime marker):
  > **[Straight answers]** about
  > websites, SEO, and
  > growing your business.
  - Lead: *"No jargon, no fluff. Just practical advice for local business owners who want their website to actually work — written by Chris, the person who builds them."*

### Featured Post  `#featured`
- **Large horizontal split card** (`.feat-card`, `1.05fr 0.95fr`, hover lime ring). Left = 4:3 media (`<image-slot id="blog-feat">`) with a lime **"✦ Featured"** pin. Right body: meta row (cat-tag `Small Business Tips` + read-time `5 min read`); H2 *"How much should a small business website actually cost?"*; excerpt *"One person quotes you five hundred dollars. The next quotes eight thousand. Somebody's nephew says he'll do it free over a weekend. Here's the honest breakdown of what you're really paying for — and how to avoid getting overcharged."*; `Read the post →`. Links to the Blog Post template.

### Posts Grid  `#posts` — `.sec-pad`
- **Posts head** (space-between): left = eyebrow `// 01  LATEST POSTS` + H2 *"Everything on the blog."*; right = **filter bar** of pill chips (mono), one active = solid lime: `All` · `Web Design` · `Local SEO` · `Small Business Tips` · `Behind the Scenes`. Clicking a chip filters cards client-side by `data-cat` (an empty-state line shows if none match).
- **3-column post grid** (`.post-card` each: 16:10 media that zooms on hover, cat-tag, H3, excerpt, foot = read-time + `Read →`). Six posts:
  1. *(Small Business Tips, 5 min)* **How much should a small business website actually cost?** — *"An honest breakdown of website pricing, what you're really paying for, and how to avoid getting overcharged."*
  2. *(Local SEO, 4 min)* **Why your GoDaddy website isn't showing up on Google** — *"If you built your site on a template builder and can't figure out why nobody is finding it, here's what's probably going on."*
  3. *(Local SEO, 6 min)* **What local SEO actually means (and why your business needs it)** — *"Local SEO gets thrown around a lot. Here's what it really means in plain English and why it matters for any local business."*
  4. *(Web Design, 4 min)* **5 signs your website is costing you customers** — *"Your website might be quietly turning people away without you ever knowing it. Here are the warning signs to watch for."*
  5. *(Small Business Tips, 5 min)* **Do you really own your website? A lot of business owners don't.** — *"Many small business owners don't actually own their own site or domain — and have no idea. Here's how to check and why it matters."*
  6. *(Behind the Scenes, 5 min)* **Behind the build: how I design a website from scratch** — *"A look at my actual process, from the first conversation to launch day, and why I do things the way I do."*
  - Grid → 2 cols ≤920px → 1 col ≤600px.

### Newsletter  `#subscribe` — **dark** `.sec-pad`
- Lime glow. **Two-column grid `1fr 0.92fr`:** left = eyebrow dot `STRAIGHT TO YOUR INBOX` + H2 *"Want this kind of advice without digging through Google?"* + body *"I write about the stuff local business owners actually need to know. No spam, no nonsense — just useful things, now and then."*; right = inline form (pill email input + primary `Subscribe →`) + note *"✦ Unsubscribe anytime. I'll never sell your email."*

### End CTA  `.end-cta` — `.sec-pad`, centered (paper + glow)
- Centered (max-width 780px), big radial lime glow behind. Eyebrow dot `STOP READING, START DOING`; H2 *"Ready to stop reading about it and start doing it?"*; body *"If your website isn't pulling its weight, let's fix that. Reach out and we'll talk about what your business actually needs."*; CTA row primary `Get started today →` (→ Contact) + secondary `See what's included` (→ Services); text *"Or just text me — (908) 419-9566."* (lime-underlined phone).

---

## 6.7 Blog Post (template) — `Beyond Belief Blog Post.html`

SEO title *"How Much Should a Small Business Website Actually Cost? | Beyond Belief Web Design"*. The reusable article template (one populated example). Sections: Header → Post header → Cover image → Article body → Inline CTA → Author card → Related posts → Newsletter → Footer.

### Post header  `#hero.post-hero` — centered
- Block layout, wash + fade, centered (max-width 860px). **Back link** `← All posts` (→ Blog). Eyebrow `// SMALL BUSINESS TIPS`. H1 (3 lines, Bricolage 700, "actually cost?" = lime marker, max-width 20ch):
  > How much should a
  > small business website
  > **[actually cost?]**
  - **Meta row** (centered): read-time `5 min read` + `Updated June 2026`.
  - Lead: *"An honest breakdown of what a website really costs, what you're actually paying for, and how to avoid getting overcharged."*
  - **Byline** (top-bordered, centered, max-width 420px): 46px round avatar (`uploads/pasted-1781119849800-1.png`) + `Chris` / `Founder & Developer · Monroe, NC`.

### Cover image  `.post-cover`
Centered (max-width 1080px), 16:8 framed image (`<image-slot id="post-cover">`, `radius-lg`, `--shadow-lg`).

### Article body  `.article` — prose column, **max-width 720px**, centered
Typographic system for posts:
- **Lead paragraph** `.lead-p` — larger (`clamp(1.22rem,1.6vw,1.42rem)`/1.62, ink), with a **drop cap** (Bricolage 800 3.6rem float-left first-letter).
- **Body `p`** — `1.16rem`/1.78, `--fg2`; `<strong>` → ink 600.
- **H3 section headings** — each preceded by a mono tangerine `// KICKER` label on its own line, then the Bricolage 700 heading.
- **Consideration list** `.consider` — numbered rows (outline mono number + Q in display + A in body), divided by hairlines.
- **Pull quote** `.pull` — dark `radius-lg` block with lime glow: a mono lime kicker + a big Bricolage paper statement.
- **Inline CTA** `.inline-cta` — surface bar (text + primary button).

Full article copy (verbatim):

- **Lead:** *"If you've ever tried to get a straight answer on what a website costs, you already know how frustrating it is. One person quotes you five hundred dollars. The next quotes you eight thousand. Somebody's nephew says he can do it for free over a weekend. So what's the real answer?"*
- *"Let me break it down honestly, because this is exactly the kind of thing nobody in my industry likes to talk about openly."*
- **`// THE SHORT ANSWER` — Why website pricing is all over the place**
  - *"The reason quotes vary so wildly is that "a website" can mean a hundred different things. A free drag-and-drop builder and a custom hand-coded site are both technically websites — the same way a bicycle and a pickup truck are both technically vehicles. They are not remotely the same thing, and they are not built for the same job."*
  - *"When someone quotes you a price, what really matters is what you're getting for it. So let's look at what actually drives the cost."*
- **`// OPTION ONE` — The cheap option: do-it-yourself builders**
  - *"Platforms like Wix, Squarespace, and GoDaddy Airo let you build a site yourself for somewhere between ten and fifty dollars a month. On paper that sounds great."*
  - *"The catch is that you're doing all the work, the templates are used by thousands of other businesses, and these sites are notorious for loading slowly and struggling to rank on Google. They're fine if you just need something to exist. They're not built to actually bring in customers."*
- **`// OPTION TWO` — The expensive option: traditional agencies**
  - *"On the other end, a traditional web design agency will typically charge anywhere from three thousand to ten thousand dollars or more upfront to build a custom site. Then they often charge by the hour for any changes after launch."*
  - *"The work is usually high quality. But that upfront cost is a serious barrier for a small local business, and getting nickel-and-dimed for every little update afterward adds up fast."*
- **`// THE REAL QUESTIONS` — What you're actually paying for**
  - *"Whether a website is worth its price comes down to a few things that most business owners never think to ask about."*
  - **Consideration list:**
    1. **Is it built to load fast?** — *"A slow website quietly costs you customers, because people leave before it even loads."*
    2. **Is it built to rank on Google?** — *"A beautiful website that nobody can find is just an expensive business card."*
    3. **Is it built to convert?** — *"Looking nice isn't enough. The site needs to guide visitors toward calling, texting, or filling out a form."*
    4. **Who handles it after launch?** — *"A website isn't a one-time thing. It needs hosting, maintenance, and updates over time."*
- **`// THE NUMBERS` — So what should you actually expect to pay?**
  - *"For a small local business that wants a real, custom, professional website that actually performs, you're generally looking at either a few thousand dollars upfront with a traditional agency, or a monthly plan that rolls everything together."*
  - *"I built my own business around the monthly model specifically because that upfront cost shuts out so many great local businesses. For a flat monthly rate you get a fully custom site, hosting, maintenance, and unlimited updates — without ever having to drop thousands of dollars at once. **No surprise fees, no hourly charges for changes.**"*
- **Pull quote:** `// THE BOTTOM LINE` — *"A website is not an expense to minimize. It's a tool that should bring you more business than it costs you."*
- **`// WHAT MATTERS` — The bottom line**
  - *"The cheapest option usually ends up costing you the most in missed customers. The most expensive option isn't always the best built."*
  - *"What matters is finding something that's genuinely built to get you found, build trust, and turn visitors into customers — at a price that actually makes sense for a local business."*
  - *"If you want to talk through what makes sense for your specific business, reach out anytime. **I'm always happy to give you a straight answer.**"*
- **Inline CTA:** H3 *"See exactly what's included in my plan"* + *"One flat monthly rate covers design, build, hosting, maintenance, and unlimited updates — no upfront wall."* + button `See the plan →` (→ Services).

### Author card  `.author-card`
Surface block (paper-sunken): 84px round avatar + `// Written by` + H3 *"Chris — Beyond Belief Web Design"* + *"I hand-code websites from scratch for local businesses around Monroe, NC. No templates, no page builders, no agencies in the middle. Just straight answers and sites that actually pull their weight."*

### Related posts  `#related` — `.sec-pad`
Head: eyebrow `// 02  KEEP READING` + H2 *"More straight talk."* + `All posts →` link. **3 post cards** (same `.post-card` component): "Do you really own your website?…", "What local SEO actually means…", "Why your GoDaddy website isn't showing up on Google".

### Newsletter
Same `#subscribe` dark band as the Blog landing (§6.6).

---

# 7. Asset inventory & references

Bundled alongside this document:

```
Beyond Belief Handoff/
├─ Beyond Belief Web Design — Developer Handoff.md   ← this file
├─ assets/
│   ├─ brand/
│   │   ├─ mark.svg            (logo mark — currentColor blades + #CCFF00 star; inline this)
│   │   ├─ mark-onlight.svg    (all-ink mark, img-safe for light grounds)
│   │   ├─ texture-topo.svg    (optional abstract topo-signal texture)
│   │   └─ texture-glow.svg    (optional lime glow texture)
│   └─ images/
│       ├─ hero-map.png            (homepage hero faint topo map)
│       ├─ problem-illustration.png(homepage "problem" browser-frame art)
│       ├─ Monroe.png              (homepage Monroe image band)
│       ├─ chris-portrait.png      (Chris portrait — home About / Services / blog byline & author)
│       ├─ chris-computer.png      (About hero collage tile)
│       ├─ work-fdcigar.png        (FD Cigar screenshot)
│       └─ work-lambos.png         (Lambo's Garage Door screenshot)
├─ reference-css/   (the real stylesheets — source of truth for any value)
│   ├─ colors_and_type.css   (design tokens)
│   ├─ v2.css                (master: globals + homepage sections + all shared components)
│   ├─ services.css  about.css  work.css  contact.css  blog.css
└─ reference-js/
    ├─ motion.js   (Lenis + GSAP scroll/reveal system)
    └─ field.js    (Three.js hero watercolor wash)
```

### Image treatment
All photography is treated **cool & slightly desaturated** with lime as the only chromatic pop. Filters in use: screenshots `saturate(0.82) contrast(1.03)`; Monroe band `saturate(0.72) contrast(1.04) brightness(0.97)`; portraits `saturate(0.94)`; collage/hero photos `saturate(0.62) contrast(1.03)`. Keep these.

### Images still needed (currently placeholders / `<image-slot>`)
- **Services hero** — 10 owned photos of local tradespeople/business owners (or licensed stock), square crop.
- **Work page** — real screenshots for **All The Rage Carpet Cleaning** and **Andiamo Away Travel** (FD Cigar & Lambo's are provided).
- **About** — "Chris at work" 4:3, and a wide 21:9 downtown Monroe street shot.
- **Blog** — featured + 6 post thumbnails + post cover (currently Unsplash URLs; replace with owned/licensed imagery). Blog images referenced in source: see the `src` on each `<image-slot>` in `Beyond Belief Blog.html` / `Beyond Belief Blog Post.html`.

### Brand voice reminders (for any new copy)
Second person ("your business"), confident first person about the craft ("hand-coded from scratch"). Short declarative sentences, plain-spoken, slight Southern warmth, no jargon, **no exclamation hype, no emoji.** Mono `//` kickers and `01 / 02 / 03` indexes are a recurring "this person actually writes code" tell. Em-dashes for asides. CTAs: *Start a project →* / *Get started today →* / *See the work*.

### Contact details (consistent site-wide)
Phone **(908) 419-9566** · Email **contact@beyondbeliefstudio.com** · Based in **Monroe, North Carolina** · Serving **Monroe, Waxhaw, Matthews, Charlotte** + nationwide.

---

*End of handoff. The two files `reference-css/colors_and_type.css` and `reference-css/v2.css` contain every exact value referenced above — when in doubt, they are authoritative.*
