import type { Metadata } from 'next'
import HtmlTableStylerClient from './HtmlTableStylerClient'

export const metadata: Metadata = {
  title: 'Power Automate HTML Table Styler: Visual CSS Generator',
  description: 'Style SharePoint lists and Dataverse tables exported from Power Automate. Generate custom CSS for the Create HTML table action visually. No login required.',
  alternates: { canonical: '/tools/html-table-styler' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Power Automate HTML Table Styler',
  description: 'Style SharePoint lists and Dataverse tables exported from Power Automate. Generate CSS for the "Create HTML table" action visually.',
  url: 'https://imrizwan.com/tools/html-table-styler',
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
    { '@type': 'ListItem', position: 3, name: 'HTML Table Styler', item: 'https://imrizwan.com/tools/html-table-styler' },
  ],
}

export default function HtmlTableStylerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <HtmlTableStylerClient />
    </>
  )
}
