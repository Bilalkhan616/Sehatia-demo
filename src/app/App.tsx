import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import { PhoneFrame, TabBar, ToastHost } from '@/ui'

import { SplashScreen } from '@/screens/unauth/SplashScreen'
import { LoginScreen } from '@/screens/unauth/LoginScreen'
import { LoginSelectionScreen } from '@/screens/unauth/LoginSelectionScreen'
import { SignUpSelectionScreen } from '@/screens/unauth/SignUpSelectionScreen'
import { ForgotPasswordScreen } from '@/screens/unauth/ForgotPasswordScreen'
import { VerifyOtpScreen } from '@/screens/unauth/VerifyOtpScreen'
import { ChangePasswordScreen } from '@/screens/unauth/ChangePasswordScreen'
import {
  NurseAvailabilityScreen,
  NurseBankingScreen,
  NurseCheckScreen,
  NurseEducationScreen,
  NurseExperienceScreen,
  NurseInfoScreen,
  NurseReferenceScreen,
  NurseServicesScreen,
  NurseSignUpScreen,
} from '@/screens/unauth/NurseSignupScreens'
import {
  AddAccountHolderScreen,
  AddPatientSignupScreen,
  AddPlanWithPaymentScreen,
  ChoosePlanScreen,
  ConfirmPlanScreen,
  PatientCheckUpScreen,
  PatientEmailPasswordScreen,
  PatientServiceSelectionScreen,
  PatientSignUpScreen,
} from '@/screens/unauth/PatientSignupScreens'

import {
  AddNewPatientScreen,
  PatientSelectionScreen,
} from '@/screens/patient/PatientSelectionScreen'
import { PatientDashboardScreen } from '@/screens/patient/PatientDashboardScreen'
import {
  AddAnotherBookingScreen,
  BookingCompletedScreen,
  BookingScreen,
  BookingSummaryScreen,
  FindNurseScreen,
  InitialPaymentScreen,
  NurseSuggestionScreen,
  PatientWalletScreen,
  PaymentScreen,
  WalletTopUpScreen,
} from '@/screens/patient/BookingScreens'
import {
  AppointmentReviewScreen,
  InnerBookingScreen,
  PatientAppointmentInfoScreen,
  PatientAppointmentSelectionScreen,
  PatientAppointmentsScreen,
  PatientCancelReasonScreen,
  PatientChatMessageScreen,
  PatientChatScreen,
  PatientProfileScreen,
  SettingsScreen,
  UpdatePatientScreen,
  UpdatePlanScreen,
} from '@/screens/patient/PatientOtherScreens'

import {
  NurseDashboardScreen,
  NurseRequestScreen,
  NurseWalletScreen,
} from '@/screens/nurse/NurseMainScreens'
import {
  InnerAppointmentScreen,
  NurseAppointmentInfoScreen,
  NurseAppointmentsScreen,
  NurseCancelReasonScreen,
  NurseChatMessageScreen,
  NurseChatScreen,
  NurseProfileScreen,
  UpdateEducationScreen,
  UpdateExperienceScreen,
  UpdatePreferenceScreen,
  UpdateReferenceScreen,
  UpdateServicesScreen,
  UpdateShiftScreen,
} from '@/screens/nurse/NurseOtherScreens'

function UnauthOnly({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  const user = useAppStore((s) => s.user)
  if (isAuthenticated && user?.userType === 'Nurse') {
    return <Navigate to="/nurse/dashboard" replace />
  }
  if (isAuthenticated && user?.userType === 'AccountHolder') {
    const selected = useAppStore.getState().selectedPatientId
    return <Navigate to={selected ? '/patient/dashboard' : '/patient/select'} replace />
  }
  return <>{children}</>
}

function NurseGate({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  const user = useAppStore((s) => s.user)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.userType !== 'Nurse') return <Navigate to="/patient/select" replace />
  return <>{children}</>
}

function PatientGate({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  const user = useAppStore((s) => s.user)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.userType !== 'AccountHolder') return <Navigate to="/nurse/dashboard" replace />
  return <>{children}</>
}

function NurseLayout() {
  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <Outlet />
      </div>
      <TabBar role="nurse" />
      <ToastHost />
    </div>
  )
}

function PatientLayout() {
  const location = useLocation()
  const selectedPatientId = useAppStore((s) => s.selectedPatientId)
  // Force select if no patient (except select / add-patient)
  if (
    !selectedPatientId &&
    !location.pathname.startsWith('/patient/select') &&
    !location.pathname.startsWith('/patient/add-patient')
  ) {
    return <Navigate to="/patient/select" replace />
  }

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <Outlet />
      </div>
      <TabBar role="patient" />
      <ToastHost />
    </div>
  )
}

function UnauthLayout() {
  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <Outlet />
      <ToastHost />
    </div>
  )
}

