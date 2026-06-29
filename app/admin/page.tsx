'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  IconArrowLeft, IconTrash,
  IconShoppingBag, IconFilter, IconLogout,
} from '@tabler/icons-react'
import StatsBar from '@/components/admin/StatsBar'
import OrderCard from '@/components/admin/OrderCard'
import { useOrders, useOrdersActions, STATUS_LABELS, type OrderStatus } from '@/lib/store/orders.store'
import { useAdminAuth, useAdminAuthActions } from '@/lib/store/auth.store'
import { useHydrated } from '@/lib/hooks/useHydrated'
import { cn } from '@/lib/utils'

// ============================================================
// GLAZZY — Admin Dashboard (with auth guard)
// ============================================================

const TABS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all',        label: 'Semua' },
  { value: 'new',        label: STATUS_LABELS.new },
  { value: 'processing', label: STATUS_LABELS.processing },
  { value: 'done',       label: STATUS_LABELS.done },
  { value: 'cancelled',  label: STATUS_LABELS.cancelled },
]

export default function AdminPage() {
  const router = useRouter()
  const prefersReduced = useReducedMotion()
  const hydrated = useHydrated()

  // ── Auth guard ──────────────────────────────────────────────
  const { isAuthenticated } = useAdminAuth()
  const { logout } = useAdminAuthActions()

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace('/admin/login')
    }
  }, [hydrated, isAuthenticated, router])

  // ── Orders ──────────────────────────────────────────────────
  const allOrders = useOrders()
  const { clearAll } = useOrdersActions()
  const [activeTab, setActiveTab]           = useState<OrderStatus | 'all'>('all')
  const [showConfirmClear, setShowConfirmClear] = useState(false)
  const [showConfirmLogout, setShowConfirmLogout] = useState(false)

  const orders = hydrated
    ? (activeTab === 'all' ? allOrders : allOrders.filter((o) => o.status === activeTab))
    : []

  const tabCounts = hydrated
    ? {
        all:        allOrders.length,
        new:        allOrders.filter((o) => o.status === 'new').length,
        processing: allOrders.filter((o) => o.status === 'processing').length,
        done:       allOrders.filter((o) => o.status === 'done').length,
        cancelled:  allOrders.filter((o) => o.status === 'cancelled').length,
      }
    : { all: 0, new: 0, processing: 0, done: 0, cancelled: 0 }

  const handleLogout = () => {
    logout()
    router.replace('/admin/login')
  }

  // Jangan render apapun sampai hydration + auth selesai
  if (!hydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-midnight">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-glaze-pink" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-midnight text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/8 bg-midnight/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-glaze-pink"
              aria-label="Kembali ke toko"
            >
              <IconArrowLeft size={18} stroke={2} aria-hidden="true" />
            </Link>
            <div>
              <span className="font-display text-lg font-extrabold italic text-glaze-pink">GLAZZY</span>
              <span className="ml-2 text-xs font-semibold uppercase tracking-widest text-white/30">Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/pos"
              className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/60 transition-colors hover:border-glaze-pink/40 hover:text-white focus-visible:outline-2 focus-visible:outline-glaze-pink"
            >
              <IconShoppingBag size={13} aria-hidden="true" />
              Buka POS
            </Link>
            <button
              type="button"
              onClick={() => setShowConfirmClear(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-2 focus-visible:outline-red-400"
              aria-label="Hapus semua order"
            >
              <IconTrash size={16} stroke={1.75} aria-hidden="true" />
            </button>
            {/* Logout */}
            <button
              type="button"
              onClick={() => setShowConfirmLogout(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/8 hover:text-white focus-visible:outline-2 focus-visible:outline-glaze-pink"
              aria-label="Logout"
            >
              <IconLogout size={16} stroke={1.75} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <StatsBar />

        {/* Filter tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1" role="tablist" aria-label="Filter status pesanan">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-colors duration-150',
                'focus-visible:outline-2 focus-visible:outline-glaze-pink',
                activeTab === tab.value
                  ? 'bg-glaze-pink text-white'
                  : 'text-white/40 hover:bg-white/5 hover:text-white',
              )}
            >
              {tab.label}
              <span className={cn(
                'rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                activeTab === tab.value ? 'bg-white/20 text-white' : 'bg-white/8 text-white/40',
              )}>
                {tabCounts[tab.value]}
              </span>
            </button>
          ))}
        </div>

        {/* Order list */}
        <AnimatePresence mode="wait">
          {orders.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3 py-20 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                <IconFilter size={28} stroke={1.25} className="text-white/20" aria-hidden="true" />
              </div>
              <p className="font-semibold text-white/40">Belum ada pesanan</p>
              <p className="text-sm text-white/25">
                {activeTab === 'all'
                  ? 'Pesanan masuk akan muncul di sini.'
                  : `Tidak ada pesanan dengan status "${STATUS_LABELS[activeTab as OrderStatus]}".`}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <AnimatePresence initial={false}>
                {orders.map((order) => (
                  <motion.div
                    key={order.orderId}
                    initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  >
                    <OrderCard order={order} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confirm clear modal */}
      <AnimatePresence>
        {showConfirmClear && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60"
              onClick={() => setShowConfirmClear(false)}
            />
            <motion.div
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-sm -translate-y-1/2 rounded-3xl border border-white/10 bg-midnight p-6 shadow-2xl"
            >
              <h2 className="font-display text-lg font-bold text-white">Hapus semua order?</h2>
              <p className="mt-2 text-sm text-white/50">Tindakan ini tidak bisa dibatalkan.</p>
              <div className="mt-5 flex gap-2">
                <button onClick={() => setShowConfirmClear(false)} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-semibold text-white/60 hover:bg-white/5">
                  Batal
                </button>
                <button onClick={() => { clearAll(); setShowConfirmClear(false) }} className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-600">
                  Hapus Semua
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirm logout modal */}
      <AnimatePresence>
        {showConfirmLogout && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60"
              onClick={() => setShowConfirmLogout(false)}
            />
            <motion.div
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-sm -translate-y-1/2 rounded-3xl border border-white/10 bg-midnight p-6 shadow-2xl"
            >
              <h2 className="font-display text-lg font-bold text-white">Keluar dari Admin?</h2>
              <p className="mt-2 text-sm text-white/50">Kamu perlu login lagi untuk mengakses dashboard.</p>
              <div className="mt-5 flex gap-2">
                <button onClick={() => setShowConfirmLogout(false)} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-semibold text-white/60 hover:bg-white/5">
                  Batal
                </button>
                <button onClick={handleLogout} className="flex-1 rounded-xl bg-glaze-pink py-2.5 text-sm font-bold text-white hover:bg-burnt-sugar">
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
