import { useId } from 'react'

/* The TBC mark: a brand-gradient diamond framing three dark “equalizer”
   bars (a nod to the podcast waveform). Renders crisply on light surfaces.
   A unique gradient id per instance avoids <defs> collisions on a page. */
export function TbcMark({ size = 40, className = '' }: { size?: number; className?: string }) {
  const gid = useId().replace(/:/g, '')
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="6" y1="10" x2="42" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22d3ee" />
          <stop offset="0.55" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#e879f9" />
        </linearGradient>
      </defs>
      <rect
        x="8"
        y="8"
        width="32"
        height="32"
        rx="9"
        transform="rotate(45 24 24)"
        stroke={`url(#${gid})`}
        strokeWidth="5"
      />
      <rect x="22.3" y="13.5" width="3.4" height="21" rx="1.7" fill="#0b1020" />
      <rect x="15.6" y="18.5" width="3.4" height="11" rx="1.7" fill="#0b1020" />
      <rect x="29" y="18.5" width="3.4" height="11" rx="1.7" fill="#0b1020" />
    </svg>
  )
}

/* “Talk” + gradient “Beyond” + “Code” in the display face. */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span
      className={`font-display text-[1.35rem] font-bold tracking-[-0.02em] text-ink ${className}`}
    >
      Talk<span className="grad-text">Beyond</span>Code
    </span>
  )
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <TbcMark size={34} />
      <Wordmark />
    </span>
  )
}
