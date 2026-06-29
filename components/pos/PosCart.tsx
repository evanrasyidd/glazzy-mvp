'use client'

import { memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IconMinus, IconPlus, IconTrash, IconShoppingBag } from '@tabler/icons-react'
import DonutIllustration from '@/components/ui/DonutIllustration'
import { usePosItems, usePosTotalPrice, usePosTotalItems, usePosActions } from '@/lib/store/pos.store'
import { cn, formatRupiah } from '@/lib/utils'

// ============================================================
// GLAZZY POS — Cart Panel (kiri)
// ============================================================

interface PosCartProps {
  onPay: () => void
}

export default function PosCart({ onPay }: PosCartProps) {
  const items = usePosItems()
  const totalPrice = usePosTotalPrice()
  const totalItems = usePosTotalItems()
  const { updateQty, clearOrder } = usePosActions()
  const isEmpty = items.length === 0

  return (
    <div className="flex h-full flex-col border-r border-white/8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/30">Order</p>
          <p className="text-sm font-bold text-white">{totalItems} item</p>
        </div>
        {!isEmpty && (
          <button
            type="button"
            onClick={clearOrder}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/25 transition-colors hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-2 focus-visible:outline-red-400"
            aria-label="Kosongkan order"
          >
            <IconTrash size={15} stroke={1.75} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Item list */}
      <div className="flex-1 overflow-y-auto p-3">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 py-10 text-center">
            <IconShoppingBag size={32} stroke={1.25} className="text-white/10" aria-hidden="true" />
            <p className="text-sm text-white/25">Belum ada item</p>
            <p className="text-xs text-white/15">Tap produk untuk tambah</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12, height: 0 }}
                transition={{ type: 'spring', stiffness: 340, damping: 28 }}
                className="mb-2 flex items-center gap-3 rounded-xl border border-white/6 bg-white/5 px-3 py-2.5"
              >
                {/* Illustration */}
                <div className="shrink-0">
                  {item.color ? (
                    <DonutIllustration color={item.color} accentColor={item.accentColor!} name={item.name} size={32} />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-glaze-pink/20">
                      <span className="text-[10px] font-bold text-glaze-pink">☕</span>
                    </div>
                  )}
                </div>

                {/* Name + price */}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-semibold text-white">{item.name}</p>
                  <p className="text-xs text-glaze-pink">{formatRupiah(item.price)}</p>
                </div>

                {/* Qty controls */}
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/8 text-white/60 transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-glaze-pink"
                    aria-label={`Kurangi ${item.name}`}
                  >
                    <IconMinus size={10} stroke={2.5} aria-hidden="true" />
                  </button>
                  <span className="w-5 text-center text-xs font-bold text-white">{item.qty}</span>
                  <button
                    type="button"
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/8 text-white/60 transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-glaze-pink"
                    aria-label={`Tambah ${item.name}`}
                  >
                    <IconPlus size={10} stroke={2.5} aria-hidden="true" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Total + Pay button */}
      <div className="border-t border-white/8 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/50">Total</span>
          <span className="font-display text-2xl font-bold text-white">{formatRupiah(totalPrice)}</span>
        </div>
        <button
          type="button"
          onClick={onPay}
          disabled={isEmpty}
          className={cn(
            'w-full rounded-2xl py-4 text-base font-bold transition-all duration-150',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glaze-pink',
            isEmpty
              ? 'cursor-not-allowed bg-white/5 text-white/20'
              : 'bg-glaze-pink text-white hover:bg-burnt-sugar active:scale-[0.98]',
          )}
          aria-label={`Bayar ${formatRupiah(totalPrice)}`}
        >
          {isEmpty ? 'Tambah item dulu' : `Bayar ${formatRupiah(totalPrice)}`}
        </button>
      </div>
    </div>
  )
}
