# DESIGN.md — TalkBeyondCode

Aesthetic lane: **engineering instrument.** Reference points: a Tektronix/HP bench oscilloscope, a Unix man page, a Teenage Engineering device panel, a Klim type specimen. Cool, precise, honest. Not a crypto landing page.

## Color — strategy: Restrained (blue-black + brand cyan signal)

OKLCH only. Neutrals are the brand's cool blue-black (hue ~258, matching `#07090F` / `#0D1322`). One load-bearing signal color: **brand cyan `#22D3EE`** (also the oscilloscope trace). The full cyan→violet→magenta gradient stays on the **logo mark** as brand equity; the page surface stays restrained so cyan reads as a deliberate signal, not neon wash.

| Token | OKLCH | Role |
|---|---|---|
| `--bg` | `oklch(0.13 0.012 258)` | blue-black field (never #000) |
| `--surface` | `oklch(0.17 0.015 258)` | raised panels |
| `--surface-2` | `oklch(0.21 0.018 258)` | nested / hover |
| `--line` | `oklch(0.31 0.018 258)` | hairline grid + borders |
| `--ink` | `oklch(0.95 0.005 250)` | primary (never #fff) |
| `--muted` | `oklch(0.66 0.012 256)` | secondary / metadata |
| `--signal` | `oklch(0.80 0.12 207)` | brand cyan — accent ≤10% of surface |
| `--signal-dim` | `oklch(0.62 0.10 207)` | cyan at rest |

Brand gradient stops: cyan `#22D3EE` → violet `#8B5CF6` → magenta `#E879F9`.

**Gradient usage (graphics only, never text):** the full cyan→violet→magenta gradient lives on *graphic* elements — the logo mark, the oscilloscope trace (colored across its length), the active keycap underglow, and the short section-kicker accent bar (`<Kicker>`). NEVER on text (`background-clip:text` is a banned slop tell).

**Signal discipline (functional UI):** a single solid color — brand **cyan** — for links, buttons, focus rings, and active/live state. Cyan must stay scarce (<10% of a viewport). The gradient is for brand graphics; cyan is for interaction.

## Theme

Dark. Scene sentence: *an engineer reading at night, terminal open, a bench instrument with a cyan trace glowing on the desk.* The blue-black surface with a cyan phosphor trace is the instrument lit in a dim room — it forces dark, and keeps the brand's cool palette.

## Typography

- **Display + body:** Bricolage Grotesque (variable) — `@fontsource-variable/bricolage-grotesque`.
- **Structural / technical layer:** Martian Mono — `@fontsource/martian-mono`. Used for labels, nav, metadata, episode IDs, spec rows, kickers. This carries the instrument voice. NOT decorative — it's the readout layer.
- Deliberately **rejecting** the brand guide's Space Grotesk / Inter / JetBrains Mono (all reflex-default fonts).
- Fluid `clamp()` headings, ≥1.25 step ratio. Add ~0.06 line-height for light-on-dark body.
- Mono labels: uppercase, tracked `+0.08em`, small. Body: never uppercase.

## Layout

- **Strict, visible grid as the voice.** Hairline (`--line`) column rules and section rules, like a spec sheet / schematic. The grid is decoration *and* structure.
- Left-aligned, asymmetric where it earns emphasis. No centered icon-title-subtitle stacks.
- Spec-row pattern for lists (episodes, articles): `[mono index] [title] ........ [mono meta]` with a leading rule, not boxed cards.
- Cards only where truly the best affordance; never identical repeated grids, never nested.
- Fluid spacing with `clamp()`.

## Motion

- **Hero centerpiece:** a single Three.js WebGL **oscilloscope/waveform** (amber trace on warm black) — the "how was this made?" moment. Reacts to scroll + pointer. Load-bearing, used once.
- **GSAP ScrollTrigger** elsewhere: staggered reveals, a pinned podcast band, spec-row draw-in. Ease-out (expo/quart), no bounce, never animate layout props.
- Everything behind `prefers-reduced-motion: reduce` — the scope falls back to a static rendered trace.

## Absolute bans (enforced)

No gradient text. No side-stripe borders. No glassmorphism-by-default. No identical card grids. No hero-metric template. No em dashes in copy.

## Logo usage

- Nav: the real gradient wordmark (`tbc-logo-darkbg.svg`) in the header. (User decision 2026-06-14: keep the actual brand logo visible, not a text substitute.)
- Footer: gradient mark repeated as the sign-off.
