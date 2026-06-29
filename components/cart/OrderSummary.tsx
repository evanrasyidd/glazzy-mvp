import { formatRupiah } from '@/lib/utils'
import type { CartItem } from '@/lib/types'

// ============================================================
// GLAZZY — OrderSummary (Server-compatible)
// ============================================================

interface OrderSummaryProps {
  items: CartItem[]
  totalPrice: number
  showTitle?: boolean
}

const DELIVERY_FEE = 15000
const MIN_FREE_DELIVERY = 150000

export default function OrderSummary({ items, totalPrice, showTitle = true }: OrderSummaryProps) {
  const subtotal = totalPrice
  // Perhitungan sederhana — delivery gratis jika subtotal ≥ 150k
  const isDeliveryFree = subtotal >= MIN_FREE_DELIVERY
  const deliveryNote = isDeliveryFree ? 'Gratis' : formatRupiah(DELIVERY_FEE)

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      {showTitle && (
        <h2 className="mb-4 font-display text-lg font-bold text-midnight">Ringkasan Pesanan</h2>
      )}

      {/* Item list */}
      <ul className="space-y-2 text-sm" role="list" aria-label="Daftar item pesanan">
        {items.map((item) => (
          <li key={item.cartId} className="flex items-center justify-between gap-3">
            <span className="flex-1 truncate text-midnight/70">
              {item.qty > 1 && (
                <span className="mr-1 font-semibold text-midnight">{item.qty}×</span>
              )}
              {item.name}
            </span>
            <span className="shrink-0 font-medium text-midnight">
              {formatRupiah(item.price * item.qty)}
            </span>
          </li>
        ))}
      </ul>

      <div className="my-4 border-t border-border" aria-hidden="true" />

      {/* Subtotal + ongkir */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-midnight/60">
          <span>Subtotal</span>
          <span>{formatRupiah(subtotal)}</span>
        </div>
        <div className="flex justify-between text-midnight/60">
          <span>Ongkos kirim</span>
          <span className={isDeliveryFree ? 'font-semibold text-green-600' : ''}>
            {deliveryNote}
          </span>
        </div>
        {!isDeliveryFree && (
          <p className="text-xs text-midnight/40">
            Gratis ongkir untuk pembelian ≥ {formatRupiah(MIN_FREE_DELIVERY)}
          </p>
        )}
      </div>

      <div className="my-4 border-t border-border" aria-hidden="true" />

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-midnight">Total</span>
        <span className="font-display text-xl font-bold text-glaze-pink">
          {formatRupiah(subtotal)}
        </span>
      </div>
      <p className="mt-1 text-right text-xs text-midnight/40">
        *Ongkir dihitung saat checkout
      </p>
    </div>
  )
}
