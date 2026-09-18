import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
  className?: string
  tone?: 'seafoam' | 'sky' | 'coral'
}

export function Chip({
  children,
  active,
  onClick,
  className,
  tone = 'seafoam',
}: Props) {
  const tones = {
    seafoam: active
      ? 'bg-seafoam text-white border-seafoam'
      : 'bg-white text-seafoam-deep border-border',
    sky: active ? 'bg-sky text-white border-sky' : 'bg-white text-sky border-border',
    coral: active
      ? 'bg-coral text-white border-coral'
      : 'bg-white text-coral border-border',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-xs font-bold transition',
        tones[tone],
        className,
      )}
    >
      {children}
    </button>
  )
}
