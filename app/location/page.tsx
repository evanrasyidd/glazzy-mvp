'use client'

import { useState, useEffect, useRef } from 'react'
import { IconMapPin, IconClock, IconBrandInstagram, IconExternalLink } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { storeInfo, isStoreOpenNow } from '@/lib/data/store-info'
import PageHeader from '@/components/ui/PageHeader'

// ============================================================
// GLAZZY — Location Page
// isStoreOpenNow() & new Date() dipakai di useEffect bukan render
// langsung → cegah SSR vs client hydration mismatch
// ============================================================

function MapEmbed({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="relative h-72 overflow-hidden rounded-2xl border border-border sm:h-96"
    >
      {shouldLoad ? (
        <iframe
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Lokasi GLAZZY di Google Maps"
          className="absolute inset-0"
        />
      ) : (
        <div
          className="img-placeholder absolute inset-0 flex flex-col items-center justify-center gap-3"
          aria-label="Peta Google Maps sedang dimuat..."
          role="img"
        >
          <IconMapPin size={32} stroke={1.5} className="text-border" aria-hidden="true" />
          <p className="text-sm text-midnight/40">Peta akan muncul saat halaman di-scroll</p>
        </div>
      )}
    </div>
  )
}

export default function LocationPage() {
  const { location, hours } = storeInfo

  // Semua yang bergantung pada new Date() harus di useEffect
  // supaya SSR dan client render sama → no hydration mismatch
  const [isOpen, setIsOpen] = useState<boolean | null>(null)
  const [todayIndex, setTodayIndex] = useState<number | null>(null)

  useEffect(() => {
    setIsOpen(isStoreOpenNow())
    setTodayIndex(new Date().getDay())
  }, [])

  const todayHours = todayIndex !== null
    ? hours.find((h) => h.dayIndex === todayIndex) ?? null
    : null

  return (
    <>
      <PageHeader
        title="Lokasi Toko"
        subtitle="Datang langsung atau pesan delivery — kami di sini."
        eyebrow="Find us"
      />

      <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        {/* Map */}
        <MapEmbed src={location.mapsEmbedUrl} />

        {/* Address + contact */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-bold text-midnight">Alamat</h2>
            <div className="flex items-start gap-3">
              <IconMapPin size={18} className="mt-0.5 shrink-0 text-glaze-pink" aria-hidden="true" />
              <address className="not-italic text-sm leading-relaxed text-midnight/70">
                {location.name}
                <br />
                {location.address}
                <br />
                {location.city}
              </address>
            </div>
            <a
              href={location.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-glaze-pink px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-burnt-sugar focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glaze-pink"
              aria-label="Buka lokasi GLAZZY di Google Maps (buka tab baru)"
            >
              <IconExternalLink size={15} stroke={2} aria-hidden="true" />
              Buka di Google Maps
            </a>
          </div>

          <div className="space-y-3 rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-bold text-midnight">Hubungi Kami</h2>
            <p className="text-sm text-midnight/60">
              Untuk pertanyaan, pesanan custom, atau catering — DM kami di Instagram.
            </p>
            <a
              href={`https://instagram.com/${location.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-glaze-pink/30 bg-glaze-pink/5 px-4 py-2.5 text-sm font-semibold text-glaze-pink transition-colors hover:bg-glaze-pink/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glaze-pink"
              aria-label={`Follow dan DM GLAZZY di Instagram ${location.instagram}`}
            >
              <IconBrandInstagram size={18} stroke={1.75} aria-hidden="true" />
              {location.instagram}
            </a>
          </div>
        </div>

        {/* Jam operasional */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-midnight">Jam Operasional</h2>
            {/* null saat SSR → tidak render badge dulu → no mismatch */}
            {isOpen !== null && (
              <span
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-bold',
                  isOpen ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500',
                )}
                aria-live="polite"
              >
                {isOpen ? '● Buka sekarang' : '● Tutup'}
              </span>
            )}
          </div>

          <ul className="divide-y divide-border" role="list">
            {hours.map((h) => {
              const isToday = todayIndex !== null && h.dayIndex === todayIndex
              return (
                <li
                  key={h.day}
                  className={cn(
                    'flex items-center justify-between py-2.5 text-sm',
                    isToday && 'font-semibold',
                  )}
                  aria-current={isToday ? 'date' : undefined}
                >
                  <span className={cn(isToday ? 'text-glaze-pink' : 'text-midnight/70')}>
                    {h.day}
                    {isToday && (
                      <span className="ml-2 text-[10px] font-normal text-glaze-pink/70">
                        (hari ini)
                      </span>
                    )}
                  </span>
                  <span className="flex items-center gap-1.5 text-midnight/70">
                    <IconClock size={13} stroke={1.75} aria-hidden="true" />
                    {h.isClosed ? 'Tutup' : `${h.open} – ${h.close}`}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </>
  )
}
