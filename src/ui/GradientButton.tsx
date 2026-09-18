import { ArrowRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  className?: string
  showArrow?: boolean
  type?: 'button' | 'submit'
  fullWidth?: boolean
}

export function GradientButton({
  children,
  onClick,
  disabled,
  loading,
  variant = 'primary',
  className,
  showArrow,
  type = 'button',
  fullWidth = true,
}: Props) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-[16px] font-bold transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none'

  const variants = {
    primary: 'gradient-primary text-white shadow-[0_10px_24px_rgba(45,159,143,0.28)]',
    secondary: 'bg-white text-seafoam-deep border border-border shadow-sm',
    ghost: 'bg-transparent text-seafoam-deep',
    danger: 'bg-coral text-white shadow-md',
    outline: 'bg-white/80 text-ink border border-border',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(base, variants[variant], fullWidth && 'w-full', className)}
    >
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
      {children}
      {showArrow && !loading ? <ArrowRight className="h-5 w-5" /> : null}
    </button>
  )
}
