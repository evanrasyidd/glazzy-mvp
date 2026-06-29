'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  IconBuildingBank, IconQrcode, IconWallet,
  IconLock, IconCircleCheck, IconLoader2, IconChevronDown,
  IconCopy, IconClock,
} from '@tabler/icons-react'
import { cn, formatRupiah } from '@/lib/utils'
import { useOrdersActions } from '@/lib/store/orders.store'

// ============================================================
// GLAZZY Pay — Simulasi Payment Gateway (Midtrans-style)
// ============================================================

// ── Types ─────────────────────────────────────────────────────

type PayMethod = 'va' | 'qris' | 'ewallet'
type BankId = 'bca' | 'bni' | 'mandiri' | 'bri'
type EwalletId = 'gopay' | 'ovo' | 'dana' | 'shopeepay'
type PayState = 'select' | 'pending' | 'processing' | 'success'

// ── Mock data ─────────────────────────────────────────────────

const BANKS: { id: BankId; name: string; color: string; vaPrefix: string }[] = [
  { id: 'bca',     name: 'BCA',     color: '#0066AE', vaPrefix: '70012' },
  { id: 'bni',     name: 'BNI',     color: '#FF6600', vaPrefix: '98801' },
  { id: 'mandiri', name: 'Mandiri', color: '#003087', vaPrefix: '88908' },
  { id: 'bri',     name: 'BRI',     color: '#00529C', vaPrefix: '26215' },
]

const EWALLETS: { id: EwalletId; name: string; color: string; bg: string }[] = [
  { id: 'gopay',     name: 'GoPay',      color: '#00AAD2', bg: '#E6F7FB' },
  { id: 'ovo',       name: 'OVO',        color: '#4C3494', bg: '#F0EBF9' },
  { id: 'dana',      name: 'DANA',       color: '#118EEA', bg: '#E8F4FD' },
  { id: 'shopeepay', name: 'ShopeePay', color: '#EE4D2D', bg: '#FDEEEB' },
]

function genVA(bankId: BankId, orderId: string): string {
  const bank = BANKS.find((b) => b.id === bankId)!
  const seed = orderId.replace(/\D/g, '').slice(-6).padStart(6, '0')
  return `${bank.vaPrefix}${seed}${String(Date.now()).slice(-4)}`
}

// ── Countdown hook ────────────────────────────────────────────

function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds)
  useEffect(() => {
    if (remaining <= 0) return
    const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000)
    return () => clearInterval(t)
  }, [remaining])
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')
  return { remaining, display: `${mm}:${ss}` }
}

// ── VA detail ─────────────────────────────────────────────────

