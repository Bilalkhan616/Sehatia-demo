import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { Card, GradientButton, Header, Screen, showToast } from '@/ui'

export function VerifyOtpScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const location = useLocation()
  const email = (location.state as { email?: string })?.email || ''
  const [otp, setOtp] = useState(['', '', '', ''])

  const update = (i: number, v: string) => {
    const digit = v.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[i] = digit
    setOtp(next)
    if (digit && i < 3) {
      document.getElementById(`otp-${i + 1}`)?.focus()
    }
  }

  const submit = () => {
    if (otp.join('') !== '1234') {
      showToast({ type: 'danger', message: t('otp.wrong') })
      return
    }
    showToast({ type: 'success', message: t('otp.verified') })
    navigate('/change-password', { state: { email } })
  }

  return (
    <Screen>
      <Header title={t('otp.title')} />
      <h2 className="text-xl font-extrabold text-ink">{t('otp.heading')}</h2>
      <p className="mt-1 text-sm text-muted">
        {t('otp.sentTo', { email: email || t('otp.yourEmail') })}
      </p>
      <Card className="mt-5">
        <div className="mb-5 flex justify-center gap-3">
          {otp.map((d, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              value={d}
              onChange={(e) => update(i, e.target.value)}
              className="h-14 w-12 rounded-2xl border border-border bg-white text-center text-xl font-extrabold text-ink outline-none focus:border-seafoam"
              inputMode="numeric"
              maxLength={1}
            />
          ))}
        </div>
        <GradientButton showArrow onClick={submit}>
          {t('otp.verify')}
        </GradientButton>
      </Card>
    </Screen>
  )
}
