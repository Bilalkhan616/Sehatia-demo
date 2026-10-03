import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ageFromDob, uid } from '@/lib/utils'
import {
  type Appointment,
  type Booking,
  type ChatThread,
  type Nurse,
  type Patient,
  type Plan,
  type UserType,
  type WalletTx,
  PLANS,
  seedNurses,
  seedPatients,
  createSeedAppointments,
  createSeedBookings,
  createSeedChats,
  createSeedWallet,
} from '@/data/seed'

export type BookingDraft = {
  patientId: string
  patientName: string
  service: string
  date: string
  time: string
  durationHours: number
  address: string
  notes: string
  nurseId?: string
  nurseName?: string
  amount?: number
  lockNurse?: boolean
}

export type NurseSignupDraft = {
  email: string
  password: string
  fullName: string
  phone: string
  gender: string
  dob: string
  city: string
}

export type PatientSignupDraft = {
  email: string
  password: string
  name: string
  phone: string
  gender: string
  dob: string
  city: string
}

export type RegisteredAccount = {
  email: string
  password: string
  name: string
  userType: UserType
  entityId: string
}

type AuthUser = {
  id: string
  email: string
  name: string
  userType: UserType
}

type AppState = {
  isAuthenticated: boolean
  user: AuthUser | null
  selectedPatientId: string | null
  patients: Patient[]
  nurses: Nurse[]
  bookings: Booking[]
  appointments: Appointment[]
  chats: ChatThread[]
  walletBalance: number
  walletTxs: WalletTx[]
  nurseWalletBalance: number
  activePlanId: string
  bookingDraft: BookingDraft | null
  nurseSignup: NurseSignupDraft
  patientSignup: PatientSignupDraft
  pendingLogin: { email: string; password: string } | null
  registeredAccounts: RegisteredAccount[]
  dismissNurseProfilePrompt: boolean

  setPendingLogin: (email: string, password: string) => void
  loginAs: (role: UserType) => void
  logout: () => void
  selectPatient: (id: string) => void
  addPatient: (p: Omit<Patient, 'id'>) => string
  updatePatient: (id: string, patch: Partial<Patient>) => void

  setBookingDraft: (d: Partial<BookingDraft> & { patientId: string; patientName: string }) => void
  clearBookingDraft: () => void
  createBookingFromDraft: () => string | null
  acceptBooking: (id: string) => void
  declineBooking: (id: string) => void
  payBooking: (id: string, method: 'wallet' | 'card') => boolean
  startReschedule: (appointmentId: string) => boolean
  cancelAppointment: (id: string, reason: string) => void
  startAppointment: (id: string) => void
  completeAppointment: (id: string) => void
  toggleChecklistItem: (
    id: string,
    key: 'identity' | 'medications' | 'vitals' | 'notes',
  ) => void
  reviewAppointment: (id: string, rating: number, review: string) => void

  sendMessage: (threadId: string, text: string) => void
  ensureChatWith: (peerId: string, peerName: string, peerRole: UserType) => string

  topUpWallet: (amount: number) => void
  payFromWallet: (amount: number, label: string) => boolean

  updateNurseSignup: (patch: Partial<NurseSignupDraft>) => void
  resetNurseSignup: () => void
  completeNurseSignup: () => void

  updatePatientSignup: (patch: Partial<PatientSignupDraft>) => void
  resetPatientSignup: () => void
  completePatientSignup: () => void

  setActivePlan: (planId: string) => void
  updateNurseProfile: (patch: Partial<Nurse>) => void
  setNurseAvailable: (available: boolean) => void
  setDismissNurseProfilePrompt: (v: boolean) => void
  getCurrentNurse: () => Nurse | undefined
  getPlans: () => Plan[]
}

const emptyNurseSignup = (): NurseSignupDraft => ({
  email: '',
  password: '',
  fullName: '',
  phone: '',
  gender: 'Female',
  dob: '',
  city: '',
})

const emptyPatientSignup = (): PatientSignupDraft => ({
  email: '',
  password: '',
  name: '',
  phone: '',
  gender: 'Female',
  dob: '',
  city: '',
})

const wallet = createSeedWallet()

function currentNurseId(state: { user: AuthUser | null; nurses: Nurse[] }) {
  if (state.user?.userType !== 'Nurse') return undefined
  if (state.nurses.some((n) => n.id === state.user?.id)) return state.user.id
  return state.nurses[0]?.id
}

