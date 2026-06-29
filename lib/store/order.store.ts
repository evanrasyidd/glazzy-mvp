'use client'

import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import type { FulfillmentType, PaymentMethod, OrderStatus, OrderDetails } from '@/lib/types'

// ============================================================
// GLAZZY — Order Store (Zustand)
// ============================================================

interface OrderStore extends OrderDetails {
  status: OrderStatus

  // Actions
  setFulfillment: (type: FulfillmentType) => void
  setDetails: (details: Partial<OrderDetails>) => void
  mockCheckout: () => Promise<void>
  resetOrder: () => void
}

const initialState: OrderDetails & { status: OrderStatus } = {
  fulfillment: 'pickup',
  address: '',
  pickupTime: '',
  customerName: '',
  customerPhone: '',
  notes: '',
  paymentMethod: 'transfer',
  status: 'idle',
}

export const useOrderStore = create<OrderStore>()((set) => ({
  ...initialState,

  setFulfillment: (type) =>
    set({
      fulfillment: type,
      // Reset address/pickupTime saat ganti fulfillment
      address: '',
      pickupTime: '',
    }),

  setDetails: (details) => set((state) => ({ ...state, ...details })),

  mockCheckout: async () => {
    set({ status: 'pending' })
    // Simulasi loading 1.5 detik
    await new Promise<void>((resolve) => setTimeout(resolve, 1500))
    set({ status: 'confirmed' })
  },

  resetOrder: () => set({ ...initialState }),
}))

// ============================================================
// Selector hooks — mencegah re-render tidak perlu
// ============================================================

export const useOrderStatus = () =>
  useOrderStore((state) => state.status)

export const useOrderFulfillment = () =>
  useOrderStore((state) => state.fulfillment)

export const useOrderDetails = () =>
  useOrderStore(
    useShallow((state) => ({
      fulfillment: state.fulfillment,
      address: state.address,
      pickupTime: state.pickupTime,
      customerName: state.customerName,
      customerPhone: state.customerPhone,
      notes: state.notes,
      paymentMethod: state.paymentMethod,
      status: state.status,
    })),
  )

export const useOrderActions = () =>
  useOrderStore(
    useShallow((state) => ({
      setFulfillment: state.setFulfillment,
      setDetails: state.setDetails,
      mockCheckout: state.mockCheckout,
      resetOrder: state.resetOrder,
    })),
  )

// Helper: validasi form sebelum checkout
export function validateOrderDetails(
  details: Partial<OrderDetails>,
): string | null {
  if (!details.customerName?.trim()) return 'Nama harus diisi'
  if (!details.customerPhone?.trim()) return 'Nomor HP harus diisi'
  if (details.fulfillment === 'pickup' && !details.pickupTime)
    return 'Pilih jam pickup terlebih dahulu'
  if (details.fulfillment === 'delivery' && !details.address?.trim())
    return 'Alamat pengiriman harus diisi'
  return null
}
