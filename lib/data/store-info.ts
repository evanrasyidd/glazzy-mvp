import type { StoreInfo } from '@/lib/types'

// ============================================================
// GLAZZY — Store Info
// ============================================================

export const storeInfo: StoreInfo = {
  location: {
    name: 'GLAZZY Donut',
    address: 'Jl. Kemang Raya No. 88',
    city: 'Jakarta Selatan, DKI Jakarta 12730',
    phone: '+62 812-3456-7890',
    instagram: '@glazzy.id',
    mapsEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0!2d106.8152!3d-6.2600!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zGlazzy+Donut!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid',
    mapsUrl: 'https://maps.google.com/?q=Kemang+Raya+Jakarta+Selatan',
  },

  // dayIndex sesuai JS Date.getDay(): 0=Minggu, 1=Senin, ..., 6=Sabtu
  hours: [
    { day: 'Senin',  dayIndex: 1, open: '08:00', close: '21:00', isClosed: false },
    { day: 'Selasa', dayIndex: 2, open: '08:00', close: '21:00', isClosed: false },
    { day: 'Rabu',   dayIndex: 3, open: '08:00', close: '21:00', isClosed: false },
    { day: 'Kamis',  dayIndex: 4, open: '08:00', close: '21:00', isClosed: false },
    { day: 'Jumat',  dayIndex: 5, open: '08:00', close: '22:00', isClosed: false },
    { day: 'Sabtu',  dayIndex: 6, open: '07:00', close: '22:00', isClosed: false },
    { day: 'Minggu', dayIndex: 0, open: '08:00', close: '20:00', isClosed: false },
  ],
}

// Helper: ambil jam operasional hari ini
export function getTodayHours() {
  const todayIndex = new Date().getDay()
  return storeInfo.hours.find((h) => h.dayIndex === todayIndex) ?? null
}

// Helper: cek apakah toko sedang buka
export function isStoreOpenNow(): boolean {
  const today = getTodayHours()
  if (!today || today.isClosed) return false

  const now = new Date()
  const [openH, openM] = today.open.split(':').map(Number)
  const [closeH, closeM] = today.close.split(':').map(Number)

  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  const openMinutes = openH * 60 + openM
  const closeMinutes = closeH * 60 + closeM

  return nowMinutes >= openMinutes && nowMinutes < closeMinutes
}

// Pilihan jam pickup (setiap 30 menit, 1 jam dari sekarang s/d tutup)
export function getPickupTimeSlots(): string[] {
  const today = getTodayHours()
  if (!today || today.isClosed) return []

  const slots: string[] = []
  const [closeH, closeM] = today.close.split(':').map(Number)
  const closeMinutes = closeH * 60 + closeM

  // Mulai dari jam sekarang + 60 menit, kelipatan 30 menit
  const now = new Date()
  let startMinutes = now.getHours() * 60 + now.getMinutes() + 60
  // Bulatkan ke kelipatan 30 berikutnya
  startMinutes = Math.ceil(startMinutes / 30) * 30

  for (let m = startMinutes; m <= closeMinutes - 30; m += 30) {
    const h = Math.floor(m / 60)
    const min = m % 60
    slots.push(`${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`)
  }

  return slots
}
