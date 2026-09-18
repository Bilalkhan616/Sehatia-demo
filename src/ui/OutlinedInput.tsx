import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  icon?: React.ReactNode
  error?: string
  className?: string
  passwordToggle?: boolean
}

export function OutlinedInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  icon,
  error,
  className,
  passwordToggle,
}: Props) {
  const [show, setShow] = useState(false)
  const inputType = passwordToggle ? (show ? 'text' : 'password') : type

  return (
    <label className={cn('block w-full', className)}>
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      <div
        className={cn(
          'flex items-center gap-2 rounded-2xl border bg-white px-3 py-3 transition',
          error ? 'border-coral' : 'border-border focus-within:border-seafoam',
        )}
      >
        {icon ? <span className="text-seafoam">{icon}</span> : null}
        <input
          className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-muted"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={inputType}
          placeholder={placeholder}
        />
        {passwordToggle ? (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="text-muted"
            aria-label="Toggle password"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        ) : null}
      </div>
      {error ? <p className="mt-1 text-xs font-medium text-coral">{error}</p> : null}
    </label>
  )
}
