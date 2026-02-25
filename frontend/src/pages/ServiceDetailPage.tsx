import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { servicesApi } from '@/services/api'
import { Button } from '@/components/ui/button'
import { PageLoading } from '@/components/ui/loading'
import { useLanguageStore } from '@/stores/language-store'
import { getServiceTranslation } from '@/lib/service-translations'

export default function ServiceDetailPage() {
  const lang = useLanguageStore((s) => s.lang)
  const isFr = lang === 'fr'
  const { slug } = useParams<{ slug: string }>()
  const { data, isLoading } = useQuery({
    queryKey: ['service', slug, lang],
    queryFn: () => servicesApi.getBySlug(slug!).then((r) => r.data.data),
    enabled: !!slug,
  })

  if (isLoading) return <PageLoading />
  if (!data) return <div className="py-20 text-center text-gray-500">{isFr ? 'Service non trouvé.' : 'Service not found.'}</div>

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/services" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-8">
          <ArrowLeft className="h-4 w-4" /> {isFr ? 'Retour aux services' : 'Back to services'}
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {isFr ? getServiceTranslation(data.slug, 'title', data.title) : data.title}
        </h1>
        {data.excerpt && (
          <p className="text-lg text-gray-600 mb-8">
            {isFr ? getServiceTranslation(data.slug, 'excerpt', data.excerpt) : data.excerpt}
          </p>
        )}
        <div
          className="prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{
            __html: (isFr ? getServiceTranslation(data.slug, 'description', data.description) : data.description).replace(/\n/g, '<br/>'),
          }}
        />
        <div className="mt-12">
          <Link to="/contact">
            <Button size="lg">{isFr ? 'Demander un devis' : 'Request a quote'}</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
