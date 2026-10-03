import { Clock, MapPin, Stethoscope } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  const selectedPatientId = useAppStore((s) => s.selectedPatientId)
  const patients = useAppStore((s) => s.patients)
  const draft = useAppStore((s) => s.bookingDraft)
  const setBookingDraft = useAppStore((s) => s.setBookingDraft)
  const patient = patients.find((p) => p.id === selectedPatientId)
  const reschedule = Boolean(draft?.lockNurse)

  const [service, setService] = useState(draft?.service || '')
  const [date, setDate] = useState(draft?.date || '')
  const [time, setTime] = useState(draft?.time || '')
  const [duration, setDuration] = useState(String(draft?.durationHours || 2))
  const [address, setAddress] = useState(draft?.address || 'Riyadh, Al Olaya Dist.')
  const [notes, setNotes] = useState(draft?.notes || '')

  if (!patient) {
    return (
      <Screen>
        <EmptyState title={t('empty.selectPatientFirst')} message={t('empty.selectPatientHint')} />
        <GradientButton onClick={() => navigate('/patient/select')}>
          {t('patientDash.selectPatient')}
        </GradientButton>
      </Screen>
    )
  }

  return (
    <Screen>
      <h1 className="mb-1 text-2xl font-extrabold text-ink">
        {reschedule ? t('booking.rescheduleTitle') : t('booking.title')}
      </h1>
      <p className="mb-4 text-sm text-muted">
        {t('booking.for', { name: patient.name })}
        {reschedule && draft?.nurseName ? ` · ${draft.nurseName}` : ''}
      </p>
      <Card className="space-y-3">
        <div>
          <p className="mb-2 text-sm font-semibold">{t('booking.service')}</p>
          <div className="flex flex-wrap gap-2">
            {SERVICES.map((s) => (
              <Chip key={s} active={service === s} onClick={() => setService(s)}>
                {s}
              </Chip>
            ))}
          </div>
        </div>
        <OutlinedInput
          label={t('booking.date')}
          type="date"
          value={date}
          onChange={setDate}
          icon={<Clock size={16} />}
        />
        <OutlinedInput label={t('booking.time')} type="time" value={time} onChange={setTime} />
        <OutlinedInput
          label={t('booking.duration')}
          value={duration}
          onChange={setDuration}
          type="number"
        />
        <OutlinedInput
          label={t('booking.address')}
          value={address}
          onChange={setAddress}
          icon={<MapPin size={16} />}
        />
        <OutlinedInput
          label={t('booking.notes')}
          value={notes}
          onChange={setNotes}
          icon={<Stethoscope size={16} />}
        />
        <GradientButton
          showArrow
          onClick={() => {
            if (!service || !date || !time) {
              showToast({ type: 'danger', message: t('booking.required') })
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
              ...(reschedule
                ? {
                    nurseId: draft?.nurseId,
                    nurseName: draft?.nurseName,
                    lockNurse: true,
                    amount: draft?.amount,
                  }
                : { lockNurse: false, nurseId: undefined, nurseName: undefined }),
            })
            navigate(reschedule ? '/patient/booking/summary' : '/patient/booking/find')
          }}
        >
          {reschedule ? t('booking.reviewRequest') : t('booking.findNurses')}
        </GradientButton>
      </Card>
    </Screen>
  )
}

