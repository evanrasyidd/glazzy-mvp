import type { Donut } from '@/lib/types'

// ============================================================
// GLAZZY — Donut Data (23 varian)
// ============================================================

export const donuts: Donut[] = [
  // ──────────────────────────────────────────
  // Classic Ring (8 item)
  // ──────────────────────────────────────────
  {
    id: 'classic-01',
    name: 'Original Glazed',
    slug: 'original-glazed',
    category: 'classic',
    description: 'Donat polos lapisan gula cair transparan tipis',
    price: 18000,
    color: '#F5C842',
    accentColor: '#D4A030',
    isAvailable: true,
  },
  {
    id: 'classic-02',
    name: 'Alcapone',
    slug: 'alcapone',
    category: 'classic',
    description: 'Celupan cokelat putih premium + irisan almond panggang',
    price: 22000,
    color: '#E8C8A0',
    accentColor: '#C8A070',
    isAvailable: true,
  },
  {
    id: 'classic-03',
    name: 'Oreology',
    slug: 'oreology',
    category: 'classic',
    description: 'Base cokelat putih + remukan Oreo',
    price: 22000,
    color: '#3A3040',
    accentColor: '#FFFFFF',
    isAvailable: true,
  },
  {
    id: 'classic-04',
    name: 'Choco Meises',
    slug: 'choco-meises',
    category: 'classic',
    description: 'Krim cokelat tebal + meses cokelat premium',
    price: 20000,
    color: '#5C3020',
    accentColor: '#8B5030',
    isAvailable: true,
  },
  {
    id: 'classic-05',
    name: 'Choco Caviar',
    slug: 'choco-caviar',
    category: 'classic',
    description: 'Cokelat leleh + bola sereal cokelat renyah',
    price: 22000,
    color: '#2A1A10',
    accentColor: '#704020',
    isAvailable: true,
  },
  {
    id: 'classic-06',
    name: 'Matcha Latte',
    slug: 'matcha-latte',
    category: 'classic',
    description: 'Lapisan cokelat matcha Jepang tidak terlalu manis',
    price: 24000,
    color: '#5C9E6E',
    accentColor: '#3A7050',
    isAvailable: true,
  },
  {
    id: 'classic-07',
    name: 'Tiramisu',
    slug: 'tiramisu',
    category: 'classic',
    description: 'Toping cokelat tiramisu + taburan bubuk kopi/kakao',
    price: 24000,
    color: '#8B6040',
    accentColor: '#5C3820',
    isAvailable: true,
  },
  {
    id: 'classic-08',
    name: 'Avocado DiCaprio',
    slug: 'avocado-dicaprio',
    category: 'classic',
    description: 'Toping cokelat rasa alpukat + serpihan cokelat flakes',
    price: 24000,
    color: '#6B8C3A',
    accentColor: '#4A6020',
    isAvailable: true,
  },

  // ──────────────────────────────────────────
  // Berry Series Ring (4 item)
  // ──────────────────────────────────────────
  {
    id: 'berry-01',
    name: 'Strawberry Frosted',
    slug: 'strawberry-frosted',
    category: 'berry',
    description: 'Cokelat strawberry pink + meses pink / sereal renyah',
    price: 22000,
    color: '#F080A0',
    accentColor: '#C04060',
    isAvailable: true,
  },
  {
    id: 'berry-02',
    name: 'Blueberry Glaze',
    slug: 'blueberry-glaze',
    category: 'berry',
    description: 'Glaze rasa blueberry warna ungu, manis-asam',
    price: 22000,
    color: '#6040A0',
    accentColor: '#402080',
    isAvailable: true,
  },
  {
    id: 'berry-03',
    name: 'Raspberry Sparkle',
    slug: 'raspberry-sparkle',
    category: 'berry',
    description: 'Lapisan cokelat raspberry merah + red velvet crumbs',
    price: 24000,
    color: '#C02040',
    accentColor: '#801020',
    isAvailable: true,
  },
  {
    id: 'berry-04',
    name: 'Wild Berry',
    slug: 'wild-berry',
    category: 'berry',
    description: 'Kombinasi strawberry + blueberry + raspberry',
    price: 24000,
    color: '#B5338A',
    accentColor: '#801060',
    isAvailable: true,
  },

  // ──────────────────────────────────────────
  // Berry Series Filled (3 item)
  // ──────────────────────────────────────────
  {
    id: 'berry-05',
    name: 'Heaven Berry',
    slug: 'heaven-berry',
    category: 'berry',
    description: 'Isian selai strawberry melimpah + gula halus luar',
    price: 24000,
    color: '#F04060',
    accentColor: '#C02040',
    isAvailable: true,
  },
  {
    id: 'berry-06',
    name: 'Blueberry Jam Filled',
    slug: 'blueberry-jam-filled',
    category: 'berry',
    description: 'Isian selai blueberry pekat + gula bubuk murni',
    price: 24000,
    color: '#4030A0',
    accentColor: '#201060',
    isAvailable: true,
  },
  {
    id: 'berry-07',
    name: 'Raspberry Custard',
    slug: 'raspberry-custard',
    category: 'berry',
    description: 'Isian krim custard vanilla + selai raspberry',
    price: 26000,
    color: '#E06080',
    accentColor: '#A03050',
    isAvailable: true,
  },

  // ──────────────────────────────────────────
  // Other Filled / Bomboloni (3 item)
  // ──────────────────────────────────────────
  {
    id: 'filled-01',
    name: 'Monaco',
    slug: 'monaco',
    category: 'filled',
    description: 'Isian pasta cokelat pekat + gula halus / bubuk cokelat luar',
    price: 24000,
    color: '#4A2810',
    accentColor: '#2A1008',
    isAvailable: true,
  },
  {
    id: 'filled-02',
    name: 'Bavarian',
    slug: 'bavarian',
    category: 'filled',
    description: 'Isian krim custard vanilla lembut dan creamy',
    price: 24000,
    color: '#F5E0A0',
    accentColor: '#D4B050',
    isAvailable: true,
  },
  {
    id: 'filled-03',
    name: 'Choco Tiramisu Filled',
    slug: 'choco-tiramisu-filled',
    category: 'filled',
    description: 'Isian krim tiramisu + glaze kopi luar',
    price: 26000,
    color: '#6B4020',
    accentColor: '#3A2010',
    isAvailable: true,
  },

  // ──────────────────────────────────────────
  // Savory (2 item)
  // ──────────────────────────────────────────
  {
    id: 'savory-01',
    name: 'Cheese Me Up',
    slug: 'cheese-me-up',
    category: 'savory',
    description: 'Krim keju + parutan cheddar melimpah',
    price: 24000,
    color: '#F5C030',
    accentColor: '#D4900A',
    isAvailable: true,
  },
  {
    id: 'savory-02',
    name: 'Flosscake',
    slug: 'flosscake',
    category: 'savory',
    description: 'Mayones manis-gurih + abon sapi/ayam melimpah',
    price: 24000,
    color: '#D4906A',
    accentColor: '#A46040',
    isAvailable: true,
  },

  // ──────────────────────────────────────────
  // Additional items to complete 23 total
  // (Sesuai jumlah 23 dari spec — 8+4+3+3+2 = 20, tambah 3 varian)
  // ──────────────────────────────────────────
  {
    id: 'classic-09',
    name: 'Pink Velvet',
    slug: 'pink-velvet',
    category: 'classic',
    description: 'Glazed pink velvet + topping sprinkle pelangi',
    price: 22000,
    color: '#F4A0C0',
    accentColor: '#D06090',
    isAvailable: true,
  },
  {
    id: 'classic-10',
    name: 'Caramel Crunch',
    slug: 'caramel-crunch',
    category: 'classic',
    description: 'Saus karamel + remukan wafer renyah di atas',
    price: 22000,
    color: '#C87030',
    accentColor: '#904010',
    isAvailable: true,
  },
  {
    id: 'filled-04',
    name: 'Lemon Curd',
    slug: 'lemon-curd',
    category: 'filled',
    description: 'Isian krim lemon asam-manis + gula bubuk halus',
    price: 26000,
    color: '#F5E050',
    accentColor: '#C8B020',
    isAvailable: true,
  },
]

// Helper: ambil donut by id
export function getDonutById(id: string): Donut | undefined {
  return donuts.find((d) => d.id === id)
}

// Helper: donut by kategori
export function getDonutsByCategory(category: Donut['category']): Donut[] {
  return donuts.filter((d) => d.category === category && d.isAvailable)
}

// Helper: semua donut tersedia
export function getAvailableDonuts(): Donut[] {
  return donuts.filter((d) => d.isAvailable)
}
