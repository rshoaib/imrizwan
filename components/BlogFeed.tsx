'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { BlogPost } from '@/data/blog'

const POSTS_PER_PAGE = 6

function getCategoryClass(category: string): string {
  return `blog-card__category--${category.toLowerCase().replace(/\s+/g, '-')}`
}

/** Map category to an icon for the gradient placeholder */
function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    SPFx: '⚡',
    'Power Platform': '🔄',
    SharePoint: '📊',
    'Microsoft 365': '☁️',
  }
  return icons[category] || '📝'
}

function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} suppressHydrationWarning className="featured-feed reveal">
      <div className="featured-feed__image-wrap">
        {post.image ? (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image
              src={post.image}
              alt={post.title}
              className="featured-feed__image"
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        ) : (
          <div className={`featured-feed__placeholder featured-feed__placeholder--${post.category.toLowerCase().replace(/\s+/g, '-')}`}>
            <span className="featured-feed__placeholder-icon">{getCategoryIcon(post.category)}</span>
          </div>
        )}
        <div className="featured-feed__overlay" />
      </div>
      <div className="featured-feed__body">
        <div className="featured-feed__badge">
          <span className={`blog-card__category ${getCategoryClass(post.category)}`}>
            {post.category}
          </span>
          <span className="featured-feed__label">Latest</span>
        </div>
        <h2 className="featured-feed__title">{post.title}</h2>
        <p className="featured-feed__excerpt">{post.excerpt}</p>
        <div className="featured-feed__meta">
          <span>{post.displayDate}</span>
          <span className="blog-feed__dot">·</span>
          <span>{post.readTime}</span>
        </div>
      </div>
    </Link>
  )
}

export default function BlogFeed({
  posts,
}: {
  posts: BlogPost[]
}) {
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE)

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">🔍</div>
        <h3 className="empty-state__title">No posts found</h3>
        <p className="empty-state__text">Try a different search or category.</p>
      </div>
    )
  }

  const [featured, ...rest] = posts
  const visibleRest = rest.slice(0, visibleCount)
  const hasMore = visibleCount < rest.length

  return (
    <div className="blog-feed">
      <FeaturedPost post={featured} />

      {visibleRest.length > 0 && (
        <div className="blog-feed__list">
          {visibleRest.map((post, index) => (
            <article key={post.slug} suppressHydrationWarning className="blog-feed__card reveal">
              <Link href={`/blog/${post.slug}`} className="blog-feed__card-image-link">
                {post.image ? (
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <Image
                      src={post.image}
                      alt={post.title}
                      className="blog-feed__card-image"
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  <div className={`blog-feed__card-placeholder blog-feed__card-placeholder--${post.category.toLowerCase().replace(/\s+/g, '-')}`}>
                    <span className="blog-feed__card-placeholder-icon">{getCategoryIcon(post.category)}</span>
                  </div>
                )}
              </Link>
              <div className="blog-feed__card-body">
                <div className="blog-feed__meta">
                  <span className={`blog-card__category ${getCategoryClass(post.category)}`}>
                    {post.category}
                  </span>
                  <span className="blog-feed__date">{post.displayDate}</span>
                  <span className="blog-feed__dot">·</span>
                  <span className="blog-feed__read-time">{post.readTime}</span>
                </div>
                <h3 className="blog-feed__card-title">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
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
      )}

      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            className="home-btn home-btn--outline"
            onClick={() => setVisibleCount((prev) => prev + POSTS_PER_PAGE)}
          >
            Load More Articles ({rest.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  )
}
