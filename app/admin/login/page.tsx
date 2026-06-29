'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  IconLock, IconUser, IconEye, IconEyeOff,
  IconAlertTriangle, IconLoader2,
} from '@tabler/icons-react'
import { useAdminAuth, useAdminAuthActions, ADMIN_USERNAME } from '@/lib/store/auth.store'
import { useHydrated } from '@/lib/hooks/useHydrated'
import { cn } from '@/lib/utils'

// ============================================================
// GLAZZY Admin — Login Page
// Credentials dari auth.store
// ============================================================

export default function AdminLoginPage() {
  const router = useRouter()
  const prefersReduced = useReducedMotion()
  const hydrated = useHydrated()

  const { isAuthenticated, loginError, isLoginLocked } = useAdminAuth()
  const { login, clearError } = useAdminAuthActions()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [shake, setShake]         = useState(false)

  // Sudah login → langsung ke /admin
  useEffect(() => {
    if (hydrated && isAuthenticated) router.replace('/admin')
  }, [hydrated, isAuthenticated, router])

  const handleSubmit = useCallback(async () => {
    if (loading || isLoginLocked) return
    if (!username.trim() || !password) return

    setLoading(true)
    clearError()
    // Simulasi network delay biar terasa real
    await new Promise((r) => setTimeout(r, 600))

    const ok = login(username.trim(), password)
    setLoading(false)

    if (ok) {
      router.replace('/admin')
    } else {
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }, [loading, isLoginLocked, username, password, login, clearError, router])

  // Enter key submit
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSubmit() },
    [handleSubmit],
  )

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-midnight px-4">
      {/* Background subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        aria-hidden="true"
      />

      {/* Logo */}
      <motion.div
        initial={prefersReduced ? {} : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 text-center"
      >
        <p className="font-display text-4xl font-extrabold italic text-glaze-pink">GLAZZY</p>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/30">
          Admin Dashboard
        </p>
      </motion.div>

      {/* Card */}
      <motion.div
        animate={shake && !prefersReduced ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.45 }}
        className="w-full max-w-sm"
      >
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 22 }}
          className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm"
        >
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className={cn(
              'flex h-14 w-14 items-center justify-center rounded-2xl transition-colors',
              isLoginLocked ? 'bg-red-500/20' : 'bg-glaze-pink/15',
            )}>
              <IconLock
                size={26}
                className={isLoginLocked ? 'text-red-400' : 'text-glaze-pink'}
                aria-hidden="true"
              />
            </div>
          </div>

          <h1 className="mb-1 text-center font-display text-xl font-bold text-white">
            {isLoginLocked ? 'Akun Terkunci' : 'Masuk sebagai Admin'}
          </h1>
          <p className="mb-6 text-center text-xs text-white/35">
            {isLoginLocked
              ? 'Terlalu banyak percobaan gagal'
              : 'Masukkan kredensial admin untuk melanjutkan'}
          </p>

          {!isLoginLocked && (
            <div className="space-y-3">
              {/* Username */}
              <div>
                <label htmlFor="username" className="mb-1.5 block text-xs font-semibold text-white/50">
                  Username
                </label>
                <div className="relative">
                  <IconUser
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                    aria-hidden="true"
                  />
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    autoCapitalize="none"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="admin"
                    disabled={loading}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:border-glaze-pink focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-white/50">
                  Password
                </label>
                <div className="relative">
                  <IconLock
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                    aria-hidden="true"
                  />
                  <input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="••••••••••"
                    disabled={loading}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-11 text-sm text-white placeholder:text-white/20 focus:border-glaze-pink focus:outline-none disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 focus-visible:outline-none"
                    aria-label={showPass ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPass
                      ? <IconEyeOff size={16} aria-hidden="true" />
                      : <IconEye size={16} aria-hidden="true" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {loginError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 rounded-xl bg-red-500/10 px-3 py-2.5 text-xs font-medium text-red-400"
                    role="alert"
                  >
                    <IconAlertTriangle size={14} className="shrink-0" aria-hidden="true" />
                    {loginError}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !username.trim() || !password}
                className={cn(
                  'mt-2 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold transition-all',
                  'focus-visible:outline-2 focus-visible:outline-glaze-pink',
                  loading || !username.trim() || !password
                    ? 'cursor-not-allowed bg-white/8 text-white/25'
                    : 'bg-glaze-pink text-white hover:bg-burnt-sugar active:scale-[0.98] shadow-[0_4px_20px_0_rgb(181_51_138/0.3)]',
                )}
              >
                {loading
                  ? <><IconLoader2 size={16} className="animate-spin" aria-hidden="true" /> Memverifikasi...</>
                  : 'Masuk'}
              </button>
            </div>
          )}

          {isLoginLocked && (
            <div className="rounded-xl bg-red-500/10 px-4 py-3 text-center">
              <p className="text-sm text-red-400">Hubungi pengelola toko untuk membuka kunci akun.</p>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Credential hint (dev only) */}
      <p className="mt-6 text-center text-[11px] text-white/15">
        Demo: <span className="font-mono text-white/25">{ADMIN_USERNAME} / {process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "—"}</span>
      </p>
    </div>
  )
}
