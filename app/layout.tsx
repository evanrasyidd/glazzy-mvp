import type { Metadata, Viewport } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import ConditionalLayout from '@/components/layout/ConditionalLayout'
import ToastContainer from '@/components/ui/Toast'
import IntroScreen from '@/components/ui/IntroScreen'

// ============================================================
// GLAZZY — Root Layout
// Font: next/font/google (downloaded + self-hosted at build time)
// Fallback: system-ui / serif jika Google Fonts tidak tersedia
// ============================================================

const playfair = Playfair_Display({
  subsets:             ['latin'],
  variable:            '--font-playfair',
  style:               ['normal', 'italic'],
  display:             'swap',
  weight:              ['400', '600', '700', '800'],
  preload:             true,
  fallback:            ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
  adjustFontFallback:  true,
})

const dmSans = DM_Sans({
  subsets:             ['latin'],
  variable:            '--font-dm-sans',
  display:             'swap',
  weight:              ['400', '500', '600', '700'],
  preload:             true,
  fallback:            ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
  adjustFontFallback:  true,
})

export const metadata: Metadata = {
  title: {
    default:  'GLAZZY | Made fresh. Glazed right.',
    template: '%s — GLAZZY',
  },
  description: 'Donut premium dengan bahan berkualitas, dibuat fresh setiap hari. 23 varian rasa.',
  keywords:    ['donut', 'glazzy', 'donut jakarta', 'premium donut'],
  openGraph: {
    type:        'website',
    locale:      'id_ID',
    siteName:    'GLAZZY',
    title:       'GLAZZY | Made fresh. Glazed right.',
    description: 'Donut premium Jakarta — 23 varian rasa, dibuat fresh setiap pagi.',
  },
}

export const viewport: Viewport = {
  themeColor:   '#B5338A',
  width:        'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${playfair.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-cream font-body antialiased">
        <IntroScreen />
        <ConditionalLayout>{children}</ConditionalLayout>
        <ToastContainer />
      </body>
    </html>
  )
}
