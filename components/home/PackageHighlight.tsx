'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { IconArrowRight, IconPackage } from '@tabler/icons-react'
import { packages } from '@/lib/data/packages'
import { formatRupiah, cn } from '@/lib/utils'

// ============================================================
// GLAZZY — PackageHighlight (Homepage)
// Tampilkan 4 paket utama
// ============================================================

const HIGHLIGHT_IDS = ['pkg-02', 'pkg-03', 'pkg-04', 'pkg-07']

const CARD_ACCENTS = [
  'border-lemon-curd/40 bg-lemon-curd/8',
  'border-border bg-card',
  'border-glaze-pink/30 bg-glaze-pink/5',
  'border-border bg-card',
]

export default function PackageHighlight() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const prefersReduced = useReducedMotion()

  const highlighted = HIGHLIGHT_IDS.map((id) => packages.find((p) => p.id === id)).filter(Boolean) as typeof packages

  return (
    <section
      ref={ref}
      className="bg-cream px-4 py-14 sm:px-6 lg:px-8"
      aria-labelledby="pkg-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="font-display text-sm italic text-glaze-pink">Hemat lebih banyak</p>
            <h2 id="pkg-heading" className="mt-1 font-display text-2xl font-bold text-midnight sm:text-3xl">
              Paket & Box
            </h2>
            <span className="accent-bar mt-3" aria-hidden="true" />
          </div>
          <Link
            href="/packages"
            className="flex items-center gap-1 text-sm font-medium text-glaze-pink transition-colors hover:text-burnt-sugar focus-visible:rounded focus-visible:outline-2 focus-visible:outline-glaze-pink"
          >
            Semua paket
            <IconArrowRight size={15} stroke={2.5} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {highlighted.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={prefersReduced ? {} : { opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 260, damping: 24 }}
            >
              <Link
                href="/packages"
                className={cn(
                  'group relative flex flex-col gap-3 rounded-2xl border p-5 transition-all duration-200',
                  'hover:-translate-y-1 hover:shadow-[0_8px_24px_0_rgb(0_0_0/0.08)]',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glaze-pink',
                  CARD_ACCENTS[i] ?? 'border-border bg-card',
                )}
              >
                {pkg.badge && (
                  <span className="absolute right-3 top-3 rounded-full bg-glaze-pink px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    {pkg.badge}
                  </span>
                )}
                <IconPackage
                  size={28}
                  stroke={1.5}
                  className="text-glaze-pink"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-midnight">{pkg.name}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-midnight/55">{pkg.description}</p>
                </div>
                <p className="mt-auto font-display text-xl font-bold text-midnight">
                  {pkg.price === 0 ? 'Pilih di menu' : formatRupiah(pkg.price)}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
