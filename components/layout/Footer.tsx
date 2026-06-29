import Link from 'next/link'
import {
  IconBrandInstagram,
  IconMapPin,
  IconClock,
  IconHeart,
  IconLayoutDashboard,
  IconShoppingBag,
} from '@tabler/icons-react'
import { storeInfo } from '@/lib/data/store-info'

// ============================================================
// GLAZZY — Footer (Server Component)
// ============================================================

const footerLinks = {
  'Menu': [
    { label: 'Semua Donut',  href: '/menu' },
    { label: 'Minuman',      href: '/menu#drinks' },
    { label: 'Paket & Box',  href: '/packages' },
  ],
  'Info': [
    { label: 'Tentang Kami', href: '/about' },
    { label: 'Lokasi Toko',  href: '/location' },
    { label: 'Keranjang',    href: '/cart' },
  ],
}

export default function Footer() {
  const { location } = storeInfo

  return (
    <footer className="bg-midnight text-white/80" role="contentinfo">
      <div className="h-[3px] w-full bg-glaze-pink" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block focus-visible:rounded-md focus-visible:outline-glaze-pink" aria-label="GLAZZY — Halaman utama">
              <span className="font-display text-2xl font-extrabold italic text-white">GLAZZY</span>
            </Link>
            <p className="mt-2 text-sm leading-relaxed text-white/50">Made fresh. Glazed right.</p>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Donut premium yang dibuat dengan bahan terbaik setiap hari — karena u deserved this.
            </p>
            <a
              href={`https://instagram.com/${location.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white/70 transition-colors duration-150 hover:border-glaze-pink hover:text-glaze-pink focus-visible:rounded-lg focus-visible:outline-glaze-pink"
              aria-label={`Follow GLAZZY di Instagram: ${location.instagram}`}
            >
              <IconBrandInstagram size={16} stroke={1.75} aria-hidden="true" />
              {location.instagram}
            </a>
          </div>

          {/* Nav Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">{group}</h3>
              <ul className="space-y-2.5" role="list">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-white/60 transition-colors duration-150 hover:text-white focus-visible:rounded focus-visible:outline-glaze-pink">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Store Info */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">Toko</h3>
            <ul className="space-y-3" role="list">
              <li className="flex items-start gap-2.5">
                <IconMapPin size={15} stroke={1.75} className="mt-0.5 shrink-0 text-glaze-pink" aria-hidden="true" />
                <address className="not-italic text-sm leading-relaxed text-white/60">
                  {location.address}<br />{location.city}
                </address>
              </li>
              <li className="flex items-start gap-2.5">
                <IconClock size={15} stroke={1.75} className="mt-0.5 shrink-0 text-glaze-pink" aria-hidden="true" />
                <span className="text-sm text-white/60">
                  Sen–Kam: 08:00–21:00<br />
                  Jum–Sab: 08:00–22:00<br />
                  Minggu: 08:00–20:00
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-white/8 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} GLAZZY. All rights reserved.
            </p>

            {/* Staff access links */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-white/20">Staff:</span>
              <Link
                href="/admin"
                className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/30 transition-colors hover:border-glaze-pink/40 hover:text-white/60 focus-visible:outline-2 focus-visible:outline-glaze-pink"
                aria-label="Admin Dashboard"
              >
                <IconLayoutDashboard size={12} stroke={1.75} aria-hidden="true" />
                Admin
              </Link>
              <Link
                href="/pos"
                className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/30 transition-colors hover:border-glaze-pink/40 hover:text-white/60 focus-visible:outline-2 focus-visible:outline-glaze-pink"
                aria-label="POS Kasir"
              >
                <IconShoppingBag size={12} stroke={1.75} aria-hidden="true" />
                POS Kasir
              </Link>
            </div>

            <p className="flex items-center gap-1 text-xs text-white/30">
              Made with{' '}
              <IconHeart size={12} className="text-glaze-pink" aria-label="love" fill="currentColor" />{' '}
              &amp; the right glaze.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
