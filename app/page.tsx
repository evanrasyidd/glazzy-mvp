import type { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import CategoryShortcut from '@/components/home/CategoryShortcut'
import MenuPreviewGrid from '@/components/home/MenuPreviewGrid'
import PromoBand from '@/components/home/PromoBand'
import PackageHighlight from '@/components/home/PackageHighlight'
import WhyGlazzy from '@/components/home/WhyGlazzy'

// ============================================================
// GLAZZY — Homepage
// ============================================================

export const metadata: Metadata = {
  title: 'GLAZZY | Made fresh. Glazed right.',
  description:
    'Donut premium Jakarta — 23 varian rasa, dibuat fresh setiap pagi. Pickup & delivery tersedia.',
  openGraph: {
    title: 'GLAZZY | Made fresh. Glazed right.',
    description: 'Donut premium Jakarta — 23 varian rasa, dibuat fresh setiap pagi.',
    url: 'https://glazzy.id',
  },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PromoBand />
      <CategoryShortcut />
      <MenuPreviewGrid />
      <PackageHighlight />
      <WhyGlazzy />
    </>
  )
}
