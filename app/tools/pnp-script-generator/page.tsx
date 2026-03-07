import type { Metadata } from 'next'
import PnPScriptGeneratorClient from './PnPScriptGeneratorClient'

export const metadata: Metadata = {
  title: 'PnP PowerShell Generator',
  description: 'Generate ready-to-run PnP PowerShell scripts for SharePoint Online — lists, permissions, bulk operations, and more.',
  alternates: { canonical: '/tools/pnp-script-generator' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PnP PowerShell Generator',
  description: 'Generate ready-to-run PnP PowerShell scripts for SharePoint Online.',
  url: 'https://imrizwan.com/tools/pnp-script-generator',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function PnPScriptGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PnPScriptGeneratorClient />
    </>
  )
}
