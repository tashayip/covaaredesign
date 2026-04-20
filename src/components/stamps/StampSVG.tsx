import type { StampId } from '@/types'

export interface StampConfig {
  id: StampId
  label: string
  short: string
  bg: string
  fg: string
  denom: string
}

export const STAMP_CONFIGS: Record<StampId, StampConfig> = {
  culture:     { id: 'culture',     label: 'Classroom Culture',  short: 'Culture',     bg: '#4A7C59', fg: '#E8F5E2', denom: '25¢' },
  preparation: { id: 'preparation', label: 'Lesson Preparation', short: 'Preparation', bg: '#2B4C7E', fg: '#D6E4F5', denom: '30¢' },
  enactment:   { id: 'enactment',   label: 'Lesson Delivery',    short: 'Delivery',    bg: '#C86948', fg: '#FAF0EB', denom: '35¢' },
  assessment:  { id: 'assessment',  label: 'Assessment',         short: 'Assessment',  bg: '#7A5C14', fg: '#FFF3CC', denom: '40¢' },
  other:       { id: 'other',       label: 'Something Else',     short: 'Other',       bg: '#6B4E7C', fg: '#EEE0F5', denom: '20¢' },
}

export const STAMP_ORDER: StampId[] = ['culture', 'preparation', 'enactment', 'assessment', 'other']

interface IconProps { W: number; H: number; fg: string; bg: string }

/** Plant / seedling — Classroom Culture */
function CultureIcon({ W, H, fg }: IconProps) {
  const cx = W / 2, s = W / 52
  const base = H * 0.82

  return (
    <>
      {/* ground */}
      <line x1={cx - 12 * s} y1={base} x2={cx + 12 * s} y2={base}
        stroke={fg} strokeWidth={1.2 * s} strokeLinecap="round" opacity={0.35} />
      {/* stem */}
      <line x1={cx} y1={base} x2={cx} y2={base - 26 * s}
        stroke={fg} strokeWidth={2 * s} strokeLinecap="round" />
      {/* left leaf */}
      <path
        d={`M${cx},${base - 9 * s} Q${cx - 12 * s},${base - 17 * s} ${cx - 8 * s},${base - 28 * s} Q${cx - 3 * s},${base - 18 * s} ${cx},${base - 11 * s}Z`}
        fill={fg} />
      {/* right leaf */}
      <path
        d={`M${cx},${base - 14 * s} Q${cx + 12 * s},${base - 22 * s} ${cx + 8 * s},${base - 32 * s} Q${cx + 3 * s},${base - 22 * s} ${cx},${base - 16 * s}Z`}
        fill={fg} opacity={0.75} />
      {/* bud */}
      <circle cx={cx} cy={base - 29 * s} r={3.5 * s} fill={fg} />
    </>
  )
}

/** Open book — Lesson Preparation */
function PreparationIcon({ W, H, fg, bg }: IconProps) {
  const cx = W / 2, s = W / 52
  const top = H * 0.28
  const bot = H * 0.82
  const ph = bot - top

  return (
    <>
      {/* left page */}
      <rect x={cx - 17 * s} y={top} width={15 * s} height={ph} rx={1.2 * s} fill={fg} opacity={0.9} />
      {/* right page */}
      <rect x={cx + 2 * s} y={top} width={15 * s} height={ph} rx={1.2 * s} fill={fg} opacity={0.68} />
      {/* spine */}
      <rect x={cx - 1 * s} y={top} width={2 * s} height={ph} fill={fg} />
      {/* text lines — left */}
      {[0.22, 0.40, 0.57, 0.74].map((t, i) => (
        <line key={`l${i}`}
          x1={cx - 15 * s} y1={top + t * ph} x2={cx - 3 * s} y2={top + t * ph}
          stroke={bg} strokeWidth={1.3 * s} strokeLinecap="round" opacity={0.4} />
      ))}
      {/* text lines — right */}
      {[0.22, 0.40, 0.57].map((t, i) => (
        <line key={`r${i}`}
          x1={cx + 3 * s} y1={top + t * ph} x2={cx + 14 * s} y2={top + t * ph}
          stroke={bg} strokeWidth={1.3 * s} strokeLinecap="round" opacity={0.4} />
      ))}
    </>
  )
}

