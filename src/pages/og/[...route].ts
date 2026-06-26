import { OGImageRoute } from 'astro-og-canvas'
import { ogPages } from '../../lib/og'

/* Build-time Open Graph images: one branded 1200x630 PNG per page at
   /og/<slug>.png. No runtime cost. */
export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages: ogPages,
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
      title: { color: [255, 255, 255], size: 76, weight: 'Bold' },
      description: { color: [176, 188, 212], size: 34, lineHeight: 1.4 },
    },
  }),
})
