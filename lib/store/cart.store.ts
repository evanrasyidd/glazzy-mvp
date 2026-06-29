'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import type { CartItem } from '@/lib/types'

// ============================================================
// GLAZZY — Cart Store (Zustand)
// ============================================================

interface CartStore {
  items: CartItem[]
  flavorSlots: Record<string, string[]> // packageCartId → flavor[]

  // Actions
  addItem: (item: CartItem) => void
  removeItem: (cartId: string) => void
  updateQty: (cartId: string, qty: number) => void
  setFlavorSlot: (packageCartId: string, slotIndex: number, donutId: string) => void
  clearCart: () => void

  // Derived (computed via selectors)
  totalPrice: () => number
  totalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      flavorSlots: {},

      addItem: (item) =>
        set((state) => {
          // Cek duplikat untuk donut/drink biasa (bukan package)
          if (item.type !== 'package') {
            const existing = state.items.find(
              (i) => i.itemId === item.itemId && i.type === item.type,
            )
            if (existing) {
              return {
                items: state.items.map((i) =>
                  i.cartId === existing.cartId
                    ? { ...i, qty: i.qty + item.qty }
                    : i,
                ),
              }
            }
          }
          return { items: [...state.items, item] }
        }),

      removeItem: (cartId) =>
        set((state) => {
          // Hapus juga flavor slots terkait jika ada
          const newSlots = { ...state.flavorSlots }
          delete newSlots[cartId]
          return {
            items: state.items.filter((i) => i.cartId !== cartId),
            flavorSlots: newSlots,
          }
        }),

      updateQty: (cartId, qty) =>
        set((state) => {
          if (qty <= 0) {
            const newSlots = { ...state.flavorSlots }
            delete newSlots[cartId]
            return {
              items: state.items.filter((i) => i.cartId !== cartId),
              flavorSlots: newSlots,
            }
          }
          return {
            items: state.items.map((i) =>
              i.cartId === cartId ? { ...i, qty } : i,
            ),
          }
        }),

      setFlavorSlot: (packageCartId, slotIndex, donutId) =>
        set((state) => {
          // Ambil item dari cart untuk tahu jumlah slot
          const cartItem = state.items.find((i) => i.cartId === packageCartId)
          const slotCount = cartItem?.flavorSlots?.length ?? 0

          const currentSlots = state.flavorSlots[packageCartId] ?? Array(slotCount).fill('')
          const newSlots = [...currentSlots]
          newSlots[slotIndex] = donutId

          return {
            flavorSlots: {
              ...state.flavorSlots,
              [packageCartId]: newSlots,
            },
            // Update juga flavorSlots di CartItem
            items: state.items.map((i) =>
              i.cartId === packageCartId
                ? { ...i, flavorSlots: newSlots }
                : i,
            ),
          }
        }),

      clearCart: () => set({ items: [], flavorSlots: {} }),

      totalPrice: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + item.price * item.qty, 0)
      },

      totalItems: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + item.qty, 0)
      },
    }),
    {
      name: 'glazzy-cart',
      // Hanya persist items dan flavorSlots — bukan fungsi
      partialize: (state) => ({
        items: state.items,
        flavorSlots: state.flavorSlots,
      }),
    },
  ),
)

// ============================================================
// Selector hooks — mencegah re-render tidak perlu
// ============================================================

export const useCartItems = () =>
  useCartStore(useShallow((state) => state.items))

export const useCartTotalPrice = () =>
  useCartStore((state) => state.totalPrice())

export const useCartTotalItems = () =>
  useCartStore((state) => state.totalItems())

export const useCartActions = () =>
  useCartStore(
    useShallow((state) => ({
      addItem: state.addItem,
      removeItem: state.removeItem,
      updateQty: state.updateQty,
      setFlavorSlot: state.setFlavorSlot,
      clearCart: state.clearCart,
    })),
  )

// Stable empty array — jangan pakai ?? [] inline karena buat referensi baru tiap render
const EMPTY_SLOTS: string[] = []

export const useFlavorSlots = (packageCartId: string) =>
  useCartStore((state) => state.flavorSlots[packageCartId] ?? EMPTY_SLOTS)
