import { Star } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { setAppLanguage } from '@/i18n'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'
import { useAppStore } from '@/store/appStore'
import {
  Card,
  Chip,
  EmptyState,
  GradientButton,
  Header,
  LanguageToggle,
  OutlinedInput,
  Screen,
  showToast,
} from '@/ui'

export function PatientAppointmentsScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const selectedPatientId = useAppStore((s) => s.selectedPatientId)
  const appointments = useAppStore((s) => s.appointments)
  const [tab, setTab] = useState<'ongoing' | 'upcoming' | 'completed' | 'cancelled'>('ongoing')
  const list = appointments.filter(
    (a) => a.status === tab && (!selectedPatientId || a.patientId === selectedPatientId),
  )
  const ongoingCount = appointments.filter(
    (a) => a.status === 'ongoing' && (!selectedPatientId || a.patientId === selectedPatientId),
  ).length

  return (
    <Screen>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold text-ink">{t('appointments.title')}</h1>
        <LanguageToggle compact />
      </div>
      {ongoingCount > 0 && tab !== 'ongoing' && (
        <button
          type="button"
          onClick={() => setTab('ongoing')}
          className="mb-3 w-full rounded-2xl border border-coral/30 bg-[#FDF0EB] px-4 py-3 text-left"
        >
          <p className="text-xs font-bold uppercase tracking-wide text-coral">{t('status.liveNow')}</p>
          <p className="text-sm font-extrabold text-ink">{t('appointments.liveBannerPatient')}</p>
        </button>
      )}
      <div className="mb-4 flex flex-wrap gap-2">
        {(['ongoing', 'upcoming', 'completed', 'cancelled'] as const).map((tabKey) => (
          <Chip
            key={tabKey}
            active={tab === tabKey}
            onClick={() => setTab(tabKey)}
            tone={tabKey === 'ongoing' ? 'coral' : 'seafoam'}
          >
            {t(`status.${tabKey}`)}
          </Chip>
        ))}
      </div>
      {list.length === 0 ? (
        <EmptyState
          title={t('appointments.noTab', { tab: t(`status.${tab}`) })}
          message={
            tab === 'ongoing' ? t('empty.noOngoingPatient') : t('empty.defaultMessage')
          }
        />
      ) : (
        <div className="space-y-3">
          {list.map((a) => (
            <Card key={a.id} onClick={() => navigate(`/patient/appointments/${a.id}`)}>
              {a.status === 'ongoing' && (
                <span className="mb-1 inline-flex rounded-full bg-coral/15 px-2 py-0.5 text-[10px] font-bold uppercase text-coral">
                  {t('status.ongoingBadge')}
                </span>
              )}
              <p className="font-extrabold text-ink">{a.service}</p>
              <p className="text-xs text-muted">
                {a.nurseName} · {a.date} {a.time}
              </p>
              <p className="mt-1 text-sm font-bold text-seafoam">{formatCurrency(a.amount)}</p>
            </Card>
          ))}
        </div>
      )}
    </Screen>
  )
}

