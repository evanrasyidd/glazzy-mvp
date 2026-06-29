'use client'

import { useMemo } from 'react'
import {
  IconShoppingBag, IconClock,
  IconCoins, IconTrendingUp,
} from '@tabler/icons-react'
import { useOrders } from '@/lib/store/orders.store'
import { useHydrated } from '@/lib/hooks/useHydrated'
import { formatRupiah } from '@/lib/utils'
import type { Order } from '@/lib/store/orders.store'

// ============================================================
// GLAZZY Admin — StatsBar (fixed icons, dark-mode safe)
// ============================================================

export default function StatsBar() {
  const hydrated = useHydrated()
  const orders = useOrders()

  const stats = useMemo(() => {
    if (!hydrated) return { total: 0, newCount: 0, processingCount: 0, doneCount: 0, todayRevenue: 0, allTimeRevenue: 0 }
    const today = new Date().toDateString()
    const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today)
    return {
      total:           orders.length,
      newCount:        orders.filter((o) => o.status === 'new').length,
      processingCount: orders.filter((o) => o.status === 'processing').length,
      doneCount:       orders.filter((o) => o.status === 'done').length,
      todayRevenue:    todayOrders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.totalPrice, 0),
      allTimeRevenue:  orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.totalPrice, 0),
    }
  }, [orders, hydrated])

  const cards = [
    { label: 'Total Pesanan',   value: stats.total.toString(),              Icon: IconShoppingBag, color: 'text-glaze-pink',   bg: 'bg-glaze-pink/15',   border: 'border-glaze-pink/20' },
    { label: 'Pesanan Baru',    value: stats.newCount.toString(),           Icon: IconClock,       color: 'text-yellow-400',   bg: 'bg-yellow-400/15',   border: 'border-yellow-400/20' },
    { label: 'Diproses',        value: stats.processingCount.toString(),    Icon: IconTrendingUp,  color: 'text-blue-400',     bg: 'bg-blue-400/15',     border: 'border-blue-400/20' },
    { label: 'Revenue Hari Ini',value: formatRupiah(stats.todayRevenue),    Icon: IconCoins,       color: 'text-green-400',    bg: 'bg-green-400/15',    border: 'border-green-400/20' },
  ]

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map(({ label, value, Icon, color, bg, border }) => (
          <div key={label} className={`flex items-center gap-3 rounded-2xl border ${border} bg-white/5 p-4`}>
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
              <Icon size={20} className={color} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs text-white/50">{label}</p>
              <p className="truncate font-bold text-white">{hydrated ? value : '—'}</p>
            </div>
          </div>
        ))}
      </div>

      {hydrated && orders.length > 0 && (
        <RevenueBar orders={orders} allTimeRevenue={stats.allTimeRevenue} doneCount={stats.doneCount} />
      )}
    </div>
  )
}

function RevenueBar({ orders, allTimeRevenue, doneCount }: { orders: Order[]; allTimeRevenue: number; doneCount: number }) {
  const daily = useMemo(() => {
    const days: { label: string; revenue: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
      const ds = d.toDateString()
      const rev = orders.filter((o) => new Date(o.createdAt).toDateString() === ds && o.status !== 'cancelled').reduce((s, o) => s + o.totalPrice, 0)
      days.push({ label: i === 0 ? 'Hari ini' : d.toLocaleDateString('id-ID', { weekday: 'short' }), revenue: rev })
    }
    return days
  }, [orders])
  const maxRev = Math.max(...daily.map((d) => d.revenue), 1)

  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Revenue 7 Hari</p>
        <div className="flex gap-4 text-right">
          <div><p className="text-[10px] text-white/30">Selesai</p><p className="text-sm font-bold text-green-400">{doneCount}</p></div>
          <div><p className="text-[10px] text-white/30">All-time</p><p className="text-sm font-bold text-glaze-pink">{formatRupiah(allTimeRevenue)}</p></div>
        </div>
      </div>
      <div className="flex h-14 items-end gap-1.5">
        {daily.map((d) => {
          const pct = (d.revenue / maxRev) * 100
          const isToday = d.label === 'Hari ini'
          return (
            <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
              <div className="relative w-full flex items-end justify-center" style={{ height: 40 }}>
                <div
                  className={`w-full rounded-t-md ${isToday ? 'bg-glaze-pink' : 'bg-white/20'}`}
                  style={{ height: `${Math.max(pct, d.revenue > 0 ? 10 : 2)}%` }}
                />
              </div>
              <p className={`text-[9px] font-medium truncate w-full text-center ${isToday ? 'text-glaze-pink' : 'text-white/30'}`}>{d.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
