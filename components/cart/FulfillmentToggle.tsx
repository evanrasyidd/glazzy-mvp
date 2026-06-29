'use client'

import { useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { IconShoppingBag, IconTruck, IconMapPin, IconClock } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { useOrderActions, useOrderDetails } from '@/lib/store/order.store'
import { getPickupTimeSlots } from '@/lib/data/store-info'

// ============================================================
// GLAZZY — FulfillmentToggle
// Smooth layout animation antara Pickup / Delivery form
// ============================================================

export default function FulfillmentToggle() {
  const prefersReduced = useReducedMotion()
  const { fulfillment, address, pickupTime } = useOrderDetails()
  const { setFulfillment, setDetails } = useOrderActions()
  const pickupSlots = getPickupTimeSlots()

  const handleToggle = useCallback(
    (type: 'pickup' | 'delivery') => {
      setFulfillment(type)
    },
    [setFulfillment],
  )

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-4 font-display text-lg font-bold text-midnight">Metode Pengambilan</h2>

      {/* Toggle buttons */}
      <div className="mb-5 grid grid-cols-2 gap-2" role="group" aria-label="Pilih metode pengambilan">
        {(
          [
            { type: 'pickup' as const, label: 'Pickup', Icon: IconShoppingBag },
            { type: 'delivery' as const, label: 'Delivery', Icon: IconTruck },
          ] as const
        ).map(({ type, label, Icon }) => (
          <button
            key={type}
            type="button"
            onClick={() => handleToggle(type)}
            aria-pressed={fulfillment === type}
            className={cn(
              'flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all duration-150',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glaze-pink',
              fulfillment === type
                ? 'border-glaze-pink bg-glaze-pink text-white'
                : 'border-border bg-cream text-midnight/60 hover:border-glaze-pink/40 hover:text-midnight',
            )}
          >
            <Icon size={16} stroke={1.75} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {/* Animated form */}
      <AnimatePresence mode="wait">
        {fulfillment === 'pickup' ? (
          <motion.div
            key="pickup"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="overflow-hidden"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 rounded-xl bg-cream p-3 text-sm text-midnight/70">
                <IconMapPin size={16} className="mt-0.5 shrink-0 text-glaze-pink" aria-hidden="true" />
                <span>Jl. Kemang Raya No. 88, Jakarta Selatan</span>
              </div>

              <div>
                <label htmlFor="pickup-time" className="mb-1.5 block text-xs font-semibold text-midnight/60">
                  <IconClock size={12} className="mr-1 inline" aria-hidden="true" />
                  Jam Pickup
                </label>
                {pickupSlots.length > 0 ? (
                  <select
                    id="pickup-time"
                    value={pickupTime}
                    onChange={(e) => setDetails({ pickupTime: e.target.value })}
                    className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-midnight focus:border-glaze-pink focus:outline-none"
                    required
                  >
                    <option value="">-- Pilih jam --</option>
                    {pickupSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                ) : (
                  <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
                    Toko sedang tutup — cek lagi besok ya!
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="delivery"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="overflow-hidden"
          >
            <div className="space-y-3">
              <div>
                <label htmlFor="delivery-address" className="mb-1.5 block text-xs font-semibold text-midnight/60">
                  Alamat Pengiriman
                </label>
                <textarea
                  id="delivery-address"
                  rows={3}
                  value={address}
                  onChange={(e) => setDetails({ address: e.target.value })}
                  placeholder="Nama jalan, nomor, RT/RW, kelurahan, kecamatan..."
                  className="w-full resize-none rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-midnight placeholder:text-midnight/30 focus:border-glaze-pink focus:outline-none"
                  required
                />
              </div>
              <p className="text-xs text-midnight/40">
                Delivery tersedia dalam area Jabodetabek. Ongkir dihitung berdasarkan jarak.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
