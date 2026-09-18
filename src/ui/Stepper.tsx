import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

type Props = {
  step: number
  total: number
  className?: string
}

export function Stepper({ step, total, className }: Props) {
  const { t } = useTranslation()
  return (
    <div className={cn('mb-4', className)}>
      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-muted">
        <span>{t('common.stepOf', { step, total })}</span>
        <span>{Math.round((step / total) * 100)}%</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full',
              i < step ? 'gradient-primary' : 'bg-border',
            )}
          />
        ))}
      </div>
    </div>
  )
}
