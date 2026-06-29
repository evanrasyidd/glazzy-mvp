'use client'

import { useCallback } from 'react'
import { IconBuildingBank, IconQrcode, IconCheck } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { useOrderActions, useOrderDetails } from '@/lib/store/order.store'
import type { PaymentMethod } from '@/lib/types'

// ============================================================
// GLAZZY — PaymentSelector (Transfer Bank + QRIS)
// ============================================================

const METHODS: { id: PaymentMethod; label: string; desc: string; Icon: typeof IconBuildingBank }[] = [
  {
    id: 'transfer',
    label: 'Transfer Bank',
    desc: 'BCA / Mandiri / BRI — konfirmasi via DM Instagram',
    Icon: IconBuildingBank,
  },
  {
    id: 'qris',
    label: 'QRIS',
    desc: 'Scan QR — semua e-wallet & m-banking',
    Icon: IconQrcode,
  },
]

// Mock QR placeholder
function QRPlaceholder() {
  return (
    <div
      className="img-placeholder mx-auto h-36 w-36 rounded-2xl"
      role="img"
      aria-label="QR Code QRIS GLAZZY — placeholder, akan diganti QR nyata saat produksi"
    >
      <svg width="80" height="80" viewBox="0 0 80 80" aria-hidden="true">
        {/* QR pattern sederhana */}
        {[0,1,2].map(row => [0,1,2].map(col => (
          <rect key={`${row}-${col}`} x={col*26} y={row*26} width={22} height={22} rx="3" fill="#1A1A2E" opacity="0.15" />
        )))}
        <rect x={28} y={28} width={24} height={24} rx="4" fill="#B5338A" opacity="0.3" />
        <text x="40" y="76" textAnchor="middle" fontSize="8" fill="#1A1A2E" opacity="0.4">QRIS</text>
      </svg>
    </div>
  )
}

export default function PaymentSelector() {
  const { paymentMethod } = useOrderDetails()
  const { setDetails } = useOrderActions()

  const handleSelect = useCallback(
    (method: PaymentMethod) => {
      setDetails({ paymentMethod: method })
    },
    [setDetails],
  )

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-4 font-display text-lg font-bold text-midnight">Metode Pembayaran</h2>

      <div className="space-y-3" role="radiogroup" aria-label="Pilih metode pembayaran">
        {METHODS.map(({ id, label, desc, Icon }) => {
          const isSelected = paymentMethod === id
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleSelect(id)}
              className={cn(
                'flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-left transition-all duration-150',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glaze-pink',
                isSelected
                  ? 'border-glaze-pink bg-glaze-pink/5'
                  : 'border-border hover:border-glaze-pink/40',
              )}
            >
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                  isSelected ? 'bg-glaze-pink text-white' : 'bg-cream text-midnight/50',
                )}
                aria-hidden="true"
              >
                <Icon size={18} stroke={1.75} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-midnight">{label}</p>
                <p className="text-xs text-midnight/50">{desc}</p>
              </div>
              {isSelected && (
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-glaze-pink"
                  aria-hidden="true"
                >
                  <IconCheck size={12} stroke={3} className="text-white" />
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Instruksi pembayaran */}
      {paymentMethod === 'transfer' && (
        <div className="mt-4 rounded-xl bg-cream p-4 text-xs text-midnight/60 space-y-1">
          <p className="font-semibold text-midnight">Rekening GLAZZY:</p>
          <p>BCA — 1234 5678 90 (a.n. GLAZZY ID)</p>
          <p>Mandiri — 9876 5432 100 (a.n. GLAZZY ID)</p>
          <p className="mt-2 text-midnight/40">Kirim bukti transfer via DM Instagram @glazzy.id</p>
        </div>
      )}

      {paymentMethod === 'qris' && (
        <div className="mt-4 space-y-2 text-center">
          <p className="text-xs text-midnight/50">Scan QR di bawah dengan aplikasi m-banking / e-wallet</p>
          <QRPlaceholder />
          <p className="text-xs text-midnight/40">QR Code di atas adalah placeholder. QR nyata akan dikirim via DM Instagram setelah order dikonfirmasi.</p>
        </div>
      )}
    </div>
  )
}
