'use client'

import { useState, useEffect } from 'react'

// ============================================================
// useHydrated — returns false on SSR, true after client mount
// Wajib dipakai sebelum render apapun dari Zustand persist
// ============================================================

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => { setHydrated(true) }, [])
  return hydrated
}
