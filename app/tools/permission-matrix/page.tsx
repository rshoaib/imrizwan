import type { Metadata } from 'next'
import PermissionMatrixClient from './PermissionMatrixClient'

export const metadata: Metadata = {
  title: 'Permission Matrix Generator',
  description: 'Visualize and generate SharePoint permission matrices across sites, libraries, and lists. Export as CSV or Markdown for audits and compliance.',
  alternates: { canonical: '/tools/permission-matrix' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Permission Matrix Generator',
  description: 'Visualize and generate SharePoint permission matrices across sites, libraries, and lists.',
  url: 'https://imrizwan.com/tools/permission-matrix',
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
    { '@type': 'ListItem', position: 3, name: 'Permission Matrix Generator', item: 'https://imrizwan.com/tools/permission-matrix' },
  ],
}

export default function PermissionMatrixPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <PermissionMatrixClient />
    </>
  )
}
