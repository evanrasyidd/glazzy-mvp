'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { IconCircleDashed, IconCoffee } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

// ============================================================
// GLAZZY — MenuTabBar
// ============================================================

export type MenuTab = 'donut' | 'drink'

interface MenuTabBarProps {
  active: MenuTab
  onChange: (tab: MenuTab) => void
}

const TABS: { id: MenuTab; label: string; Icon: typeof IconCircleDashed }[] = [
  { id: 'donut', label: 'Donut', Icon: IconCircleDashed },
  { id: 'drink', label: 'Minuman', Icon: IconCoffee },
]

export default function MenuTabBar({ active, onChange }: MenuTabBarProps) {
  const prefersReduced = useReducedMotion()

  return (
    <div
      role="tablist"
      aria-label="Jenis menu"
      className="flex gap-1 rounded-2xl border border-border bg-card p-1"
    >
      {TABS.map((tab) => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors duration-150',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glaze-pink',
              isActive ? 'text-white' : 'text-midnight/55 hover:text-midnight',
            )}
          >
            {isActive && (
              <motion.span
                layoutId="tab-bg"
                className="absolute inset-0 rounded-xl bg-glaze-pink"
                transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 30 }}
                aria-hidden="true"
              />
            )}
            <tab.Icon
              size={16}
              stroke={1.75}
              className="relative z-10"
              aria-hidden="true"
            />
            <span className="relative z-10">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
