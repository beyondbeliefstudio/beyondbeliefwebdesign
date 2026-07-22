# CLAUDE.md — Astro Starter Template

This file describes the conventions, architecture, and patterns used across all projects built from this starter. Read it before touching any file.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Astro](https://astro.build) | Framework (static-first, file-based routing) |
| SASS/SCSS | Styling (`src/styles/global.scss` + scoped component styles) |
| GSAP + ScrollTrigger | Animations (imported in `src/js/app.js`) |
| astro-icon | SVG icons (sourced from `src/icons/`) |
| @astrojs/mdx | MDX support for content |
| @astrojs/sitemap | Auto-generated sitemap |
| Prettier + prettier-plugin-astro | Code formatting |
| Netlify | Deployment |
| Google Analytics + Ahrefs | Analytics (both wired in `BaseHead.astro`) |

---

## Folder Structure

```
src/
  assets/          # Images processed by Astro (import and use <Image>)
  components/      # Reusable .astro components (PascalCase filenames)
  content/         # Content collections (JSON or MDX)
  data/            # siteData.ts, navData.ts, static JSON data files
  icons/           # SVG files consumed by astro-icon
  js/              # app.js — all client-side JS (GSAP, nav, animations)
  layouts/         # BaseHead.astro, Layout.astro, Nav.astro, Footer.astro
  pages/           # File-based routes (.astro files)
  styles/          # global.scss (one file — no partials)
public/
  favicon.png
  og-image.jpg     # Required for Open Graph tags
  fonts/           # Self-hosted fonts (served with immutable cache headers)
  images/          # Static images NOT processed by Astro
```

---

## Path Aliases

Defined in `tsconfig.json`. Always use these — never relative paths:

```ts
@/*        →  src/*
@/ui/*     →  src/components/ui/*
```

Examples: `import { baseData } from "@/data/siteData"` / `import Hero from "@/components/MainHero.astro"`

---

## Data Layer

### `src/data/siteData.ts`
Exports `baseData` — the single source of truth for site identity. Always pull contact info, social links, and metadata from here, never hardcode.

```ts
export const baseData = {
  title: "Business Name",
  description: "Site meta description.",
  phone: "(xxx) xxx-xxxx",
  email: "hello@example.com",
  address: {
    street: "...",
    city: "...",
    state: "NC",
    zip: "...",
    full: "Full address string",
  },
  hours: {                          // optional
    monday: { day: "Monday", hours: "Closed" },
    // ...
  },
  social: {
    facebook: "https://...",
    instagram: "https://...",
    // only include platforms the business uses
  },
};
```

### `src/data/navData.ts`
Drives both desktop and mobile nav. Supports one level of children (dropdown).

```ts
export interface NavItem {
  title: string;
  href: string;
  children?: NavItem[];
}

export const navData: NavItem[] = [
  { title: "About", href: "/about" },
  { title: "Services", href: "/services", children: [
    { title: "Service A", href: "/services/a" },
  ]},
  { title: "Contact", href: "/contact" },
];
```

### Content Collections (`src/content.config.ts`)
Uses Astro's `file()` loader for JSON-backed collections. MDX collections use `glob()`.

```ts
import { glob, file } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const reviews = defineCollection({
  loader: file("src/data/reviews.json"),
  schema: z.object({ name: z.string(), stars: z.number(), description: z.string() }),
});

export const collections = { reviews };
```

---

## Layouts

### `BaseHead.astro`
Renders the entire `<head>`. Accepts `pageTitle` and `description` props; falls back to `baseData` values. Includes:
- Canonical URL
- Full Open Graph + Twitter card tags
- Google Fonts `<link>` preconnects
- `src/js/app.js` script tag
- `Analytics` and `AhrefsAnalytics` components

**Always pass a unique `pageTitle` and `description` from every page** — never rely on the default for inner pages.

```astro
const ogImage = new URL("/og-image.jpg", Astro.site).toString();
```

### `Layout.astro`
Root layout shell. Wraps every page. Accepts:
- `pageTitle` / `description` → passed through to `BaseHead`
- `hideCTA?: boolean` → hides the sitewide CTA section when `true`

Structure: `BaseHead` → `Nav` → `<main><slot /></main>` → `CTA` → `Footer` → `UserBack`

### `Nav.astro`
Fixed position. Reads from `navData.ts`. Key behaviors:
- Adds `.scrolled` class to `.nav` after 50px scroll
- Sets `--nav-height` CSS custom property via JS (used by `main { padding-top: var(--nav-height) }`)
- Mobile hamburger animated with GSAP timeline
- Mobile breakpoint: **1070px**
- Dropdown items rendered via `.nav__item--has-children` / `.nav__mobile-item--has-children` with `.is-open` toggle

### `Footer.astro`
Three-column layout: logo + description + socials / nav links / contact info. Bottom bar with copyright (auto year) + legal links. Legal links are always: Privacy Policy, Terms & Conditions, Accessibility.

---

## Standard Pages

Every project ships these pages. Do not remove them:

| Page | Notes |
|---|---|
| `index.astro` | Homepage |
| `contact.astro` | Contact form |
| `404.astro` | Not found |
| `privacy-policy.astro` | Legal |
| `terms-and-conditions.astro` | Legal |
| `accessibility.astro` | Legal / a11y statement |

Inner pages use the `.terms` / `.accessibility` CSS classes in `global.scss` for prose content.

---

## Core Components

All components are `.astro` files with PascalCase names. The following exist in every project:

| Component | Purpose |
|---|---|
| `Analytics.astro` | Google Analytics (`measurementId` prop) |
| `AhrefsAnalytics.astro` | Ahrefs site audit tag (`dataKey` prop) |
| `Buttons.astro` | `<button type="submit">` with variant system |
| `ContactForm.astro` | Contact form with honeypot |
| `Heading.astro` | Typography primitive (see below) |
| `Links.astro` | Anchor link with variant system (see below) |
| `UserBack.astro` | Userback feedback widget |
| `ScrollingText.astro` | CSS marquee / ticker |

Common but project-specific (include as needed):
`MainHero`, `InternalHero`, `InternalHeroAlt`, `SplitOverlay`, `FullOverlay`, `CTA`, `FAQ`, `Reviews`, `ReviewsCard`, `CardGrid`, `ScrollingMarquee`, `Process`, `Gallery`, `LighthouseGalleryModal`

### `Heading.astro`

Renders any heading tag with a consistent prop-driven class system. Required for all headings — do not use raw `<h1>`–`<h6>` tags in page/component markup.

```astro
<Heading
  tag="h2"           // h1 | h2 | h3 | h4 | h5 | h6 | span
  size="xxl"         // display | xxl | xl | l | m | s | xs | xxs | main
  fontFamily="primary"  // primary | secondary
  marginBottom="m"   // xl | l | m | s | xs | none
  weight="fw800"     // fw100 – fw900
  textTransform="uppercase"  // optional: uppercase | lowercase | capitalize | none
>
  Heading Text
</Heading>
```

Size → CSS variable mapping:
- `display` → `--_typography---font-size--display`
- `xxl` → `--_typography---font-size--h1`
- `xl` → `--_typography---font-size--h2`
- `l` → `--_typography---font-size--h3`
- `m` → `--_typography---font-size--h4`
- `s` → `--_typography---font-size--h5`
- `xs` → `--_typography---font-size--h6`

### `Links.astro`

All links and CTA anchors go through this component. Renders as `<a class="btn [variant]">`.

```astro
<Links variant="primary" href="/contact">Get Started</Links>
```

Variants: `primary` | `primary-light` | `outline` | `outline-dark` | `light` | `nav-link` | `inline`

Wrap multiple buttons in `<div class="btn-wrapper">` (or `btn-wrapper--left` for left-aligned).

---

## CSS Architecture

### One global file — `src/styles/global.scss`
Imported once in `Layout.astro`. Contains: CSS custom properties, reset, base element styles, utility classes, layout helpers, form styles, card styles.

Do not create additional global files. Put component-specific styles in scoped `<style lang="scss">` blocks within the component file.

### CSS Custom Properties

**Brand colors** (override per project in `:root`):
```scss
--brand-primary:        #xxxxxx;
--brand-primary-light:  #xxxxxx;
--brand-primary-dark:   #xxxxxx;
--brand-secondary:      #xxxxxx;
--brand-secondary-light:#xxxxxx;
--brand-secondary-dark: #xxxxxx;
```

**Semantic aliases** (do not change — use these in component styles):
```scss
--surface-primary       // page background
--surface-secondary     // subtle background
--content-primary       // primary text color
--content-secondary     // secondary text color
--border-color          // default border
```

**Dark / light scales:**
```scss
--dark-900  --dark-800  --dark-700
--light-100  --light-200
--light-glass  --dark-900--transparency
```

**Typography scale** (all fluid via `clamp()`):
```scss
--_typography---font-size--display
--_typography---font-size--h1  through  --_typography---font-size--h6
--_typography---font-size--text-large
--_typography---font-size--text-main
--_typography---font-size--text-small
```

**Spacing scale** (all fluid via `clamp()`):
```scss
--_spacing---section-space--xl
--_spacing---section-space--large
--_spacing---section-space--main
--_spacing---section-space--small
--_spacing---space--8  through  --_spacing---space--1
```

**Container widths:**
```scss
--site--width--sm: 61rem   // ~1010px
--site--width--md: 80rem   // ~1440px
--site--width--lg: 110rem  // ~1980px
```

**Typography:**
```scss
--primary-family   // display/headline font (e.g., Bebas Neue, Montserrat)
--secondary-family // body copy font (e.g., Roboto)
```
Base: `html { font-size: 20px; }`

### Utility Classes

**Containers** — always pair `.container` with a size modifier:
```html
<div class="container container-md">   <!-- most common -->
<div class="container container-sm">
<div class="container container-lg">
<div class="container container-full">
```

**Content width** — inside containers, constrains and centers text blocks:
```html
<div class="content-md">    <!-- max 46rem, centered -->
<div class="content-lg">    <!-- max 55rem, centered -->
<div class="content-full">  <!-- full width, left-aligned -->
<div class="content-left">  <!-- max 55rem, left-aligned -->
```

**Background utilities** (handle text color automatically):
`.bg-primary` `.bg-primary-dark` `.bg-white` `.bg-light` `.bg-black` `.bg-dark` `.bg-glass`

**Grid layouts:**
`.grid-auto-2` `.grid-auto-3` `.grid-auto-4` `.grid-auto-5`

**Flex layouts:**
`.flex-row` `.row-small` `.row-large` `.column-main` `.column-medium` `.column-small` `.vc`

**Typography helpers:**
`.eyebrow` — small uppercase label above a heading
`.highlight` — inline text with brand-colored underbar

**Form:**
`.form-row` — two-column field grid (collapses on mobile)
`.form-group` — wraps label + input
`.hidden` — honeypot field (visually hidden, pointer-events none)

### BEM in Components
Component `<style lang="scss">` blocks use BEM:
```scss
.component-name {
  &__element { }
  &--modifier { }
}
```

---

## Client-Side JavaScript (`src/js/app.js`)

Single entry point for all client JS. Imported via `<script src="@/js/app.js">` in `BaseHead.astro`.

Structure pattern:
```js
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

window.addEventListener("DOMContentLoaded", () => {
  initFeatureA();
  initFeatureB();
});

window.addEventListener("load", () => {
  initParallaxEffects();  // after full page load
});

// ==========================================
// FEATURE NAME
// ==========================================
function initFeatureA() { ... }
```

Standard functions present in every project:
- `initNavActiveStates()` — adds `.active` to current page nav link
- `initScrollerAnimations()` — duplicates marquee items for infinite scroll
- `initParallaxEffects()` — GSAP ScrollTrigger parallax on `.hero__bg`

---

## SEO Conventions

Every page must pass unique `pageTitle` and `description` to `<Layout>`:

```astro
<Layout
  pageTitle="Page Title | Business Name"
  description="150–160 char unique description for this specific page."
>
```

- `pageTitle` format: `[Page Topic] | [Business Name]`
- Homepage title usually leads with the business name
- `og-image.jpg` lives at `public/og-image.jpg` — 1200×630px
- Canonical is set automatically from `Astro.url`
- Sitemap generated automatically; set `site` in `astro.config.mjs`

---

## Astro Config (`astro.config.mjs`)

```js
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://example.com",   // ← set to production URL
  integrations: [
    mdx(),
    sitemap(),
    icon({ iconDir: "src/icons" }),
  ],
  vite: {
    build: { assetsInlineLimit: 0 },  // include when using asset files referenced in SCSS
  },
});
```

---

## Prettier Config

Shared across all projects — do not change:
- `semi: true`, `singleQuote: false`, `tabWidth: 2`, `useTabs: false`
- `trailingComma: "es5"`, `printWidth: 100`
- `arrowParens: "avoid"`, `endOfLine: "lf"`
- Astro, TS, JSON, SCSS parsers all configured

---

## Netlify Config (`netlify.toml`)

```toml
[build]
  command = "rm -rf node_modules package-lock.json && npm install --include=optional && npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[headers]]
  for = "/_astro/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/fonts/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

Security headers (X-Frame-Options, X-Content-Type-Options, etc.) can be added to the `for = "/*"` block.

---

## Common Patterns

### Section structure
```astro
<section>
  <div class="container container-md">
    <div class="content-md">
      <Heading tag="h2" size="xxl" fontFamily="primary" marginBottom="m" weight="fw800">
        Section Title
      </Heading>
      <p>Section intro text.</p>
      <div class="btn-wrapper">
        <Links variant="primary" href="/contact">CTA Label</Links>
      </div>
    </div>
  </div>
</section>
```

### Image imports (processed by Astro)
```astro
import myImage from "@/assets/my-image.jpg";
// ...
<Image src={myImage} alt="Descriptive alt text" />
```

Use `src/assets/` for images that Astro should optimize. Use `public/images/` for images referenced directly in markup or from content collections.

### Content collection usage
```astro
import { getCollection } from "astro:content";
const reviews = await getCollection("reviews");
```

### Frontmatter import grouping convention
```astro
---
// COMPONENTS
import Layout from "@/layouts/Layout.astro";

// HELPERS
import { Image } from "astro:assets";

// DATA
import { baseData } from "@/data/siteData";

// IMAGES
import heroImg from "@/assets/hero.jpg";

// PROPS
const { pageTitle } = Astro.props;
---
```

---

## Environment Variables

Analytics keys and third-party tokens must not be hardcoded in source files. Store them in `.env` (gitignored) and reference via `import.meta.env`.

Required variables for every project:

```bash
# .env
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
PUBLIC_AHREFS_DATA_KEY=xxxxxxxxxxxx
USERBACK_TOKEN=xxxxxxxxxxxx
```

In `BaseHead.astro`:
```astro
const GA_MEASUREMENT_ID = import.meta.env.PUBLIC_GA_MEASUREMENT_ID;
const AHREFS_DATA_KEY = import.meta.env.PUBLIC_AHREFS_DATA_KEY;
```

In `UserBack.astro`:
```js
Userback.access_token = import.meta.env.PUBLIC_USERBACK_TOKEN;
```

Add `.env` to `.gitignore`. Provide a `.env.example` with empty keys as a reference.

---

## Known Issues — Do Not Repeat in the Starter

These bugs were found across the four existing projects. The starter must fix all of them.

### Hardcoded asset paths in layout components

`SplitOverlay.astro` and `MainHero.astro` both use `background-image: url("/src/assets/[filename].svg")` inline in their SCSS for list bullet icons. These paths point to project-specific files that won't exist in a new project — the bullet silently disappears with no error.

**Fix:** Add generic bullet/check icons to `src/icons/` and reference them as component props or use a neutral CSS bullet (`content: "✓"` or a border-based shape) as the default. Never hardcode `/src/assets/` paths inside reusable component styles.

### `arrow-right.svg` is missing from `src/icons/`

`Links.astro` (inline variant) uses `background-image: url("../icons/arrow-right.svg")` in its global SCSS. The file doesn't exist in any project — the inline arrow is silently broken everywhere.

**Fix:** Add `arrow-right.svg` to `src/icons/` as part of the starter's base icon set.

### `FAQ.astro` ships dead variables

The `<script>` block in `FAQ.astro` ends with six variables that are declared and animated but never connected to the DOM: `toggleBtn`, `content`, `vertical`, `horizontal`, `isOpen`, `iconTL`. These are leftover from an earlier implementation and get bundled in every project.

**Fix:** Delete them. The accordion is fully driven by the `accordionQuestions.forEach` block above them.

### `InternalHeroAlt.astro` has an unused import

Both projects that use `InternalHeroAlt.astro` import `Picture` from `astro:assets` in the frontmatter but render no `<Picture>` in the template.

**Fix:** Remove the import.

### `app.js` calls `initLighthouseGalleryModal()` unconditionally

This function is wired into `DOMContentLoaded` in every project's `app.js`, but only one project (`all-the-rage`) has the `LighthouseGalleryModal.astro` component. In every other project it runs, finds no elements, and exits — but it's dead code.

**Fix:** Only include `initLighthouseGalleryModal()` when the gallery feature is actually used. Either guard with a DOM check at the top, or remove it from the base `app.js` and add it only in projects that need it.

### Old `.gallery-modal` CSS block in `global.scss`

Around line 569 of `global.scss`, there's a `.gallery-modal` ruleset that was the original inline gallery modal implementation. It's been superseded by `LighthouseGalleryModal.astro` but the CSS remains in every project's global stylesheet.

**Fix:** Remove the old `.gallery-modal`, `.gallery-modal img`, and `.gallery-modal-close` blocks from the starter's `global.scss`.

### `ContactForm.astro` posts to a page that doesn't exist

All `ContactForm` components use `action="/submit-contact"`. No project has a `/submit-contact.astro` page. Netlify intercepts the POST so it doesn't 404 in production, but there's no thank-you experience.

**Fix:** Add `src/pages/submit-contact.astro` as a standard starter page with a confirmation message.

---

## Component Build Notes for the Starter

Specific things to get right when building these components from scratch.

### `ScrollingText.astro`
This component exists in all four projects under two different names (`ScrollingText` and `ScrollingMarquee`). The starter should have one canonical version:
- Content via `<slot>` — no hardcoded items
- CSS infinite scroll animation (not GSAP) with a `--gap` custom property
- JS block that duplicates slot children for seamless looping, respects `prefers-reduced-motion`

Do not include a separate `ScrollingMarquee.astro` — one component handles both use cases.

### `CTA.astro`
The existing `CTA.astro` in all-the-rage has carpet-cleaning-specific copy, a service dropdown, and no slot. It requires a full rewrite for every new project.

The starter version should:
- Accept `title` and `description` props
- Use `<slot>` for the form fields so each project provides its own inputs
- Pull phone/email contact links from `baseData`
- Keep the two-column grid layout (form left/right, contact info opposite)

### `Alert.astro`
Useful top-bar announcement banner. The starter version should:
- Use `<slot>` for content instead of hardcoded text
- Remain `position: fixed` at `top: 0`, `z-index: 1001` (above the nav)
- Only be included in `Layout.astro` when the project needs it (opt-in, not default)

When `Alert.astro` is active, `--address-height` must be set via JS and added to the nav offset so the page doesn't underlap both bars.

### `Address.astro`
The existing implementations hardcode the address string or delegate to `ScrollingText`. The starter version should:
- Import `baseData` from `siteData.ts`
- Construct the Google Maps URL from `baseData.address` fields automatically:
  ```astro
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(baseData.address.full)}`;
  ```
