'use client'

import { useEffect } from 'react'
import { create } from 'zustand'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  IconCircleCheck,
  IconAlertCircle,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'

// ============================================================
// GLAZZY — Toast System
// ============================================================

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  addToast: (message: string, type?: ToastType, duration?: number) => void
  removeToast: (id: string) => void
}

// Store global untuk toast
export const useToastStore = create<ToastStore>()((set) => ({
  toasts: [],
  addToast: (message, type = 'success', duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`
    set((state) => ({ toasts: [...state.toasts, { id, message, type, duration }] }))
    // Auto-remove
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, duration)
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

// Shorthand helpers
export const toast = {
  success: (msg: string, duration?: number) =>
    useToastStore.getState().addToast(msg, 'success', duration),
  error: (msg: string, duration?: number) =>
    useToastStore.getState().addToast(msg, 'error', duration),
  info: (msg: string, duration?: number) =>
    useToastStore.getState().addToast(msg, 'info', duration),
}

// ──────────────────────────────────────────
// Single Toast Item
// ──────────────────────────────────────────

const toastStyles: Record<ToastType, string> = {
  success: 'bg-midnight text-white border-green-500/30',
  error:   'bg-midnight text-white border-red-500/30',
  info:    'bg-midnight text-white border-glaze-pink/30',
}

const ToastIcon = ({ type }: { type: ToastType }) => {
  const cls = 'shrink-0'
  if (type === 'success') return <IconCircleCheck size={18} className={cn(cls, 'text-green-400')} aria-hidden="true" />
  if (type === 'error') return <IconAlertCircle size={18} className={cn(cls, 'text-red-400')} aria-hidden="true" />
  return <IconInfoCircle size={18} className={cn(cls, 'text-glaze-pink')} aria-hidden="true" />
}

function ToastItem({ toast: t }: { toast: Toast }) {
  const { removeToast } = useToastStore()
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      layout
      initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.95 }}
      animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      role="alert"
      aria-live="polite"
      className={cn(
        'flex w-full max-w-xs items-center gap-3 rounded-xl border px-4 py-3',
        'shadow-[0_8px_32px_0_rgb(0_0_0/0.25)]',
        toastStyles[t.type],
      )}
    >
      <ToastIcon type={t.type} />
      <p className="flex-1 text-sm font-medium">{t.message}</p>
      <button
        type="button"
        onClick={() => removeToast(t.id)}
        className="shrink-0 rounded-md p-0.5 opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white"
        aria-label="Tutup notifikasi"
      >
        <IconX size={14} stroke={2} aria-hidden="true" />
      </button>
    </motion.div>
  )
}

// ──────────────────────────────────────────
// Toast Container — mount di layout
// ──────────────────────────────────────────

export default function ToastContainer() {
  const { toasts } = useToastStore()

  return (
    <div
      className="pointer-events-none fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2 sm:bottom-6"
      aria-label="Notifikasi"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
