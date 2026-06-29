'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

// ============================================================
// GLAZZY — CategoryFilter (Donut atau Drink)
// ============================================================

interface FilterOption {
  value: string
  label: string
  count: number
}

interface CategoryFilterProps {
  options: FilterOption[]
  active: string
  onChange: (value: string) => void
}

export default function CategoryFilter({ options, active, onChange }: CategoryFilterProps) {
  const prefersReduced = useReducedMotion()

  return (
    <div
      role="group"
      aria-label="Filter kategori"
      className="flex flex-wrap gap-2"
    >
      {options.map((opt) => {
        const isActive = active === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={isActive}
            className={cn(
              'relative flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-150',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glaze-pink',
              isActive
                ? 'border-glaze-pink text-white'
                : 'border-border bg-card text-midnight/60 hover:border-glaze-pink/40 hover:text-midnight',
            )}
          >
            {isActive && (
              <motion.span
                layoutId="filter-bg"
                className="absolute inset-0 rounded-full bg-glaze-pink"
                transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 30 }}
                aria-hidden="true"
              />
            )}
            <span className="relative z-10">{opt.label}</span>
            <span
              className={cn(
                'relative z-10 rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                isActive ? 'bg-white/20 text-white' : 'bg-border text-midnight/50',
              )}
            >
              {opt.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
