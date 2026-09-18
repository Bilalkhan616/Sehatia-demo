import { Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { GENDERS, LANGUAGES, SERVICES, SHIFTS } from '@/data/seed'
import { useAppStore } from '@/store/appStore'
import {
  Card,
  Chip,
  GradientButton,
  Header,
  OutlinedInput,
  Screen,
  Stepper,
  showToast,
} from '@/ui'

function toggle(list: string[], item: string) {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item]
}

export function NurseSignUpScreen() {
  const navigate = useNavigate()
  const d = useAppStore((s) => s.nurseSignup)
  const update = useAppStore((s) => s.updateNurseSignup)

  return (
    <Screen>
      <Header title="Nurse signup" />
      <Stepper step={1} total={9} />
      <h2 className="text-xl font-extrabold text-ink">Create your account</h2>
      <Card className="mt-4 space-y-3">
        <OutlinedInput label="Email" value={d.email} onChange={(v) => update({ email: v })} icon={<Mail size={18} />} />
        <OutlinedInput label="Password" value={d.password} onChange={(v) => update({ password: v })} passwordToggle />
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" className="accent-seafoam" defaultChecked />
          I agree to Sehatia terms & privacy
        </label>
        <GradientButton
          showArrow
          onClick={() => {
            if (!d.email || !d.password) {
              showToast({ type: 'danger', message: 'Email and password required' })
              return
            }
            navigate('/signup/nurse/info')
          }}
        >
          Continue
        </GradientButton>
      </Card>
    </Screen>
  )
}

export function NurseInfoScreen() {
  const navigate = useNavigate()
  const d = useAppStore((s) => s.nurseSignup)
  const update = useAppStore((s) => s.updateNurseSignup)
  return (
    <Screen>
      <Header title="Personal info" />
      <Stepper step={2} total={9} />
      <Card className="space-y-3">
        <OutlinedInput label="Full name" value={d.fullName} onChange={(v) => update({ fullName: v })} />
        <OutlinedInput label="Phone" value={d.phone} onChange={(v) => update({ phone: v })} />
        <OutlinedInput label="City" value={d.city} onChange={(v) => update({ city: v })} />
        <div>
          <p className="mb-2 text-sm font-semibold text-ink">Gender</p>
          <div className="flex flex-wrap gap-2">
            {GENDERS.map((g) => (
              <Chip key={g} active={d.gender === g} onClick={() => update({ gender: g })}>
                {g}
              </Chip>
            ))}
          </div>
        </div>
        <GradientButton showArrow onClick={() => navigate('/signup/nurse/education')}>
          Continue
        </GradientButton>
      </Card>
    </Screen>
  )
}

export function NurseEducationScreen() {
  const navigate = useNavigate()
  const d = useAppStore((s) => s.nurseSignup)
  const update = useAppStore((s) => s.updateNurseSignup)
  return (
    <Screen>
      <Header title="Education" />
      <Stepper step={3} total={9} />
      <Card className="space-y-3">
        <OutlinedInput
          label="Education / qualifications"
          value={d.education}
          onChange={(v) => update({ education: v })}
          placeholder="BSN, King Saud University…"
        />
        <GradientButton showArrow onClick={() => navigate('/signup/nurse/experience')}>
          Continue
        </GradientButton>
      </Card>
    </Screen>
  )
}

export function NurseExperienceScreen() {
  const navigate = useNavigate()
  const d = useAppStore((s) => s.nurseSignup)
  const update = useAppStore((s) => s.updateNurseSignup)
  return (
    <Screen>
      <Header title="Experience" />
      <Stepper step={4} total={9} />
      <Card className="space-y-3">
        <OutlinedInput
          label="Work experience"
          value={d.experience}
          onChange={(v) => update({ experience: v })}
          placeholder="5 years ICU, home care…"
        />
        <GradientButton showArrow onClick={() => navigate('/signup/nurse/reference')}>
          Continue
        </GradientButton>
      </Card>
    </Screen>
  )
}

