import { getAllPosts } from '@/lib/blogService'
import { tools } from '@/data/tools'
import type { MetadataRoute } from 'next'

const SITE_URL = 'https://imrizwan.com'
const SITE_LAUNCH = '2026-01-01'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const posts = await getAllPosts()

    const staticPages: MetadataRoute.Sitemap = [
        { url: `${SITE_URL}/`, lastModified: SITE_LAUNCH, changeFrequency: 'weekly', priority: 1.0 },
        { url: `${SITE_URL}/blog`, lastModified: SITE_LAUNCH, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${SITE_URL}/tools`, lastModified: SITE_LAUNCH, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${SITE_URL}/projects`, lastModified: SITE_LAUNCH, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${SITE_URL}/about`, lastModified: SITE_LAUNCH, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${SITE_URL}/contact`, lastModified: SITE_LAUNCH, changeFrequency: 'monthly', priority: 0.6 },
    ]

    const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
        url: `${SITE_URL}/tools/${tool.slug}`,
        lastModified: SITE_LAUNCH,
        changeFrequency: 'monthly',
        priority: 0.8,
    }))

    const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }))

    return [...staticPages, ...toolPages, ...blogPages]
}
