import { cn } from '@/lib/utils'

// ============================================================
// GLAZZY — PageHeader (Server Component)
// Dipakai di menu, packages, location, about
// ============================================================

interface PageHeaderProps {
  title: string
  subtitle?: string
  className?: string
  /** Teks italic di bawah title (Playfair italic) */
  eyebrow?: string
}

export default function PageHeader({
  title,
  subtitle,
  eyebrow,
  className,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        'border-b border-border bg-cream px-4 pb-10 pt-12 sm:px-6 lg:px-8',
        className,
      )}
      aria-labelledby="page-header-title"
    >
      <div className="mx-auto max-w-7xl">
        {eyebrow && (
          <p className="mb-2 font-display text-sm italic text-glaze-pink">
            {eyebrow}
          </p>
        )}
        <h1
          id="page-header-title"
          className="font-display text-3xl font-bold tracking-tight text-midnight sm:text-4xl"
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-xl text-base leading-relaxed text-midnight/60">
            {subtitle}
          </p>
        )}
        <span className="accent-bar mt-5" aria-hidden="true" />
      </div>
    </section>
  )
}
