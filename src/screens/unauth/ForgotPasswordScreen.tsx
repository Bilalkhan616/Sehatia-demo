import { Mail } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Card, GradientButton, Header, OutlinedInput, Screen, showToast } from '@/ui'

export function ForgotPasswordScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')

  const submit = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast({ type: 'danger', message: t('forgot.validEmail') })
      return
    }
    showToast({ type: 'success', message: t('forgot.otpSent') })
    navigate('/verify-otp', { state: { email } })
  }

  return (
    <Screen>
      <Header title={t('forgot.title')} />
      <h2 className="text-xl font-extrabold text-ink">{t('forgot.heading')}</h2>
      <p className="mt-1 text-sm text-muted">{t('forgot.lead')}</p>
      <Card className="mt-5 space-y-4">
        <OutlinedInput
          label={t('login.email')}
          value={email}
          onChange={setEmail}
          icon={<Mail size={18} />}
          placeholder="you@email.com"
        />
        <GradientButton showArrow onClick={submit}>
          {t('forgot.sendOtp')}
        </GradientButton>
      </Card>
    </Screen>
  )
}
