import { Link } from 'react-router-dom'
import { Kicker } from '../components/Section'

function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-32 md:px-10">
      <Kicker>signal lost</Kicker>
      <p className="font-mono text-7xl font-semibold text-signal">404</p>
      <h1 className="text-2xl font-semibold tracking-tight">No trace on this channel</h1>
      <p className="max-w-md text-muted">
        That page doesn't exist. It may have moved, or it never shipped.
      </p>
      <Link
        to="/"
        className="rounded-sm bg-signal px-5 py-3 font-mono text-sm uppercase tracking-wide text-bg transition-transform hover:-translate-y-0.5"
      >
        Back home →
      </Link>
    </div>
  )
}

export default NotFound
