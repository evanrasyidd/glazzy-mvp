'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { IconShoppingCart, IconArrowLeft, IconArrowRight, IconLoader2 } from '@tabler/icons-react'
import CartItemComponent from '@/components/cart/CartItem'
import OrderSummary from '@/components/cart/OrderSummary'
import FulfillmentToggle from '@/components/cart/FulfillmentToggle'
import PaymentSelector from '@/components/cart/PaymentSelector'
import { useCartItems, useCartTotalPrice, useCartActions } from '@/lib/store/cart.store'
import { useOrderActions, useOrderDetails, validateOrderDetails } from '@/lib/store/order.store'
import { useOrdersActions } from '@/lib/store/orders.store'
import { useHydrated } from '@/lib/hooks/useHydrated'
import { toast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'

const STEPS = ['Keranjang', 'Detail', 'Pembayaran']

export default function CartPage() {
  const prefersReduced = useReducedMotion()
  const router = useRouter()
  const hydrated = useHydrated()

  const itemsRaw = useCartItems()
  const totalPriceRaw = useCartTotalPrice()
  const items = hydrated ? itemsRaw : []
  const totalPrice = hydrated ? totalPriceRaw : 0

  const { clearCart } = useCartActions()
  const orderDetails = useOrderDetails()
  const { setDetails, mockCheckout } = useOrderActions()
  const { saveOrder } = useOrdersActions()

  const [step, setStep] = useState(0)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleNext = useCallback(async () => {
    if (step === 0) {
      if (items.length === 0) { toast.error('Keranjang kamu masih kosong!'); return }
      setStep(1); return
    }
    if (step === 1) {
      const err = validateOrderDetails(orderDetails)
      if (err) { toast.error(err); return }
      setStep(2); return
    }
    if (step === 2) {
      setIsCheckingOut(true)
      await mockCheckout()
      // Simpan order ke admin store dan ambil orderId
      const orderId = saveOrder({
        customerName:   orderDetails.customerName,
        customerPhone:  orderDetails.customerPhone,
        fulfillment:    orderDetails.fulfillment,
        address:        orderDetails.address,
        pickupTime:     orderDetails.pickupTime,
        paymentMethod:  orderDetails.paymentMethod,
        notes:          orderDetails.notes,
        items,
        totalPrice,
      })
      clearCart()
      // Pass orderId + method ke halaman konfirmasi
      router.push(`/payment?id=${orderId}&total=${totalPrice}`)
    }
  }, [step, items, totalPrice, orderDetails, mockCheckout, saveOrder, clearCart, router])

  const handleBack = useCallback(() => { if (step > 0) setStep((s) => s - 1) }, [step])
  const isEmpty = items.length === 0

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Step indicator */}
      <nav aria-label="Langkah checkout" className="mb-8">
        <ol className="flex items-center gap-2">
          {STEPS.map((label, i) => (
            <li key={label} className="flex items-center gap-2">
              <div
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors duration-200',
                  i < step ? 'bg-glaze-pink text-white'
                    : i === step ? 'border-2 border-glaze-pink text-glaze-pink'
                    : 'border border-border text-midnight/30',
                )}
                aria-current={i === step ? 'step' : undefined}
              >{i + 1}</div>
              <span className={cn('hidden text-xs font-medium sm:inline', i === step ? 'text-midnight' : 'text-midnight/40')}>
                {label}
              </span>
              {i < STEPS.length - 1 && <div className="h-px w-6 bg-border sm:w-10" aria-hidden="true" />}
            </li>
          ))}
        </ol>
      </nav>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step-0"
            initial={prefersReduced ? {} : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReduced ? {} : { opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <IconShoppingCart size={22} className="text-glaze-pink" aria-hidden="true" />
              <h1 className="font-display text-2xl font-bold text-midnight">Keranjang Belanja</h1>
            </div>
            {!hydrated ? (
              <div className="space-y-3">
                {[1,2].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-border/40" />)}
              </div>
            ) : isEmpty ? (
              <div className="flex flex-col items-center gap-5 py-20 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream">
                  <IconShoppingCart size={36} stroke={1.25} className="text-border" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-midnight">Keranjang masih kosong</p>
                  <p className="mt-1 text-sm text-midnight/50">Yuk mulai pilih donutmu!</p>
                </div>
                <Link href="/menu" className="rounded-xl bg-glaze-pink px-6 py-2.5 text-sm font-semibold text-white hover:bg-burnt-sugar">
                  Lihat Menu
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map((item) => <CartItemComponent key={item.cartId} item={item} />)}
                  </AnimatePresence>
                </div>
                <div className="lg:sticky lg:top-24">
                  <OrderSummary items={items} totalPrice={totalPrice} />
                </div>
              </div>
            )}
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step-1"
            initial={prefersReduced ? {} : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReduced ? {} : { opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="space-y-4"
          >
            <h1 className="font-display text-2xl font-bold text-midnight">Detail Pemesanan</h1>
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <h2 className="font-display text-lg font-bold text-midnight">Info Pemesan</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-xs font-semibold text-midnight/60">Nama Lengkap</label>
                  <input id="name" type="text" value={orderDetails.customerName} onChange={(e) => setDetails({ customerName: e.target.value })} placeholder="Nama kamu" className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-midnight placeholder:text-midnight/30 focus:border-glaze-pink focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold text-midnight/60">Nomor HP</label>
                  <input id="phone" type="tel" value={orderDetails.customerPhone} onChange={(e) => setDetails({ customerPhone: e.target.value })} placeholder="08xx-xxxx-xxxx" className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-midnight placeholder:text-midnight/30 focus:border-glaze-pink focus:outline-none" />
                </div>
              </div>
              <div>
                <label htmlFor="notes" className="mb-1.5 block text-xs font-semibold text-midnight/60">Catatan (opsional)</label>
                <textarea id="notes" rows={2} value={orderDetails.notes} onChange={(e) => setDetails({ notes: e.target.value })} placeholder="Contoh: tolong dikemas rapi..." className="w-full resize-none rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-midnight placeholder:text-midnight/30 focus:border-glaze-pink focus:outline-none" />
              </div>
            </div>
            <FulfillmentToggle />
            <OrderSummary items={items} totalPrice={totalPrice} showTitle={false} />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step-2"
            initial={prefersReduced ? {} : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReduced ? {} : { opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="space-y-4"
          >
            <h1 className="font-display text-2xl font-bold text-midnight">Pembayaran</h1>
            <PaymentSelector />
            <OrderSummary items={items} totalPrice={totalPrice} showTitle={false} />
          </motion.div>
        )}
      </AnimatePresence>

      {hydrated && !isEmpty && (
        <div className="mt-8 flex items-center justify-between gap-3">
          {step > 0 ? (
            <button type="button" onClick={handleBack} className="flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-midnight transition-colors hover:border-glaze-pink hover:text-glaze-pink focus-visible:outline-2 focus-visible:outline-glaze-pink">
              <IconArrowLeft size={16} stroke={2.5} aria-hidden="true" /> Kembali
            </button>
          ) : (
            <Link href="/menu" className="flex items-center gap-2 text-sm font-medium text-midnight/50 hover:text-glaze-pink">
              <IconArrowLeft size={15} stroke={2.5} aria-hidden="true" /> Tambah item
            </Link>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={isCheckingOut}
            className={cn(
              'flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glaze-pink',
              isCheckingOut ? 'cursor-wait bg-glaze-pink/60' : 'bg-glaze-pink hover:bg-burnt-sugar active:scale-95',
            )}
          >
            {isCheckingOut
              ? <><IconLoader2 size={16} className="animate-spin" aria-hidden="true" /> Memproses...</>
              : step === 2
                ? 'Konfirmasi Pesanan'
                : <>{step === 0 ? 'Lanjut ke Detail' : 'Lanjut ke Pembayaran'}<IconArrowRight size={16} stroke={2.5} aria-hidden="true" /></>}
          </button>
        </div>
      )}
    </div>
  )
}
