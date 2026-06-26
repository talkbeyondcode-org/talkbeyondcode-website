import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Logo } from './Brand'

const SUBSCRIBE_URL = 'https://www.youtube.com/@TalkBeyondCode'

const links = [
  { to: '/creators', label: 'Creators' },
  { to: '/podcast', label: 'Podcast' },
  { to: '/articles', label: 'Articles' },
  { to: '/signal', label: 'Signal' },
]

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `font-mono text-[0.82rem] tracking-[0.06em] transition-colors ${
              isActive ? 'text-primary' : 'text-muted hover:text-ink'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </>
  )
}

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-10">
        <Link to="/" aria-label="TalkBeyondCode home" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        {/* desktop */}
        <div className="hidden items-center gap-8 lg:flex">
          <NavItems />
          <a
            href={SUBSCRIBE_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-primary px-5 py-2 font-mono text-[0.82rem] font-bold tracking-[0.06em] text-white transition-transform hover:-translate-y-0.5 hover:bg-primary-deep"
          >
            Subscribe
          </a>
        </div>

        {/* mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="font-mono text-xs uppercase tracking-wide text-ink transition-colors hover:text-primary lg:hidden"
        >
          {open ? '[ close ]' : '[ menu ]'}
        </button>
      </nav>

      {/* mobile drawer */}
      {open && (
        <div className="border-t border-line bg-bg lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-6 py-5">
            <NavItems onNavigate={() => setOpen(false)} />
            <a
              href={SUBSCRIBE_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-1 rounded-full bg-primary px-5 py-2 font-mono text-[0.82rem] font-bold tracking-[0.06em] text-white"
            >
              Subscribe
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
