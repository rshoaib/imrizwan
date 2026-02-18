import { useState, useEffect } from 'react'
import SEO from '../components/SEO'
import BlogCard from '../components/BlogCard'
import { getAllPosts } from '../lib/blogService'
import type { BlogPost } from '../data/blog'

const CATEGORIES = ['All', 'SPFx', 'Power Platform', 'SharePoint', 'Microsoft 365']

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllPosts().then((data) => {
      setPosts(data)
      setFilteredPosts(data)
      setLoading(false)
    })
  }, [])

  const handleFilter = (category: string) => {
    setActiveCategory(category)
    if (category === 'All') {
      setFilteredPosts(posts)
    } else {
      setFilteredPosts(posts.filter((p) => p.category === category))
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
        <div className="page-title">
          <h1>Blog</h1>
          <p>Real-world solutions with code and screenshots</p>
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
              No posts in this category yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="blog-grid">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
