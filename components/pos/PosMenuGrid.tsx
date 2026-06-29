'use client'

import React, {
  useState, useMemo, memo, useCallback, useEffect,
} from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  IconCoffee, IconCircleDashed, IconX,
  IconFlame, IconSnowflake, IconCheck, IconPlus,
} from '@tabler/icons-react'
import DonutIllustration from '@/components/ui/DonutIllustration'
import { donuts } from '@/lib/data/donuts'
import { drinks } from '@/lib/data/drinks'
import { usePosActions } from '@/lib/store/pos.store'
import { formatRupiah, cn } from '@/lib/utils'
import type { Drink } from '@/lib/types'

// ============================================================
// GLAZZY POS — MenuGrid
// Donuts: tap = instant add
// Drinks: tap = buka detail sheet (size / suhu / manis / es / add-ons)
// ============================================================

type PosTab = 'donut' | 'drink'

const DONUT_CATS = [
  { value: 'all',     label: 'Semua'   },
  { value: 'classic', label: 'Classic' },
  { value: 'berry',   label: 'Berry'   },
  { value: 'filled',  label: 'Filled'  },
  { value: 'savory',  label: 'Savory'  },
]

const DRINK_CATS = [
  { value: 'all',        label: 'Semua'      },
  { value: 'coffee',     label: 'Coffee'     },
  { value: 'non-coffee', label: 'Non-Coffee' },
  { value: 'frappe',     label: 'Frappe'     },
  { value: 'tea',        label: 'Tea'        },
]

// ── Shared variant data (mirrors DrinkDetailModal) ────────────

const SIZES = [
  { id: 'regular', label: 'Regular', desc: '250ml', priceAdd: 0     },
  { id: 'large',   label: 'Large',   desc: '350ml', priceAdd: 5000  },
] as const
type SizeId = typeof SIZES[number]['id']

const SWEETNESS = [
  { id: 'normal',     label: 'Normal',     desc: '100%' },
  { id: 'less-sweet', label: 'Less Sweet', desc: '70%'  },
  { id: 'no-sugar',   label: 'No Sugar',   desc: '0%'   },
] as const
type SweetnessId = typeof SWEETNESS[number]['id']

const ICE_LEVELS = [
  { id: 'full', label: 'Full Ice' },
  { id: 'less', label: 'Less Ice' },
  { id: 'no',   label: 'No Ice'   },
] as const
type IceId = typeof ICE_LEVELS[number]['id']

const ADDONS: Record<Drink['category'], { id: string; label: string; price: number }[]> = {
  coffee: [
    { id: 'extra-shot', label: 'Extra Shot',    price: 8000 },
    { id: 'oat-milk',   label: 'Oat Milk',      price: 7000 },
    { id: 'whip',       label: 'Whipped Cream', price: 5000 },
    { id: 'vanilla',    label: 'Vanilla Syrup', price: 4000 },
  ],
  'non-coffee': [
    { id: 'whip',   label: 'Whipped Cream',  price: 5000 },
    { id: 'pearls', label: 'Tapioca Pearls', price: 6000 },
    { id: 'jelly',  label: 'Nata de Coco',   price: 5000 },
    { id: 'oat',    label: 'Oat Milk',       price: 7000 },
  ],
  frappe: [
    { id: 'whip',  label: 'Whipped Cream', price: 5000 },
    { id: 'oreo',  label: 'Oreo Crumble',  price: 6000 },
    { id: 'choco', label: 'Choco Drizzle', price: 4000 },
    { id: 'xbase', label: 'Extra Base',    price: 7000 },
  ],
  tea: [
    { id: 'pearls', label: 'Tapioca Pearls', price: 6000 },
    { id: 'jelly',  label: 'Nata de Coco',   price: 5000 },
    { id: 'lemon',  label: 'Lemon Squeeze',  price: 4000 },
    { id: 'honey',  label: 'Extra Honey',    price: 5000 },
  ],
}

const CATEGORY_LABELS: Record<Drink['category'], string> = {
  coffee: 'Coffee', 'non-coffee': 'Non-Coffee', frappe: 'Frappe', tea: 'Tea',
}

