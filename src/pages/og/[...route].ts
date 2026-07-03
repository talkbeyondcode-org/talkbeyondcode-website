import { OGImageRoute } from 'astro-og-canvas'
import { getCollection } from 'astro:content'
import { ogPages } from '../../lib/og'

/* Build-time Open Graph images: one branded 1200x630 PNG per page at
   /og/<slug>.png, plus one per article at /og/articles/<slug>.png so
   link previews (LinkedIn, X, Slack) show the article, not the generic
   Articles card. No runtime cost. */
const articles = await getCollection('articles', ({ data }) => !data.draft)

const pages: Record<string, { title: string; description: string }> = {
  ...ogPages,
  ...Object.fromEntries(
    articles.map((entry) => [
      `articles/${entry.id}`,
      { title: entry.data.title, description: entry.data.excerpt },
    ])
  ),
}

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [
      [12, 16, 34],
      [33, 19, 64],
    ],
    border: { color: [124, 58, 237], width: 20, side: 'inline-start' },
    padding: 70,
    font: {
      title: {
        color: [255, 255, 255],
        size: page.title.length > 60 ? 52 : 76,
        weight: 'Bold',
        lineHeight: 1.15,
      },
      description: { color: [176, 188, 212], size: 34, lineHeight: 1.4 },
    },
  }),
})
