import { Link } from 'react-router-dom'
import { tbcLogo } from '../assets/brand'

const columns = [
  {
    head: 'Pages',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Creators', to: '/creators' },
      { label: 'Podcast', to: '/podcast' },
      { label: 'Articles', to: '/articles' },
    ],
  },
]

const social = [
  { label: 'YouTube', href: 'https://youtube.com' },
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'X', href: 'https://x.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
]

function Footer() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-10">
        <div>
          {/* the one moment the full gradient mark appears */}
          <img src={tbcLogo} alt="TalkBeyondCode" className="h-8 w-auto" />
          <p className="mt-4 max-w-xs text-sm text-muted">
            Opinions, experiences, practices. Beyond the code.
          </p>
        </div>

        {columns.map((col) => (
          <nav key={col.head} aria-label={col.head}>
            <h2 className="label">{col.head}</h2>
            <ul className="mt-4 space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-ink transition-colors hover:text-signal">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <nav aria-label="Social">
          <h2 className="label">Social</h2>
          <ul className="mt-4 space-y-2">
            {social.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="text-sm text-ink transition-colors hover:text-signal">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="label">Contact</h2>
          <a
            href="mailto:hello@talkbeyondcode.dev"
            className="mt-4 block text-sm text-ink transition-colors hover:text-signal"
          >
            hello@talkbeyondcode.dev
          </a>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
          <span className="label">© 2026 TalkBeyondCode · Ctrl+Shift+AI</span>
          <span className="label hidden sm:block">beyond the code</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
