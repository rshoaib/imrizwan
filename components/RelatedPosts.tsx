import Link from 'next/link'
import type { BlogPost } from '@/lib/blogService'

export default function RelatedPosts({
  relatedPosts,
}: {
  relatedPosts: BlogPost[]
}) {
  if (relatedPosts.length === 0) return null

  return (
    <section className="related-posts">
      <h2 className="related-posts__title">Related Articles</h2>
      <div className="related-posts__grid">
        {relatedPosts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="related-posts__card">
            <h3>{post.title}</h3>
            <span className="related-posts__meta">{post.displayDate} · {post.readTime}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
