import { Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { GENDERS } from '@/data/seed'
import { useAppStore } from '@/store/appStore'
import { Card, Chip, GradientButton, Header, OutlinedInput, Screen, showToast } from '@/ui'

export function PatientSignUpScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const d = useAppStore((s) => s.patientSignup)
  const update = useAppStore((s) => s.updatePatientSignup)
  const complete = useAppStore((s) => s.completePatientSignup)

  const submit = () => {
    if (!d.email || !d.password || !d.name || !d.phone || !d.city || !d.dob) {
      showToast({ type: 'danger', message: t('patientSignup.fillAll') })
      return
    }
    complete()
    showToast({ type: 'success', message: t('plan.accountCreated') })
    navigate('/login', { replace: true })
  }

  return (
    <Screen>
      <Header title={t('patientSignup.title')} />
      <h2 className="text-xl font-extrabold text-ink">{t('nurseSignup.create')}</h2>
      <Card className="mt-4 space-y-3">
        <OutlinedInput
          label={t('login.email')}
          value={d.email}
          onChange={(v) => update({ email: v })}
          icon={<Mail size={18} />}
        />
        <OutlinedInput
          label={t('login.password')}
          value={d.password}
          onChange={(v) => update({ password: v })}
          passwordToggle
        />
        <OutlinedInput
          label={t('nurseSignup.fullName')}
          value={d.name}
          onChange={(v) => update({ name: v })}
        />
        <div>
          <p className="mb-2 text-sm font-semibold">{t('nurseSignup.gender')}</p>
          <div className="flex gap-2">
            {GENDERS.map((g) => (
              <Chip key={g} active={d.gender === g} onClick={() => update({ gender: g })}>
                {g === 'Male' ? t('addPatient.male') : t('addPatient.female')}
              </Chip>
            ))}
          </div>
        </div>
        <OutlinedInput
          label={t('patientSignup.dob')}
          type="date"
          value={d.dob}
          onChange={(v) => update({ dob: v })}
        />
        <OutlinedInput label={t('nurseSignup.phone')} value={d.phone} onChange={(v) => update({ phone: v })} />
        <OutlinedInput label={t('nurseSignup.city')} value={d.city} onChange={(v) => update({ city: v })} />
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" className="accent-seafoam" defaultChecked />
          {t('patientSignup.agree')}
        </label>
        <GradientButton showArrow onClick={submit}>
          {t('patientSignup.createAccount')}
        </GradientButton>
      </Card>
    </Screen>
  )
}
