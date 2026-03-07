'use client'

import Link from 'next/link'
import type { BlogPost } from '@/data/blog'

function getCategoryClass(category: string): string {
  return `blog-card__category--${category.toLowerCase().replace(/\s+/g, '-')}`
}

export default function BlogFeed({
  posts,
  showImages = true,
}: {
  posts: BlogPost[]
  showImages?: boolean
}) {
  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">🔍</div>
        <h3 className="empty-state__title">No posts found</h3>
        <p className="empty-state__text">Try a different search or category.</p>
      </div>
    )
  }

  return (
    <div className="blog-feed">
      {posts.map((post, index) => (
        <article key={post.id} className="blog-feed__item reveal">
          {showImages && post.image && (
            <Link href={`/blog/${post.slug}`} className="blog-feed__image-link">
              <img
                src={post.image}
                alt={post.title}
                className="blog-feed__image"
                loading={index < 3 ? 'eager' : 'lazy'}
              />
            </Link>
          )}
          <div className="blog-feed__content">
            <div className="blog-feed__meta">
              <span className={`blog-card__category ${getCategoryClass(post.category)}`}>
                {post.category}
              </span>
              <span className="blog-feed__date">{post.displayDate}</span>
              <span className="blog-feed__dot">·</span>
              <span className="blog-feed__read-time">{post.readTime}</span>
            </div>
            <h2 className="blog-feed__title">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="blog-feed__excerpt">{post.excerpt}</p>
            {post.tags && post.tags.length > 0 && (
              <div className="blog-feed__tags">
                {post.tags.slice(0, 3).map((tag) => (
                  <Link href={`/blog?tag=${tag}`} key={tag} className="blog-feed__tag">
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
