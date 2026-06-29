'use client'

import { useState, useCallback, memo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  IconChevronDown, IconMapPin, IconShoppingBag,
  IconTruck, IconCreditCard, IconQrcode, IconPhone,
  IconUser, IconNote,
} from '@tabler/icons-react'
import { cn, formatRupiah } from '@/lib/utils'
import { getDonutById } from '@/lib/data/donuts'
import DonutIllustration from '@/components/ui/DonutIllustration'
import {
  useOrdersActions,
  STATUS_LABELS, STATUS_COLORS,
  type Order, type OrderStatus,
} from '@/lib/store/orders.store'

// ============================================================
// GLAZZY Admin — OrderCard
// ============================================================

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  new:        'processing',
  processing: 'done',
}

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  new:        'Mulai Proses',
  processing: 'Tandai Selesai',
}

interface OrderCardProps {
  order: Order
}

function OrderCard({ order }: OrderCardProps) {
  const prefersReduced = useReducedMotion()
  const { updateStatus } = useOrdersActions()
  const [expanded, setExpanded] = useState(false)
  const statusStyle = STATUS_COLORS[order.status]

  const handleAdvance = useCallback(() => {
    const next = NEXT_STATUS[order.status]
    if (next) updateStatus(order.orderId, next)
  }, [order.orderId, order.status, updateStatus])

  const handleCancel = useCallback(() => {
    updateStatus(order.orderId, 'cancelled')
  }, [order.orderId, updateStatus])

  const createdAt = new Date(order.createdAt)
  const timeStr = createdAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const dateStr = createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })

  return (
    <div className={cn(
      'overflow-hidden rounded-2xl border transition-colors duration-150',
      order.status === 'new' ? 'border-lemon-curd/40 bg-white/8'
        : order.status === 'done' ? 'border-white/5 bg-white/3 opacity-70'
        : order.status === 'cancelled' ? 'border-red-500/20 bg-white/3 opacity-50'
        : 'border-white/10 bg-white/5',
    )}>
      {/* Header — selalu visible */}
      <button
        type="button"
        onClick={() => setExpanded(p => !p)}
        className="flex w-full items-center gap-4 p-4 text-left focus-visible:outline-2 focus-visible:outline-glaze-pink"
        aria-expanded={expanded}
        aria-label={`Order ${order.orderId} — ${order.customerName}`}
      >
        {/* Status dot */}
        <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full', statusStyle.dot)} aria-hidden="true" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-white/40">{order.orderId}</span>
            <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', statusStyle.bg, statusStyle.text)}>
              {STATUS_LABELS[order.status]}
            </span>
            {order.status === 'new' && (
              <span className="rounded-full bg-lemon-curd px-2 py-0.5 text-[10px] font-bold text-midnight animate-pulse">
                BARU
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate font-semibold text-white">{order.customerName}</p>
          <p className="text-xs text-white/40">
            {order.items.length} item · {formatRupiah(order.totalPrice)} · {dateStr} {timeStr}
          </p>
        </div>

        {/* Fulfillment badge */}
        <span className="hidden shrink-0 items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-white/50 sm:flex">
          {order.fulfillment === 'pickup'
            ? <><IconShoppingBag size={12} aria-hidden="true" /> Pickup</>
            : <><IconTruck size={12} aria-hidden="true" /> Delivery</>}
        </span>

        <IconChevronDown
          size={16}
          className={cn('shrink-0 text-white/30 transition-transform duration-200', expanded && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {/* Expandable detail */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/8 p-4 space-y-4">
              {/* Customer info */}
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <IconUser size={14} className="shrink-0 text-white/30" aria-hidden="true" />
                  <span>{order.customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <IconPhone size={14} className="shrink-0 text-white/30" aria-hidden="true" />
                  <span>{order.customerPhone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-white/60">
                  {order.fulfillment === 'delivery'
                    ? <IconMapPin size={14} className="mt-0.5 shrink-0 text-white/30" aria-hidden="true" />
                    : <IconShoppingBag size={14} className="mt-0.5 shrink-0 text-white/30" aria-hidden="true" />}
                  <span>
                    {order.fulfillment === 'delivery'
                      ? order.address || '—'
                      : `Pickup jam ${order.pickupTime || '—'}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  {order.paymentMethod === 'qris'
                    ? <IconQrcode size={14} className="shrink-0 text-white/30" aria-hidden="true" />
                    : <IconCreditCard size={14} className="shrink-0 text-white/30" aria-hidden="true" />}
                  <span>{order.paymentMethod === 'qris' ? 'QRIS' : 'Transfer Bank'}</span>
                </div>
                {order.notes && (
                  <div className="flex items-start gap-2 text-sm text-white/60 sm:col-span-2">
                    <IconNote size={14} className="mt-0.5 shrink-0 text-white/30" aria-hidden="true" />
                    <span className="italic">{order.notes}</span>
                  </div>
                )}
              </div>

              {/* Items list */}
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
                  Item Pesanan
                </p>
                {order.items.map(item => {
                  const donut = item.type === 'donut' ? getDonutById(item.itemId) : null
                  return (
                    <div key={item.cartId} className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2">
                      {donut ? (
                        <DonutIllustration color={donut.color} accentColor={donut.accentColor} name={donut.name} size={32} />
                      ) : (
                        <div className="h-8 w-8 rounded-lg bg-glaze-pink/20 flex items-center justify-center text-[10px] font-bold text-glaze-pink">
                          PKG
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-white">{item.name}</p>
                        {item.flavorSlots && item.flavorSlots.length > 0 && (
                          <p className="truncate text-[10px] text-white/40">
                            {item.flavorSlots.map(id => getDonutById(id)?.name ?? id).slice(0, 3).join(', ')}
                            {item.flavorSlots.length > 3 && ` +${item.flavorSlots.length - 3}`}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-white/40">{item.qty}×</p>
                        <p className="text-sm font-semibold text-white">{formatRupiah(item.price * item.qty)}</p>
                      </div>
                    </div>
                  )
                })}
                <div className="flex justify-between border-t border-white/8 pt-2 text-sm font-bold text-white">
                  <span>Total</span>
                  <span className="text-glaze-pink">{formatRupiah(order.totalPrice)}</span>
                </div>
              </div>

              {/* Action buttons */}
              {order.status !== 'done' && order.status !== 'cancelled' && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAdvance}
                    className="flex-1 rounded-xl bg-glaze-pink px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-burnt-sugar focus-visible:outline-2 focus-visible:outline-glaze-pink active:scale-95"
                  >
                    {NEXT_LABEL[order.status]}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10 focus-visible:outline-2 focus-visible:outline-red-400"
                  >
                    Batalkan
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default memo(OrderCard)
