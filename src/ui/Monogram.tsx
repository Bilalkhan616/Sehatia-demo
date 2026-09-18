import { cn } from '@/lib/utils'

type Props = {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'h-10 w-10 text-lg rounded-[12px]',
  md: 'h-14 w-14 text-2xl rounded-[18px]',
  lg: 'h-16 w-16 text-3xl rounded-[20px]',
}

export function Monogram({ size = 'md', className }: Props) {
  return (
    <div
      className={cn(
        'gradient-monogram flex items-center justify-center font-extrabold text-white shadow-md',
        sizes[size],
        className,
      )}
    >
      S
    </div>
  )
}
