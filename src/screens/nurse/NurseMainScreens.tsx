import {
  ChevronRight,
  LogOut,
  Shield,
  User,
  Wallet,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '@/lib/utils'
import { useAppStore } from '@/store/appStore'
import {
  Card,
  EmptyState,
  GradientButton,
  LanguageToggle,
  Monogram,
  Screen,
  showToast,
  useIsRtl,
} from '@/ui'

export function NurseDashboardScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const rtl = useIsRtl()
  const user = useAppStore((s) => s.user)
  const bookings = useAppStore((s) => s.bookings)
  const appointments = useAppStore((s) => s.appointments)
  const nurseWalletBalance = useAppStore((s) => s.nurseWalletBalance)
  const logout = useAppStore((s) => s.logout)

  const pending = bookings.filter((b) => b.status === 'pending').length
  const upcoming = appointments.filter((a) => a.status === 'upcoming').length
  const ongoing = appointments.filter((a) => a.status === 'ongoing').length

  const menu = [
    { icon: <User size={18} />, title: t('profile.title'), to: '/nurse/profile' },
    { icon: <Wallet size={18} />, title: t('patientDash.wallet'), to: '/nurse/dashboard/wallet' },
    {
      icon: <Shield size={18} />,
      title: t('patientDash.privacy'),
      onClick: () => showToast({ type: 'info', message: t('patientDash.privacyDemo') }),
    },
    {
      icon: <LogOut size={18} />,
      title: t('common.logout'),
      onClick: () => {
        logout()
        navigate('/', { replace: true })
      },
    },
  ]

  return (
    <Screen>
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <Monogram size="sm" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-muted">{t('nurseDash.welcomeBack')}</p>
            <p className="truncate font-extrabold text-ink">{user?.name}</p>
          </div>
        </div>
        <LanguageToggle compact />
      </div>

      <Card className="mb-4 gradient-hero !border-0 text-white">
        <p className="text-sm text-white/80">{t('nurseDash.earnings')}</p>
        <p className="text-3xl font-extrabold">{formatCurrency(nurseWalletBalance)}</p>
        <div className="mt-3 flex gap-4 text-sm">
          <div>
            <p className="text-white/70">{t('status.pending')}</p>
            <p className="font-bold">{pending}</p>
          </div>
          <div>
            <p className="text-white/70">{t('nurseDash.ongoing')}</p>
            <p className="font-bold">{ongoing}</p>
          </div>
          <div>
            <p className="text-white/70">{t('nurseDash.upcoming')}</p>
            <p className="font-bold">{upcoming}</p>
          </div>
        </div>
      </Card>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <Card onClick={() => navigate('/nurse/requests')}>
          <p className="text-2xl font-extrabold text-seafoam">{pending}</p>
          <p className="text-xs font-semibold text-muted">{t('nurseDash.newRequests')}</p>
        </Card>
        <Card onClick={() => navigate('/nurse/appointments')}>
          <p className="text-2xl font-extrabold text-coral">{ongoing || upcoming}</p>
          <p className="text-xs font-semibold text-muted">
            {ongoing > 0 ? t('nurseDash.ongoingVisits') : t('nurseDash.appointments')}
          </p>
        </Card>
      </div>

      <h3 className="mb-2 text-sm font-extrabold text-ink">{t('nurseDash.menu')}</h3>
      <div className="space-y-2">
        {menu.map((m) => (
          <button
            key={m.title}
            type="button"
            onClick={() => (m.onClick ? m.onClick() : navigate(m.to!))}
            className="flex w-full items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-mist text-seafoam">
              {m.icon}
            </span>
            <span className="flex-1 text-start font-bold text-ink">{m.title}</span>
            <ChevronRight size={16} className={`text-muted ${rtl ? 'rotate-180' : ''}`} />
          </button>
        ))}
      </div>
    </Screen>
  )
}

export function NurseRequestScreen() {
  const { t } = useTranslation()
  const bookings = useAppStore((s) => s.bookings)
  const acceptBooking = useAppStore((s) => s.acceptBooking)
  const declineBooking = useAppStore((s) => s.declineBooking)
  const ensureChatWith = useAppStore((s) => s.ensureChatWith)
  const navigate = useNavigate()
  const pending = bookings.filter((b) => b.status === 'pending')

  return (
    <Screen>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-ink">{t('requests.title')}</h1>
        <LanguageToggle compact />
      </div>
      {pending.length === 0 ? (
        <EmptyState title={t('requests.empty')} message={t('requests.emptyHint')} />
      ) : (
        <div className="space-y-3">
          {pending.map((b) => (
            <Card key={b.id}>
              <p className="font-extrabold text-ink">{b.service}</p>
              <p className="text-xs text-muted">
                {b.patientName} · {b.date} {b.time}
              </p>
              <p className="mt-1 text-sm text-muted">{b.address}</p>
              <p className="mt-1 font-bold text-seafoam">{formatCurrency(b.amount)}</p>
              {b.notes && <p className="mt-2 text-xs text-muted">{b.notes}</p>}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <GradientButton
                  onClick={() => {
                    acceptBooking(b.id)
                    showToast({ type: 'success', message: t('requests.accepted') })
                  }}
                >
                  {t('requests.accept')}
                </GradientButton>
                <GradientButton
                  variant="danger"
                  onClick={() => {
                    declineBooking(b.id)
                    showToast({ type: 'info', message: t('requests.declined') })
                  }}
                >
                  {t('requests.decline')}
                </GradientButton>
              </div>
              <GradientButton
                className="mt-2"
                variant="outline"
                onClick={() => {
                  const chatId = ensureChatWith(b.patientId, b.patientName, 'AccountHolder')
                  navigate(`/nurse/messages/${chatId}`)
                }}
              >
                {t('requests.messagePatient')}
              </GradientButton>
            </Card>
          ))}
        </div>
      )}
    </Screen>
  )
}

export function NurseWalletScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const balance = useAppStore((s) => s.nurseWalletBalance)
  return (
    <Screen>
      <div className="mb-4 flex items-center gap-2">
        <button type="button" onClick={() => navigate(-1)} className="text-sm font-bold text-seafoam">
          {t('common.back')}
        </button>
      </div>
      <Card className="gradient-hero !border-0 text-white">
        <p className="text-sm text-white/80">{t('nurseDash.availableEarnings')}</p>
        <p className="text-3xl font-extrabold">{formatCurrency(balance)}</p>
      </Card>
      <Card className="mt-4">
        <p className="text-sm font-bold text-ink">{t('nurseDash.recentPayouts')}</p>
        <p className="mt-2 text-xs text-muted">
          Sep 12 — {formatCurrency(540)} {t('nurseDash.withdrawn')}
        </p>
        <p className="mt-1 text-xs text-muted">
          Sep 5 — {formatCurrency(720)} {t('nurseDash.withdrawn')}
        </p>
        <GradientButton
          className="mt-4"
          onClick={() => showToast({ type: 'success', message: t('nurseDash.payoutRequested') })}
        >
          {t('nurseDash.requestPayout')}
        </GradientButton>
      </Card>
    </Screen>
  )
}
