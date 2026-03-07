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

export default function JsonColumnFormatterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <JsonColumnFormatterClient />
    </>
  )
}