// ── Dark-theme chip (untuk POS yang bg-midnight) ───────────────

function DarkChip({
  selected, onClick, children,
}: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-xl border px-3 py-2 text-xs font-semibold transition-colors text-center',
        'focus-visible:outline-2 focus-visible:outline-glaze-pink',
        selected
          ? 'border-glaze-pink bg-glaze-pink/15 text-glaze-pink'
          : 'border-white/10 text-white/40 hover:border-white/25 hover:text-white/70',
      )}
    >
      {children}
    </button>
  )
}

function DarkAddonChip({
  label, price, selected, onClick,
}: { label: string; price: number; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 rounded-xl border px-2.5 py-2 text-[11px] font-semibold transition-colors',
        'focus-visible:outline-2 focus-visible:outline-glaze-pink',
        selected
          ? 'border-glaze-pink bg-glaze-pink/15 text-glaze-pink'
          : 'border-white/10 text-white/40 hover:border-white/25 hover:text-white/70',
      )}
    >
      {selected
        ? <IconCheck size={10} stroke={2.5} aria-hidden="true" />
        : <IconPlus  size={10} stroke={2.5} aria-hidden="true" />}
      {label}
      <span className={selected ? 'text-glaze-pink/60' : 'text-white/25'}>
        +{formatRupiah(price)}
      </span>
    </button>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/35">
      {children}
    </p>
  )
}

// ── Drink cup mini icon ────────────────────────────────────────

