import { ChevronLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useIsRtl } from './LanguageToggle'

type Props = {
  title?: string
  subtitle?: string
  onBack?: () => void
  right?: React.ReactNode
  className?: string
  showBack?: boolean
}

export function Header({
  title,
  subtitle,
  onBack,
  right,
  className,
  showBack = true,
}: Props) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const rtl = useIsRtl()

  return (
    <div className={cn('mb-4 flex items-center gap-3', className)}>
      {showBack ? (
        <button
          type="button"
          onClick={onBack ?? (() => navigate(-1))}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/90 text-ink shadow-sm"
          aria-label={t('common.back')}
        >
          <ChevronLeft size={20} className={rtl ? 'rotate-180' : undefined} />
        </button>
      ) : (
        <div className="w-10" />
      )}
      <div className="min-w-0 flex-1 text-center">
        {title ? (
          <h1 className="truncate text-lg font-extrabold text-ink">{title}</h1>
        ) : null}
        {subtitle ? (
          <p className="truncate text-xs font-medium text-muted">{subtitle}</p>
        ) : null}
      </div>
      <div className="flex w-10 justify-end">{right}</div>
    </div>
  )
}
