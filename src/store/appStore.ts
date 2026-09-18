import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { uid } from '@/lib/utils'
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
}

export type NurseSignupDraft = {
  email: string
  password: string
  fullName: string
  phone: string
  gender: string
  city: string
  education: string
  experience: string
  reference: string
  license: string
  bankName: string
  iban: string
  availability: string[]
  services: string[]
  languages: string[]
}

export type PatientSignupDraft = {
  email: string
  password: string
  holderName: string
  phone: string
  gender: string
  city: string
  services: string[]
  checkupNotes: string
  patientName: string
  patientAge: string
  patientGender: string
  patientPin: string
  planId: string
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
  getPlans: () => Plan[]
}

const emptyNurseSignup = (): NurseSignupDraft => ({
  email: '',
  password: '',
  fullName: '',
  phone: '',
  gender: 'Female',
  city: '',
  education: '',
  experience: '',
  reference: '',
  license: '',
  bankName: '',
  iban: '',
  availability: [],
  services: [],
  languages: [],
})

const emptyPatientSignup = (): PatientSignupDraft => ({
  email: '',
  password: '',
  holderName: '',
  phone: '',
  gender: 'Female',
  city: '',
  services: [],
  checkupNotes: '',
  patientName: '',
  patientAge: '',
  patientGender: 'Male',
  patientPin: '1234',
  planId: 'plan2',
})

const wallet = createSeedWallet()

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

      setPendingLogin: (email, password) => set({ pendingLogin: { email, password } }),

      loginAs: (role) => {
        const pending = get().pendingLogin
        const email = pending?.email || 'demo@sehatia.com'
        if (role === 'Nurse') {
          set({
            isAuthenticated: true,
            user: {
              id: 'nurse_demo',
              email,
              name: 'Sara Al-Harbi',
              userType: 'Nurse',
            },
            pendingLogin: null,
            selectedPatientId: null,
          })
        } else {
          set({
            isAuthenticated: true,
            user: {
              id: 'account_1',
              email,
              name: 'Maha Account Holder',
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
        const amount = draft.amount ?? (nurse?.rate ?? 150) * draft.durationHours
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
            b.id === id ? { ...b, status: 'accepted' as const } : b,
          ),
          appointments: [
            {
              id: uid('appt'),
              bookingId: id,
              patientId: booking.patientId,
              patientName: booking.patientName,
              nurseId: booking.nurseId || 'nurse_demo',
              nurseName: booking.nurseName || get().user?.name || 'Nurse',
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
      },

      declineBooking: (id) =>
        set((s) => ({
          bookings: s.bookings.map((b) =>
            b.id === id ? { ...b, status: 'declined' as const } : b,
          ),
        })),

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
        set((s) => ({
          nurses: [
            {
              id: uid('nurse'),
              name: d.fullName || 'New Nurse',
              specialty: d.services[0] || 'Home Care',
              rating: 5,
              experienceYears: 1,
              rate: 150,
              avatar: '/images/nurseW.png',
              services: d.services,
              languages: d.languages.length ? d.languages : ['English'],
              available: true,
              bio: d.experience || 'New Sehatia nurse',
            },
            ...s.nurses,
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
              name: d.patientName || 'New Patient',
              pin: d.patientPin || '1234',
              age: Number(d.patientAge) || 40,
              gender: d.patientGender,
            },
            ...s.patients,
          ],
          activePlanId: d.planId || 'plan2',
          patientSignup: emptyPatientSignup(),
        }))
      },

      setActivePlan: (planId) => set({ activePlanId: planId }),

      updateNurseProfile: (patch) => {
        const user = get().user
        if (!user) return
        // Update demo nurse or first matching
        set((s) => ({
          nurses: s.nurses.map((n, i) =>
            i === 0 || n.id === 'nurse_1' ? { ...n, ...patch } : n,
          ),
        }))
      },

      getPlans: () => PLANS,
    }),
    {
      name: 'sehatia-demo-store-v2',
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
      }),
    },
  ),
)
