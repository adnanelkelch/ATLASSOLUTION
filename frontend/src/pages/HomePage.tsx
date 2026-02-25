import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, CheckCircle2, Zap, Shield, HeartHandshake } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { servicesApi, packsApi } from '@/services/api'
import { formatPrice } from '@/lib/utils'
import { PageLoading } from '@/components/ui/loading'
import type { Service, Pack } from '@/types'
import { useLanguageStore } from '@/stores/language-store'
import { getServiceTranslation } from '@/lib/service-translations'

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as any)[name] as React.ComponentType<{ className?: string }> | undefined
  return Icon ? <Icon className={className} /> : null
}

export default function HomePage() {
  const lang = useLanguageStore((s) => s.lang)
  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ['services', 'featured'],
    queryFn: () => servicesApi.getFeatured().then((r) => r.data.data),
  })

  const { data: packsData, isLoading: packsLoading } = useQuery({
    queryKey: ['packs'],
    queryFn: () => packsApi.getAll().then((r) => r.data.data),
  })

  const isFr = lang === 'fr'
  const aboutFr = [
    "AtlasTech Solutions est une entreprise fictive en pleine croissance opérant spécialisée dans les services numériques et le développement web. L'entreprise propose des packs de développement web (sites vitrines, e-commerce, maintenance, hébergement) à destination de PME.",
    "Face à l'augmentation du nombre de clients et à la sensibilité croissante des données manipulées (données clients, ressources humaines, informations financières et code source des applications web), la direction a décidé de revoir entièrement son infrastructure informatique.",
    "Face à la croissance de l'activité commerciale et à l'augmentation des exigences de sécurité, la direction a décidé de revoir l'infrastructure réseau et applicative afin d'améliorer la sécurité, la disponibilité et la fiabilité des services.",
  ]
  const aboutEn = [
    'AtlasTech Solutions is a fast-growing fictional company specialized in digital services and web development. The company offers web development packs (showcase websites, e-commerce, maintenance, hosting) for SMEs.',
    'With the increase in clients and the growing sensitivity of handled data (customer data, HR data, financial information, and web application source code), management decided to fully redesign its IT infrastructure.',
    'Given business growth and higher security requirements, management decided to redesign the network and application infrastructure to improve security, availability, and service reliability.',
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0b0b12] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              {isFr ? (
                <>Créons ensemble votre <span className="text-violet-300">présence digitale</span></>
              ) : (
                <>Let's build your <span className="text-violet-300">digital presence</span> together</>
              )}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {isFr
                ? 'Agence web spécialisée dans les sites internet, applications et solutions digitales sur mesure pour accélérer votre croissance.'
                : 'A web agency specialized in websites, applications, and custom digital solutions to grow your business.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/packs">
                <Button size="lg" className="w-full sm:w-auto">
                  {isFr ? 'Découvrir nos packs' : 'Discover our packs'} <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                  {isFr ? 'Nous contacter' : 'Contact us'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{isFr ? 'À propos de nous' : 'About Us'}</h2>
            <p className="text-gray-600">{isFr ? 'Présentation de AtlasTech Solutions' : 'Who AtlasTech Solutions is'}</p>
          </div>

          <Card className="p-8 md:p-10">
            <CardContent className="p-0 space-y-6">
              {(isFr ? aboutFr : aboutEn).map((paragraph) => (
                <p key={paragraph} className="text-base md:text-lg leading-8 text-gray-700">
                  {paragraph}
                </p>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{isFr ? 'Pourquoi nous choisir ?' : 'Why choose us?'}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {isFr
                ? 'Des solutions sur mesure avec un accompagnement personnalisé à chaque étape de votre projet.'
                : 'Custom solutions with personalized support at every stage of your project.'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: isFr ? 'Performance' : 'Performance', desc: isFr ? "Sites rapides optimisés pour le SEO et l'expérience utilisateur." : 'Fast websites optimized for SEO and user experience.' },
              { icon: Shield, title: isFr ? 'Sécurité' : 'Security', desc: isFr ? 'Protection avancée et certificats SSL inclus dans nos offres.' : 'Advanced protection and SSL certificates included in all packs.' },
              { icon: HeartHandshake, title: isFr ? 'Accompagnement' : 'Support', desc: isFr ? 'Un interlocuteur dédié et un support réactif pendant tout le projet.' : 'A dedicated point of contact and responsive support throughout your project.' },
            ].map((item) => (
              <Card key={item.title} className="text-center p-8 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-100 text-primary-600 mb-4">
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{isFr ? 'Nos Services' : 'Our Services'}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{isFr ? 'Découvrez notre gamme complète de services digitaux.' : 'Explore our complete range of digital services.'}</p>
          </div>
          {servicesLoading ? (
            <PageLoading />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicesData?.slice(0, 6).map((service: Service) => (
                <Link key={service.id} to={`/services/${service.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow group">
                    <CardContent className="p-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100 text-primary-600 mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                        {service.icon && <DynamicIcon name={service.icon} className="h-6 w-6" />}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {isFr ? getServiceTranslation(service.slug, 'title', service.title) : service.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {isFr ? getServiceTranslation(service.slug, 'excerpt', service.excerpt ?? '') : service.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/services">
              <Button variant="outline">{isFr ? 'Voir tous les services' : 'View all services'} <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Packs Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{isFr ? 'Nos Packs' : 'Our Packs'}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{isFr ? 'Des solutions clés en main adaptées à votre budget.' : 'Turnkey solutions tailored to your budget.'}</p>
          </div>
          {packsLoading ? (
            <PageLoading />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packsData?.slice(0, 3).map((pack: Pack) => (
                <Card key={pack.id} className={`relative overflow-hidden ${pack.is_popular ? 'ring-2 ring-primary-500 shadow-lg' : ''}`}>
                  {pack.is_popular && (
                    <div className="absolute top-0 right-0 bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                      {isFr ? 'Populaire' : 'Popular'}
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{pack.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-primary-600">{formatPrice(pack.price)}</span>
                      {pack.original_price && (
                        <span className="ml-2 text-sm text-gray-400 line-through">{formatPrice(pack.original_price)}</span>
                      )}
                    </div>
                    <ul className="space-y-2 mb-6">
                      {pack.features?.slice(0, 5).map((f: string) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link to="/packs">
                      <Button className="w-full" variant={pack.is_popular ? 'default' : 'outline'}>
                        {isFr ? 'En savoir plus' : 'Learn more'}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{isFr ? 'Prêt à lancer votre projet ?' : 'Ready to launch your project?'}</h2>
          <p className="text-primary-100 mb-8 text-lg">{isFr ? 'Contactez-nous maintenant pour un devis gratuit et personnalisé.' : 'Contact us now for a free, personalized quote.'}</p>
          <Link to="/contact">
            <Button size="lg" className="bg-white text-primary-700 hover:bg-primary-50">
              {isFr ? 'Demander un devis gratuit' : 'Request a free quote'} <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
