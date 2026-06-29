'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { IconPlus } from '@tabler/icons-react'
import DonutIllustration from '@/components/ui/DonutIllustration'
import { getDonutById } from '@/lib/data/donuts'
import { cn } from '@/lib/utils'

// ============================================================
// GLAZZY — SlotGrid
// Tampilkan slot yang sudah diisi / belum
// ============================================================

interface SlotGridProps {
  slots: string[]           // array donutId per slot ('' = kosong)
  activeSlotIndex: number   // slot yang sedang dipilih
  onSlotClick: (index: number) => void
}

function SlotGrid({ slots, activeSlotIndex, onSlotClick }: SlotGridProps) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Slot donut dalam paket"
    >
      {slots.map((donutId, i) => {
        const donut = donutId ? getDonutById(donutId) : null
        const isActive = activeSlotIndex === i
        const isEmpty = !donutId

        return (
          <motion.button
            key={i}
            type="button"
            onClick={() => onSlotClick(i)}
            aria-label={`Slot ${i + 1}: ${donut ? donut.name : 'kosong — klik untuk memilih rasa'}`}
            aria-pressed={isActive}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'relative flex h-14 w-14 items-center justify-center rounded-xl border-2 transition-all duration-150',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glaze-pink',
              isActive
                ? 'border-glaze-pink shadow-[0_0_0_3px_var(--color-glaze-pink)/30]'
                : isEmpty
                  ? 'border-dashed border-border bg-cream hover:border-glaze-pink/50'
                  : 'border-border bg-card hover:border-glaze-pink/40',
            )}
          >
            {/* Slot number */}
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-midnight text-[8px] font-bold text-white">
              {i + 1}
            </span>

            {donut ? (
              <DonutIllustration
                color={donut.color}
                accentColor={donut.accentColor}
                name={donut.name}
                size={40}
              />
            ) : (
              <IconPlus
                size={18}
                stroke={1.5}
                className={cn(isActive ? 'text-glaze-pink' : 'text-midnight/25')}
                aria-hidden="true"
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

export default memo(SlotGrid)
