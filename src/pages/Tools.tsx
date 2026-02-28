import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

const tools = [
  {
    name: 'GUID / UUID Generator',
    slug: 'guid-generator',
    description:
      'Generate v4 UUIDs instantly for SPFx manifests, Azure AD registrations, Teams apps, and Power Platform solutions.',
    emoji: '🔑',
    tags: ['SPFx', 'Azure AD', 'Teams'],
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
