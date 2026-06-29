import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ============================================================
// GLAZZY — Utility Helpers
// ============================================================

/** Gabung class Tailwind secara kondisional, resolve konflik */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format harga ke Rupiah */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/** Generate cartId unik */
export function generateCartId(): string {
  return `cart-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

/** Truncate teks panjang */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trim()}…`
}
