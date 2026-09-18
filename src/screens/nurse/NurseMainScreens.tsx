import {
  ChevronRight,
  LogOut,
  Shield,
  User,
  Wallet,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '@/lib/utils'
import { useAppStore } from '@/store/appStore'
import { Card, EmptyState, GradientButton, Monogram, Screen, showToast } from '@/ui'

export function NurseDashboardScreen() {
  const navigate = useNavigate()
  const user = useAppStore((s) => s.user)
  const bookings = useAppStore((s) => s.bookings)
  const appointments = useAppStore((s) => s.appointments)
  const nurseWalletBalance = useAppStore((s) => s.nurseWalletBalance)
  const logout = useAppStore((s) => s.logout)

  const pending = bookings.filter((b) => b.status === 'pending').length
  const upcoming = appointments.filter((a) => a.status === 'upcoming').length
  const ongoing = appointments.filter((a) => a.status === 'ongoing').length

  const menu = [
    { icon: <User size={18} />, title: 'Profile', to: '/nurse/profile' },
    { icon: <Wallet size={18} />, title: 'Wallet', to: '/nurse/dashboard/wallet' },
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
      <div className="mb-4 flex items-center gap-3">
        <Monogram size="sm" />
        <div>
          <p className="text-xs font-semibold text-muted">Welcome back</p>
          <p className="font-extrabold text-ink">{user?.name}</p>
        </div>
      </div>

      <Card className="mb-4 gradient-hero !border-0 text-white">
        <p className="text-sm text-white/80">Earnings wallet</p>
        <p className="text-3xl font-extrabold">{formatCurrency(nurseWalletBalance)}</p>
        <div className="mt-3 flex gap-4 text-sm">
          <div>
            <p className="text-white/70">Pending</p>
            <p className="font-bold">{pending}</p>
          </div>
          <div>
            <p className="text-white/70">Ongoing</p>
            <p className="font-bold">{ongoing}</p>
          </div>
          <div>
            <p className="text-white/70">Upcoming</p>
            <p className="font-bold">{upcoming}</p>
          </div>
        </div>
      </Card>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <Card onClick={() => navigate('/nurse/requests')}>
          <p className="text-2xl font-extrabold text-seafoam">{pending}</p>
          <p className="text-xs font-semibold text-muted">New requests</p>
        </Card>
        <Card onClick={() => navigate('/nurse/appointments')}>
          <p className="text-2xl font-extrabold text-coral">{ongoing || upcoming}</p>
          <p className="text-xs font-semibold text-muted">
            {ongoing > 0 ? 'Ongoing visits' : 'Appointments'}
          </p>
        </Card>
      </div>

      <h3 className="mb-2 text-sm font-extrabold text-ink">Menu</h3>
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
            <span className="flex-1 text-left font-bold text-ink">{m.title}</span>
            <ChevronRight size={16} className="text-muted" />
          </button>
        ))}
      </div>
    </Screen>
  )
}

export function NurseRequestScreen() {
  const bookings = useAppStore((s) => s.bookings)
  const acceptBooking = useAppStore((s) => s.acceptBooking)
  const declineBooking = useAppStore((s) => s.declineBooking)
  const ensureChatWith = useAppStore((s) => s.ensureChatWith)
  const navigate = useNavigate()
  const pending = bookings.filter((b) => b.status === 'pending')

  return (
    <Screen>
      <h1 className="mb-4 text-2xl font-extrabold text-ink">Requests</h1>
      {pending.length === 0 ? (
        <EmptyState title="No pending requests" message="New patient booking requests appear here." />
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
                    showToast({ type: 'success', message: 'Booking accepted' })
                  }}
                >
                  Accept
                </GradientButton>
                <GradientButton
                  variant="danger"
                  onClick={() => {
                    declineBooking(b.id)
                    showToast({ type: 'info', message: 'Booking declined' })
                  }}
                >
                  Decline
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
                Message patient
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
  const balance = useAppStore((s) => s.nurseWalletBalance)
  return (
    <Screen>
      <div className="mb-4 flex items-center gap-2">
        <button type="button" onClick={() => navigate(-1)} className="text-sm font-bold text-seafoam">
          ← Back
        </button>
      </div>
      <Card className="gradient-hero !border-0 text-white">
        <p className="text-sm text-white/80">Available earnings</p>
        <p className="text-3xl font-extrabold">{formatCurrency(balance)}</p>
      </Card>
      <Card className="mt-4">
        <p className="text-sm font-bold text-ink">Recent payouts</p>
        <p className="mt-2 text-xs text-muted">Sep 12 — {formatCurrency(540)} withdrawn</p>
        <p className="mt-1 text-xs text-muted">Sep 5 — {formatCurrency(720)} withdrawn</p>
        <GradientButton
          className="mt-4"
          onClick={() => showToast({ type: 'success', message: 'Payout requested (demo)' })}
        >
          Request payout
        </GradientButton>
      </Card>
    </Screen>
  )
}