export function FindNurseScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const nurses = useAppStore((s) => s.nurses)
  const draft = useAppStore((s) => s.bookingDraft)
  const setBookingDraft = useAppStore((s) => s.setBookingDraft)

  if (!draft) {
    return (
      <Screen>
        <Header title={t('booking.findTitle')} />
        <EmptyState title={t('booking.startBookingFirst')} />
        <GradientButton onClick={() => navigate('/patient/booking')}>{t('booking.title')}</GradientButton>
      </Screen>
    )
  }

  const hireable = nurses.filter(
    (n) =>
      n.available &&
      n.profileComplete &&
      (!draft?.service || n.services.includes(draft.service)),
  )

  return (
    <Screen>
      <Header title={t('booking.findTitle')} subtitle={draft?.service} />
      {hireable.length === 0 ? (
        <EmptyState title={t('booking.noNurses')} message={t('booking.noNursesHint')} />
      ) : (
        <div className="space-y-3">
          {hireable.map((n) => (
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
                    {formatCurrency(n.rate)}
                    {t('booking.perHour')}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Screen>
  )
}

export function BookingSummaryScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const draft = useAppStore((s) => s.bookingDraft)
  const nurses = useAppStore((s) => s.nurses)
  const createBookingFromDraft = useAppStore((s) => s.createBookingFromDraft)
  if (!draft) {
    return (
      <Screen>
        <EmptyState title={t('empty.noBookingDraft')} />
        <GradientButton onClick={() => navigate('/patient/booking')}>{t('booking.startBooking')}</GradientButton>
      </Screen>
    )
  }
  const nurse = nurses.find((n) => n.id === draft.nurseId)
  const total = nurse ? nurse.rate * (draft.durationHours || 2) : draft.amount || 0
  return (
    <Screen>
      <Header title={t('booking.summary')} />
      <Card className="space-y-2">
        <Row label={t('booking.patient')} value={draft.patientName} />
        <Row label={t('booking.nurse')} value={draft.nurseName || '—'} />
        <Row label={t('booking.service')} value={draft.service} />
        <Row label={t('booking.when')} value={`${draft.date} ${draft.time}`} />
        <Row label={t('booking.duration')} value={t('booking.hoursShort', { count: draft.durationHours })} />
        <Row label={t('booking.address')} value={draft.address} />
        <Row label={t('booking.total')} value={formatCurrency(total)} />
        <p className="pt-2 text-xs text-muted">{t('booking.payAfterAccept')}</p>
        <GradientButton
          className="mt-3"
          showArrow
          onClick={() => {
            const id = createBookingFromDraft()
            if (!id) {
              showToast({ type: 'danger', message: t('booking.couldNotSend') })
              return
            }
            showToast({ type: 'success', message: t('booking.waitingApproval') })
            navigate('/patient/booking/completed')
          }}
        >
          {t('booking.sendRequest')}
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
  const { t } = useTranslation()
  const { bookingId } = useParams()
  const bookings = useAppStore((s) => s.bookings)
  const payBooking = useAppStore((s) => s.payBooking)
  const balance = useAppStore((s) => s.walletBalance)
  const booking = bookings.find((b) => b.id === bookingId)
  const amount = booking?.amount || 0

  if (!booking || booking.status !== 'awaiting_payment') {
    return (
      <Screen>
        <Header title={t('booking.payment')} />
        <EmptyState title={t('booking.nothingToPay')} message={t('booking.nothingToPayHint')} />
        <GradientButton onClick={() => navigate('/patient/appointments')}>
          {t('booking.viewRequests')}
        </GradientButton>
      </Screen>
    )
  }

  return (
    <Screen>
      <Header title={t('booking.payment')} />
      <Card className="space-y-4">
        <div className="rounded-2xl bg-mist p-4">
          <p className="text-xs text-muted">{t('booking.amountDue')}</p>
          <p className="text-2xl font-extrabold text-ink">{formatCurrency(amount)}</p>
          <p className="mt-1 text-xs text-muted">
            {t('booking.walletBalance', { amount: formatCurrency(balance) })}
          </p>
          <p className="mt-2 text-sm font-semibold text-ink">
            {booking.service} · {booking.nurseName}
          </p>
          <p className="text-xs text-muted">
            {booking.date} {booking.time}
          </p>
        </div>
        <GradientButton
          onClick={() => {
            if (!payBooking(booking.id, 'wallet')) {
              showToast({ type: 'danger', message: t('booking.insufficient') })
              navigate('/patient/booking/wallet')
              return
            }
            showToast({ type: 'success', message: t('booking.paymentReceived') })
            navigate('/patient/booking/confirmed')
          }}
        >
          {t('booking.payWallet')}
        </GradientButton>
        <GradientButton variant="secondary" onClick={() => navigate('/patient/booking/wallet')}>
          {t('booking.topUp')}
        </GradientButton>
        <GradientButton
          variant="outline"
          onClick={() => navigate(`/patient/booking/payment/${booking.id}/card`)}
        >
          {t('booking.payCard')}
        </GradientButton>
      </Card>
    </Screen>
  )
}

export function WalletTopUpScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const topUp = useAppStore((s) => s.topUpWallet)
  const balance = useAppStore((s) => s.walletBalance)
  return (
    <Screen>
      <Header title={t('booking.walletTitle')} />
      <Card>
        <p className="text-sm text-muted">{t('booking.currentBalance')}</p>
        <p className="mb-4 text-3xl font-extrabold text-seafoam">{formatCurrency(balance)}</p>
        <div className="grid grid-cols-3 gap-2">
          {[200, 500, 1000].map((a) => (
            <GradientButton
              key={a}
              variant="secondary"
              onClick={() => {
                topUp(a)
                showToast({ type: 'success', message: t('booking.added', { amount: formatCurrency(a) }) })
              }}
            >
              +{a}
            </GradientButton>
          ))}
        </div>
        <GradientButton className="mt-4" onClick={() => navigate(-1)}>
          {t('common.done')}
        </GradientButton>
      </Card>
    </Screen>
  )
}

export function InitialPaymentScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { bookingId } = useParams()
  const payBooking = useAppStore((s) => s.payBooking)
  const booking = useAppStore((s) => s.bookings.find((b) => b.id === bookingId))

  return (
    <Screen>
      <Header title={t('booking.cardTitle')} />
      <Card className="space-y-3">
        <p className="text-sm text-muted">{t('booking.cardDemo')}</p>
        {booking && (
          <p className="text-sm font-bold text-ink">
            {booking.service} · {formatCurrency(booking.amount)}
          </p>
        )}
        <OutlinedInput label={t('booking.cardNumber')} value="4242 4242 4242 4242" onChange={() => {}} />
        <div className="grid grid-cols-2 gap-3">
          <OutlinedInput label={t('booking.expiry')} value="12/28" onChange={() => {}} />
          <OutlinedInput label={t('booking.cvc')} value="123" onChange={() => {}} />
        </div>
        <GradientButton
          onClick={() => {
            if (!bookingId || !payBooking(bookingId, 'card')) {
              showToast({ type: 'danger', message: t('booking.payAfterApprovalOnly') })
              return
            }
            showToast({ type: 'success', message: t('booking.cardPaySuccess') })
            navigate('/patient/booking/confirmed')
          }}
        >
          {t('booking.payNow')}
        </GradientButton>
      </Card>
    </Screen>
  )
}

export function BookingCompletedScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <Screen className="items-center justify-center text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-mist text-4xl">
        ✓
      </div>
      <h2 className="text-2xl font-extrabold text-ink">{t('booking.requestSentTitle')}</h2>
      <p className="mt-2 text-sm text-muted">{t('booking.requestSentLead')}</p>
      <GradientButton className="mt-6" onClick={() => navigate('/patient/appointments')}>
        {t('booking.viewRequests')}
      </GradientButton>
      <GradientButton className="mt-2" variant="ghost" onClick={() => navigate('/patient/booking/another')}>
        {t('booking.another')}
      </GradientButton>
    </Screen>
  )
}

