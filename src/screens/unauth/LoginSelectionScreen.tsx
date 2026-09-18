import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import { Card, GradientButton, Header, Monogram, Screen, showToast } from '@/ui'

export function LoginSelectionScreen() {
  const navigate = useNavigate()
  const loginAs = useAppStore((s) => s.loginAs)
  const pending = useAppStore((s) => s.pendingLogin)

  const choose = (role: 'Nurse' | 'AccountHolder') => {
    if (!pending?.email) {
      showToast({ type: 'danger', message: 'Please sign in with email first' })
      navigate('/login')
      return
    }
    loginAs(role)
    showToast({ type: 'success', message: 'Login successful! Welcome back.' })
    if (role === 'Nurse') navigate('/nurse/dashboard', { replace: true })
    else navigate('/patient/select', { replace: true })
  }

  return (
    <Screen>
      <Header title="Choose role" />
      <div className="mb-6 flex flex-col items-center">
        <Monogram />
        <h2 className="mt-3 text-xl font-extrabold text-ink">Continue as</h2>
        <p className="mt-1 text-center text-sm text-muted">
          Signed in as {pending?.email || 'guest'}
        </p>
      </div>

      <Card className="mb-3" onClick={() => choose('Nurse')} padding>
        <div className="flex items-center gap-4">
          <img src="/images/nurseW.png" alt="" className="h-14 w-14 rounded-2xl object-contain bg-mist p-1" />
          <div>
            <p className="font-extrabold text-ink">Nurse</p>
            <p className="text-xs text-muted">Manage requests, appointments & earnings</p>
          </div>
        </div>
      </Card>

      <Card className="mb-6" onClick={() => choose('AccountHolder')} padding>
        <div className="flex items-center gap-4">
          <img src="/images/patientW.png" alt="" className="h-14 w-14 rounded-2xl object-contain bg-sky-soft p-1" />
          <div>
            <p className="font-extrabold text-ink">Patient / Account Holder</p>
            <p className="text-xs text-muted">Book care, manage patients & wallet</p>
          </div>
        </div>
      </Card>

      <GradientButton variant="ghost" onClick={() => navigate('/login')}>
        Back to sign in
      </GradientButton>
    </Screen>
  )
}