function VaDetail({ bank, vaNumber, total }: { bank: typeof BANKS[0]; vaNumber: string; total: number }) {
  const { display } = useCountdown(24 * 60 * 60)
  const copy = (v: string) => navigator.clipboard.writeText(v).catch(() => {})

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
      <div className="rounded-2xl border border-border bg-cream p-4 space-y-3">
        {/* Bank name */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-xs font-black" style={{ backgroundColor: bank.color }}>
            {bank.name.slice(0, 3)}
          </div>
          <p className="text-sm font-semibold text-midnight">Transfer {bank.name}</p>
        </div>
        {/* VA Number */}
        <div>
          <p className="text-xs text-midnight/40 mb-1">Nomor Virtual Account</p>
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-lg font-bold tracking-widest text-midnight">{vaNumber}</p>
            <button type="button" onClick={() => copy(vaNumber)} className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-midnight/50 hover:border-glaze-pink hover:text-glaze-pink transition-colors">
              <IconCopy size={12} stroke={2} /> Salin
            </button>
          </div>
        </div>
        {/* Total */}
        <div>
          <p className="text-xs text-midnight/40 mb-1">Total Pembayaran</p>
          <div className="flex items-center justify-between gap-2">
            <p className="text-lg font-bold text-midnight">{formatRupiah(total)}</p>
            <button type="button" onClick={() => copy(String(total))} className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-midnight/50 hover:border-glaze-pink hover:text-glaze-pink transition-colors">
              <IconCopy size={12} stroke={2} /> Salin
            </button>
          </div>
          <p className="text-[10px] text-midnight/40 mt-0.5">Transfer nominal tepat termasuk kode unik</p>
        </div>
      </div>

      {/* Countdown */}
      <div className="flex items-center gap-2 rounded-xl bg-yellow-50 px-4 py-2.5">
        <IconClock size={14} className="text-yellow-600 shrink-0" aria-hidden="true" />
        <p className="text-xs text-yellow-700">Selesaikan pembayaran dalam <span className="font-bold font-mono">{display}</span></p>
      </div>

      {/* Steps */}
      <div className="rounded-2xl border border-border p-4 space-y-2.5">
        <p className="text-xs font-semibold text-midnight/50 mb-3">Cara bayar {bank.name}</p>
        {[
          `Buka mobile banking / ATM ${bank.name}`,
          'Pilih Transfer → Virtual Account',
          `Masukkan nomor VA: ${vaNumber}`,
          `Konfirmasi nominal ${formatRupiah(total)}`,
          'Pembayaran otomatis terkonfirmasi',
        ].map((step, i) => (
          <div key={i} className="flex gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-glaze-pink/10 text-[10px] font-bold text-glaze-pink">{i + 1}</span>
            <p className="text-xs text-midnight/60 leading-relaxed">{step}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ── QRIS detail ───────────────────────────────────────────────

function QrisDetail({ total }: { total: number }) {
  const { display } = useCountdown(15 * 60)
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-cream p-5">
        {/* QR simulasi */}
        <div className="rounded-2xl border-2 border-border bg-white p-3 shadow-sm">
          <svg width="172" height="172" viewBox="0 0 108 108" fill="none" aria-label="QR Code simulasi QRIS">
            <rect x="4"  y="4"  width="30" height="30" rx="3" fill="#1A1A2E" />
            <rect x="8"  y="8"  width="22" height="22" rx="2" fill="white" />
            <rect x="12" y="12" width="14" height="14" rx="1" fill="#1A1A2E" />
            <rect x="74" y="4"  width="30" height="30" rx="3" fill="#1A1A2E" />
            <rect x="78" y="8"  width="22" height="22" rx="2" fill="white" />
            <rect x="82" y="12" width="14" height="14" rx="1" fill="#1A1A2E" />
            <rect x="4"  y="74" width="30" height="30" rx="3" fill="#1A1A2E" />
            <rect x="8"  y="78" width="22" height="22" rx="2" fill="white" />
            <rect x="12" y="82" width="14" height="14" rx="1" fill="#1A1A2E" />
            {/* QRIS logo center */}
            <rect x="44" y="44" width="20" height="20" rx="3" fill="#B5338A" />
            <text x="54" y="57" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">QR</text>
            {[
              [40,4],[44,4],[48,4],[52,4],[56,4],[60,4],[64,4],
              [40,8],[48,8],[56,8],[64,8],[40,12],[44,12],[52,12],[60,12],[64,12],
              [44,16],[48,16],[56,16],[60,16],[40,20],[44,20],[52,20],[56,20],[64,20],
              [40,24],[48,24],[60,24],[64,24],[40,28],[44,28],[48,28],[52,28],[56,28],[64,28],
              [4,40],[8,40],[16,40],[20,40],[28,40],[36,40],[68,40],[76,40],[84,40],[92,40],[100,40],
              [4,44],[12,44],[24,44],[32,44],[40,44],[68,44],[80,44],[88,44],[96,44],[104,44],
              [4,48],[8,48],[16,48],[28,48],[36,48],[68,48],[84,48],[96,48],[100,48],
              [4,52],[12,52],[20,52],[28,52],[40,52],[68,52],[80,52],[92,52],[100,52],[104,52],
              [4,56],[8,56],[20,56],[32,56],[68,56],[80,56],[88,56],[96,56],
              [4,60],[12,60],[24,60],[36,60],[68,60],[84,60],[96,60],[104,60],
              [4,64],[8,64],[16,64],[20,64],[32,64],[40,64],[68,64],[76,64],[84,64],[92,64],[100,64],
              [40,74],[44,74],[52,74],[60,74],[68,74],[76,74],[84,74],[92,74],[100,74],[104,74],
              [44,78],[52,78],[60,78],[72,78],[80,78],[88,78],[96,78],
              [40,82],[48,82],[56,82],[60,82],[68,82],[76,82],[84,82],[92,82],[100,82],[104,82],
              [44,86],[52,86],[64,86],[72,86],[80,86],[88,86],
              [40,90],[48,90],[56,90],[60,90],[68,90],[80,90],[92,90],[100,90],[104,90],
              [44,94],[52,94],[64,94],[76,94],[84,94],[96,94],
              [40,98],[44,98],[48,98],[56,98],[68,98],[72,98],[80,98],[88,98],[96,98],[100,98],[104,98],
            ].map(([x, y], i) => (
              <rect key={i} x={x} y={y} width="4" height="4" fill="#1A1A2E" />
            ))}
          </svg>
        </div>
        <p className="text-sm font-bold text-midnight">{formatRupiah(total)}</p>
        <p className="text-center text-xs text-midnight/50">
          Scan dengan GoPay · OVO · DANA · ShopeePay · m-Banking
        </p>
      </div>
      <div className="flex items-center gap-2 rounded-xl bg-yellow-50 px-4 py-2.5">
        <IconClock size={14} className="text-yellow-600 shrink-0" aria-hidden="true" />
        <p className="text-xs text-yellow-700">QR berlaku selama <span className="font-bold font-mono">{display}</span></p>
      </div>
    </motion.div>
  )
}

// ── E-Wallet detail ───────────────────────────────────────────

function EwalletDetail({
  selected, onSelect, total,
}: { selected: EwalletId | null; onSelect: (id: EwalletId) => void; total: number }) {
  const { display } = useCountdown(10 * 60)
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {EWALLETS.map((ew) => (
          <button
            key={ew.id}
            type="button"
            onClick={() => onSelect(ew.id)}
            className={cn(
              'flex items-center gap-2.5 rounded-2xl border px-4 py-3 transition-colors text-left',
              selected === ew.id ? 'border-glaze-pink bg-glaze-pink/8' : 'border-border hover:border-glaze-pink/30',
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-black text-white" style={{ backgroundColor: ew.color }}>
              {ew.id === 'shopeepay' ? 'SP' : ew.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-midnight">{ew.name}</p>
              <p className="text-[10px] text-midnight/40">{formatRupiah(total)}</p>
            </div>
            {selected === ew.id && (
              <IconCircleCheck size={16} className="ml-auto text-glaze-pink shrink-0" aria-hidden="true" />
            )}
          </button>
        ))}
      </div>
      {selected && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <div className="rounded-xl bg-cream px-4 py-3 text-center">
            <p className="text-xs text-midnight/50">
              Simulasi: klik "Selesaikan Pembayaran" untuk konfirmasi {EWALLETS.find(e => e.id === selected)?.name}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-yellow-50 px-4 py-2.5">
            <IconClock size={14} className="text-yellow-600 shrink-0" />
            <p className="text-xs text-yellow-700">Sesi aktif <span className="font-bold font-mono">{display}</span></p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

// ── Success overlay ───────────────────────────────────────────

function SuccessOverlay({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t) }, [onDone])
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-midnight/90 backdrop-blur-sm"
      aria-live="polite" aria-label="Pembayaran berhasil"
    >
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20 mb-5"
      >
        <IconCircleCheck size={56} className="text-green-400" stroke={1.5} aria-hidden="true" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="font-display text-2xl font-bold text-white"
      >Pembayaran Berhasil!</motion.p>
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="mt-2 text-sm text-white/50"
      >Mengalihkan ke halaman konfirmasi…</motion.p>
    </motion.div>
  )
}

// ── Main payment page ─────────────────────────────────────────

function PaymentContent() {
  const router = useRouter()
  const prefersReduced = useReducedMotion()
  const searchParams = useSearchParams()
  const { updateStatus } = useOrdersActions()

  const orderId = searchParams.get('id') ?? 'ORD-XXXXX'
  const totalStr = searchParams.get('total') ?? '0'
  const total = parseInt(totalStr, 10) || 0

  const [method, setMethod]     = useState<PayMethod>('va')
  const [bank, setBank]         = useState<BankId>('bca')
  const [ewallet, setEwallet]   = useState<EwalletId | null>(null)
  const [vaNumber]              = useState(() => genVA('bca', orderId))
  const [vaNumbers]             = useState<Record<BankId, string>>(() => ({
    bca:     genVA('bca', orderId),
    bni:     genVA('bni', orderId),
    mandiri: genVA('mandiri', orderId),
    bri:     genVA('bri', orderId),
  }))
  const [payState, setPayState] = useState<PayState>('select')
  const [bankOpen, setBankOpen] = useState(true)

  const canPay = method !== 'ewallet' || ewallet !== null

  const handlePay = useCallback(async () => {
    if (!canPay) return
    setPayState('processing')
    await new Promise((r) => setTimeout(r, 1800))
    updateStatus(orderId, 'processing')
    setPayState('success')
  }, [canPay, orderId, updateStatus])

  const handleSuccessDone = useCallback(() => {
    router.push(`/order-confirmation?id=${orderId}&paid=true`)
  }, [orderId, router])

  const selectedBankData = BANKS.find((b) => b.id === bank)!

  const METHOD_TABS: { id: PayMethod; label: string; Icon: typeof IconBuildingBank }[] = [
    { id: 'va',      label: 'Virtual Account', Icon: IconBuildingBank },
    { id: 'qris',    label: 'QRIS',            Icon: IconQrcode },
    { id: 'ewallet', label: 'E-Wallet',        Icon: IconWallet },
  ]

  return (
    <div className="min-h-dvh bg-cream">
      {/* GLAZZY Pay top bar */}
      <div className="border-b border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-extrabold italic text-midnight">GLAZZY</span>
            <span className="rounded-md bg-glaze-pink px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">Pay</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-midnight/40">
            <IconLock size={11} aria-hidden="true" /> Secured
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-md space-y-4 px-4 py-5">
        {/* Order summary card */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-midnight/40">Order ID</p>
              <p className="font-mono text-sm font-bold text-midnight">{orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-midnight/40">Total</p>
              <p className="font-display text-xl font-bold text-midnight">{formatRupiah(total)}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-cream px-3 py-2">
            <div className="h-1.5 w-1.5 rounded-full bg-green-400" aria-hidden="true" />
            <p className="text-[10px] text-midnight/50">Pesanan sedang menunggu pembayaran</p>
          </div>
        </div>

        {/* Method selector tabs */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {/* Tabs */}
          <div className="grid grid-cols-3 border-b border-border" role="tablist">
            {METHOD_TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={method === id}
                onClick={() => setMethod(id)}
                className={cn(
                  'flex flex-col items-center gap-1 py-3 text-[10px] font-semibold transition-colors border-r last:border-r-0 border-border',
                  method === id ? 'bg-glaze-pink/8 text-glaze-pink' : 'text-midnight/40 hover:text-midnight hover:bg-cream',
                )}
              >
                <Icon size={16} aria-hidden="true" />
                <span className="text-center leading-tight">{label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-4">
            <AnimatePresence mode="wait">
              {/* Virtual Account */}
              {method === 'va' && (
                <motion.div key="va" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* Bank selector */}
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={() => setBankOpen((o) => !o)}
                      className="flex w-full items-center justify-between rounded-xl border border-border bg-cream px-4 py-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg text-white text-[10px] font-black" style={{ backgroundColor: selectedBankData.color }}>
                          {selectedBankData.name.slice(0, 3)}
                        </div>
                        <span className="text-sm font-semibold text-midnight">{selectedBankData.name}</span>
                      </div>
                      <IconChevronDown size={14} className={cn('text-midnight/40 transition-transform', bankOpen && 'rotate-180')} aria-hidden="true" />
                    </button>
                    <AnimatePresence>
                      {bankOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-1 grid grid-cols-2 gap-1.5 rounded-xl border border-border bg-cream p-2">
                            {BANKS.map((b) => (
                              <button
                                key={b.id}
                                type="button"
                                onClick={() => { setBank(b.id); setBankOpen(false) }}
                                className={cn(
                                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
                                  bank === b.id ? 'bg-glaze-pink/10 text-glaze-pink' : 'text-midnight/60 hover:bg-white',
                                )}
                              >
                                <div className="h-5 w-5 rounded text-white text-[8px] font-black flex items-center justify-center" style={{ backgroundColor: b.color }}>
                                  {b.name.slice(0, 3)}
                                </div>
                                {b.name}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <VaDetail bank={selectedBankData} vaNumber={vaNumbers[bank]} total={total} />
                </motion.div>
              )}

              {/* QRIS */}
              {method === 'qris' && (
                <motion.div key="qris" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <QrisDetail total={total} />
                </motion.div>
              )}

              {/* E-Wallet */}
              {method === 'ewallet' && (
                <motion.div key="ew" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <EwalletDetail selected={ewallet} onSelect={setEwallet} total={total} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Pay button */}
        <button
          type="button"
          onClick={handlePay}
          disabled={!canPay || payState === 'processing'}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold transition-all',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glaze-pink',
            canPay && payState !== 'processing'
              ? 'bg-glaze-pink text-white hover:bg-burnt-sugar active:scale-[0.98] shadow-[0_4px_20px_0_rgb(181_51_138/0.35)]'
              : 'bg-border text-midnight/30 cursor-not-allowed',
          )}
        >
          {payState === 'processing'
            ? <><IconLoader2 size={16} className="animate-spin" aria-hidden="true" /> Memverifikasi…</>
            : `Selesaikan Pembayaran — ${formatRupiah(total)}`}
        </button>

        <p className="text-center text-[11px] text-midnight/30">
          Ini adalah simulasi pembayaran — tidak ada transaksi nyata.
        </p>
      </div>

      {/* Success overlay */}
      {payState === 'success' && <SuccessOverlay onDone={handleSuccessDone} />}
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-glaze-pink" />
      </div>
    }>
      <PaymentContent />
    </Suspense>
  )
}
