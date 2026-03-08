'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { BlogPost } from '@/data/blog'
import { tools } from '@/data/tools'

/* ── Animated counter hook ── */
function useCounter(target: number, duration = 1200) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const start = performance.now()
          const step = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
            setCount(Math.round(eased * target))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return { count, ref }
}

/* ── Category helpers ── */
function getCategoryClass(category: string): string {
  return `blog-card__category--${category.toLowerCase().replace(/\s+/g, '-')}`
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    SPFx: '⚡',
    'Power Platform': '🔄',
    SharePoint: '📊',
    'Microsoft 365': '☁️',
  }
  return icons[category] || '📝'
}

const CATEGORIES = ['All', 'SPFx', 'Power Platform', 'SharePoint', 'Microsoft 365']

export default function HomeClient({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(initialPosts)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let result = initialPosts
    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      if (q.startsWith('#')) {
        const tag = q.slice(1)
        result = result.filter((p) =>
          (p.tags || []).some((t) => t.toLowerCase().includes(tag))
        )
      } else {
        result = result.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.excerpt.toLowerCase().includes(q) ||
            (p.tags || []).some((t) => t.toLowerCase().includes(q))
        )
      }
    }
    setFilteredPosts(result)
  }, [initialPosts, activeCategory, searchQuery])

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat)
    if (searchQuery.startsWith('#')) setSearchQuery('')
  }

  /* Counters */
  const yearsCounter = useCounter(5)
  const projectsCounter = useCounter(20)
  const articlesCounter = useCounter(initialPosts.length)
  const toolsCounter = useCounter(tools.length)

  const featured = filteredPosts[0]
  const recent = filteredPosts.slice(1, 4)

  return (
    <div className="container">
      <div className="dashboard">
        {/* ── Profile Banner ── */}
        <section className="dashboard__banner">
          <div className="dashboard__banner-left">
            <div className="dashboard__avatar-wrap">
              <div className="dashboard__avatar">R</div>
            </div>
            <div className="dashboard__identity">
              <div className="dashboard__name-row">
                <h1 className="dashboard__name">
                  <span className="gradient-text">Rizwan</span>
                </h1>
              </div>
              <p className="dashboard__role">SharePoint &amp; Power Platform Developer</p>
            </div>
          </div>
          <div className="dashboard__banner-right">
            <div className="dashboard__tech-pills">
              {['SPFx', 'Power Automate', 'Graph API', 'PnP', 'React'].map((t) => (
                <span key={t} className="dashboard__pill">{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats Row ── */}
        <section className="dashboard__stats">
          <div className="dashboard__stat-card" ref={yearsCounter.ref}>
            <span className="dashboard__stat-icon">🎯</span>
            <span className="dashboard__stat-value">{yearsCounter.count}+</span>
            <span className="dashboard__stat-label">Years Exp.</span>
          </div>
          <div className="dashboard__stat-card" ref={projectsCounter.ref}>
            <span className="dashboard__stat-icon">🚀</span>
            <span className="dashboard__stat-value">{projectsCounter.count}+</span>
            <span className="dashboard__stat-label">Projects</span>
          </div>
          <div className="dashboard__stat-card" ref={articlesCounter.ref}>
            <span className="dashboard__stat-icon">📝</span>
            <span className="dashboard__stat-value">{articlesCounter.count}+</span>
            <span className="dashboard__stat-label">Articles</span>
          </div>
          <div className="dashboard__stat-card" ref={toolsCounter.ref}>
            <span className="dashboard__stat-icon">🛠️</span>
            <span className="dashboard__stat-value">{toolsCounter.count}</span>
            <span className="dashboard__stat-label">Free Tools</span>
          </div>
        </section>

        {/* ── Search & Filters ── */}
        <section className="dashboard__controls">
          <div className="dashboard__search-wrap">
            <span className="dashboard__search-icon">🔍</span>
            <input
              type="text"
              className="dashboard__search"
              placeholder="Search posts or #tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="dashboard__search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <div className="dashboard__filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'filter-btn--active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* ── Two-Column Widgets ── */}
        <section className="dashboard__widgets">
          {/* Quick Tools */}
          <div className="dashboard__widget">
            <div className="dashboard__widget-header">
              <h2 className="dashboard__widget-title">⚡ Quick Tools</h2>
              <Link href="/tools" className="dashboard__widget-link">
                View All →
              </Link>
            </div>
            <div className="dashboard__tools-grid">
              {tools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="dashboard__tool-item"
                >
                  <span className="dashboard__tool-emoji">{tool.emoji}</span>
                  <span className="dashboard__tool-name">{tool.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Article */}
          <div className="dashboard__widget">
            <div className="dashboard__widget-header">
              <h2 className="dashboard__widget-title">📰 Latest Article</h2>
              <Link href="/blog" className="dashboard__widget-link">
                All Posts →
              </Link>
            </div>
            {featured ? (
              <Link href={`/blog/${featured.slug}`} className="dashboard__featured">
                <div className="dashboard__featured-image-wrap">
                  {featured.image ? (
                    <img
                      src={featured.image}
                      alt={featured.title}
                      className="dashboard__featured-image"
                    />
                  ) : (
                    <div
                      className={`dashboard__featured-placeholder dashboard__featured-placeholder--${featured.category.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <span className="dashboard__featured-placeholder-icon">
                        {getCategoryIcon(featured.category)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="dashboard__featured-body">
                  <span
                    className={`blog-card__category ${getCategoryClass(featured.category)}`}
                  >
                    {featured.category}
                  </span>
                  <h3 className="dashboard__featured-title">{featured.title}</h3>
                  <p className="dashboard__featured-excerpt">{featured.excerpt}</p>
                  <div className="dashboard__featured-meta">
                    <span>{featured.displayDate}</span>
                    <span className="dashboard__dot">·</span>
                    <span>{featured.readTime}</span>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="empty-state">
                <div className="empty-state__icon">🔍</div>
                <h3 className="empty-state__title">No posts found</h3>
                <p className="empty-state__text">Try a different search or category.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Recent Posts ── */}
        {recent.length > 0 && (
          <section className="dashboard__recent">
            <div className="dashboard__widget-header">
              <h2 className="dashboard__widget-title">📚 Recent Posts</h2>
              <Link href="/blog" className="dashboard__widget-link">
                Browse All →
              </Link>
            </div>
            <div className="dashboard__recent-grid">
              {recent.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="dashboard__recent-card"
                >
                  <div className="dashboard__recent-image-wrap">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="dashboard__recent-image"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className={`dashboard__recent-placeholder dashboard__recent-placeholder--${post.category.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <span>{getCategoryIcon(post.category)}</span>
                      </div>
                    )}
                  </div>
                  <div className="dashboard__recent-body">
                    <span
                      className={`blog-card__category ${getCategoryClass(post.category)}`}
                    >
                      {post.category}
                    </span>
                    <h3 className="dashboard__recent-title">{post.title}</h3>
                    <div className="dashboard__recent-meta">
                      <span>{post.displayDate}</span>
                      <span className="dashboard__dot">·</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Newsletter CTA ── */}
        <section className="dashboard__cta">
          <div className="dashboard__cta-text">
            <h3 className="dashboard__cta-title">📬 Stay in the loop</h3>
            <p className="dashboard__cta-desc">
              Get notified when I publish new SharePoint &amp; Power Platform guides. No spam, unsubscribe anytime.
            </p>
          </div>
          <Link href="/contact" className="home-btn home-btn--primary">
            Subscribe →
          </Link>
        </section>
      </div>
    </div>
  )
}
