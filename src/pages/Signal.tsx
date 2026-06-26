import { useState } from 'react'
import { PageHeader } from '../components/Section'
import { signal, signalFilters, type SignalItem } from '../data'

function matches(item: SignalItem, filter: string) {
  if (filter === 'All') return true
  if (filter === 'Links') return item.kind === 'Link'
  if (filter === 'Notes') return item.kind === 'Note'
  return item.tag.toLowerCase().includes(filter.toLowerCase())
}

function SignalRow({ item }: { item: SignalItem }) {
  return (
    <li className="rounded-[16px] border border-line bg-bg px-6 py-5 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]">
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] text-primary">
          {item.kind} · {item.tag}
        </span>
        <span className="shrink-0 font-mono text-[0.65rem] tracking-[0.1em] text-muted">
          {item.date}
        </span>
      </div>
      <h3 className="mt-2.5 text-base font-bold leading-snug tracking-tight text-ink md:text-lg">
        {item.title}
      </h3>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{item.body}</p>
      {item.source ? (
        <a
          href={item.source.href}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block font-mono text-xs font-medium text-primary transition-colors hover:text-primary-deep"
        >
          {item.source.label} →
        </a>
      ) : (
        <p className="mt-3 font-mono text-xs text-muted">— from the channel</p>
      )}
    </li>
  )
}

function Signal() {
  const [active, setActive] = useState('All')
  const shown = signal.filter((s) => matches(s, active))

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:px-10 md:py-20">
      <PageHeader
        kicker="SIGNAL"
        title="What the channel is tracking"
        intro="Not blog posts, not hot takes from one of us — Signal is the whole channel thinking out loud. Links worth your time and short notes on what we’re building, reading and arguing about this week."
      />

      <div className="mt-8 flex flex-wrap gap-2.5">
        {signalFilters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActive(f)}
            className={`rounded-full border px-4 py-1.5 font-mono text-xs tracking-[0.06em] transition-colors ${
              active === f
                ? 'border-primary bg-primary text-white'
                : 'border-line bg-bg text-muted hover:border-primary hover:text-primary'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="mt-10 space-y-4">
        {shown.map((item) => (
          <SignalRow key={item.title} item={item} />
        ))}
      </ul>
    </div>
  )
}

export default Signal
