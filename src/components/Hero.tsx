import { useRef, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Keycap from './Keycap'
import { Kicker } from './Section'

// Three.js is heavy and only used here — split it into its own chunk.
const Oscilloscope = lazy(() => import('./Oscilloscope'))

function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return
      gsap.from('[data-hero-stagger]', {
        y: 24,
        opacity: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.09,
        delay: 0.15,
      })
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      className="relative overflow-hidden border-b border-line"
      aria-label="TalkBeyondCode"
    >
      {/* oscilloscope trace sits behind the type */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Suspense fallback={null}>
          <Oscilloscope />
        </Suspense>
      </div>

      <div className="relative mx-auto grid min-h-[88svh] max-w-6xl grid-cols-1 content-center gap-8 px-6 py-28 md:px-10">
        <div data-hero-stagger>
          <Kicker>four engineers · one channel</Kicker>
        </div>

        <h1
          data-hero-stagger
          className="max-w-4xl text-balance text-[clamp(2.6rem,7vw,5.6rem)] font-semibold leading-[0.98] tracking-tight"
        >
          Engineering conversations beyond the code.
        </h1>

        <p
          data-hero-stagger
          className="max-w-xl text-pretty text-lg leading-relaxed text-muted"
        >
          Opinions, experiences and the parts that never make it into commit
          messages, from four working engineers. No scripts, no gatekeeping.
        </p>

        <div data-hero-stagger className="flex items-center gap-2">
          <Keycap active>Ctrl</Keycap>
          <span className="text-muted">+</span>
          <Keycap active>Shift</Keycap>
          <span className="text-muted">+</span>
          <Keycap active>AI</Keycap>
          <span className="label ml-2">our podcast on shipping with AI</span>
        </div>

        <div data-hero-stagger className="mt-2 flex flex-wrap items-center gap-3">
          <Link
            to="/podcast"
            className="group inline-flex items-center gap-2 rounded-sm bg-signal px-5 py-3 font-mono text-sm uppercase tracking-wide text-bg transition-transform hover:-translate-y-0.5"
          >
            <span aria-hidden="true">▶</span> Listen to the podcast
          </Link>
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 rounded-sm border border-line px-5 py-3 font-mono text-sm uppercase tracking-wide text-ink transition-colors hover:border-signal/60 hover:text-signal"
          >
            Read the articles
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero
