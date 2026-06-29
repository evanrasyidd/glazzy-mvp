'use client'

import { useState, useCallback, useMemo, memo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { IconX, IconCheck, IconPlus, IconMinus } from '@tabler/icons-react'
import { cn, formatRupiah } from '@/lib/utils'
import { useCartActions } from '@/lib/store/cart.store'
import { toast } from '@/components/ui/Toast'
import type { Drink } from '@/lib/types'

// ============================================================
// GLAZZY — Drink Detail Modal
// Proper variant system: ukuran, suhu, kustomisasi per kategori
// ============================================================

// ── Variant definitions ───────────────────────────────────────

const SIZES = [
  { id: 'regular', label: 'Regular', desc: '250ml', priceAdd: 0 },
  { id: 'large',   label: 'Large',   desc: '350ml', priceAdd: 5000 },
] as const
type SizeId = typeof SIZES[number]['id']

const SWEETNESS = [
  { id: 'normal',     label: 'Normal',      desc: '100%' },
  { id: 'less-sweet', label: 'Less Sweet',  desc: '70%' },
  { id: 'no-sugar',   label: 'No Sugar',    desc: '0%' },
] as const
type SweetnessId = typeof SWEETNESS[number]['id']

const ICE_LEVELS = [
  { id: 'full', label: 'Full Ice' },
  { id: 'less', label: 'Less Ice' },
  { id: 'no',   label: 'No Ice' },
] as const
type IceId = typeof ICE_LEVELS[number]['id']

const ADDONS_BY_CATEGORY: Record<Drink['category'], { id: string; label: string; price: number }[]> = {
  coffee: [
    { id: 'extra-shot', label: 'Extra Shot',   price: 8000 },
    { id: 'oat-milk',   label: 'Oat Milk',     price: 7000 },
    { id: 'whip',       label: 'Whipped Cream', price: 5000 },
    { id: 'vanilla',    label: 'Vanilla Syrup', price: 4000 },
  ],
  'non-coffee': [
    { id: 'whip',       label: 'Whipped Cream', price: 5000 },
    { id: 'pearls',     label: 'Tapioca Pearls', price: 6000 },
    { id: 'jelly',      label: 'Nata de Coco',   price: 5000 },
    { id: 'oat-milk',   label: 'Oat Milk',       price: 7000 },
  ],
  frappe: [
    { id: 'whip',       label: 'Whipped Cream',  price: 5000 },
    { id: 'oreo',       label: 'Oreo Crumble',   price: 6000 },
    { id: 'choco',      label: 'Choco Drizzle',  price: 4000 },
    { id: 'extra-base', label: 'Extra Base',      price: 7000 },
  ],
  tea: [
    { id: 'pearls',     label: 'Tapioca Pearls', price: 6000 },
    { id: 'jelly',      label: 'Nata de Coco',   price: 5000 },
    { id: 'lemon',      label: 'Lemon Squeeze',  price: 4000 },
    { id: 'honey',      label: 'Extra Honey',    price: 5000 },
  ],
}

const CATEGORY_LABELS: Record<Drink['category'], string> = {
  coffee: 'Coffee',
  'non-coffee': 'Non-Coffee',
  frappe: 'Frappe',
  tea: 'Tea',
}

// ── Cup Illustration ──────────────────────────────────────────

function CupIllustration({ category }: { category: Drink['category'] }) {
  const palettes: Record<Drink['category'], { cup: string; liquid: string; steam: string; accent: string }> = {
    coffee:       { cup: '#6B4226', liquid: '#3A1A0A', steam: '#9B7560', accent: '#C8965A' },
    'non-coffee': { cup: '#B5338A', liquid: '#7A1060', steam: '#D580B8', accent: '#F5B8E0' },
    frappe:       { cup: '#3B82F6', liquid: '#1D4ED8', steam: '#93C5FD', accent: '#BFDBFE' },
    tea:          { cup: '#16A34A', liquid: '#15803D', steam: '#86EFAC', accent: '#BBF7D0' },
  }
  const p = palettes[category]
  return (
    <svg width="88" height="100" viewBox="0 0 100 120" fill="none" aria-hidden="true">
      <ellipse cx="50" cy="108" rx="32" ry="6" fill={p.cup} opacity="0.12" />
      <ellipse cx="50" cy="104" rx="30" ry="5" fill={p.cup} opacity="0.3" />
      <path d="M20 28 L25 98 Q25 104 50 104 Q75 104 75 98 L80 28 Z" fill={p.cup} />
      <path d="M22 38 L25 98 Q25 104 50 104 Q75 104 75 98 L78 38 Z" fill={p.liquid} opacity="0.65" />
      <ellipse cx="50" cy="34" rx="28" ry="9" fill={p.liquid} opacity="0.9" />
      <ellipse cx="50" cy="30" rx="24" ry="7" fill={p.steam} opacity="0.5" />
      <ellipse cx="38" cy="30" rx="7" ry="3" fill="white" opacity="0.22" transform="rotate(-15 38 30)" />
      <path d="M74 44 Q88 44 88 60 Q88 76 74 76" stroke={p.cup} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M74 44 Q84 44 84 60 Q84 76 74 76" stroke={p.accent} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
      <ellipse cx="50" cy="26" rx="30" ry="8" fill={p.cup} />
      <ellipse cx="50" cy="24" rx="28" ry="7" fill={p.accent} opacity="0.55" />
      <path d="M36 16 Q34 10 36 4"  stroke={p.steam} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.65" />
      <path d="M50 13 Q48 6  50 0"  stroke={p.steam} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.65" />
      <path d="M64 16 Q62 10 64 4"  stroke={p.steam} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.65" />
    </svg>
  )
}

// ── Option chip ───────────────────────────────────────────────

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-xl border px-3 py-2 text-xs font-semibold transition-colors',
        'focus-visible:outline-2 focus-visible:outline-glaze-pink',
        selected
          ? 'border-glaze-pink bg-glaze-pink/10 text-glaze-pink'
          : 'border-border text-midnight/50 hover:border-glaze-pink/40 hover:text-midnight',
      )}
    >
      {children}
    </button>
  )
}

