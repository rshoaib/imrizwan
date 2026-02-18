import { Link } from 'react-router-dom'
import type { BlogPost } from '../data/blog'

interface BlogCardProps {
  post: BlogPost
}

function getCategoryClass(category: string): string {
  const slug = category.toLowerCase().replace(/\s+/g, '-')
  return `blog-card__category--${slug}`
}

function getCategoryIcon(category: string): string {
  switch (category) {
    case 'SPFx': return '⚡'
    case 'Power Platform': return '🔌'
    case 'SharePoint': return '📋'
    case 'Microsoft 365': return '☁️'
    default: return '📝'
  }
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link to={`/blog/${post.slug}`} className="blog-card">
      {post.image ? (
        <img src={post.image} alt={post.title} className="blog-card__image" />
      ) : (
        <div className="blog-card__image--placeholder">
          {getCategoryIcon(post.category)}
        </div>
      )}

      <div className="blog-card__body">
        <div className="blog-card__meta">
          <span className={`blog-card__category ${getCategoryClass(post.category)}`}>
            {post.category}
          </span>
          <span className="blog-card__date">{post.displayDate}</span>
        </div>

        <h3 className="blog-card__title">{post.title}</h3>
        <p className="blog-card__excerpt">{post.excerpt}</p>
      </div>

      <div className="blog-card__footer">
        <span className="blog-card__read-time">{post.readTime}</span>
        <span className="blog-card__arrow">→</span>
      </div>
    </Link>
  )
}
