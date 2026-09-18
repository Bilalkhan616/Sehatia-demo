import { Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { GENDERS, PLANS, SERVICES } from '@/data/seed'
import { useAppStore } from '@/store/appStore'
import { formatCurrency } from '@/lib/utils'
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

export function PatientSignUpScreen() {
  const navigate = useNavigate()
  const d = useAppStore((s) => s.patientSignup)
  const update = useAppStore((s) => s.updatePatientSignup)
  return (
    <Screen>
      <Header title="Patient signup" />
      <Stepper step={1} total={9} />
      <Card className="space-y-3">
        <OutlinedInput label="Email" value={d.email} onChange={(v) => update({ email: v })} icon={<Mail size={18} />} />
        <div>
          <p className="mb-2 text-sm font-semibold">Gender</p>
          <div className="flex gap-2">
            {GENDERS.map((g) => (
              <Chip key={g} active={d.gender === g} onClick={() => update({ gender: g })}>
                {g}
              </Chip>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" className="accent-seafoam" defaultChecked />
          I agree to terms & privacy
        </label>
        <GradientButton showArrow onClick={() => navigate('/signup/patient/services')}>
          Continue
        </GradientButton>
      </Card>
    </Screen>
  )
}

export function PatientServiceSelectionScreen() {
  const navigate = useNavigate()
  const d = useAppStore((s) => s.patientSignup)
  const update = useAppStore((s) => s.updatePatientSignup)
  return (
    <Screen>
      <Header title="Services needed" />
      <Stepper step={2} total={9} />
      <Card>
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
        <GradientButton showArrow onClick={() => navigate('/signup/patient/checkup')}>
          Continue
        </GradientButton>
      </Card>
    </Screen>
  )
}

export function PatientCheckUpScreen() {
  const navigate = useNavigate()
  const d = useAppStore((s) => s.patientSignup)
  const update = useAppStore((s) => s.updatePatientSignup)
  return (
    <Screen>
      <Header title="Health notes" />
      <Stepper step={3} total={9} />
      <Card className="space-y-3">
        <OutlinedInput
          label="Brief health / care notes"
          value={d.checkupNotes}
          onChange={(v) => update({ checkupNotes: v })}
          placeholder="Conditions, medications…"
        />
        <GradientButton showArrow onClick={() => navigate('/signup/patient/credentials')}>
          Continue
        </GradientButton>
      </Card>
    </Screen>
  )
}

export function PatientEmailPasswordScreen() {
  const navigate = useNavigate()
  const d = useAppStore((s) => s.patientSignup)
  const update = useAppStore((s) => s.updatePatientSignup)
  return (
    <Screen>
      <Header title="Credentials" />
      <Stepper step={4} total={9} />
      <Card className="space-y-3">
        <OutlinedInput label="Account email" value={d.email} onChange={(v) => update({ email: v })} />
        <OutlinedInput label="Password" value={d.password} onChange={(v) => update({ password: v })} passwordToggle />
        <GradientButton showArrow onClick={() => navigate('/signup/patient/holder')}>
          Continue
        </GradientButton>
      </Card>
    </Screen>
  )
}

export function AddAccountHolderScreen() {
  const navigate = useNavigate()
  const d = useAppStore((s) => s.patientSignup)
  const update = useAppStore((s) => s.updatePatientSignup)
  return (
    <Screen>
      <Header title="Account holder" />
      <Stepper step={5} total={9} />
      <Card className="space-y-3">
        <OutlinedInput label="Full name" value={d.holderName} onChange={(v) => update({ holderName: v })} />
        <OutlinedInput label="Phone" value={d.phone} onChange={(v) => update({ phone: v })} />
        <OutlinedInput label="City" value={d.city} onChange={(v) => update({ city: v })} />
        <GradientButton showArrow onClick={() => navigate('/signup/patient/add-patient')}>
          Continue
        </GradientButton>
      </Card>
    </Screen>
  )
}

export function AddPatientSignupScreen() {
  const navigate = useNavigate()
  const d = useAppStore((s) => s.patientSignup)
  const update = useAppStore((s) => s.updatePatientSignup)
  return (
    <Screen>
      <Header title="Add patient" />
      <Stepper step={6} total={9} />
      <Card className="space-y-3">
        <OutlinedInput label="Patient name" value={d.patientName} onChange={(v) => update({ patientName: v })} />
        <OutlinedInput label="Age" value={d.patientAge} onChange={(v) => update({ patientAge: v })} type="number" />
        <OutlinedInput label="PIN (4 digits)" value={d.patientPin} onChange={(v) => update({ patientPin: v })} />
        <div className="flex gap-2">
          {GENDERS.map((g) => (
            <Chip key={g} active={d.patientGender === g} onClick={() => update({ patientGender: g })}>
              {g}
            </Chip>
          ))}
        </div>
        <GradientButton showArrow onClick={() => navigate('/signup/patient/plan')}>
          Continue
        </GradientButton>
      </Card>
    </Screen>
  )
}

export function ChoosePlanScreen() {
  const navigate = useNavigate()
  const d = useAppStore((s) => s.patientSignup)
  const update = useAppStore((s) => s.updatePatientSignup)
  return (
    <Screen>
      <Header title="Choose plan" />
      <Stepper step={7} total={9} />
      <div className="space-y-3">
        {PLANS.map((p) => (
          <Card
            key={p.id}
            onClick={() => update({ planId: p.id })}
            className={d.planId === p.id ? 'ring-2 ring-seafoam' : ''}
          >
            <div className="flex items-center gap-3">
              <img src={p.image} alt="" className="h-12 w-12 object-contain" />
              <div className="flex-1">
                <p className="font-extrabold text-ink">{p.name}</p>
                <p className="text-xs text-muted">{p.description}</p>
              </div>
              <p className="font-extrabold text-seafoam">{formatCurrency(p.price)}</p>
            </div>
          </Card>
        ))}
      </div>
      <GradientButton className="mt-4" showArrow onClick={() => navigate('/signup/patient/confirm-plan')}>
        Continue
      </GradientButton>
    </Screen>
  )
}

export function ConfirmPlanScreen() {
  const navigate = useNavigate()
  const d = useAppStore((s) => s.patientSignup)
  const plan = PLANS.find((p) => p.id === d.planId) || PLANS[1]
  return (
    <Screen>
      <Header title="Confirm plan" />
      <Stepper step={8} total={9} />
      <Card>
        <img src={plan.image} alt="" className="mx-auto mb-3 h-16 w-16 object-contain" />
        <h3 className="text-center text-xl font-extrabold text-ink">{plan.name}</h3>
        <p className="mt-1 text-center text-sm text-muted">{plan.description}</p>
        <p className="mt-3 text-center text-2xl font-extrabold text-seafoam">
          {formatCurrency(plan.price)}
          <span className="text-sm font-medium text-muted"> / mo</span>
        </p>
        <GradientButton className="mt-5" showArrow onClick={() => navigate('/signup/patient/payment')}>
          Proceed to payment
        </GradientButton>
      </Card>
    </Screen>
  )
}

export function AddPlanWithPaymentScreen() {
  const navigate = useNavigate()
  const complete = useAppStore((s) => s.completePatientSignup)
  const topUp = useAppStore((s) => s.topUpWallet)
  const d = useAppStore((s) => s.patientSignup)
  const plan = PLANS.find((p) => p.id === d.planId) || PLANS[1]

  return (
    <Screen>
      <Header title="Payment" />
      <Stepper step={9} total={9} />
      <Card className="space-y-4">
        <p className="text-sm text-muted">Demo payment — no real charge.</p>
        <div className="rounded-2xl bg-mist p-4">
          <p className="font-bold text-ink">{plan.name}</p>
          <p className="text-seafoam font-extrabold">{formatCurrency(plan.price)}</p>
        </div>
        <OutlinedInput label="Card number" value="4242 4242 4242 4242" onChange={() => {}} />
        <div className="grid grid-cols-2 gap-3">
          <OutlinedInput label="Expiry" value="12/28" onChange={() => {}} />
          <OutlinedInput label="CVC" value="123" onChange={() => {}} />
        </div>
        <GradientButton
          showArrow
          onClick={() => {
            topUp(500)
            complete()
            showToast({ type: 'success', message: 'Account created — please sign in' })
            navigate('/login', { replace: true })
          }}
        >
          Pay & finish
        </GradientButton>
      </Card>
    </Screen>
  )
}
