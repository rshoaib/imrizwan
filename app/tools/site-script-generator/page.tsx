import type { Metadata } from 'next'
import SiteScriptGeneratorClient from './SiteScriptGeneratorClient'

export const metadata: Metadata = {
  title: 'SharePoint Site Script Generator (Free UI Builder 2026)',
  description: 'Visually build SharePoint site designs and site scripts. Add provisioning actions, live preview JSON, and generate PowerShell scripts for instant deployment.',
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

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://imrizwan.com' },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://imrizwan.com/tools' },
    { '@type': 'ListItem', position: 3, name: 'Site Script Generator', item: 'https://imrizwan.com/tools/site-script-generator' },
  ],
}

export default function SiteScriptGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <SiteScriptGeneratorClient />
    </>
  )
}
