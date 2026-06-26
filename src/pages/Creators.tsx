import { PageHeader, Kicker } from '../components/Section'
import { creators, CONTACT_EMAIL, type Creator } from '../data'

function TagRow({ head, tags }: { head: string; tags: string[] }) {
  return (
    <div>
      <span className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted">
        {head}
      </span>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-line bg-bg px-3 py-1 font-mono text-xs text-ink"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

function CreatorCard({ c }: { c: Creator }) {
  return (
    <article className="flex flex-col gap-5 rounded-[20px] border border-line bg-bg p-7 shadow-[var(--shadow-card)] md:p-8">
      <div className="flex items-center gap-4">
        <img
          src={c.photo}
          alt={c.name}
          loading="lazy"
          className="h-14 w-14 shrink-0 rounded-full border border-line object-cover"
        />
        <div>
          <h2 className="text-xl font-bold tracking-tight text-ink">{c.name}</h2>
          <p className="mt-0.5 text-sm text-muted">{c.role}</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-muted">{c.bio}</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <TagRow head="Stack" tags={c.stack} />
        <TagRow head="Talks about" tags={c.talks} />
      </div>
      <div className="mt-auto border-t border-line pt-4">
        <a
          href={c.linkedin}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-xs font-bold uppercase tracking-[0.1em] text-primary transition-colors hover:text-primary-deep"
        >
          LinkedIn →
        </a>
      </div>
    </article>
  )
}

function Creators() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
      <PageHeader
        kicker="THE HUMANS"
        title="Four engineers, one mic"
        intro="We ship software at different companies, on different stacks, at different career stages. That friction is the whole point — same question, four very different answers."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {creators.map((c) => (
          <CreatorCard key={c.name} c={c} />
        ))}
      </div>

      {/* why we started */}
      <section className="mt-20 grid items-center gap-10 rounded-[24px] border border-line bg-surface p-8 md:grid-cols-[1.3fr_1fr] md:p-12">
        <div>
          <Kicker>WHY WE STARTED</Kicker>
          <h2 className="mt-4 text-[clamp(1.8rem,4vw,2.6rem)] font-bold leading-tight tracking-tight text-ink">
            Code was never the whole story
          </h2>
          <p className="mt-5 max-w-[60ch] text-muted">
            The four of us kept having the same conversation after standups — about the
            decisions, trade-offs and career turns that never make it into commit
            messages. TalkBeyondCode is that conversation, recorded. Ctrl+Shift+AI is its
            first series: how engineers like us actually work with AI, beyond the demos.
          </p>
        </div>
        <div className="flex aspect-[4/3] items-center justify-center rounded-[16px] border border-dashed border-line bg-bg font-mono text-xs uppercase tracking-[0.16em] text-muted">
          [ group photo ]
        </div>
      </section>

      {/* collab CTA */}
      <section className="mt-8 flex flex-col items-start justify-between gap-6 rounded-[24px] border border-line bg-bg p-8 shadow-[var(--shadow-card)] sm:flex-row sm:items-center md:p-10">
        <h2 className="max-w-md text-xl font-bold tracking-tight text-ink">
          Want us on your podcast, or want to collaborate?
        </h2>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="shrink-0 rounded-full bg-primary px-6 py-3 font-mono text-[0.8rem] font-bold uppercase tracking-[0.1em] text-white transition-transform hover:-translate-y-0.5 hover:bg-primary-deep"
        >
          {CONTACT_EMAIL}
        </a>
      </section>
    </div>
  )
}

export default Creators
