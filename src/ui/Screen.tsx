import { cn } from '@/lib/utils'

type ScreenProps = {
  children: React.ReactNode
  className?: string
  scroll?: boolean
  blobs?: boolean
  padded?: boolean
}

export function Screen({
  children,
  className,
  scroll = true,
  blobs = true,
  padded = true,
}: ScreenProps) {
  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden gradient-screen">
      {blobs && (
        <>
          <div
            className="blob"
            style={{
              top: -60,
              right: -40,
              width: 180,
              height: 180,
              background: 'rgba(45,159,143,0.14)',
            }}
          />
          <div
            className="blob"
            style={{
              bottom: 80,
              left: -50,
              width: 160,
              height: 160,
              background: 'rgba(91,155,213,0.14)',
            }}
          />
          <div
            className="blob"
            style={{
              bottom: -30,
              right: 20,
              width: 120,
              height: 120,
              background: 'rgba(232,132,107,0.12)',
            }}
          />
        </>
      )}
      <div
        className={cn(
          'relative z-10 flex min-h-0 flex-1 flex-col',
          scroll && 'phone-scroll overflow-y-auto overflow-x-hidden',
          padded && 'px-5 pb-6 pt-3',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
