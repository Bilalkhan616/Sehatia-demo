import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useIsRtl } from './LanguageToggle'

const SLIDES = [
  {
    src: '/images/carousel-care.jpg',
    titleKey: 'carousel.careTitle',
    subtitleKey: 'carousel.careSubtitle',
  },
  {
    src: '/images/carousel-nursing.jpg',
    titleKey: 'carousel.nursingTitle',
    subtitleKey: 'carousel.nursingSubtitle',
  },
  {
    src: '/images/carousel-doctors.jpg',
    titleKey: 'carousel.doctorsTitle',
    subtitleKey: 'carousel.doctorsSubtitle',
  },
] as const

export function ImageCarousel() {
  const { t } = useTranslation()
  const rtl = useIsRtl()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef(0)
  const [active, setActive] = useState(0)

  const goTo = (next: number) => {
    const el = scrollerRef.current
    if (!el) return
    indexRef.current = next
    setActive(next)
    const offset = next * el.clientWidth
    el.scrollTo({ left: rtl ? -offset : offset, behavior: 'smooth' })
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      goTo((indexRef.current + 1) % SLIDES.length)
    }, 4000)
    return () => window.clearInterval(timer)
  }, [rtl])

  const onScroll = () => {
    const el = scrollerRef.current
    if (!el) return
    const next = Math.round(Math.abs(el.scrollLeft) / el.clientWidth)
    indexRef.current = next
    setActive(next)
  }

  return (
    <div className="relative mb-4 mt-3 h-48 w-full shrink-0 overflow-hidden rounded-3xl bg-[#17415f]">
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="flex h-full snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {SLIDES.map((slide) => (
          <div key={slide.src} className="relative h-full min-w-full shrink-0 snap-start">
            <img
              src={slide.src}
              alt={t(slide.titleKey)}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#17415f]/90 via-[#17415f]/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 px-4 pb-8 pt-10 text-white">
              <p className="text-lg font-extrabold">{t(slide.titleKey)}</p>
              <p className="text-xs font-medium text-white/85">{t(slide.subtitleKey)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            aria-label={t(slide.titleKey)}
            onClick={() => goTo(i)}
            className={`pointer-events-auto h-1.5 rounded-full transition-all ${
              i === active ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
