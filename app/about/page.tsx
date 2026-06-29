import type { Metadata } from 'next'
import { IconHeart, IconStar, IconLeaf, IconUsers } from '@tabler/icons-react'
import PageHeader from '@/components/ui/PageHeader'
import DonutIllustration from '@/components/ui/DonutIllustration'
import { donuts } from '@/lib/data/donuts'

// ============================================================
// GLAZZY — About Page (Server Component)
// ============================================================

export const metadata: Metadata = {
  title: 'About — GLAZZY',
  description: 'Cerita di balik GLAZZY — donut premium Jakarta sejak 2021.',
}

const MILESTONES = [
  { year: '2021', event: 'GLAZZY lahir di dapur kecil Kemang — 5 varian, dijual lewat Instagram.' },
  { year: '2022', event: 'Buka toko fisik pertama. Antrian pre-order 3 hari ke depan.' },
  { year: '2023', event: 'Rangkaian Berry Series dan Filled dirilis — langsung sold out minggu pertama.' },
  { year: '2024', event: 'Delivery mulai tersedia. 10.000+ box terjual.' },
  { year: '2025', event: 'Website resmi GLAZZY diluncurkan. Sekarang kamu di sini.' },
]

const VALUES = [
  { icon: IconLeaf, title: 'Bahan Terbaik', desc: 'Tepung high-protein, cokelat couverture, susu segar — tidak ada kompromi.' },
  { icon: IconStar, title: 'Fresh Every Day', desc: 'Setiap batch dibuat pagi hari. Tidak ada donut kemarin di GLAZZY.' },
  { icon: IconHeart, title: 'Made with Love', desc: 'Setiap donut dibuat manual — bukan mesin, bukan frozen.' },
  { icon: IconUsers, title: 'Community First', desc: 'GLAZZY tumbuh dari DM, dari review jujur, dari mulut ke mulut.' },
]

export default function AboutPage() {
  const featuredDonut = donuts.find((d) => d.id === 'classic-01')!

  return (
    <>
      <PageHeader
        title="Tentang GLAZZY"
        subtitle="Bukan sekadar donut — ini soal pengalaman."
        eyebrow="Our story"
      />

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-16">

        {/* Brand intro */}
        <section aria-labelledby="story-heading" className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 id="story-heading" className="font-display text-2xl font-bold text-midnight sm:text-3xl">
              Dari dapur kecil ke{' '}
              <span className="italic text-glaze-pink">ribuan kotak.</span>
            </h2>
            <p className="mt-4 leading-relaxed text-midnight/65">
              GLAZZY dimulai tahun 2021 — bukan dengan modal besar atau investor, tapi dengan satu oven, lima resep, dan keyakinan bahwa Jakarta butuh donut yang lebih baik.
            </p>
            <p className="mt-3 leading-relaxed text-midnight/65">
              Kami percaya donut bukan hanya camilan — ini tentang momen. Ulang tahun, meeting, weekend santai, atau sekadar self-reward setelah hari yang panjang. Dan momen itu deserves something good.
            </p>
            <p className="mt-3 leading-relaxed text-midnight/65 italic font-medium text-glaze-pink">
              "U deserved this."
            </p>
          </div>

          <div className="flex justify-center" aria-hidden="true">
            <div className="relative">
              <DonutIllustration
                color={featuredDonut.color}
                accentColor={featuredDonut.accentColor}
                name={featuredDonut.name}
                size={200}
              />
              {/* Decorative rings */}
              <div className="absolute -inset-8 -z-10 rounded-full border-2 border-dashed border-glaze-pink/15" />
              <div className="absolute -inset-16 -z-10 rounded-full border border-dashed border-glaze-pink/8" />
            </div>
          </div>
        </section>

        {/* Values */}
        <section aria-labelledby="values-heading">
          <h2 id="values-heading" className="mb-2 font-display text-2xl font-bold text-midnight">
            Yang kami pegang teguh
          </h2>
          <span className="accent-bar mb-8" aria-hidden="true" />
          <div className="grid gap-4 sm:grid-cols-2">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-glaze-pink/10" aria-hidden="true">
                  <Icon size={20} stroke={1.75} className="text-glaze-pink" />
                </div>
                <div>
                  <p className="font-semibold text-midnight">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-midnight/60">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section aria-labelledby="timeline-heading">
          <h2 id="timeline-heading" className="mb-2 font-display text-2xl font-bold text-midnight">
            Perjalanan GLAZZY
          </h2>
          <span className="accent-bar mb-8" aria-hidden="true" />
          <ol className="relative border-l border-border pl-6 space-y-6">
            {MILESTONES.map(({ year, event }) => (
              <li key={year} className="relative">
                <span
                  className="absolute -left-[25px] flex h-4 w-4 items-center justify-center rounded-full bg-glaze-pink ring-4 ring-cream"
                  aria-hidden="true"
                />
                <p className="text-xs font-bold uppercase tracking-widest text-glaze-pink">{year}</p>
                <p className="mt-1 text-sm leading-relaxed text-midnight/70">{event}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* CTA */}
        <section className="rounded-3xl bg-midnight p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-white">Cobain sekarang?</h2>
          <p className="mt-2 text-sm text-white/60">23 varian menunggu. Fresh setiap pagi.</p>
          <a
            href="/menu"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-glaze-pink px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-burnt-sugar focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Lihat Menu
          </a>
        </section>
      </div>
    </>
  )
}
