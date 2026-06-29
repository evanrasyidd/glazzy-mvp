'use client'

import { memo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn, formatRupiah } from '@/lib/utils'
import DonutIllustration from '@/components/ui/DonutIllustration'
import AddToCartButton from '@/components/ui/AddToCartButton'
import type { Donut } from '@/lib/types'

// ============================================================
// GLAZZY — DonutCard
// ============================================================

const CATEGORY_LABELS: Record<Donut['category'], string> = {
  classic: 'Classic Ring',
  berry:   'Berry Series',
  filled:  'Filled',
  savory:  'Savory',
}

interface DonutCardProps {
  donut: Donut
}

function DonutCard({ donut }: DonutCardProps) {
  const prefersReduced = useReducedMotion()

  return (
    <article
      className="glazzy-card group flex flex-col"
      aria-label={`${donut.name}, ${formatRupiah(donut.price)}`}
    >
      {/* Illustration area */}
      <div className="flex items-center justify-center rounded-t-[10px] bg-cream py-6">
        <motion.div
          whileHover={prefersReduced ? {} : { rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
          className="animate-spin-hover"
        >
          <DonutIllustration
            color={donut.color}
            accentColor={donut.accentColor}
            name={donut.name}
            size={100}
          />
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-midnight">{donut.name}</p>
            <span
              className={cn(
                'mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium',
                'bg-glaze-pink/8 text-glaze-pink',
              )}
            >
              {CATEGORY_LABELS[donut.category]}
            </span>
          </div>
          <p className="shrink-0 font-bold text-midnight">{formatRupiah(donut.price)}</p>
        </div>

        <p className="line-clamp-2 text-xs leading-relaxed text-midnight/55">
          {donut.description}
        </p>

        <div className="mt-auto pt-2">
          <AddToCartButton
            item={{
              type: 'donut',
              itemId: donut.id,
              name: donut.name,
              price: donut.price,
            }}
            className="w-full"
          />
        </div>
      </div>
    </article>
  )
}

export default memo(DonutCard)
