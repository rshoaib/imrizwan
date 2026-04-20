'use client'

import Link from 'next/link'
import Image from 'next/image'
import AdSlot from '@/components/AdSlot'
import TableOfContents from '@/components/TableOfContents'
import CopyCodeButton from '@/components/CopyCodeButton'
import RelatedPosts from '@/components/RelatedPosts'
import RelatedTools from '@/components/RelatedTools'
import ShareButtons from '@/components/ShareButtons'
import NewsletterCTA from '@/components/NewsletterCTA'
import ReadingProgress from '@/components/ReadingProgress'
import ToolCTABanner from '@/components/ToolCTABanner'
import type { BlogPost } from '@/lib/blogService'


function getCategoryClass(category: string): string {
  return `blog-card__category--${category.toLowerCase().replace(/\s+/g, '-')}`
}

export default function BlogPostClient({
  post,
  relatedPosts,
  htmlContent,
}: {
  post: BlogPost
  relatedPosts: BlogPost[]
  htmlContent: string
}) {
  return (
    <>
    <ReadingProgress />
    <article className="post">
      <Link href="/blog" className="post__back">
        ← Back to Blog
      </Link>

      <header className="post__header">
        <div className="post__meta">
          <span className={`blog-card__category ${getCategoryClass(post.category)}`}>
            {post.category}
          </span>
          <span className="blog-card__date">{post.displayDate}</span>
          <span className="blog-card__read-time">{post.readTime}</span>
        </div>
        <h1 className="post__title">{post.title}</h1>
        <p className="post__excerpt">{post.excerpt}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="post__tags">
            {post.tags.map((tag) => (
              <Link href={`/blog?tag=${tag}`} key={tag} className="tag-pill" rel="nofollow">
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {post.image && (
        <Image src={post.image} alt={post.title} className="post__image" width={800} height={400} priority />
      )}

      <AdSlot type="leaderboard" />

      <div className="post-layout">
        <div
          className="post__content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
        <TableOfContents content={htmlContent} />
      </div>

      <CopyCodeButton />

      <ToolCTABanner category={post.category} />

      <AdSlot type="leaderboard" />

      <ShareButtons url={`/blog/${post.slug}`} title={post.title} />

      <RelatedPosts relatedPosts={relatedPosts} />

      <NewsletterCTA />

      <RelatedTools currentSlug={post.category.toLowerCase().replace(/\s+/g, '-')} />
    </article>
    </>
  )
}
