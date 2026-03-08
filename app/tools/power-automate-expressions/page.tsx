import type { Metadata } from 'next'
import PowerAutomateExpressionsClient from './PowerAutomateExpressionsClient'

export const metadata: Metadata = {
  title: 'Power Automate Expressions Reference',
  description:
    'Browse, search, and copy 40+ Power Automate expressions with syntax, examples, and usage tips. Free, browser-based reference for Power Platform developers.',
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

export default function PowerAutomateExpressionsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PowerAutomateExpressionsClient />
    </>
  )
}
