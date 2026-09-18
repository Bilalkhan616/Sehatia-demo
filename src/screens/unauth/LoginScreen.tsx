import { motion } from 'framer-motion'
import { Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import {
  Card,
  GradientButton,
  LanguageToggle,
  Monogram,
  OutlinedInput,
  Screen,
  showToast,
} from '@/ui'

const SSO = [
  { name: 'Apple', src: '/images/apple.png' },
  { name: 'Google', src: '/images/google.png' },
  { name: 'Microsoft', src: '/images/microsoft.png' },
  { name: 'Facebook', src: '/images/fb.png' },
]

export function LoginScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const setPendingLogin = useAppStore((s) => s.setPendingLogin)
  const loginAs = useAppStore((s) => s.loginAs)
  const [email, setEmail] = useState('demo@sehatia.com')
  const [password, setPassword] = useState('demo1234')

  const handleLogin = () => {
    if (!email.trim()) {
      showToast({ type: 'danger', message: t('login.emailRequired') })
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast({ type: 'danger', message: t('login.emailInvalid') })
      return
    }
    if (!password.trim()) {
      showToast({ type: 'danger', message: t('login.passwordRequired') })
      return
    }
    setPendingLogin(email, password)
    navigate('/login-selection')
  }

  const demoLogin = (role: 'Nurse' | 'AccountHolder') => {
    setPendingLogin(email || 'demo@sehatia.com', password || 'demo')
    loginAs(role)
    showToast({ type: 'success', message: t('login.welcomeDemo') })
    if (role === 'Nurse') navigate('/nurse/dashboard', { replace: true })
    else navigate('/patient/select', { replace: true })
  }

  return (
    <Screen>
      <div className="mb-1 flex justify-end">
        <LanguageToggle />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center pt-2"
      >
        <Monogram size="md" />
        <h1 className="mt-3 text-3xl font-extrabold text-ink">{t('brand.name')}</h1>
      </motion.div>

      <div className="mt-4">
        <h2 className="text-2xl font-extrabold text-ink">{t('login.welcome')}</h2>
        <p className="mt-1 text-sm font-medium text-muted">{t('login.subtitle')}</p>
      </div>

      <Card className="mt-4 space-y-3">
        <OutlinedInput
          label={t('login.email')}
          value={email}
          onChange={setEmail}
          placeholder="you@email.com"
          type="email"
          icon={<Mail size={18} />}
        />
        <OutlinedInput
          label={t('login.password')}
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          passwordToggle
          icon={<Lock size={18} />}
        />
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-bold text-coral">
            {t('login.forgot')}
          </Link>
        </div>
        <GradientButton showArrow onClick={handleLogin}>
          {t('login.signIn')}
        </GradientButton>
      </Card>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <GradientButton variant="secondary" onClick={() => demoLogin('AccountHolder')}>
          {t('login.demoPatient')}
        </GradientButton>
        <GradientButton variant="secondary" onClick={() => demoLogin('Nurse')}>
          {t('login.demoNurse')}
        </GradientButton>
      </div>

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-semibold text-muted">{t('login.orContinue')}</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="flex justify-center gap-3">
        {SSO.map((s) => (
          <button
            key={s.name}
            type="button"
            onClick={() =>
              showToast({ type: 'info', message: t('login.ssoDemo', { name: s.name }) })
            }
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-white shadow-sm"
          >
            <img src={s.src} alt={s.name} className="h-6 w-6 object-contain" />
          </button>
        ))}
      </div>

      <p className="mt-4 pb-2 text-center text-sm font-medium text-muted">
        {t('login.newTo')}{' '}
        <Link to="/signup" className="font-bold text-seafoam-deep">
          {t('login.createAccount')}
        </Link>
      </p>
    </Screen>
  )
}
