import { create } from 'zustand'

export type Language = 'en' | 'fr'

interface LanguageState {
  lang: Language
  setLang: (lang: Language) => void
  toggleLang: () => void
  hydrate: () => void
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  lang: 'en',

  setLang: (lang) => {
    localStorage.setItem('app_lang', lang)
    set({ lang })
  },

  toggleLang: () => {
    const next = get().lang === 'en' ? 'fr' : 'en'
    get().setLang(next)
  },

  hydrate: () => {
    const saved = localStorage.getItem('app_lang')
    if (saved === 'en' || saved === 'fr') {
      set({ lang: saved })
    }
  },
}))
