import { Mail } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, GradientButton, Header, OutlinedInput, Screen, showToast } from '@/ui'

export function ForgotPasswordScreen() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  const submit = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast({ type: 'danger', message: 'Enter a valid email' })
      return
    }
    showToast({ type: 'success', message: 'OTP sent (demo: 1234)' })
    navigate('/verify-otp', { state: { email } })
  }

  return (
    <Screen>
      <Header title="Forgot password" />
      <h2 className="text-xl font-extrabold text-ink">Reset your password</h2>
      <p className="mt-1 text-sm text-muted">
        We&apos;ll send a one-time code to your email.
      </p>
      <Card className="mt-5 space-y-4">
        <OutlinedInput
          label="Email"
          value={email}
          onChange={setEmail}
          icon={<Mail size={18} />}
          placeholder="you@email.com"
        />
        <GradientButton showArrow onClick={submit}>
          Send OTP
        </GradientButton>
      </Card>
    </Screen>
  )
}
