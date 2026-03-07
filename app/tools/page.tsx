import type { Metadata } from 'next'
import Link from 'next/link'
import { tools } from '@/data/tools'

export const metadata: Metadata = {
  title: 'Free Developer Tools',
  description:
    'Free, browser-based developer tools for SharePoint, SPFx, Power Platform, and Microsoft 365 development. No login required.',
  alternates: { canonical: '/tools' },
}

export default function ToolsPage() {
  return (
    <div className="container">
      <div className="page-title reveal">
        <h1>Developer Tools</h1>
        <p>Free, browser-based utilities for M365 &amp; SharePoint developers</p>
      </div>

      <div className="tools-grid reveal-stagger">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="tool-card reveal"
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
