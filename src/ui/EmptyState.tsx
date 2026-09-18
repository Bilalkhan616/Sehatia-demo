import { Inbox } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type Props = {
  title?: string
  message?: string
  icon?: React.ReactNode
}

export function EmptyState({ title, message, icon }: Props) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-mist text-seafoam">
        {icon ?? <Inbox size={28} />}
      </div>
      <h3 className="text-base font-extrabold text-ink">
        {title ?? t('empty.defaultTitle')}
      </h3>
      <p className="mt-1 text-sm font-medium text-muted">
        {message ?? t('empty.defaultMessage')}
      </p>
    </div>
  )
}
