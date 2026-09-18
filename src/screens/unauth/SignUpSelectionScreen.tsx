import { useNavigate } from 'react-router-dom'
import { Card, Header, Monogram, Screen } from '@/ui'

export function SignUpSelectionScreen() {
  const navigate = useNavigate()

  return (
    <Screen>
      <Header title="Sign up" />
      <div className="mb-6 flex flex-col items-center">
        <Monogram />
        <h2 className="mt-3 text-xl font-extrabold text-ink">Join Sehatia</h2>
        <p className="mt-1 text-center text-sm text-muted">
          Choose how you want to get started
        </p>
      </div>

      <Card className="mb-3" onClick={() => navigate('/signup/nurse')}>
        <div className="flex items-center gap-4">
          <img src="/images/nurseW.png" alt="" className="h-14 w-14 rounded-2xl bg-mist object-contain p-1" />
          <div>
            <p className="font-extrabold text-ink">Sign up as a Nurse</p>
            <p className="text-xs text-muted">Offer home nursing services</p>
          </div>
        </div>
      </Card>

      <Card onClick={() => navigate('/signup/patient')}>
        <div className="flex items-center gap-4">
          <img src="/images/patientW.png" alt="" className="h-14 w-14 rounded-2xl bg-sky-soft object-contain p-1" />
          <div>
            <p className="font-extrabold text-ink">Sign up as a Patient</p>
            <p className="text-xs text-muted">Book trusted care at home</p>
          </div>
        </div>
      </Card>
    </Screen>
  )
}
