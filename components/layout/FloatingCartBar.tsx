'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { IconShoppingCart, IconChevronRight } from '@tabler/icons-react'
import { cn, formatRupiah } from '@/lib/utils'
import { useCartTotalItems, useCartTotalPrice } from '@/lib/store/cart.store'
import { useHydrated } from '@/lib/hooks/useHydrated'

const SHOW_ON_PATHS = ['/menu', '/packages']

export default function FloatingCartBar() {
  const pathname = usePathname()
  const hydrated = useHydrated()
  const totalItems = useCartTotalItems()
  const totalPrice = useCartTotalPrice()
  const prefersReduced = useReducedMotion()

  // Hanya tampil setelah hydrated AND ada item AND di halaman yang benar
  const isOnTargetPage = SHOW_ON_PATHS.some((p) => pathname.startsWith(p))
  const shouldShow = hydrated && isOnTargetPage && totalItems > 0

  const slideVariants = prefersReduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { y: 100, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: 100, opacity: 0 } }

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          key="floating-cart-bar"
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          className="fixed bottom-4 left-0 right-0 z-40 flex justify-center px-4"
          role="complementary"
          aria-label="Keranjang belanja"
        >
          <Link
            href="/cart"
            className={cn(
              'group flex w-full max-w-md items-center gap-3 rounded-2xl px-5 py-3.5',
              'bg-midnight text-white shadow-[0_8px_32px_0_rgb(0_0_0/0.25)]',
              'transition-transform duration-150 active:scale-[0.98]',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glaze-pink',
            )}
            aria-label={`Lihat keranjang — ${totalItems} item, total ${formatRupiah(totalPrice)}`}
          >
            <div className="relative shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-glaze-pink">
                <IconShoppingCart size={18} stroke={2} aria-hidden="true" />
              </div>
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-lemon-curd text-[10px] font-bold text-midnight" aria-hidden="true">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-xs font-medium text-white/60">{totalItems} item di keranjang</span>
              <span className="text-sm font-bold text-white">{formatRupiah(totalPrice)}</span>
            </div>
            <div className="flex shrink-0 items-center gap-1 rounded-lg bg-glaze-pink px-3 py-1.5 text-xs font-semibold text-white transition-colors duration-150 group-hover:bg-burnt-sugar">
              Lihat Cart
              <IconChevronRight size={14} stroke={2.5} className="transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
