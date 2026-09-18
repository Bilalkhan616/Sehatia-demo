import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LANGUAGES, SERVICES, SHIFTS } from '@/data/seed'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'
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

export function NurseAppointmentsScreen() {
  const navigate = useNavigate()
  const appointments = useAppStore((s) => s.appointments)
  const [tab, setTab] = useState<'ongoing' | 'upcoming' | 'completed' | 'cancelled'>('ongoing')
  const list = appointments.filter((a) => a.status === tab)
  const ongoingCount = appointments.filter((a) => a.status === 'ongoing').length

  return (
    <Screen>
      <h1 className="mb-3 text-2xl font-extrabold text-ink">Appointments</h1>
      {ongoingCount > 0 && tab !== 'ongoing' && (
        <button
          type="button"
          onClick={() => setTab('ongoing')}
          className="mb-3 w-full rounded-2xl border border-seafoam/30 bg-mist px-4 py-3 text-left"
        >
          <p className="text-xs font-bold uppercase tracking-wide text-seafoam-deep">Live now</p>
          <p className="text-sm font-extrabold text-ink">
            {ongoingCount} ongoing visit{ongoingCount > 1 ? 's' : ''} — tap to open
          </p>
        </button>
      )}
      <div className="mb-4 flex flex-wrap gap-2">
        {(['ongoing', 'upcoming', 'completed', 'cancelled'] as const).map((t) => (
          <Chip key={t} active={tab === t} onClick={() => setTab(t)} tone={t === 'ongoing' ? 'coral' : 'seafoam'}>
            {t}
          </Chip>
        ))}
      </div>
      {list.length === 0 ? (
        <EmptyState
          title={`No ${tab} visits`}
          message={
            tab === 'ongoing'
              ? 'Start an upcoming visit to move it here.'
              : 'When something arrives, it will show up here.'
          }
        />
      ) : (
        <div className="space-y-3">
          {list.map((a) => (
            <Card key={a.id} onClick={() => navigate(`/nurse/appointments/${a.id}`)}>
              <div className="mb-1 flex items-center gap-2">
                {a.status === 'ongoing' && (
                  <span className="rounded-full bg-coral/15 px-2 py-0.5 text-[10px] font-bold uppercase text-coral">
                    Ongoing
                  </span>
                )}
              </div>
              <p className="font-extrabold text-ink">{a.service}</p>
              <p className="text-xs text-muted">
                {a.patientName} · {a.date} {a.time}
              </p>
              <p className="mt-1 font-bold text-seafoam">{formatCurrency(a.amount)}</p>
            </Card>
          ))}
        </div>
      )}
    </Screen>
  )
}

