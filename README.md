# TalkBeyondCode

Marketing site for **TalkBeyondCode**, a content brand by four working engineers, and home of the **Ctrl+Shift+AI** podcast.

## Stack

- **Vite** + **React** + **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/vite`, no PostCSS/config file)
- **React Router** (data router)
- **Three.js** / **React Three Fiber** — the hero oscilloscope
- **GSAP** — scroll/entry motion
- Fonts: **Bricolage Grotesque** (display/body) + **Martian Mono** (labels) via Fontsource

## Design

The visual system ("engineering instrument" aesthetic) is documented in [`DESIGN.md`](./DESIGN.md); brand/voice in [`PRODUCT.md`](./PRODUCT.md).

## Develop

Requires **Node 20.19+ / 22.12+** (see `.nvmrc`).

```bash
nvm use         # picks Node 22.18.0
npm install
npm run dev      # http://localhost:5173
```

## Build

```bash
npm run build    # type-checks, then builds to dist/
npm run preview  # serve the production build locally
```

## Deploy

Configured for SPA hosting (`vercel.json` rewrites + `public/_redirects` for Netlify), so client-side routes resolve on hard refresh. Deployed on Vercel.
