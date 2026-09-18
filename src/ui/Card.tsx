import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  padding?: boolean
}

export function Card({ children, className, onClick, padding = true }: Props) {
  const Comp = onClick ? 'button' : 'div'
  return (
    <Comp
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'w-full rounded-3xl border border-white/70 bg-white/95 text-left shadow-[0_8px_28px_rgba(22,58,58,0.08)]',
        padding && 'p-4',
        onClick && 'transition hover:shadow-[0_10px_32px_rgba(22,58,58,0.12)] active:scale-[0.99]',
        className,
      )}
    >
      {children}
    </Comp>
  )
}
