import { Plus, User } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import { Card, GradientButton, Header, Monogram, Screen, showToast } from '@/ui'

export function PatientSelectionScreen() {
  const navigate = useNavigate()
  const patients = useAppStore((s) => s.patients)
  const selectPatient = useAppStore((s) => s.selectPatient)
  const logout = useAppStore((s) => s.logout)
  const [selected, setSelected] = useState<string | null>(null)
  const [pin, setPin] = useState(['', '', '', ''])
  const [showPin, setShowPin] = useState(false)

  const openPin = (id: string) => {
    setSelected(id)
    setPin(['', '', '', ''])
    setShowPin(true)
  }

  const updatePin = (i: number, v: string) => {
    const digit = v.replace(/\D/g, '').slice(-1)
    const next = [...pin]
    next[i] = digit
    setPin(next)
    if (digit && i < 3) document.getElementById(`ppin-${i + 1}`)?.focus()
  }

  const confirmPin = () => {
    const patient = patients.find((p) => p.id === selected)
    if (!patient) return
    if (pin.join('') !== patient.pin) {
      showToast({ type: 'danger', message: 'Incorrect PIN (demo: 1234)' })
      return
    }
    selectPatient(patient.id)
    setShowPin(false)
    navigate('/patient/dashboard', { replace: true })
  }

  return (
    <Screen>
      <div className="mb-2 flex items-center justify-between">
        <Monogram size="sm" />
        <button
          type="button"
          className="text-sm font-bold text-coral"
          onClick={() => {
            logout()
            navigate('/', { replace: true })
          }}
        >
          Logout
        </button>
      </div>
      <h1 className="text-2xl font-extrabold text-ink">Select patient</h1>
      <p className="mt-1 text-sm text-muted">Enter PIN to unlock their care profile</p>

      <div className="mt-5 space-y-3">
        {patients.map((p) => (
          <Card key={p.id} onClick={() => openPin(p.id)}>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-seafoam">
                <User size={22} />
              </div>
              <div className="flex-1">
                <p className="font-extrabold text-ink">{p.name}</p>
                <p className="text-xs text-muted">
                  {p.age} yrs · {p.gender}
                  {p.condition ? ` · ${p.condition}` : ''}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <GradientButton
        className="mt-5"
        variant="secondary"
        onClick={() => navigate('/patient/add-patient')}
      >
        <Plus size={18} /> Add new patient
      </GradientButton>

      {showPin && (
        <div className="absolute inset-0 z-50 flex items-end bg-ink/40 p-4">
          <div className="w-full rounded-3xl bg-white p-5 shadow-xl">
            <h3 className="text-lg font-extrabold text-ink">Enter patient PIN</h3>
            <p className="text-xs text-muted">Demo PIN is 1234</p>
            <div className="my-4 flex justify-center gap-3">
              {pin.map((d, i) => (
                <input
                  key={i}
                  id={`ppin-${i}`}
                  value={d}
                  onChange={(e) => updatePin(i, e.target.value)}
                  className="h-14 w-12 rounded-2xl border border-border text-center text-xl font-extrabold outline-none focus:border-seafoam"
                  inputMode="numeric"
                  maxLength={1}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <GradientButton variant="outline" onClick={() => setShowPin(false)}>
                Cancel
              </GradientButton>
              <GradientButton onClick={confirmPin}>Unlock</GradientButton>
            </div>
          </div>
        </div>
      )}
    </Screen>
  )
}

export function AddNewPatientScreen() {
  const navigate = useNavigate()
  const addPatient = useAppStore((s) => s.addPatient)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('Male')
  const [pin, setPinVal] = useState('1234')

  return (
    <Screen>
      <Header title="Add patient" />
      <Card className="space-y-3">
        <label className="block text-sm font-semibold">
          Name
          <input className="mt-1 w-full rounded-2xl border border-border px-3 py-3 outline-none focus:border-seafoam" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block text-sm font-semibold">
          Age
          <input className="mt-1 w-full rounded-2xl border border-border px-3 py-3 outline-none focus:border-seafoam" value={age} onChange={(e) => setAge(e.target.value)} />
        </label>
        <label className="block text-sm font-semibold">
          PIN
          <input className="mt-1 w-full rounded-2xl border border-border px-3 py-3 outline-none focus:border-seafoam" value={pin} onChange={(e) => setPinVal(e.target.value)} />
        </label>
        <div className="flex gap-2">
          {['Male', 'Female'].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGender(g)}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold ${gender === g ? 'border-seafoam bg-seafoam text-white' : 'border-border bg-white text-ink'}`}
            >
              {g}
            </button>
          ))}
        </div>
        <GradientButton
          onClick={() => {
            if (!name) {
              showToast({ type: 'danger', message: 'Name required' })
              return
            }
            addPatient({ name, age: Number(age) || 40, gender, pin: pin || '1234' })
            showToast({ type: 'success', message: 'Patient added' })
            navigate('/patient/select')
          }}
        >
          Save patient
        </GradientButton>
      </Card>
    </Screen>
  )
}
