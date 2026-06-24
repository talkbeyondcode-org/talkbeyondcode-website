import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { tbcLogo } from '../assets/brand'

const links = [
  { to: '/creators', label: 'Creators' },
  { to: '/podcast', label: 'Podcast' },
  { to: '/articles', label: 'Articles' },
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
            `rounded-sm px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
              isActive ? 'text-signal' : 'text-muted hover:text-ink'
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
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5 md:px-10">
        <Link to="/" className="flex items-center" aria-label="TalkBeyondCode home">
          <img src={tbcLogo} alt="TalkBeyondCode" className="h-7 w-auto md:h-8" />
        </Link>

        {/* desktop nav */}
        <div className="hidden items-center gap-3 lg:flex">
          <NavItems />
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-sm border border-line px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-ink transition-colors hover:border-signal/60 hover:text-signal"
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
          className="font-mono text-xs uppercase tracking-wide text-ink transition-colors hover:text-signal lg:hidden"
        >
          {open ? '[ close ]' : '[ menu ]'}
        </button>
      </nav>

      {/* mobile drawer */}
      {open && (
        <div className="border-t border-line lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
            <NavItems onNavigate={() => setOpen(false)} />
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block rounded-sm border border-line px-3 py-2 text-center font-mono text-xs uppercase tracking-wide text-ink transition-colors hover:border-signal/60 hover:text-signal"
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
