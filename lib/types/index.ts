// ============================================================
// GLAZZY — TypeScript Types
// ============================================================

export interface Donut {
  id: string
  name: string
  slug: string
  category: 'classic' | 'berry' | 'filled' | 'savory'
  description: string
  price: number
  color: string        // hex — untuk ilustrasi SVG
  accentColor: string  // hex — untuk detail ilustrasi
  isAvailable: boolean
}

export interface Drink {
  id: string
  name: string
  slug: string
  category: 'coffee' | 'non-coffee' | 'frappe' | 'tea'
  description: string
  price: number
  temperature: 'hot' | 'iced' | 'both'
  isAvailable: boolean
}

export interface Package {
  id: string
  name: string
  slug: string
  slots: number             // 0 = tidak ada pilihan rasa
  price: number
  badge?: string            // 'Most Popular' | 'Best Value' | dll
  description?: string
  isRandomFlavor: boolean   // true = Mini Donuts Box
  isFixed: boolean          // true = Family Treat
  fixedContents?: string    // deskripsi isi fixed
  isCombo?: boolean         // true = Combo Pairing
}

export interface CartItem {
  cartId: string            // unique per item di cart
  type: 'donut' | 'drink' | 'package'
  itemId: string
  name: string
  price: number
  qty: number
  flavorSlots?: string[]    // array donutId per slot
  // Untuk combo: menyimpan donutId dan drinkId
  comboDonutId?: string
  comboDrinkId?: string
}

export interface StoreLocation {
  name: string
  address: string
  city: string
  phone: string
  instagram: string
  mapsEmbedUrl: string
  mapsUrl: string
}

export interface OperatingHours {
  day: string
  dayIndex: number   // 0 = Minggu, 1 = Senin, dst (sesuai getDay())
  open: string
  close: string
  isClosed: boolean
}

export interface StoreInfo {
  location: StoreLocation
  hours: OperatingHours[]
}

// ============================================================
// Zustand Store Types
// ============================================================

export interface CartState {
  items: CartItem[]
  flavorSlots: Record<string, string[]>  // packageCartId → flavor[]

  // Actions
  addItem: (item: CartItem) => void
  removeItem: (cartId: string) => void
  updateQty: (cartId: string, qty: number) => void
  setFlavorSlot: (packageCartId: string, slotIndex: number, donutId: string) => void
  clearCart: () => void

  // Derived
  totalPrice: number
  totalItems: number
}

export type FulfillmentType = 'pickup' | 'delivery'
export type PaymentMethod = 'transfer' | 'qris'
export type OrderStatus = 'idle' | 'pending' | 'confirmed'

export interface OrderDetails {
  fulfillment: FulfillmentType
  address: string
  pickupTime: string
  customerName: string
  customerPhone: string
  notes: string
  paymentMethod: PaymentMethod
}

export interface OrderState extends OrderDetails {
  status: OrderStatus

  // Actions
  setFulfillment: (type: FulfillmentType) => void
  setDetails: (details: Partial<OrderDetails>) => void
  mockCheckout: () => Promise<void>
  resetOrder: () => void
}
