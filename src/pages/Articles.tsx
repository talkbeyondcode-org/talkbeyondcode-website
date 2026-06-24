import { useState } from 'react'
import { PageHeader } from '../components/Section'

type Article = {
  title: string
  category: string
  read: string
  author: string
}

const articles: Article[] = [
  { title: 'Six months of prompt-driven development: our honest scorecard', category: 'AI in practice', read: '12 min', author: 'Sagar Vemala' },
  { title: 'Code review in the age of agents', category: 'AI in practice', read: '9 min', author: 'One of us' },
  { title: 'What "senior" means when juniors ship like seniors', category: 'Career', read: '7 min', author: 'One of us' },
  { title: 'Our four very different AI toolchains, compared', category: 'Tooling', read: '11 min', author: 'One of us' },
  { title: 'Standups, but the AI takes notes', category: 'Engineering culture', read: '6 min', author: 'One of us' },
  { title: 'RAG in production: the parts the tutorials skip', category: 'AI in practice', read: '14 min', author: 'One of us' },
  { title: 'Interviewing when the take-home is AI-assisted', category: 'Career', read: '8 min', author: 'One of us' },
]

const categories = ['All', 'AI in practice', 'Engineering culture', 'Career', 'Tooling']

function Articles() {
  const [filter, setFilter] = useState('All')
  const shown = filter === 'All' ? articles : articles.filter((a) => a.category === filter)

  return (
    <div className="mx-auto max-w-6xl px-6 py-20 md:px-10">
      <PageHeader
        kicker="writing"
        title="Notes beyond the code"
        intro="Engineering opinions, lessons learned and practical insights from building production systems. The first pieces publish alongside the podcast launch."
      />

      {/* filters */}
      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((c) => {
          const active = c === filter
          return (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              aria-pressed={active}
              className={`rounded-sm border px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
                active
                  ? 'border-signal bg-signal text-bg'
                  : 'border-line text-muted hover:border-signal/60 hover:text-ink'
              }`}
            >
              {c}
            </button>
          )
        })}
      </div>

      {/* list */}
      <ul className="mt-10">
        {shown.map((a, i) => (
          <li
            key={a.title}
            className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-6 border-b border-line py-7"
          >
            <span className="label tabular-nums text-signal-dim">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="label">{a.category}</span>
                <span className="label text-muted">{a.read} read</span>
              </div>
              <h2 className="mt-2 text-xl font-medium tracking-tight md:text-2xl">{a.title}</h2>
              <p className="mt-1 font-mono text-xs uppercase tracking-wide text-muted">By {a.author}</p>
            </div>
            <span className="self-center rounded-sm border border-line px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-wide text-muted">
              Soon
            </span>
          </li>
        ))}
      </ul>

      {shown.length === 0 && (
        <p className="mt-10 text-muted">Nothing in this category yet. Check back soon.</p>
      )}
    </div>
  )
}

export default Articles
