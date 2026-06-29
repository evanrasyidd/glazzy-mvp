// ============================================================
// GLAZZY — GlazzyLoader
// Server Component — pakai CSS animation, no JS needed
// ============================================================

interface GlazzyLoaderProps {
  message?: string
  dark?: boolean   // true = dark bg (admin/pos), false = cream bg
  fullscreen?: boolean
}

export default function GlazzyLoader({
  message = 'Lagi dibikin fresh...',
  dark = false,
  fullscreen = true,
}: GlazzyLoaderProps) {
  return (
    <div
      className={[
        fullscreen ? 'min-h-screen' : 'min-h-64',
        'flex flex-col items-center justify-center gap-6',
        dark ? 'bg-midnight' : 'bg-cream',
      ].join(' ')}
      role="status"
      aria-label={message}
    >
      {/* Spinning donut SVG */}
      <div style={{ animation: 'glazzy-spin 1.4s linear infinite' }}>
        <svg
          width="72"
          height="72"
          viewBox="0 0 72 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Donut body */}
          <circle cx="36" cy="36" r="30" fill="#B5338A" />
          {/* Glaze lighter top */}
          <ellipse cx="36" cy="26" rx="22" ry="14" fill="#D580B8" opacity="0.7" />
          {/* Hole */}
          <circle cx="36" cy="36" r="12" fill="#FFF4E6" />
          {/* Hole rim */}
          <circle cx="36" cy="36" r="13" stroke="#D580B8" strokeWidth="1.5" fill="none" opacity="0.5" />
          {/* Sprinkle 1 */}
          <rect x="48" y="20" width="4" height="10" rx="2" fill="#FFE08A" transform="rotate(25, 50, 25)" />
          {/* Sprinkle 2 */}
          <rect x="15" y="22" width="4" height="10" rx="2" fill="#FFFFFF" transform="rotate(-20, 17, 27)" />
          {/* Sprinkle 3 */}
          <rect x="50" y="40" width="4" height="10" rx="2" fill="#FFE08A" transform="rotate(40, 52, 45)" />
          {/* Highlight */}
          <ellipse cx="28" cy="22" rx="6" ry="3" fill="white" opacity="0.3" transform="rotate(-30, 28, 22)" />
        </svg>
      </div>

      {/* GLAZZY wordmark */}
      <div className="text-center">
        <p
          className="font-display text-2xl font-extrabold italic"
          style={{ color: dark ? '#B5338A' : '#B5338A' }}
        >
          GLAZZY
        </p>

        {/* Animated dots */}
        <div className="mt-2 flex items-center justify-center gap-1">
          <span
            className="text-sm"
            style={{ color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(26,26,46,0.5)' }}
          >
            {message}
          </span>
          <span style={{ display: 'inline-flex', gap: '3px', marginLeft: '4px' }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: '#B5338A',
                  display: 'inline-block',
                  animation: `glazzy-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </span>
        </div>
      </div>

      {/* CSS keyframes via style tag */}
      <style>{`
        @keyframes glazzy-spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes glazzy-dot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
