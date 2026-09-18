import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json' with { type: 'json' }
import ar from './locales/ar.json' with { type: 'json' }

const STORAGE_KEY = 'sehatia-lang'

export type AppLanguage = 'en' | 'ar'

export function getStoredLanguage(): AppLanguage {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'ar' || v === 'en') return v
  } catch {
    /* ignore */
  }
  return 'en'
}

export function applyDocumentDirection(lng: AppLanguage) {
  const dir = lng === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = lng
  document.documentElement.dir = dir
  document.body.dir = dir
}

export async function setAppLanguage(lng: AppLanguage) {
  await i18n.changeLanguage(lng)
  localStorage.setItem(STORAGE_KEY, lng)
  applyDocumentDirection(lng)
}

const initial = getStoredLanguage()
applyDocumentDirection(initial)

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: initial,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
