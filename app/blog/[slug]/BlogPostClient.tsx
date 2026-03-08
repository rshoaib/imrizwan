'use client'

import Link from 'next/link'
import AdSlot from '@/components/AdSlot'
import TableOfContents from '@/components/TableOfContents'
import CopyCodeButton from '@/components/CopyCodeButton'
import RelatedPosts from '@/components/RelatedPosts'
import RelatedTools from '@/components/RelatedTools'
import ShareButtons from '@/components/ShareButtons'
import ReadingProgress from '@/components/ReadingProgress'
import type { BlogPost } from '@/data/blog'

/** Very simple markdown-to-HTML renderer for blog content */
function renderMarkdown(md: string): string {
  let html = md
    // Table blocks
    .replace(/((?:^\|.+\|$\n?)+)/gm, (_match, table: string) => {
      const rows = table.trim().split('\n').filter((r: string) => !/^\|[\s\-:|]+\|$/.test(r))
      if (rows.length === 0) return table
      const parseRow = (row: string) =>
        row.split('|').slice(1, -1).map((c: string) => c.trim())
      const headerCells = parseRow(rows[0])
      const bodyRows = rows.slice(1)
      let t = '<table><thead><tr>'
      headerCells.forEach((c: string) => { t += `<th>${c}</th>` })
      t += '</tr></thead><tbody>'
      bodyRows.forEach((row: string) => {
        t += '<tr>'
        parseRow(row).forEach((c: string) => { t += `<td>${c}</td>` })
        t += '</tr>'
      })
      t += '</tbody></table>'
      return t
    })
    // Code blocks
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
    // Paragraphs
    .replace(/\n\n+/g, '</p><p>')
    // Single newlines
    .replace(/\n/g, '<br/>')

  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li>.*?<\/li>)(\s*<br\/?>?\s*<li>)/g, '$1$2')
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
  html = html.replace(/<\/ul>\s*<ul>/g, '')

  // Wrap in paragraph tags
  html = `<p>${html}</p>`
  html = html.replace(/<p>\s*<\/p>/g, '')
  html = html.replace(/<p>\s*(<blockquote>)/g, '$1')
  html = html.replace(/(<\/blockquote>)\s*<\/p>/g, '$1')
  html = html.replace(/<p>\s*(<pre>)/g, '$1')
  html = html.replace(/(<\/pre>)\s*<\/p>/g, '$1')
  html = html.replace(/<p>\s*(<h[23]>)/g, '$1')
  html = html.replace(/(<\/h[23]>)\s*<\/p>/g, '$1')
  html = html.replace(/<p>\s*(<ul>)/g, '$1')
  html = html.replace(/(<\/ul>)\s*<\/p>/g, '$1')
  html = html.replace(/<p>\s*(<table>)/g, '$1')
  html = html.replace(/(<\/table>)\s*<\/p>/g, '$1')

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

export default function BlogPostClient({
  post,
  allPosts,
}: {
  post: BlogPost
  allPosts: BlogPost[]
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
              <Link href={`/blog?tag=${tag}`} key={tag} className="tag-pill">
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {post.image && (
        <img src={post.image} alt={post.title} className="post__image" />
      )}

      <AdSlot type="leaderboard" />

      <div className="post-layout">
        <div
          className="post__content"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />
        <TableOfContents content={post.content} />
      </div>

      <CopyCodeButton />

      <AdSlot type="leaderboard" />

      <ShareButtons url={`/blog/${post.slug}`} title={post.title} />

      <RelatedPosts currentPost={post} allPosts={allPosts} />

      <RelatedTools currentSlug="" />
    </article>
    </>
  )
}
