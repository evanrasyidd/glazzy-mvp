'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { IconArrowRight, IconShoppingBag } from '@tabler/icons-react'
import DonutIllustration from '@/components/ui/DonutIllustration'
import { donuts } from '@/lib/data/donuts'

const HERO_DONUTS = [
  donuts.find((d) => d.id === 'berry-01')!,
  donuts.find((d) => d.id === 'classic-06')!,
  donuts.find((d) => d.id === 'classic-05')!,
  donuts.find((d) => d.id === 'berry-02')!,
]

// Rotasi statik per donut — JANGAN pakai style={{ rotate }} inline
// karena itu bikin SSR vs client mismatch di Framer Motion
const DONUT_ROTATES = [-8, 4, -12, 6]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 24 } },
}

// Posisi absolut tiap donut — definisikan di sini, bukan style inline dinamis
const DONUT_POSITIONS = [
  { className: 'absolute',                         size: 200 },
  { className: 'absolute -right-2 -top-4',         size: 130 },
  { className: 'absolute -bottom-4 -left-4',       size: 140 },
  { className: 'absolute -bottom-2 right-0',       size: 110 },
]

export default function HeroSection() {
  const prefersReduced = useReducedMotion()

  return (
    <section
      className="relative overflow-hidden bg-cream px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
      aria-labelledby="hero-heading"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-[500px] w-[500px] rounded-full bg-glaze-pink/5" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-[320px] w-[320px] rounded-full bg-lemon-curd/8" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left: Copy */}
        <motion.div
          variants={prefersReduced ? {} : containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.p variants={prefersReduced ? {} : itemVariants} className="mb-3 font-display text-sm italic text-glaze-pink">
            Made fresh. Glazed right.
          </motion.p>
          <motion.h1
            id="hero-heading"
            variants={prefersReduced ? {} : itemVariants}
            className="font-display text-5xl font-extrabold leading-[1.1] tracking-tight text-midnight sm:text-6xl lg:text-7xl"
          >
            Donut yang{' '}
            <span className="italic text-glaze-pink">u deserved.</span>
          </motion.h1>
          <motion.p variants={prefersReduced ? {} : itemVariants} className="mt-6 max-w-md text-lg leading-relaxed text-midnight/65">
            23 varian rasa, dibuat fresh setiap pagi. Pickup langsung atau delivery ke pintu kamu.
          </motion.p>
          <motion.div variants={prefersReduced ? {} : itemVariants} className="mt-8 flex flex-wrap gap-3">
            <Link href="/menu" className="flex items-center gap-2 rounded-xl bg-glaze-pink px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-burnt-sugar focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glaze-pink active:scale-95">
              <IconShoppingBag size={18} stroke={2} aria-hidden="true" />
              Lihat Menu
            </Link>
            <Link href="/packages" className="flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-midnight transition-colors duration-150 hover:border-glaze-pink hover:text-glaze-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glaze-pink active:scale-95">
              Paket & Box
              <IconArrowRight size={16} stroke={2.5} aria-hidden="true" />
            </Link>
          </motion.div>
          <motion.div variants={prefersReduced ? {} : itemVariants} className="mt-10 flex gap-8">
            {[
              { value: '23', label: 'Varian rasa' },
              { value: 'Fresh', label: 'Tiap pagi' },
              { value: '8', label: 'Paket box' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="font-display text-2xl font-bold text-midnight">{value}</p>
                <p className="text-xs text-midnight/50">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: Donuts — TANPA style={{ rotate }} inline */}
        <div
          className="relative mx-auto flex h-[360px] w-[360px] items-center justify-center sm:h-[420px] sm:w-[420px]"
          aria-hidden="true"
        >
          {HERO_DONUTS.map((donut, i) => (
            <motion.div
              key={donut.id}
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
              animate={{
                opacity: 1,
                scale: 1,
                // rotate masuk ke animate, bukan style prop — ini SSR-safe
                rotate: DONUT_ROTATES[i],
              }}
              whileHover={prefersReduced ? {} : { rotate: 0, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.25 + i * 0.12 }}
              className={DONUT_POSITIONS[i].className}
            >
              <DonutIllustration
                color={donut.color}
                accentColor={donut.accentColor}
                name={donut.name}
                size={DONUT_POSITIONS[i].size}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
