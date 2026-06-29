'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { IconPlus, IconCheck, IconShoppingCart } from '@tabler/icons-react'
import { cn, generateCartId } from '@/lib/utils'
import { useCartActions } from '@/lib/store/cart.store'
import type { CartItem } from '@/lib/types'

// ============================================================
// GLAZZY — AddToCartButton
// ============================================================

interface AddToCartButtonProps {
  item: Omit<CartItem, 'cartId' | 'qty'>
  className?: string
  size?: 'sm' | 'md'
  label?: string
}

type ButtonState = 'idle' | 'added'

export default function AddToCartButton({
  item,
  className,
  size = 'md',
  label = 'Tambah',
}: AddToCartButtonProps) {
  const { addItem } = useCartActions()
  const prefersReduced = useReducedMotion()
  const [state, setState] = useState<ButtonState>('idle')

  const handleAdd = useCallback(() => {
    if (state === 'added') return

    addItem({
      ...item,
      cartId: generateCartId(),
      qty: 1,
    })

    setState('added')
    const t = setTimeout(() => setState('idle'), 1400)
    return () => clearTimeout(t)
  }, [item, addItem, state])

  const isAdded = state === 'added'

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={isAdded}
      aria-label={isAdded ? 'Ditambahkan ke keranjang' : `${label} ${item.name} ke keranjang`}
      className={cn(
        'relative flex items-center justify-center gap-1.5 overflow-hidden rounded-xl font-semibold transition-colors duration-150',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glaze-pink',
        size === 'md' && 'h-10 px-4 text-sm',
        size === 'sm' && 'h-8 px-3 text-xs',
        isAdded
          ? 'bg-green-500 text-white'
          : 'bg-glaze-pink text-white hover:bg-burnt-sugar active:scale-95',
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isAdded ? (
          <motion.span
            key="added"
            initial={prefersReduced ? {} : { opacity: 0, scale: 0.7 }}
            animate={prefersReduced ? {} : { opacity: 1, scale: 1 }}
            exit={prefersReduced ? {} : { opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5"
          >
            <IconCheck size={size === 'md' ? 16 : 13} stroke={2.5} aria-hidden="true" />
            Added!
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={prefersReduced ? {} : { opacity: 0, scale: 0.7 }}
            animate={prefersReduced ? {} : { opacity: 1, scale: 1 }}
            exit={prefersReduced ? {} : { opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5"
          >
            <IconPlus size={size === 'md' ? 16 : 13} stroke={2.5} aria-hidden="true" />
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

// ============================================================
// CartIconButton — untuk versi icon-only di mobile
// ============================================================

interface CartIconButtonProps {
  item: Omit<CartItem, 'cartId' | 'qty'>
  className?: string
}

export function CartIconButton({ item, className }: CartIconButtonProps) {
  const { addItem } = useCartActions()
  const prefersReduced = useReducedMotion()
  const [state, setState] = useState<ButtonState>('idle')

  const handleAdd = useCallback(() => {
    if (state === 'added') return
    addItem({ ...item, cartId: generateCartId(), qty: 1 })
    setState('added')
    const t = setTimeout(() => setState('idle'), 1400)
    return () => clearTimeout(t)
  }, [item, addItem, state])

  const isAdded = state === 'added'

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={isAdded}
      aria-label={isAdded ? 'Ditambahkan' : `Tambah ${item.name} ke keranjang`}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-150',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glaze-pink',
        isAdded
          ? 'bg-green-500 text-white'
          : 'bg-glaze-pink text-white hover:bg-burnt-sugar active:scale-95',
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isAdded ? (
          <motion.span
            key="check"
            initial={prefersReduced ? {} : { scale: 0 }}
            animate={prefersReduced ? {} : { scale: 1 }}
            exit={prefersReduced ? {} : { scale: 0 }}
          >
            <IconCheck size={16} stroke={2.5} aria-hidden="true" />
          </motion.span>
        ) : (
          <motion.span
            key="cart"
            initial={prefersReduced ? {} : { scale: 0 }}
            animate={prefersReduced ? {} : { scale: 1 }}
            exit={prefersReduced ? {} : { scale: 0 }}
          >
            <IconShoppingCart size={16} stroke={1.75} aria-hidden="true" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