export function NurseReferenceScreen() {
  const navigate = useNavigate()
  const d = useAppStore((s) => s.nurseSignup)
  const update = useAppStore((s) => s.updateNurseSignup)
  return (
    <Screen>
      <Header title="Reference" />
      <Stepper step={5} total={9} />
      <Card className="space-y-3">
        <OutlinedInput
          label="Professional reference"
          value={d.reference}
          onChange={(v) => update({ reference: v })}
          placeholder="Name, phone, relationship"
        />
        <GradientButton showArrow onClick={() => navigate('/signup/nurse/check')}>
          Continue
        </GradientButton>
      </Card>
    </Screen>
  )
}

export function NurseCheckScreen() {
  const navigate = useNavigate()
  const d = useAppStore((s) => s.nurseSignup)
  const update = useAppStore((s) => s.updateNurseSignup)
  return (
    <Screen>
      <Header title="License check" />
      <Stepper step={6} total={9} />
      <Card className="space-y-3">
        <OutlinedInput
          label="Nursing license number"
          value={d.license}
          onChange={(v) => update({ license: v })}
        />
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">Upload license (demo)</span>
          <input
            type="file"
            className="w-full text-sm text-muted"
            onChange={() => showToast({ type: 'info', message: 'File attached (demo)' })}
          />
        </label>
        <GradientButton showArrow onClick={() => navigate('/signup/nurse/banking')}>
          Continue
        </GradientButton>
      </Card>
    </Screen>
  )
}

export function NurseBankingScreen() {
  const navigate = useNavigate()
  const d = useAppStore((s) => s.nurseSignup)
  const update = useAppStore((s) => s.updateNurseSignup)
  return (
    <Screen>
      <Header title="Banking" />
      <Stepper step={7} total={9} />
      <Card className="space-y-3">
        <OutlinedInput label="Bank name" value={d.bankName} onChange={(v) => update({ bankName: v })} />
        <OutlinedInput label="IBAN" value={d.iban} onChange={(v) => update({ iban: v })} />
        <GradientButton showArrow onClick={() => navigate('/signup/nurse/availability')}>
          Continue
        </GradientButton>
      </Card>
    </Screen>
  )
}

export function NurseAvailabilityScreen() {
  const navigate = useNavigate()
  const d = useAppStore((s) => s.nurseSignup)
  const update = useAppStore((s) => s.updateNurseSignup)
  return (
    <Screen>
      <Header title="Availability" />
      <Stepper step={8} total={9} />
      <Card>
        <p className="mb-3 text-sm font-semibold text-ink">Preferred shifts</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {SHIFTS.map((s) => (
            <Chip
              key={s}
              active={d.availability.includes(s)}
              onClick={() => update({ availability: toggle(d.availability, s) })}
            >
              {s}
            </Chip>
          ))}
        </div>
        <p className="mb-3 text-sm font-semibold text-ink">Languages</p>
        <div className="mb-5 flex flex-wrap gap-2">
          {LANGUAGES.map((s) => (
            <Chip
              key={s}
              tone="sky"
              active={d.languages.includes(s)}
              onClick={() => update({ languages: toggle(d.languages, s) })}
            >
              {s}
            </Chip>
          ))}
        </div>
        <GradientButton showArrow onClick={() => navigate('/signup/nurse/services')}>
          Continue
        </GradientButton>
      </Card>
    </Screen>
  )
}

export function NurseServicesScreen() {
  const navigate = useNavigate()
  const d = useAppStore((s) => s.nurseSignup)
  const update = useAppStore((s) => s.updateNurseSignup)
  const complete = useAppStore((s) => s.completeNurseSignup)

  return (
    <Screen>
      <Header title="Services" />
      <Stepper step={9} total={9} />
      <Card>
        <p className="mb-3 text-sm font-semibold text-ink">Services you offer</p>
        <div className="mb-5 flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <Chip
              key={s}
              active={d.services.includes(s)}
              onClick={() => update({ services: toggle(d.services, s) })}
            >
              {s}
            </Chip>
          ))}
        </div>
        <GradientButton
          showArrow
          onClick={() => {
            if (!d.services.length) {
              showToast({ type: 'danger', message: 'Pick at least one service' })
              return
            }
            complete()
            showToast({ type: 'success', message: 'Nurse account created — please sign in' })
            navigate('/login', { replace: true })
          }}
        >
          Finish signup
        </GradientButton>
      </Card>
    </Screen>
  )
}
