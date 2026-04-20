import type { Metadata } from 'next'
import PowerAutomateExpressionsClient from './PowerAutomateExpressionsClient'

export const metadata: Metadata = {
  title: 'Power Automate Expressions: 40+ Copy-Paste Examples (2026)',
  description:
    'Browse, search, and copy 40+ Power Automate expressions with syntax and examples. Free reference for string, date, array, and logic functions.',
  alternates: { canonical: '/tools/power-automate-expressions' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Power Automate Expressions Reference',
  description:
    'Browse, search, and copy 40+ Power Automate expressions with syntax, examples, and usage tips for Power Platform developers.',
  url: 'https://imrizwan.com/tools/power-automate-expressions',
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
    { '@type': 'ListItem', position: 3, name: 'Power Automate Expressions', item: 'https://imrizwan.com/tools/power-automate-expressions' },
  ],
}

export default function PowerAutomateExpressionsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <PowerAutomateExpressionsClient />
    </>
  )
}
