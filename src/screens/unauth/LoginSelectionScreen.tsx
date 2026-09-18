import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import { Card, GradientButton, Header, LanguageToggle, Monogram, Screen, showToast } from '@/ui'

export function LoginSelectionScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const loginAs = useAppStore((s) => s.loginAs)
  const pending = useAppStore((s) => s.pendingLogin)

  const choose = (role: 'Nurse' | 'AccountHolder') => {
    if (!pending?.email) {
      showToast({ type: 'danger', message: t('loginSelection.needEmail') })
      navigate('/login')
      return
    }
    loginAs(role)
    showToast({ type: 'success', message: t('loginSelection.success') })
    if (role === 'Nurse') navigate('/nurse/dashboard', { replace: true })
    else navigate('/patient/select', { replace: true })
  }

  return (
    <Screen>
      <Header title={t('loginSelection.title')} right={<LanguageToggle compact />} />
      <div className="mb-6 flex flex-col items-center">
        <Monogram />
        <h2 className="mt-3 text-xl font-extrabold text-ink">{t('loginSelection.continueAs')}</h2>
        <p className="mt-1 text-center text-sm text-muted">
          {t('loginSelection.signedInAs', { email: pending?.email || 'guest' })}
        </p>
      </div>

      <Card className="mb-3" onClick={() => choose('Nurse')} padding>
        <div className="flex items-center gap-4">
          <img src="/images/nurseW.png" alt="" className="h-14 w-14 rounded-2xl bg-mist object-contain p-1" />
          <div>
            <p className="font-extrabold text-ink">{t('loginSelection.nurse')}</p>
            <p className="text-xs text-muted">{t('loginSelection.nurseHint')}</p>
          </div>
        </div>
      </Card>

      <Card className="mb-6" onClick={() => choose('AccountHolder')} padding>
        <div className="flex items-center gap-4">
          <img src="/images/patientW.png" alt="" className="h-14 w-14 rounded-2xl bg-sky-soft object-contain p-1" />
          <div>
            <p className="font-extrabold text-ink">{t('loginSelection.patient')}</p>
            <p className="text-xs text-muted">{t('loginSelection.patientHint')}</p>
          </div>
        </div>
      </Card>

      <GradientButton variant="ghost" onClick={() => navigate('/login')}>
        {t('loginSelection.backToSignIn')}
      </GradientButton>
    </Screen>
  )
}
