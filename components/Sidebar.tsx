'use client'

import Link from 'next/link'
import { tools } from '@/data/tools'

const CATEGORIES = ['All', 'SPFx', 'Power Platform', 'SharePoint', 'Microsoft 365']

export default function Sidebar({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
}: {
  searchQuery: string
  setSearchQuery: (q: string) => void
  activeCategory: string
  setActiveCategory: (cat: string) => void
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar__sticky-wrapper">
      {/* Search */}
      <div className="sidebar__section">
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
      </div>

      {/* Categories */}
      <div className="sidebar__section">
        <h3 className="sidebar__heading">Categories</h3>
        <div className="sidebar__categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`sidebar__cat-btn ${activeCategory === cat ? 'sidebar__cat-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="sidebar__section sidebar__about">
        <div className="sidebar__avatar">R</div>
        <h3 className="sidebar__about-name">Rizwan</h3>
        <p className="sidebar__about-bio">
          SharePoint &amp; Power Platform Developer — writing about real problems I solve with code.
        </p>
        <Link href="/about" className="sidebar__about-link">
          More about me →
        </Link>
      </div>

      {/* Dev Tools */}
      <div className="sidebar__section">
        <h3 className="sidebar__heading">Free Dev Tools</h3>
        <div className="sidebar__tools">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="sidebar__tool-link"
            >
              <span className="sidebar__tool-emoji">{tool.emoji}</span>
              <span>{tool.name}</span>
            </Link>
          ))}
        </div>
      </div>
      </div>
    </aside>
  )
}
