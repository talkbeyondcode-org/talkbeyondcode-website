import { useState } from 'react'

const SUBSCRIBE_URL = 'https://www.youtube.com/@TalkBeyondCode'

/* Email capture band. No backend yet, so it points subscribers at the
   channel; the form is here so the wiring is trivial when a list exists. */
function Newsletter() {
  const [email, setEmail] = useState('')

  return (
    <div className="rounded-[24px] border border-line bg-surface px-6 py-12 text-center md:px-12 md:py-14">
      <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-tight text-ink">
        Get the drops in your inbox
      </h2>
      <p className="mx-auto mt-2 max-w-md text-muted">
        One email when something new ships. No noise.
      </p>
      <form
        className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault()
          window.open(SUBSCRIBE_URL, '_blank', 'noreferrer')
        }}
      >
        <label htmlFor="news-email" className="sr-only">
          Email address
        </label>
        <input
          id="news-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@work.dev"
          className="min-w-0 flex-1 rounded-full border border-line bg-bg px-5 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-primary px-7 py-3 font-mono text-[0.8rem] font-bold uppercase tracking-[0.1em] text-white transition-transform hover:-translate-y-0.5 hover:bg-primary-deep"
        >
          Subscribe
        </button>
      </form>
    </div>
  )
}

export default Newsletter
