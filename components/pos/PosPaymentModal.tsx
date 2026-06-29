'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  IconX, IconCircleCheck, IconCash,
  IconBuildingBank, IconQrcode, IconRefresh,
} from '@tabler/icons-react'
import { cn, formatRupiah } from '@/lib/utils'
import { usePosStore, usePosActions, usePosTotalPrice, QUICK_CASH, type PosPaymentMethod } from '@/lib/store/pos.store'
import { useOrdersActions } from '@/lib/store/orders.store'
import type { CartItem } from '@/lib/types'

// ============================================================
// GLAZZY POS — Payment Modal
// BUG FIX: map PosItem → CartItem sebelum saveOrder
// ============================================================

interface PosPaymentModalProps {
  isOpen: boolean
  onClose: () => void
}

const METHODS: { id: PosPaymentMethod; label: string; Icon: typeof IconCash }[] = [
  { id: 'cash',     label: 'Tunai',    Icon: IconCash },
  { id: 'transfer', label: 'Transfer', Icon: IconBuildingBank },
  { id: 'qris',     label: 'QRIS',     Icon: IconQrcode },
]

type ModalState = 'payment' | 'success'

export default function PosPaymentModal({ isOpen, onClose }: PosPaymentModalProps) {
  const prefersReduced = useReducedMotion()
  const totalPrice = usePosTotalPrice()
  const { cashReceived, items } = usePosStore()
  const { setCashReceived, clearOrder } = usePosActions()
  const { saveOrder } = useOrdersActions()

  const [method, setMethod] = useState<PosPaymentMethod>('cash')
  const [modalState, setModalState] = useState<ModalState>('payment')
  const [customCash, setCustomCash] = useState('')

  const change = Math.max(0, cashReceived - totalPrice)
  const cashSufficient = method !== 'cash' || cashReceived >= totalPrice

  const handleConfirm = useCallback(() => {
    if (!cashSufficient) return

    // ── BUG FIX: konversi PosItem[] → CartItem[] ──────────────
    // PosItem pakai { id, productId } tapi Order/CartItem expect { cartId, itemId }
    const cartItems: CartItem[] = items.map((i) => ({
      cartId:   i.id,
      itemId:   i.productId,
      type:     i.type,
      name:     i.name,
      price:    i.price,
      qty:      i.qty,
    }))

    saveOrder({
      customerName:   'Kasir POS',
      customerPhone:  '-',
      fulfillment:    'pickup',
      address:        '',
      pickupTime:     new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      paymentMethod:  method === 'cash' ? 'transfer' : method,
      notes:          method === 'cash'
        ? `Tunai ${formatRupiah(cashReceived)}, kembalian ${formatRupiah(change)}`
        : '',
      items:      cartItems,
      totalPrice,
    })
    setModalState('success')
  }, [cashSufficient, method, items, totalPrice, cashReceived, change, saveOrder])

  const handleNewOrder = useCallback(() => {
    clearOrder()
    setCashReceived(0)
    setCustomCash('')
    setMethod('cash')
    setModalState('payment')
    onClose()
  }, [clearOrder, setCashReceived, onClose])

  const handleClose = useCallback(() => {
    if (modalState === 'success') handleNewOrder()
    else { setModalState('payment'); onClose() }
  }, [modalState, handleNewOrder, onClose])

  const applyQuickCash = useCallback((amount: number) => {
    setCashReceived(amount)
    setCustomCash('')
  }, [setCashReceived])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70"
            onClick={handleClose}
          />
          <motion.div
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-sm -translate-y-1/2 overflow-hidden rounded-3xl border border-white/10 bg-[#12122A] shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Pembayaran"
          >
            <AnimatePresence mode="wait">
              {modalState === 'payment' ? (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
                    <h2 className="font-display text-lg font-bold text-white">Pembayaran</h2>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="rounded-lg p-1 text-white/30 hover:text-white focus-visible:outline-2 focus-visible:outline-glaze-pink"
                    >
                      <IconX size={18} stroke={2} aria-hidden="true" />
                    </button>
                  </div>

                  <div className="space-y-5 p-5">
                    {/* Total */}
                    <div className="rounded-2xl bg-glaze-pink/10 p-4 text-center">
                      <p className="text-xs text-white/40">Total Belanja</p>
                      <p className="mt-1 font-display text-3xl font-bold text-white">{formatRupiah(totalPrice)}</p>
                    </div>

                    {/* Payment method */}
                    <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Metode pembayaran">
                      {METHODS.map(({ id, label, Icon }) => (
                        <button
                          key={id}
                          type="button"
                          role="radio"
                          aria-checked={method === id}
                          onClick={() => { setMethod(id); setCashReceived(0); setCustomCash('') }}
                          className={cn(
                            'flex flex-col items-center gap-1.5 rounded-2xl border py-3 text-xs font-semibold transition-colors',
                            method === id
                              ? 'border-glaze-pink bg-glaze-pink/15 text-glaze-pink'
                              : 'border-white/8 text-white/40 hover:border-white/20 hover:text-white/60',
                          )}
                        >
                          <Icon size={18} aria-hidden="true" />
                          {label}
                        </button>
                      ))}
                    </div>

                    {/* Cash calculator */}
                    {method === 'cash' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-3"
                      >
                        <div>
                          <p className="mb-2 text-xs font-semibold text-white/40">Uang Diterima</p>
                          <div className="mb-2 flex flex-wrap gap-1.5">
                            {QUICK_CASH.filter((a) => a >= totalPrice).slice(0, 4).map((amount) => (
                              <button
                                key={amount}
                                type="button"
                                onClick={() => applyQuickCash(amount)}
                                className={cn(
                                  'rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors',
                                  cashReceived === amount
                                    ? 'border-glaze-pink bg-glaze-pink/15 text-glaze-pink'
                                    : 'border-white/10 text-white/50 hover:border-white/20 hover:text-white/70',
                                )}
                              >
                                {formatRupiah(amount)}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => applyQuickCash(totalPrice)}
                              className={cn(
                                'rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors',
                                cashReceived === totalPrice
                                  ? 'border-green-500/50 bg-green-500/10 text-green-400'
                                  : 'border-white/10 text-white/50 hover:border-green-500/30 hover:text-green-400',
                              )}
                            >
                              Pas
                            </button>
                          </div>
                          <input
                            type="number"
                            inputMode="numeric"
                            value={customCash}
                            onChange={(e) => {
                              setCustomCash(e.target.value)
                              setCashReceived(Number(e.target.value) || 0)
                            }}
                            placeholder="Atau masukkan nominal..."
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-glaze-pink focus:outline-none"
                          />
                        </div>
                        <div className={cn(
                          'flex items-center justify-between rounded-xl px-4 py-3',
                          cashSufficient ? 'bg-green-500/10' : 'bg-red-500/10',
                        )}>
                          <span className="text-sm text-white/60">Kembalian</span>
                          <span className={cn('text-lg font-bold', cashSufficient ? 'text-green-400' : 'text-red-400')}>
                            {cashSufficient ? formatRupiah(change) : 'Kurang!'}
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {/* QRIS — QR visual simulasi */}
                    {method === 'qris' && (
                      <div className="flex flex-col items-center gap-2 py-2">
                        <div className="rounded-2xl border border-white/10 bg-white p-3">
                          <svg width="108" height="108" viewBox="0 0 108 108" fill="none" aria-label="QR Code simulasi">
                            {/* QR finder squares */}
                            <rect x="4"  y="4"  width="30" height="30" rx="3" fill="#1A1A2E" />
                            <rect x="8"  y="8"  width="22" height="22" rx="2" fill="white" />
                            <rect x="12" y="12" width="14" height="14" rx="1" fill="#1A1A2E" />
                            <rect x="74" y="4"  width="30" height="30" rx="3" fill="#1A1A2E" />
                            <rect x="78" y="8"  width="22" height="22" rx="2" fill="white" />
                            <rect x="82" y="12" width="14" height="14" rx="1" fill="#1A1A2E" />
                            <rect x="4"  y="74" width="30" height="30" rx="3" fill="#1A1A2E" />
                            <rect x="8"  y="78" width="22" height="22" rx="2" fill="white" />
                            <rect x="12" y="82" width="14" height="14" rx="1" fill="#1A1A2E" />
                            {/* Data cells simulasi (pattern acak tapi terlihat seperti QR) */}
                            {[
                              [40,4],[44,4],[48,4],[52,4],[56,4],[60,4],[64,4],
                              [40,8],[48,8],[56,8],[64,8],
                              [40,12],[44,12],[52,12],[60,12],[64,12],
                              [44,16],[48,16],[56,16],[60,16],
                              [40,20],[44,20],[52,20],[56,20],[64,20],
                              [40,24],[48,24],[60,24],[64,24],
                              [40,28],[44,28],[48,28],[52,28],[56,28],[64,28],
                              [4,40],[8,40],[16,40],[20,40],[28,40],[36,40],[44,40],[52,40],[60,40],[64,40],[68,40],[76,40],[84,40],[92,40],[100,40],
                              [4,44],[12,44],[24,44],[32,44],[40,44],[48,44],[56,44],[68,44],[80,44],[88,44],[96,44],[104,44],
                              [4,48],[8,48],[16,48],[28,48],[36,48],[44,48],[52,48],[60,48],[72,48],[84,48],[96,48],[100,48],
                              [4,52],[12,52],[20,52],[28,52],[40,52],[52,52],[64,52],[72,52],[80,52],[92,52],[100,52],[104,52],
                              [4,56],[8,56],[20,56],[32,56],[44,56],[52,56],[60,56],[68,56],[80,56],[88,56],[96,56],
                              [4,60],[12,60],[24,60],[36,60],[48,60],[60,60],[72,60],[84,60],[96,60],[104,60],
                              [4,64],[8,64],[16,64],[20,64],[32,64],[40,64],[52,64],[64,64],[76,64],[84,64],[92,64],[100,64],
                              [40,74],[44,74],[52,74],[60,74],[68,74],[76,74],[84,74],[92,74],[100,74],[104,74],
                              [44,78],[52,78],[60,78],[72,78],[80,78],[88,78],[96,78],
                              [40,82],[48,82],[56,82],[60,82],[68,82],[76,82],[84,82],[92,82],[100,82],[104,82],
                              [44,86],[52,86],[64,86],[72,86],[80,86],[88,86],
                              [40,90],[48,90],[56,90],[60,90],[68,90],[80,90],[92,90],[100,90],[104,90],
                              [44,94],[52,94],[64,94],[76,94],[84,94],[96,94],
                              [40,98],[44,98],[48,98],[56,98],[68,98],[72,98],[80,98],[88,98],[96,98],[100,98],[104,98],
                            ].map(([x, y], i) => (
                              <rect key={i} x={x} y={y} width="4" height="4" fill="#1A1A2E" />
                            ))}
                          </svg>
                        </div>
                        <p className="text-center text-xs text-white/40">
                          Scan dengan aplikasi e-wallet
                        </p>
                        <p className="text-sm font-bold text-white">{formatRupiah(totalPrice)}</p>
                      </div>
                    )}

                    {/* Transfer info */}
                    {method === 'transfer' && (
                      <div className="rounded-2xl border border-white/8 bg-white/5 p-4 space-y-2">
                        <p className="text-xs font-semibold text-white/40">Transfer ke</p>
                        <p className="text-sm font-bold text-white">BCA 1234 5678 90</p>
                        <p className="text-xs text-white/50">a.n. PT GLAZZY INDONESIA</p>
                        <div className="mt-2 flex items-center justify-between rounded-xl bg-glaze-pink/10 px-3 py-2">
                          <span className="text-xs text-white/50">Nominal</span>
                          <span className="font-bold text-glaze-pink">{formatRupiah(totalPrice)}</span>
                        </div>
                      </div>
                    )}

                    {/* Confirm */}
                    <button
                      type="button"
                      onClick={handleConfirm}
                      disabled={!cashSufficient}
                      className={cn(
                        'w-full rounded-2xl py-3.5 text-sm font-bold transition-all',
                        cashSufficient
                          ? 'bg-glaze-pink text-white hover:bg-burnt-sugar active:scale-[0.98]'
                          : 'cursor-not-allowed bg-white/8 text-white/20',
                      )}
                    >
                      {method === 'cash' ? 'Konfirmasi Pembayaran' : 'Sudah Dibayar'}
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Success */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                    className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/15"
                  >
                    <IconCircleCheck size={44} className="text-green-400" stroke={1.5} aria-hidden="true" />
                  </motion.div>
                  <h2 className="font-display text-2xl font-bold text-white">Pembayaran Diterima!</h2>
                  <p className="mt-2 text-sm text-white/50">{formatRupiah(totalPrice)}</p>
                  {method === 'cash' && change > 0 && (
                    <div className="mt-4 rounded-2xl bg-green-500/10 px-4 py-3">
                      <p className="text-xs text-white/50">Kembalian</p>
                      <p className="text-xl font-bold text-green-400">{formatRupiah(change)}</p>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleNewOrder}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-glaze-pink py-3.5 text-sm font-bold text-white hover:bg-burnt-sugar active:scale-[0.98]"
                  >
                    <IconRefresh size={16} stroke={2.5} aria-hidden="true" />
                    Order Baru
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
