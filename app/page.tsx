import Link from 'next/link'
import BlogCard from '@/components/BlogCard'
import { getAllPosts } from '@/lib/blogService'

export const dynamic = 'force-dynamic'

const expertise = [
  { icon: '⚡', label: 'SPFx Web Parts' },
  { icon: '🔄', label: 'Power Automate' },
  { icon: '🤖', label: 'Copilot Studio' },
  { icon: '📊', label: 'SharePoint Online' },
  { icon: '🔌', label: 'Graph API' },
  { icon: '🛠️', label: 'PnP PowerShell' },
]

export default async function Home() {
  const allPosts = await getAllPosts()
  const featured = allPosts[0]
  const recent = allPosts.slice(1, 4)

  return (
    <>
      {/* Hero */}
      <section className="home-hero">
        <div className="container">
          <div className="home-hero__grid">
            <div className="home-hero__content">
              <div className="home-hero__wave">👋</div>
              <h1 className="home-hero__title">
                I&apos;m <span className="gradient-text">Rizwan</span>,<br />
                I build things on<br />
                <span className="gradient-text">Microsoft 365</span>
              </h1>
              <p className="home-hero__desc">
                SPFx web parts, Power Platform solutions, and SharePoint
                customizations. I write about real problems I&apos;ve solved&nbsp;&mdash;
                with code and step-by-step guides.
              </p>
              <div className="home-hero__actions">
                <Link href="/blog" className="home-btn home-btn--primary">
                  Read the Blog →
                </Link>
                <Link href="/tools" className="home-btn home-btn--outline">
                  Free Dev Tools
                </Link>
              </div>
            </div>

            {/* Expertise pills */}
            <div className="home-hero__aside">
              <div className="expertise">
                <p className="expertise__label">What I work with</p>
                <div className="expertise__grid">
                  {expertise.map((e) => (
                    <div key={e.label} className="expertise__pill">
                      <span className="expertise__icon">{e.icon}</span>
                      {e.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured post */}
      {featured && (
        <section className="section">
          <div className="container">
            <p className="home-label">Latest Article</p>
            <Link href={`/blog/${featured.slug}`} className="featured-card">
              <div className="featured-card__content">
                <span className="featured-card__cat">{featured.category}</span>
                <h2 className="featured-card__title">{featured.title}</h2>
                <p className="featured-card__excerpt">{featured.excerpt}</p>
                <span className="featured-card__meta">
                  {featured.displayDate} · {featured.readTime}
                </span>
              </div>
              <div className="featured-card__action">Read →</div>
            </Link>
          </div>
        </section>
      )}

      {/* More posts */}
      {recent.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section__header">
              <h2 className="section__title">More Articles</h2>
              <Link href="/blog" className="section__link">View all →</Link>
            </div>
            <div className="blog-grid">
              {recent.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats / social proof ribbon */}
      <section className="section">
        <div className="container">
          <div className="stats-ribbon">
            <div className="stats-ribbon__item">
              <span className="stats-ribbon__number">{allPosts.length}+</span>
              <span className="stats-ribbon__label">Articles</span>
            </div>
            <div className="stats-ribbon__item">
              <span className="stats-ribbon__number">7</span>
              <span className="stats-ribbon__label">Free Tools</span>
            </div>
            <div className="stats-ribbon__item">
              <span className="stats-ribbon__number">M365</span>
              <span className="stats-ribbon__label">Ecosystem</span>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
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
