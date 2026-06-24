import { PageHeader } from '../components/Section'

function Blog() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20 md:px-10">
      <PageHeader
        kicker="writing"
        title="Notes beyond the code"
        intro="Engineering opinions, lessons learned and practical insights from building production systems."
      />

      {/* empty state — no posts published yet */}
      <div className="mt-12 rounded-lg border border-dashed border-line bg-surface/30 px-6 py-20 text-center">
        <p className="font-mono text-xs uppercase tracking-wide text-signal-dim">Coming soon</p>
        <h2 className="mt-3 text-2xl font-medium tracking-tight">No posts yet</h2>
        <p className="mx-auto mt-3 max-w-md text-muted">
          We&rsquo;re writing our first pieces now. In the meantime, the conversations are
          happening on the podcast.
        </p>
        <a
          href="https://youtu.be/wDLA1Qlw_Ds"
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-sm border border-line px-5 py-3 font-mono text-xs uppercase tracking-wide text-ink transition-colors hover:border-signal/60 hover:text-signal"
        >
          Watch the podcast →
        </a>
      </div>
    </div>
  )
}

export default Blog
