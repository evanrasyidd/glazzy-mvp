import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'

// ============================================================
// GLAZZY — Admin Auth Store
// Credentials dibaca dari env vars (NEXT_PUBLIC_*)
// Fallback hanya untuk development jika .env.local belum dibuat
// ============================================================

// Baca dari env — fallback hanya buat dev lokal tanpa .env.local
const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME ?? 'admin'
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'glazzy2025'

// Export HANYA username (untuk ditampilkan di UI hint)
// Password TIDAK di-export keluar store
export { ADMIN_USERNAME }

const MAX_ATTEMPTS = 5

interface AdminAuthStore {
  isAuthenticated: boolean
  loginError:      string
  loginAttempts:   number
  isLoginLocked:   boolean

  login:      (username: string, password: string) => boolean
  logout:     () => void
  clearError: () => void
}

export const useAdminAuthStore = create<AdminAuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      loginError:      '',
      loginAttempts:   0,
      isLoginLocked:   false,

      login: (username, password) => {
        const { loginAttempts, isLoginLocked } = get()

        if (isLoginLocked) {
          set({ loginError: 'Akun terkunci. Hubungi pengelola toko.' })
          return false
        }

        // Perbandingan dilakukan di dalam store — password tidak di-expose ke komponen
        const valid =
          username.trim().toLowerCase() === ADMIN_USERNAME.toLowerCase() &&
          password === ADMIN_PASSWORD

        if (valid) {
          set({ isAuthenticated: true, loginError: '', loginAttempts: 0 })
          return true
        }

        const next   = loginAttempts + 1
        const locked = next >= MAX_ATTEMPTS
        set({
          loginAttempts: next,
          isLoginLocked: locked,
          loginError:    locked
            ? `Akun terkunci setelah ${MAX_ATTEMPTS}x percobaan gagal!`
            : `Username atau password salah. Sisa: ${MAX_ATTEMPTS - next}×`,
        })
        return false
      },

      logout: () =>
        set({ isAuthenticated: false, loginError: '', loginAttempts: 0 }),

      clearError: () => set({ loginError: '' }),
    }),
    {
      name:        'glazzy-admin-auth-v1',
      // Hanya persist isAuthenticated — bukan error/attempts
      partialize: (s) => ({ isAuthenticated: s.isAuthenticated }),
    },
  ),
)

// ── Selectors ──────────────────────────────────────────────────

export const useAdminAuth = () =>
  useAdminAuthStore(
    useShallow((s) => ({
      isAuthenticated: s.isAuthenticated,
      loginError:      s.loginError,
      isLoginLocked:   s.isLoginLocked,
    })),
  )

export const useAdminAuthActions = () =>
  useAdminAuthStore(
    useShallow((s) => ({
      login:      s.login,
      logout:     s.logout,
      clearError: s.clearError,
    })),
  )
