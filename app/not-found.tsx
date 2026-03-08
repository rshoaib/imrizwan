import Link from 'next/link'
import { getAllPosts } from '@/lib/blogService'
import { tools } from '@/data/tools'

export default async function NotFound() {
  const posts = await getAllPosts()
  const popularPosts = posts.slice(0, 3)
  const popularTools = tools.slice(0, 4)

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '5rem', fontWeight: 800, lineHeight: 1 }} className="gradient-text">
          404
        </h1>
        <h2 style={{ fontSize: '1.5rem', marginTop: '0.5rem', color: 'var(--text-primary)' }}>
          Page Not Found
        </h2>
        <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)', maxWidth: '460px', marginInline: 'auto' }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Try one of these instead:
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: '800px', marginInline: 'auto' }}>
        {/* Popular Articles */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            📝 Popular Articles
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {popularPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{ fontSize: '0.875rem', color: 'var(--accent)', textDecoration: 'none' }}
              >
                {post.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Tools */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            🛠️ Free Tools
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {popularTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                style={{ fontSize: '0.875rem', color: 'var(--accent)', textDecoration: 'none' }}
              >
                {tool.emoji} {tool.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link href="/" className="home-btn home-btn--primary">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
