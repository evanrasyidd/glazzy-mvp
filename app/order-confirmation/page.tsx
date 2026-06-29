'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import {
  IconCircleCheck, IconArrowRight, IconMapPin, IconClock, IconPhone,
} from '@tabler/icons-react'
import { storeInfo } from '@/lib/data/store-info'

// ============================================================
// GLAZZY — Order Confirmation / Receipt
// Tampil setelah pembayaran berhasil dari /payment
// ============================================================

function OrderConfirmationContent() {
  const prefersReduced = useReducedMotion()
  const searchParams = useSearchParams()

  const orderId  = searchParams.get('id')   ?? 'ORD-XXXXX'
  const paid     = searchParams.get('paid') === 'true'

  const now = new Date().toLocaleString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="flex min-h-[85dvh] items-center justify-center px-4 py-12">
      <motion.div
        initial={prefersReduced ? {} : { opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="w-full max-w-md space-y-4"
      >
        {/* Receipt card */}
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_16px_64px_0_rgb(0_0_0/0.08)]">
          {/* Header strip */}
          <div className="bg-glaze-pink px-6 py-6 text-center">
            <motion.div
              initial={prefersReduced ? {} : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
              className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20"
            >
              <IconCircleCheck size={40} stroke={1.75} className="text-white" aria-hidden="true" />
            </motion.div>
            <h1 className="font-display text-2xl font-bold text-white">
              {paid ? 'Pembayaran Dikonfirmasi!' : 'Pesanan Diterima!'}
            </h1>
            <p className="mt-1 text-sm text-white/70">
              {paid ? 'Pesananmu sedang kami proses' : 'Selesaikan pembayaran untuk memproses pesananmu'}
            </p>
          </div>

          {/* Receipt body */}
          <div className="divide-y divide-border">
            {/* Order ID + timestamp */}
            <div className="px-6 py-4 space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-midnight/50">Order ID</span>
                <span className="font-mono font-bold tracking-wider text-midnight">{orderId}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-midnight/50">Waktu</span>
                <span className="text-midnight">{now}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-midnight/50">Status</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${paid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {paid ? 'Pembayaran Diterima' : 'Menunggu Pembayaran'}
                </span>
              </div>
            </div>

            {/* Pickup info */}
            <div className="px-6 py-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-midnight/40">Info Pickup</p>
              <div className="flex items-start gap-2.5 text-sm text-midnight/60">
                <IconMapPin size={14} className="mt-0.5 shrink-0 text-glaze-pink" aria-hidden="true" />
                <span>{storeInfo.location.address}, {storeInfo.location.city}</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-midnight/60">
                <IconPhone size={14} className="mt-0.5 shrink-0 text-glaze-pink" aria-hidden="true" />
                <span>{storeInfo.location.phone}</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-midnight/60">
                <IconClock size={14} className="mt-0.5 shrink-0 text-glaze-pink" aria-hidden="true" />
                <span>Tunjukkan Order ID <span className="font-mono font-bold text-midnight">{orderId}</span> saat pickup</span>
              </div>
            </div>

            {/* Note */}
            <div className="bg-cream px-6 py-4">
              <p className="text-xs text-midnight/50 text-center">
                Screenshot halaman ini sebagai bukti pesananmu.
                Ini adalah simulasi — tidak ada transaksi nyata.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <Link
          href="/menu"
          className="flex items-center justify-center gap-2 rounded-2xl bg-glaze-pink px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-burnt-sugar focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glaze-pink"
        >
          Order Lagi <IconArrowRight size={15} stroke={2.5} aria-hidden="true" />
        </Link>
        <Link
          href="/"
          className="block rounded-2xl py-3 text-center text-sm font-medium text-midnight/50 transition-colors hover:text-midnight"
        >
          Kembali ke Beranda
        </Link>
      </motion.div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[85dvh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-glaze-pink" />
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  )
}
