export const colors = {
  seafoam: '#2D9F8F',
  seafoamDeep: '#1B7A6E',
  sky: '#5B9BD5',
  mid: '#3BA8C9',
  coral: '#E8846B',
  cream: '#F5F9FC',
  mist: '#E6F3F0',
  skySoft: '#DCEEF8',
  ink: '#163A3A',
  muted: '#6A8080',
  border: '#D5E5E2',
  white: '#FFFFFF',
} as const

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-SA', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatRelativeTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

export function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}
