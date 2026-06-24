import { PageHeader, Kicker } from '../components/Section'

type Creator = {
  name: string
  role: string
  bio: string
  stack: string[]
  talks: string[]
}

const creators: Creator[] = [
  {
    name: 'Sagar Vemala',
    role: 'Engineering Manager',
    bio: 'Builds product end to end and has opinions about every layer. Currently deep in AI-assisted workflows and how they reshape team velocity.',
    stack: ['TypeScript', 'React', 'Node', 'LLM tooling'],
    talks: ['AI workflows', 'DX', 'Architecture'],
  },
  {
    name: 'Vivek Raj',
    role: 'AI Engineer',
    bio: 'Went from application developer to AI engineer during the LLM wave. Ships LLM apps, RAG systems and MCP-based tooling in production.',
    stack: ['Python', 'LLMs', 'RAG', 'MCP'],
    talks: ['Applied AI', 'Agents', 'Career change'],
  },
  {
    name: 'Gayathri',
    role: 'Senior DevOps Engineer',
    bio: 'Keeps the platform honest. Cares about reliability, the boring infrastructure that never gets demoed, and where AI actually helps in ops.',
    stack: ['Kubernetes', 'Terraform', 'CI/CD', 'AWS'],
    talks: ['Platform eng', 'Reliability', 'AI ops'],
  },
  {
    name: 'Ravi Seelam',
    role: 'AI Engineer',
    bio: 'Spends his time turning research-shaped ideas into things that survive real traffic. Interested in evaluation, agents and the unglamorous glue.',
    stack: ['Python', 'LLMs', 'Vector DBs', 'Evals'],
    talks: ['Applied AI', 'Evaluation', 'Production AI'],
  },
]

function initials(name: string) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('')
}

function TagRow({ head, tags }: { head: string; tags: string[] }) {
  return (
    <div>
      <span className="label">{head}</span>
      <div className="mt-2 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className="rounded-sm border border-line px-2.5 py-1 font-mono text-xs text-muted">
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

function Creators() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20 md:px-10">
      <PageHeader
        kicker="the humans"
        title="Four engineers, one mic"
        intro="We ship software at different companies, on different stacks, at different career stages. That friction is the whole point: same question, four very different answers."
      />

      {/* roster — hairline-separated profile panels, not a card grid */}
      <div className="mt-px grid gap-px bg-line md:grid-cols-2">
        {creators.map((c) => (
          <article key={c.name} className="flex flex-col gap-5 bg-bg p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-line font-mono text-signal">
                {initials(c.name)}
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">{c.name}</h2>
                <p className="label mt-1 normal-case tracking-normal text-muted">{c.role}</p>
              </div>
            </div>
            <p className="text-muted">{c.bio}</p>
            <div className="mt-auto grid gap-5 border-t border-line pt-5 sm:grid-cols-2">
              <TagRow head="Stack" tags={c.stack} />
              <TagRow head="Talks about" tags={c.talks} />
            </div>
            <div className="flex gap-4 font-mono text-xs uppercase tracking-wide text-muted">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-signal">LinkedIn</a>
              <a href="https://x.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-signal">X</a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-signal">GitHub</a>
            </div>
          </article>
        ))}
      </div>

      {/* why we started */}
      <section className="mt-24 grid gap-10 border-t border-line pt-16 md:grid-cols-[1fr_1.3fr]">
        <div>
          <Kicker>why we started</Kicker>
          <h2 className="mt-4 text-[clamp(1.8rem,4vw,2.8rem)] font-semibold leading-tight tracking-tight">
            Code was never the whole story
          </h2>
        </div>
        <p className="max-w-[68ch] self-center text-lg leading-relaxed text-muted">
          The four of us kept having the same conversation after standups, about the
          decisions, trade-offs and career turns that never make it into commit
          messages. TalkBeyondCode is that conversation, recorded. Ctrl+Shift+AI is its
          first series: how engineers like us actually work with AI, beyond the demos.
        </p>
      </section>

      {/* collab CTA */}
      <section className="mt-20 flex flex-col items-start justify-between gap-6 rounded-lg border border-line bg-surface/40 p-8 sm:flex-row sm:items-center md:p-10">
        <h2 className="max-w-md text-xl font-medium tracking-tight">
          Want us on your podcast, or want to collaborate?
        </h2>
        <a
          href="mailto:hello@talkbeyondcode.dev"
          className="shrink-0 rounded-sm bg-signal px-5 py-3 font-mono text-sm uppercase tracking-wide text-bg transition-transform hover:-translate-y-0.5"
        >
          hello@talkbeyondcode.dev
        </a>
      </section>
    </div>
  )
}

export default Creators
