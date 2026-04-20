import type { Metadata } from 'next'
import RestApiBuilderClient from './RestApiBuilderClient'

export const metadata: Metadata = {
  title: 'REST API Builder',
  description: 'Build SharePoint REST API URLs visually — pick operations, add OData filters, and get code snippets in JavaScript, PnPjs, and PowerShell.',
  alternates: { canonical: '/tools/rest-api-builder' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'REST API Builder',
  description: 'Build SharePoint REST API URLs visually — pick operations, add OData filters, and get code snippets.',
  url: 'https://imrizwan.com/tools/rest-api-builder',
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
    { '@type': 'ListItem', position: 3, name: 'REST API Builder', item: 'https://imrizwan.com/tools/rest-api-builder' },
  ],
}

export default function RestApiBuilderPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <RestApiBuilderClient />
    </>
  )
}
