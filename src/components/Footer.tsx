import { Link } from 'react-router-dom'
import { TbcMark, Wordmark } from './Brand'

const CONTACT = 'talkbeyondcode@gmail.com'

const pages = [
  { label: 'Home', to: '/' },
  { label: 'Creators', to: '/creators' },
  { label: 'Podcast', to: '/podcast' },
  { label: 'Articles', to: '/articles' },
  { label: 'Signal', to: '/signal' },
]

const social = [
  { label: 'YouTube', href: 'https://www.youtube.com/@TalkBeyondCode' },
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'X', href: 'https://x.com' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/talkbeyondcode' },
]

function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.6fr_1fr_1fr_1.1fr] md:px-10">
        <div>
          <span className="flex items-center gap-2.5">
            <TbcMark size={40} />
            <Wordmark />
          </span>
          <p className="mt-4 max-w-xs text-sm text-muted">
            opinions · experiences · practices — beyond the code
          </p>
        </div>

        <nav aria-label="Pages">
          <h2 className="label">Pages</h2>
          <ul className="mt-4 space-y-2.5">
            {pages.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm text-ink transition-colors hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Social">
          <h2 className="label">Social</h2>
          <ul className="mt-4 space-y-2.5">
            {social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-ink transition-colors hover:text-primary"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="label">Contact</h2>
          <a
            href={`mailto:${CONTACT}`}
            className="mt-4 block text-sm text-ink transition-colors hover:text-primary"
          >
            {CONTACT}
          </a>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
          <span className="label normal-case tracking-[0.05em]">
            © 2026 TalkBeyondCode · Ctrl+Shift+AI
          </span>
          <span className="label hidden normal-case tracking-[0.05em] sm:block">
            beyond the code
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
