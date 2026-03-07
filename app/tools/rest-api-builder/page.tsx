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

export default function RestApiBuilderPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RestApiBuilderClient />
    </>
  )
}
