import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { getCollection } from 'astro:content'
import { episodes } from '../data'

export async function GET(context: APIContext) {
  const site = context.site?.toString() ?? 'https://talkbeyondcode.com'

  const articleEntries = (await getCollection('articles', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  )

  const items = [
    ...articleEntries.map((a) => ({
      title: a.data.title,
      description: a.data.excerpt,
      link: new URL(`/articles/${a.id}`, site).href,
      pubDate: a.data.date,
    })),
    ...episodes.map((e) => ({
      title: `Ctrl+Shift+AI: ${e.title}`,
      description: e.meta,
      link: new URL('/podcast', site).href,
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