// ── Addon chip ────────────────────────────────────────────────

function AddonChip({
  label, price, selected, onClick,
}: { label: string; price: number; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors',
        'focus-visible:outline-2 focus-visible:outline-glaze-pink',
        selected
          ? 'border-glaze-pink bg-glaze-pink/10 text-glaze-pink'
          : 'border-border text-midnight/50 hover:border-glaze-pink/40 hover:text-midnight',
      )}
    >
      {selected
        ? <IconCheck size={11} stroke={2.5} aria-hidden="true" />
        : <IconPlus size={11} stroke={2.5} aria-hidden="true" />}
      <span>{label}</span>
      <span className={selected ? 'text-glaze-pink/70' : 'text-midnight/30'}>+{formatRupiah(price)}</span>
    </button>
  )
}

// ── Section label ─────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-midnight/40">{children}</p>
}

// ── Main modal ────────────────────────────────────────────────

interface DrinkDetailModalProps {
  drink: Drink | null
  onClose: () => void
}

function DrinkDetailModal({ drink, onClose }: DrinkDetailModalProps) {
  const prefersReduced = useReducedMotion()
  const { addItem } = useCartActions()

  const [size, setSize]           = useState<SizeId>('regular')
  const [tempChoice, setTemp]     = useState<'hot' | 'iced'>('iced')
  const [sweetness, setSweetness] = useState<SweetnessId>('normal')
  const [iceLevel, setIce]        = useState<IceId>('full')
  const [addons, setAddons]       = useState<Set<string>>(new Set())
  const [added, setAdded]         = useState(false)

  // Reset state when drink changes
  const prevDrink = useState<string | null>(null)

  const addons_list = drink ? ADDONS_BY_CATEGORY[drink.category] : []
  const isIced = drink ? (drink.temperature === 'iced' || (drink.temperature === 'both' && tempChoice === 'iced')) : false
  const isFrappe = drink?.category === 'frappe'

  const totalPrice = useMemo(() => {
    if (!drink) return 0
    const sizeAdd   = SIZES.find((s) => s.id === size)?.priceAdd ?? 0
    const addonAdd  = [...addons].reduce((sum, id) => sum + (addons_list.find((a) => a.id === id)?.price ?? 0), 0)
    return drink.price + sizeAdd + addonAdd
  }, [drink, size, addons, addons_list])

  const buildName = useCallback(() => {
    if (!drink) return ''
    const parts: string[] = []
    if (size === 'large') parts.push('Large')
    if (drink.temperature === 'both') parts.push(tempChoice === 'hot' ? 'Hot' : 'Iced')
    else if (drink.temperature === 'hot') parts.push('Hot')
    else parts.push('Iced')
    if (sweetness !== 'normal' && !isFrappe) parts.push(sweetness === 'less-sweet' ? 'Less Sweet' : 'No Sugar')
    if (isIced && iceLevel !== 'full') parts.push(iceLevel === 'less' ? 'Less Ice' : 'No Ice')
    const addonNames = [...addons].map((id) => addons_list.find((a) => a.id === id)?.label ?? '').filter(Boolean)
    if (addonNames.length) parts.push(...addonNames)
    return parts.length ? `${drink.name} (${parts.join(', ')})` : drink.name
  }, [drink, size, tempChoice, sweetness, iceLevel, addons, isIced, isFrappe, addons_list])

  const handleAdd = useCallback(() => {
    if (!drink) return
    addItem({
      cartId: `${drink.id}-${Date.now()}`,
      type: 'drink',
      itemId: drink.id,
      name: buildName(),
      price: totalPrice,
      qty: 1,
    })
    setAdded(true)
    toast.success(`${drink.name} ditambahkan!`)
    setTimeout(() => { setAdded(false); onClose() }, 700)
  }, [drink, addItem, buildName, totalPrice, onClose])

  const toggleAddon = (id: string) => {
    setAddons((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <AnimatePresence>
      {drink && (
        <>
          {/* Backdrop */}
          <motion.div
            key="bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-midnight/50 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            key="sh"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 36 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-3xl border border-border bg-card shadow-[0_-20px_60px_0_rgb(0_0_0/0.15)]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            role="dialog"
            aria-modal="true"
            aria-label={`Pilihan ${drink.name}`}
          >
            {/* Drag handle */}
            <div className="flex justify-center pb-1 pt-3">
              <div className="h-1 w-10 rounded-full bg-border" aria-hidden="true" />
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-cream text-midnight/40 transition-colors hover:text-midnight focus-visible:outline-2 focus-visible:outline-glaze-pink"
              aria-label="Tutup"
            >
              <IconX size={16} stroke={2} aria-hidden="true" />
            </button>

            {/* Scrollable body */}
            <div className="max-h-[82dvh] overflow-y-auto overscroll-contain px-5 pb-6 pt-1 sm:px-6">

              {/* Hero row — visual + info */}
              <div className="flex items-center gap-4">
                <div className="shrink-0 rounded-2xl bg-cream p-3">
                  <CupIllustration category={drink.category} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-block rounded-full bg-glaze-pink/10 px-2 py-0.5 text-[10px] font-semibold text-glaze-pink">
                    {CATEGORY_LABELS[drink.category]}
                  </span>
                  <h2 className="mt-1.5 font-display text-xl font-bold leading-snug text-midnight sm:text-2xl">
                    {drink.name}
                  </h2>
                  <p className="mt-0.5 text-xs leading-relaxed text-midnight/55 line-clamp-2 sm:line-clamp-3">
                    {drink.description}
                  </p>
                  <p className="mt-2 font-display text-xl font-bold text-glaze-pink sm:text-2xl">
                    {formatRupiah(drink.price)}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="my-4 h-px bg-border" />

              {/* ── Ukuran ── */}
              <div className="mb-4">
                <SectionLabel>Ukuran</SectionLabel>
                <div className="grid grid-cols-2 gap-2">
                  {SIZES.map((s) => (
                    <Chip key={s.id} selected={size === s.id} onClick={() => setSize(s.id)}>
                      <span className="block">{s.label} <span className="font-normal text-midnight/40">{s.desc}</span></span>
                      {s.priceAdd > 0 && <span className="block text-[10px]">+{formatRupiah(s.priceAdd)}</span>}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* ── Suhu (hanya untuk 'both') ── */}
              {drink.temperature === 'both' && !isFrappe && (
                <div className="mb-4">
                  <SectionLabel>Suhu</SectionLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {(['hot', 'iced'] as const).map((t) => (
                      <Chip key={t} selected={tempChoice === t} onClick={() => setTemp(t)}>
                        {t === 'hot' ? 'Hot' : 'Iced'}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Tingkat Manis (non-frappe) ── */}
              {!isFrappe && (
                <div className="mb-4">
                  <SectionLabel>Tingkat Manis</SectionLabel>
                  <div className="grid grid-cols-3 gap-2">
                    {SWEETNESS.map((sw) => (
                      <Chip key={sw.id} selected={sweetness === sw.id} onClick={() => setSweetness(sw.id)}>
                        <span className="block text-center">{sw.label}</span>
                        <span className="block text-center text-[10px] font-normal text-midnight/40">{sw.desc}</span>
                      </Chip>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Level Es (untuk iced / frappe) ── */}
              {(isIced || isFrappe) && (
                <div className="mb-4">
                  <SectionLabel>Level Es</SectionLabel>
                  <div className="grid grid-cols-3 gap-2">
                    {ICE_LEVELS.map((il) => (
                      <Chip key={il.id} selected={iceLevel === il.id} onClick={() => setIce(il.id)}>
                        {il.label}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Add-ons ── */}
              <div className="mb-5">
                <SectionLabel>Tambahan (opsional)</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {addons_list.map((a) => (
                    <AddonChip
                      key={a.id}
                      label={a.label}
                      price={a.price}
                      selected={addons.has(a.id)}
                      onClick={() => toggleAddon(a.id)}
                    />
                  ))}
                </div>
              </div>

              {/* ── Add to cart (sticky-ish) ── */}
              <button
                type="button"
                onClick={handleAdd}
                disabled={added}
                className={cn(
                  'flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold transition-all duration-200',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glaze-pink',
                  added
                    ? 'bg-green-500 text-white scale-[0.98]'
                    : 'bg-glaze-pink text-white hover:bg-burnt-sugar active:scale-[0.97]',
                )}
              >
                {added
                  ? <><IconCheck size={16} stroke={2.5} aria-hidden="true" /> Ditambahkan!</>
                  : <>Tambah ke Keranjang — {formatRupiah(totalPrice)}</>}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default memo(DrinkDetailModal)
