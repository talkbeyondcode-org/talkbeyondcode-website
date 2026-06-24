import { useState } from 'react'

function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-10">
        <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-center">
          <div>
            <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-semibold tracking-tight">
              Get the drops in your inbox
            </h2>
            <p className="mt-3 text-muted">One email when something new ships. No noise.</p>
          </div>

          {done ? (
            <p
              role="status"
              className="flex items-center gap-3 rounded-sm border border-signal/50 bg-surface/40 px-4 py-3 font-mono text-sm text-signal"
            >
              <span aria-hidden="true">✓</span> You're on the list. Watch your inbox.
            </p>
          ) : (
            <form
              className="flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault()
                if (email.trim()) setDone(true)
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@work.dev"
                aria-label="Email address"
                className="min-w-0 flex-1 rounded-sm border border-line bg-bg px-4 py-3 font-mono text-sm text-ink placeholder:text-muted focus:border-signal focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-sm bg-signal px-5 py-3 font-mono text-sm uppercase tracking-wide text-bg transition-transform hover:-translate-y-0.5"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
        {/* polite announcement for assistive tech even though the success node also carries role=status */}
        <p className="sr-only" aria-live="polite">
          {done ? 'Subscription confirmed.' : ''}
        </p>
      </div>
    </section>
  )
}

export default Newsletter
