import { Link } from 'react-router-dom'

/* A section kicker: a short cyan->violet->magenta brand-gradient bar (the one
   place the full gradient lives, as a graphic) followed by a mono readout label. */
export function Kicker({ children }: { children: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="h-[3px] w-8 rounded-full bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-magenta"
      />
      <span className="label text-signal-dim">{children}</span>
    </span>
  )
}

/* Shared section + page headers in the instrument style:
   a gradient Kicker over a Bricolage display title, with a hairline rule.
   Used across all pages for a consistent spec-sheet voice. */

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
    <div className="flex items-end justify-between gap-6 border-b border-line pb-5">
      <div>
        <Kicker>{kicker}</Kicker>
        <h2 className="mt-3 text-[clamp(1.7rem,3.4vw,2.6rem)] font-semibold tracking-tight">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          to={href}
          className="label whitespace-nowrap pb-1 text-ink transition-colors hover:text-signal"
        >
          {hrefLabel} →
        </Link>
      )}
    </div>
  )
}

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
    <header className="border-b border-line pb-10">
      <Kicker>{kicker}</Kicker>
      <h1 className="mt-4 text-[clamp(2.2rem,5.5vw,4rem)] font-semibold leading-[1.02] tracking-tight">
        {title}
      </h1>
      {intro && <p className="mt-5 max-w-2xl text-lg text-muted">{intro}</p>}
    </header>
  )
}