export function PatientAppointmentInfoScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const appointment = useAppStore((s) => s.appointments.find((a) => a.id === id))
  const ensureChatWith = useAppStore((s) => s.ensureChatWith)

  if (!appointment) {
    return (
      <Screen>
        <Header title="Appointment" />
        <EmptyState title="Not found" />
      </Screen>
    )
  }

  return (
    <Screen>
      <Header title="Details" />
      <Card className="space-y-2">
        {appointment.status === 'ongoing' && (
          <span className="inline-flex rounded-full bg-coral/15 px-2.5 py-1 text-[11px] font-bold uppercase text-coral">
            Visit in progress
          </span>
        )}
        <p className="text-xl font-extrabold text-ink">{appointment.service}</p>
        <p className="text-sm text-muted">{appointment.nurseName}</p>
        <p className="text-sm text-muted">
          {appointment.date} · {appointment.time}
        </p>
        <p className="text-sm text-muted">{appointment.address}</p>
        <p className="font-extrabold text-seafoam">{formatCurrency(appointment.amount)}</p>
        {appointment.startedAt && appointment.status === 'ongoing' && (
          <p className="text-xs font-semibold text-coral">
            Nurse started at{' '}
            {new Date(appointment.startedAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}

        {appointment.status === 'ongoing' && (
          <div className="rounded-2xl bg-mist p-3 text-sm text-ink">
            <p className="font-bold">Current visit</p>
            <p className="mt-1 text-xs text-muted">
              Your nurse is on site. Message them anytime. You’ll be able to leave a review once
              they complete the visit.
            </p>
            {appointment.checklist && (
              <p className="mt-2 text-xs font-semibold text-seafoam">
                Progress:{' '}
                {
                  [
                    appointment.checklist.identity,
                    appointment.checklist.medications,
                    appointment.checklist.vitals,
                    appointment.checklist.notes,
                  ].filter(Boolean).length
                }
                /4 checklist steps
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-2">
          <GradientButton
            variant="secondary"
            onClick={() => {
              const chatId = ensureChatWith(appointment.nurseId, appointment.nurseName, 'Nurse')
              navigate(`/patient/messages/${chatId}`)
            }}
          >
            Message
          </GradientButton>
          <GradientButton
            variant="outline"
            onClick={() => navigate(`/patient/appointments/${id}/inner`)}
          >
            More
          </GradientButton>
        </div>
        {appointment.status === 'upcoming' && (
          <GradientButton
            variant="danger"
            onClick={() => navigate(`/patient/appointments/${id}/cancel`)}
          >
            Cancel
          </GradientButton>
        )}
        {appointment.status === 'completed' && !appointment.rating && (
          <GradientButton
            variant="secondary"
            onClick={() => navigate(`/patient/appointments/${id}/review`)}
          >
            Leave review
          </GradientButton>
        )}
        {appointment.rating && (
          <p className="text-sm font-semibold text-muted">
            Your rating: {'★'.repeat(appointment.rating)}
          </p>
        )}
      </Card>
    </Screen>
  )
}

export function InnerBookingScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const appointment = useAppStore((s) => s.appointments.find((a) => a.id === id))
  const checklist = appointment?.checklist

  return (
    <Screen>
      <Header title="Visit details" />
      <Card>
        <p className="font-extrabold text-ink">{appointment?.service}</p>
        <p className="mt-1 text-sm text-muted">With {appointment?.nurseName}</p>
        {appointment?.status === 'ongoing' ? (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-bold text-coral">Visit in progress</p>
            <p className="text-sm text-muted">
              The nurse is working through the care checklist. Progress updates as they check items
              off.
            </p>
            {checklist && (
              <ul className="mt-2 space-y-1.5 text-sm">
                {[
                  ['identity', 'Patient identity'],
                  ['medications', 'Medications'],
                  ['vitals', 'Vitals'],
                  ['notes', 'Care notes'],
                ].map(([key, label]) => (
                  <li key={key} className="flex items-center gap-2 text-ink">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                        checklist[key as keyof typeof checklist]
                          ? 'bg-seafoam text-white'
                          : 'border border-border text-muted'
                      }`}
                    >
                      {checklist[key as keyof typeof checklist] ? '✓' : ''}
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted">
            Full visit information and care notes appear here once the visit is active.
          </p>
        )}
        <GradientButton className="mt-4" onClick={() => navigate(`/patient/appointments/${id}`)}>
          Back to appointment
        </GradientButton>
      </Card>
    </Screen>
  )
}

export function PatientCancelReasonScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const cancelAppointment = useAppStore((s) => s.cancelAppointment)
  const [reason, setReason] = useState('')
  return (
    <Screen>
      <Header title="Cancel visit" />
      <Card className="space-y-3">
        <OutlinedInput label="Reason" value={reason} onChange={setReason} placeholder="Why cancel?" />
        <GradientButton
          variant="danger"
          onClick={() => {
            if (!reason.trim()) {
              showToast({ type: 'danger', message: 'Please provide a reason' })
              return
            }
            cancelAppointment(id!, reason)
            showToast({ type: 'success', message: 'Appointment cancelled' })
            navigate('/patient/appointments')
          }}
        >
          Confirm cancel
        </GradientButton>
      </Card>
    </Screen>
  )
}

export function AppointmentReviewScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const reviewAppointment = useAppStore((s) => s.reviewAppointment)
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  return (
    <Screen>
      <Header title="Review" />
      <Card className="space-y-4">
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setRating(n)} className="text-coral">
              <Star size={28} fill={n <= rating ? '#E8846B' : 'transparent'} />
            </button>
          ))}
        </div>
        <OutlinedInput label="Your review" value={review} onChange={setReview} />
        <GradientButton
          onClick={() => {
            reviewAppointment(id!, rating, review)
            showToast({ type: 'success', message: 'Thanks for your feedback' })
            navigate('/patient/appointments')
          }}
        >
          Submit review
        </GradientButton>
      </Card>
    </Screen>
  )
}

export function PatientAppointmentSelectionScreen() {
  const navigate = useNavigate()
  return (
    <Screen>
      <Header title="Select appointment" />
      <Card>
        <p className="mb-3 text-sm text-muted">Pick from your appointments list.</p>
        <GradientButton onClick={() => navigate('/patient/appointments')}>Open list</GradientButton>
      </Card>
    </Screen>
  )
}

export function PatientChatScreen() {
  const navigate = useNavigate()
  const chats = useAppStore((s) => s.chats)
  const nurseChats = chats.filter((c) => c.peerRole === 'Nurse')

  return (
    <Screen>
      <h1 className="mb-4 text-2xl font-extrabold text-ink">Messages</h1>
      {nurseChats.length === 0 ? (
        <EmptyState title="No conversations" message="Message a nurse from an appointment." />
      ) : (
        <div className="space-y-2">
          {nurseChats.map((c) => (
            <Card key={c.id} onClick={() => navigate(`/patient/messages/${c.id}`)}>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-mist font-bold text-seafoam">
                  {c.peerName[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold text-ink">{c.peerName}</p>
                  <p className="truncate text-xs text-muted">{c.lastMessage || 'Start chatting'}</p>
                </div>
                <span className="text-[10px] text-muted">{formatRelativeTime(c.updatedAt)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Screen>
  )
}

export function PatientChatMessageScreen() {
  const { id } = useParams()
  const chat = useAppStore((s) => s.chats.find((c) => c.id === id))
  const user = useAppStore((s) => s.user)
  const sendMessage = useAppStore((s) => s.sendMessage)
  const [text, setText] = useState('')

  if (!chat) {
    return (
      <Screen>
        <Header title="Chat" />
        <EmptyState title="Thread not found" />
      </Screen>
    )
  }

  return (
    <Screen scroll={false} padded={false} className="!p-0">
      <div className="flex h-full flex-col">
        <div className="border-b border-border bg-white/90 px-4 pt-2">
          <Header title={chat.peerName} className="mb-2" />
        </div>
        <div className="phone-scroll flex-1 space-y-2 overflow-y-auto px-4 py-3">
          {chat.messages.map((m) => {
            const mine = m.senderId === user?.id
            return (
              <div
                key={m.id}
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  mine
                    ? 'ml-auto gradient-primary text-white'
                    : 'mr-auto bg-white text-ink border border-border'
                }`}
              >
                {m.text}
              </div>
            )
          })}
        </div>
        <div className="flex gap-2 border-t border-border bg-white p-3">
          <input
            className="flex-1 rounded-2xl border border-border px-3 py-2 text-sm outline-none focus:border-seafoam"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && text.trim()) {
                sendMessage(chat.id, text)
                setText('')
              }
            }}
          />
          <GradientButton
            fullWidth={false}
            className="!px-4"
            onClick={() => {
              sendMessage(chat.id, text)
              setText('')
            }}
          >
            Send
          </GradientButton>
        </div>
      </div>
    </Screen>
  )
}

export function PatientProfileScreen() {
  const navigate = useNavigate()
  const user = useAppStore((s) => s.user)
  const patient = useAppStore((s) => {
    const id = s.selectedPatientId
    return s.patients.find((p) => p.id === id)
  })

  return (
    <Screen>
      <h1 className="mb-4 text-2xl font-extrabold text-ink">Profile</h1>
      <Card className="mb-4 text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-mist text-2xl font-extrabold text-seafoam">
          {(user?.name || 'U')[0]}
        </div>
        <p className="font-extrabold text-ink">{user?.name}</p>
        <p className="text-sm text-muted">{user?.email}</p>
        {patient && (
          <p className="mt-2 text-xs font-semibold text-seafoam">
            Viewing: {patient.name}
          </p>
        )}
      </Card>
      <GradientButton onClick={() => navigate('/patient/profile/update')}>
        Update patient info
      </GradientButton>
    </Screen>
  )
}

export function UpdatePatientScreen() {
  const navigate = useNavigate()
  const selectedPatientId = useAppStore((s) => s.selectedPatientId)
  const patient = useAppStore((s) => s.patients.find((p) => p.id === s.selectedPatientId))
  const updatePatient = useAppStore((s) => s.updatePatient)
  const [name, setName] = useState(patient?.name || '')
  const [condition, setCondition] = useState(patient?.condition || '')

  return (
    <Screen>
      <Header title="Update patient" />
      <Card className="space-y-3">
        <OutlinedInput label="Name" value={name} onChange={setName} />
        <OutlinedInput label="Condition / notes" value={condition} onChange={setCondition} />
        <GradientButton
          onClick={() => {
            if (selectedPatientId) {
              updatePatient(selectedPatientId, { name, condition })
              showToast({ type: 'success', message: 'Patient updated' })
              navigate(-1)
            }
          }}
        >
          Save
        </GradientButton>
      </Card>
    </Screen>
  )
}

export function SettingsScreen() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const isAr = i18n.language?.startsWith('ar')

  return (
    <Screen>
      <Header title={t('settings.title')} right={<LanguageToggle compact />} />
      <Card className="space-y-3">
        <ToggleRow label={t('settings.push')} />
        <ToggleRow label={t('settings.email')} />
        <button
          type="button"
          onClick={() => void setAppLanguage(isAr ? 'en' : 'ar')}
          className="flex w-full items-center justify-between py-2"
        >
          <span className="text-sm font-bold text-ink">{t('settings.arabicLang')}</span>
          <span
            className={`flex h-6 w-11 items-center rounded-full px-0.5 transition ${
              isAr ? 'justify-end bg-seafoam' : 'justify-start bg-border'
            }`}
          >
            <span className="h-5 w-5 rounded-full bg-white shadow" />
          </span>
        </button>
        <GradientButton variant="secondary" onClick={() => navigate('/patient/dashboard/plan')}>
          {t('settings.managePlan')}
        </GradientButton>
      </Card>
    </Screen>
  )
}

function ToggleRow({ label }: { label: string }) {
  const [on, setOn] = useState(true)
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className="flex w-full items-center justify-between py-2"
    >
      <span className="text-sm font-bold text-ink">{label}</span>
      <span
        className={`flex h-6 w-11 items-center rounded-full px-0.5 transition ${on ? 'bg-seafoam justify-end' : 'bg-border justify-start'}`}
      >
        <span className="h-5 w-5 rounded-full bg-white shadow" />
      </span>
    </button>
  )
}

export function UpdatePlanScreen() {
  const navigate = useNavigate()
  const activePlanId = useAppStore((s) => s.activePlanId)
  const setActivePlan = useAppStore((s) => s.setActivePlan)
  const plans = useAppStore((s) => s.getPlans())

  return (
    <Screen>
      <Header title="Update plan" />
      <div className="space-y-3">
        {plans.map((p) => (
          <Card
            key={p.id}
            onClick={() => {
              setActivePlan(p.id)
              showToast({ type: 'success', message: `Switched to ${p.name}` })
            }}
            className={activePlanId === p.id ? 'ring-2 ring-seafoam' : ''}
          >
            <div className="flex items-center gap-3">
              <img src={p.image} alt="" className="h-12 w-12 object-contain" />
              <div className="flex-1">
                <p className="font-extrabold text-ink">{p.name}</p>
                <p className="text-xs text-muted">{p.description}</p>
              </div>
              <p className="font-bold text-seafoam">{formatCurrency(p.price)}</p>
            </div>
          </Card>
        ))}
      </div>
      <GradientButton className="mt-4" variant="ghost" onClick={() => navigate(-1)}>
        Done
      </GradientButton>
    </Screen>
  )
}
