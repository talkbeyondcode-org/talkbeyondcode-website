import { Kicker } from '../components/Section'
import { TbcMark } from '../components/Brand'
import Keycap from '../components/Keycap'
import { episodes, CONTACT_EMAIL, YOUTUBE_URL } from '../data'

function Podcast() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
      {/* hero */}
      <div className="grid items-center gap-12 md:grid-cols-[0.85fr_1.15fr]">
        {/* cover plate */}
        <div className="order-2 rounded-[24px] border border-line bg-surface p-10 text-center md:order-1">
          <div className="mb-6 flex justify-center">
            <TbcMark size={48} />
          </div>
          <div className="flex items-center justify-center gap-2.5">
            <Keycap size="sm">Ctrl</Keycap>
            <Keycap size="sm">Shift</Keycap>
            <Keycap size="sm" gradient>AI</Keycap>
          </div>
          <p className="mt-6 font-display text-2xl font-bold text-ink">Ctrl+Shift+AI</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-muted">
            how real engineers ship with AI
          </p>
        </div>

        <div className="order-1 md:order-2">
          <Kicker>THE PODCAST · SEASON 01</Kicker>
          <h1 className="mt-4 text-[clamp(2.4rem,6vw,4rem)] font-bold leading-[1.02] tracking-tight text-ink">
            Ctrl<span className="grad-text">+Shift+AI</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            Conversations with people across career stages, expertise levels and tech
            stacks about how they are adopting AI in their day-to-day engineering work.
          </p>
          <p className="mt-5 font-mono text-xs uppercase tracking-[0.12em] text-muted">
            Spotify · Apple Podcasts · YouTube · RSS
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full bg-primary px-6 py-3 font-mono text-[0.8rem] font-bold uppercase tracking-[0.1em] text-white transition-transform hover:-translate-y-0.5 hover:bg-primary-deep"
            >
              Follow the podcast
            </a>
            <span className="font-mono text-xs tracking-[0.08em] text-muted">new episodes weekly</span>
          </div>
        </div>
      </div>

      {/* episodes */}
      <section className="py-16">
        <Kicker>EPISODES</Kicker>
        <h2 className="mt-3 text-[clamp(1.7rem,3.4vw,2.5rem)] font-bold tracking-tight text-ink">
          Episodes
        </h2>
        <ul className="mt-8 space-y-4">
          {episodes.map((ep) => {
            const inner = (
              <>
                <span className="rounded-[10px] border border-line bg-panel px-3 py-2 font-mono text-base font-bold tabular-nums text-ink">
                  {ep.n}
                </span>
                <div>
                  <h3
                    className={`text-base font-bold tracking-tight text-ink md:text-lg ${
                      ep.live ? 'transition-colors group-hover:text-primary' : ''
                    }`}
                  >
                    {ep.title}
                  </h3>
                  <p className="mt-1 font-mono text-xs tracking-[0.06em] text-muted">{ep.meta}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`hidden font-mono text-[0.7rem] font-bold uppercase tracking-[0.12em] sm:inline ${
                      ep.live ? 'text-primary' : 'text-muted'
                    }`}
                  >
                    {ep.status}
                  </span>
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm ${
                      ep.live ? 'bg-primary text-white' : 'border border-line text-muted'
                    }`}
                    aria-hidden="true"
                  >
                    ▶
                  </span>
                </div>
              </>
            )
            const base =
              'group grid grid-cols-[auto_1fr_auto] items-center gap-x-5 rounded-[16px] border border-line bg-bg px-6 py-5 shadow-[var(--shadow-card)] transition-all'
            return (
              <li key={ep.n}>
                {ep.live ? (
                  <a
                    href={ep.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`${base} hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]`}
                  >
                    {inner}
                  </a>
                ) : (
                  <div className={base}>{inner}</div>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      {/* be a guest */}
      <section className="flex flex-col items-start justify-between gap-6 rounded-[24px] border border-line bg-surface p-8 sm:flex-row sm:items-center md:p-10">
        <div>
          <h2 className="max-w-lg text-xl font-bold tracking-tight text-ink">
            Using AI in your work in a way nobody talks about?
          </h2>
          <p className="mt-2 text-sm text-muted">
            Any stack, any level — we want the unpolished version.
          </p>
        </div>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="shrink-0 rounded-full bg-primary px-6 py-3 font-mono text-[0.8rem] font-bold uppercase tracking-[0.1em] text-white transition-transform hover:-translate-y-0.5 hover:bg-primary-deep"
        >
          Pitch yourself →
        </a>
      </section>
    </div>
  )
}

export default Podcast
