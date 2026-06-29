'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { IconBackspace, IconLock, IconAlertTriangle } from '@tabler/icons-react'
import { usePosActions, usePosAuth, POS_PIN, MAX_PIN_ATTEMPTS } from '@/lib/store/pos.store'
import { cn } from '@/lib/utils'

// ============================================================
// GLAZZY POS — PinLock Screen
// PIN: 2025 (default)
// ============================================================

const PAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del']

export default function PinLock() {
  const prefersReduced = useReducedMotion()
  const { pinAttempts, isLocked } = usePosAuth()
  const { tryPin } = usePosActions()

  const [input, setInput] = useState('')
  const [shake, setShake] = useState(false)
  const [error, setError] = useState('')

  const handleKey = useCallback((key: string) => {
    if (isLocked) return
    if (key === 'del') {
      setInput((p) => p.slice(0, -1))
      setError('')
      return
    }
    if (input.length >= 4) return
    const next = input + key
    setInput(next)

    if (next.length === 4) {
      setTimeout(() => {
        const ok = tryPin(next)
        if (!ok) {
          setShake(true)
          setError(
            pinAttempts + 1 >= MAX_PIN_ATTEMPTS
              ? 'PIN salah terlalu banyak. POS terkunci!'
              : `PIN salah. Sisa percobaan: ${MAX_PIN_ATTEMPTS - (pinAttempts + 1)}`,
          )
          setInput('')
          setTimeout(() => setShake(false), 600)
        }
      }, 120)
    }
  }, [input, isLocked, tryPin, pinAttempts])

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleKey(e.key)
      if (e.key === 'Backspace') handleKey('del')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleKey])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-midnight px-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <p className="font-display text-3xl font-extrabold italic text-glaze-pink">GLAZZY</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-white/30">POS Kasir</p>
      </div>

      <motion.div
        animate={shake && !prefersReduced ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xs rounded-3xl border border-white/10 bg-white/5 p-6"
      >
        {/* Lock icon */}
        <div className="mb-6 flex justify-center">
          <div className={cn(
            'flex h-14 w-14 items-center justify-center rounded-full transition-colors',
            isLocked ? 'bg-red-500/20' : 'bg-glaze-pink/15',
          )}>
            <IconLock size={26} className={isLocked ? 'text-red-400' : 'text-glaze-pink'} aria-hidden="true" />
          </div>
        </div>

        <p className="mb-5 text-center text-sm font-medium text-white/50">
          {isLocked ? 'POS Terkunci' : 'Masukkan PIN'}
        </p>

        {/* PIN dots */}
        <div className="mb-6 flex justify-center gap-4" aria-label={`PIN: ${input.length} dari 4 digit terisi`}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                'h-3 w-3 rounded-full border-2 transition-all duration-150',
                i < input.length
                  ? 'scale-110 border-glaze-pink bg-glaze-pink'
                  : 'border-white/20 bg-transparent',
              )}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 flex items-center gap-2 rounded-xl bg-red-500/10 px-3 py-2 text-xs text-red-400"
            >
              <IconAlertTriangle size={14} aria-hidden="true" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Numpad */}
        {!isLocked ? (
          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Keypad PIN">
            {PAD.map((key, i) => {
              if (key === '') return <div key={`pad-empty-${i}`} />
              const isDel = key === 'del'
              return (
                <button
                  key={`pad-${i}`}
                  type="button"
                  onClick={() => handleKey(key)}
                  aria-label={isDel ? 'Hapus digit terakhir' : `Angka ${key}`}
                  className={cn(
                    'flex h-14 items-center justify-center rounded-2xl text-xl font-bold transition-all duration-100',
                    'focus-visible:outline-2 focus-visible:outline-glaze-pink',
                    'active:scale-90',
                    isDel
                      ? 'bg-white/5 text-white/40 hover:bg-white/10'
                      : 'bg-white/8 text-white hover:bg-white/15',
                  )}
                >
                  {isDel ? <IconBackspace size={20} aria-hidden="true" /> : key}
                </button>
              )
            })}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-red-400">Hubungi manajer untuk membuka kunci POS.</p>
          </div>
        )}
      </motion.div>

      {/* Hint */}
      {!isLocked && (
        <p className="mt-6 text-xs text-white/20">
          Default PIN: <span className="font-mono tracking-widest text-white/30">{POS_PIN}</span>
        </p>
      )}
    </div>
  )
}
