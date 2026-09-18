import { uid } from '@/lib/utils'

export type UserType = 'Nurse' | 'AccountHolder'

export type Patient = {
  id: string
  name: string
  pin: string
  age: number
  gender: string
  condition?: string
}

export type Nurse = {
  id: string
  name: string
  specialty: string
  rating: number
  experienceYears: number
  rate: number
  avatar: string
  services: string[]
  languages: string[]
  available: boolean
  bio: string
}

export type BookingStatus = 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled'

export type Booking = {
  id: string
  patientId: string
  patientName: string
  nurseId?: string
  nurseName?: string
  service: string
  date: string
  time: string
  durationHours: number
  address: string
  amount: number
  status: BookingStatus
  notes?: string
}

export type Appointment = {
  id: string
  bookingId: string
  patientId: string
  patientName: string
  nurseId: string
  nurseName: string
  service: string
  date: string
  time: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  address: string
  amount: number
  rating?: number
  review?: string
  startedAt?: string
  completedAt?: string
  checklist?: {
    identity: boolean
    medications: boolean
    vitals: boolean
    notes: boolean
  }
}

export type ChatMessage = {
  id: string
  senderId: string
  text: string
  at: string
}

export type ChatThread = {
  id: string
  peerId: string
  peerName: string
  peerRole: UserType
  lastMessage: string
  updatedAt: string
  messages: ChatMessage[]
}

export type WalletTx = {
  id: string
  label: string
  amount: number
  type: 'credit' | 'debit'
  at: string
}

export type Plan = {
  id: string
  name: string
  price: number
  visits: number
  description: string
  image: string
}

export const SERVICES = [
  'Wound Care',
  'IV Therapy',
  'Elderly Care',
  'Post-Surgery Care',
  'Medication Management',
  'Physiotherapy Assist',
  'Maternity Care',
  'Pediatric Care',
]

export const SHIFTS = ['Morning', 'Afternoon', 'Evening', 'Night', 'Flexible']
export const LANGUAGES = ['English', 'Arabic', 'Urdu', 'Hindi', 'Tagalog']
export const GENDERS = ['Male', 'Female']

export const PLANS: Plan[] = [
  {
    id: 'plan1',
    name: 'Starter Care',
    price: 499,
    visits: 4,
    description: '4 home visits / month — ideal for light support',
    image: '/images/plan1.png',
  },
  {
    id: 'plan2',
    name: 'Family Care',
    price: 899,
    visits: 8,
    description: '8 visits / month with priority booking',
    image: '/images/plan2.png',
  },
  {
    id: 'plan3',
    name: 'Premium Care',
    price: 1499,
    visits: 16,
    description: '16 visits + dedicated care coordinator',
    image: '/images/plan3.png',
  },
  {
    id: 'plan4',
    name: 'Unlimited',
    price: 2499,
    visits: 99,
    description: 'Unlimited visits for complex care needs',
    image: '/images/plan4.png',
  },
]

export const seedNurses: Nurse[] = [
  {
    id: 'nurse_1',
    name: 'Sara Al-Harbi',
    specialty: 'Elderly Care',
    rating: 4.9,
    experienceYears: 8,
    rate: 180,
    avatar: '/images/nurseW.png',
    services: ['Elderly Care', 'Medication Management', 'Wound Care'],
    languages: ['Arabic', 'English'],
    available: true,
    bio: 'Compassionate RN specializing in geriatric home care.',
  },
  {
    id: 'nurse_2',
    name: 'Fatima Rahman',
    specialty: 'Wound Care',
    rating: 4.8,
    experienceYears: 6,
    rate: 160,
    avatar: '/images/nurse.png',
    services: ['Wound Care', 'Post-Surgery Care', 'IV Therapy'],
    languages: ['English', 'Urdu', 'Arabic'],
    available: true,
    bio: 'Certified wound-care specialist with hospital background.',
  },
  {
    id: 'nurse_3',
    name: 'Aisha Noor',
    specialty: 'Maternity Care',
    rating: 4.7,
    experienceYears: 5,
    rate: 170,
    avatar: '/images/nurseW.png',
    services: ['Maternity Care', 'Pediatric Care', 'Medication Management'],
    languages: ['Arabic', 'English'],
    available: true,
    bio: 'Warm and skilled in postpartum and newborn support.',
  },
  {
    id: 'nurse_4',
    name: 'Layla Hassan',
    specialty: 'IV Therapy',
    rating: 4.6,
    experienceYears: 7,
    rate: 190,
    avatar: '/images/nurse.png',
    services: ['IV Therapy', 'Medication Management', 'Post-Surgery Care'],
    languages: ['English', 'Arabic', 'Tagalog'],
    available: false,
    bio: 'ICU-trained nurse available for complex infusions.',
  },
]

