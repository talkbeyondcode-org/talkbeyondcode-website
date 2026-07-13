# Publishing articles

Articles and their authors are plain Markdown files in this folder. To publish,
open a pull request against this repo — the site rebuilds and deploys on merge.
The build validates every file against the schema in `src/content.config.ts`, so
a malformed article or a missing author fails CI instead of shipping broken.

## Add an article

1. Create `articles/<slug>.md`. The filename becomes the URL: `/articles/<slug>`.
2. Frontmatter:

   ```md
   ---
   title: "Your title"
   excerpt: "One or two sentences shown on cards and in previews."
   category: "AI in practice"   # or: Engineering culture | Career | Tooling
   author: vivek-raj            # must match a file in contributors/ (the filename)
   coverImage: "/articles/your-cover.jpg"  # optional; omit for the </> plate
   date: 2026-07-02
   readingTime: "8 min read"
   featured: false              # optional; the newest featured post leads the page
   draft: false                 # optional; true hides it from the site + feeds
   ---

   Your article body in Markdown.
   ```

3. Write the body below the frontmatter.

## Add a contributor (guest or team author)

External writers are welcome — you don't have to be one of the four. Add one
frontmatter-only file per person in `contributors/`:

```md
---
name: "Jane Doe"
role: "Staff Engineer @ Acme"
bio: "Optional one-line bio."
avatar: "/contributors/jane.jpg"   # optional; drop the image in public/contributors/
                                    # (public/creators/ is reserved for the four hosts)
linkedin: "https://www.linkedin.com/in/janedoe/"
twitter: "https://x.com/janedoe"     # optional
github: "https://github.com/janedoe" # optional
website: "https://janedoe.dev"       # optional
---
```

The filename (`jane-doe.md` → `jane-doe`) is the id you put in an article's
`author` field. Submit the contributor file and the article in the same PR.

## Signal (the links + notes feed)

Signal items live in `signal/`, one file per item. The frontmatter is the
metadata; **the file body is the note** — our take on why it matters, in our
voice. `kind: Link` requires a `source` (always the primary source, never an
aggregator); `kind: Note` is an original observation with no link.

```md
---
kind: Link                    # or: Note
tag: "AI"                     # AI | Tooling | Career | Workflow | Culture | AI in practice
title: "What happened"
date: 2026-07-13
source:                       # required for Link, omit for Note
  label: "anthropic.com"
  href: "https://www.anthropic.com/..."
draft: true                   # true = hidden from site + feeds; remove to publish
---
Two or three sentences on why this matters and what to do about it.
```

### The weekly digest flow

`scripts/signal/collect.mjs` gathers candidates from the RSS feeds and Hacker
News filters configured in `scripts/signal/sources.json`, dedupes them against
`seen.json` and everything already published, and writes the top ~20 as
`draft: true` files. The Hermes agent runs it weekly and opens a draft PR
(fallback: the "Signal digest" workflow in the Actions tab). To review:

1. **Delete** the files you don't want. `seen.json` (updated in the same PR)
   remembers them, so rejects never resurface.
2. For keepers: **rewrite the note in your own voice** (the generated line is a
   placeholder, never publish it as-is), check the tag, remove `draft: true`.
3. Mark the PR ready and merge. Only non-draft items ship.

Hand-written items (especially `kind: Note`) don't need the pipeline — add a
file directly, any time.
