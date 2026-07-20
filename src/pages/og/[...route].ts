import type { APIRoute, GetStaticPaths } from 'astro'
import { getCollection } from 'astro:content'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ogPages } from '../../lib/og'

/* Build-time Open Graph images: one branded 1200x630 PNG per page at
   /og/<slug>.png, plus one per article at /og/articles/<slug>.png so link
   previews (LinkedIn, X, Slack, WhatsApp) show the page, not a generic card.

   Hand-built with satori + resvg in the site's own design language
   (DESIGN.md): blue-black field, hairline spec-sheet grid, Martian Mono
   readout layer, Bricolage display type, the TBC mark, and the brand-gradient
   oscilloscope trace. No runtime cost. */

const W = 1200
const H = 630
const M = 64 // frame margin — the hairline rules sit here

/* ── Palette (hex equivalents of the site's OKLCH tokens) ─────────────── */
const BG = '#0a0e17'
const BG_TOP = '#0d1220'
const INK = '#f1f4fa'
const MUTED = '#96a1ba'
const LINE = 'rgba(148,163,199,0.16)'
const CYAN = '#22d3ee'
const VIOLET = '#8b5cf6'
const MAGENTA = '#e879f9'

/* ── Fonts (static woff files; satori can't take the variable woff2) ──── */
const fontFile = (pkg: string, file: string) =>
  readFile(path.join(process.cwd(), 'node_modules', pkg, 'files', file))

const [bricolage700, bricolage500, martian400, martian700] = await Promise.all([
  fontFile('@fontsource/bricolage-grotesque', 'bricolage-grotesque-latin-700-normal.woff'),
  fontFile('@fontsource/bricolage-grotesque', 'bricolage-grotesque-latin-500-normal.woff'),
  fontFile('@fontsource/martian-mono', 'martian-mono-latin-400-normal.woff'),
  fontFile('@fontsource/martian-mono', 'martian-mono-latin-700-normal.woff'),
])

/* ── The oscilloscope trace: calm line, one active burst, decay ───────── */
function tracePath(): string {
  const width = W
  const base = 0.55 // fraction of trace-box height
  const boxH = 150
  const pts: [number, number][] = []
  for (let x = 0; x <= width; x += 6) {
    const t = x / width
    // envelope: quiet → burst around 62% → quiet (burst sits under the text's
    // right edge, away from the title which is left-aligned)
    const burst = Math.exp(-Math.pow((t - 0.62) / 0.1, 2))
    const ripple = Math.exp(-Math.pow((t - 0.2) / 0.16, 2)) * 0.18
    const y =
      base * boxH +
      Math.sin(t * 95) * 34 * burst +
      Math.sin(t * 31 + 1.4) * 14 * burst +
      Math.sin(t * 55) * 9 * ripple * boxH * 0.06 +
      Math.sin(t * 13) * 2.2
    pts.push([x, y])
  }
  return 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')
}

const TRACE = tracePath()

const traceSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="150" viewBox="0 0 ${W} 150">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="${W}" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${CYAN}"/>
      <stop offset="0.55" stop-color="${VIOLET}"/>
      <stop offset="1" stop-color="${MAGENTA}"/>
    </linearGradient>
  </defs>
  <path d="${TRACE}" fill="none" stroke="url(#g)" stroke-width="14" stroke-opacity="0.10" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="${TRACE}" fill="none" stroke="url(#g)" stroke-width="7" stroke-opacity="0.22" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="${TRACE}" fill="none" stroke="url(#g)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
</svg>`

/* ── The TBC mark (exact vector from TbcMark.astro, white bars for dark bg) */
const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="152" height="104" viewBox="0 0 152 104" fill="none">
  <defs>
    <linearGradient id="l" x1="8" y1="8" x2="78.4" y2="43.2" gradientUnits="userSpaceOnUse">
      <stop stop-color="#35C4DA"/><stop offset="0.55" stop-color="#6F3FDB"/><stop offset="1" stop-color="#DA4BF0"/>
    </linearGradient>
    <linearGradient id="r" x1="100" y1="8" x2="170.4" y2="43.2" gradientUnits="userSpaceOnUse">
      <stop stop-color="#35C4DA"/><stop offset="0.55" stop-color="#6F3FDB"/><stop offset="1" stop-color="#DA4BF0"/>
    </linearGradient>
  </defs>
  <path d="M52 8L8 52L52 96" stroke="url(#l)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M100 8L144 52L100 96" stroke="url(#r)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M56 36V68" stroke="#F8FAFC" stroke-width="13" stroke-linecap="round"/>
  <path d="M76 18V86" stroke="#F8FAFC" stroke-width="13" stroke-linecap="round"/>
  <path d="M96 36V68" stroke="#F8FAFC" stroke-width="13" stroke-linecap="round"/>
</svg>`

