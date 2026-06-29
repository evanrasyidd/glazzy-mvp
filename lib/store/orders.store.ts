'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import type { CartItem, FulfillmentType, PaymentMethod } from '@/lib/types'

export type OrderStatus = 'new' | 'processing' | 'done' | 'cancelled'

export interface Order {
  orderId: string
  createdAt: string
  customerName: string
  customerPhone: string
  fulfillment: FulfillmentType
  address: string
  pickupTime: string
  paymentMethod: PaymentMethod
  notes: string
  items: CartItem[]
  totalPrice: number
  status: OrderStatus
}

interface OrdersStore {
  orders: Order[]
  saveOrder: (order: Omit<Order, 'orderId' | 'createdAt' | 'status'>) => string
  updateStatus: (orderId: string, status: OrderStatus) => void
  clearAll: () => void
}

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set) => ({
      orders: [],
      saveOrder: (data) => {
        const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`
        const order: Order = { ...data, orderId, createdAt: new Date().toISOString(), status: 'new' }
        set((s) => ({ orders: [order, ...s.orders] }))
        return orderId
      },
      updateStatus: (orderId, status) =>
        set((s) => ({ orders: s.orders.map((o) => o.orderId === orderId ? { ...o, status } : o) })),
      clearAll: () => set({ orders: [] }),
    }),
    { name: 'glazzy-orders', partialize: (s) => ({ orders: s.orders }) },
  ),
)

// ── Selectors ─────────────────────────────────────────────────────────────────
// Primitives & arrays: selector langsung, tidak butuh useShallow
export const useOrders = () => useOrdersStore((s) => s.orders)

export const useOrdersByStatus = (status: OrderStatus | 'all') =>
  useOrdersStore((s) =>
    status === 'all' ? s.orders : s.orders.filter((o) => o.status === status),
  )

// Object selector → WAJIB useShallow supaya tidak infinite loop
export const useOrdersActions = () =>
  useOrdersStore(
    useShallow((s) => ({
      saveOrder: s.saveOrder,
      updateStatus: s.updateStatus,
      clearAll: s.clearAll,
    })),
  )

export const STATUS_LABELS: Record<OrderStatus, string> = {
  new:        'Pesanan Baru',
  processing: 'Diproses',
  done:       'Selesai',
  cancelled:  'Dibatalkan',
}

export const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; dot: string }> = {
  new:        { bg: 'bg-lemon-curd/20', text: 'text-midnight',  dot: 'bg-lemon-curd' },
  processing: { bg: 'bg-blue-50',       text: 'text-blue-700',  dot: 'bg-blue-500' },
  done:       { bg: 'bg-green-50',      text: 'text-green-700', dot: 'bg-green-500' },
  cancelled:  { bg: 'bg-red-50',        text: 'text-red-600',   dot: 'bg-red-400' },
}