export default function App() {
  return (
    <PhoneFrame>
      <Routes>
        <Route
          element={
            <UnauthOnly>
              <UnauthLayout />
            </UnauthOnly>
          }
        >
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/login-selection" element={<LoginSelectionScreen />} />
          <Route path="/signup" element={<SignUpSelectionScreen />} />
          <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
          <Route path="/verify-otp" element={<VerifyOtpScreen />} />
          <Route path="/change-password" element={<ChangePasswordScreen />} />

          <Route path="/signup/nurse" element={<NurseSignUpScreen />} />
          <Route path="/signup/nurse/info" element={<NurseInfoScreen />} />
          <Route path="/signup/nurse/education" element={<NurseEducationScreen />} />
          <Route path="/signup/nurse/experience" element={<NurseExperienceScreen />} />
          <Route path="/signup/nurse/reference" element={<NurseReferenceScreen />} />
          <Route path="/signup/nurse/check" element={<NurseCheckScreen />} />
          <Route path="/signup/nurse/banking" element={<NurseBankingScreen />} />
          <Route path="/signup/nurse/availability" element={<NurseAvailabilityScreen />} />
          <Route path="/signup/nurse/services" element={<NurseServicesScreen />} />

          <Route path="/signup/patient" element={<PatientSignUpScreen />} />
          <Route path="/signup/patient/services" element={<PatientServiceSelectionScreen />} />
          <Route path="/signup/patient/checkup" element={<PatientCheckUpScreen />} />
          <Route path="/signup/patient/credentials" element={<PatientEmailPasswordScreen />} />
          <Route path="/signup/patient/holder" element={<AddAccountHolderScreen />} />
          <Route path="/signup/patient/add-patient" element={<AddPatientSignupScreen />} />
          <Route path="/signup/patient/plan" element={<ChoosePlanScreen />} />
          <Route path="/signup/patient/confirm-plan" element={<ConfirmPlanScreen />} />
          <Route path="/signup/patient/payment" element={<AddPlanWithPaymentScreen />} />
        </Route>

        <Route
          path="/nurse"
          element={
            <NurseGate>
              <NurseLayout />
            </NurseGate>
          }
        >
          <Route path="dashboard" element={<NurseDashboardScreen />} />
          <Route path="dashboard/wallet" element={<NurseWalletScreen />} />
          <Route path="requests" element={<NurseRequestScreen />} />
          <Route path="appointments" element={<NurseAppointmentsScreen />} />
          <Route path="appointments/:id" element={<NurseAppointmentInfoScreen />} />
          <Route path="appointments/:id/inner" element={<InnerAppointmentScreen />} />
          <Route path="appointments/:id/cancel" element={<NurseCancelReasonScreen />} />
          <Route path="messages" element={<NurseChatScreen />} />
          <Route path="messages/:id" element={<NurseChatMessageScreen />} />
          <Route path="profile" element={<NurseProfileScreen />} />
          <Route path="profile/education" element={<UpdateEducationScreen />} />
          <Route path="profile/experience" element={<UpdateExperienceScreen />} />
          <Route path="profile/reference" element={<UpdateReferenceScreen />} />
          <Route path="profile/preference" element={<UpdatePreferenceScreen />} />
          <Route path="profile/services" element={<UpdateServicesScreen />} />
          <Route path="profile/shifts" element={<UpdateShiftScreen />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        <Route
          path="/patient"
          element={
            <PatientGate>
              <PatientLayout />
            </PatientGate>
          }
        >
          <Route path="select" element={<PatientSelectionScreen />} />
          <Route path="add-patient" element={<AddNewPatientScreen />} />
          <Route path="dashboard" element={<PatientDashboardScreen />} />
          <Route path="dashboard/wallet" element={<PatientWalletScreen />} />
          <Route path="dashboard/settings" element={<SettingsScreen />} />
          <Route path="dashboard/plan" element={<UpdatePlanScreen />} />
          <Route path="dashboard/suggest" element={<NurseSuggestionScreen />} />
          <Route path="booking" element={<BookingScreen />} />
          <Route path="booking/find" element={<FindNurseScreen />} />
          <Route path="booking/summary" element={<BookingSummaryScreen />} />
          <Route path="booking/payment" element={<PaymentScreen />} />
          <Route path="booking/wallet" element={<WalletTopUpScreen />} />
          <Route path="booking/initial-payment" element={<InitialPaymentScreen />} />
          <Route path="booking/completed" element={<BookingCompletedScreen />} />
          <Route path="booking/another" element={<AddAnotherBookingScreen />} />
          <Route path="booking/suggest" element={<NurseSuggestionScreen />} />
          <Route path="appointments" element={<PatientAppointmentsScreen />} />
          <Route path="appointments/select" element={<PatientAppointmentSelectionScreen />} />
          <Route path="appointments/:id" element={<PatientAppointmentInfoScreen />} />
          <Route path="appointments/:id/inner" element={<InnerBookingScreen />} />
          <Route path="appointments/:id/cancel" element={<PatientCancelReasonScreen />} />
          <Route path="appointments/:id/review" element={<AppointmentReviewScreen />} />
          <Route path="messages" element={<PatientChatScreen />} />
          <Route path="messages/:id" element={<PatientChatMessageScreen />} />
          <Route path="profile" element={<PatientProfileScreen />} />
          <Route path="profile/update" element={<UpdatePatientScreen />} />
          <Route index element={<Navigate to="select" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PhoneFrame>
  )
}
