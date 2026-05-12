import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getAllPosts } from '@/lib/blogService'
import BlogListClient from './BlogListClient'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams
  const tag = typeof params?.tag === 'string' ? params.tag : undefined

  return {
    title: tag ? `Blog - ${tag}` : 'Blog',
    description:
      'Articles on SPFx webpart development, Power Platform solutions, SharePoint customization, and Microsoft 365 tips — with real code and screenshots.',
    alternates: { canonical: '/blog' },
    ...(tag && {
      robots: {
        index: false,
        follow: true,
      },
    }),
  }
}

export default async function BlogPage({ searchParams }: Props) {
  const posts = await getAllPosts()

  return (
    <Suspense>
      <BlogListClient initialPosts={posts} />
    </Suspense>
  )
}
