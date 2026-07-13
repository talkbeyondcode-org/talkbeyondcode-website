import { defineCollection, reference } from 'astro:content'
import { z } from 'astro:schema'
import { glob } from 'astro/loaders'

/* Contributors are the people an article can be attributed to — the four of us
   or an external guest writer. Each is one frontmatter-only Markdown file in
   src/content/contributors/*.md; the filename is the id an article references
   via its `author` field. To add a writer, drop in a new file here (name,
   role, avatar, socials) in the same PR as their article. */
const contributors = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/contributors' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string().optional(),
    avatar: z.string().optional(),
    linkedin: z.string().url().optional(),
    twitter: z.string().url().optional(),
    github: z.string().url().optional(),
    website: z.string().url().optional(),
  }),
})

/* Articles live as Markdown in src/content/articles/*.md. Edit those files on
   GitHub to publish (a new file = a new article); the build validates each
   one against this schema, so a malformed post fails the build instead of
   shipping broken. `author` must match a contributors/<id>.md file. */
const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    category: z.enum(['AI in practice', 'Engineering culture', 'Career', 'Tooling', 'Architecture']),
    author: reference('contributors'),
    coverImage: z.string().optional(),
    date: z.coerce.date(),
    readingTime: z.string(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
})

/* Signal items are the curated links+notes feed. One Markdown file per item in
   src/content/signal/*.md: frontmatter carries the metadata, the file body is
   the note — our take on why it matters, written in our voice. `kind: Link`
   requires a `source` (we always point at the primary source); `kind: Note` is
   an original observation from the channel. The weekly collector script
   (scripts/signal/collect.mjs) opens PRs with candidate items marked
   `draft: true`; flipping that to false (or removing it) is the publish step,
   so an unedited candidate can never ship by accident. */
const signal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/signal' }),
  schema: z
    .object({
      kind: z.enum(['Link', 'Note']),
      tag: z.string(),
      title: z.string(),
      date: z.coerce.date(),
      source: z.object({ label: z.string(), href: z.string().url() }).optional(),
      draft: z.boolean().default(false),
    })
    .refine((item) => item.kind === 'Note' || item.source !== undefined, {
      message: 'A Link item must have a source — always cite the primary source.',
    }),
})

export const collections = { articles, contributors, signal }
