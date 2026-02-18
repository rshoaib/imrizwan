import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import SEO from '../components/SEO'
import AdSlot from '../components/AdSlot'
import { getPostBySlug } from '../lib/blogService'
import type { BlogPost as BlogPostType } from '../data/blog'

/** Very simple markdown-to-HTML renderer for blog content */
function renderMarkdown(md: string): string {
  let html = md
    // Code blocks (```lang ... ```)
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, lang, code) => {
      return `<pre><code class="language-${lang || ''}">${escapeHtml(code.trim())}</code></pre>`
    })
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // H3
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    // H2
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Blockquote
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Unordered list items
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Ordered list items
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Paragraphs (double newlines)
    .replace(/\n\n+/g, '</p><p>')
    // Single newlines within paragraphs
    .replace(/\n/g, '<br/>')

  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li>.*?<\/li>)(\s*<br\/>?\s*<li>)/g, '$1$2')
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
  // Clean up nested <ul> tags
  html = html.replace(/<\/ul>\s*<ul>/g, '')

  // Wrap in paragraph tags
  html = `<p>${html}</p>`
  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '')
  // Clean up blockquotes wrapped in <p>
  html = html.replace(/<p>\s*(<blockquote>)/g, '$1')
  html = html.replace(/(<\/blockquote>)\s*<\/p>/g, '$1')
  // Clean up <pre> wrapped in <p>
  html = html.replace(/<p>\s*(<pre>)/g, '$1')
  html = html.replace(/(<\/pre>)\s*<\/p>/g, '$1')
  // Clean up headings wrapped in <p>
  html = html.replace(/<p>\s*(<h[23]>)/g, '$1')
  html = html.replace(/(<\/h[23]>)\s*<\/p>/g, '$1')
  // Clean up <ul> wrapped in <p>
  html = html.replace(/<p>\s*(<ul>)/g, '$1')
  html = html.replace(/(<\/ul>)\s*<\/p>/g, '$1')

  return html
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function getCategoryClass(category: string): string {
  return `blog-card__category--${category.toLowerCase().replace(/\s+/g, '-')}`
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPostType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      getPostBySlug(slug).then((data) => {
        setPost(data || null)
        setLoading(false)
      })
    }
  }, [slug])

  if (loading) {
    return (
      <div className="loading">
        <div className="loading__spinner" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="post">
        <div className="empty-state">
          <div className="empty-state__icon">404</div>
          <h3 className="empty-state__title">Post not found</h3>
          <p className="empty-state__text">
            The post you're looking for doesn't exist.
          </p>
          <Link to="/blog" className="hero__cta" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
            ← Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        url={`/blog/${post.slug}`}
        image={post.image}
        type="article"
        publishedTime={post.date}
        tags={post.tags}
      />

      <article className="post">
        <Link to="/blog" className="post__back">
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
        </header>

        {post.image && (
          <img src={post.image} alt={post.title} className="post__image" />
        )}

        <AdSlot type="leaderboard" />

        <div
          className="post__content"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />

        <AdSlot type="leaderboard" />
      </article>
    </>
  )
}
