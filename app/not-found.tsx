import Link from 'next/link'
import { getAllPosts } from '@/lib/blogService'

export default async function NotFound() {
  const posts = await getAllPosts()
  const popularPosts = posts.slice(0, 3)

  return (
    <div className="container">
      <div className="not-found">
        <div className="not-found__code">404</div>
        <h1 className="not-found__title">Page Not Found</h1>
        <p className="not-found__desc">
          The page you’re looking for doesn’t exist or was moved.
        </p>
        <div className="not-found__actions">
          <Link href="/" className="home-btn home-btn--primary">Go Home</Link>
          <Link href="/blog" className="home-btn home-btn--outline">Browse Blog</Link>
        </div>

        {popularPosts.length > 0 && (
          <div className="not-found__popular">
            <h2>Popular Posts</h2>
            <div className="not-found__list">
              {popularPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="not-found__link">
                  {post.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="not-found__tools">
          <h2>Free Developer Tools</h2>
          <div className="not-found__list">
            <Link href="/tools/guid-generator" className="not-found__link">GUID Generator</Link>
            <Link href="/tools/caml-query-builder" className="not-found__link">CAML Query Builder</Link>
            <Link href="/tools/json-column-formatter" className="not-found__link">JSON Formatter</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
