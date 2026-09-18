import { Lock } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, GradientButton, Header, OutlinedInput, Screen, showToast } from '@/ui'

export function ChangePasswordScreen() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const submit = () => {
    if (password.length < 6) {
      showToast({ type: 'danger', message: 'Password must be at least 6 characters' })
      return
    }
    if (password !== confirm) {
      showToast({ type: 'danger', message: 'Passwords do not match' })
      return
    }
    showToast({ type: 'success', message: 'Password updated — please sign in' })
    navigate('/login', { replace: true })
  }

  return (
    <Screen>
      <Header title="New password" />
      <Card className="mt-2 space-y-4">
        <OutlinedInput
          label="New password"
          value={password}
          onChange={setPassword}
          passwordToggle
          icon={<Lock size={18} />}
        />
        <OutlinedInput
          label="Confirm password"
          value={confirm}
          onChange={setConfirm}
          passwordToggle
          icon={<Lock size={18} />}
        />
        <GradientButton showArrow onClick={submit}>
          Save password
        </GradientButton>
      </Card>
    </Screen>
  )
}
