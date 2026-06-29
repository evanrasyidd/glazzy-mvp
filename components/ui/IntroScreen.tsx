'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ============================================================
// GLAZZY — Intro Screen
// Muncul sekali per session, dismiss otomatis setelah 2.6s
// ============================================================

export default function IntroScreen() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const seen = sessionStorage.getItem('glazzy-intro-v1')
    if (!seen) {
      setVisible(true)
      sessionStorage.setItem('glazzy-intro-v1', '1')
      const t = setTimeout(() => setVisible(false), 2600)
      return () => clearTimeout(t)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-midnight select-none"
          aria-hidden="true"
        >
          {/* Donut + sprinkle ring */}
          <motion.div
            initial={{ scale: 0.5, rotate: -30, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 16, delay: 0.05 }}
            className="relative"
          >
            <svg width="108" height="108" viewBox="0 0 108 108" fill="none" aria-hidden="true">
              {/* Outer sprinkle orbit dots */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
                const rad = (deg * Math.PI) / 180
                const cx = 54 + 50 * Math.cos(rad)
                const cy = 54 + 50 * Math.sin(rad)
                return (
                  <circle
                    key={deg}
                    cx={cx}
                    cy={cy}
                    r={i % 2 === 0 ? 2.5 : 1.8}
                    fill={i % 3 === 0 ? '#F5C842' : i % 3 === 1 ? '#D580B8' : '#FFFFFF'}
                    opacity={0.5}
                  />
                )
              })}
              {/* Donut body */}
              <circle cx="54" cy="54" r="36" fill="#B5338A" />
              {/* Glaze highlight */}
              <ellipse cx="54" cy="40" rx="26" ry="16" fill="#D580B8" opacity="0.65" />
              {/* Hole */}
              <circle cx="54" cy="54" r="15" fill="#1A1A2E" />
              <circle cx="54" cy="54" r="16" stroke="#D580B8" strokeWidth="1.5" fill="none" opacity="0.4" />
              {/* Sprinkles on donut */}
              <rect x="68" y="32" width="5" height="11" rx="2.5" fill="#F5C842" transform="rotate(28 70.5 37.5)" />
              <rect x="28" y="34" width="5" height="11" rx="2.5" fill="#FFFFFF" transform="rotate(-22 30.5 39.5)" />
              <rect x="70" y="56" width="5" height="11" rx="2.5" fill="#F5C842" transform="rotate(48 72.5 61.5)" />
              <rect x="30" y="56" width="5" height="11" rx="2.5" fill="#D580B8" transform="rotate(-40 32.5 61.5)" />
              {/* Shine */}
              <ellipse cx="43" cy="33" rx="8" ry="3.5" fill="white" opacity="0.28" transform="rotate(-30 43 33)" />
            </svg>
          </motion.div>

          {/* Wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 text-center"
          >
            <p className="font-display text-[2.6rem] font-extrabold italic leading-none tracking-tight text-glaze-pink">
              GLAZZY
            </p>
            <p className="mt-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
              Made fresh. Glazed right.
            </p>
          </motion.div>

          {/* Progress bar */}
          <motion.span
            className="absolute bottom-0 left-0 h-[3px] bg-glaze-pink"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.55, ease: 'linear', delay: 0.05 }}
            aria-hidden="true"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
