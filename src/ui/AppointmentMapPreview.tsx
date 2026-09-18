import { MapPin, Navigation } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

type Props = {
  /** Whose perspective: patient sees "You" + nurse; nurse sees patient + "You" */
  perspective: 'patient' | 'nurse'
  address?: string
  peerName?: string
  className?: string
}

type Point = { x: number; y: number }

/**
 * Demo map overview — no map API. Shows relative pins + route for upcoming visits.
 */
export function AppointmentMapPreview({
  perspective,
  address,
  peerName,
  className,
}: Props) {
  const { t } = useTranslation()

  const youLabel = t('map.you')
  const nurseLabel = peerName || t('map.nurse')
  const patientLabel = peerName || t('map.patient')

  // Same coordinate space for pins + route (0–100%)
  const patientHome: Point = { x: 28, y: 68 }
  const nurseEnRoute: Point = { x: 72, y: 30 }

  const youPos = perspective === 'patient' ? patientHome : nurseEnRoute
  const peerPos = perspective === 'patient' ? nurseEnRoute : patientHome

  const you = {
    ...youPos,
    label: youLabel,
    tone: 'seafoam' as const,
  }
  const peer = {
    ...peerPos,
    label: perspective === 'patient' ? nurseLabel : patientLabel,
    tone: (perspective === 'patient' ? 'sky' : 'coral') as 'sky' | 'coral',
  }

  // Curve control point so the dashed line bends toward the corridor between pins
  const mid: Point = {
    x: (youPos.x + peerPos.x) / 2,
    y: (youPos.y + peerPos.y) / 2 - 14,
  }
  const routePath = `M ${youPos.x} ${youPos.y} Q ${mid.x} ${mid.y} ${peerPos.x} ${peerPos.y}`

  return (
    <div className={cn('mt-4', className)}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Navigation size={14} className="text-seafoam" />
          <h3 className="text-sm font-extrabold text-ink">{t('map.title')}</h3>
        </div>
        <span className="rounded-full bg-mist px-2 py-0.5 text-[10px] font-bold text-seafoam-deep">
          {t('map.demoBadge')}
        </span>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-border shadow-[0_8px_24px_rgba(22,58,58,0.08)]">
        <div
          className="relative h-52 w-full"
          style={{
            background: 'linear-gradient(160deg, #E8F4F1 0%, #F0F7FB 45%, #E6EEF5 100%)',
          }}
        >
          <div
            className="absolute rounded-full opacity-40"
            style={{
              width: 120,
              height: 90,
              left: '8%',
              top: '18%',
              background: '#C8EDE6',
              filter: 'blur(2px)',
            }}
          />
          <div
            className="absolute rounded-full opacity-35"
            style={{
              width: 100,
              height: 70,
              right: '10%',
              bottom: '20%',
              background: '#D4E6F7',
              filter: 'blur(2px)',
            }}
          />

          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <pattern
                id="mapGrid"
                width="7"
                height="7"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 7 0 L 0 0 0 7"
                  fill="none"
                  stroke="rgba(22,58,58,0.06)"
                  strokeWidth="0.3"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#mapGrid)" />
            {/* Roads */}
            <path
              d="M0 45 Q30 35 50 52 T100 42"
              fill="none"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="3.2"
            />
            <path
              d="M22 0 Q26 48 24 100"
              fill="none"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="2.6"
            />
            <path
              d="M0 72 H100"
              fill="none"
              stroke="rgba(255,255,255,0.75)"
              strokeWidth="2.4"
            />
            {/* Route: You → peer (same coords as markers) */}
            <path
              d={routePath}
              fill="none"
              stroke="#2D9F8F"
              strokeWidth="3"
              strokeDasharray="6 5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              opacity="0.95"
            />
          </svg>

          <MapMarker {...peer} />
          <MapMarker {...you} pulse />
        </div>

        <div className="space-y-2 border-t border-border/70 bg-white/95 px-3 py-3">
          <div className="flex items-start gap-2 text-xs text-muted">
            <MapPin size={14} className="mt-0.5 shrink-0 text-coral" />
            <span className="font-medium text-ink">{address || t('map.defaultAddress')}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <LegendDot color="#2D9F8F" label={youLabel} />
            <LegendDot
              color={perspective === 'patient' ? '#5B9BD5' : '#E8846B'}
              label={perspective === 'patient' ? nurseLabel : patientLabel}
            />
            <span className="rounded-full bg-mist px-2.5 py-1 text-[11px] font-bold text-seafoam-deep">
              {t('map.eta', { mins: 12 })}
            </span>
            <span className="rounded-full bg-sky-soft px-2.5 py-1 text-[11px] font-bold text-sky">
              {t('map.distance', { km: '3.4' })}
            </span>
          </div>
          <p className="text-[11px] font-medium text-muted">{t('map.hint')}</p>
        </div>
      </div>
    </div>
  )
}

function MapMarker({
  x,
  y,
  label,
  tone,
  pulse,
}: {
  x: number
  y: number
  label: string
  tone: 'seafoam' | 'sky' | 'coral'
  pulse?: boolean
}) {
  const colors = {
    seafoam: { bg: '#2D9F8F', ring: 'rgba(45,159,143,0.35)' },
    sky: { bg: '#5B9BD5', ring: 'rgba(91,155,213,0.35)' },
    coral: { bg: '#E8846B', ring: 'rgba(232,132,107,0.35)' },
  }[tone]

  return (
    <div
      className="absolute z-10 -translate-x-1/2 -translate-y-full"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="flex flex-col items-center">
        <span className="mb-1 max-w-[88px] truncate rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-ink shadow-sm">
          {label}
        </span>
        <div className="relative">
          {pulse && (
            <span
              className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full"
              style={{ background: colors.ring }}
            />
          )}
          <div
            className="relative flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-white shadow-md"
            style={{ background: colors.bg }}
          >
            <MapPin size={14} className="text-white" fill="white" />
          </div>
          <div
            className="mx-auto h-2 w-2 rounded-full"
            style={{ background: colors.bg, marginTop: -2 }}
          />
        </div>
      </div>
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-ink shadow-sm ring-1 ring-border/60">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  )
}
