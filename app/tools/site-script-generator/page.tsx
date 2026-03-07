import type { Metadata } from 'next'
import SiteScriptGeneratorClient from './SiteScriptGeneratorClient'

export const metadata: Metadata = {
  title: 'Site Script Generator',
  description: 'Build SharePoint site scripts visually — add provisioning actions and export JSON with PowerShell deployment commands.',
  alternates: { canonical: '/tools/site-script-generator' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Site Script Generator',
  description: 'Build SharePoint site scripts visually — add provisioning actions and export JSON.',
  url: 'https://imrizwan.com/tools/site-script-generator',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function SiteScriptGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteScriptGeneratorClient />
    </>
  )
}
