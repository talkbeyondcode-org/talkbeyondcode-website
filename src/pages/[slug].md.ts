import type { APIRoute, GetStaticPaths } from 'astro'
import { pages, pageMarkdown } from '../lib/content'

/* Raw Markdown twin of each page (/podcast.md, /articles.md, …). AI agents
   and tools that prefer plain text over rendered HTML fetch these. */
export const getStaticPaths: GetStaticPaths = () =>
  pages.map((p) => ({ params: { slug: p.slug } }))

export const GET: APIRoute = async ({ params }) => {
  const body = await pageMarkdown(String(params.slug))
  if (!body) return new Response('Not found', { status: 404 })
  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
