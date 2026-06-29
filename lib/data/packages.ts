import type { Package } from '@/lib/types'

// ============================================================
// GLAZZY — Package Data (8 paket)
// ============================================================

export const packages: Package[] = [
  {
    id: 'pkg-01',
    name: 'Single',
    slug: 'single',
    slots: 0,
    price: 0,
    description: '1 pcs — pilih langsung dari menu donut',
    isRandomFlavor: false,
    isFixed: false,
  },
  {
    id: 'pkg-02',
    name: 'Box of 3',
    slug: 'box-of-3',
    slots: 3,
    price: 58000,
    badge: 'Starter',
    description: 'Pilih 3 rasa donut favoritmu',
    isRandomFlavor: false,
    isFixed: false,
  },
  {
    id: 'pkg-03',
    name: 'Half Dozen',
    slug: 'half-dozen',
    slots: 6,
    price: 108000,
    description: 'Pilih 6 rasa donut sesukamu',
    isRandomFlavor: false,
    isFixed: false,
  },
  {
    id: 'pkg-04',
    name: 'One Dozen',
    slug: 'one-dozen',
    slots: 12,
    price: 200000,
    badge: 'Most Popular',
    description: 'Pilih 12 rasa donut — cocok untuk sharing',
    isRandomFlavor: false,
    isFixed: false,
  },
  {
    id: 'pkg-05',
    name: 'Two Dozen',
    slug: 'two-dozen',
    slots: 24,
    price: 360000,
    badge: 'Best Value',
    description: 'Pilih 24 rasa donut — hemat lebih banyak',
    isRandomFlavor: false,
    isFixed: false,
  },
  {
    id: 'pkg-06',
    name: 'Mini Donuts Box',
    slug: 'mini-donuts-box',
    slots: 0,
    price: 80000,
    description: '24 pcs mini, topping acak dari toko',
    isRandomFlavor: true,
    isFixed: false,
  },
  {
    id: 'pkg-07',
    name: 'Combo Pairing',
    slug: 'combo-pairing',
    slots: 0,
    price: 45000,
    description: '1 donut + 1 minuman medium — pilih masing-masing',
    isRandomFlavor: false,
    isFixed: false,
    isCombo: true,
  },
  {
    id: 'pkg-08',
    name: 'Family Treat',
    slug: 'family-treat',
    slots: 0,
    price: 320000,
    badge: 'Party Pack',
    description: 'Paket lengkap untuk keluarga atau acara spesial',
    isRandomFlavor: false,
    isFixed: true,
    fixedContents: '1 lusin donut + 1 box mini + 2 botol minuman 1L',
  },
]

// Helper: ambil package by id
export function getPackageById(id: string): Package | undefined {
  return packages.find((p) => p.id === id)
}

// Helper: package by slug
export function getPackageBySlug(slug: string): Package | undefined {
  return packages.find((p) => p.slug === slug)
}

// Helper: package yang butuh flavor picker (slots > 0)
export function getPickerPackages(): Package[] {
  return packages.filter((p) => p.slots > 0)
}

// Helper: format harga per slot (harga per donut dalam paket)
export function getPricePerSlot(pkg: Package): number | null {
  if (pkg.slots === 0) return null
  return Math.round(pkg.price / pkg.slots)
}