export const seedPatients: Patient[] = [
  {
    id: 'patient_1',
    name: 'Omar Abdullah',
    pin: '1234',
    age: 72,
    gender: 'Male',
    condition: 'Diabetes management',
  },
  {
    id: 'patient_2',
    name: 'Noura Al-Saud',
    pin: '1234',
    age: 34,
    gender: 'Female',
    condition: 'Postpartum recovery',
  },
]

export function createSeedBookings(): Booking[] {
  return [
    {
      id: 'booking_1',
      patientId: 'patient_1',
      patientName: 'Omar Abdullah',
      nurseId: 'nurse_1',
      nurseName: 'Sara Al-Harbi',
      service: 'Elderly Care',
      date: '2026-09-20',
      time: '10:00',
      durationHours: 3,
      address: 'Riyadh, Al Olaya Dist.',
      amount: 540,
      status: 'pending',
      notes: 'Needs glucose check and light physiotherapy.',
    },
    {
      id: 'booking_2',
      patientId: 'patient_2',
      patientName: 'Noura Al-Saud',
      nurseId: 'nurse_3',
      nurseName: 'Aisha Noor',
      service: 'Maternity Care',
      date: '2026-09-22',
      time: '14:00',
      durationHours: 2,
      address: 'Jeddah, Al Zahra',
      amount: 340,
      status: 'accepted',
    },
  ]
}

export function createSeedAppointments(): Appointment[] {
  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10)
  return [
    {
      id: 'appt_ongoing',
      bookingId: 'booking_ongoing',
      patientId: 'patient_1',
      patientName: 'Omar Abdullah',
      nurseId: 'nurse_1',
      nurseName: 'Sara Al-Harbi',
      service: 'Elderly Care',
      date: todayStr,
      time: '09:00',
      status: 'ongoing',
      address: 'Riyadh, Al Olaya Dist.',
      amount: 540,
      startedAt: new Date(Date.now() - 45 * 60000).toISOString(),
      checklist: {
        identity: true,
        medications: true,
        vitals: false,
        notes: false,
      },
    },
    {
      id: 'appt_1',
      bookingId: 'booking_2',
      patientId: 'patient_2',
      patientName: 'Noura Al-Saud',
      nurseId: 'nurse_3',
      nurseName: 'Aisha Noor',
      service: 'Maternity Care',
      date: '2026-09-22',
      time: '14:00',
      status: 'upcoming',
      address: 'Jeddah, Al Zahra',
      amount: 340,
    },
    {
      id: 'appt_2',
      bookingId: 'booking_old',
      patientId: 'patient_1',
      patientName: 'Omar Abdullah',
      nurseId: 'nurse_1',
      nurseName: 'Sara Al-Harbi',
      service: 'Medication Management',
      date: '2026-09-10',
      time: '11:00',
      status: 'completed',
      address: 'Riyadh, Al Olaya Dist.',
      amount: 360,
      rating: 5,
      review: 'Excellent care, very professional.',
      completedAt: '2026-09-10T12:30:00.000Z',
    },
  ]
}

export function createSeedChats(): ChatThread[] {
  return [
    {
      id: 'chat_1',
      peerId: 'nurse_1',
      peerName: 'Sara Al-Harbi',
      peerRole: 'Nurse',
      lastMessage: 'I can arrive at 10 AM tomorrow.',
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      messages: [
        {
          id: uid('msg'),
          senderId: 'account_1',
          text: 'Hi Sara, confirming tomorrow’s visit for Omar.',
          at: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: uid('msg'),
          senderId: 'nurse_1',
          text: 'I can arrive at 10 AM tomorrow.',
          at: new Date(Date.now() - 3600000).toISOString(),
        },
      ],
    },
    {
      id: 'chat_2',
      peerId: 'account_1',
      peerName: 'Maha Account Holder',
      peerRole: 'AccountHolder',
      lastMessage: 'Thank you for accepting the booking!',
      updatedAt: new Date(Date.now() - 1800000).toISOString(),
      messages: [
        {
          id: uid('msg'),
          senderId: 'account_1',
          text: 'Thank you for accepting the booking!',
          at: new Date(Date.now() - 1800000).toISOString(),
        },
      ],
    },
  ]
}

export function createSeedWallet(): { balance: number; txs: WalletTx[] } {
  return {
    balance: 2500,
    txs: [
      {
        id: uid('tx'),
        label: 'Wallet top-up',
        amount: 3000,
        type: 'credit',
        at: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: uid('tx'),
        label: 'Appointment — Sara Al-Harbi',
        amount: 360,
        type: 'debit',
        at: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: uid('tx'),
        label: 'Promo credit',
        amount: 100,
        type: 'credit',
        at: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
  }
}