export function isNurseHireReady(n: {
  education?: string
  experience?: string
  services?: string[]
  availability?: string[]
}) {
  return Boolean(
    n.education?.trim() &&
      n.experience?.trim() &&
      n.services?.length &&
      n.availability?.length,
  )
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      selectedPatientId: null,
      patients: seedPatients,
      nurses: seedNurses,
      bookings: createSeedBookings(),
      appointments: createSeedAppointments(),
      chats: createSeedChats(),
      walletBalance: wallet.balance,
      walletTxs: wallet.txs,
      nurseWalletBalance: 1840,
      activePlanId: 'plan2',
      bookingDraft: null,
      nurseSignup: emptyNurseSignup(),
      patientSignup: emptyPatientSignup(),
      pendingLogin: null,
      registeredAccounts: [],
      dismissNurseProfilePrompt: false,

      setPendingLogin: (email, password) => set({ pendingLogin: { email, password } }),

      loginAs: (role) => {
        const pending = get().pendingLogin
        const email = pending?.email || 'demo@sehatia.com'
        const registered = get().registeredAccounts.find(
          (a) => a.email.toLowerCase() === email.toLowerCase() && a.userType === role,
        )

        if (role === 'Nurse') {
          const nurse =
            get().nurses.find((n) => n.id === registered?.entityId) ||
            get().nurses.find((n) => n.email?.toLowerCase() === email.toLowerCase()) ||
            get().nurses.find((n) => n.id === 'nurse_1') ||
            get().nurses[0]
          set({
            isAuthenticated: true,
            user: {
              id: nurse?.id || 'nurse_1',
              email,
              name: registered?.name || nurse?.name || 'Sara Al-Harbi',
              userType: 'Nurse',
            },
            pendingLogin: null,
            selectedPatientId: null,
            dismissNurseProfilePrompt: false,
          })
        } else {
          set({
            isAuthenticated: true,
            user: {
              id: registered?.entityId || 'account_1',
              email,
              name: registered?.name || 'Maha Account Holder',
              userType: 'AccountHolder',
            },
            pendingLogin: null,
            selectedPatientId: null,
          })
        }
      },

      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
          selectedPatientId: null,
          bookingDraft: null,
          pendingLogin: null,
          dismissNurseProfilePrompt: false,
        }),

      selectPatient: (id) => set({ selectedPatientId: id }),

      addPatient: (p) => {
        const id = uid('patient')
        set((s) => ({ patients: [...s.patients, { ...p, id }] }))
        return id
      },

      updatePatient: (id, patch) =>
        set((s) => ({
          patients: s.patients.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),

      setBookingDraft: (d) =>
        set((s) => ({
          bookingDraft: {
            service: '',
            date: '',
            time: '',
            durationHours: 2,
            address: '',
            notes: '',
            ...s.bookingDraft,
            ...d,
          },
        })),

      clearBookingDraft: () => set({ bookingDraft: null }),

      createBookingFromDraft: () => {
        const draft = get().bookingDraft
        if (!draft?.nurseId || !draft.service) return null
        const nurse = get().nurses.find((n) => n.id === draft.nurseId)
        const amount = (nurse?.rate ?? 150) * draft.durationHours
        const id = uid('booking')
        const booking: Booking = {
          id,
          patientId: draft.patientId,
          patientName: draft.patientName,
          nurseId: draft.nurseId,
          nurseName: draft.nurseName ?? nurse?.name,
          service: draft.service,
          date: draft.date,
          time: draft.time,
          durationHours: draft.durationHours,
          address: draft.address,
          amount,
          status: 'pending',
          notes: draft.notes,
        }
        set((s) => ({ bookings: [booking, ...s.bookings], bookingDraft: null }))
        return id
      },

      acceptBooking: (id) => {
        const booking = get().bookings.find((b) => b.id === id)
        if (!booking) return
        set((s) => ({
          bookings: s.bookings.map((b) =>
            b.id === id ? { ...b, status: 'awaiting_payment' as const } : b,
          ),
        }))
      },

      declineBooking: (id) =>
        set((s) => ({
          bookings: s.bookings.map((b) =>
            b.id === id ? { ...b, status: 'declined' as const } : b,
          ),
        })),

      payBooking: (id, method) => {
        const booking = get().bookings.find((b) => b.id === id)
        if (!booking || booking.status !== 'awaiting_payment') return false
        if (method === 'wallet') {
          const ok = get().payFromWallet(booking.amount, `Booking — ${booking.nurseName}`)
          if (!ok) return false
        }
        set((s) => ({
          bookings: s.bookings.map((b) =>
            b.id === id ? { ...b, status: 'confirmed' as const } : b,
          ),
          appointments: [
            {
              id: uid('appt'),
              bookingId: id,
              patientId: booking.patientId,
              patientName: booking.patientName,
              nurseId: booking.nurseId || 'nurse_1',
              nurseName: booking.nurseName || 'Nurse',
              service: booking.service,
              date: booking.date,
              time: booking.time,
              status: 'upcoming' as const,
              address: booking.address,
              amount: booking.amount,
            },
            ...s.appointments,
          ],
        }))
        return true
      },

      startReschedule: (appointmentId) => {
        const appt = get().appointments.find((a) => a.id === appointmentId)
        const patientId = get().selectedPatientId
        if (!appt) return false
        const nurse = get().nurses.find((n) => n.id === appt.nurseId)
        set({
          bookingDraft: {
            patientId: patientId || appt.patientId,
            patientName:
              get().patients.find((p) => p.id === (patientId || appt.patientId))?.name ||
              appt.patientName,
            service: appt.service,
            date: '',
            time: '',
            durationHours: 2,
            address: appt.address,
            notes: '',
            nurseId: appt.nurseId,
            nurseName: appt.nurseName,
            amount: (nurse?.rate ?? appt.amount) * 2,
            lockNurse: true,
          },
        })
        return true
      },

      cancelAppointment: (id) =>
        set((s) => ({
          appointments: s.appointments.map((a) =>
            a.id === id ? { ...a, status: 'cancelled' as const } : a,
          ),
        })),

      startAppointment: (id) =>
        set((s) => ({
          appointments: s.appointments.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status: 'ongoing' as const,
                  startedAt: new Date().toISOString(),
                  checklist: a.checklist ?? {
                    identity: false,
                    medications: false,
                    vitals: false,
                    notes: false,
                  },
                }
              : a,
          ),
        })),

      completeAppointment: (id) =>
        set((s) => ({
          appointments: s.appointments.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status: 'completed' as const,
                  completedAt: new Date().toISOString(),
                }
              : a,
          ),
          bookings: s.bookings.map((b) => {
            const appt = s.appointments.find((a) => a.id === id)
            return appt && b.id === appt.bookingId ? { ...b, status: 'completed' as const } : b
          }),
        })),

      toggleChecklistItem: (id, key) =>
        set((s) => ({
          appointments: s.appointments.map((a) => {
            if (a.id !== id) return a
            const checklist = a.checklist ?? {
              identity: false,
              medications: false,
              vitals: false,
              notes: false,
            }
            return {
              ...a,
              checklist: { ...checklist, [key]: !checklist[key] },
            }
          }),
        })),

      reviewAppointment: (id, rating, review) =>
        set((s) => ({
          appointments: s.appointments.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status: 'completed' as const,
                  rating,
                  review,
                  completedAt: a.completedAt ?? new Date().toISOString(),
                }
              : a,
          ),
        })),

      sendMessage: (threadId, text) => {
        const user = get().user
        if (!user || !text.trim()) return
        const msg = {
          id: uid('msg'),
          senderId: user.id,
          text: text.trim(),
          at: new Date().toISOString(),
        }
        set((s) => ({
          chats: s.chats.map((c) =>
            c.id === threadId
              ? {
                  ...c,
                  messages: [...c.messages, msg],
                  lastMessage: msg.text,
                  updatedAt: msg.at,
                }
              : c,
          ),
        }))
      },

      ensureChatWith: (peerId, peerName, peerRole) => {
        const existing = get().chats.find((c) => c.peerId === peerId)
        if (existing) return existing.id
        const id = uid('chat')
        set((s) => ({
          chats: [
            {
              id,
              peerId,
              peerName,
              peerRole,
              lastMessage: '',
              updatedAt: new Date().toISOString(),
              messages: [],
            },
            ...s.chats,
          ],
        }))
        return id
      },

      topUpWallet: (amount) =>
        set((s) => ({
          walletBalance: s.walletBalance + amount,
          walletTxs: [
            {
              id: uid('tx'),
              label: 'Wallet top-up',
              amount,
              type: 'credit' as const,
              at: new Date().toISOString(),
            },
            ...s.walletTxs,
          ],
        })),

      payFromWallet: (amount, label) => {
        if (get().walletBalance < amount) return false
        set((s) => ({
          walletBalance: s.walletBalance - amount,
          walletTxs: [
            {
              id: uid('tx'),
              label,
              amount,
              type: 'debit' as const,
              at: new Date().toISOString(),
            },
            ...s.walletTxs,
          ],
        }))
        return true
      },

      updateNurseSignup: (patch) =>
        set((s) => ({ nurseSignup: { ...s.nurseSignup, ...patch } })),
      resetNurseSignup: () => set({ nurseSignup: emptyNurseSignup() }),
      completeNurseSignup: () => {
        const d = get().nurseSignup
        const id = uid('nurse')
        set((s) => ({
          nurses: [
            {
              id,
              name: d.fullName || 'New Nurse',
              specialty: 'Home Care',
              rating: 5,
              experienceYears: 0,
              rate: 150,
              avatar: '/images/nurseW.png',
              services: [],
              languages: ['English'],
              available: false,
              profileComplete: false,
              email: d.email,
              phone: d.phone,
              gender: d.gender,
              dob: d.dob,
              city: d.city,
              bio: '',
            },
            ...s.nurses,
          ],
          registeredAccounts: [
            {
              email: d.email,
              password: d.password,
              name: d.fullName || 'New Nurse',
              userType: 'Nurse',
              entityId: id,
            },
            ...s.registeredAccounts,
          ],
          nurseSignup: emptyNurseSignup(),
        }))
      },

      updatePatientSignup: (patch) =>
        set((s) => ({ patientSignup: { ...s.patientSignup, ...patch } })),
      resetPatientSignup: () => set({ patientSignup: emptyPatientSignup() }),
      completePatientSignup: () => {
        const d = get().patientSignup
        const patientId = uid('patient')
        set((s) => ({
          patients: [
            {
              id: patientId,
              name: d.name || 'New Patient',
              age: ageFromDob(d.dob),
              gender: d.gender,
              dob: d.dob,
              phone: d.phone,
              city: d.city,
            },
            ...s.patients,
          ],
          registeredAccounts: [
            {
              email: d.email,
              password: d.password,
              name: d.name || 'New Patient',
              userType: 'AccountHolder',
              entityId: patientId,
            },
            ...s.registeredAccounts,
          ],
          patientSignup: emptyPatientSignup(),
        }))
      },

      setActivePlan: (planId) => set({ activePlanId: planId }),

      getCurrentNurse: () => {
        const s = get()
        const id = currentNurseId(s)
        return s.nurses.find((n) => n.id === id)
      },

      updateNurseProfile: (patch) => {
        const id = currentNurseId(get())
        if (!id) return
        set((s) => {
          let ready = false
          return {
            nurses: s.nurses.map((n) => {
              if (n.id !== id) return n
              const next = { ...n, ...patch }
              ready = isNurseHireReady(next)
              return {
                ...next,
                profileComplete: ready,
                available: ready ? (patch.available ?? (n.profileComplete ? next.available : true)) : false,
                specialty: next.services?.[0] || next.specialty,
              }
            }),
            dismissNurseProfilePrompt: ready ? true : s.dismissNurseProfilePrompt,
            user:
              s.user && patch.name
                ? { ...s.user, name: patch.name }
                : s.user,
          }
        })
      },

      setNurseAvailable: (available) => {
        const id = currentNurseId(get())
        if (!id) return
        set((s) => ({
          nurses: s.nurses.map((n) => (n.id === id ? { ...n, available } : n)),
        }))
      },

      setDismissNurseProfilePrompt: (v) => set({ dismissNurseProfilePrompt: v }),

      getPlans: () => PLANS,
    }),
    {
      name: 'sehatia-demo-store-v3',
      partialize: (s) => ({
        isAuthenticated: s.isAuthenticated,
        user: s.user,
        selectedPatientId: s.selectedPatientId,
        patients: s.patients,
        nurses: s.nurses,
        bookings: s.bookings,
        appointments: s.appointments,
        chats: s.chats,
        walletBalance: s.walletBalance,
        walletTxs: s.walletTxs,
        nurseWalletBalance: s.nurseWalletBalance,
        activePlanId: s.activePlanId,
        registeredAccounts: s.registeredAccounts,
      }),
    },
  ),
)
