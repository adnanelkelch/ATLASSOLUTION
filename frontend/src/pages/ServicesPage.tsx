import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import * as LucideIcons from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { servicesApi } from '@/services/api'
import { PageLoading } from '@/components/ui/loading'
import type { Service } from '@/types'
import { useLanguageStore } from '@/stores/language-store'
import { getServiceTranslation } from '@/lib/service-translations'

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as any)[name] as React.ComponentType<{ className?: string }> | undefined
  return Icon ? <Icon className={className} /> : null
}

export default function ServicesPage() {
  const lang = useLanguageStore((s) => s.lang)
  const isFr = lang === 'fr'

  const { data, isLoading } = useQuery({
    queryKey: ['services', lang],
    queryFn: () => servicesApi.getAll().then((r) => r.data.data),
  })

  if (isLoading) return <PageLoading />

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{isFr ? 'Nos Services' : 'Our Services'}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {isFr
              ? 'Nous proposons une gamme complète de services digitaux pour répondre à vos besoins.'
              : 'We provide a complete range of digital services to meet your needs.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.map((service: Service) => (
            <Link key={service.id} to={`/services/${service.slug}`}>
              <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 group">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-100 text-primary-600 mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    {service.icon && <DynamicIcon name={service.icon} className="h-7 w-7" />}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {isFr ? getServiceTranslation(service.slug, 'title', service.title) : service.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {isFr ? getServiceTranslation(service.slug, 'excerpt', service.excerpt ?? '') : service.excerpt}
                  </p>
                  <span className="text-primary-600 text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    {isFr ? 'En savoir plus' : 'Learn more'} <ArrowRight className="h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
