import { Link } from 'react-router-dom'
import type { BlogPost } from '../data/blog'

interface RelatedPostsProps {
  currentPost: BlogPost
  allPosts: BlogPost[]
}

export default function RelatedPosts({ currentPost, allPosts }: RelatedPostsProps) {
  const related = allPosts
    .filter((p) => p.id !== currentPost.id)
    .map((p) => {
      const overlap = (currentPost.tags || []).filter((t) =>
        (p.tags || []).includes(t)
      ).length
      const sameCategory = p.category === currentPost.category ? 1 : 0
      return { post: p, score: overlap + sameCategory }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.post)

  if (related.length === 0) return null

  return (
    <section className="related-posts">
      <h3 className="related-posts__title">Related Posts</h3>
      <div className="related-posts__grid">
        {related.map((post) => (
          <Link to={`/blog/${post.slug}`} key={post.id} className="related-posts__card">
            <span className="related-posts__category">{post.category}</span>
            <h4 className="related-posts__name">{post.title}</h4>
            <span className="related-posts__meta">{post.readTime}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
