import { useId } from 'react'

/* The TBC mark: two brand-gradient chevrons (< >) flanking three dark
   waveform bars (short-tall-short). Exact vector from Figma node 166:473.
   `size` sets the height; width follows the 152:104 aspect ratio. A unique
   gradient id per instance avoids <defs> collisions on a page. */
export function TbcMark({ size = 36, className = '' }: { size?: number; className?: string }) {
  const id = useId().replace(/:/g, '')
  const gl = `tbc-l-${id}`
  const gr = `tbc-r-${id}`
  const width = Math.round((size * 152) / 104)
  return (
    <svg
      width={width}
      height={size}
      viewBox="0 0 152 104"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path d="M52 8L8 52L52 96" stroke={`url(#${gl})`} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M100 8L144 52L100 96" stroke={`url(#${gr})`} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M56 36V68" stroke="#0B1220" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M76 18V86" stroke="#0B1220" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M96 36V68" stroke="#0B1220" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id={gl} x1="8" y1="8" x2="78.4" y2="43.2" gradientUnits="userSpaceOnUse">
          <stop stopColor="#35C4DA" />
          <stop offset="0.55" stopColor="#6F3FDB" />
          <stop offset="1" stopColor="#DA4BF0" />
        </linearGradient>
        <linearGradient id={gr} x1="100" y1="8" x2="170.4" y2="43.2" gradientUnits="userSpaceOnUse">
          <stop stopColor="#35C4DA" />
          <stop offset="0.55" stopColor="#6F3FDB" />
          <stop offset="1" stopColor="#DA4BF0" />
        </linearGradient>
      </defs>
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
