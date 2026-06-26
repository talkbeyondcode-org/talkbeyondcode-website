import { Link } from 'react-router-dom'
import { Kicker } from '../components/Section'

function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-32 md:px-10">
      <Kicker>SIGNAL LOST</Kicker>
      <p className="font-mono text-7xl font-bold grad-text">404</p>
      <h1 className="text-3xl font-bold tracking-tight text-ink">No trace on this channel</h1>
      <p className="max-w-md text-muted">
        That page doesn’t exist. It may have moved, or it never shipped.
      </p>
      <Link
        to="/"
        className="rounded-full bg-primary px-6 py-3 font-mono text-[0.8rem] font-bold uppercase tracking-[0.1em] text-white transition-transform hover:-translate-y-0.5 hover:bg-primary-deep"
      >
        Back home →
      </Link>
    </div>
  )
}

export default NotFound
