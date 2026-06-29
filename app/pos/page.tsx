'use client'

import { useState } from 'react'
import Link from 'next/link'
import { IconLock, IconLayoutDashboard, IconClock } from '@tabler/icons-react'
import PinLock from '@/components/pos/PinLock'
import PosMenuGrid from '@/components/pos/PosMenuGrid'
import PosCart from '@/components/pos/PosCart'
import PosPaymentModal from '@/components/pos/PosPaymentModal'
import { usePosAuth, usePosActions, usePosTotalItems } from '@/lib/store/pos.store'

// ============================================================
// GLAZZY — POS Page
// Fullscreen, no navbar/footer (via ConditionalLayout)
// PIN: 2025
// ============================================================

function PosHeader({ onLock }: { onLock: () => void }) {
  const totalItems = usePosTotalItems()
  const now = new Date()
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const dateStr = now.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })

  return (
    <header className="flex items-center justify-between border-b border-white/8 px-4 py-2.5">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <span className="font-display text-lg font-extrabold italic text-glaze-pink">GLAZZY</span>
        <span className="rounded-md bg-white/8 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/40">
          POS
        </span>
      </div>

      {/* Clock */}
      <div className="hidden items-center gap-1.5 sm:flex" aria-live="off">
        <IconClock size={13} className="text-white/25" aria-hidden="true" />
        <span className="text-xs text-white/40">{dateStr}, {timeStr}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link
          href="/admin"
          className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/40 transition-colors hover:border-white/20 hover:text-white/70 focus-visible:outline-2 focus-visible:outline-glaze-pink"
          aria-label="Buka Admin Dashboard"
        >
          <IconLayoutDashboard size={13} aria-hidden="true" />
          <span className="hidden sm:inline">Admin</span>
        </Link>
        <button
          type="button"
          onClick={onLock}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/40 transition-colors hover:border-red-500/30 hover:text-red-400 focus-visible:outline-2 focus-visible:outline-red-400"
          aria-label="Kunci POS"
        >
          <IconLock size={13} aria-hidden="true" />
          <span className="hidden sm:inline">Kunci</span>
        </button>
      </div>
    </header>
  )
}

export default function PosPage() {
  const { isUnlocked } = usePosAuth()
  const { lock } = usePosActions()
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)

  // Belum unlock → tampilkan PIN screen
  if (!isUnlocked) {
    return <PinLock />
  }

  return (
    <div className="flex h-screen flex-col bg-[#0F0F1E] text-white overflow-hidden">
      <PosHeader onLock={lock} />

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Cart — kiri, fixed width */}
        <div className="w-64 shrink-0 overflow-hidden sm:w-72 lg:w-80">
          <PosCart onPay={() => setIsPaymentOpen(true)} />
        </div>

        {/* Menu grid — kanan, flex-1 */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <PosMenuGrid />
        </div>
      </div>

      {/* Payment modal */}
      <PosPaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
      />
    </div>
  )
}
