'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import BlogCard from '@/components/BlogCard'
import BlogSearch from '@/components/BlogSearch'
import type { BlogPost } from '@/data/blog'

const CATEGORIES = ['All', 'SPFx', 'Power Platform', 'SharePoint', 'Microsoft 365']

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

  // Filter posts when search or category changes
  useEffect(() => {
    let result = initialPosts

    // Category filter
    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory)
    }

    // Search filter
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
      <div className="page-title reveal">
        <h1>Blog</h1>
        <p>Real-world solutions with code and screenshots</p>
      </div>

      <BlogSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onClear={() => setSearchQuery('')}
      />

      <div className="filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${activeCategory === cat ? 'filter-btn--active' : ''}`}
            onClick={() => handleFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">🔍</div>
          <h3 className="empty-state__title">No posts found</h3>
          <p className="empty-state__text">
            {searchQuery
              ? 'No posts match your search. Try a different term.'
              : 'No posts in this category yet. Check back soon!'}
          </p>
        </div>
      ) : (
        <div className="blog-grid reveal-stagger">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
