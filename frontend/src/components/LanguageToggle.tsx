import { Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguageStore } from '@/stores/language-store'

export default function LanguageToggle() {
  const { lang, toggleLang } = useLanguageStore()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLang}
      className="gap-1 px-2.5"
      title={lang === 'en' ? 'Switch to French' : 'Passer en anglais'}
      aria-label="Toggle language"
    >
      <Languages className="h-4 w-4" />
      {lang === 'en' ? 'FR' : 'EN'}
    </Button>
  )
}
