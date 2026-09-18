import { Lock } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Card, GradientButton, Header, OutlinedInput, Screen, showToast } from '@/ui'

export function ChangePasswordScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const submit = () => {
    if (password.length < 6) {
      showToast({ type: 'danger', message: t('changePassword.tooShort') })
      return
    }
    if (password !== confirm) {
      showToast({ type: 'danger', message: t('changePassword.mismatch') })
      return
    }
    showToast({ type: 'success', message: t('changePassword.updated') })
    navigate('/login', { replace: true })
  }

  return (
    <Screen>
      <Header title={t('changePassword.title')} />
      <Card className="mt-2 space-y-4">
        <OutlinedInput
          label={t('changePassword.new')}
          value={password}
          onChange={setPassword}
          passwordToggle
          icon={<Lock size={18} />}
        />
        <OutlinedInput
          label={t('changePassword.confirm')}
          value={confirm}
          onChange={setConfirm}
          passwordToggle
          icon={<Lock size={18} />}
        />
        <GradientButton showArrow onClick={submit}>
          {t('changePassword.save')}
        </GradientButton>
      </Card>
    </Screen>
  )
}
