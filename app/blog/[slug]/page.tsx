import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/blogService'
import { extractFaqItems, buildFaqJsonLd } from '@/lib/faqSchema'
import { renderMarkdown } from '@/lib/markdown'
import BlogPostClient from './BlogPostClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  const fullUrl = `https://imrizwan.com/blog/${post.slug}`

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: fullUrl,
      publishedTime: post.date,
      tags: post.tags,
      images: post.image ? [post.image] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
    other: {
      'article:published_time': post.date,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const [post, allPosts] = await Promise.all([
    getPostBySlug(slug),
    getAllPosts(),
  ])

  if (!post) notFound()

  // Article JSON-LD — rendered server-side for SEO crawlers
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.image ? [post.image] : [],
    datePublished: `${post.date}T00:00:00+00:00`,
    dateModified: `${post.date}T00:00:00+00:00`,
    author: {
      '@type': 'Person',
      name: 'Rizwan',
      url: 'https://imrizwan.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ImRizwan',
      logo: {
        '@type': 'ImageObject',
        url: 'https://imrizwan.com/favicon.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://imrizwan.com/blog/${post.slug}`,
    },
    wordCount: post.content?.length ? Math.round(post.content.split(/\s+/).length) : undefined,
    timeRequired: post.readTime ? `PT${parseInt(post.readTime)}M` : undefined,
  }

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://imrizwan.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://imrizwan.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://imrizwan.com/blog/${post.slug}`,
      },
    ],
  }

  // FAQPage JSON-LD — auto-extracted from FAQ section in content
  const faqItems = extractFaqItems(post.content)
  const faqJsonLd = buildFaqJsonLd(faqItems)

  const htmlContent = renderMarkdown(post.content)

  const related = allPosts
    .filter(
      (p) =>
        p.id !== post.id &&
        (p.category === post.category ||
          (p.tags || []).some((t) => (post.tags || []).includes(t)))
    )
    .slice(0, 3)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <BlogPostClient post={post} relatedPosts={related} htmlContent={htmlContent} />
    </>
  )
}
