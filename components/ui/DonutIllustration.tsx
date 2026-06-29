'use client'

import { memo, useId } from 'react'
import { cn } from '@/lib/utils'

// ============================================================
// GLAZZY — DonutIllustration
// r4() = round ke 4 desimal → identical output server & client
// ============================================================

// Semua angka float di SVG harus diround agar SSR == client
const r4 = (n: number) => Math.round(n * 10000) / 10000

interface DonutIllustrationProps {
  color: string
  accentColor: string
  name: string
  size?: number
  className?: string
  sprinkleCount?: number
}

function DonutIllustration({
  color,
  accentColor,
  name,
  size = 120,
  className,
  sprinkleCount = 6,
}: DonutIllustrationProps) {
  const uid = useId().replace(/:/g, '-')

  const cx = r4(size / 2)
  const cy = r4(size / 2)
  const outerR = r4(size * 0.42)
  const innerR = r4(size * 0.18)
  const glazeR  = r4(size * 0.38)

  const sprinkles = Array.from({ length: sprinkleCount }, (_, i) => {
    const angle = r4((i / sprinkleCount) * Math.PI * 2 - Math.PI / 4)
    const rr = r4(outerR * 0.62 + (i % 2 === 0 ? 4 : -4))
    return {
      x: r4(cx + Math.cos(angle) * rr),
      y: r4(cy + Math.sin(angle) * rr),
      rotate: (i * 47) % 180,
    }
  })

  const glareAngle = r4(-Math.PI * 0.65)
  const glareRad   = r4(outerR * 0.72)
  const glareX     = r4(cx + Math.cos(glareAngle) * glareRad)
  const glareY     = r4(cy + Math.sin(glareAngle) * glareRad)

  const bodyGradId = `body-${uid}`
  const glazeGradId = `glaze-${uid}`
  const maskId = `hole-${uid}`

  // Sprinkle dimensions — pre-rounded
  const sw = r4(size * 0.044)
  const sh = r4(size * 0.11)
  const srx = r4(size * 0.022)

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('select-none', className)}
      role="img"
      aria-label={`Ilustrasi donut ${name}`}
    >
      <defs>
        <radialGradient id={bodyGradId} cx="40%" cy="35%" r="65%" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.9" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="1" />
        </radialGradient>
        <radialGradient id={glazeGradId} cx="38%" cy="32%" r="70%" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor={color} stopOpacity="0.95" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </radialGradient>
        <mask id={maskId}>
          <rect width={size} height={size} fill="white" />
          <circle cx={cx} cy={cy} r={innerR} fill="black" />
        </mask>
      </defs>

      {/* Shadow */}
      <ellipse
        cx={cx}
        cy={r4(cy + outerR * 0.85)}
        rx={r4(outerR * 0.8)}
        ry={r4(outerR * 0.15)}
        fill={accentColor}
        opacity="0.18"
      />

      {/* Bodi donut */}
      <circle cx={cx} cy={cy} r={outerR} fill={`url(#${bodyGradId})`} mask={`url(#${maskId})`} />

      {/* Glaze */}
      <path
        d={describeGlazePath(cx, cy, glazeR, r4(innerR + size * 0.04))}
        fill={`url(#${glazeGradId})`}
        mask={`url(#${maskId})`}
      />

      {/* Sprinkles */}
      {sprinkles.map((s, i) => (
        <rect
          key={i}
          x={r4(s.x - sw / 2)}
          y={r4(s.y - sh / 2)}
          width={sw}
          height={sh}
          rx={srx}
          fill={i % 3 === 0 ? '#FFFFFF' : i % 3 === 1 ? '#FFE08A' : accentColor}
          opacity="0.92"
          transform={`rotate(${s.rotate}, ${s.x}, ${s.y})`}
        />
      ))}

      {/* Highlight glare */}
      <ellipse
        cx={glareX}
        cy={glareY}
        rx={r4(size * 0.065)}
        ry={r4(size * 0.035)}
        fill="white"
        opacity="0.35"
        transform={`rotate(-35, ${glareX}, ${glareY})`}
      />

      {/* Inner hole rim */}
      <circle
        cx={cx}
        cy={cy}
        r={r4(innerR + size * 0.015)}
        stroke={accentColor}
        strokeWidth={r4(size * 0.025)}
        fill="none"
        opacity="0.4"
      />
    </svg>
  )
}

function describeGlazePath(cx: number, cy: number, outerR: number, innerR: number): string {
  const startAngle = Math.PI * 0.1

  const ox1 = r4(cx + Math.cos(Math.PI + startAngle) * outerR)
  const oy1 = r4(cy + Math.sin(Math.PI + startAngle) * outerR)
  const ox2 = r4(cx + Math.cos(Math.PI * 2 - startAngle) * outerR)
  const oy2 = r4(cy + Math.sin(Math.PI * 2 - startAngle) * outerR)
  const ix1 = r4(cx + Math.cos(Math.PI * 2 - startAngle) * innerR)
  const iy1 = r4(cy + Math.sin(Math.PI * 2 - startAngle) * innerR)
  const ix2 = r4(cx + Math.cos(Math.PI + startAngle) * innerR)
  const iy2 = r4(cy + Math.sin(Math.PI + startAngle) * innerR)

  return [
    `M ${ox1} ${oy1}`,
    `A ${outerR} ${outerR} 0 1 1 ${ox2} ${oy2}`,
    `L ${ix1} ${iy1}`,
    `A ${innerR} ${innerR} 0 1 0 ${ix2} ${iy2}`,
    'Z',
  ].join(' ')
}

export default memo(DonutIllustration)
