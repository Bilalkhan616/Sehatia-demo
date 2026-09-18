import {
  Calendar,
  LogOut,
  Settings,
  Shield,
  User,
  Wallet,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { PLANS } from '@/data/seed'
import { formatCurrency } from '@/lib/utils'
import { useAppStore } from '@/store/appStore'
import {
  Card,
  DashboardMenuCards,
  ImageCarousel,
  LanguageToggle,
  Monogram,
  Screen,
  showToast,
} from '@/ui'

export function PatientDashboardScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const user = useAppStore((s) => s.user)
  const selectedPatientId = useAppStore((s) => s.selectedPatientId)
  const patients = useAppStore((s) => s.patients)
  const appointments = useAppStore((s) => s.appointments)
  const walletBalance = useAppStore((s) => s.walletBalance)
  const activePlanId = useAppStore((s) => s.activePlanId)
  const logout = useAppStore((s) => s.logout)

  const patient = patients.find((p) => p.id === selectedPatientId)
  const plan = PLANS.find((p) => p.id === activePlanId)
  const upcoming = appointments.filter(
    (a) => a.status === 'upcoming' && (!selectedPatientId || a.patientId === selectedPatientId),
  )
  const ongoing = appointments.filter(
    (a) => a.status === 'ongoing' && (!selectedPatientId || a.patientId === selectedPatientId),
  )

  const menu = [
    {
      icon: <User size={18} />,
      title: t('patientDash.profile'),
      onClick: () => navigate('/patient/profile'),
    },
    {
      icon: <Wallet size={18} />,
      title: t('patientDash.wallet'),
      onClick: () => navigate('/patient/dashboard/wallet'),
    },
    {
      icon: <Settings size={18} />,
      title: t('patientDash.settings'),
      onClick: () => navigate('/patient/dashboard/settings'),
    },
    {
      icon: <Calendar size={18} />,
      title: t('patientDash.updatePlan'),
      onClick: () => navigate('/patient/dashboard/plan'),
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
            <p className="text-xs font-semibold text-muted">{t('patientDash.welcome')}</p>
            <p className="truncate font-extrabold text-ink">{user?.name}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <LanguageToggle compact />
          <button
            type="button"
            onClick={() => navigate('/patient/select')}
            className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-bold text-seafoam"
          >
            {t('common.switch')}
          </button>
        </div>
      </div>

      <Card className="gradient-hero mb-4 !border-0 text-white">
        <p className="text-sm font-medium text-white/80">{t('patientDash.activePatient')}</p>
        <h2 className="text-xl font-extrabold">
          {patient?.name || t('patientDash.selectPatient')}
        </h2>
        <div className="mt-3 flex gap-4 text-sm">
          <div>
            <p className="text-white/70">{t('patientDash.ongoingNow')}</p>
            <p className="font-bold">{ongoing.length}</p>
          </div>
          <div>
            <p className="text-white/70">{t('patientDash.upcoming')}</p>
            <p className="font-bold">{upcoming.length}</p>
          </div>
          <div>
            <p className="text-white/70">{t('patientDash.wallet')}</p>
            <p className="font-bold">{formatCurrency(walletBalance)}</p>
          </div>
          <div className="ms-auto text-end">
            <p className="text-white/70">{t('patientDash.plan')}</p>
            <p className="font-bold">{plan?.name}</p>
          </div>
        </div>
      </Card>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <Card onClick={() => navigate('/patient/appointments')}>
          <p className="text-2xl font-extrabold text-coral">{ongoing.length}</p>
          <p className="text-xs font-semibold text-muted">{t('patientDash.ongoingNow')}</p>
        </Card>
        <Card onClick={() => navigate('/patient/appointments')}>
          <p className="text-2xl font-extrabold text-seafoam">{upcoming.length}</p>
          <p className="text-xs font-semibold text-muted">{t('patientDash.upcoming')}</p>
        </Card>
      </div>

      <ImageCarousel />

      <DashboardMenuCards title={t('patientDash.quickMenu')} items={menu} />
    </Screen>
  )
}
