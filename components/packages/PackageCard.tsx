'use client'

import { memo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { IconPackage, IconArrowRight, IconCheck } from '@tabler/icons-react'
import { cn, formatRupiah } from '@/lib/utils'
import type { Package } from '@/lib/types'

// ============================================================
// GLAZZY — PackageCard
// ============================================================

interface PackageCardProps {
  pkg: Package
  isSelected: boolean
  onSelect: (id: string) => void
}

function PackageCard({ pkg, isSelected, onSelect }: PackageCardProps) {
  const prefersReduced = useReducedMotion()
  const isPopular = pkg.badge === 'Most Popular'

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(pkg.id)}
      aria-pressed={isSelected}
      aria-label={`Pilih paket ${pkg.name}${pkg.price > 0 ? `, ${formatRupiah(pkg.price)}` : ''}`}
      whileHover={prefersReduced ? {} : { y: -3 }}
      whileTap={prefersReduced ? {} : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className={cn(
        'relative flex w-full flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-shadow duration-200',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glaze-pink',
        isSelected
          ? 'border-glaze-pink bg-glaze-pink/5 shadow-[0_0_0_2px_var(--color-glaze-pink)]'
          : 'border-border bg-card hover:border-glaze-pink/40 hover:shadow-[0_8px_24px_0_rgb(0_0_0/0.08)]',
        isPopular && !isSelected && 'border-lemon-curd/50 bg-lemon-curd/5',
      )}
    >
      {/* Badge */}
      {pkg.badge && (
        <span
          className={cn(
            'absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
            isPopular ? 'bg-lemon-curd text-midnight' : 'bg-glaze-pink text-white',
          )}
        >
          {pkg.badge}
        </span>
      )}

      {/* Check icon saat selected */}
      {isSelected && (
        <span
          className="absolute left-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-glaze-pink"
          aria-hidden="true"
        >
          <IconCheck size={12} stroke={3} className="text-white" />
        </span>
      )}

      <IconPackage
        size={28}
        stroke={1.5}
        className={isSelected ? 'text-glaze-pink' : 'text-midnight/40'}
        aria-hidden="true"
      />

      <div className="w-full">
        <p className="font-semibold text-midnight">{pkg.name}</p>
        {pkg.slots > 0 && (
          <p className="text-xs text-glaze-pink">{pkg.slots} slots donut pilihan</p>
        )}
        <p className="mt-1 text-xs leading-relaxed text-midnight/55">{pkg.description}</p>
        {pkg.isFixed && pkg.fixedContents && (
          <p className="mt-1.5 text-xs font-medium text-midnight/70">{pkg.fixedContents}</p>
        )}
      </div>

      <div className="flex w-full items-center justify-between">
        <p className="font-display text-xl font-bold text-midnight">
          {pkg.price === 0 ? 'Pilih di menu' : formatRupiah(pkg.price)}
        </p>
        <span className={cn('flex items-center gap-1 text-xs font-medium', isSelected ? 'text-glaze-pink' : 'text-midnight/40')}>
          {isSelected ? 'Dipilih' : 'Pilih'}
          <IconArrowRight size={13} stroke={2.5} aria-hidden="true" />
        </span>
      </div>
    </motion.button>
  )
}

export default memo(PackageCard)
