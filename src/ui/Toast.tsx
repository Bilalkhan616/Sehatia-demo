import { create } from 'zustand'
import { cn } from '@/lib/utils'

type ToastItem = {
  id: string
  type: 'success' | 'danger' | 'info'
  message: string
}

type ToastState = {
  toasts: ToastItem[]
  show: (t: Omit<ToastItem, 'id'>) => void
  dismiss: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  show: (t) => {
    const id = `toast_${Date.now()}`
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) }))
    }, 2800)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}))

export function showToast(t: Omit<ToastItem, 'id'>) {
  useToastStore.getState().show(t)
}

export function ToastHost() {
  const { toasts, dismiss } = useToastStore()
  return (
    <div className="pointer-events-none absolute inset-x-3 top-12 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => dismiss(t.id)}
          className={cn(
            'pointer-events-auto rounded-2xl px-4 py-3 text-left text-sm font-semibold text-white shadow-lg',
            t.type === 'success' && 'bg-seafoam',
            t.type === 'danger' && 'bg-coral',
            t.type === 'info' && 'bg-sky',
          )}
        >
          {t.message}
        </button>
      ))}
    </div>
  )
}
