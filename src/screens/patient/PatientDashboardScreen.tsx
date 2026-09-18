import {
  Calendar,
  ChevronRight,
  LogOut,
  Settings,
  Shield,
  User,
  Wallet,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PLANS } from '@/data/seed'
import { formatCurrency } from '@/lib/utils'
import { useAppStore } from '@/store/appStore'
import { Card, Monogram, Screen, showToast } from '@/ui'

export function PatientDashboardScreen() {
  const navigate = useNavigate()
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
    { icon: <User size={18} />, title: 'Profile', to: '/patient/profile' },
    { icon: <Wallet size={18} />, title: 'Wallet', to: '/patient/dashboard/wallet' },
    { icon: <Settings size={18} />, title: 'Settings', to: '/patient/dashboard/settings' },
    { icon: <Calendar size={18} />, title: 'Update plan', to: '/patient/dashboard/plan' },
    {
      icon: <Shield size={18} />,
      title: 'Privacy policy',
      onClick: () => showToast({ type: 'info', message: 'Privacy policy (demo)' }),
    },
    {
      icon: <LogOut size={18} />,
      title: 'Logout',
      onClick: () => {
        logout()
        navigate('/', { replace: true })
      },
    },
  ]

  return (
    <Screen>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Monogram size="sm" />
          <div>
            <p className="text-xs font-semibold text-muted">Welcome</p>
            <p className="font-extrabold text-ink">{user?.name}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/patient/select')}
          className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-bold text-seafoam"
        >
          Switch
        </button>
      </div>

      <Card className="gradient-hero mb-4 !border-0 text-white">
        <p className="text-sm font-medium text-white/80">Active patient</p>
        <h2 className="text-xl font-extrabold">{patient?.name || 'Select a patient'}</h2>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/70">Wallet</p>
            <p className="text-lg font-extrabold">{formatCurrency(walletBalance)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/70">Plan</p>
            <p className="font-bold">{plan?.name}</p>
          </div>
        </div>
      </Card>

      {ongoing.length > 0 && (
        <>
          <h3 className="mb-2 text-sm font-extrabold text-ink">Ongoing now</h3>
          {ongoing.map((a) => (
            <Card
              key={a.id}
              className="mb-3 border-coral/30"
              onClick={() => navigate(`/patient/appointments/${a.id}`)}
            >
              <span className="mb-1 inline-flex rounded-full bg-coral/15 px-2 py-0.5 text-[10px] font-bold uppercase text-coral">
                Ongoing
              </span>
              <p className="font-bold text-ink">{a.service}</p>
              <p className="text-xs text-muted">
                {a.nurseName} · started{' '}
                {a.startedAt
                  ? new Date(a.startedAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : a.time}
              </p>
            </Card>
          ))}
        </>
      )}

      <h3 className="mb-2 text-sm font-extrabold text-ink">Upcoming</h3>
      {upcoming.length === 0 ? (
        <Card className="mb-4">
          <p className="text-sm text-muted">No upcoming appointments. Book care from the Book tab.</p>
        </Card>
      ) : (
        upcoming.slice(0, 2).map((a) => (
          <Card
            key={a.id}
            className="mb-2"
            onClick={() => navigate(`/patient/appointments/${a.id}`)}
          >
            <p className="font-bold text-ink">{a.service}</p>
            <p className="text-xs text-muted">
              {a.date} · {a.time} · {a.nurseName}
            </p>
          </Card>
        ))
      )}

      <h3 className="mb-2 mt-3 text-sm font-extrabold text-ink">Quick menu</h3>
      <div className="space-y-2">
        {menu.map((m) => (
          <button
            key={m.title}
            type="button"
            onClick={() => (m.onClick ? m.onClick() : navigate(m.to!))}
            className="flex w-full items-center gap-3 rounded-2xl border border-border bg-white/95 px-4 py-3 text-left shadow-sm"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-mist text-seafoam">
              {m.icon}
            </span>
            <span className="flex-1 font-bold text-ink">{m.title}</span>
            <ChevronRight size={16} className="text-muted" />
          </button>
        ))}
      </div>
    </Screen>
  )
}
