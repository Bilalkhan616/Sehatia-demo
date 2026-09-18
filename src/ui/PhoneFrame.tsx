import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  className?: string
}

export function PhoneFrame({ children, className }: Props) {
  const [isNarrow, setIsNarrow] = useState(false)
  const [time, setTime] = useState('')

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 480px)')
    const update = () => setIsNarrow(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      setTime(
        d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      )
    }
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [])

  if (isNarrow) {
    return (
      <div className={cn('relative flex h-[100dvh] w-full flex-col bg-cream', className)}>
        {children}
      </div>
    )
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[linear-gradient(160deg,#E8F0F4_0%,#F5F9FC_50%,#DCEEF8_100%)] p-6">
      <div className="text-center">
        <div className="mb-4">
          <p className="text-sm font-bold text-ink">Sehatia demo</p>
          <p className="text-xs text-muted">Interactive preview — no API, mock data only</p>
        </div>
        <div
          className={cn(
            'relative mx-auto overflow-hidden rounded-[44px] border-[10px] border-[#1a1a1a] bg-black shadow-[0_25px_80px_rgba(22,58,58,0.25)]',
            className,
          )}
          style={{ width: 390, height: 844 }}
        >
          {/* Dynamic island */}
          <div className="pointer-events-none absolute left-1/2 top-2 z-50 h-[28px] w-[110px] -translate-x-1/2 rounded-full bg-black" />
          {/* Status bar */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex h-11 items-end justify-between px-7 pb-1 text-[12px] font-semibold text-ink">
            <span>{time || '9:41'}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px]">●●●</span>
              <span className="text-[10px]">WiFi</span>
              <span className="rounded-[3px] border border-ink/80 px-1 text-[9px] leading-none">
                100
              </span>
            </div>
          </div>
          <div
            className="absolute inset-x-0 bottom-0 top-11 flex flex-col overflow-hidden rounded-b-[34px] bg-cream"
          >
            {children}
          </div>
          {/* Home indicator */}
          <div className="pointer-events-none absolute bottom-2 left-1/2 z-50 h-1 w-28 -translate-x-1/2 rounded-full bg-ink/30" />
        </div>
      </div>
    </div>
  )
}
