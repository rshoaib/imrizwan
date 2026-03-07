import type { Metadata } from 'next'
import JsonColumnFormatterClient from './JsonColumnFormatterClient'

export const metadata: Metadata = {
  title: 'JSON Column Formatter',
  description: 'Write, validate, and preview SharePoint JSON column formatting — with built-in templates and a live preview.',
  alternates: { canonical: '/tools/json-column-formatter' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'JSON Column Formatter',
  description: 'Write, validate, and preview SharePoint JSON column formatting — with built-in templates and a live preview.',
  url: 'https://imrizwan.com/tools/json-column-formatter',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function JsonColumnFormatterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <JsonColumnFormatterClient />
    </>
  )
}
