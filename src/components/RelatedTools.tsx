import { Link } from 'react-router-dom'
import { tools } from '../pages/Tools'

interface RelatedToolsProps {
  currentSlug: string
}

export default function RelatedTools({ currentSlug }: RelatedToolsProps) {
  const relatedTools = tools.filter((t) => t.slug !== currentSlug)

  if (relatedTools.length === 0) return null

  return (
    <div className="related-tools tool-section reveal" style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--border)' }}>
      <h2 className="tool-section__label" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        Recommended Free Developer Tools
      </h2>
      <div className="tools-grid">
        {relatedTools.map((tool) => (
          <Link
            key={tool.slug}
            to={`/tools/${tool.slug}`}
            className="tool-card glass-card"
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
  )
}