const svgUri = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg)}`

/* ── Tiny hyperscript so the template below stays readable ────────────── */
type El = { type: string; props: Record<string, unknown> }
const h = (type: string, style: Record<string, unknown>, children?: unknown): El => ({
  type,
  props: { style, children },
})
const img = (src: string, style: Record<string, unknown>): El => ({
  type: 'img',
  props: { src, style },
})

function card(page: { title: string; description: string; kicker: string; path: string }): El {
  const titleSize = page.title.length > 64 ? 54 : page.title.length > 36 ? 64 : 78

  const rule = (style: Record<string, unknown>) =>
    h('div', { position: 'absolute', backgroundColor: LINE, ...style })

  return h(
    'div',
    {
      width: W,
      height: H,
      display: 'flex',
      flexDirection: 'column',
      backgroundImage: `linear-gradient(180deg, ${BG_TOP} 0%, ${BG} 100%)`,
      fontFamily: 'Bricolage',
      position: 'relative',
    },
    [
      /* spec-sheet grid: full-bleed hairlines at the frame margins */
      rule({ left: M, top: 0, width: 1, height: H }),
      rule({ right: M, top: 0, width: 1, height: H }),
      rule({ left: 0, top: M + 58, width: W, height: 1 }),
      rule({ left: 0, bottom: M + 96, width: W, height: 1 }),

      /* instrument tick crosses at the rule intersections */
      ...[
        { x: M, y: M + 58 },
        { x: W - M, y: M + 58 },
        { x: M, y: H - M - 96 },
        { x: W - M, y: H - M - 96 },
      ].flatMap(({ x, y }) => [
        h('div', {
          position: 'absolute',
          left: x - 5,
          top: y,
          width: 11,
          height: 1,
          backgroundColor: 'rgba(148,163,199,0.45)',
        }),
        h('div', {
          position: 'absolute',
          left: x,
          top: y - 5,
          width: 1,
          height: 11,
          backgroundColor: 'rgba(148,163,199,0.45)',
        }),
      ]),

      /* oscilloscope trace, full bleed across the bottom band */
      img(svgUri(traceSvg), { position: 'absolute', left: 0, bottom: M - 20, width: W, height: 150 }),

      /* header: mark + wordmark | page path readout */
      h(
        'div',
        {
          position: 'absolute',
          left: M + 40,
          right: M + 40,
          top: M - 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        [
          h(
            'div',
            { display: 'flex', alignItems: 'center', gap: 18 },
            [
              img(svgUri(markSvg), { width: 53, height: 36 }),
              h(
                'div',
                { fontSize: 27, fontWeight: 700, color: INK, letterSpacing: '-0.02em' },
                'TalkBeyondCode'
              ),
            ]
          ),
          h(
            'div',
            {
              fontFamily: 'Martian Mono',
              fontSize: 15,
              color: MUTED,
              letterSpacing: '0.08em',
            },
            `TALKBEYONDCODE.COM${page.path.toUpperCase()}`
          ),
        ]
      ),

      /* main block: kicker / title / description */
      h(
        'div',
        {
          position: 'absolute',
          left: M + 40,
          right: M + 40,
          top: M + 58,
          bottom: M + 96,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        },
        [
          h(
            'div',
            { display: 'flex', alignItems: 'center', gap: 14 },
            [
              h(
                'div',
                {
                  width: 30,
                  height: 5,
                  borderRadius: 3,
                  backgroundImage: `linear-gradient(90deg, ${CYAN}, ${VIOLET}, ${MAGENTA})`,
                },
                undefined
              ),
              h(
                'div',
                {
                  fontFamily: 'Martian Mono',
                  fontSize: 17,
                  fontWeight: 700,
                  color: CYAN,
                  letterSpacing: '0.16em',
                },
                page.kicker
              ),
            ]
          ),
          h(
            'div',
            {
              marginTop: 26,
              fontSize: titleSize,
              fontWeight: 700,
              color: INK,
              letterSpacing: '-0.025em',
              lineHeight: 1.06,
              maxWidth: 980,
              lineClamp: 3,
            },
            page.title
          ),
          page.description
            ? h(
                'div',
                {
                  marginTop: 24,
                  fontSize: 27,
                  fontWeight: 500,
                  color: MUTED,
                  lineHeight: 1.4,
                  maxWidth: 900,
                  lineClamp: 3,
                },
                page.description
              )
            : h('div', { display: 'none' }, undefined),
        ]
      ),

      /* footer readout, under the bottom rule */
      h(
        'div',
        {
          position: 'absolute',
          left: M + 40,
          right: M + 40,
          bottom: M - 42,
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'Martian Mono',
          fontSize: 13,
          color: MUTED,
          letterSpacing: '0.14em',
        },
        [
          h('div', {}, 'ENGINEERING CONVERSATIONS BEYOND THE CODE'),
          h('div', {}, 'CTRL+SHIFT+AI'),
        ]
      ),
    ]
  )
}

/* ── Route ────────────────────────────────────────────────────────────── */
const articles = await getCollection('articles', ({ data }) => !data.draft)

const pages: Record<string, { title: string; description: string; kicker: string; path: string }> =
  {
    ...Object.fromEntries(
      Object.entries(ogPages).map(([key, p]) => [
        key,
        { ...p, path: key === 'index' ? '' : `/${key}` },
      ])
    ),
    ...Object.fromEntries(
      articles.map((entry) => [
        `articles/${entry.id}`,
        {
          title: entry.data.title,
          description: entry.data.excerpt,
          kicker: 'ARTICLE',
          path: '/articles',
        },
      ])
    ),
  }

export const getStaticPaths: GetStaticPaths = () =>
  Object.keys(pages).map((key) => ({ params: { route: `${key}.png` }, props: { key } }))

export const GET: APIRoute = async ({ props }) => {
  const page = pages[(props as { key: string }).key]

  const svg = await satori(card(page) as never, {
    width: W,
    height: H,
    fonts: [
      { name: 'Bricolage', data: bricolage700, weight: 700, style: 'normal' },
      { name: 'Bricolage', data: bricolage500, weight: 500, style: 'normal' },
      { name: 'Martian Mono', data: martian400, weight: 400, style: 'normal' },
      { name: 'Martian Mono', data: martian700, weight: 700, style: 'normal' },
    ],
  })

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng()

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
