#!/usr/bin/env node
/* Signal collector: gathers candidate items for the weekly Signal digest.
   Zero dependencies — runs with plain `node scripts/signal/collect.mjs` from
   the repo root, no npm install needed (Node 20+).

   Pipeline: fetch RSS/Atom feeds + Hacker News front page → dedupe against
   seen.json and already-published items → rank → (optionally) draft one-line
   summaries with Claude → write candidate Markdown files into
   src/content/signal/ with `draft: true` so nothing ships until a human edits
   the note and removes the draft flag.

   This script only writes files. Branching, committing and opening the PR is
   the caller's job (Hermes, GitHub Actions, or you locally) — see the step in
   .github/workflows/signal-digest.yml. If it finds nothing new it writes
   nothing, so callers can use `git status --porcelain` to decide whether a PR
   is worth opening.

   Env:
     ANTHROPIC_API_KEY  optional — enables Claude-drafted placeholder summaries
     DAYS               look-back window for feed items (default 7)
     MAX_CANDIDATES     cap on candidates written (default 20)
     PR_BODY_PATH       where to write the PR body markdown
                        (default scripts/signal/.pr-body.md, gitignored)

   Output: candidate .md files + updated seen.json + PR body file. stdout is a
   compact numbered list of candidates, ready to paste into Telegram; all
   operational logging goes to stderr. */

import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const CONTENT_DIR = path.join(ROOT, 'src', 'content', 'signal')
const SOURCES_PATH = path.join(ROOT, 'scripts', 'signal', 'sources.json')
const SEEN_PATH = path.join(ROOT, 'scripts', 'signal', 'seen.json')
const PR_BODY_PATH = process.env.PR_BODY_PATH || path.join(ROOT, 'scripts', 'signal', '.pr-body.md')

const DAYS = Number(process.env.DAYS) || 7
const MAX_CANDIDATES = Number(process.env.MAX_CANDIDATES) || 20
const SEEN_TTL_DAYS = 180
const FETCH_TIMEOUT_MS = 15_000
const UA = 'TalkBeyondCode signal collector (https://talkbeyondcode.com)'

const log = (...args) => console.error(...args)

/* ── small utilities ─────────────────────────────────────────────────── */

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }

function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m)
}

