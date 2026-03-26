import Link from 'next/link'
import type { BlogPost } from '@/lib/blogService'

export default function BlogCard({ post }: { post: BlogPost }) {
  const categoryClass = `blog-card__category--${post.category.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <Link href={`/blog/${post.slug}`} suppressHydrationWarning className="blog-card reveal">
      {post.image && (
        <div className="blog-card__image-wrapper">
          <img src={post.image} alt={post.title} className="blog-card__image" loading="lazy" />
        </div>
      )}
      <div className="blog-card__body">
        <div className="blog-card__meta">
          <span className={`blog-card__category ${categoryClass}`}>
            {post.category}
          </span>
          <span className="blog-card__date">{post.displayDate}</span>
        </div>
        <h3 className="blog-card__title">{post.title}</h3>
        <p className="blog-card__excerpt">{post.excerpt}</p>
        <div className="blog-card__footer">
          <span className="blog-card__read-time">{post.readTime}</span>
          <span className="blog-card__arrow">→</span>
        </div>
      </div>
    </Link>
  )
}
