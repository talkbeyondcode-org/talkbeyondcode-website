/* Single source for the agent/AEO layer: llms.txt, llms-full.txt and the raw
   per-page Markdown endpoints all render from here. Articles come from the
   content collection; everything else from ../data. Keeping it in one place
   means the machine-readable surface never drifts from the site content. */
import { getCollection } from 'astro:content'
import { creators, episodes, signal, YOUTUBE_URL, CONTACT_EMAIL } from '../data'

export const SITE_URL = 'https://talkbeyondcode.com'
export const SITE_NAME = 'TalkBeyondCode'
export const SITE_TAGLINE = 'Engineering conversations beyond the code'
export const SITE_SUMMARY =
  'TalkBeyondCode is a media channel run by four working engineers. Its flagship podcast, Ctrl+Shift+AI, covers how engineers across stacks and career stages actually use AI in their day-to-day work. Alongside the podcast there are long-form articles and Signal, a running feed of links and short notes.'

export interface PageDef {
  slug: string
  path: string
  title: string
  summary: string
}

/* Canonical page registry. `slug` drives the /<slug>.md endpoints and the
   OG image route; `path` is the real route. */
export const pages: PageDef[] = [
  {
    slug: 'index',
    path: '/',
    title: 'Home',
    summary: 'The channel overview: latest episode, recent writing, the four creators and the Signal feed.',
  },
  {
    slug: 'podcast',
    path: '/podcast',
    title: 'Ctrl+Shift+AI (podcast)',
    summary: 'The flagship podcast and its episode list. New episodes weekly on YouTube.',
  },
  {
    slug: 'articles',
    path: '/articles',
    title: 'Articles',
    summary: 'Long-form writing from the four of us on building with AI.',
  },
  {
    slug: 'signal',
    path: '/signal',
    title: 'Signal',
    summary: 'Links worth your time and short notes on what the channel is reading and arguing about.',
  },
  {
    slug: 'creators',
    path: '/creators',
    title: 'Creators',
    summary: 'The four engineers behind the channel, with their stacks and what they talk about.',
  },
]

function creatorsMd(): string {
  return creators
    .map(
      (c) =>
        `### ${c.name}\n${c.role}. ${c.bio}\n\n- Stack: ${c.stack.join(', ')}\n- Talks about: ${c.talks.join(', ')}\n- LinkedIn: ${c.linkedin}`,
    )
    .join('\n\n')
}

function episodesMd(): string {
  return episodes
    .map((e) => {
      const status = e.live ? `live, watch: ${e.href}` : 'upcoming'
      return `${e.n}. ${e.title} (${status})\n   ${e.meta}`
    })
    .join('\n')
}

async function articlesMd(): Promise<string> {
  const entries = await getCollection('articles', ({ data }) => !data.draft)
  entries.sort(
    (a, b) =>
      Number(b.data.featured) - Number(a.data.featured) ||
      b.data.date.getTime() - a.data.date.getTime(),
  )
  return entries
    .map((e) => {
      const feat = e.data.featured ? 'Featured. ' : ''
      return `- **${e.data.title}** (${feat}${e.data.category}, ${e.data.readingTime})\n  ${e.data.excerpt}\n  ${SITE_URL}/articles/${e.id}`
    })
    .join('\n')
}

function signalMd(): string {
  return signal
    .map((s) => {
      const src = s.source ? ` (${s.source.label}: ${s.source.href})` : ''
      return `- [${s.kind} · ${s.tag} · ${s.date}] ${s.title}${src}\n  ${s.body}`
    })
    .join('\n')
}

/* Clean Markdown for a single page, served at /<slug>.md for AI agents that
   prefer plain text over rendered HTML. */
export async function pageMarkdown(slug: string): Promise<string> {
  const header = (title: string) => `# ${title} · ${SITE_NAME}\n\n`
  switch (slug) {
    case 'index':
      return (
        header(SITE_TAGLINE) +
        `${SITE_SUMMARY}\n\n` +
        `## Podcast\nCtrl+Shift+AI. ${pages[1].summary}\n\n${episodesMd()}\n\n` +
        `## Latest writing\n${await articlesMd()}\n\n` +
        `## Creators\n${creatorsMd()}\n\n` +
        `## Watch\n${YOUTUBE_URL}\n`
      )
    case 'podcast':
      return (
        header('Ctrl+Shift+AI') +
        `Every week we sit down with one engineer, anywhere from junior to staff-plus and on any stack, and get into how AI actually fits their real workflow.\n\nWatch every episode on YouTube: ${YOUTUBE_URL}\n\n## Episodes\n${episodesMd()}\n\nWant to be a guest? Email ${CONTACT_EMAIL}.\n`
      )
    case 'articles':
      return header('Articles: Notes beyond the code') + `${await articlesMd()}\n`
    case 'signal':
      return (
        header('Signal: What the channel is tracking') +
        `Links worth your time and short notes on what we are building, reading and arguing about.\n\n${signalMd()}\n`
      )
    case 'creators':
      return header('Creators: Four engineers, one mic') + `${creatorsMd()}\n`
    default:
      return ''
  }
}

/* Curated llms.txt: short, a one-paragraph summary, then high-value links
   with context. Deliberately not a sitemap dump. */
export function llmsTxt(): string {
  const links = pages
    .map((p) => `- [${p.title}](${SITE_URL}/${p.slug}.md): ${p.summary}`)
    .join('\n')
  return (
    `# ${SITE_NAME}\n\n` +
    `> ${SITE_SUMMARY}\n\n` +
    `## Pages\n${links}\n\n` +
    `## Watch\n- [YouTube channel](${YOUTUBE_URL}): every episode of Ctrl+Shift+AI plus other videos.\n\n` +
    `## Contact\n- Email: ${CONTACT_EMAIL}\n`
  )
}

/* llms-full.txt: the whole readable surface inlined for agents that want one
   fetch. */
export async function llmsFullTxt(): Promise<string> {
  const parts = await Promise.all(pages.map((p) => pageMarkdown(p.slug)))
  return `# ${SITE_NAME}: full content\n\n> ${SITE_SUMMARY}\n\n${parts.join('\n\n---\n\n')}`
}