function stripHtml(s) {
  return decodeEntities(s.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim()
}

function unwrapCdata(s) {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
}

/* Canonical form used only for dedupe — the original URL is what gets
   published. Drops tracking params, www, trailing slash and hash. */
function normalizeUrl(raw) {
  try {
    const u = new URL(raw)
    const host = u.hostname.toLowerCase().replace(/^www\./, '')
    const params = [...u.searchParams.keys()].filter(
      (k) => /^utm_/i.test(k) || ['ref', 'ref_src', 'fbclid', 'gclid', 'source', 'mc_cid'].includes(k),
    )
    params.forEach((k) => u.searchParams.delete(k))
    const search = u.searchParams.toString()
    const pathname = u.pathname.replace(/\/$/, '')
    return `${host}${pathname}${search ? `?${search}` : ''}`
  } catch {
    return raw
  }
}

function yamlString(s) {
  return `'${String(s).replace(/'/g, "''")}'`
}

function slugify(title) {
  return (
    title
      .toLowerCase()
      .replace(/[’'"“”]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60)
      .replace(/-+$/, '') || 'item'
  )
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'user-agent': UA },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}

async function fetchJson(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

/* ── feed parsing (RSS 2.0 + Atom, regex-based on purpose) ───────────── */

function firstTag(block, names) {
  for (const name of names) {
    const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'))
    if (m) return unwrapCdata(m[1]).trim()
  }
  return ''
}

function atomLink(block) {
  /* Prefer rel="alternate", fall back to the first link with an href. */
  const links = [...block.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0])
  const pickHref = (tag) => tag.match(/href=["']([^"']+)["']/i)?.[1] ?? ''
  const alternate = links.find((l) => /rel=["']alternate["']/i.test(l)) || links.find((l) => !/rel=/i.test(l))
  return alternate ? pickHref(alternate) : links.length ? pickHref(links[0]) : ''
}

function parseFeed(xml) {
  const blocks =
    [...xml.matchAll(/<item[\s>][\s\S]*?<\/item>/gi)].length > 0
      ? [...xml.matchAll(/<item[\s>][\s\S]*?<\/item>/gi)].map((m) => m[0])
      : [...xml.matchAll(/<entry[\s>][\s\S]*?<\/entry>/gi)].map((m) => m[0])

  return blocks
    .map((block) => {
      const title = stripHtml(firstTag(block, ['title']))
      let link = firstTag(block, ['link'])
      if (!link || !/^https?:\/\//.test(link)) link = atomLink(block)
      const dateRaw = firstTag(block, ['pubDate', 'published', 'updated', 'dc:date'])
      const date = dateRaw ? new Date(dateRaw) : null
      const excerpt = stripHtml(firstTag(block, ['description', 'summary', 'content:encoded', 'content'])).slice(0, 280)
      return { title, url: link, date, excerpt }
    })
    .filter((i) => i.title && /^https?:\/\//.test(i.url) && i.date && !Number.isNaN(i.date.valueOf()))
}

/* ── collectors ──────────────────────────────────────────────────────── */

async function collectFeeds(config, sinceMs, errors) {
  const results = await Promise.allSettled(
    config.feeds.map(async (feed) => {
      const xml = await fetchText(feed.url)
      const items = parseFeed(xml).filter((i) => i.date.valueOf() >= sinceMs)
      return items.map((i) => ({ ...i, via: { type: 'feed', name: feed.name, tag: feed.tag, weight: feed.weight ?? 1 } }))
    }),
  )
  return results.flatMap((r, idx) => {
    if (r.status === 'fulfilled') return r.value
    errors.push(`${config.feeds[idx].name}: ${r.reason?.message ?? r.reason}`)
    return []
  })
}

async function collectHackerNews(config, sinceMs, errors) {
  const { minPoints, bigStoryPoints, keywords } = config.hackerNews
  const patterns = keywords.map((kw) => new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'))
  try {
    const ids = (await fetchJson('https://hacker-news.firebaseio.com/v0/topstories.json')).slice(0, 120)
    const stories = []
    for (let i = 0; i < ids.length; i += 24) {
      const batch = await Promise.allSettled(
        ids.slice(i, i + 24).map((id) => fetchJson(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)),
      )
      stories.push(...batch.filter((r) => r.status === 'fulfilled').map((r) => r.value))
    }
    return stories
      .filter(
        (s) =>
          s &&
          s.type === 'story' &&
          s.url &&
          s.time * 1000 >= sinceMs &&
          (s.score >= bigStoryPoints || (s.score >= minPoints && patterns.some((p) => p.test(s.title)))),
      )
      .map((s) => ({
        title: s.title,
        url: s.url,
        date: new Date(s.time * 1000),
        excerpt: '',
        via: { type: 'hn', points: s.score, comments: `https://news.ycombinator.com/item?id=${s.id}` },
      }))
  } catch (err) {
    errors.push(`Hacker News: ${err.message}`)
    return []
  }
}

/* ── dedupe + rank ───────────────────────────────────────────────────── */

async function publishedUrls() {
  if (!existsSync(CONTENT_DIR)) return new Set()
  const urls = new Set()
  for (const file of await readdir(CONTENT_DIR)) {
    if (!file.endsWith('.md')) continue
    const text = await readFile(path.join(CONTENT_DIR, file), 'utf8')
    const href = text.match(/^\s*href:\s*(\S+)/m)?.[1]
    if (href) urls.add(normalizeUrl(href))
  }
  return urls
}

function mergeAndRank(items, seenUrls, published) {
  const byUrl = new Map()
  for (const item of items) {
    const key = normalizeUrl(item.url)
    if (seenUrls.has(key) || published.has(key)) continue
    const existing = byUrl.get(key)
    if (existing) existing.via.push(item.via)
    else byUrl.set(key, { ...item, key, via: [item.via] })
  }
  const candidates = [...byUrl.values()].map((c) => {
    const feedScore = c.via.filter((v) => v.type === 'feed').reduce((n, v) => n + v.weight * 100, 0)
    const hnScore = c.via.filter((v) => v.type === 'hn').reduce((n, v) => n + v.points, 0)
    const crossBoost = c.via.length > 1 ? 150 : 0
    return { ...c, score: feedScore + hnScore + crossBoost }
  })
  return candidates.sort((a, b) => b.score - a.score).slice(0, MAX_CANDIDATES)
}

/* ── Claude drafting (optional) ──────────────────────────────────────── */

async function draftSummaries(candidates, tags) {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) {
    log('ANTHROPIC_API_KEY not set — using feed excerpts as placeholder notes.')
    return null
  }
  const input = candidates.map((c, i) => ({
    i,
    title: c.title,
    source: new URL(c.url).hostname,
    excerpt: c.excerpt || undefined,
  }))
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      signal: AbortSignal.timeout(60_000),
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2500,
        system:
          'You pre-process items for a curated engineering news digest. For each item, write a neutral, factual one-line summary (max 25 words, no hype, no adjectives like "exciting") and pick the best-fitting tag. Your summaries are placeholders that a human editor rewrites — do not editorialize. Respond with ONLY a JSON array: [{"i": 0, "summary": "...", "tag": "..."}] covering every item.',
        messages: [
          {
            role: 'user',
            content: `Allowed tags: ${JSON.stringify(tags)}\n\nItems:\n${JSON.stringify(input, null, 2)}`,
          },
        ],
      }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`)
    const data = await res.json()
    const text = data.content?.map((b) => b.text ?? '').join('') ?? ''
    const json = text.slice(text.indexOf('['), text.lastIndexOf(']') + 1)
    const drafts = new Map()
    for (const d of JSON.parse(json)) {
      drafts.set(d.i, { summary: String(d.summary ?? '').trim(), tag: tags.includes(d.tag) ? d.tag : null })
    }
    return drafts
  } catch (err) {
    log(`Claude drafting failed (${err.message}) — falling back to feed excerpts.`)
    return null
  }
}

/* ── output ──────────────────────────────────────────────────────────── */

function candidateMarkdown(c, tag, note, dateStr) {
  const host = new URL(c.url).hostname.replace(/^www\./, '')
  return [
    '---',
    'kind: Link',
    `tag: ${yamlString(tag)}`,
    `title: ${yamlString(c.title)}`,
    `date: ${dateStr}`,
    'source:',
    `  label: ${yamlString(host)}`,
    `  href: ${yamlString(c.url)}`,
    'draft: true',
    '---',
    note || '(no summary available — write the note before publishing)',
    '',
  ].join('\n')
}

function describeVia(c) {
  return c.via
    .map((v) => (v.type === 'hn' ? `HN ${v.points} pts` : v.name))
    .join(' + ')
}

async function main() {
  const config = JSON.parse(await readFile(SOURCES_PATH, 'utf8'))
  const seen = JSON.parse(await readFile(SEEN_PATH, 'utf8'))
  const now = new Date()
  const sinceMs = now.valueOf() - DAYS * 86_400_000
  const today = now.toISOString().slice(0, 10)
  const errors = []

  log(`Collecting signal candidates (last ${DAYS} days)…`)
  const [feedItems, hnItems, published] = await Promise.all([
    collectFeeds(config, sinceMs, errors),
    collectHackerNews(config, sinceMs, errors),
    publishedUrls(),
  ])
  log(`Fetched ${feedItems.length} feed items, ${hnItems.length} HN stories.`)

  const seenUrls = new Set(Object.keys(seen.urls))
  const candidates = mergeAndRank([...feedItems, ...hnItems], seenUrls, published)

  if (candidates.length === 0) {
    log('No new candidates this week — nothing written.')
    if (errors.length) log(`Source errors:\n  ${errors.join('\n  ')}`)
    console.log(`Signal ${today}: no new candidates this week.`)
    return
  }

  const drafts = await draftSummaries(candidates, config.tags)

  await mkdir(CONTENT_DIR, { recursive: true })
  const written = []
  for (const [i, c] of candidates.entries()) {
    const draft = drafts?.get(i)
    const feedTag = c.via.find((v) => v.type === 'feed')?.tag
    const tag = draft?.tag || feedTag || 'AI'
    const note = draft?.summary || c.excerpt
    const dateStr = c.date.toISOString().slice(0, 10)
    let file = `${dateStr}-${slugify(c.title)}.md`
    if (existsSync(path.join(CONTENT_DIR, file))) file = file.replace(/\.md$/, `-${i}.md`)
    await writeFile(path.join(CONTENT_DIR, file), candidateMarkdown(c, tag, note, dateStr))
    written.push({ ...c, tag, note, file })
  }

  /* Record every surfaced URL — including future rejects — and prune old
     entries so the file doesn't grow forever. */
  const cutoff = now.valueOf() - SEEN_TTL_DAYS * 86_400_000
  for (const [url, date] of Object.entries(seen.urls)) {
    if (new Date(date).valueOf() < cutoff) delete seen.urls[url]
  }
  for (const c of written) seen.urls[c.key] = today
  await writeFile(SEEN_PATH, JSON.stringify(seen, null, 2) + '\n')

  const prBody = [
    `## Signal candidates — week of ${today}`,
    '',
    `${written.length} candidates. All are \`draft: true\` — **nothing ships until you edit it.**`,
    '',
    'Review flow:',
    '1. Delete the files of candidates you don\'t want (seen.json already remembers them — they won\'t come back).',
    '2. For keepers: rewrite the note **in your own voice**, check the tag, then remove `draft: true`.',
    '3. Mark ready for review and merge. Vercel rebuilds; only non-draft items ship.',
    '',
    '| # | Candidate | Via | Score | Tag | File |',
    '|---|-----------|-----|-------|-----|------|',
    ...written.map(
      (c, i) =>
        `| ${i + 1} | [${c.title.replace(/\|/g, '\\|')}](${c.url}) | ${describeVia(c)} | ${c.score} | ${c.tag} | \`${c.file}\` |`,
    ),
    ...(errors.length ? ['', '### Source errors this run', '', ...errors.map((e) => `- ${e}`)] : []),
    '',
  ].join('\n')
  await writeFile(PR_BODY_PATH, prBody)

  /* stdout = Telegram-ready digest. */
  const lines = [`Signal candidates — ${today} (${written.length})`, '']
  for (const [i, c] of written.entries()) {
    lines.push(`${i + 1}. ${c.title} [${c.tag}] — ${describeVia(c)}`, `   ${c.url}`)
  }
  if (errors.length) lines.push('', `⚠ ${errors.length} source(s) failed: ${errors.map((e) => e.split(':')[0]).join(', ')}`)
  console.log(lines.join('\n'))

  log(`\nWrote ${written.length} candidate files to src/content/signal/, updated seen.json, PR body at ${PR_BODY_PATH}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
