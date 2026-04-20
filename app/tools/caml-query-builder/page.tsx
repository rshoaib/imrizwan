import type { Metadata } from 'next'
import CamlQueryBuilderClient from './CamlQueryBuilderClient'

export const metadata: Metadata = {
  title: 'CAML Query Builder',
  description: 'Construct XML CAML Queries visually for SharePoint REST APIs, PnP JS, CSOM, or SPFx. Add conditions, select fields, and generate the raw XML.',
  alternates: { canonical: '/tools/caml-query-builder' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'CAML Query Builder',
  description: 'Construct XML CAML Queries visually for SharePoint REST APIs, PnP JS, CSOM, or SPFx.',
  url: 'https://imrizwan.com/tools/caml-query-builder',
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
    { '@type': 'ListItem', position: 3, name: 'CAML Query Builder', item: 'https://imrizwan.com/tools/caml-query-builder' },
  ],
}

export default function CamlQueryBuilderPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <CamlQueryBuilderClient />
    </>
  )
}
