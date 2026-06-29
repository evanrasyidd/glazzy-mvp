'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FloatingCartBar from '@/components/layout/FloatingCartBar'

// ============================================================
// GLAZZY — ConditionalLayout
// Sembunyikan Navbar/Footer di route /admin dan /pos
// ============================================================

const FULLSCREEN_ROUTES = ['/admin', '/pos', '/payment']

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isFullscreen = FULLSCREEN_ROUTES.some((r) => pathname.startsWith(r))

  if (isFullscreen) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingCartBar />
    </>
  )
}