/** Bird in flight — Lesson Delivery */
function EnactmentIcon({ W, H, fg, bg }: IconProps) {
  const cx = W / 2, s = W / 52
  const cy = H / 2 + 4 * s

  return (
    <>
      {/* body */}
      <ellipse cx={cx} cy={cy} rx={10 * s} ry={5 * s} fill={fg} />
      {/* head */}
      <circle cx={cx + 9 * s} cy={cy - 5 * s} r={5 * s} fill={fg} />
      {/* beak */}
      <path
        d={`M${cx + 13 * s},${cy - 5 * s} L${cx + 19 * s},${cy - 4 * s} L${cx + 13 * s},${cy - 3 * s}Z`}
        fill={fg} opacity={0.72} />
      {/* raised wing */}
      <path
        d={`M${cx - 9 * s},${cy - 1 * s} Q${cx - 3 * s},${cy - 16 * s} ${cx + 4 * s},${cy - 11 * s} Q${cx + 1 * s},${cy - 5 * s} ${cx - 5 * s},${cy - 2 * s}Z`}
        fill={fg} opacity={0.88} />
      {/* tail feathers */}
      {[[-3 * s, -5 * s], [-4 * s, 0], [-3 * s, 5 * s]].map(([dx, dy], i) => (
        <line key={i}
          x1={cx - 9 * s} y1={cy} x2={cx - 18 * s + dx} y2={cy + dy}
          stroke={fg} strokeWidth={1.8 * s} strokeLinecap="round" />
      ))}
      {/* eye */}
      <circle cx={cx + 10 * s} cy={cy - 6 * s} r={1.3 * s} fill={bg} />
    </>
  )
}

/** Sun with check — Assessment & Feedback */
function AssessmentIcon({ W, H, fg, bg }: IconProps) {
  const cx = W / 2, s = W / 52
  const cy = H / 2 + 2 * s
  const R = 9 * s

  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2
    return {
      x1: cx + Math.cos(a) * (R + 2 * s), y1: cy + Math.sin(a) * (R + 2 * s),
      x2: cx + Math.cos(a) * (R + 6 * s), y2: cy + Math.sin(a) * (R + 6 * s),
    }
  })

  return (
    <>
      {rays.map((r, i) => (
        <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
          stroke={fg} strokeWidth={2.4 * s} strokeLinecap="round" />
      ))}
      <circle cx={cx} cy={cy} r={R} fill={fg} />
      {/* checkmark */}
      <path
        d={`M${cx - 4 * s},${cy} L${cx - 1 * s},${cy + 3.5 * s} L${cx + 5.5 * s},${cy - 4 * s}`}
        stroke={bg} strokeWidth={2 * s} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  )
}

/** Three-petal lotus — Something Else */
function OtherIcon({ W, H, fg }: IconProps) {
  const cx = W / 2, s = W / 52
  const cy = H / 2 + 2 * s

  return (
    <>
      {/* stem */}
      <line x1={cx} y1={cy + 14 * s} x2={cx} y2={cy + 2 * s}
        stroke={fg} strokeWidth={2 * s} strokeLinecap="round" />
      {/* left petal */}
      <path
        d={`M${cx},${cy + 2 * s} Q${cx - 14 * s},${cy - 4 * s} ${cx - 10 * s},${cy - 16 * s} Q${cx - 2 * s},${cy - 8 * s} ${cx},${cy}Z`}
        fill={fg} opacity={0.72} />
      {/* right petal */}
      <path
        d={`M${cx},${cy + 2 * s} Q${cx + 14 * s},${cy - 4 * s} ${cx + 10 * s},${cy - 16 * s} Q${cx + 2 * s},${cy - 8 * s} ${cx},${cy}Z`}
        fill={fg} opacity={0.72} />
      {/* centre petal (tallest) */}
      <path
        d={`M${cx},${cy + 2 * s} Q${cx - 8 * s},${cy - 8 * s} ${cx},${cy - 20 * s} Q${cx + 8 * s},${cy - 8 * s} ${cx},${cy + 2 * s}Z`}
        fill={fg} opacity={0.96} />
    </>
  )
}

/* ─────────────────────────────────────────────────────── */

interface StampSVGProps {
  id: StampId
  W?: number
  H?: number
  maskSuffix?: string
}