function DrinkSvgIcon({ category }: { category: Drink['category'] }) {
  const fills: Record<Drink['category'], string> = {
    coffee: '#6B4226', 'non-coffee': '#B5338A', frappe: '#3B82F6', tea: '#16A34A',
  }
  const f = fills[category]
  return (
    <svg width="28" height="34" viewBox="0 0 40 48" fill="none" aria-hidden="true">
      <path d="M8 10 L11 42 Q11 45 20 45 Q29 45 29 42 L32 10 Z" fill={f} opacity="0.85" />
      <ellipse cx="20" cy="13" rx="11" ry="4" fill={f} opacity="0.6" />
      <path d="M30 18 Q36 18 36 26 Q36 34 30 34" stroke={f} strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// ── Drink Detail Sheet ─────────────────────────────────────────
// Full variant system — dark themed untuk POS

function DrinkDetailSheet({
  drink,
  onClose,
}: {
  drink: Drink | null
  onClose: () => void
}) {
  const prefersReduced = useReducedMotion()
  const { addProduct } = usePosActions()

  const [size,     setSize]     = useState<SizeId>('regular')
  const [temp,     setTemp]     = useState<'hot' | 'iced'>('iced')
  const [sweet,    setSweet]    = useState<SweetnessId>('normal')
  const [iceLevel, setIce]      = useState<IceId>('full')
  const [addons,   setAddons]   = useState<Set<string>>(new Set())
  const [added,    setAdded]    = useState(false)

  // Reset state setiap kali drink berganti
  useEffect(() => {
    setSize('regular'); setTemp('iced'); setSweet('normal')
    setIce('full'); setAddons(new Set()); setAdded(false)
  }, [drink?.id])

  const addonList  = drink ? ADDONS[drink.category] : []
  const isFrappe   = drink?.category === 'frappe'
  const isIced     = drink
    ? (drink.temperature === 'iced' || (drink.temperature === 'both' && temp === 'iced') || isFrappe)
    : false

  const totalPrice = useMemo(() => {
    if (!drink) return 0
    const sizeAdd  = SIZES.find((s) => s.id === size)?.priceAdd ?? 0
    const addonAdd = [...addons].reduce(
      (sum, id) => sum + (addonList.find((a) => a.id === id)?.price ?? 0), 0,
    )
    return drink.price + sizeAdd + addonAdd
  }, [drink, size, addons, addonList])

  const buildName = useCallback((): string => {
    if (!drink) return ''
    const parts: string[] = []
    if (size === 'large') parts.push('Large')
    if (drink.temperature === 'both' && !isFrappe)
      parts.push(temp === 'hot' ? 'Hot' : 'Iced')
    else if (drink.temperature === 'hot') parts.push('Hot')
    else parts.push('Iced')
    if (!isFrappe && sweet !== 'normal')
      parts.push(sweet === 'less-sweet' ? 'Less Sweet' : 'No Sugar')
    if (isIced && iceLevel !== 'full')
      parts.push(iceLevel === 'less' ? 'Less Ice' : 'No Ice')
    const addonNames = [...addons]
      .map((id) => addonList.find((a) => a.id === id)?.label ?? '')
      .filter(Boolean)
    parts.push(...addonNames)
    return parts.length ? `${drink.name} (${parts.join(', ')})` : drink.name
  }, [drink, size, temp, sweet, iceLevel, addons, isIced, isFrappe, addonList])

  const toggleAddon = (id: string) =>
    setAddons((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const handleAdd = useCallback(() => {
    if (!drink || added) return
    addProduct({
      productId: drink.id,
      type: 'drink',
      name: buildName(),
      price: totalPrice,
    })
    setAdded(true)
    setTimeout(() => { setAdded(false); onClose() }, 650)
  }, [drink, added, addProduct, buildName, totalPrice, onClose])

  return (
    <AnimatePresence>
      {drink && (
        <>
          {/* Backdrop */}
          <motion.div
            key="pos-drink-bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 bg-black/70"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet — bottom on mobile, centered on desktop */}
          <motion.div
            key="pos-drink-sh"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 360, damping: 32 }}
            className={cn(
              'fixed z-50 mx-auto w-full max-w-sm overflow-hidden rounded-t-3xl border border-white/10 bg-[#0E0E22] shadow-2xl',
              'inset-x-0 bottom-0',
              'sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl',
            )}
            role="dialog"
            aria-modal="true"
            aria-label={`Pilihan ${drink.name}`}
          >
            {/* Handle (mobile only) */}
            <div className="flex justify-center pb-1 pt-3 sm:hidden">
              <div className="h-1 w-10 rounded-full bg-white/15" aria-hidden="true" />
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-white/8 text-white/30 hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-glaze-pink"
              aria-label="Tutup"
            >
              <IconX size={14} stroke={2} aria-hidden="true" />
            </button>

            {/* Scrollable body */}
            <div
              className="max-h-[82dvh] overflow-y-auto overscroll-contain px-5 pb-6 pt-2 sm:max-h-[90vh]"
              style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
            >
              {/* Hero row */}
              <div className="flex items-center gap-3 pr-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/8">
                  <DrinkSvgIcon category={drink.category} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-block rounded-full bg-glaze-pink/15 px-2 py-0.5 text-[10px] font-semibold text-glaze-pink">
                    {CATEGORY_LABELS[drink.category]}
                  </span>
                  <p className="mt-0.5 font-display text-base font-bold leading-snug text-white">
                    {drink.name}
                  </p>
                  <p className="text-xs text-white/40">{formatRupiah(drink.price)}</p>
                </div>
              </div>

              {/* Description */}
              <p className="mt-3 text-xs leading-relaxed text-white/50">{drink.description}</p>

              <div className="my-4 h-px bg-white/8" />

              {/* ── Ukuran ── */}
              <div className="mb-4">
                <SectionLabel>Ukuran</SectionLabel>
                <div className="grid grid-cols-2 gap-2">
                  {SIZES.map((s) => (
                    <DarkChip key={s.id} selected={size === s.id} onClick={() => setSize(s.id)}>
                      <span className="block">{s.label}{' '}
                        <span className="font-normal text-white/30">{s.desc}</span>
                      </span>
                      {s.priceAdd > 0 && (
                        <span className="block text-[10px] text-white/40">
                          +{formatRupiah(s.priceAdd)}
                        </span>
                      )}
                    </DarkChip>
                  ))}
                </div>
              </div>

              {/* ── Suhu (hanya untuk 'both' & bukan frappe) ── */}
              {drink.temperature === 'both' && !isFrappe && (
                <div className="mb-4">
                  <SectionLabel>Suhu</SectionLabel>
                  <div className="grid grid-cols-2 gap-2">
                    <DarkChip selected={temp === 'hot'} onClick={() => setTemp('hot')}>
                      <span className="flex items-center justify-center gap-1">
                        <IconFlame size={12} aria-hidden="true" /> Hot
                      </span>
                    </DarkChip>
                    <DarkChip selected={temp === 'iced'} onClick={() => setTemp('iced')}>
                      <span className="flex items-center justify-center gap-1">
                        <IconSnowflake size={12} aria-hidden="true" /> Iced
                      </span>
                    </DarkChip>
                  </div>
                </div>
              )}

              {/* Suhu badge (fixed) */}
              {drink.temperature !== 'both' && (
                <div className="mb-4 flex items-center gap-1.5">
                  {drink.temperature === 'hot' ? (
                    <span className="flex items-center gap-1 rounded-full bg-burnt-sugar/15 px-2.5 py-1 text-xs font-medium text-burnt-sugar">
                      <IconFlame size={11} aria-hidden="true" /> Hot only
                    </span>
                  ) : isFrappe ? (
                    <span className="flex items-center gap-1 rounded-full bg-blue-500/15 px-2.5 py-1 text-xs font-medium text-blue-400">
                      <IconSnowflake size={11} aria-hidden="true" /> Iced (Frappe)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-blue-500/15 px-2.5 py-1 text-xs font-medium text-blue-400">
                      <IconSnowflake size={11} aria-hidden="true" /> Iced only
                    </span>
                  )}
                </div>
              )}

              {/* ── Tingkat Manis (non-frappe) ── */}
              {!isFrappe && (
                <div className="mb-4">
                  <SectionLabel>Tingkat Manis</SectionLabel>
                  <div className="grid grid-cols-3 gap-2">
                    {SWEETNESS.map((sw) => (
                      <DarkChip key={sw.id} selected={sweet === sw.id} onClick={() => setSweet(sw.id)}>
                        <span className="block">{sw.label}</span>
                        <span className="block text-[9px] font-normal text-white/30">{sw.desc}</span>
                      </DarkChip>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Level Es (iced / frappe) ── */}
              {isIced && (
                <div className="mb-4">
                  <SectionLabel>Level Es</SectionLabel>
                  <div className="grid grid-cols-3 gap-2">
                    {ICE_LEVELS.map((il) => (
                      <DarkChip key={il.id} selected={iceLevel === il.id} onClick={() => setIce(il.id)}>
                        {il.label}
                      </DarkChip>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Add-ons ── */}
              <div className="mb-5">
                <SectionLabel>Tambahan (opsional)</SectionLabel>
                <div className="flex flex-wrap gap-1.5">
                  {addonList.map((a) => (
                    <DarkAddonChip
                      key={a.id}
                      label={a.label}
                      price={a.price}
                      selected={addons.has(a.id)}
                      onClick={() => toggleAddon(a.id)}
                    />
                  ))}
                </div>
              </div>

              {/* ── Add button ── */}
              <button
                type="button"
                onClick={handleAdd}
                disabled={added}
                className={cn(
                  'flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold transition-all',
                  'focus-visible:outline-2 focus-visible:outline-glaze-pink',
                  added
                    ? 'bg-green-500 text-white scale-[0.98]'
                    : 'bg-glaze-pink text-white hover:bg-burnt-sugar active:scale-[0.97]',
                )}
              >
                {added ? (
                  <><IconCheck size={15} stroke={2.5} aria-hidden="true" /> Ditambahkan!</>
                ) : (
                  <>Tambah ke Keranjang — {formatRupiah(totalPrice)}</>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ── Product Tile ───────────────────────────────────────────────

const ProductTile = memo(function ProductTile({
  name, price, illustration, onAction, index, prefersReduced, badge,
}: {
  name:          string
  price:         number
  illustration:  React.ReactNode
  onAction:      () => void
  index:         number
  prefersReduced: boolean
  badge?:        string
}) {
  return (
    <motion.button
      type="button"
      onClick={onAction}
      aria-label={`${name} — ${formatRupiah(price)}`}
      initial={prefersReduced ? {} : { opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.018, type: 'spring', stiffness: 320, damping: 26 }}
      whileTap={{ scale: 0.91 }}
      className={cn(
        'relative flex flex-col items-center gap-2 rounded-2xl border border-white/8 bg-white/5 p-3',
        'cursor-pointer transition-colors hover:border-glaze-pink/50 hover:bg-white/10',
        'focus-visible:outline-2 focus-visible:outline-glaze-pink',
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center">
        {illustration}
      </div>
      <p className="line-clamp-2 w-full text-center text-[11px] font-semibold leading-tight text-white">
        {name}
      </p>
      <p className="text-xs font-bold text-glaze-pink">{formatRupiah(price)}</p>
      {badge && (
        <span className="absolute right-1.5 top-1.5 rounded-full bg-glaze-pink/20 px-1.5 py-0.5 text-[9px] font-bold text-glaze-pink/80">
          {badge}
        </span>
      )}
    </motion.button>
  )
})

// ── Main Grid ──────────────────────────────────────────────────

export default function PosMenuGrid() {
  const prefersReduced  = useReducedMotion()
  const { addProduct }  = usePosActions()
  const [tab,  setTab]  = useState<PosTab>('donut')
  const [cat,  setCat]  = useState('all')
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null)

  const filteredDonuts = useMemo(
    () => donuts.filter((d) => d.isAvailable && (cat === 'all' || d.category === cat)),
    [cat],
  )
  const filteredDrinks = useMemo(
    () => drinks.filter((d) => d.isAvailable && (cat === 'all' || d.category === cat)),
    [cat],
  )

  const handleTabChange = (t: PosTab) => { setTab(t); setCat('all') }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-white/8 p-3">
        {([
          { id: 'donut' as PosTab, label: 'Donut',   Icon: IconCircleDashed },
          { id: 'drink' as PosTab, label: 'Minuman', Icon: IconCoffee },
        ] as const).map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleTabChange(id)}
            aria-pressed={tab === id}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition-colors',
              'focus-visible:outline-2 focus-visible:outline-glaze-pink',
              tab === id ? 'bg-glaze-pink text-white' : 'text-white/40 hover:bg-white/5 hover:text-white',
            )}
          >
            <Icon size={15} aria-hidden="true" /> {label}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 overflow-x-auto border-b border-white/8 px-3 py-2">
        {(tab === 'donut' ? DONUT_CATS : DRINK_CATS).map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => setCat(c.value)}
            aria-pressed={cat === c.value}
            className={cn(
              'shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
              cat === c.value
                ? 'bg-white/15 text-white'
                : 'text-white/30 hover:bg-white/8 hover:text-white/60',
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-5">
          {tab === 'donut'
            ? filteredDonuts.map((d, i) => (
                <ProductTile
                  key={d.id}
                  name={d.name}
                  price={d.price}
                  index={i}
                  prefersReduced={!!prefersReduced}
                  illustration={
                    <DonutIllustration
                      color={d.color}
                      accentColor={d.accentColor}
                      name={d.name}
                      size={52}
                    />
                  }
                  onAction={() =>
                    addProduct({
                      productId:  d.id,
                      type:       'donut',
                      name:       d.name,
                      price:      d.price,
                      color:      d.color,
                      accentColor: d.accentColor,
                    })
                  }
                />
              ))
            : filteredDrinks.map((d, i) => (
                <ProductTile
                  key={d.id}
                  name={d.name}
                  price={d.price}
                  index={i}
                  prefersReduced={!!prefersReduced}
                  badge="opsi"
                  illustration={<DrinkSvgIcon category={d.category} />}
                  onAction={() => setSelectedDrink(d)}
                />
              ))}
        </div>
      </div>

      {/* Drink detail sheet */}
      <DrinkDetailSheet
        drink={selectedDrink}
        onClose={() => setSelectedDrink(null)}
      />
    </div>
  )
}
