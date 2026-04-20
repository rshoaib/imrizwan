import type { Metadata } from 'next'
import AdaptiveCardGeneratorClient from './AdaptiveCardGeneratorClient'

export const metadata: Metadata = {
  title: 'Adaptive Card AI Generator | SPFx Viva Connections',
  description: 'Build and preview Adaptive Cards visually with JSON templates optimized for SPFx Viva Connections ACEs.',
  alternates: { canonical: '/tools/adaptive-card-generator' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Adaptive Card AI Generator',
  description: 'Build and preview Adaptive Cards visually with JSON templates optimized for SPFx Viva Connections ACEs.',
  url: 'https://imrizwan.com/tools/adaptive-card-generator',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://imrizwan.com' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://imrizwan.com/tools' },
    { '@type': 'ListItem', position: 3, name: 'Adaptive Card Generator', item: 'https://imrizwan.com/tools/adaptive-card-generator' },
  ],
}

export default function AdaptiveCardGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <AdaptiveCardGeneratorClient />
    </>
  )
}
