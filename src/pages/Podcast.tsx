import { Kicker } from '../components/Section'
import { csaiLogo } from '../assets/brand'

const platforms = ['YouTube']

const WATCH_URL = 'https://youtu.be/wDLA1Qlw_Ds'

type Episode = {
  n: string
  title: string
  meta: string
  status: string
  live?: boolean
  href?: string
}

const episodes: Episode[] = [
  {
    n: '01',
    title: 'From Application Developer to AI Engineer',
    meta: 'Guest: Vivek Raj · Host: Gayathri',
    status: 'Watch now',
    live: true,
    href: WATCH_URL,
  },
]

function Podcast() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20 md:px-10">
      {/* hero */}
      <div className="grid gap-12 border-b border-line pb-20 md:grid-cols-[1fr_1.2fr] md:items-center">
        <div className="order-2 flex items-center justify-center rounded-lg border border-line bg-surface/40 p-10 md:order-1">
          <img
            src={csaiLogo}
            alt="Ctrl+Shift+AI — a TalkBeyondCode podcast"
            className="w-full max-w-sm"
          />
        </div>

        <div className="order-1 md:order-2">
          <Kicker>the podcast · season 01</Kicker>
          <h1 className="mt-4 text-[clamp(2.4rem,6vw,4.2rem)] font-semibold leading-[1.02] tracking-tight">
            How real engineers ship with AI
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            Conversations with people across career stages, expertise levels and tech
            stacks about how they are adopting AI in their day-to-day engineering work.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {platforms.map((p) => (
              <span key={p} className="rounded-sm border border-line px-3 py-1.5 font-mono text-xs text-muted">
                {p}
              </span>
            ))}
          </div>
          <a
            href={WATCH_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-sm bg-signal px-5 py-3 font-mono text-sm uppercase tracking-wide text-bg transition-transform hover:-translate-y-0.5"
          >
            Watch episode 1 →
          </a>
        </div>
      </div>

      {/* episodes */}
      <section className="py-16">
        <Kicker>episodes</Kicker>
        <h2 className="mt-3 text-[clamp(1.7rem,3.4vw,2.6rem)] font-semibold tracking-tight">
          Episodes
        </h2>
        <ul className="mt-8">
          {episodes.map((ep) => (
            <li key={ep.n}>
              <a
                href={ep.href}
                target="_blank"
                rel="noreferrer"
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-6 border-b border-line py-6 transition-colors hover:bg-surface/40"
              >
                <span className="font-mono text-2xl tabular-nums text-signal-dim">{ep.n}</span>
                <div>
                  <h3 className="text-lg font-medium tracking-tight transition-colors group-hover:text-signal md:text-xl">
                    {ep.title}
                  </h3>
                  <p className="label mt-1 normal-case tracking-normal text-muted">{ep.meta}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`hidden font-mono text-xs uppercase tracking-wide sm:inline ${
                      ep.live ? 'text-signal' : 'text-muted'
                    }`}
                  >
                    {ep.status}
                  </span>
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full border ${
                      ep.live ? 'border-signal text-signal' : 'border-line text-muted'
                    }`}
                    aria-hidden="true"
                  >
                    ▶
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-8 font-mono text-xs uppercase tracking-wide text-muted">
          More episodes coming soon.
        </p>
      </section>

      {/* be a guest */}
      <section className="flex flex-col items-start justify-between gap-6 rounded-lg border border-line bg-surface/40 p-8 sm:flex-row sm:items-center md:p-10">
        <div>
          <h2 className="max-w-lg text-xl font-medium tracking-tight">
            Using AI in your work in a way nobody talks about?
          </h2>
          <p className="mt-2 text-sm text-muted">
            Any stack, any level. We want the unpolished version.
          </p>
        </div>
        <a
          href="mailto:talkbeyondcode@gmail.com"
          className="shrink-0 rounded-sm bg-signal px-5 py-3 font-mono text-sm uppercase tracking-wide text-bg transition-transform hover:-translate-y-0.5"
        >
          Pitch yourself →
        </a>
      </section>
    </div>
  )
}

export default Podcast
