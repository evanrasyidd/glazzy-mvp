'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion, useReducedMotion } from 'framer-motion'
import { IconInfoCircle, IconShoppingCart } from '@tabler/icons-react'
import PageHeader from '@/components/ui/PageHeader'
import PackageCard from '@/components/packages/PackageCard'
import { packages } from '@/lib/data/packages'
import { useCartActions } from '@/lib/store/cart.store'
import { toast } from '@/components/ui/Toast'
import { formatRupiah, generateCartId } from '@/lib/utils'
import type { Package } from '@/lib/types'

// FlavorPicker di-lazy load — hanya load saat user memilih paket dengan slots
const FlavorPicker = dynamic(() => import('@/components/packages/FlavorPicker'), {
  ssr: false,
})

// ============================================================
// GLAZZY — Packages Page
// ============================================================

export default function PackagesPage() {
  const prefersReduced = useReducedMotion()
  const { addItem } = useCartActions()

  const [selectedPkgId, setSelectedPkgId] = useState<string | null>(null)
  const [pickerPkg, setPickerPkg] = useState<Package | null>(null)
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedPkgId((prev) => (prev === id ? null : id))
    },
    [],
  )

  const handleAddSelected = useCallback(() => {
    if (!selectedPkgId) return
    const pkg = packages.find((p) => p.id === selectedPkgId)
    if (!pkg) return

    // Paket dengan slots → buka flavor picker
    if (pkg.slots > 0) {
      setPickerPkg(pkg)
      setIsPickerOpen(true)
      return
    }

    // Paket tanpa slots (random, fixed, combo) → langsung tambah
    addItem({
      cartId: generateCartId(),
      type: 'package',
      itemId: pkg.id,
      name: pkg.name,
      price: pkg.price,
      qty: 1,
    })
    toast.success(`${pkg.name} ditambahkan ke keranjang!`)
    setSelectedPkgId(null)
  }, [selectedPkgId, addItem])

  const selectedPkg = packages.find((p) => p.id === selectedPkgId)

  return (
    <>
      <PageHeader
        title="Paket & Box"
        subtitle="Mau belanja banyak? Ada pilihan dari Box of 3 sampai Two Dozen. Hemat lebih banyak."
        eyebrow="Semakin banyak, semakin hemat"
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Info banner */}
        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-lemon-curd/40 bg-lemon-curd/10 p-4">
          <IconInfoCircle size={18} className="mt-0.5 shrink-0 text-midnight/60" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-midnight/70">
            Untuk paket dengan pilihan rasa, kamu bisa mix & match semua varian donut. 
            Paket <strong>Mini Donuts Box</strong> topping-nya acak dari toko. 
            Paket <strong>Family Treat</strong> isinya sudah fix.
          </p>
        </div>

        {/* Package grid */}
        <motion.div
          className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4"
          initial={prefersReduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.06 }}
        >
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, type: 'spring', stiffness: 260, damping: 24 }}
            >
              <PackageCard
                pkg={pkg}
                isSelected={selectedPkgId === pkg.id}
                onSelect={handleSelect}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Sticky bottom CTA */}
        {selectedPkg && (
          <motion.div
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="fixed bottom-4 left-0 right-0 z-30 flex justify-center px-4"
          >
            <div className="flex w-full max-w-md items-center justify-between gap-3 rounded-2xl bg-midnight px-5 py-3.5 shadow-[0_8px_32px_0_rgb(0_0_0/0.25)]">
              <div>
                <p className="text-xs text-white/50">Paket dipilih</p>
                <p className="font-semibold text-white">{selectedPkg.name}</p>
              </div>
              <button
                type="button"
                onClick={handleAddSelected}
                className="flex items-center gap-2 rounded-xl bg-glaze-pink px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-burnt-sugar focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95"
                aria-label={`Tambah ${selectedPkg.name} ke keranjang`}
              >
                <IconShoppingCart size={16} stroke={2} aria-hidden="true" />
                {selectedPkg.slots > 0 ? 'Pilih Rasa' : `Tambah — ${formatRupiah(selectedPkg.price)}`}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Flavor picker — lazy loaded */}
      {pickerPkg && (
        <FlavorPicker
          pkg={pickerPkg}
          isOpen={isPickerOpen}
          onClose={() => {
            setIsPickerOpen(false)
            setSelectedPkgId(null)
          }}
        />
      )}
    </>
  )
}
