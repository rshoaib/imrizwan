import type { Metadata } from 'next'
import JsonColumnFormatterClient from './JsonColumnFormatterClient'

export const metadata: Metadata = {
  title: 'Free SharePoint JSON Column Formatter & Builder',
  description: 'Free online SharePoint JSON column formatting builder — write, validate, and live-preview column formatting JSON with built-in templates. No login required.',
  alternates: { canonical: '/tools/json-column-formatter' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SharePoint JSON Column Formatter & Builder',
  description: 'Free online SharePoint JSON column formatting builder — write, validate, and live-preview column formatting JSON with built-in templates.',
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
