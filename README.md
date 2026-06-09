# Pulsar

Pulsar is a dark-themed Astro site for developer-tool and API companies: a marketing site (home, pricing, 404), a blog, a changelog, and full Starlight documentation in one codebase, sharing one set of design tokens. Built with Astro 6, Tailwind CSS 4, and Starlight 0.40 — no UI frameworks, no client-side JavaScript, `.astro` components only. The demo brand is **Vega**, a fictional API platform; everything Vega-specific is listed under [Rebranding](#customizing--brand) below.

## Quick start

Requires Node >= 22.12 and [pnpm](https://pnpm.io).

```sh
pnpm install
pnpm dev        # dev server at http://localhost:4321
pnpm build      # static build to ./dist/
pnpm preview    # serve ./dist/ locally
```

`pnpm build` runs `astro build` and must pass with zero errors before you deploy.

## Project structure

```text
.
├── astro.config.mjs          # Starlight config: docs title, sidebar, site URL
├── DESIGN.md                 # design contract: tokens, components, spacing, voice
├── public/
│   ├── favicon.svg           # Vega star mark — replace with your own
│   └── og.png                # default Open Graph image — replace with your own
├── src/
│   ├── components/
│   │   ├── Button.astro      # variants: primary / secondary / ghost; sizes: sm / md / lg
│   │   ├── Container.astro   # max-w-6xl wrapper used by every section
│   │   ├── Footer.astro
│   │   ├── Glow.astro        # decorative radial glow (parent needs relative overflow-hidden)
│   │   ├── Logo.astro        # SVG mark + wordmark
│   │   ├── Nav.astro
│   │   ├── WindowDots.astro  # macOS-style window chrome for code panels
│   │   ├── blog/             # Avatar, PostCard, TagPill
│   │   ├── home/             # Hero, LogoCloud, Features, CodeShowcase, Observability, Testimonials, CTA
│   │   └── pricing/          # TierCards, ComparisonTable, Faq, CtaStrip
│   ├── content/
│   │   ├── blog/             # blog posts (Markdown)
│   │   ├── changelog/        # changelog entries (Markdown)
│   │   └── docs/docs/        # Starlight docs pages (Markdown)
│   ├── content.config.ts     # zod schemas for the blog, changelog, and docs collections
│   ├── layouts/
│   │   └── BaseLayout.astro  # head/meta/OG tags, fonts, skip link, Nav + Footer shell
│   ├── pages/
│   │   ├── index.astro       # marketing homepage
│   │   ├── pricing.astro
│   │   ├── changelog.astro   # renders every changelog entry on one page
│   │   ├── blog/index.astro  # blog listing (featured post + grid)
│   │   ├── blog/[slug].astro # individual post pages
│   │   └── 404.astro
│   └── styles/
│       ├── global.css        # Tailwind 4 @theme tokens + custom utilities
│       └── starlight.css     # Starlight overrides matching the marketing site
└── tsconfig.json
```

Docs pages are routed by Starlight; everything else is a regular Astro page.

## Customizing — brand

The Vega brand is not centralized in a single config value. Rebranding touches each of these files:

| File | What to change |
|---|---|
| `src/components/Logo.astro` | The `vega` wordmark text and the star SVG mark (used in Nav and Footer) |
| `src/layouts/BaseLayout.astro` | Default meta `description` ("Vega is the API platform…") |
| `src/components/Footer.astro` | Company line: "© {year} Vega Labs, Inc. All rights reserved." |
| `astro.config.mjs` | Starlight `title: 'Vega'`, `description`, the `social` GitHub link, and the top-level `site` URL (used for canonical URLs and the OG image) |
| `src/content.config.ts` | Blog schema's `author` default, `'Vega Team'` |
| `public/favicon.svg`, `public/og.png` | Vega-branded assets |

Beyond the chrome, the demo *copy* also references Vega throughout: page `title` props in `src/pages/*.astro` (e.g. "Pricing — Vega"), the home and pricing section components in `src/components/home/` and `src/components/pricing/`, and all sample content in `src/content/`. That copy is meant to be replaced with your own. To find every remaining reference:

```sh
grep -ri vega src astro.config.mjs
```

## Customizing — design tokens

All colors, fonts, and effects are defined as Tailwind 4 `@theme` tokens in `src/styles/global.css` (values live there; `DESIGN.md` documents intent and usage rules). Change a token once and it propagates to the marketing pages, blog, changelog, and docs.

| Token | CSS variable | Use |
|---|---|---|
| `ink` / `ink-2` | `--color-ink`, `--color-ink-2` | page background; alternate sections, footer |
| `panel` / `panel-2` | `--color-panel`, `--color-panel-2` | cards and raised surfaces |
| `line` / `line-2` | `--color-line`, `--color-line-2` | hairline borders; hover state |
| `fg` / `fg-2` / `fg-3` | `--color-fg`, `--color-fg-2`, `--color-fg-3` | headings; body copy; captions and meta |
| `brand` / `brand-bright` | `--color-brand`, `--color-brand-bright` | violet accent |
| `accent` / `accent-bright` | `--color-accent`, `--color-accent-bright` | cyan accent |
| `font-sans` / `font-mono` | `--font-sans`, `--font-mono` | Inter Variable; JetBrains Mono Variable (self-hosted via Fontsource) |

`global.css` also defines four custom utilities: `text-gradient` (violet-to-cyan clipped text), `glass` (translucent panel with hairline and blur), `shadow-glow` (CTA glow), and `ring-line` (inset hairline). `src/styles/starlight.css` maps the same palette onto Starlight's CSS variables so the docs match the marketing site. The theme is dark-only; there is no light mode or theme toggle.

Read `DESIGN.md` before making visual changes — it defines spacing rhythm, card and border conventions, and accessibility requirements.

## Content

Collections are defined in `src/content.config.ts`. Schemas are enforced at build time; a missing required field fails `pnpm build` with a pointer to the offending file.

### Blog posts

Add a Markdown file to `src/content/blog/`. The filename becomes the route: `my-post.md` → `/blog/my-post`. The listing at `/blog` sorts by `pubDate`, newest first.

```md
---
title: 'Post title'                 # required
description: 'One-sentence summary' # required, used for meta tags and cards
pubDate: 2026-06-09                 # required
author: 'Jane Doe'                  # optional, defaults to 'Vega Team'
authorRole: 'Staff Engineer'        # optional
tags: ['launch', 'performance']     # optional, defaults to []
draft: false                        # optional; true hides the post from listing and routes
---

Post body in Markdown.
```

### Changelog entries

Add a Markdown file to `src/content/changelog/`. All entries render on the single `/changelog` page, newest first; the filename is not part of any URL (the demo files use a `YYYY-MM-DD-slug.md` convention for easy sorting in the editor).

```md
---
title: 'Edge caching is GA'   # required
version: 2.0.0                # required, rendered as the entry's version label and anchor
pubDate: 2026-06-02           # required
tags: [feature, improvement]  # optional; allowed values: feature, improvement, fix, breaking
---

Entry body in Markdown.
```

### Docs pages

Add a Markdown file under `src/content/docs/docs/`. Routes derive from the path within `src/content/docs/`: `src/content/docs/docs/guides/edge-caching.md` → `/docs/guides/edge-caching`. Pages use Starlight's standard schema — `title` is required, `description` is recommended, and `sidebar.order` controls position within an autogenerated group:

```md
---
title: Quickstart
description: Deploy your first API in under five minutes.
sidebar:
  order: 1
---
```

The full frontmatter reference is in the [Starlight docs](https://starlight.astro.build/reference/frontmatter/).

## Docs sidebar

The sidebar is configured in `astro.config.mjs` under the Starlight integration. It ships with three groups — Getting started, Guides, API Reference — each autogenerated from a directory:

```js
sidebar: [
  {
    label: 'Getting started',
    items: [{ autogenerate: { directory: 'docs/getting-started' } }],
  },
  // ...
],
```

To add a group, create a directory under `src/content/docs/docs/` and add a matching entry. To pin specific pages instead of autogenerating, see the [Starlight sidebar reference](https://starlight.astro.build/guides/sidebar/).

## Deployment

The site builds to fully static HTML in `dist/` — no server, no adapter required. Set `site` in `astro.config.mjs` to your production URL first so canonical URLs and OG tags resolve correctly.

- **Cloudflare Pages** — build command `pnpm build`, output directory `dist`
- **Netlify** — build command `pnpm build`, publish directory `dist`
- **Vercel** — framework preset Astro, build command `pnpm build`, output directory `dist`

All three detect Node from `engines` in `package.json` or let you set it explicitly; use Node 22.

## License

See `LICENSE` for the terms covering use of this theme.

## Support

Questions or issues with the theme: contact support at the address listed on your purchase receipt.
