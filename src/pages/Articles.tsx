import { useState } from 'react'
import { PageHeader } from '../components/Section'
import Newsletter from '../components/Newsletter'
import { articles, articleCategories, featuredArticle, type Article } from '../data'

function CodePlate({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center bg-lav font-mono font-bold text-primary/70 ${className}`}>
      &lt;/&gt;
    </div>
  )
}

function ArticleCard({ a }: { a: Article }) {
  return (
    <article className="group flex cursor-pointer flex-col overflow-hidden rounded-[20px] border border-line bg-bg shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]">
      <CodePlate className="h-36 text-2xl" />
      <div className="flex flex-1 flex-col p-6">
        <span className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary">
          {a.category}
        </span>
        <h3 className="mt-3 text-lg font-bold leading-snug tracking-tight text-ink">{a.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{a.excerpt}</p>
        <span className="mt-auto pt-6 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted">
          {a.author} · {a.read}
        </span>
      </div>
    </article>
  )
}

function Articles() {
  const [active, setActive] = useState('All')
  const shown = active === 'All' ? articles : articles.filter((a) => a.category === active)
  const showFeatured = active === 'All' || featuredArticle.category === active

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
      <PageHeader
        kicker="WRITING"
        title="Notes beyond the code"
        intro="Long-form from the four of us — what we’re building, breaking and rethinking as AI reshapes the day-to-day."
      />

      {/* filters */}
      <div className="mt-8 flex flex-wrap gap-2.5">
        {articleCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            className={`rounded-full border px-4 py-1.5 font-mono text-xs tracking-[0.06em] transition-colors ${
              active === cat
                ? 'border-primary bg-primary text-white'
                : 'border-line bg-bg text-muted hover:border-primary hover:text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* featured */}
      {showFeatured && (
        <article className="group mt-10 grid cursor-pointer overflow-hidden rounded-[24px] border border-line bg-bg shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] md:grid-cols-[1fr_1.2fr]">
          <CodePlate className="min-h-[220px] text-4xl" />
          <div className="flex flex-col justify-center p-8 md:p-10">
            <span className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.2em] text-primary">
              Featured · {featuredArticle.category}
            </span>
            <h2 className="mt-4 text-[clamp(1.5rem,3vw,2.1rem)] font-bold leading-tight tracking-tight text-ink">
              {featuredArticle.title}
            </h2>
            <p className="mt-4 max-w-xl text-muted">{featuredArticle.excerpt}</p>
            <span className="mt-6 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-muted">
              {featuredArticle.author} · {featuredArticle.read} · {featuredArticle.date}
            </span>
          </div>
        </article>
      )}

      {/* grid */}
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {shown.map((a) => (
          <ArticleCard key={a.title} a={a} />
        ))}
      </div>

      <div className="mt-16">
        <Newsletter />
      </div>
    </div>
  )
}

export default Articles
