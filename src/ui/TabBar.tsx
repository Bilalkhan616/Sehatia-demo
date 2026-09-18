import { NavLink, useLocation } from 'react-router-dom'
import {
  Calendar,
  Clock,
  LayoutDashboard,
  MessageCircle,
  User,
  BookOpen,
  ClipboardList,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Tab = {
  to: string
  label: string
  icon: React.ReactNode
}

const nurseTabs: Tab[] = [
  { to: '/nurse/requests', label: 'Calendar', icon: <Calendar size={20} /> },
  { to: '/nurse/appointments', label: 'Clock', icon: <Clock size={20} /> },
  { to: '/nurse/dashboard', label: 'Home', icon: <LayoutDashboard size={20} /> },
  { to: '/nurse/messages', label: 'Chat', icon: <MessageCircle size={20} /> },
  { to: '/nurse/profile', label: 'Profile', icon: <User size={20} /> },
]

const patientTabs: Tab[] = [
  { to: '/patient/booking', label: 'Book', icon: <BookOpen size={20} /> },
  { to: '/patient/appointments', label: 'Appts', icon: <ClipboardList size={20} /> },
  { to: '/patient/dashboard', label: 'Home', icon: <LayoutDashboard size={20} /> },
  { to: '/patient/messages', label: 'Chat', icon: <MessageCircle size={20} /> },
  { to: '/patient/profile', label: 'Profile', icon: <User size={20} /> },
]

type Props = {
  role: 'nurse' | 'patient'
}

export function TabBar({ role }: Props) {
  const location = useLocation()
  const tabs = role === 'nurse' ? nurseTabs : patientTabs
  const path = location.pathname

  const hide =
    path === '/patient/select' ||
    path === '/patient/add-patient' ||
    (path.startsWith('/patient/booking/') && path !== '/patient/booking') ||
    (path.startsWith('/patient/appointments/') && path !== '/patient/appointments') ||
    (path.startsWith('/patient/messages/') && path !== '/patient/messages') ||
    path.startsWith('/patient/profile/update') ||
    path.startsWith('/patient/dashboard/') ||
    (path.startsWith('/nurse/appointments/') && path !== '/nurse/appointments') ||
    (path.startsWith('/nurse/messages/') && path !== '/nurse/messages') ||
    (path.startsWith('/nurse/profile/') && path !== '/nurse/profile') ||
    path.startsWith('/nurse/dashboard/')

  if (hide) return null

  return (
    <nav className="shrink-0 border-t border-border/80 bg-white/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
      <div className="flex items-stretch justify-between">
        {tabs.map((tab) => {
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end
              className={() =>
                cn(
                  'flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] font-semibold transition',
                  path === tab.to || path.startsWith(tab.to + '/')
                    ? 'text-seafoam'
                    : 'text-muted',
                )
              }
            >
              <span
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-xl',
                  (path === tab.to || path.startsWith(tab.to + '/')) &&
                    'bg-mist text-seafoam',
                )}
              >
                {tab.icon}
              </span>
              {tab.label}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
