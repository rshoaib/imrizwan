import Link from 'next/link'
import type { BlogPost } from '@/data/blog'

export default function RelatedPosts({
  currentPost,
  allPosts,
}: {
  currentPost: BlogPost
  allPosts: BlogPost[]
}) {
  const related = allPosts
    .filter(
      (p) =>
        p.id !== currentPost.id &&
        (p.category === currentPost.category ||
          (p.tags || []).some((t) => (currentPost.tags || []).includes(t)))
    )
    .slice(0, 3)

  if (related.length === 0) return null

  return (
    <section className="related-posts">
      <h2 className="related-posts__title">Related Articles</h2>
      <div className="related-posts__grid">
        {related.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="related-posts__card">
            <h3>{post.title}</h3>
            <span className="related-posts__meta">{post.displayDate} · {post.readTime}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
