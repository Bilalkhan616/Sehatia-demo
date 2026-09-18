import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Card, Header, LanguageToggle, Monogram, Screen } from '@/ui'

export function SignUpSelectionScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <Screen>
      <Header title={t('signup.title')} right={<LanguageToggle compact />} />
      <div className="mb-6 flex flex-col items-center">
        <Monogram />
        <h2 className="mt-3 text-xl font-extrabold text-ink">{t('signup.join')}</h2>
        <p className="mt-1 text-center text-sm text-muted">{t('signup.choose')}</p>
      </div>

      <Card className="mb-3" onClick={() => navigate('/signup/nurse')}>
        <div className="flex items-center gap-4">
          <img src="/images/nurseW.png" alt="" className="h-14 w-14 rounded-2xl bg-mist object-contain p-1" />
          <div>
            <p className="font-extrabold text-ink">{t('signup.asNurse')}</p>
            <p className="text-xs text-muted">{t('signup.asNurseHint')}</p>
          </div>
        </div>
      </Card>

      <Card onClick={() => navigate('/signup/patient')}>
        <div className="flex items-center gap-4">
          <img src="/images/patientW.png" alt="" className="h-14 w-14 rounded-2xl bg-sky-soft object-contain p-1" />
          <div>
            <p className="font-extrabold text-ink">{t('signup.asPatient')}</p>
            <p className="text-xs text-muted">{t('signup.asPatientHint')}</p>
          </div>
        </div>
      </Card>
    </Screen>
  )
}
