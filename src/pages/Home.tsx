import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import Keycap from '../components/Keycap'
import { SectionHead, Kicker } from '../components/Section'
import Newsletter from '../components/Newsletter'

const drops = [
  {
    type: 'Podcast',
    date: 'Jun 2026',
    title: 'Launching Ctrl+Shift+AI, our new podcast',
    blurb: 'Conversations with engineers across stacks and career stages on how they really use AI.',
    to: '/podcast',
  },
  {
    type: 'Article',
    date: 'Jun 2026',
    title: "Prompt-driven development: what stuck, what didn't",
    blurb: 'Six months of building with agents. Our honest scorecard across four different stacks.',
    to: '/articles',
  },
  {
    type: 'Article',
    date: 'May 2026',
    title: 'We let AI write our standups for a month',
    blurb: 'An experiment in automating the most human ritual in engineering. The results were mixed.',
    to: '/articles',
  },
]

const platforms = ['Spotify', 'Apple Podcasts', 'YouTube', 'RSS']

const creators = [
  { name: 'Sagar Vemala', role: 'Engineering Manager', focus: 'Full-stack · AI tooling' },
  { name: 'Vivek Raj', role: 'AI Engineer', focus: 'LLM apps · RAG · MCP' },
  { name: 'Gayathri', role: 'Senior DevOps Engineer', focus: 'Platform · reliability' },
  { name: 'Ravi Seelam', role: 'AI Engineer', focus: 'Applied AI · agents' },
]

function initials(name: string) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('')
}

function Home() {
  return (
    <>
      <Hero />

      {/* LATEST DROPS — spec rows, not a card grid */}
      <section className="mx-auto max-w-6xl px-6 py-24 md:px-10">
        <SectionHead kicker="latest drops" title="Fresh from the channel" />
        <ul>
          {drops.map((d, i) => (
            <li key={d.title}>
              <Link
                to={d.to}
                className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-6 gap-y-2 border-b border-line py-7 transition-colors hover:bg-surface/40"
              >
                <span className="label tabular-nums text-signal-dim">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="col-start-2">
                  <div className="flex items-center gap-3">
                    <span className="label">{d.type}</span>
                    <span className="label text-muted">{d.date}</span>
                  </div>
                  <h3 className="mt-2 text-xl font-medium tracking-tight transition-colors group-hover:text-signal md:text-2xl">
                    {d.title}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-muted">{d.blurb}</p>
                </div>
                <span className="col-start-3 self-center font-mono text-muted transition-transform group-hover:translate-x-1 group-hover:text-signal">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* PODCAST BAND */}
      <section className="border-y border-line bg-surface/30">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[1fr_1.1fr] md:items-center md:px-10">
          <div>
            <Kicker>the podcast</Kicker>
            <h2 className="mt-3 text-[clamp(2rem,4.5vw,3.4rem)] font-semibold tracking-tight">
              Ctrl+Shift+AI
            </h2>
            <p className="mt-4 max-w-md text-muted">
              Every week we sit down with an engineer (junior to staff+, any stack)
              and unpack exactly how AI fits into their real workflow. No hype, just
              practice.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {platforms.map((p) => (
                <span key={p} className="rounded-sm border border-line px-3 py-1.5 font-mono text-xs text-muted">
                  {p}
                </span>
              ))}
            </div>
            <Link
              to="/podcast"
              className="mt-8 inline-flex items-center gap-2 rounded-sm bg-signal px-5 py-3 font-mono text-sm uppercase tracking-wide text-bg transition-transform hover:-translate-y-0.5"
            >
              Browse episodes →
            </Link>
          </div>

          {/* cover plate */}
          <div className="rounded-lg border border-line bg-bg p-10">
            <div className="flex items-center justify-center gap-3">
              <Keycap active>Ctrl</Keycap>
              <span className="text-muted">+</span>
              <Keycap active>Shift</Keycap>
              <span className="text-muted">+</span>
              <Keycap active>AI</Keycap>
            </div>
            <p className="mt-8 text-center font-mono text-sm uppercase tracking-widest text-muted">
              how real engineers ship with AI
            </p>
            <p className="mt-2 text-center text-xs text-signal-dim">new episodes weekly</p>
          </div>
        </div>
      </section>

      {/* THE HUMANS */}
      <section className="mx-auto max-w-6xl px-6 py-24 md:px-10">
        <SectionHead kicker="the humans" title="Four engineers, one mic" href="/creators" hrefLabel="Meet the creators" />
        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {creators.map((c) => (
            <div key={c.name} className="bg-bg p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-line font-mono text-sm text-signal">
                {initials(c.name)}
              </div>
              <h3 className="mt-4 font-medium tracking-tight">{c.name}</h3>
              <p className="label mt-1 normal-case tracking-normal">{c.role}</p>
              <p className="mt-3 text-sm text-muted">{c.focus}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <Newsletter />
    </>
  )
}

export default Home
