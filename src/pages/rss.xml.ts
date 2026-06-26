import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { articles, episodes } from '../data'

export function GET(context: APIContext) {
  const site = context.site?.toString() ?? 'https://talkbeyondcode.com'

  const items = [
    ...episodes.map((e) => ({
      title: `Ctrl+Shift+AI: ${e.title}`,
      description: e.meta,
      link: new URL('/podcast', site).href,
    })),
    ...articles.map((a) => ({
      title: a.title,
      description: a.excerpt,
      link: new URL('/articles', site).href,
    })),
  ]

  return rss({
    title: 'TalkBeyondCode',
    description:
      'Engineer-to-engineer conversations on software and AI adoption. Episodes, articles and signal from four working engineers.',
    site,
    items,
  })
}
