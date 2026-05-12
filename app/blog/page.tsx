import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getAllPosts } from '@/lib/blogService'
import BlogListClient from './BlogListClient'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>
}): Promise<Metadata> {
  const { tag } = await searchParams
  const title = tag ? `#${tag} Articles | ImRizwan Blog` : 'Blog | ImRizwan'
  const description = tag
    ? `Articles tagged with #${tag} on ImRizwan — SharePoint, SPFx, and Power Platform guides.`
    : 'SharePoint Framework, Power Platform, and Microsoft 365 development articles with real code examples.'

  return {
    title,
    description,
    alternates: { canonical: tag ? `/blog?tag=${tag}` : '/blog' },
  }
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <Suspense fallback={<div className="container"><p>Loading…</p></div>}>
      <BlogListClient initialPosts={posts} />
    </Suspense>
  )
}
