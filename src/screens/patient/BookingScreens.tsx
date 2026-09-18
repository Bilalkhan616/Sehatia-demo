import { Clock, MapPin, Stethoscope } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SERVICES } from '@/data/seed'
import { formatCurrency } from '@/lib/utils'
import { useAppStore } from '@/store/appStore'
import {
  Card,
  Chip,
  EmptyState,
  GradientButton,
  Header,
  OutlinedInput,
  Screen,
  showToast,
} from '@/ui'

export function BookingScreen() {
  const navigate = useNavigate()
  const selectedPatientId = useAppStore((s) => s.selectedPatientId)
  const patients = useAppStore((s) => s.patients)
  const setBookingDraft = useAppStore((s) => s.setBookingDraft)
  const patient = patients.find((p) => p.id === selectedPatientId)

  const [service, setService] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [duration, setDuration] = useState('2')
  const [address, setAddress] = useState('Riyadh, Al Olaya Dist.')
  const [notes, setNotes] = useState('')

  if (!patient) {
    return (
      <Screen>
        <EmptyState title="Select a patient first" message="Unlock a patient profile to book care." />
        <GradientButton onClick={() => navigate('/patient/select')}>Select patient</GradientButton>
      </Screen>
    )
  }

  return (
    <Screen>
      <h1 className="mb-1 text-2xl font-extrabold text-ink">Book care</h1>
      <p className="mb-4 text-sm text-muted">For {patient.name}</p>
      <Card className="space-y-3">
        <div>
          <p className="mb-2 text-sm font-semibold">Service</p>
          <div className="flex flex-wrap gap-2">
            {SERVICES.map((s) => (
              <Chip key={s} active={service === s} onClick={() => setService(s)}>
                {s}
              </Chip>
            ))}
          </div>
        </div>
        <OutlinedInput label="Date" type="date" value={date} onChange={setDate} icon={<Clock size={16} />} />
        <OutlinedInput label="Time" type="time" value={time} onChange={setTime} />
        <OutlinedInput label="Duration (hours)" value={duration} onChange={setDuration} type="number" />
        <OutlinedInput label="Address" value={address} onChange={setAddress} icon={<MapPin size={16} />} />
        <OutlinedInput label="Notes" value={notes} onChange={setNotes} icon={<Stethoscope size={16} />} />
        <GradientButton
          showArrow
          onClick={() => {
            if (!service || !date || !time) {
              showToast({ type: 'danger', message: 'Service, date and time required' })
              return
            }
            setBookingDraft({
              patientId: patient.id,
              patientName: patient.name,
              service,
              date,
              time,
              durationHours: Number(duration) || 2,
              address,
              notes,
            })
            navigate('/patient/booking/find')
          }}
        >
          Find nurses
        </GradientButton>
      </Card>
    </Screen>
  )
}

