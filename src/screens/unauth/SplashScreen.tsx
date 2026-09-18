import { motion } from 'framer-motion'
import { Clock, Globe, Heart, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { GradientButton, Monogram, Screen } from '@/ui'

export function SplashScreen() {
  const navigate = useNavigate()

  return (
    <Screen className="justify-between">
      <div className="flex justify-end">
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full border border-border bg-white/90 px-3 py-1.5 text-xs font-bold text-seafoam shadow-sm"
        >
          عربي
          <Globe size={14} />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center pt-4"
      >
        <Monogram size="lg" />
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink">Sehatia</h1>
        <p className="mt-1 text-sm font-medium text-muted">Care that comes to you</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="gradient-hero mt-6 rounded-[28px] p-5 text-white shadow-[0_16px_40px_rgba(45,159,143,0.28)]"
      >
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white/20 ring-4 ring-white/30">
          <img src="/images/nurseW.png" alt="Nurse" className="h-20 w-20 object-contain" />
        </div>
        <h2 className="text-center text-2xl font-extrabold leading-tight">
          Home nursing,
          <br />
          done right
        </h2>
        <p className="mt-2 text-center text-sm font-medium text-white/90">
          Book trusted nurses for care at home — calm, reliable, and available when you need them.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="mt-5 flex gap-2"
      >
        {[
          { label: '24/7', icon: <Clock size={16} />, bg: '#E8F7F4', iconBg: '#C8EDE6', color: '#1B7A6E' },
          { label: 'Verified', icon: <ShieldCheck size={16} />, bg: '#EAF2FB', iconBg: '#D4E6F7', color: '#5B9BD5' },
          { label: 'At home', icon: <Heart size={16} />, bg: '#FDF0EB', iconBg: '#F8D9CE', color: '#E8846B' },
        ].map((f) => (
          <div
            key={f.label}
            className="flex flex-1 flex-col items-center gap-1.5 rounded-2xl px-2 py-3"
            style={{ background: f.bg }}
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl"
              style={{ background: f.iconBg, color: f.color }}
            >
              {f.icon}
            </div>
            <span className="text-xs font-bold text-ink">{f.label}</span>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="mt-auto pt-6"
      >
        <GradientButton showArrow onClick={() => navigate('/login')}>
          Get Started
        </GradientButton>
      </motion.div>
    </Screen>
  )
}
