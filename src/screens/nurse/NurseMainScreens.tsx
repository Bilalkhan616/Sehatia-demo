import { motion } from 'framer-motion'
import {
  CircleHelp,
  LogOut,
  Settings,
  Shield,
  User,
  Wallet,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { formatCurrency } from '@/lib/utils'
import { useAppStore } from '@/store/appStore'
import {
  Card,
  DashboardMenuCards,
  EmptyState,
  GradientButton,
  ImageCarousel,
  LanguageToggle,
  Monogram,
  Screen,
  showToast,
} from '@/ui'

export function NurseCompleteProfileModal() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const nurse = useAppStore((s) => s.getCurrentNurse())
  const dismissed = useAppStore((s) => s.dismissNurseProfilePrompt)
  const setDismiss = useAppStore((s) => s.setDismissNurseProfilePrompt)

  const onProfile = location.pathname.startsWith('/nurse/profile')
  if (!nurse || nurse.profileComplete || dismissed || onProfile) return null

  return (
    <div className="absolute inset-0 z-40 flex items-end bg-ink/45 p-4">
      <div className="w-full rounded-3xl bg-white p-5 shadow-xl">
        <h3 className="text-lg font-extrabold text-ink">{t('hire.title')}</h3>
        <p className="mt-2 text-sm text-muted">{t('hire.lead')}</p>
        <div className="mt-5 space-y-2">
          <GradientButton
            showArrow
            onClick={() => {
              setDismiss(true)
              navigate('/nurse/profile')
            }}
          >
            {t('hire.updateProfile')}
          </GradientButton>
          <GradientButton variant="ghost" onClick={() => setDismiss(true)}>
            {t('common.later')}
          </GradientButton>
        </div>
      </div>
    </div>
  )
}

function AvailabilityToggle({
  online,
  locked,
  onToggle,
}: {
  online: boolean
  locked?: boolean
  onToggle: () => void
}) {
  const { t } = useTranslation()
  const active = online && !locked
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileTap={{ scale: 0.94 }}
      aria-pressed={online}
      aria-label={online ? t('hire.setOffline') : t('hire.setAvailable')}
      className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-1.5 py-1 shadow-[0_4px_16px_rgba(0,0,0,0.12)] backdrop-blur-md"
    >
      <span className="relative flex h-2 w-2 shrink-0">
        {active && (
          <motion.span
            className="absolute inset-0 rounded-full bg-white"
            animate={{ scale: [1, 1.9, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <motion.span
          className="relative h-2 w-2 rounded-full"
          animate={{ backgroundColor: active ? '#FFFFFF' : 'rgba(255,255,255,0.45)' }}
          transition={{ duration: 0.25 }}
        />
      </span>
      <motion.span
        key={locked ? 'setup' : active ? 'on' : 'off'}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="whitespace-nowrap text-start text-[10px] font-extrabold uppercase tracking-wider text-white"
      >
        {locked ? t('hire.setup') : active ? t('hire.online') : t('hire.offline')}
      </motion.span>
      <span
        className={`relative flex h-5 w-9 items-center rounded-full p-0.5 ${
          active ? 'justify-end' : 'justify-start'
        }`}
      >
        <motion.span
          className="absolute inset-0 rounded-full"
          animate={{ backgroundColor: active ? '#FFFFFF' : 'rgba(255,255,255,0.28)' }}
          transition={{ duration: 0.28 }}
        />
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 560, damping: 30, mass: 0.65 }}
          className="relative h-4 w-4 rounded-full shadow-[0_1px_4px_rgba(22,58,58,0.28)]"
          animate={{ backgroundColor: active ? '#2D9F8F' : '#FFFFFF' }}
        />
      </span>
    </motion.button>
  )
}

export function NurseDashboardScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const user = useAppStore((s) => s.user)
  const bookings = useAppStore((s) => s.bookings)
  const appointments = useAppStore((s) => s.appointments)
  const nurseWalletBalance = useAppStore((s) => s.nurseWalletBalance)
  const logout = useAppStore((s) => s.logout)
  const nurse = useAppStore((s) => s.getCurrentNurse())
  const setNurseAvailable = useAppStore((s) => s.setNurseAvailable)
  const setDismiss = useAppStore((s) => s.setDismissNurseProfilePrompt)

  const nurseId = nurse?.id
  const pending = bookings.filter((b) => b.status === 'pending' && (!nurseId || b.nurseId === nurseId)).length
  const upcoming = appointments.filter((a) => a.status === 'upcoming' && (!nurseId || a.nurseId === nurseId)).length
  const ongoing = appointments.filter((a) => a.status === 'ongoing' && (!nurseId || a.nurseId === nurseId)).length
  const online = Boolean(nurse?.available && nurse.profileComplete)

  const menu = [
    {
      icon: <User size={18} />,
      title: t('profile.title'),
      onClick: () => navigate('/nurse/profile'),
    },
    {
      icon: <Wallet size={18} />,
      title: t('patientDash.wallet'),
      onClick: () => navigate('/nurse/dashboard/wallet'),
    },
    {
      icon: <Settings size={18} />,
      title: t('patientDash.settings'),
      onClick: () => navigate('/nurse/dashboard/settings'),
    },
    {
      icon: <CircleHelp size={18} />,
      title: t('nurseDash.help'),
      onClick: () => showToast({ type: 'info', message: t('nurseDash.helpDemo') }),
    },
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
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-white/80">{t('nurseDash.earnings')}</p>
            <p className="text-3xl font-extrabold tracking-tight">{formatCurrency(nurseWalletBalance)}</p>
          </div>
          <AvailabilityToggle
            online={online}
            locked={!nurse?.profileComplete}
            onToggle={() => {
              if (!nurse?.profileComplete) {
                setDismiss(false)
                showToast({ type: 'info', message: t('hire.completeFirst') })
                return
              }
              setNurseAvailable(!nurse.available)
              showToast({
                type: 'success',
                message: nurse.available ? t('hire.nowOffline') : t('hire.nowAvailable'),
              })
            }}
          />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/15 pt-3 text-center">
          <div>
            <p className="text-lg font-extrabold leading-none">{pending}</p>
            <p className="mt-1 text-[11px] leading-tight text-white/75">{t('status.pending')}</p>
          </div>
          <div>
            <p className="text-lg font-extrabold leading-none">{ongoing}</p>
            <p className="mt-1 text-[11px] leading-tight text-white/75">{t('nurseDash.ongoing')}</p>
          </div>
          <div>
            <p className="text-lg font-extrabold leading-none">{upcoming}</p>
            <p className="mt-1 text-[11px] leading-tight text-white/75">{t('nurseDash.upcoming')}</p>
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

      <ImageCarousel />

      <DashboardMenuCards title={t('nurseDash.menu')} items={menu} />
    </Screen>
  )
}

export function NurseRequestScreen() {
  const { t } = useTranslation()
  const user = useAppStore((s) => s.user)
  const bookings = useAppStore((s) => s.bookings)
  const acceptBooking = useAppStore((s) => s.acceptBooking)
  const declineBooking = useAppStore((s) => s.declineBooking)
  const ensureChatWith = useAppStore((s) => s.ensureChatWith)
  const navigate = useNavigate()
  const pending = bookings.filter(
    (b) => b.status === 'pending' && (!user?.id || b.nurseId === user.id),
  )

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
                    showToast({ type: 'success', message: t('requests.acceptedPay') })
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
