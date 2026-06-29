'use client'

import { memo, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { IconTrash, IconPlus, IconMinus, IconPackage } from '@tabler/icons-react'
import DonutIllustration from '@/components/ui/DonutIllustration'
import { getDonutById } from '@/lib/data/donuts'
import { useCartActions } from '@/lib/store/cart.store'
import { cn, formatRupiah } from '@/lib/utils'
import type { CartItem as CartItemType } from '@/lib/types'

// ============================================================
// GLAZZY — CartItem Component
// ============================================================

interface CartItemProps {
  item: CartItemType
}

function CartItem({ item }: CartItemProps) {
  const prefersReduced = useReducedMotion()
  const { updateQty, removeItem } = useCartActions()

  const handleDecrease = useCallback(() => {
    updateQty(item.cartId, item.qty - 1)
  }, [item.cartId, item.qty, updateQty])

  const handleIncrease = useCallback(() => {
    updateQty(item.cartId, item.qty + 1)
  }, [item.cartId, item.qty, updateQty])

  const handleRemove = useCallback(() => {
    removeItem(item.cartId)
  }, [item.cartId, removeItem])

  // Untuk donut: ambil data warna
  const donutData = item.type === 'donut' ? getDonutById(item.itemId) : null

  return (
    <motion.div
      layout
      initial={prefersReduced ? {} : { opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: 16, height: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4"
      aria-label={`${item.name}, ${item.qty} item, ${formatRupiah(item.price * item.qty)}`}
    >
      {/* Illustration / Icon */}
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-cream">
        {donutData ? (
          <DonutIllustration
            color={donutData.color}
            accentColor={donutData.accentColor}
            name={donutData.name}
            size={48}
          />
        ) : (
          <IconPackage size={24} stroke={1.5} className="text-glaze-pink" aria-hidden="true" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <p className="truncate font-semibold text-midnight">{item.name}</p>

        {/* Flavor slots untuk paket */}
        {item.flavorSlots && item.flavorSlots.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.flavorSlots.slice(0, 4).map((donutId, i) => {
              const d = getDonutById(donutId)
              return d ? (
                <span key={i} className="rounded-full bg-cream px-2 py-0.5 text-[10px] text-midnight/60">
                  {d.name}
                </span>
              ) : null
            })}
            {item.flavorSlots.length > 4 && (
              <span className="rounded-full bg-cream px-2 py-0.5 text-[10px] text-midnight/60">
                +{item.flavorSlots.length - 4} lainnya
              </span>
            )}
          </div>
        )}

        <p className="text-sm font-bold text-glaze-pink">{formatRupiah(item.price * item.qty)}</p>
        {item.qty > 1 && (
          <p className="text-xs text-midnight/40">{formatRupiah(item.price)} / pcs</p>
        )}
      </div>

      {/* Qty controls */}
      <div className="flex shrink-0 flex-col items-end gap-2">
        <button
          type="button"
          onClick={handleRemove}
          className="text-midnight/30 transition-colors hover:text-red-500 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-red-400"
          aria-label={`Hapus ${item.name} dari keranjang`}
        >
          <IconTrash size={15} stroke={1.75} aria-hidden="true" />
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleDecrease}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-lg border border-border transition-colors',
              'hover:border-glaze-pink hover:text-glaze-pink focus-visible:outline-2 focus-visible:outline-glaze-pink',
            )}
            aria-label={`Kurangi ${item.name}`}
          >
            <IconMinus size={12} stroke={2.5} aria-hidden="true" />
          </button>
          <span className="w-6 text-center text-sm font-semibold text-midnight" aria-live="polite">
            {item.qty}
          </span>
          <button
            type="button"
            onClick={handleIncrease}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-lg border border-border transition-colors',
              'hover:border-glaze-pink hover:text-glaze-pink focus-visible:outline-2 focus-visible:outline-glaze-pink',
            )}
            aria-label={`Tambah ${item.name}`}
          >
            <IconPlus size={12} stroke={2.5} aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default memo(CartItem)
