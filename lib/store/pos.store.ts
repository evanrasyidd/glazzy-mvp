'use client'

import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

// ============================================================
// GLAZZY — POS Store
// PIN dibaca dari env var NEXT_PUBLIC_POS_PIN
// Fallback ke '2025' hanya jika env belum diset
// ============================================================

// Baca PIN dari env — fallback hanya dev lokal
export const POS_PIN          = process.env.NEXT_PUBLIC_POS_PIN ?? '2025'
export const MAX_PIN_ATTEMPTS = 5

export interface PosItem {
  id:           string
  productId:    string
  type:         'donut' | 'drink'
  name:         string
  price:        number
  qty:          number
  color?:       string
  accentColor?: string
}

export type PosPaymentMethod = 'cash' | 'transfer' | 'qris'

interface PosStore {
  isUnlocked:      boolean
  pinAttempts:     number
  isLocked:        boolean
  items:           PosItem[]
  cashReceived:    number
  tryPin:          (pin: string) => boolean
  lock:            () => void
  addProduct:      (p: Omit<PosItem, 'id' | 'qty'>) => void
  updateQty:       (id: string, qty: number) => void
  removeItem:      (id: string) => void
  clearOrder:      () => void
  setCashReceived: (amount: number) => void
  totalPrice:      () => number
  totalItems:      () => number
  change:          () => number
}

export const usePosStore = create<PosStore>()((set, get) => ({
  isUnlocked:   false,
  pinAttempts:  0,
  isLocked:     false,
  items:        [],
  cashReceived: 0,

  tryPin: (pin) => {
    // Perbandingan PIN di dalam store
    if (pin === POS_PIN) {
      set({ isUnlocked: true, pinAttempts: 0, isLocked: false })
      return true
    }
    set((s) => {
      const attempts = s.pinAttempts + 1
      return { pinAttempts: attempts, isLocked: attempts >= MAX_PIN_ATTEMPTS }
    })
    return false
  },

  lock: () => set({ isUnlocked: false, items: [], cashReceived: 0 }),

  // Dedup: productId + type + name → variant berbeda = item terpisah
  addProduct: (p) =>
    set((s) => {
      const existing = s.items.find(
        (i) => i.productId === p.productId && i.type === p.type && i.name === p.name,
      )
      if (existing) {
        return {
          items: s.items.map((i) =>
            i.id === existing.id ? { ...i, qty: i.qty + 1 } : i,
          ),
        }
      }
      const id = `pos-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      return { items: [...s.items, { ...p, id, qty: 1 }] }
    }),

  updateQty: (id, qty) =>
    set((s) => ({
      items:
        qty <= 0
          ? s.items.filter((i) => i.id !== id)
          : s.items.map((i) => (i.id === id ? { ...i, qty } : i)),
    })),

  removeItem:      (id)     => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  clearOrder:      ()       => set({ items: [], cashReceived: 0 }),
  setCashReceived: (amount) => set({ cashReceived: amount }),

  totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
  totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),
  change:     () => Math.max(0, get().cashReceived - get().totalPrice()),
}))

// ── Selectors ──────────────────────────────────────────────────

export const usePosItems      = () => usePosStore((s) => s.items)
export const usePosTotalPrice = () => usePosStore((s) => s.totalPrice())
export const usePosTotalItems = () => usePosStore((s) => s.totalItems())

export const usePosAuth = () =>
  usePosStore(
    useShallow((s) => ({
      isUnlocked:  s.isUnlocked,
      pinAttempts: s.pinAttempts,
      isLocked:    s.isLocked,
    })),
  )

export const usePosActions = () =>
  usePosStore(
    useShallow((s) => ({
      tryPin:          s.tryPin,
      lock:            s.lock,
      addProduct:      s.addProduct,
      updateQty:       s.updateQty,
      removeItem:      s.removeItem,
      clearOrder:      s.clearOrder,
      setCashReceived: s.setCashReceived,
      change:          s.change,
    })),
  )

export const QUICK_CASH = [5000, 10000, 20000, 50000, 100000]
