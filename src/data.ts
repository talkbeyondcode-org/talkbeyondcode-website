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
    focus: 'Engineering Manager · 10+ yrs',
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
export const articleCategories = ['All', 'AI in practice', 'Engineering culture', 'Career', 'Tooling', 'Architecture']

/* ── Signal (links + notes feed) ─────────────────────────────────────── */
/* Signal items now live as Markdown in src/content/signal/*.md (Astro Content
   Collections) — see src/content/README.md. Only the filter chips stay here. */
export const signalFilters = ['All', 'Links', 'Notes', 'AI', 'Tooling', 'Career']
