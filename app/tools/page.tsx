import type { Metadata } from 'next'
import Link from 'next/link'
import { tools } from '@/data/tools'

const SITE_URL = 'https://imrizwan.com'

export const metadata: Metadata = {
  title: 'Free SharePoint, SPFx & Power Platform Developer Tools',
  description:
    'Free, browser-based developer tools for SharePoint, SPFx, Power Platform, and Microsoft 365 — GUID generator, JSON column formatter, CAML query builder, PnP PowerShell generator, and more. No login required.',
  alternates: { canonical: '/tools' },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_URL}/tools` },
  ],
}

const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Free SharePoint & Microsoft 365 Developer Tools',
  description:
    'Catalog of free, browser-based developer tools for SharePoint, SPFx, Power Platform, and Microsoft 365. No sign-up, runs entirely in the browser.',
  numberOfItems: tools.length,
  itemListElement: tools.map((tool, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    url: `${SITE_URL}/tools/${tool.slug}`,
    item: {
      '@type': 'WebApplication',
      name: tool.name,
      url: `${SITE_URL}/tools/${tool.slug}`,
      description: tool.description,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
  })),
}

export default function ToolsPage() {
  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <div suppressHydrationWarning className="page-title reveal">
        <h1>Free SharePoint, SPFx &amp; Power Platform Developer Tools</h1>
        <p>Browser-based utilities for Microsoft 365 developers — no sign-up, no install.</p>
      </div>

      <div suppressHydrationWarning className="tools-grid reveal-stagger">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            suppressHydrationWarning className="tool-card reveal"
          >
            <div className="tool-card__emoji">{tool.emoji}</div>
            <h3 className="tool-card__name">{tool.name}</h3>
            <p className="tool-card__desc">{tool.description}</p>
            <div className="tool-card__tags">
              {tool.tags.map((tag) => (
                <span key={tag} className="tool-card__tag">{tag}</span>
              ))}
            </div>
            <span className="tool-card__link">Open Tool →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
