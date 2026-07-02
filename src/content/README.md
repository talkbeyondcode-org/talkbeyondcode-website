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
avatar: "/creators/jane.jpg"   # optional; drop the image in public/creators/
linkedin: "https://www.linkedin.com/in/janedoe/"
twitter: "https://x.com/janedoe"     # optional
github: "https://github.com/janedoe" # optional
website: "https://janedoe.dev"       # optional
---
```

The filename (`jane-doe.md` → `jane-doe`) is the id you put in an article's
`author` field. Submit the contributor file and the article in the same PR.
