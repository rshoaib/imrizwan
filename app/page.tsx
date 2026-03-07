import Link from 'next/link'
import { getAllPosts } from '@/lib/blogService'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const allPosts = await getAllPosts()
  const posts = allPosts.slice(0, 6)

  return (
    <>
      {/* Hero — clean, typographic, no blobs */}
      <section className="hero-minimal">
        <div className="container">
          <p className="hero-minimal__label">SharePoint &amp; Power Platform Developer</p>
          <h1 className="hero-minimal__title">
            Hi, I&apos;m <span className="hero-minimal__name">Rizwan</span>
          </h1>
          <p className="hero-minimal__desc">
            I build SPFx webparts, Power Platform solutions, and SharePoint
            customizations. This blog documents real problems I&apos;ve solved&nbsp;&mdash;
            with code and step-by-step guides.
          </p>
          <div className="hero-minimal__actions">
            <Link href="/blog" className="btn btn--primary">
              Read the Blog
            </Link>
            <Link href="/tools" className="btn btn--ghost">
              Free Tools
            </Link>
          </div>
        </div>
      </section>

      {/* Recent posts — simple list */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Recent Posts</h2>
            <Link href="/blog" className="section__link">
              View all →
            </Link>
          </div>

          {posts.length === 0 ? (
            <p className="text-muted">No posts yet — stay tuned!</p>
          ) : (
            <ul className="post-list">
              {posts.map((post) => (
                <li key={post.id} className="post-list__item">
                  <Link href={`/blog/${post.slug}`} className="post-list__link">
                    <span className="post-list__date">{post.displayDate}</span>
                    <span className="post-list__title">{post.title}</span>
                    <span className="post-list__tag">{post.category}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Compact newsletter */}
      <section className="section">
        <div className="container">
          <div className="newsletter-inline">
            <p className="newsletter-inline__text">
              📬 Get notified when I publish new guides. No spam.
            </p>
            <Link href="/contact" className="btn btn--small">
              Subscribe →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
