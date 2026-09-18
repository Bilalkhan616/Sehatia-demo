import { motion } from 'framer-motion'
import { Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import {
  Card,
  GradientButton,
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
  const setPendingLogin = useAppStore((s) => s.setPendingLogin)
  const loginAs = useAppStore((s) => s.loginAs)
  const [email, setEmail] = useState('demo@sehatia.com')
  const [password, setPassword] = useState('demo1234')

  const handleLogin = () => {
    if (!email.trim()) {
      showToast({ type: 'danger', message: 'Please enter your email address' })
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast({ type: 'danger', message: 'Please enter a valid email address' })
      return
    }
    if (!password.trim()) {
      showToast({ type: 'danger', message: 'Please enter your password' })
      return
    }
    setPendingLogin(email, password)
    navigate('/login-selection')
  }

  const demoLogin = (role: 'Nurse' | 'AccountHolder') => {
    setPendingLogin(email || 'demo@sehatia.com', password || 'demo')
    loginAs(role)
    showToast({ type: 'success', message: 'Welcome to the Sehatia demo' })
    if (role === 'Nurse') navigate('/nurse/dashboard', { replace: true })
    else navigate('/patient/select', { replace: true })
  }

  return (
    <Screen>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center pt-2"
      >
        <Monogram size="md" />
        <h1 className="mt-3 text-3xl font-extrabold text-ink">Sehatia</h1>
      </motion.div>

      <div className="mt-4">
        <h2 className="text-2xl font-extrabold text-ink">Welcome back</h2>
        <p className="mt-1 text-sm font-medium text-muted">
          Sign in to manage care, bookings, and messages
        </p>
      </div>

      <Card className="mt-4 space-y-3">
        <OutlinedInput
          label="Email"
          value={email}
          onChange={setEmail}
          placeholder="you@email.com"
          type="email"
          icon={<Mail size={18} />}
        />
        <OutlinedInput
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          passwordToggle
          icon={<Lock size={18} />}
        />
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-bold text-coral">
            Forgot password?
          </Link>
        </div>
        <GradientButton showArrow onClick={handleLogin}>
          Sign in
        </GradientButton>
      </Card>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <GradientButton variant="secondary" onClick={() => demoLogin('AccountHolder')}>
          Demo Patient
        </GradientButton>
        <GradientButton variant="secondary" onClick={() => demoLogin('Nurse')}>
          Demo Nurse
        </GradientButton>
      </div>

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-semibold text-muted">or continue with</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="flex justify-center gap-3">
        {SSO.map((s) => (
          <button
            key={s.name}
            type="button"
            onClick={() =>
              showToast({ type: 'info', message: `${s.name} sign-in is demo-only` })
            }
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-white shadow-sm"
          >
            <img src={s.src} alt={s.name} className="h-6 w-6 object-contain" />
          </button>
        ))}
      </div>

      <p className="mt-4 pb-2 text-center text-sm font-medium text-muted">
        New to Sehatia?{' '}
        <Link to="/signup" className="font-bold text-seafoam-deep">
          Create account
        </Link>
      </p>
    </Screen>
  )
}
