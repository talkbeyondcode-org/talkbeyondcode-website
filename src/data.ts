export const YOUTUBE_URL = 'https://www.youtube.com/@TalkBeyondCode'
export const WATCH_EP1_URL = 'https://youtu.be/wDLA1Qlw_Ds'
export const CONTACT_EMAIL = 'talkbeyondcode@gmail.com'

/* ── Creators ────────────────────────────────────────────────────────── */
export type Creator = {
  name: string
  initials: string
  role: string
  focus: string
  bio: string
  stack: string[]
  talks: string[]
  photo: string
  linkedin: string
}

export const creators: Creator[] = [
  {
    name: 'Sagar Vemala',
    initials: 'SV',
    role: 'Engineering Manager @ WaveMaker',
    focus: 'Full-stack · 10+ yrs',
    bio: 'Builds product end-to-end and has opinions about every layer. Leads developer experience through WaveMaker’s shift to AI-native, agentic development.',
    stack: ['TypeScript', 'React', 'Node', 'LLM tooling'],
    talks: ['AI workflows', 'DX', 'Architecture'],
    photo: '/creators/sagar.jpg',
    linkedin: 'https://www.linkedin.com/in/sagar-vemala/',
  },
  {
    name: 'Vivek Raj',
    initials: 'VR',
    role: 'AI Engineer @ WaveMaker',
    focus: 'LLM apps · RAG · MCP',
    bio: 'Went from application developer to AI engineer during the LLM wave. Ships LLM apps, RAG systems and MCP-based tooling in production.',
    stack: ['Python', 'LLMs', 'RAG', 'MCP'],
    talks: ['Applied AI', 'Agents', 'Career change'],
    photo: '/creators/vivek.jpg',
    linkedin: 'https://www.linkedin.com/in/vr384/',
  },
  {
    name: 'Gayathri',
    initials: 'GA',
    role: 'Senior DevOps Engineer @ WaveMaker',
    focus: 'Platform · reliability',
    bio: 'Keeps the platform honest. Cares about reliability, the boring infrastructure that never gets demoed, and where AI actually helps in ops.',
    stack: ['Kubernetes', 'Docker', 'CI/CD', 'AWS'],
    talks: ['Platform eng', 'Reliability', 'AI ops'],
    photo: '/creators/gayathri.jpg',
    linkedin: 'https://www.linkedin.com/in/tejaswini-k-093954182/',
  },
  {
    name: 'Ravi Seelam',
    initials: 'RS',
    role: 'Senior DevOps Engineer @ WaveMaker',
    focus: 'Cloud · agentic AI',
    bio: 'Turns research-shaped ideas into things that survive real traffic. Builds CI/CD, cloud infra and agentic AI platforms with MCP, LangGraph and full-stack observability.',
    stack: ['AWS', 'Kubernetes', 'Terraform', 'Agentic AI'],
    talks: ['Platform eng', 'AI ops', 'Production AI'],
    photo: '/creators/ravi.jpg',
    linkedin: 'https://www.linkedin.com/in/seelam-raviteja-6ba017209/',
  },
]

/* ── Podcast episodes (Ep.1 is live; rest are scheduled) ──────────────── */
export type Episode = {
  n: string
  title: string
  meta: string
  status: string
  live?: boolean
  href?: string
}

// Only real, published episodes live here. Add a new entry when an episode
// goes live — placeholder/"TBA" rows are intentionally not shipped (they'd
// leak into the RSS feed and llms.txt as fake episodes).
export const episodes: Episode[] = [
  {
    n: '01',
    title: 'From Application Developer to AI Engineer',
    meta: 'Guest: Vivek Raj · Host: Gayathri',
    status: 'Watch now',
    live: true,
    href: WATCH_EP1_URL,
  },
]

/* ── Articles ────────────────────────────────────────────────────────────
   Article content now lives as Markdown in src/content/articles/*.md
   (Astro Content Collections). Only the filter categories stay here. */
export const articleCategories = ['All', 'AI in practice', 'Engineering culture', 'Career', 'Tooling']

/* ── Signal (links + notes feed) ─────────────────────────────────────── */
export type SignalItem = {
  kind: 'Link' | 'Note'
  tag: string
  date: string
  title: string
  body: string
  source?: { label: string; href: string }
}

export const signalFilters = ['All', 'Links', 'Notes', 'AI', 'Tooling', 'Career']

export const signal: SignalItem[] = [
  {
    kind: 'Link',
    tag: 'AI Tooling',
    date: 'Jun 2026',
    title: 'Anthropic ships computer-use for coding agents',
    body: 'The demos look rough, but the direction is right. We ran it on a real ticket. Full breakdown in episode 4.',
    source: { label: 'anthropic.com', href: 'https://www.anthropic.com' },
  },
  {
    kind: 'Note',
    tag: 'Workflow',
    date: 'Jun 2026',
    title: '“AI made me 10x faster” usually just means “AI made me start.”',
    body: 'The unblock is the value, not the speed. Most of the win is getting past the blank page.',
  },
  {
    kind: 'Link',
    tag: 'Career',
    date: 'Jun 2026',
    title: 'Study: juniors with agents close tickets faster, review slower',
    body: 'Matches what we’re seeing. Speed up the writing, slow down the trusting.',
    source: { label: 'arxiv.org', href: 'https://arxiv.org' },
  },
  {
    kind: 'Note',
    tag: 'Tooling',
    date: 'May 2026',
    title: 'We swapped our standup bot for an agent that reads PRs',
    body: 'Week one it summarised the wrong PR with total confidence. Peak 2026.',
  },
  {
    kind: 'Link',
    tag: 'AI in practice',
    date: 'May 2026',
    title: 'The Postgres team on vibe-coded migrations gone wrong',
    body: 'Read this before you let an agent touch a prod schema.',
    source: { label: 'postgresql.org', href: 'https://www.postgresql.org' },
  },
  {
    kind: 'Note',
    tag: 'Culture',
    date: 'May 2026',
    title: '“The AI wrote it” is not a code review',
    body: 'Someone still owns the diff. The model doesn’t get paged at 2am.',
  },
  {
    kind: 'Link',
    tag: 'Tooling',
    date: 'Apr 2026',
    title: 'New open-source eval harness for coding agents',
    body: 'Finally, numbers instead of vibes. We’re trying it this week.',
    source: { label: 'github.com', href: 'https://github.com' },
  },
  {
    kind: 'Note',
    tag: 'Career',
    date: 'Apr 2026',
    title: 'If you’re learning to code in 2026',
    body: 'Learn to read code faster than you write it. That’s the new bottleneck.',
  },
]
