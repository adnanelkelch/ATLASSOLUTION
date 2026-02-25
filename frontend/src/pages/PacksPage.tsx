import { useQuery } from '@tanstack/react-query'
import { CheckCircle2, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { packsApi } from '@/services/api'
import { useCartStore } from '@/stores/cart-store'
import { formatPrice } from '@/lib/utils'
import { PageLoading } from '@/components/ui/loading'
import type { Pack } from '@/types'
import { useLanguageStore } from '@/stores/language-store'

const packTranslations: Record<string, { name: string; description: string; features: string[] }> = {
  'starter-pack': {
    name: 'Pack Starter',
    description: 'Un excellent point de départ pour les entreprises qui veulent une présence en ligne professionnelle.',
    features: [
      'Site responsive 5 pages',
      'Intégration formulaire de contact',
      'Configuration SEO de base',
      'Hébergement 3 mois inclus',
      'Certificat SSL inclus',
    ],
  },
  'business-pack': {
    name: 'Pack Business',
    description: 'Idéal pour les entreprises en croissance qui ont besoin d’une présence digitale solide et évolutive.',
    features: [
      'Site responsive 10 pages',
      'Design UI sur mesure',
      'Intégration du blog',
      'Optimisation SEO avancée',
      'Hébergement 1 an inclus',
      'Nom de domaine inclus',
      'Support prioritaire',
    ],
  },
  'premium-pack': {
    name: 'Pack Premium',
    description: 'Une solution premium complète pour les marques qui veulent performance, évolution et impact.',
    features: [
      'Site e-commerce complet',
      'Design premium sur mesure',
      'Stratégie SEO avancée',
      'Session de formation admin',
      'Hébergement 1 an inclus',
      'Maintenance 6 mois',
      'Support prioritaire 24/7',
    ],
  },
}

export default function PacksPage() {
  const lang = useLanguageStore((s) => s.lang)
  const isFr = lang === 'fr'
  const { data, isLoading } = useQuery({
    queryKey: ['packs'],
    queryFn: () => packsApi.getAll().then((r) => r.data.data),
  })
  const addItem = useCartStore((s) => s.addItem)

  if (isLoading) return <PageLoading />

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{isFr ? 'Nos Packs' : 'Our Packs'}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {isFr
              ? 'Choisissez le pack qui correspond le mieux à vos besoins. Tous nos packs incluent un accompagnement personnalisé.'
              : 'Choose the pack that best fits your needs. Every pack includes personalized support.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.map((pack: Pack) => (
            <Card
              key={pack.id}
              className={`relative flex flex-col ${pack.is_popular ? 'ring-2 ring-primary-500 shadow-xl z-10' : 'hover:shadow-lg'} transition-all`}
            >
              {pack.is_popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary-600 text-white shadow-lg">{isFr ? 'Le plus populaire' : 'Most popular'}</Badge>
                </div>
              )}
              <CardContent className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {isFr && packTranslations[pack.slug] ? packTranslations[pack.slug].name : pack.name}
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  {(isFr && packTranslations[pack.slug] ? packTranslations[pack.slug].description : pack.description).substring(0, 100)}...
                </p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary-600">{formatPrice(pack.price)}</span>
                  {pack.original_price && (
                    <span className="ml-2 text-lg text-gray-400 line-through">{formatPrice(pack.original_price)}</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {(isFr && packTranslations[pack.slug] ? packTranslations[pack.slug].features : pack.features)?.map((f: string) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={pack.is_popular ? 'default' : 'outline'}
                  onClick={() => addItem(pack)}
                >
                  <ShoppingCart className="h-4 w-4" /> {isFr ? 'Ajouter au panier' : 'Add to cart'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
