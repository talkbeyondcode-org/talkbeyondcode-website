import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SectionHead, Kicker } from '../components/Section'
import { TbcMark } from '../components/Brand'
import Keycap from '../components/Keycap'
import Newsletter from '../components/Newsletter'
import { articles, signal, creators } from '../data'

/* A small gradient “waveform” glyph — the podcast made visual. Bars breathe
   gently unless the visitor prefers reduced motion. */
function Waveform() {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.to('[data-bar]', {
        scaleY: 0.35,
        transformOrigin: 'center',
        duration: 0.9,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.12, from: 'center' },
      })
    },
    { scope: ref },
  )
  const bars = [0.5, 0.8, 1, 0.65, 1, 0.85, 0.45]
  return (
    <div ref={ref} className="flex items-end gap-2" aria-hidden="true">
      {bars.map((h, i) => (
        <span
          key={i}
          data-bar
          className="w-2.5 rounded-full bg-gradient-to-b from-brand-cyan via-brand-violet to-brand-magenta"
          style={{ height: `${h * 96}px` }}
        />
      ))}
    </div>
  )
}

const drops = [
  {
    kind: 'Podcast',
    date: 'Jun 2026',
    keycaps: true,
    title: 'Launching Ctrl+Shift+AI — our new podcast',
    blurb: 'Conversations with engineers across stacks, roles and career stages on how they really use AI.',
    cta: 'Listen',
    to: '/podcast',
  },
  {
    kind: 'Article',
    date: 'Jun 2026',
    title: 'Prompt-driven development: what stuck, what didn’t',
    blurb: 'Six months of building with agents — our honest scorecard across four different stacks.',
    cta: 'Read',
    to: '/articles',
  },
  {
    kind: 'Article',
    date: 'May 2026',
    title: 'We let AI write our standups for a month',
    blurb: 'An experiment in automating the most human ritual in engineering. Results were… mixed.',
    cta: 'Read',
    to: '/articles',
  },
]

