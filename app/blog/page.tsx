import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getAllPosts } from '@/lib/blogService'
import BlogListClient from './BlogListClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Articles on SPFx webpart development, Power Platform solutions, SharePoint customization, and Microsoft 365 tips — with real code and screenshots.',
  alternates: { canonical: '/blog' },
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <Suspense>
      <BlogListClient initialPosts={posts} />
    </Suspense>
  )
}
