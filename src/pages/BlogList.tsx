import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO'
import BlogCard from '../components/BlogCard'
import { getAllPosts } from '../lib/blogService'
import type { BlogPost } from '../data/blog'

const CATEGORIES = ['All', 'SPFx', 'Power Platform', 'SharePoint', 'Microsoft 365']

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    getAllPosts().then((data) => {
      setPosts(data)
      setLoading(false)

      // Check for tag query param
      const tagParam = searchParams.get('tag')
      if (tagParam) {
        setSearchQuery(`#${tagParam}`)
      }
    })
  }, [searchParams])

  // Filter posts when search or category changes
  useEffect(() => {
    let result = posts

    // Category filter
    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory)
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      if (q.startsWith('#')) {
        // Tag search
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
  }, [posts, activeCategory, searchQuery])

  const handleFilter = (category: string) => {
    setActiveCategory(category)
    // Clear tag param when switching category
    if (searchParams.has('tag')) {
      setSearchParams({})
      setSearchQuery('')
    }
  }

  return (
    <>
      <SEO
        title="Blog"
        description="Articles on SPFx webpart development, Power Platform solutions, SharePoint customization, and Microsoft 365 tips — with real code and screenshots."
        url="/blog"
      />

      <div className="container">
        <div className="page-title reveal">
          <h1>Blog</h1>
          <p>Real-world solutions with code and screenshots</p>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <span className="search-bar__icon">🔍</span>
          <input
            type="text"
            className="search-bar__input"
            placeholder="Search posts or #tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="search-bar__clear"
              onClick={() => {
                setSearchQuery('')
                if (searchParams.has('tag')) setSearchParams({})
              }}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filters */}
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

        {loading ? (
          <div className="loading">
            <div className="loading__spinner" />
          </div>
        ) : filteredPosts.length === 0 ? (
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
    </>
  )
}
