'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { IconStar } from '@tabler/icons-react'

// ============================================================
// GLAZZY — PromoBand
// Strip glaze-pink dengan teks berulang
// ============================================================

const PROMO_ITEMS = [
  'Free Box untuk pembelian 2 lusin',
  'Donut fresh tiap pagi',
  'Pickup & Delivery tersedia',
  'Transfer Bank & QRIS',
  '23 varian rasa pilihan',
  'Paket mulai Box of 3',
]

// Duplikasi untuk seamless loop
const ITEMS_DOUBLED = [...PROMO_ITEMS, ...PROMO_ITEMS]

export default function PromoBand() {
  const prefersReduced = useReducedMotion()

  return (
    <div
      className="overflow-hidden bg-glaze-pink py-3"
      aria-label="Promo dan informasi GLAZZY"
    >
      <motion.div
        className="flex w-max items-center gap-0"
        animate={prefersReduced ? {} : { x: ['0%', '-50%'] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 22,
            ease: 'linear',
          },
        }}
        aria-hidden="true"
      >
        {ITEMS_DOUBLED.map((item, i) => (
          <span key={i} className="flex items-center gap-4 px-6">
            <span className="whitespace-nowrap text-sm font-semibold text-white">{item}</span>
            <IconStar
              size={12}
              fill="currentColor"
              className="shrink-0 text-lemon-curd"
              aria-hidden="true"
            />
          </span>
        ))}
      </motion.div>
      {/* Screen reader version */}
      <p className="sr-only">{PROMO_ITEMS.join(' · ')}</p>
    </div>
  )
}