export function BookingConfirmedScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <Screen className="items-center justify-center text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-mist text-4xl">
        ✓
      </div>
      <h2 className="text-2xl font-extrabold text-ink">{t('booking.confirmedTitle')}</h2>
      <p className="mt-2 text-sm text-muted">{t('booking.confirmedLead')}</p>
      <GradientButton className="mt-6" onClick={() => navigate('/patient/appointments')}>
        {t('booking.viewAppts')}
      </GradientButton>
    </Screen>
  )
}

export function AddAnotherBookingScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <Screen>
      <Header title={t('booking.anotherTitle')} />
      <Card>
        <p className="mb-4 text-sm text-muted">{t('booking.anotherLead')}</p>
        <GradientButton onClick={() => navigate('/patient/booking')}>{t('booking.newBooking')}</GradientButton>
      </Card>
    </Screen>
  )
}

export function NurseSuggestionScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const nurses = useAppStore((s) => s.nurses)
  return (
    <Screen>
      <Header title={t('booking.suggestTitle')} />
      <div className="space-y-3">
        {nurses
          .filter((n) => n.available && n.profileComplete)
          .slice(0, 3)
          .map((n) => (
            <Card key={n.id}>
              <p className="font-extrabold text-ink">{n.name}</p>
              <p className="text-xs text-muted">{n.bio}</p>
              <GradientButton
                className="mt-3"
                variant="secondary"
                onClick={() => {
                  showToast({ type: 'success', message: t('booking.interestSent', { name: n.name }) })
                  navigate(-1)
                }}
              >
                {t('booking.request', { name: n.name.split(' ')[0] })}
              </GradientButton>
            </Card>
          ))}
      </div>
    </Screen>
  )
}

export function PatientWalletScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const balance = useAppStore((s) => s.walletBalance)
  const txs = useAppStore((s) => s.walletTxs)
  const topUp = useAppStore((s) => s.topUpWallet)
  return (
    <Screen>
      <Header title={t('booking.walletTitle')} />
      <Card className="mb-4 gradient-hero !border-0 text-white">
        <p className="text-sm text-white/80">{t('booking.available')}</p>
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
      <h3 className="mb-2 text-sm font-extrabold">{t('booking.transactions')}</h3>
      <div className="space-y-2">
        {txs.map((tx) => (
          <Card key={tx.id} padding className="!py-3">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-bold text-ink">{tx.label}</p>
                <p className="text-xs text-muted">{new Date(tx.at).toLocaleDateString()}</p>
              </div>
              <p className={`font-extrabold ${tx.type === 'credit' ? 'text-seafoam' : 'text-coral'}`}>
                {tx.type === 'credit' ? '+' : '-'}
                {formatCurrency(tx.amount)}
              </p>
            </div>
          </Card>
        ))}
      </div>
      <GradientButton className="mt-4" variant="ghost" onClick={() => navigate(-1)}>
        {t('common.back')}
      </GradientButton>
    </Screen>
  )
}
