'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { IconArrowRight } from '@tabler/icons-react'
import DonutIllustration from '@/components/ui/DonutIllustration'
import { donuts } from '@/lib/data/donuts'
import { cn } from '@/lib/utils'

// ============================================================
// GLAZZY — CategoryShortcut
// ============================================================

const categories = [
  {
    label: 'Classic Ring',
    desc: '8 varian',
    href: '/menu?cat=classic',
    donutId: 'classic-01',
    bg: 'bg-lemon-curd/15',
    border: 'border-lemon-curd/30',
  },
  {
    label: 'Berry Series',
    desc: '7 varian',
    href: '/menu?cat=berry',
    donutId: 'berry-01',
    bg: 'bg-glaze-pink/8',
    border: 'border-glaze-pink/20',
  },
  {
    label: 'Filled / Bomboloni',
    desc: '4 varian',
    href: '/menu?cat=filled',
    donutId: 'filled-02',
    bg: 'bg-burnt-sugar/8',
    border: 'border-burnt-sugar/20',
  },
  {
    label: 'Savory',
    desc: '2 varian',
    href: '/menu?cat=savory',
    donutId: 'savory-01',
    bg: 'bg-midnight/5',
    border: 'border-midnight/10',
  },
]

export default function CategoryShortcut() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const prefersReduced = useReducedMotion()

  return (
    <section
      ref={ref}
      className="bg-cream px-4 py-14 sm:px-6 lg:px-8"
      aria-labelledby="category-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2
              id="category-heading"
              className="font-display text-2xl font-bold text-midnight sm:text-3xl"
            >
              Pilih kategorimu
            </h2>
            <span className="accent-bar mt-3" aria-hidden="true" />
          </div>
          <Link
            href="/menu"
            className="flex items-center gap-1 text-sm font-medium text-glaze-pink transition-colors hover:text-burnt-sugar focus-visible:rounded focus-visible:outline-2 focus-visible:outline-glaze-pink"
          >
            Lihat semua
            <IconArrowRight size={15} stroke={2.5} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {categories.map((cat, i) => {
            const donut = donuts.find((d) => d.id === cat.donutId)
            if (!donut) return null
            return (
              <motion.div
                key={cat.label}
                initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
                animate={inView ? (prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }) : {}}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 260, damping: 24 }}
              >
                <Link
                  href={cat.href}
                  className={cn(
                    'group flex flex-col items-center gap-3 rounded-2xl border p-5 transition-all duration-200',
                    'hover:-translate-y-1 hover:shadow-[0_8px_24px_0_rgb(0_0_0/0.08)]',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glaze-pink',
                    cat.bg,
                    cat.border,
                  )}
                >
                  <motion.div
                    whileHover={prefersReduced ? {} : { rotate: 360 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                  >
                    <DonutIllustration
                      color={donut.color}
                      accentColor={donut.accentColor}
                      name={donut.name}
                      size={72}
                    />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-midnight">{cat.label}</p>
                    <p className="text-xs text-midnight/50">{cat.desc}</p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
