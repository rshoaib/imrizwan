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

export default function CamlQueryBuilderPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CamlQueryBuilderClient />
    </>
  )
}
