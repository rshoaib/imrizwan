'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import BlogFeed from '@/components/BlogFeed'
import Sidebar from '@/components/Sidebar'
import type { BlogPost } from '@/data/blog'

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
    if (searchQuery.startsWith('#')) {
      setSearchQuery('')
    }
  }

  return (
    <>
      {/* CV-Style Profile Card */}
      <section className="profile-card">
        <div className="container">
          <div className="profile-card__inner">
            {/* Left: Identity */}
            <div className="profile-card__identity">
              <div className="profile-card__avatar-wrap">
                <div className="profile-card__avatar">R</div>
                <span className="profile-card__status" title="Open to Work">
                  <span className="profile-card__status-dot" />
                </span>
              </div>
              <div className="profile-card__info">
                <div className="profile-card__name-row">
                  <h1 className="profile-card__name">
                    <span className="gradient-text">Rizwan</span>
                  </h1>
                  <span className="profile-card__badge">
                    <span className="profile-card__badge-dot" />
                    Open to Work
                  </span>
                </div>
                <p className="profile-card__role">SharePoint &amp; Power Platform Developer</p>
                <p className="profile-card__bio">
                  I build enterprise solutions on Microsoft 365 — and write about real problems I solve with code.
                </p>
              </div>
            </div>

            {/* Right: Stats + CTA */}
            <div className="profile-card__right">
              <div className="profile-card__stats">
                <div className="profile-card__stat">
                  <span className="profile-card__stat-value">5+</span>
                  <span className="profile-card__stat-label">Years Exp.</span>
                </div>
                <div className="profile-card__stat">
                  <span className="profile-card__stat-value">{initialPosts.length}+</span>
                  <span className="profile-card__stat-label">Articles</span>
                </div>
                <div className="profile-card__stat">
                  <span className="profile-card__stat-value">8</span>
                  <span className="profile-card__stat-label">Free Tools</span>
                </div>
              </div>
              <div className="profile-card__tech">
                {['SPFx', 'Power Automate', 'Graph API', 'PnP', 'React'].map((t) => (
                  <span key={t} className="profile-card__tech-pill">{t}</span>
                ))}
              </div>
              <Link href="/contact" className="profile-card__cta">
                💼 Hire Me
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Search & Filters (shown only on mobile) */}
      <div className="container mobile-controls">
        <div className="sidebar__search-wrap">
          <span className="sidebar__search-icon">🔍</span>
          <input
            type="text"
            className="sidebar__search"
            placeholder="Search posts or #tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="sidebar__search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        <div className="filters">
          {['All', 'SPFx', 'Power Platform', 'SharePoint', 'Microsoft 365'].map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'filter-btn--active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container">
        <div className="blog-layout">
          <main className="blog-layout__main">
            <BlogFeed posts={filteredPosts} />
          </main>

          <Sidebar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeCategory={activeCategory}
            setActiveCategory={handleCategoryChange}
          />
        </div>
      </div>

      {/* Newsletter CTA */}
      <section className="section">
        <div className="container">
          <div className="home-cta">
            <div className="home-cta__text">
              <h3 className="home-cta__title">📬 Stay in the loop</h3>
              <p className="home-cta__desc">
                Get notified when I publish new SharePoint &amp; Power Platform guides. No spam, unsubscribe anytime.
              </p>
            </div>
            <Link href="/contact" className="home-btn home-btn--primary">
              Subscribe →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
