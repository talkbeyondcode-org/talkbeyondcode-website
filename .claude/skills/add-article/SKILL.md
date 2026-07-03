---
name: add-article
description: Publish a new article to the TalkBeyondCode site from Markdown + images, handling the author, frontmatter, slug, image placement, and build check. Use whenever someone wants to contribute, write, add, or publish an article, blog post, or long-form piece to the website.
---

# Add an article

Guide a contributor through publishing one article. They give you the writing and any images; you handle placement, frontmatter, and validation. They should never need to know where files go.

All paths below are relative to the `website/` project root (the Astro repo). Run everything from there.

## Steps

### 1. Identify the author
List the existing contributors and ask which one is writing:

```
ls src/content/contributors
```

Each filename (minus `.md`) is an author **id** — e.g. `vivek-raj`, `sagar-vemala`. The article's `author` field must be one of these ids exactly.

- **Existing author** → use their id.
- **New author** → create `src/content/contributors/<id>.md` first (see [Add a new contributor](#add-a-new-contributor)). Do this in the same change as the article, or the build fails.

### 2. Collect the article
You need, from the contributor:
- The **title**
- The **body** in Markdown (they can paste it, point to a file, or draft it with you)
- The **category** — must be exactly one of: `AI in practice`, `Engineering culture`, `Career`, `Tooling`
- A one- or two-sentence **excerpt** (write one from the body if they don't supply it)
- Any **images** (a cover image and/or inline images), as file paths

Do **not** put an H1 (`# Title`) at the top of the body — the title comes from frontmatter and the layout renders it. Start the body with the opening paragraph. Use `##`/`###` for section headings.

### 3. Choose the slug
The filename becomes the URL (`/articles/<slug>`). Derive a **kebab-case** slug from the title: lowercase, words separated by hyphens, no punctuation or stop-word padding. Keep it short and readable.

Example: *"Putting a multi-source RAG agent inside Claude"* → `multi-source-rag-agent-in-claude`.

Check it's not already taken: `ls src/content/articles`.

### 4. Place the images
All article images live in `public/articles/` and are referenced with an **absolute path** `/articles/<file>` (the `public/` prefix is dropped at serve time). Use `.webp` when possible (smaller); `.png`/`.jpg` are fine.

- Name images with the slug as a prefix so they stay grouped and unique:
  - Cover: `<slug>.webp`
  - Inline (numbered): `<slug>-01-<short-label>.webp`, `<slug>-02-...`, etc.
- **Copy** (don't move) the contributor's files in:

```
cp "<their-image>" public/articles/<slug>-01-<label>.webp
```

- Reference inline images in the body with `![descriptive alt text](/articles/<slug>-01-<label>.webp)`. Always write real alt text.
- Never delete or overwrite files already in `public/articles/` — only add.

### 5. Write the frontmatter
Create `src/content/articles/<slug>.md`. Frontmatter fields (schema in `src/content.config.ts`):

| Field | Required | Notes |
|-------|----------|-------|
| `title` | yes | Quoted string. |
| `excerpt` | yes | One–two sentences; shown in listings and meta. |
| `category` | yes | One of the four values above, exactly. |
| `author` | yes | A contributor id from step 1. |
| `date` | yes | `YYYY-MM-DD`. Use today's date unless told otherwise. |
| `readingTime` | yes | e.g. `"6 min read"`. Estimate ≈ words ÷ 225, rounded up (`wc -w` on the body). |
| `coverImage` | no | `/articles/<slug>.webp`. Omit if no cover. |
| `featured` | no | `true` pins it to the top of the list. Default `false` — leave off unless asked. |
| `draft` | no | `true` hides it from the site and build output. Use for work-in-progress. |

Template:

```markdown
---
title: "The title here"
excerpt: "One or two sentences that make someone want to read it."
category: "AI in practice"
author: vivek-raj
coverImage: "/articles/the-slug-here.webp"
date: 2026-07-03
readingTime: "6 min read"
---

Opening paragraph of the body — no H1 heading.

## First section

...
```

### 6. Validate
Run the build check — it validates every article against the schema and fails on a bad `category`, a missing field, or an `author` that has no matching contributor file:

```
npm run build
```

If it passes, tell the contributor the article is ready at `/articles/<slug>` and list the files you added.

## Add a new contributor
Create `src/content/contributors/<id>.md` where `<id>` is the kebab-case author id you'll reference. Fields (from `src/content.config.ts`): `name` and `role` are required; `bio`, `avatar`, `linkedin`, `twitter`, `github`, `website` are optional (URLs must be full `https://` links).

Put an avatar image in `public/contributors/` and set `avatar: "/contributors/<id>.jpg"`.

```markdown
---
name: "Full Name"
role: "Title @ Company"
bio: "One or two sentences."
avatar: "/contributors/full-name.jpg"
linkedin: "https://www.linkedin.com/in/handle/"
---
```

## Rules recap
- Article Markdown → `src/content/articles/<slug>.md`; filename = URL slug (kebab-case).
- Images → `public/articles/`, referenced as `/articles/...` (never a `public/`-prefixed or relative path).
- `author` must equal an existing `src/content/contributors/*.md` id; add the contributor in the same change if new.
- `category` is one of exactly four values.
- No H1 in the body.
- Only **add** files in `public/`; never delete or overwrite existing assets.
- Always finish with `npm run build` and only report success if it passes.
