'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { IconX, IconCheck, IconShoppingCart } from '@tabler/icons-react'
import SlotGrid from '@/components/packages/SlotGrid'
import DonutPickerGrid from '@/components/packages/DonutPickerGrid'
import { cn, formatRupiah, generateCartId } from '@/lib/utils'
import { useCartActions } from '@/lib/store/cart.store'
import { toast } from '@/components/ui/Toast'
import type { Package } from '@/lib/types'

// ============================================================
// GLAZZY — FlavorPicker Panel
// Slide-in dari bawah — hanya load saat dibutuhkan
// ============================================================

interface FlavorPickerProps {
  pkg: Package
  isOpen: boolean
  onClose: () => void
}

export default function FlavorPicker({ pkg, isOpen, onClose }: FlavorPickerProps) {
  const prefersReduced = useReducedMotion()
  const { addItem } = useCartActions()

  // slots: array donutId untuk setiap slot ('' = belum diisi)
  const [slots, setSlots] = useState<string[]>(Array(pkg.slots).fill(''))
  const [activeSlot, setActiveSlot] = useState(0)

  const filledCount = slots.filter(Boolean).length
  const allFilled = filledCount === pkg.slots

  const handleSlotClick = useCallback((index: number) => {
    setActiveSlot(index)
  }, [])

  const handleDonutSelect = useCallback(
    (donutId: string) => {
      setSlots((prev) => {
        const next = [...prev]
        next[activeSlot] = donutId
        return next
      })
      // Auto-advance ke slot kosong berikutnya
      setActiveSlot((prev) => {
        const nextEmpty = slots.findIndex((s, i) => i > prev && !s)
        if (nextEmpty !== -1) return nextEmpty
        const firstEmpty = slots.findIndex((s, i) => i !== prev && !s)
        return firstEmpty !== -1 ? firstEmpty : prev
      })
    },
    [activeSlot, slots],
  )

  const handleAddToCart = useCallback(() => {
    if (!allFilled) return
    const cartId = generateCartId()
    addItem({
      cartId,
      type: 'package',
      itemId: pkg.id,
      name: pkg.name,
      price: pkg.price,
      qty: 1,
      flavorSlots: slots,
    })
    toast.success(`${pkg.name} ditambahkan ke keranjang!`)
    setSlots(Array(pkg.slots).fill(''))
    setActiveSlot(0)
    onClose()
  }, [allFilled, slots, pkg, addItem, onClose])

  const panelVariants = prefersReduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1 }, exit: { opacity: 0 } }
    : { hidden: { y: '100%' }, show: { y: 0 }, exit: { y: '100%' } }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-midnight/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            variants={panelVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col rounded-t-3xl bg-card shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={`Pilih rasa untuk ${pkg.name}`}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3" aria-hidden="true">
              <div className="h-1 w-10 rounded-full bg-border" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="font-display text-lg font-bold text-midnight">{pkg.name}</h2>
                <p className="text-sm text-midnight/55">
                  {filledCount} / {pkg.slots} rasa dipilih
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-midnight/50 hover:bg-cream hover:text-midnight focus-visible:outline-2 focus-visible:outline-glaze-pink"
                aria-label="Tutup picker"
              >
                <IconX size={18} stroke={2} aria-hidden="true" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-border" aria-hidden="true">
              <motion.div
                className="h-full bg-glaze-pink"
                animate={{ width: `${(filledCount / pkg.slots) * 100}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              />
            </div>

            {/* Slots */}
            <div className="border-b border-border px-5 py-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-midnight/40">
                Slot donut kamu
              </p>
              <SlotGrid
                slots={slots}
                activeSlotIndex={activeSlot}
                onSlotClick={handleSlotClick}
              />
              <p className="mt-3 text-xs text-midnight/40">
                Slot{' '}
                <span className="font-semibold text-glaze-pink">{activeSlot + 1}</span>{' '}
                aktif — pilih donut di bawah
              </p>
            </div>

            {/* Donut picker */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <DonutPickerGrid
                selectedId={slots[activeSlot] ?? ''}
                onSelect={handleDonutSelect}
              />
            </div>

            {/* Footer CTA */}
            <div className="border-t border-border px-5 py-4 pb-safe">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!allFilled}
                aria-disabled={!allFilled}
                className={cn(
                  'flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all duration-150',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glaze-pink',
                  allFilled
                    ? 'bg-glaze-pink text-white hover:bg-burnt-sugar active:scale-[0.98]'
                    : 'cursor-not-allowed bg-border text-midnight/30',
                )}
              >
                {allFilled ? (
                  <>
                    <IconShoppingCart size={18} stroke={2} aria-hidden="true" />
                    Tambah ke Keranjang — {formatRupiah(pkg.price)}
                  </>
                ) : (
                  <>Isi semua {pkg.slots} slot terlebih dahulu</>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
