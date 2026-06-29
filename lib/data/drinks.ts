import type { Drink } from '@/lib/types'

// ============================================================
// GLAZZY — Drink Data (16 varian)
// ============================================================

export const drinks: Drink[] = [
  // ──────────────────────────────────────────
  // Coffee Based (6 item)
  // ──────────────────────────────────────────
  {
    id: 'coffee-01',
    name: 'Espresso',
    slug: 'espresso',
    category: 'coffee',
    description: 'Kopi hitam pekat murni',
    price: 18000,
    temperature: 'hot',
    isAvailable: true,
  },
  {
    id: 'coffee-02',
    name: 'Americano',
    slug: 'americano',
    category: 'coffee',
    description: 'Espresso + air',
    price: 20000,
    temperature: 'both',
    isAvailable: true,
  },
  {
    id: 'coffee-03',
    name: 'Café Latte',
    slug: 'cafe-latte',
    category: 'coffee',
    description: 'Espresso + steamed milk + thin foam',
    price: 24000,
    temperature: 'both',
    isAvailable: true,
  },
  {
    id: 'coffee-04',
    name: 'Cappuccino',
    slug: 'cappuccino',
    category: 'coffee',
    description: 'Espresso + susu + thick foam',
    price: 24000,
    temperature: 'hot',
    isAvailable: true,
  },
  {
    id: 'coffee-05',
    name: 'Caramel Macchiato',
    slug: 'caramel-macchiato',
    category: 'coffee',
    description: 'Espresso + vanilla milk + saus karamel',
    price: 28000,
    temperature: 'both',
    isAvailable: true,
  },
  {
    id: 'coffee-06',
    name: 'Hazelnut Latte',
    slug: 'hazelnut-latte',
    category: 'coffee',
    description: 'Latte + sirup hazelnut atau vanilla',
    price: 26000,
    temperature: 'both',
    isAvailable: true,
  },

  // ──────────────────────────────────────────
  // Non-Coffee (3 item)
  // ──────────────────────────────────────────
  {
    id: 'noncoffee-01',
    name: 'Hot Chocolate',
    slug: 'hot-chocolate',
    category: 'non-coffee',
    description: 'Cokelat kental creamy',
    price: 22000,
    temperature: 'both',
    isAvailable: true,
  },
  {
    id: 'noncoffee-02',
    name: 'Matcha Latte',
    slug: 'matcha-latte-drink',
    category: 'non-coffee',
    description: 'Matcha murni + susu',
    price: 24000,
    temperature: 'both',
    isAvailable: true,
  },
  {
    id: 'noncoffee-03',
    name: 'Thai Tea',
    slug: 'thai-tea',
    category: 'non-coffee',
    description: 'Teh Thailand + susu evaporasi',
    price: 22000,
    temperature: 'iced',
    isAvailable: true,
  },

  // ──────────────────────────────────────────
  // Frappe / Ice Blended (4 item)
  // ──────────────────────────────────────────
  {
    id: 'frappe-01',
    name: 'Caramel Frappe',
    slug: 'caramel-frappe',
    category: 'frappe',
    description: 'Kopi blender + karamel + whipped cream',
    price: 30000,
    temperature: 'iced',
    isAvailable: true,
  },
  {
    id: 'frappe-02',
    name: 'Oreo Frappe',
    slug: 'oreo-frappe',
    category: 'frappe',
    description: 'Susu + Oreo blender + krim',
    price: 30000,
    temperature: 'iced',
    isAvailable: true,
  },
  {
    id: 'frappe-03',
    name: 'Choco Forest Blend',
    slug: 'choco-forest-blend',
    category: 'frappe',
    description: 'Cokelat blender + rasa ceri/berry',
    price: 30000,
    temperature: 'iced',
    isAvailable: true,
  },
  {
    id: 'frappe-04',
    name: 'Avocado Coffee Blend',
    slug: 'avocado-coffee-blend',
    category: 'frappe',
    description: 'Jus alpukat blend + espresso shot',
    price: 32000,
    temperature: 'iced',
    isAvailable: true,
  },

  // ──────────────────────────────────────────
  // Refreshing Tea (3 item)
  // ──────────────────────────────────────────
  {
    id: 'tea-01',
    name: 'Iced Lemon Tea',
    slug: 'iced-lemon-tea',
    category: 'tea',
    description: 'Teh hitam + perasan lemon asli',
    price: 20000,
    temperature: 'iced',
    isAvailable: true,
  },
  {
    id: 'tea-02',
    name: 'Lychee Tea',
    slug: 'lychee-tea',
    category: 'tea',
    description: 'Teh buah + leci asli',
    price: 22000,
    temperature: 'iced',
    isAvailable: true,
  },
  {
    id: 'tea-03',
    name: 'Berry Breeze Tea',
    slug: 'berry-breeze-tea',
    category: 'tea',
    description: 'Es teh + konsentrat strawberry + blueberry',
    price: 22000,
    temperature: 'iced',
    isAvailable: true,
  },
]

// Helper: ambil drink by id
export function getDrinkById(id: string): Drink | undefined {
  return drinks.find((d) => d.id === id)
}

// Helper: drink by kategori
export function getDrinksByCategory(category: Drink['category']): Drink[] {
  return drinks.filter((d) => d.category === category && d.isAvailable)
}

// Helper: semua drink tersedia
export function getAvailableDrinks(): Drink[] {
  return drinks.filter((d) => d.isAvailable)
}

// Label kategori untuk display
export const drinkCategoryLabels: Record<Drink['category'], string> = {
  coffee: 'Coffee',
  'non-coffee': 'Non-Coffee',
  frappe: 'Frappe',
  tea: 'Tea',
}

// Label temperature untuk display
export const temperatureLabels: Record<Drink['temperature'], string> = {
  hot: 'Hot',
  iced: 'Iced',
  both: 'Hot / Iced',
}
