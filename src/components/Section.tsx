import { Link } from 'react-router-dom'

/* Section kicker — “> THE HUMANS” in violet mono, matching the Vibrant deck. */
export function Kicker({ children }: { children: string }) {
  return <span className="kicker">&gt; {children}</span>
}

/* Section header: kicker over a display title, with an optional link on the right. */
export function SectionHead({
  kicker,
  title,
  href,
  hrefLabel,
}: {
  kicker: string
  title: string
  href?: string
  hrefLabel?: string
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <Kicker>{kicker}</Kicker>
        <h2 className="mt-3 text-[clamp(1.7rem,3.4vw,2.5rem)] font-bold tracking-tight text-ink">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          to={href}
          className="font-mono text-xs font-bold uppercase tracking-[0.1em] text-primary transition-colors hover:text-primary-deep"
        >
          {hrefLabel} →
        </Link>
      )}
    </div>
  )
}

/* Page header used at the top of inner pages. */
export function PageHeader({
  kicker,
  title,
  intro,
}: {
  kicker: string
  title: string
  intro?: string
}) {
  return (
    <header>
      <Kicker>{kicker}</Kicker>
      <h1 className="mt-4 text-[clamp(2.2rem,5.5vw,3.6rem)] font-bold leading-[1.05] tracking-tight text-ink">
        {title}
      </h1>
      {intro && <p className="mt-5 max-w-2xl text-lg text-muted">{intro}</p>}
    </header>
  )
}