function Home() {
  const hero = useRef<HTMLElement>(null)
  const [banner, setBanner] = useState(true)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.from('[data-hero]', {
        y: 22,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.08,
        delay: 0.05,
      })
    },
    { scope: hero },
  )

  return (
    <>
      {/* announcement bar */}
      {banner && (
        <div className="relative bg-lav">
          <Link
            to="/podcast"
            className="block px-10 py-3.5 text-center font-mono text-[0.82rem] tracking-[0.02em] text-primary-deep transition-opacity hover:opacity-80"
          >
            NEW · Ctrl+Shift+AI — our podcast on how engineers ship with AI → Listen
          </Link>
          <button
            type="button"
            onClick={() => setBanner(false)}
            aria-label="Dismiss announcement"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink"
          >
            ✕
          </button>
        </div>
      )}

      {/* hero */}
      <section ref={hero} className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.18),rgba(34,211,238,0.10)_45%,transparent_70%)] blur-[10px]"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-[1.15fr_0.85fr] md:px-10 md:py-28">
          <div>
            <div data-hero>
              <Kicker>FOUR ENGINEERS · ONE CHANNEL</Kicker>
            </div>
            <h1
              data-hero
              className="mt-5 text-[clamp(2.6rem,6vw,4rem)] font-bold leading-[1.04] tracking-[-0.02em] text-ink"
            >
              Engineering conversations
              <br />
              <span className="grad-text">beyond the code.</span>
            </h1>
            <p data-hero className="mt-6 max-w-xl text-lg text-muted">
              Opinions, experiences, practices and learnings from four working
              engineers — plus honest conversations about how AI is changing the craft.
            </p>
            <div data-hero className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/podcast"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-mono text-[0.8rem] font-bold uppercase tracking-[0.1em] text-white transition-transform hover:-translate-y-0.5 hover:bg-primary-deep"
              >
                <span aria-hidden="true">▶</span> Listen to the podcast
              </Link>
              <Link
                to="/articles"
                className="inline-flex items-center rounded-full border border-line px-6 py-3 font-mono text-[0.8rem] font-bold uppercase tracking-[0.1em] text-ink transition-colors hover:border-primary hover:text-primary"
              >
                Read the articles
              </Link>
            </div>
          </div>

          <div data-hero className="flex items-center justify-center gap-8 md:justify-end">
            <TbcMark size={168} />
            <Waveform />
          </div>
        </div>
      </section>

      {/* fresh from the channel */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:px-10">
        <SectionHead kicker="LATEST DROPS" title="Fresh from the channel" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {drops.map((d) => (
            <Link
              key={d.title}
              to={d.to}
              className="group flex flex-col rounded-[20px] border border-line bg-bg p-7 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.2em] text-primary">
                  {d.kind}
                </span>
                <span className="font-mono text-[0.7rem] tracking-[0.12em] text-muted">{d.date}</span>
              </div>
              {d.keycaps && (
                <div className="mt-6 flex gap-2.5">
                  <Keycap size="sm">Ctrl</Keycap>
                  <Keycap size="sm">Shift</Keycap>
                  <Keycap size="sm" gradient>AI</Keycap>
                </div>
              )}
              <h3 className="mt-6 text-xl font-bold leading-snug tracking-tight text-ink">
                {d.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{d.blurb}</p>
              <span className="mt-auto pt-6 font-mono text-sm font-medium tracking-[0.05em] text-primary transition-transform group-hover:translate-x-1">
                {d.cta} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* podcast band */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-[0.9fr_1.1fr] md:px-10">
          {/* cover plate */}
          <div className="rounded-[24px] border border-line bg-bg p-10 text-center shadow-[var(--shadow-card)]">
            <div className="mb-6 flex justify-center">
              <TbcMark size={48} />
            </div>
            <div className="flex items-center justify-center gap-2.5">
              <Keycap size="sm">Ctrl</Keycap>
              <Keycap size="sm">Shift</Keycap>
              <Keycap size="sm" gradient>AI</Keycap>
            </div>
            <p className="mt-6 font-display text-xl font-bold text-ink">Ctrl+Shift+AI</p>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-muted">
              how real engineers ship with AI
            </p>
          </div>

          <div>
            <Kicker>THE PODCAST</Kicker>
            <h2 className="mt-3 text-[clamp(2rem,4.5vw,3rem)] font-bold tracking-tight text-ink">
              Ctrl+Shift+AI
            </h2>
            <p className="mt-4 max-w-md text-muted">
              Every week we sit down with an engineer — junior to staff+, any stack —
              and unpack exactly how AI fits into their real workflow. No hype, just
              practice.
            </p>
            <p className="mt-5 font-mono text-xs uppercase tracking-[0.12em] text-muted">
              Spotify · Apple Podcasts · YouTube · RSS
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                to="/podcast"
                className="inline-flex items-center rounded-full bg-primary px-6 py-3 font-mono text-[0.8rem] font-bold uppercase tracking-[0.1em] text-white transition-transform hover:-translate-y-0.5 hover:bg-primary-deep"
              >
                Browse episodes →
              </Link>
              <span className="font-mono text-xs tracking-[0.08em] text-muted">new episodes weekly</span>
            </div>
          </div>
        </div>
      </section>

      {/* from the blog */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:px-10">
        <SectionHead kicker="WRITING" title="From the blog" href="/articles" hrefLabel="All articles" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {articles.slice(0, 3).map((a) => (
            <Link
              key={a.title}
              to="/articles"
              className="group flex flex-col overflow-hidden rounded-[20px] border border-line bg-bg shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="flex h-36 items-center justify-center bg-lav font-mono text-2xl font-bold text-primary/70">
                &lt;/&gt;
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary">
                  {a.category}
                </span>
                <h3 className="mt-3 text-lg font-bold leading-snug tracking-tight text-ink">
                  {a.title}
                </h3>
                <span className="mt-auto pt-6 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted">
                  {a.author} · {a.read}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* four engineers */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10">
          <SectionHead kicker="THE HUMANS" title="Four engineers, one mic" href="/creators" hrefLabel="Meet the creators" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {creators.map((c) => (
              <div
                key={c.name}
                className="rounded-[20px] border border-line bg-bg p-6 text-center shadow-[var(--shadow-card)]"
              >
                <img
                  src={c.photo}
                  alt={c.name}
                  loading="lazy"
                  className="mx-auto h-16 w-16 rounded-full border border-line object-cover"
                />
                <h3 className="mt-4 font-bold tracking-tight text-ink">{c.name}</h3>
                <p className="mt-1 text-sm text-muted">{c.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* what we're tracking */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:px-10">
        <SectionHead kicker="SIGNAL" title="What we’re tracking" href="/signal" hrefLabel="All signal" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {signal.slice(0, 3).map((s) => (
            <Link
              key={s.title}
              to="/signal"
              className="flex flex-col rounded-[20px] border border-line bg-bg p-6 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
            >
              <span className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] text-primary">
                {s.kind} · {s.tag}
              </span>
              <h3 className="mt-3 text-base font-bold leading-snug tracking-tight text-ink">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
              {s.source && (
                <span className="mt-auto pt-5 font-mono text-xs text-primary">{s.source.label} →</span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* newsletter */}
      <section className="mx-auto max-w-6xl px-6 pb-24 md:px-10">
        <Newsletter />
      </section>
    </>
  )
}

export default Home
