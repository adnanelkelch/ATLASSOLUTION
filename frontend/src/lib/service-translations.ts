interface ServiceTranslation {
  title: string
  excerpt: string
  description: string
}

export const serviceTranslationsFr: Record<string, ServiceTranslation> = {
  'website-design-development': {
    title: 'Conception & Développement de Sites Web',
    excerpt: 'Sites modernes et performants, conçus pour la vitesse, le SEO et l\'expérience utilisateur.',
    description:
      'Nous concevons et développons des sites web professionnels adaptés à votre marque et à vos objectifs commerciaux. Chaque site est responsive, optimisé en performance et prêt à convertir vos visiteurs en clients.',
  },
  'custom-web-applications': {
    title: 'Applications Web Sur Mesure',
    excerpt: 'Applications web évolutives qui automatisent vos processus et dynamisent vos opérations.',
    description:
      'Des outils internes aux plateformes destinées aux clients, nous développons des applications web sécurisées et évolutives qui résolvent de vrais problèmes métier et améliorent la productivité de vos équipes.',
  },
  'ecommerce-solutions': {
    title: 'Solutions E-commerce',
    excerpt: 'Développement complet de boutiques en ligne avec paiement fluide et intégration sécurisée.',
    description:
      'Nous créons des expériences e-commerce rapides, faciles à gérer et optimisées pour la vente. Cela inclut la gestion des produits, le paiement sécurisé, les passerelles de paiement et la mise en place d\'outils analytiques.',
  },
  'seo-performance-optimization': {
    title: 'SEO & Optimisation des Performances',
    excerpt: 'Améliorez votre référencement, la vitesse de chargement et les performances techniques de votre site.',
    description:
      'Nous optimisons l\'architecture du site, les métadonnées, la vitesse de chargement et le SEO technique pour que votre site soit mieux référencé et offre une expérience utilisateur plus rapide et fluide.',
  },
  'ui-ux-design': {
    title: 'Design UI/UX',
    excerpt: 'Interfaces centrées sur l\'utilisateur, conçues pour maximiser l\'engagement et les conversions.',
    description:
      'Notre processus de conception met l\'accent sur la clarté, l\'accessibilité et la conversion. Nous créons des parcours utilisateurs intuitifs et des interfaces visuellement percutantes qui accompagnent votre croissance.',
  },
  'maintenance-support': {
    title: 'Maintenance & Support',
    excerpt: 'Gardez votre plateforme sécurisée, à jour et fonctionnelle grâce à un support proactif.',
    description:
      'Nous assurons la maintenance continue, la surveillance, les mises à jour et le support technique pour garantir que votre site ou application reste sécurisé, stable et aligné avec vos besoins évolutifs.',
  },
}

export function getServiceTranslation(slug: string, field: keyof ServiceTranslation, fallback: string): string {
  return serviceTranslationsFr[slug]?.[field] ?? fallback
}
