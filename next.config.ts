import type { NextConfig } from 'next'

// ============================================================
// GLAZZY — Next.js Config
// Build: webpack (default di Next.js 15) — stabil untuk prod
// Dev:   Turbopack via --turbopack flag di npm run dev
// ============================================================

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // optimizePackageImports: tree-shake icon + animation library
  // Note: hanya aktif di Next.js 15+ webpack build
  experimental: {
    optimizePackageImports: ['@tabler/icons-react', 'framer-motion'],
  },
}

export default nextConfig