export function FindNurseScreen() {
  const navigate = useNavigate()
  const nurses = useAppStore((s) => s.nurses)
  const draft = useAppStore((s) => s.bookingDraft)
  const setBookingDraft = useAppStore((s) => s.setBookingDraft)

  return (
    <Screen>
      <Header title="Find a nurse" subtitle={draft?.service} />
      <div className="space-y-3">
        {nurses
          .filter((n) => n.available && (!draft?.service || n.services.includes(draft.service)))
          .map((n) => (
            <Card
              key={n.id}
              onClick={() => {
                setBookingDraft({
                  patientId: draft!.patientId,
                  patientName: draft!.patientName,
                  nurseId: n.id,
                  nurseName: n.name,
                  amount: n.rate * (draft?.durationHours || 2),
                })
                navigate('/patient/booking/summary')
              }}
            >
              <div className="flex gap-3">
                <img src={n.avatar} alt="" className="h-14 w-14 rounded-2xl bg-mist object-contain p-1" />
                <div className="flex-1">
                  <p className="font-extrabold text-ink">{n.name}</p>
                  <p className="text-xs text-muted">
                    {n.specialty} · ★ {n.rating} · {n.experienceYears} yrs
                  </p>
                  <p className="mt-1 text-sm font-bold text-seafoam">
                    {formatCurrency(n.rate)}/hr
                  </p>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </Screen>
  )
}

export function BookingSummaryScreen() {
  const navigate = useNavigate()
  const draft = useAppStore((s) => s.bookingDraft)
  if (!draft) {
    return (
      <Screen>
        <EmptyState title="No booking draft" />
        <GradientButton onClick={() => navigate('/patient/booking')}>Start booking</GradientButton>
      </Screen>
    )
  }
  return (
    <Screen>
      <Header title="Summary" />
      <Card className="space-y-2">
        <Row label="Patient" value={draft.patientName} />
        <Row label="Nurse" value={draft.nurseName || '—'} />
        <Row label="Service" value={draft.service} />
        <Row label="When" value={`${draft.date} ${draft.time}`} />
        <Row label="Duration" value={`${draft.durationHours}h`} />
        <Row label="Address" value={draft.address} />
        <Row label="Total" value={formatCurrency(draft.amount || 0)} />
        <GradientButton className="mt-3" showArrow onClick={() => navigate('/patient/booking/payment')}>
          Continue to payment
        </GradientButton>
      </Card>
    </Screen>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/60 py-2 last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-right text-sm font-bold text-ink">{value}</span>
    </div>
  )
}

export function PaymentScreen() {
  const navigate = useNavigate()
  const draft = useAppStore((s) => s.bookingDraft)
  const payFromWallet = useAppStore((s) => s.payFromWallet)
  const createBookingFromDraft = useAppStore((s) => s.createBookingFromDraft)
  const balance = useAppStore((s) => s.walletBalance)
  const amount = draft?.amount || 0

  return (
    <Screen>
      <Header title="Payment" />
      <Card className="space-y-4">
        <div className="rounded-2xl bg-mist p-4">
          <p className="text-xs text-muted">Amount due</p>
          <p className="text-2xl font-extrabold text-ink">{formatCurrency(amount)}</p>
          <p className="mt-1 text-xs text-muted">Wallet balance: {formatCurrency(balance)}</p>
        </div>
        <GradientButton
          onClick={() => {
            if (!payFromWallet(amount, `Booking — ${draft?.nurseName}`)) {
              showToast({ type: 'danger', message: 'Insufficient wallet balance' })
              navigate('/patient/booking/wallet')
              return
            }
            createBookingFromDraft()
            showToast({ type: 'success', message: 'Booking submitted' })
            navigate('/patient/booking/completed')
          }}
        >
          Pay with wallet
        </GradientButton>
        <GradientButton variant="secondary" onClick={() => navigate('/patient/booking/wallet')}>
          Top up wallet
        </GradientButton>
        <GradientButton variant="outline" onClick={() => navigate('/patient/booking/initial-payment')}>
          Pay with card (demo)
        </GradientButton>
      </Card>
    </Screen>
  )
}

export function WalletTopUpScreen() {
  const navigate = useNavigate()
  const topUp = useAppStore((s) => s.topUpWallet)
  const balance = useAppStore((s) => s.walletBalance)
  return (
    <Screen>
      <Header title="Wallet" />
      <Card>
        <p className="text-sm text-muted">Current balance</p>
        <p className="mb-4 text-3xl font-extrabold text-seafoam">{formatCurrency(balance)}</p>
        <div className="grid grid-cols-3 gap-2">
          {[200, 500, 1000].map((a) => (
            <GradientButton
              key={a}
              variant="secondary"
              onClick={() => {
                topUp(a)
                showToast({ type: 'success', message: `Added ${formatCurrency(a)}` })
              }}
            >
              +{a}
            </GradientButton>
          ))}
        </div>
        <GradientButton className="mt-4" onClick={() => navigate(-1)}>
          Done
        </GradientButton>
      </Card>
    </Screen>
  )
}

export function InitialPaymentScreen() {
  const navigate = useNavigate()
  const createBookingFromDraft = useAppStore((s) => s.createBookingFromDraft)
  return (
    <Screen>
      <Header title="Card payment" />
      <Card className="space-y-3">
        <p className="text-sm text-muted">Demo card form — no real charge.</p>
        <OutlinedInput label="Card number" value="4242 4242 4242 4242" onChange={() => {}} />
        <div className="grid grid-cols-2 gap-3">
          <OutlinedInput label="Expiry" value="12/28" onChange={() => {}} />
          <OutlinedInput label="CVC" value="123" onChange={() => {}} />
        </div>
        <GradientButton
          onClick={() => {
            createBookingFromDraft()
            showToast({ type: 'success', message: 'Payment successful (demo)' })
            navigate('/patient/booking/completed')
          }}
        >
          Pay now
        </GradientButton>
      </Card>
    </Screen>
  )
}

export function BookingCompletedScreen() {
  const navigate = useNavigate()
  return (
    <Screen className="items-center justify-center text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-mist text-4xl">
        ✓
      </div>
      <h2 className="text-2xl font-extrabold text-ink">Booking complete</h2>
      <p className="mt-2 text-sm text-muted">
        Your nurse request has been sent. Track it under Appointments.
      </p>
      <GradientButton className="mt-6" onClick={() => navigate('/patient/appointments')}>
        View appointments
      </GradientButton>
      <GradientButton className="mt-2" variant="ghost" onClick={() => navigate('/patient/booking/another')}>
        Add another booking
      </GradientButton>
      <GradientButton className="mt-2" variant="secondary" onClick={() => navigate('/patient/booking/suggest')}>
        Suggest a nurse
      </GradientButton>
    </Screen>
  )
}

export function AddAnotherBookingScreen() {
  const navigate = useNavigate()
  return (
    <Screen>
      <Header title="Another booking" />
      <Card>
        <p className="mb-4 text-sm text-muted">Start a new booking for the same or another patient.</p>
        <GradientButton onClick={() => navigate('/patient/booking')}>New booking</GradientButton>
      </Card>
    </Screen>
  )
}

export function NurseSuggestionScreen() {
  const navigate = useNavigate()
  const nurses = useAppStore((s) => s.nurses)
  return (
    <Screen>
      <Header title="Suggested nurses" />
      <div className="space-y-3">
        {nurses.slice(0, 3).map((n) => (
          <Card key={n.id}>
            <p className="font-extrabold text-ink">{n.name}</p>
            <p className="text-xs text-muted">{n.bio}</p>
            <GradientButton
              className="mt-3"
              variant="secondary"
              onClick={() => {
                showToast({ type: 'success', message: `Interest sent to ${n.name}` })
                navigate(-1)
              }}
            >
              Request {n.name.split(' ')[0]}
            </GradientButton>
          </Card>
        ))}
      </div>
    </Screen>
  )
}

export function PatientWalletScreen() {
  const navigate = useNavigate()
  const balance = useAppStore((s) => s.walletBalance)
  const txs = useAppStore((s) => s.walletTxs)
  const topUp = useAppStore((s) => s.topUpWallet)
  return (
    <Screen>
      <Header title="Wallet" />
      <Card className="mb-4 gradient-hero !border-0 text-white">
        <p className="text-sm text-white/80">Available balance</p>
        <p className="text-3xl font-extrabold">{formatCurrency(balance)}</p>
        <img src="/images/wallet.png" alt="" className="mt-2 h-10 object-contain opacity-90" />
      </Card>
      <div className="mb-4 grid grid-cols-3 gap-2">
        {[200, 500, 1000].map((a) => (
          <GradientButton key={a} variant="secondary" onClick={() => topUp(a)}>
            +{a}
          </GradientButton>
        ))}
      </div>
      <h3 className="mb-2 text-sm font-extrabold">Transactions</h3>
      <div className="space-y-2">
        {txs.map((t) => (
          <Card key={t.id} padding className="!py-3">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-bold text-ink">{t.label}</p>
                <p className="text-xs text-muted">{new Date(t.at).toLocaleDateString()}</p>
              </div>
              <p className={`font-extrabold ${t.type === 'credit' ? 'text-seafoam' : 'text-coral'}`}>
                {t.type === 'credit' ? '+' : '-'}
                {formatCurrency(t.amount)}
              </p>
            </div>
          </Card>
        ))}
      </div>
      <GradientButton className="mt-4" variant="ghost" onClick={() => navigate(-1)}>
        Back
      </GradientButton>
    </Screen>
  )
}
