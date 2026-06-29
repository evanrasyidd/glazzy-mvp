# GLAZZY — Donut & Drink Ordering App

> Made fresh. Glazed right.

Aplikasi pemesanan donut dan minuman premium berbasis web. Dibangun sebagai project portofolio full-scale dengan tiga layer: customer storefront, POS terminal kasir, dan admin dashboard. Semua fitur pembayaran adalah **simulasi** — tidak ada transaksi nyata yang diproses.

---

## Fitur

### Storefront (Customer)

- **Menu** — 23 varian donut (Classic Ring, Berry, Filled, Savory) + minuman (Coffee, Non-Coffee, Frappe, Tea)
- **Drink Detail Modal** — kustomisasi per minuman: ukuran, suhu, tingkat manis, level es, dan add-ons per kategori
- **Keranjang** — checkout 3-step (Keranjang → Detail Pemesan → Pembayaran)
- **GLAZZY Pay** — simulasi payment gateway bergaya Midtrans: Virtual Account (BCA/BNI/Mandiri/BRI), QRIS, dan E-Wallet (GoPay/OVO/DANA/ShopeePay)
- **Order Confirmation** — halaman receipt setelah pembayaran dengan Order ID

### POS Terminal (Kasir)

- **PIN Lock** — wajib input 4-digit PIN sebelum bisa akses, auto-lock setelah 5× salah
- **Menu Grid** — donut (tap = instant add) dan minuman (tap = buka detail sheet dengan full variant system)
- **Drink Detail POS** — sama persis dengan storefront: ukuran, suhu, manis, es, add-ons
- **Keranjang POS** — qty adjuster, hapus item, total real-time
- **Pembayaran** — modal dengan 3 metode: Tunai (kalkulator kembalian), Transfer (instruksi bank), QRIS (QR visual)
- **Animasi sukses** — konfirmasi bayar + "Order Baru" langsung reset

### Admin Dashboard

- **Auth** — login username + password, lockout setelah 5× gagal, logout dengan konfirmasi
- **Stats Bar** — total pesanan, pesanan baru, diproses, revenue hari ini + mini bar chart 7 hari
- **Order List** — filter by status (Semua / Baru / Diproses / Selesai / Dibatalkan)
- **Order Card** — ubah status langsung dari card (Baru → Diproses → Selesai / Batalkan)
- **Hapus semua** — dengan confirm dialog

### Global

- **Loading Intro** — animasi full-screen GLAZZY saat pertama buka (sekali per session)
- **Toast Notifications** — feedback setiap aksi penting
- **Responsive** — mobile-first, dioptimasi untuk layar kecil hingga desktop

---

## Tech Stack

| Layer | Library | Versi |
|---|---|---|
| Framework | Next.js (App Router) | ^15.3.4 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS v4 | ^4.1.6 |
| Animation | Framer Motion | ^11.15.0 |
| State | Zustand | ^5.0.3 |
| Icons | Tabler Icons React | ^3.44.0 |
| UI | React 19 | ^19.0.0 |
| Font | next/font/google | — |

Build menggunakan **webpack** (Next.js 15 default). Dev menggunakan **Turbopack** via `npm run dev --turbopack` untuk performa lebih cepat.

---

## Struktur Project

```
glazzy/
├── app/
│   ├── page.tsx                  # Home / landing
│   ├── menu/page.tsx             # Menu customer (donut + minuman)
│   ├── cart/page.tsx             # Checkout 3-step
│   ├── payment/page.tsx          # GLAZZY Pay (simulasi gateway)
│   ├── order-confirmation/       # Receipt setelah bayar
│   ├── packages/page.tsx         # Paket bundle
│   ├── about/page.tsx            # Tentang GLAZZY
│   ├── location/page.tsx         # Lokasi & jam buka
│   ├── pos/page.tsx              # POS terminal kasir
│   └── admin/
│       ├── page.tsx              # Dashboard admin
│       └── login/page.tsx        # Login admin
│
├── components/
│   ├── admin/                    # StatsBar, OrderCard
│   ├── cart/                     # CartItem, OrderSummary, dll
│   ├── home/                     # Hero, FeaturedSection, dll
│   ├── layout/                   # Navbar, Footer, ConditionalLayout
│   ├── menu/                     # DonutCard, DrinkCard, DrinkDetailModal
│   ├── packages/                 # PackageCard
│   ├── pos/                      # PosMenuGrid, PosCartPanel, PosPaymentModal, PinLock
│   └── ui/                       # Button, Toast, IntroScreen, dll
│
├── lib/
│   ├── data/
│   │   ├── donuts.ts             # 23 varian donut
│   │   ├── drinks.ts             # Data minuman
│   │   └── store-info.ts         # Info toko, jam buka, pickup slots
│   ├── hooks/
│   │   └── useHydrated.ts        # SSR hydration guard
│   ├── store/
│   │   ├── auth.store.ts         # Admin authentication (Zustand)
│   │   ├── cart.store.ts         # Keranjang customer
│   │   ├── order.store.ts        # Detail pemesanan (nama, alamat, dll)
│   │   ├── orders.store.ts       # Daftar order untuk admin
│   │   └── pos.store.ts          # State POS terminal + PIN auth
│   ├── types/index.ts            # TypeScript interfaces
│   └── utils.ts                  # formatRupiah, cn, dll
│
├── public/                       # Asset statis
├── .env.example                  # Template env (commit ke git)
├── .env.local                    # Nilai env aktual (JANGAN commit)
├── next.config.ts
├── tailwind.config (via PostCSS)
└── tsconfig.json
```

