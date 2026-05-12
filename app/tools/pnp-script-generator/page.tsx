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

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://imrizwan.com' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://imrizwan.com/tools' },
    { '@type': 'ListItem', position: 3, name: 'PnP PowerShell Generator', item: 'https://imrizwan.com/tools/pnp-script-generator' },
  ],
}

export default function PnPScriptGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <PnPScriptGeneratorClient />
    </>
  )
}
