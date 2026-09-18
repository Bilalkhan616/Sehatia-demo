import { cn } from '@/lib/utils'

type Props = {
  size?: 'sm' | 'md' | 'lg' | 'hero'
  className?: string
  /** white mark on seafoam gradient chip (default) | seafoam mark on soft chip */
  tone?: 'onGradient' | 'seafoam'
}

const sizes = {
  sm: 'h-10 w-[4.75rem] rounded-[12px] p-1.5',
  md: 'h-14 w-[7.25rem] rounded-[16px] p-2',
  lg: 'h-16 w-[8.5rem] rounded-[18px] p-2.5',
  hero: 'h-20 w-[11rem] rounded-[22px] p-3',
}

export function Monogram({ size = 'md', className, tone = 'onGradient' }: Props) {
  const markColor = tone === 'onGradient' ? '#FFFFFF' : '#2D9F8F'

  return (
    <div
      className={cn(
        'flex items-center justify-center shadow-md',
        tone === 'onGradient' ? 'gradient-monogram' : 'border border-border bg-white/95',
        sizes[size],
        className,
      )}
      aria-label="Mathab"
      role="img"
    >
      <span
        className="block h-full w-full"
        style={{
          backgroundColor: markColor,
          WebkitMaskImage: 'url(/images/mathab-logo-mask.png)',
          maskImage: 'url(/images/mathab-logo-mask.png)',
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
        }}
      />
    </div>
  )
}
