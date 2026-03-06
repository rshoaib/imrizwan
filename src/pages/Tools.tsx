import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

export const tools = [
  {
    name: 'GUID / UUID Generator',
    slug: 'guid-generator',
    description:
      'Generate v4 UUIDs instantly for SPFx manifests, Azure AD registrations, Teams apps, and Power Platform solutions.',
    emoji: '🔑',
    tags: ['SPFx', 'Azure AD', 'Teams'],
  },
  {
    name: 'JSON Column Formatter',
    slug: 'json-column-formatter',
    description:
      'Write, validate, and preview SharePoint JSON column formatting — with built-in templates and a live preview.',
    emoji: '🎨',
    tags: ['SharePoint', 'JSON', 'Formatting'],
  },
  {
    name: 'CAML Query Builder',
    slug: 'caml-query-builder',
    description:
      'Construct XML CAML Queries visually for SharePoint REST APIs, PnP JS, CSOM, or SPFx. Add conditions, select fields, and generate the raw XML.',
    emoji: '🔍',
    tags: ['SharePoint', 'CAML', 'XML'],
  },
  {
    name: 'Permission Matrix Generator',
    slug: 'permission-matrix',
    description:
      'Visualize and generate SharePoint permission matrices across sites, libraries, and lists. Export as CSV or Markdown for audits and compliance.',
    emoji: '🛡️',
    tags: ['SharePoint', 'Permissions', 'Security'],
  },
  {
    name: 'REST API Builder',
    slug: 'rest-api-builder',
    description:
      'Build SharePoint REST API URLs visually — pick operations, add OData filters, and get code snippets in JavaScript, PnPjs, and PowerShell.',
    emoji: '⚡',
    tags: ['SharePoint', 'REST API', 'OData'],
  },
]

export default function Tools() {
  return (
    <>
      <SEO
        title="Free Developer Tools"
        description="Free, browser-based developer tools for SharePoint, SPFx, Power Platform, and Microsoft 365 development. No login required."
        url="/tools"
      />

      <div className="container">
        <div className="page-title reveal">
          <h1>Developer Tools</h1>
          <p>Free, browser-based utilities for M365 & SharePoint developers</p>
        </div>

        <div className="tools-grid reveal-stagger">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              to={`/tools/${tool.slug}`}
              className="tool-card reveal"
            >
              <div className="tool-card__emoji">{tool.emoji}</div>
              <h3 className="tool-card__name">{tool.name}</h3>
              <p className="tool-card__desc">{tool.description}</p>
              <div className="tool-card__tags">
                {tool.tags.map((tag) => (
                  <span key={tag} className="tool-card__tag">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="tool-card__link">Open Tool →</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
