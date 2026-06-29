'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import {
  IconChefHat,
  IconLeaf,
  IconTruck,
  IconClock,
  IconShieldCheck,
  IconHeart,
} from '@tabler/icons-react'

// ============================================================
// GLAZZY — WhyGlazzy Section
// ============================================================

const REASONS = [
  {
    icon: IconChefHat,
    title: 'Dibuat Fresh',
    desc: 'Setiap batch dibuat pagi hari — tidak ada donut kemarin.',
  },
  {
    icon: IconLeaf,
    title: 'Bahan Premium',
    desc: 'Tepung pilihan, cokelat couverture, susu segar tanpa pengawet.',
  },
  {
    icon: IconTruck,
    title: 'Pickup & Delivery',
    desc: 'Ambil langsung atau pesan antar ke lokasi kamu.',
  },
  {
    icon: IconClock,
    title: 'Buka 7 Hari',
    desc: 'Senin–Sabtu 08.00–22.00, Minggu 08.00–20.00.',
  },
  {
    icon: IconShieldCheck,
    title: 'Aman & Higienis',
    desc: 'Dapur bersertifikat, packaging sealed, standar food safety.',
  },
  {
    icon: IconHeart,
    title: 'Community First',
    desc: 'Sejak 2021, GLAZZY tumbuh bareng komunitas Jakarta.',
  },
]

export default function WhyGlazzy() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const prefersReduced = useReducedMotion()

  return (
    <section
      ref={ref}
      className="border-t border-border bg-cream px-4 py-14 sm:px-6 lg:px-8"
      aria-labelledby="why-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="font-display text-sm italic text-glaze-pink">Kenapa GLAZZY?</p>
          <h2 id="why-heading" className="mt-1 font-display text-2xl font-bold text-midnight sm:text-3xl">
            Serius soal kualitas
          </h2>
          <span className="accent-bar mx-auto mt-4" aria-hidden="true" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason, i) => {
            const Icon = reason.icon
            return (
              <motion.div
                key={reason.title}
                initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.07, type: 'spring', stiffness: 260, damping: 24 }}
                className="flex gap-4 rounded-2xl border border-border bg-card p-5"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-glaze-pink/10"
                  aria-hidden="true"
                >
                  <Icon size={20} stroke={1.75} className="text-glaze-pink" />
                </div>
                <div>
                  <p className="font-semibold text-midnight">{reason.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-midnight/60">{reason.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
