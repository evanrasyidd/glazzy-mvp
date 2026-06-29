'use client'

import { memo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { IconCheck } from '@tabler/icons-react'
import DonutIllustration from '@/components/ui/DonutIllustration'
import { donuts, getAvailableDonuts } from '@/lib/data/donuts'
import { cn, formatRupiah } from '@/lib/utils'

// ============================================================
// GLAZZY — DonutPickerGrid
// Grid untuk memilih donut per slot
// ============================================================

interface DonutPickerGridProps {
  selectedId: string
  onSelect: (donutId: string) => void
}

function DonutPickerGrid({ selectedId, onSelect }: DonutPickerGridProps) {
  const prefersReduced = useReducedMotion()
  const available = getAvailableDonuts()

  return (
    <div
      className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
      role="listbox"
      aria-label="Pilih varian donut"
    >
      {available.map((donut, i) => {
        const isSelected = selectedId === donut.id
        return (
          <motion.button
            key={donut.id}
            type="button"
            role="option"
            aria-selected={isSelected}
            aria-label={`${donut.name}, ${formatRupiah(donut.price)}`}
            onClick={() => onSelect(donut.id)}
            initial={prefersReduced ? {} : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03, type: 'spring', stiffness: 300, damping: 22 }}
            whileHover={prefersReduced ? {} : { y: -2, scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={cn(
              'relative flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-center transition-colors duration-150',
              'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-glaze-pink',
              isSelected
                ? 'border-glaze-pink bg-glaze-pink/6 shadow-[0_0_0_2px_var(--color-glaze-pink)]'
                : 'border-border bg-card hover:border-glaze-pink/40',
            )}
          >
            {isSelected && (
              <span
                className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-glaze-pink"
                aria-hidden="true"
              >
                <IconCheck size={10} stroke={3} className="text-white" />
              </span>
            )}
            <DonutIllustration
              color={donut.color}
              accentColor={donut.accentColor}
              name={donut.name}
              size={52}
            />
            <p className="line-clamp-2 text-[10px] font-medium leading-tight text-midnight">
              {donut.name}
            </p>
          </motion.button>
        )
      })}
    </div>
  )
}

export default memo(DonutPickerGrid)