export function StampSVG({ id, W = 52, H = 64, maskSuffix = '' }: StampSVGProps) {
  const cfg = STAMP_CONFIGS[id]
  const r   = W * 0.075   // larger holes — more authentic stamp feel
  const sp  = W * 0.115   // tighter spacing
  const maskId = `pm_${id}${maskSuffix}_${W}_${H}`
  const noiseId = `noise_${maskId}`
  const fs = Math.round(W * 0.088)
  const letterSpacing = (W * 0.014).toFixed(1)

  const holes: Array<{ cx: number; cy: number }> = []
  for (let x = sp; x <= W - sp * 0.4; x += sp) {
    holes.push({ cx: x, cy: 0 })
    holes.push({ cx: x, cy: H })
  }
  for (let y = sp; y <= H - sp * 0.4; y += sp) {
    holes.push({ cx: 0, cy: y })
    holes.push({ cx: W, cy: y })
  }

  const iconProps: IconProps = { W, H, fg: cfg.fg, bg: cfg.bg }

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg" role="img" aria-label={`${cfg.label} stamp`}>
      <defs>
        <mask id={maskId}>
          <rect width={W} height={H} fill="white" />
          {holes.map((h, i) => (
            <circle key={i} cx={h.cx.toFixed(1)} cy={h.cy.toFixed(1)} r={r.toFixed(1)} />
          ))}
        </mask>
        {/* richer paper grain with warm tint */}
        <filter id={noiseId} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" result="noise" />
          <feColorMatrix type="matrix"
            values="1 0 0 0 0.02  0 1 0 0 0.01  0 0 1 0 -0.01  0 0 0 20 -10"
            in="noise" result="tinted" />
          <feBlend in="SourceGraphic" in2="tinted" mode="multiply" result="blend" />
          <feComposite in="blend" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {/* stamp body */}
      <rect width={W} height={H} fill={cfg.bg} mask={`url(#${maskId})`} />

      {/* paper noise overlay */}
      <rect width={W} height={H} fill="rgba(255,255,255,0.09)"
        mask={`url(#${maskId})`} style={{ filter: `url(#${noiseId})` }} />

      {/* outer border frame */}
      <rect x={W * 0.08} y={H * 0.065} width={W * 0.84} height={H * 0.87}
        fill="none" stroke={cfg.fg} strokeWidth={0.8} opacity={0.25} mask={`url(#${maskId})`} />
      {/* inner border frame */}
      <rect x={W * 0.13} y={H * 0.10} width={W * 0.74} height={H * 0.80}
        fill="none" stroke={cfg.fg} strokeWidth={0.4} opacity={0.18} mask={`url(#${maskId})`} />

      {/* icon */}
      {id === 'culture'     && <CultureIcon     {...iconProps} />}
      {id === 'preparation' && <PreparationIcon {...iconProps} />}
      {id === 'enactment'   && <EnactmentIcon   {...iconProps} />}
      {id === 'assessment'  && <AssessmentIcon  {...iconProps} />}
      {id === 'other'       && <OtherIcon       {...iconProps} />}

      {/* CoVAA label at top */}
      <text x={W / 2} y={(W * 0.14).toFixed(1)} textAnchor="middle"
        fontFamily="Space Grotesk Variable, sans-serif" fontSize={fs}
        fontWeight={700} letterSpacing={letterSpacing} fill={cfg.fg} opacity={0.55}>
        CoVAA
      </text>

      {/* denomination at bottom */}
      <text x={W / 2} y={(H - W * 0.06).toFixed(1)} textAnchor="middle"
        fontFamily="Space Grotesk Variable, sans-serif" fontSize={fs * 0.9}
        fontWeight={400} fill={cfg.fg} opacity={0.4}>
        {cfg.denom}
      </text>
    </svg>
  )
}

export function StampSVGSmall({ id, maskSuffix = '' }: { id: StampId; maskSuffix?: string }) {
  return <StampSVG id={id} W={30} H={38} maskSuffix={maskSuffix} />
}

export function OpenLetterStamp({ active }: { active: boolean }) {
  const W = 68, H = 84
  const bg = active ? '#4A7C59' : '#C8C0B4'
  const fg = active ? '#E8F5E2' : '#A0988E'
  const r = W * 0.062, sp = W * 0.13
  const maskId = `ol_${active ? 1 : 0}`
  const holes: Array<{ cx: number; cy: number }> = []
  for (let x = sp; x <= W - sp * 0.4; x += sp) {
    holes.push({ cx: x, cy: 0 })
    holes.push({ cx: x, cy: H })
  }
  for (let y = sp; y <= H - sp * 0.4; y += sp) {
    holes.push({ cx: 0, cy: y })
    holes.push({ cx: W, cy: y })
  }
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <mask id={maskId}>
          <rect width={W} height={H} fill="white" />
          {holes.map((h, i) => (
            <circle key={i} cx={h.cx.toFixed(1)} cy={h.cy.toFixed(1)} r={r.toFixed(1)} />
          ))}
        </mask>
      </defs>
      <rect width={W} height={H} fill={bg} mask={`url(#${maskId})`} />
      <rect x="13" y="26" width="42" height="28" rx="2" fill="none" stroke={fg} strokeWidth="2" />
      <path d="M13 26 L34 42 L55 26" stroke={fg} strokeWidth="2" fill="none" strokeLinecap="round" />
      <text x={W / 2} y="18" textAnchor="middle"
        fontFamily="Space Grotesk Variable, sans-serif" fontSize="5.5" fontWeight="700"
        letterSpacing="1.5" fill={fg} opacity={0.7}>OPEN</text>
      <text x={W / 2} y="72" textAnchor="middle"
        fontFamily="Space Grotesk Variable, sans-serif" fontSize="4.5" fontWeight="600"
        letterSpacing="1.5" fill={fg} opacity={0.55}>LETTERBOX</text>
    </svg>
  )
}
