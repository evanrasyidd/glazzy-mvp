'use client'

import { useRef, memo } from 'react'
import Link from 'next/link'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { IconArrowRight } from '@tabler/icons-react'
import DonutIllustration from '@/components/ui/DonutIllustration'
import AddToCartButton from '@/components/ui/AddToCartButton'
import { donuts } from '@/lib/data/donuts'
import { formatRupiah } from '@/lib/utils'

// ============================================================
// GLAZZY — MenuPreviewGrid (Homepage)
// Tampilkan 6 donut pilihan
// ============================================================

const FEATURED_IDS = [
  'classic-01', // Original Glazed
  'berry-01',   // Strawberry Frosted
  'classic-06', // Matcha Latte
  'filled-02',  // Bavarian
  'classic-07', // Tiramisu
  'berry-05',   // Heaven Berry
]

export default function MenuPreviewGrid() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const prefersReduced = useReducedMotion()
  const featured = FEATURED_IDS.map((id) => donuts.find((d) => d.id === id)).filter(Boolean) as typeof donuts

  return (
    <section
      ref={ref}
      className="bg-cream px-4 py-14 sm:px-6 lg:px-8"
      aria-labelledby="preview-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="font-display text-sm italic text-glaze-pink">Menu Pilihan</p>
            <h2 id="preview-heading" className="mt-1 font-display text-2xl font-bold text-midnight sm:text-3xl">
              Yang paling dicari
            </h2>
            <span className="accent-bar mt-3" aria-hidden="true" />
          </div>
          <Link
            href="/menu"
            className="flex items-center gap-1 text-sm font-medium text-glaze-pink transition-colors hover:text-burnt-sugar focus-visible:rounded focus-visible:outline-2 focus-visible:outline-glaze-pink"
          >
            Menu lengkap
            <IconArrowRight size={15} stroke={2.5} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 lg:gap-4">
          {featured.map((donut, i) => (
            <motion.div
              key={donut.id}
              initial={prefersReduced ? {} : { opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07, type: 'spring', stiffness: 260, damping: 24 }}
            >
              <PreviewCard donut={donut} prefersReduced={!!prefersReduced} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const PreviewCard = memo(function PreviewCard({
  donut,
  prefersReduced,
}: {
  donut: (typeof donuts)[number]
  prefersReduced: boolean
}) {
  return (
    <article className="glazzy-card group flex flex-col items-center gap-2 p-4 text-center hover:-translate-y-1">
      <motion.div
        whileHover={prefersReduced ? {} : { rotate: 360, scale: 1.08 }}
        transition={{ duration: 0.55, ease: 'easeInOut' }}
        className="animate-spin-hover"
      >
        <DonutIllustration
          color={donut.color}
          accentColor={donut.accentColor}
          name={donut.name}
          size={80}
        />
      </motion.div>
      <p className="line-clamp-1 text-xs font-semibold text-midnight">{donut.name}</p>
      <p className="text-xs font-bold text-glaze-pink">{formatRupiah(donut.price)}</p>
      <AddToCartButton
        item={{ type: 'donut', itemId: donut.id, name: donut.name, price: donut.price }}
        size="sm"
        label="+"
        className="w-full"
      />
    </article>
  )
})
