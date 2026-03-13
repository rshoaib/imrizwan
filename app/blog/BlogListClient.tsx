'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import BlogFeed from '@/components/BlogFeed'
import Sidebar from '@/components/Sidebar'
import type { BlogPost } from '@/data/blog'

export default function BlogListClient({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(initialPosts)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const searchParams = useSearchParams()

  useEffect(() => {
    const tagParam = searchParams?.get('tag')
    if (tagParam) {
      setSearchQuery(`#${tagParam}`)
    }
  }, [searchParams])

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

  const handleFilter = (category: string) => {
    setActiveCategory(category)
    if (searchQuery.startsWith('#')) {
      setSearchQuery('')
    }
  }

  return (
    <div className="container">
      <div suppressHydrationWarning className="page-title reveal">
        <h1>Blog</h1>
        <p>Real-world solutions with code and screenshots</p>
      </div>

      {/* Mobile Search & Filters */}
      <div className="mobile-controls">
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
              onClick={() => handleFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="blog-layout">
        <main className="blog-layout__main">
          <BlogFeed posts={filteredPosts} />
        </main>

        <Sidebar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeCategory={activeCategory}
          setActiveCategory={handleFilter}
        />
      </div>
    </div>
  )
}