export function NurseAppointmentInfoScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const appointment = useAppStore((s) => s.appointments.find((a) => a.id === id))
  const ensureChatWith = useAppStore((s) => s.ensureChatWith)
  const startAppointment = useAppStore((s) => s.startAppointment)
  const completeAppointment = useAppStore((s) => s.completeAppointment)

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
      <Header title="Visit info" />
      <Card className="space-y-2">
        {appointment.status === 'ongoing' && (
          <span className="inline-flex rounded-full bg-coral/15 px-2.5 py-1 text-[11px] font-bold uppercase text-coral">
            Ongoing now
          </span>
        )}
        <p className="text-xl font-extrabold text-ink">{appointment.service}</p>
        <p className="text-sm text-muted">{appointment.patientName}</p>
        <p className="text-sm text-muted">
          {appointment.date} · {appointment.time}
        </p>
        <p className="text-sm text-muted">{appointment.address}</p>
        {appointment.startedAt && (
          <p className="text-xs font-semibold text-seafoam">
            Started {new Date(appointment.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}

        {appointment.status === 'upcoming' && (
          <GradientButton
            className="mt-2"
            showArrow
            onClick={() => {
              startAppointment(appointment.id)
              showToast({ type: 'success', message: 'Visit started — now ongoing' })
              navigate(`/nurse/appointments/${id}/inner`)
            }}
          >
            Start visit
          </GradientButton>
        )}

        {appointment.status === 'ongoing' && (
          <>
            <GradientButton
              className="mt-2"
              onClick={() => navigate(`/nurse/appointments/${id}/inner`)}
            >
              Open live checklist
            </GradientButton>
            <GradientButton
              variant="secondary"
              onClick={() => {
                completeAppointment(appointment.id)
                showToast({ type: 'success', message: 'Visit completed' })
                navigate('/nurse/appointments')
              }}
            >
              Complete visit
            </GradientButton>
          </>
        )}

        <div className="grid grid-cols-2 gap-2 pt-2">
          <GradientButton
            variant="outline"
            onClick={() => navigate(`/nurse/appointments/${id}/inner`)}
          >
            Details
          </GradientButton>
          <GradientButton
            variant="secondary"
            onClick={() => {
              const chatId = ensureChatWith(
                appointment.patientId,
                appointment.patientName,
                'AccountHolder',
              )
              navigate(`/nurse/messages/${chatId}`)
            }}
          >
            Chat
          </GradientButton>
        </div>
        {(appointment.status === 'upcoming' || appointment.status === 'ongoing') && (
          <GradientButton
            variant="danger"
            onClick={() => navigate(`/nurse/appointments/${id}/cancel`)}
          >
            Cancel visit
          </GradientButton>
        )}
      </Card>
    </Screen>
  )
}

export function InnerAppointmentScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const appointment = useAppStore((s) => s.appointments.find((a) => a.id === id))
  const toggleChecklistItem = useAppStore((s) => s.toggleChecklistItem)
  const startAppointment = useAppStore((s) => s.startAppointment)
  const completeAppointment = useAppStore((s) => s.completeAppointment)

  const checklist = appointment?.checklist ?? {
    identity: false,
    medications: false,
    vitals: false,
    notes: false,
  }
  const items: Array<{ key: keyof typeof checklist; label: string }> = [
    { key: 'identity', label: 'Confirm patient identity' },
    { key: 'medications', label: 'Review medications' },
    { key: 'vitals', label: 'Record vitals' },
    { key: 'notes', label: 'Update care notes' },
  ]
  const doneCount = items.filter((i) => checklist[i.key]).length

  return (
    <Screen>
      <Header title="Live visit" />
      <Card className="mb-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="font-extrabold text-ink">{appointment?.service}</p>
          {appointment?.status === 'ongoing' ? (
            <span className="rounded-full bg-coral/15 px-2 py-0.5 text-[10px] font-bold uppercase text-coral">
              Ongoing
            </span>
          ) : (
            <span className="rounded-full bg-mist px-2 py-0.5 text-[10px] font-bold uppercase text-seafoam">
              {appointment?.status}
            </span>
          )}
        </div>
        <p className="text-sm text-muted">{appointment?.patientName}</p>
        <p className="mt-2 text-xs font-semibold text-muted">
          Checklist {doneCount}/{items.length}
        </p>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-border">
          <div
            className="h-full gradient-primary transition-all"
            style={{ width: `${(doneCount / items.length) * 100}%` }}
          />
        </div>
      </Card>

      <Card className="space-y-2">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            disabled={appointment?.status !== 'ongoing'}
            onClick={() => appointment && toggleChecklistItem(appointment.id, item.key)}
            className="flex w-full items-center gap-3 rounded-2xl border border-border bg-white px-3 py-3 text-left disabled:opacity-60"
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                checklist[item.key]
                  ? 'bg-seafoam text-white'
                  : 'border border-border text-muted'
              }`}
            >
              {checklist[item.key] ? '✓' : ''}
            </span>
            <span className="text-sm font-bold text-ink">{item.label}</span>
          </button>
        ))}
      </Card>

      {appointment?.status === 'upcoming' && (
        <GradientButton
          className="mt-4"
          showArrow
          onClick={() => {
            startAppointment(appointment.id)
            showToast({ type: 'success', message: 'Visit started' })
          }}
        >
          Start visit to unlock checklist
        </GradientButton>
      )}

      {appointment?.status === 'ongoing' && (
        <GradientButton
          className="mt-4"
          onClick={() => {
            completeAppointment(appointment.id)
            showToast({ type: 'success', message: 'Visit completed' })
            navigate('/nurse/appointments')
          }}
        >
          Complete visit
        </GradientButton>
      )}

      {appointment?.status === 'completed' && (
        <GradientButton className="mt-4" variant="ghost" onClick={() => navigate(-1)}>
          Back
        </GradientButton>
      )}
    </Screen>
  )
}

export function NurseCancelReasonScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const cancelAppointment = useAppStore((s) => s.cancelAppointment)
  const [reason, setReason] = useState('')
  return (
    <Screen>
      <Header title="Cancel reason" />
      <Card className="space-y-3">
        <OutlinedInput label="Reason" value={reason} onChange={setReason} />
        <GradientButton
          variant="danger"
          onClick={() => {
            cancelAppointment(id!, reason)
            showToast({ type: 'success', message: 'Visit cancelled' })
            navigate('/nurse/appointments')
          }}
        >
          Confirm
        </GradientButton>
      </Card>
    </Screen>
  )
}

export function NurseChatScreen() {
  const navigate = useNavigate()
  const chats = useAppStore((s) => s.chats)

  return (
    <Screen>
      <h1 className="mb-4 text-2xl font-extrabold text-ink">Messages</h1>
      {chats.length === 0 ? (
        <EmptyState title="No messages" />
      ) : (
        <div className="space-y-2">
          {chats.map((c) => (
            <Card key={c.id} onClick={() => navigate(`/nurse/messages/${c.id}`)}>
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

export function NurseChatMessageScreen() {
  const { id } = useParams()
  const chat = useAppStore((s) => s.chats.find((c) => c.id === id))
  const user = useAppStore((s) => s.user)
  const sendMessage = useAppStore((s) => s.sendMessage)
  const [text, setText] = useState('')

  if (!chat) {
    return (
      <Screen>
        <Header title="Chat" />
        <EmptyState title="Not found" />
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
            const mine = m.senderId === user?.id || m.senderId === 'nurse_1'
            return (
              <div
                key={m.id}
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  mine
                    ? 'ml-auto gradient-primary text-white'
                    : 'mr-auto border border-border bg-white text-ink'
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

export function NurseProfileScreen() {
  const navigate = useNavigate()
  const user = useAppStore((s) => s.user)
  const nurse = useAppStore((s) => s.nurses[0])

  const links = [
    { title: 'Education', to: '/nurse/profile/education' },
    { title: 'Experience', to: '/nurse/profile/experience' },
    { title: 'References', to: '/nurse/profile/reference' },
    { title: 'Preferences', to: '/nurse/profile/preference' },
    { title: 'Services', to: '/nurse/profile/services' },
    { title: 'Shifts', to: '/nurse/profile/shifts' },
  ]

  return (
    <Screen>
      <h1 className="mb-4 text-2xl font-extrabold text-ink">Profile</h1>
      <Card className="mb-4 text-center">
        <img
          src={nurse?.avatar || '/images/nurseW.png'}
          alt=""
          className="mx-auto mb-3 h-16 w-16 rounded-full bg-mist object-contain p-1"
        />
        <p className="font-extrabold text-ink">{user?.name || nurse?.name}</p>
        <p className="text-sm text-muted">{nurse?.specialty}</p>
        <p className="mt-1 text-sm font-bold text-seafoam">
          ★ {nurse?.rating} · {nurse?.experienceYears} yrs
        </p>
      </Card>
      <div className="space-y-2">
        {links.map((l) => (
          <Card key={l.to} onClick={() => navigate(l.to)}>
            <p className="font-bold text-ink">{l.title}</p>
          </Card>
        ))}
      </div>
    </Screen>
  )
}

function ProfileEditShell({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Screen>
      <Header title={title} />
      <Card>{children}</Card>
    </Screen>
  )
}

export function UpdateEducationScreen() {
  const navigate = useNavigate()
  const [value, setValue] = useState('BSN — King Saud University')
  return (
    <ProfileEditShell title="Education">
      <OutlinedInput label="Education" value={value} onChange={setValue} />
      <GradientButton
        className="mt-4"
        onClick={() => {
          showToast({ type: 'success', message: 'Education updated' })
          navigate(-1)
        }}
      >
        Save
      </GradientButton>
    </ProfileEditShell>
  )
}

export function UpdateExperienceScreen() {
  const navigate = useNavigate()
  const [value, setValue] = useState('8 years home & geriatric care')
  return (
    <ProfileEditShell title="Experience">
      <OutlinedInput label="Experience" value={value} onChange={setValue} />
      <GradientButton
        className="mt-4"
        onClick={() => {
          showToast({ type: 'success', message: 'Experience updated' })
          navigate(-1)
        }}
      >
        Save
      </GradientButton>
    </ProfileEditShell>
  )
}

export function UpdateReferenceScreen() {
  const navigate = useNavigate()
  const [value, setValue] = useState('Dr. Al-Rashid — +9665…')
  return (
    <ProfileEditShell title="References">
      <OutlinedInput label="Reference" value={value} onChange={setValue} />
      <GradientButton
        className="mt-4"
        onClick={() => {
          showToast({ type: 'success', message: 'Reference updated' })
          navigate(-1)
        }}
      >
        Save
      </GradientButton>
    </ProfileEditShell>
  )
}

export function UpdatePreferenceScreen() {
  const navigate = useNavigate()
  const [langs, setLangs] = useState<string[]>(['Arabic', 'English'])
  const toggle = (l: string) =>
    setLangs((prev) => (prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]))
  return (
    <ProfileEditShell title="Preferences">
      <p className="mb-2 text-sm font-semibold">Languages</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {LANGUAGES.map((l) => (
          <Chip key={l} active={langs.includes(l)} onClick={() => toggle(l)}>
            {l}
          </Chip>
        ))}
      </div>
      <GradientButton
        onClick={() => {
          showToast({ type: 'success', message: 'Preferences saved' })
          navigate(-1)
        }}
      >
        Save
      </GradientButton>
    </ProfileEditShell>
  )
}

export function UpdateServicesScreen() {
  const navigate = useNavigate()
  const nurse = useAppStore((s) => s.nurses[0])
  const updateNurseProfile = useAppStore((s) => s.updateNurseProfile)
  const [selected, setSelected] = useState<string[]>(nurse?.services || [])
  const toggle = (s: string) =>
    setSelected((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  return (
    <ProfileEditShell title="Services">
      <div className="mb-4 flex flex-wrap gap-2">
        {SERVICES.map((s) => (
          <Chip key={s} active={selected.includes(s)} onClick={() => toggle(s)}>
            {s}
          </Chip>
        ))}
      </div>
      <GradientButton
        onClick={() => {
          updateNurseProfile({ services: selected })
          showToast({ type: 'success', message: 'Services updated' })
          navigate(-1)
        }}
      >
        Save
      </GradientButton>
    </ProfileEditShell>
  )
}

export function UpdateShiftScreen() {
  const navigate = useNavigate()
  const [shifts, setShifts] = useState<string[]>(['Morning', 'Afternoon'])
  const toggle = (s: string) =>
    setShifts((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  return (
    <ProfileEditShell title="Shifts">
      <div className="mb-4 flex flex-wrap gap-2">
        {SHIFTS.map((s) => (
          <Chip key={s} active={shifts.includes(s)} onClick={() => toggle(s)}>
            {s}
          </Chip>
        ))}
      </div>
      <GradientButton
        onClick={() => {
          showToast({ type: 'success', message: 'Shifts updated' })
          navigate(-1)
        }}
      >
        Save
      </GradientButton>
    </ProfileEditShell>
  )
}
