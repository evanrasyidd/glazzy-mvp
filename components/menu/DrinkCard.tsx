'use client'

import { memo } from 'react'
import { IconFlame, IconSnowflake, IconChevronRight } from '@tabler/icons-react'
import { cn, formatRupiah } from '@/lib/utils'
import AddToCartButton from '@/components/ui/AddToCartButton'
import type { Drink } from '@/lib/types'

// ============================================================
// GLAZZY — DrinkCard
// ============================================================

const CATEGORY_COLORS: Record<Drink['category'], { bg: string; text: string }> = {
  coffee:       { bg: 'bg-burnt-sugar/10', text: 'text-burnt-sugar' },
  'non-coffee': { bg: 'bg-glaze-pink/8',   text: 'text-glaze-pink' },
  frappe:       { bg: 'bg-blue-50',        text: 'text-blue-600' },
  tea:          { bg: 'bg-green-50',       text: 'text-green-700' },
}

const CATEGORY_LABELS: Record<Drink['category'], string> = {
  coffee:       'Coffee',
  'non-coffee': 'Non-Coffee',
  frappe:       'Frappe',
  tea:          'Tea',
}

function CupIllustration({ category }: { category: Drink['category'] }) {
  const colors: Record<Drink['category'], { cup: string; liquid: string; steam: string }> = {
    coffee:       { cup: '#6B4226', liquid: '#3A1A0A', steam: '#9B7560' },
    'non-coffee': { cup: '#B5338A', liquid: '#7A1060', steam: '#D580B8' },
    frappe:       { cup: '#3B82F6', liquid: '#1D4ED8', steam: '#93C5FD' },
    tea:          { cup: '#16A34A', liquid: '#15803D', steam: '#86EFAC' },
  }
  const c = colors[category]

  return (
    <svg width="80" height="90" viewBox="0 0 80 90" fill="none" aria-hidden="true">
      <path d="M18 22 L22 78 Q22 82 40 82 Q58 82 58 78 L62 22 Z" fill={c.cup} />
      <ellipse cx="40" cy="28" rx="21" ry="8" fill={c.liquid} opacity="0.85" />
      <path d="M60 36 Q72 36 72 50 Q72 64 60 64" stroke={c.cup} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M32 14 Q30 9 32 4" stroke={c.steam} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M40 12 Q38 6 40 1" stroke={c.steam} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M48 14 Q46 9 48 4" stroke={c.steam} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}

interface DrinkCardProps {
  drink: Drink
  onViewDetail?: (drink: Drink) => void
}

function DrinkCard({ drink, onViewDetail }: DrinkCardProps) {
  const catStyle = CATEGORY_COLORS[drink.category]

  return (
    <article
      className="glazzy-card group flex flex-col"
      aria-label={`${drink.name}, ${formatRupiah(drink.price)}`}
    >
      {/* Illustration — klik untuk detail */}
      <button
        type="button"
        onClick={() => onViewDetail?.(drink)}
        className="relative flex items-center justify-center rounded-t-[10px] bg-cream py-6 focus-visible:outline-2 focus-visible:outline-glaze-pink"
        aria-label={`Lihat detail ${drink.name}`}
        tabIndex={onViewDetail ? 0 : -1}
      >
        <CupIllustration category={drink.category} />
        {onViewDetail && (
          <span className="absolute bottom-2 right-2 flex items-center gap-0.5 rounded-full bg-midnight/8 px-2 py-0.5 text-[10px] font-semibold text-midnight/40 opacity-0 transition-opacity group-hover:opacity-100">
            Detail <IconChevronRight size={9} aria-hidden="true" />
          </span>
        )}
      </button>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => onViewDetail?.(drink)}
              className="truncate text-sm font-semibold text-midnight transition-colors hover:text-glaze-pink focus-visible:outline-none focus-visible:underline"
            >
              {drink.name}
            </button>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', catStyle.bg, catStyle.text)}>
                {CATEGORY_LABELS[drink.category]}
              </span>
              {drink.temperature === 'hot' && (
                <span className="flex items-center gap-0.5 text-[10px] text-burnt-sugar">
                  <IconFlame size={10} fill="currentColor" aria-hidden="true" /> Hot
                </span>
              )}
              {drink.temperature === 'iced' && (
                <span className="flex items-center gap-0.5 text-[10px] text-blue-500">
                  <IconSnowflake size={10} aria-hidden="true" /> Iced
                </span>
              )}
              {drink.temperature === 'both' && (
                <span className="text-[10px] text-midnight/40">Hot/Iced</span>
              )}
            </div>
          </div>
          <p className="shrink-0 font-bold text-midnight">{formatRupiah(drink.price)}</p>
        </div>

        <p className="line-clamp-2 text-xs leading-relaxed text-midnight/55">
          {drink.description}
        </p>

        <div className="mt-auto pt-2">
          <AddToCartButton
            item={{
              type: 'drink',
              itemId: drink.id,
              name: drink.temperature === 'both' ? `${drink.name} (Iced)` : drink.name,
              price: drink.price,
            }}
            className="w-full"
          />
        </div>
      </div>
    </article>
  )
}

export default memo(DrinkCard)
