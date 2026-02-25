import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import BlogCard from '../components/BlogCard'
import NewsletterCTA from '../components/NewsletterCTA'
import { getAllPosts } from '../lib/blogService'
import type { BlogPost } from '../data/blog'

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllPosts().then((data) => {
      setPosts(data.slice(0, 3))
      setLoading(false)
    })
  }, [])

  return (
    <>
      <SEO
        title="Home"
        description="Developer blog by Rizwan — SPFx webparts, Power Platform solutions, SharePoint development tips with real code and screenshots."
        url="/"
      />

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero__badge">
            <span className="hero__badge-dot" />
            SharePoint & Power Platform Developer
          </div>
          <h1 className="hero__title">
            Hi, I'm <span className="hero__title-gradient">Rizwan</span>
          </h1>
          <p className="hero__subtitle">
            I build SPFx webparts, Power Platform solutions, and SharePoint
            customizations. This blog documents real problems I've solved — with
            code, screenshots, and step-by-step guides.
          </p>
          <Link to="/blog" className="hero__cta">
            Read the Blog →
          </Link>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Recent Posts</h2>
            <Link to="/blog" className="section__link">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="loading">
              <div className="loading__spinner" />
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">📝</div>
              <h3 className="empty-state__title">Coming Soon</h3>
              <p className="empty-state__text">
                Blog posts are on the way. Stay tuned!
              </p>
            </div>
          ) : (
            <div className="blog-grid">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="section">
        <div className="container">
          <NewsletterCTA />
        </div>
      </section>
    </>
  )
}
