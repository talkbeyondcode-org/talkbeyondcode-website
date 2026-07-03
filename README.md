# TalkBeyondCode

Marketing site for **TalkBeyondCode**, a content brand by four working engineers, and home of the **Ctrl+Shift+AI** podcast.

## Stack

- **Astro 7** — static output (`output: 'static'`), content collections, file-based routing
- **React 19** islands (via `@astrojs/react`) — the interactive bits, notably the hero
- **Three.js** / **React Three Fiber** — the hero oscilloscope
- **GSAP** (`@gsap/react`) — scroll/entry motion
- **Tailwind CSS v4** (via `@tailwindcss/vite`, no PostCSS/config file)
- **Sitemap** + **RSS** via `@astrojs/sitemap` and `@astrojs/rss`
- **OG images** generated at build with `astro-og-canvas`
- Fonts (variable, via Fontsource): **Space Grotesk** (display), **Inter** (body), **JetBrains Mono** (labels/mono)

## Content

Articles and their authors are Markdown files under `src/content/`, validated at
build time against the schema in [`src/content.config.ts`](./src/content.config.ts):

- `src/content/articles/*.md` — one file per article; the filename is the URL slug.
- `src/content/contributors/*.md` — one frontmatter-only file per author; the filename is the id an article's `author` field references.
- Article images live in `public/articles/`, referenced as `/articles/...`.

To publish, follow [`src/content/README.md`](./src/content/README.md), or run the
**`add-article`** skill (in `.claude/skills/`), which walks a contributor through
author, frontmatter, slug, image placement, and the build check.

### AI / AEO layer

The site exposes a machine-readable surface for AI agents, all rendered from
[`src/lib/content.ts`](./src/lib/content.ts): `/llms.txt`, `/llms-full.txt`, and
per-page `/<slug>.md` endpoints, plus `/rss.xml`.

## Design

The visual system ("engineering instrument" aesthetic) is documented in [`DESIGN.md`](./DESIGN.md); brand/voice in [`PRODUCT.md`](./PRODUCT.md).

## Develop

Requires **Node 22** (see `.nvmrc`, pinned to 22.18.0).

```bash
nvm use          # picks Node 22.18.0
npm install
npm run dev      # http://localhost:4321
```

## Build

```bash
npm run build    # astro check (type + content validation), then builds to dist/
npm run preview  # serve the production build locally
npm run lint     # eslint
```

## Deploy

Static build (`dist/`) deployed on **Vercel**. Since the output is fully static,
routes resolve on hard refresh without SPA rewrites.
