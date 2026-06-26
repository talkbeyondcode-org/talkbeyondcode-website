import { defineCollection } from 'astro:content'
import { z } from 'astro:schema'
import { glob } from 'astro/loaders'

/* Articles live as Markdown in src/content/articles/*.md. Edit those files on
   GitHub to publish (a new file = a new article); the build validates each
   one against this schema, so a malformed post fails the build instead of
   shipping broken. */
const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    category: z.enum(['AI in practice', 'Engineering culture', 'Career', 'Tooling']),
    author: z.string().default('TalkBeyondCode'),
    date: z.coerce.date(),
    readingTime: z.string(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
})

export const collections = { articles }