- Render as a simple branded bar linking to Maps

### `UserBack.astro`
Replace the hardcoded access token with an env variable:
```js
Userback.access_token = import.meta.env.PUBLIC_USERBACK_TOKEN ?? "";
```
Keep the lazy-load pattern (loads after 3s or first user interaction) — do not change that.

### `Analytics.astro` / `AhrefsAnalytics.astro`
Both already guard with `!isDev` — keep that. The only change is that the `measurementId` / `dataKey` values come from env vars passed as props from `BaseHead`, not hardcoded constants.

### `content.config.ts`
The starter should ship a commented-out template with the two most common collection types:

```ts
import { file } from "astro/loaders";
import { defineCollection, z } from "astro:content";

// Uncomment and customize the collections this project uses:

// const reviews = defineCollection({
//   loader: file("src/data/reviews.json"),
//   schema: z.object({
//     name: z.string(),
//     stars: z.number(),
//     description: z.string(),
//     isFeatured: z.boolean(),
//   }),
// });

// const faq = defineCollection({
//   loader: file("src/data/faq.json"),
//   schema: z.object({
//     question: z.string(),
//     answer: z.string(),
//     tag: z.string(),
//   }),
// });

export const collections = {
  // reviews,
  // faq,
};
```

---

## New Project Checklist

Run through this when spinning up a new project from the starter.

- [ ] Set `site` in `astro.config.mjs` to the production URL
- [ ] Fill in all fields in `src/data/siteData.ts`
- [ ] Update `src/data/navData.ts` with the real nav structure
- [ ] Replace placeholder values in `.env` with real API keys
- [ ] Swap out font families in `global.scss` (`--primary-family`, `--secondary-family`) and update the Google Fonts `<link>` in `BaseHead.astro`
- [ ] Set brand color tokens in `global.scss` (the six `--brand-*` variables)
- [ ] Replace `public/og-image.jpg` with a real 1200×630px image
- [ ] Replace `public/favicon.png`
- [ ] Update `netlify.toml` if using a monorepo or non-standard build path
- [ ] Uncomment and configure the collections needed in `content.config.ts`
- [ ] Remove `initLighthouseGalleryModal()` from `app.js` if not using a gallery
- [ ] Customize `CTA.astro` form fields for this business's service type
- [ ] Write unique `pageTitle` and `description` for every page

---

## Dev Commands

```bash
npm run dev      # start dev server
npm run build    # production build → dist/
npm run preview  # preview the dist/ build
```
