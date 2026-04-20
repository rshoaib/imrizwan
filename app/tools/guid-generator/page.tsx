import type { Metadata } from 'next'
import GuidGeneratorClient from './GuidGeneratorClient'

export const metadata: Metadata = {
  title: 'GUID / UUID Generator',
  description: 'Generate v4 UUIDs instantly for SPFx manifests, Azure AD registrations, Teams apps, and Power Platform solutions.',
  alternates: { canonical: '/tools/guid-generator' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'GUID / UUID Generator',
  description: 'Generate v4 UUIDs instantly for SPFx manifests, Azure AD registrations, Teams apps, and Power Platform solutions.',
  url: 'https://imrizwan.com/tools/guid-generator',
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
    { '@type': 'ListItem', position: 3, name: 'GUID / UUID Generator', item: 'https://imrizwan.com/tools/guid-generator' },
  ],
}

export default function GuidGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <GuidGeneratorClient />
    </>
  )
}
