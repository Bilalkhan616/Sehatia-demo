import { useTranslation } from 'react-i18next'
import { setAppLanguage, type AppLanguage, getStoredLanguage } from '@/i18n'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
  compact?: boolean
}

export function LanguageToggle({ className, compact }: Props) {
  const { i18n, t } = useTranslation()
  const lng = (i18n.language?.startsWith('ar') ? 'ar' : 'en') as AppLanguage

  const toggle = () => {
    void setAppLanguage(lng === 'ar' ? 'en' : 'ar')
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        'flex items-center gap-1.5 rounded-full border border-border bg-white/90 px-3 py-1.5 text-xs font-bold text-seafoam shadow-sm',
        className,
      )}
      aria-label={lng === 'ar' ? t('common.english') : t('common.arabic')}
    >
      {lng === 'ar' ? t('common.langPillEn') : t('common.langPillAr')}
      {!compact && (
        <span className="text-[10px] font-semibold text-muted">
          {lng === 'ar' ? 'EN' : 'ع'}
        </span>
      )}
    </button>
  )
}

export function useIsRtl() {
  const { i18n } = useTranslation()
  return (i18n.language || getStoredLanguage()).startsWith('ar')
}
