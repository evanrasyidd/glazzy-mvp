'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { IconShoppingCart, IconMenu2, IconX, IconLayoutDashboard, IconShoppingBag } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { useCartTotalItems } from '@/lib/store/cart.store'
import { useHydrated } from '@/lib/hooks/useHydrated'

const navLinks = [
  { href: '/menu',     label: 'Menu' },
  { href: '/packages', label: 'Paket & Box' },
  { href: '/location', label: 'Lokasi' },
  { href: '/about',    label: 'About' },
]

export default function Navbar() {
  const pathname = usePathname()
  const prefersReduced = useReducedMotion()
  const hydrated = useHydrated()
  // Hanya baca cart setelah hydrated — prevent SSR mismatch
  const totalItemsRaw = useCartTotalItems()
  const totalItems = hydrated ? totalItemsRaw : 0

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobile = useCallback(() => setIsMobileOpen((p) => !p), [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full bg-cream transition-shadow duration-200',
        isScrolled && 'shadow-[0_2px_16px_0_rgb(0_0_0/0.08)]',
      )}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Navigasi utama"
      >
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-1 focus-visible:rounded-md" aria-label="GLAZZY — Halaman utama">
          <span className="font-display text-2xl font-extrabold italic tracking-tight text-glaze-pink transition-colors duration-150 group-hover:text-burnt-sugar" aria-hidden="true">
            GLAZZY
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex" role="list">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'relative rounded-md px-4 py-2 text-sm font-medium transition-colors duration-150',
                    isActive ? 'text-glaze-pink' : 'text-midnight/70 hover:text-midnight',
                  )}
                >
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-x-2 -bottom-0.5 h-[2px] rounded-full bg-glaze-pink"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Staff shortcuts — subtle, desktop only */}
          <div className="hidden items-center gap-1 border-r border-border pr-2 mr-1 md:flex">
            <Link
              href="/admin"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-midnight/30 transition-colors hover:bg-border/40 hover:text-glaze-pink focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-glaze-pink"
              title="Admin Dashboard"
              aria-label="Admin Dashboard"
            >
              <IconLayoutDashboard size={16} stroke={1.75} aria-hidden="true" />
            </Link>
            <Link
              href="/pos"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-midnight/30 transition-colors hover:bg-border/40 hover:text-glaze-pink focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-glaze-pink"
              title="POS Kasir"
              aria-label="POS Kasir"
            >
              <IconShoppingBag size={16} stroke={1.75} aria-hidden="true" />
            </Link>
          </div>
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-midnight/70 transition-colors duration-150 hover:bg-border/40 hover:text-glaze-pink focus-visible:rounded-full"
            aria-label={`Keranjang${totalItems > 0 ? `, ${totalItems} item` : ''}`}
          >
            <IconShoppingCart size={22} stroke={1.75} aria-hidden="true" />
            {/* Render badge hanya setelah hydrated */}
            {hydrated && totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-glaze-pink text-[10px] font-bold text-white" aria-hidden="true">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={toggleMobile}
            className="flex h-10 w-10 items-center justify-center rounded-full text-midnight/70 transition-colors duration-150 hover:bg-border/40 hover:text-midnight focus-visible:rounded-full md:hidden"
            aria-expanded={isMobileOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileOpen ? 'Tutup menu' : 'Buka menu'}
          >
            {isMobileOpen ? <IconX size={22} stroke={1.75} aria-hidden="true" /> : <IconMenu2 size={22} stroke={1.75} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            id="mobile-menu"
            role="navigation"
            aria-label="Navigasi mobile"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="border-t border-border bg-cream md:hidden"
          >
            <ul className="flex flex-col px-4 py-3" role="list">
              {navLinks.map(({ href, label }) => {
                const isActive = pathname.startsWith(href)
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        'flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors duration-150',
                        isActive ? 'bg-glaze-pink/8 font-semibold text-glaze-pink' : 'text-midnight/70 hover:bg-border/30 hover:text-midnight',
                      )}
                    >
                      {label}
                      {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-glaze-pink" aria-hidden="true" />}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
