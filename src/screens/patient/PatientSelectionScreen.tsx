import { Plus, User } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import { Card, GradientButton, Header, LanguageToggle, Monogram, Screen, showToast } from '@/ui'

export function PatientSelectionScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const patients = useAppStore((s) => s.patients)
  const selectPatient = useAppStore((s) => s.selectPatient)
  const logout = useAppStore((s) => s.logout)

  const choose = (id: string) => {
    selectPatient(id)
    navigate('/patient/dashboard', { replace: true })
  }

  return (
    <Screen>
      <div className="mb-2 flex items-center justify-between gap-2">
        <Monogram size="sm" />
        <div className="flex items-center gap-2">
          <LanguageToggle compact />
          <button
            type="button"
            className="text-sm font-bold text-coral"
            onClick={() => {
              logout()
              navigate('/', { replace: true })
            }}
          >
            {t('common.logout')}
          </button>
        </div>
      </div>
      <h1 className="text-2xl font-extrabold text-ink">{t('patientSelect.title')}</h1>
      <p className="mt-1 text-sm text-muted">{t('patientSelect.subtitle')}</p>

      <div className="mt-5 space-y-3">
        {patients.map((p) => (
          <Card key={p.id} onClick={() => choose(p.id)}>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-seafoam">
                <User size={22} />
              </div>
              <div className="flex-1">
                <p className="font-extrabold text-ink">{p.name}</p>
                <p className="text-xs text-muted">
                  {p.age} {t('patientSelect.yrs')} · {p.gender}
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
        <Plus size={18} /> {t('patientSelect.addNew')}
      </GradientButton>
    </Screen>
  )
}

export function AddNewPatientScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const addPatient = useAppStore((s) => s.addPatient)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('Male')

  return (
    <Screen>
      <Header title={t('addPatient.title')} />
      <Card className="space-y-3">
        <label className="block text-sm font-semibold">
          {t('addPatient.name')}
          <input
            className="mt-1 w-full rounded-2xl border border-border px-3 py-3 outline-none focus:border-seafoam"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="block text-sm font-semibold">
          {t('addPatient.age')}
          <input
            className="mt-1 w-full rounded-2xl border border-border px-3 py-3 outline-none focus:border-seafoam"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </label>
        <div className="flex gap-2">
          {[
            { id: 'Male', label: t('addPatient.male') },
            { id: 'Female', label: t('addPatient.female') },
          ].map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGender(g.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                gender === g.id
                  ? 'border-seafoam bg-seafoam text-white'
                  : 'border-border bg-white text-ink'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
        <GradientButton
          onClick={() => {
            if (!name) {
              showToast({ type: 'danger', message: t('addPatient.nameRequired') })
              return
            }
            addPatient({ name, age: Number(age) || 40, gender })
            showToast({ type: 'success', message: t('addPatient.saved') })
            navigate('/patient/select')
          }}
        >
          {t('common.save')} {t('addPatient.title').toLowerCase()}
        </GradientButton>
      </Card>
    </Screen>
  )
}
