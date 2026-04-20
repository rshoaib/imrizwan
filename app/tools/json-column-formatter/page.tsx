import type { Metadata } from 'next'
import JsonColumnFormatterClient from './JsonColumnFormatterClient'

export const metadata: Metadata = {
  title: 'SharePoint JSON Column Formatter Builder (Free 2026)',
  description: 'Visually build SharePoint JSON column formatting configurations. Write, validate, and live-preview List formatting schemas instantly in your browser.',
  alternates: { canonical: '/tools/json-column-formatter' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SharePoint JSON Column Formatter',
  description: 'Free online SharePoint JSON column formatting builder. Write, validate, and live-preview column formatting JSON with built-in templates.',
  url: 'https://imrizwan.com/tools/json-column-formatter',
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
    { '@type': 'ListItem', position: 3, name: 'JSON Column Formatter', item: 'https://imrizwan.com/tools/json-column-formatter' },
  ],
}

export default function JsonColumnFormatterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <JsonColumnFormatterClient />
    </>
  )
}
