import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Card, GradientButton, Header, Screen, showToast } from '@/ui'

export function VerifyOtpScreen() {
  const navigate = useNavigate()
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
      showToast({ type: 'danger', message: 'Demo OTP is 1234' })
      return
    }
    showToast({ type: 'success', message: 'OTP verified' })
    navigate('/change-password', { state: { email } })
  }

  return (
    <Screen>
      <Header title="Verify OTP" />
      <h2 className="text-xl font-extrabold text-ink">Enter the code</h2>
      <p className="mt-1 text-sm text-muted">
        Sent to {email || 'your email'} — use <strong>1234</strong> for this demo
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
          Verify
        </GradientButton>
      </Card>
    </Screen>
  )
}
