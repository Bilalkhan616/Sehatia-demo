import { Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { GENDERS } from '@/data/seed'
import { useAppStore } from '@/store/appStore'
import { Card, Chip, GradientButton, Header, OutlinedInput, Screen, showToast } from '@/ui'

export function NurseSignUpScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const d = useAppStore((s) => s.nurseSignup)
  const update = useAppStore((s) => s.updateNurseSignup)
  const complete = useAppStore((s) => s.completeNurseSignup)

  const submit = () => {
    if (!d.email || !d.password || !d.fullName || !d.phone || !d.city || !d.dob) {
      showToast({ type: 'danger', message: t('nurseSignup.fillAll') })
      return
    }
    complete()
    showToast({ type: 'success', message: t('nurseSignup.createdHire') })
    navigate('/login', { replace: true })
  }

  return (
    <Screen>
      <Header title={t('nurseSignup.title')} />
      <h2 className="text-xl font-extrabold text-ink">{t('nurseSignup.create')}</h2>
      <p className="mt-1 text-sm text-muted">{t('nurseSignup.hireHint')}</p>
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
          value={d.fullName}
          onChange={(v) => update({ fullName: v })}
        />
        <div>
          <p className="mb-2 text-sm font-semibold text-ink">{t('nurseSignup.gender')}</p>
          <div className="flex flex-wrap gap-2">
            {GENDERS.map((g) => (
              <Chip key={g} active={d.gender === g} onClick={() => update({ gender: g })}>
                {g === 'Male' ? t('addPatient.male') : t('addPatient.female')}
              </Chip>
            ))}
          </div>
        </div>
        <OutlinedInput
          label={t('nurseSignup.dob')}
          type="date"
          value={d.dob}
          onChange={(v) => update({ dob: v })}
        />
        <OutlinedInput label={t('nurseSignup.phone')} value={d.phone} onChange={(v) => update({ phone: v })} />
        <OutlinedInput label={t('nurseSignup.city')} value={d.city} onChange={(v) => update({ city: v })} />
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" className="accent-seafoam" defaultChecked />
          {t('nurseSignup.agree')}
        </label>
        <GradientButton showArrow onClick={submit}>
          {t('nurseSignup.createAccount')}
        </GradientButton>
      </Card>
    </Screen>
  )
}