---

## Cara Menjalankan

### Prasyarat

- Node.js 18.17+ atau 20+
- npm / pnpm / yarn

### Setup

```bash
# 1. Clone / extract project
cd glazzy

# 2. Install dependencies
npm install

# 3. Buat file environment
cp .env.example .env.local
# Edit .env.local dengan nilai yang sesuai
```

### Environment Variables

Buka `.env.local` dan isi nilainya:

```env
# Kredensial admin dashboard
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=glazzy2025

# PIN kasir POS (4 digit)
NEXT_PUBLIC_POS_PIN=2025
```

> **Catatan:** Variabel `NEXT_PUBLIC_*` masuk ke client bundle. Untuk production nyata, gunakan server-side auth. Ini adalah setup untuk simulasi/demo.

### Menjalankan Dev Server

```bash
npm run dev
# → http://localhost:3000
```

### Build Production

```bash
npm run build
npm run start
```

---

## Routes

| URL | Deskripsi | Auth |
|---|---|---|
| `/` | Landing page | Public |
| `/menu` | Menu donut & minuman | Public |
| `/cart` | Checkout & pembayaran | Public |
| `/payment` | GLAZZY Pay (simulasi) | Public |
| `/order-confirmation` | Receipt pesanan | Public |
| `/packages` | Paket bundle | Public |
| `/about` | Tentang GLAZZY | Public |
| `/location` | Lokasi & jam buka | Public |
| `/pos` | POS terminal kasir | PIN `2025` |
| `/admin` | Dashboard admin | Username + Password |
| `/admin/login` | Halaman login admin | — |

---

## Autentikasi

### Admin Dashboard

- URL: `/admin/login`
- Default: `admin` / `glazzy2025`
- Auto-lockout setelah **5× percobaan gagal**
- Ubah via env var: `NEXT_PUBLIC_ADMIN_USERNAME` dan `NEXT_PUBLIC_ADMIN_PASSWORD`

### Kasir POS

- Default PIN: `2025`
- Auto-lockout setelah **5× PIN salah**
- Ubah via env var: `NEXT_PUBLIC_POS_PIN`

---

## Payment Simulation

Semua pembayaran di project ini adalah **simulasi murni** — tidak ada API gateway nyata yang terhubung.

| Metode | Perilaku |
|---|---|
| Virtual Account | Nomor VA di-generate random per order, tampil instruksi + countdown 24 jam |
| QRIS | QR code visual statis + countdown 15 menit |
| E-Wallet | Pilih GoPay/OVO/DANA/ShopeePay, klik konfirmasi |
| Tunai (POS) | Kalkulator kembalian real-time |

---

## Keamanan

- Tidak ada API routes — zero server attack surface
- Tidak ada koneksi database nyata
- Tidak ada API key eksternal
- `.env.local` ter-exclude dari git via `.gitignore`
- Kredensial dibaca dari env vars, tidak hardcoded di source
- Input XSS aman via React JSX auto-escape
- Admin lockout setelah 5× gagal
- POS PIN lockout setelah 5× salah

---

## Deploy ke Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Set environment variables di **Vercel Dashboard → Settings → Environment Variables**:

```
NEXT_PUBLIC_ADMIN_USERNAME  =  admin
NEXT_PUBLIC_ADMIN_PASSWORD  =  [password kamu]
NEXT_PUBLIC_POS_PIN         =  [4-digit PIN kamu]
```

> Jangan gunakan nilai default di production. Ganti dengan kredensial yang kuat.

---

## Kustomisasi Data

### Tambah / Edit Donut

Edit `lib/data/donuts.ts`. Setiap donut memiliki:

```ts
{
  id:          'unique-id',
  name:        'Nama Donut',
  slug:        'nama-donut',
  category:    'classic' | 'berry' | 'filled' | 'savory',
  description: 'Deskripsi singkat',
  price:       25000,
  color:       '#hexcode',      // warna utama ilustrasi
  accentColor: '#hexcode',      // warna aksen
  isAvailable: true,
}
```

### Tambah / Edit Minuman

Edit `lib/data/drinks.ts`:

```ts
{
  id:          'unique-id',
  name:        'Nama Minuman',
  category:    'coffee' | 'non-coffee' | 'frappe' | 'tea',
  description: 'Deskripsi singkat',
  price:       28000,
  temperature: 'hot' | 'iced' | 'both',
  isAvailable: true,
}
```

### Edit Info Toko

Edit `lib/data/store-info.ts` — nama, alamat, telepon, jam buka.

---

## Author

**Evan Rasyid Ega Pratama**
GitHub & Instagram: [@evanrasyidd](https://github.com/evanrasyidd)
Brand: EGAXDEV Studios

---

*GLAZZY adalah project demo/portofolio. Tidak ada transaksi nyata yang diproses.*
