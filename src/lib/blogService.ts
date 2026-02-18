import { supabase } from './supabase'
import { blogPosts as localPosts, type BlogPost } from '../data/blog'

// -------- types --------
interface DbRow {
    id: number
    slug: string
    title: string
    excerpt: string
    content: string
    date: string
    display_date: string
    read_time: string
    category: string
    image: string | null
    tags: string[] | null
}

function rowToPost(r: DbRow): BlogPost {
    return {
        id: String(r.id),
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt,
        content: r.content,
        date: r.date,
        displayDate: r.display_date,
        readTime: r.read_time,
        category: r.category as BlogPost['category'],
        ...(r.image ? { image: r.image } : {}),
        ...(r.tags ? { tags: r.tags } : {}),
    }
}

// -------- cache --------
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes
let cachedPosts: BlogPost[] | null = null
let cacheTime = 0

function isCacheValid() {
    return cachedPosts && Date.now() - cacheTime < CACHE_TTL
}

// -------- public API --------

export async function getAllPosts(): Promise<BlogPost[]> {
    if (isCacheValid()) return cachedPosts!

    if (!supabase) return localPosts

    try {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('date', { ascending: false })

        if (error || !data || data.length === 0) {
            console.warn('[blogService] Supabase fetch failed, using local fallback', error)
            return localPosts
        }

        cachedPosts = (data as DbRow[]).map(rowToPost)
        cacheTime = Date.now()
        return cachedPosts
    } catch (err) {
        console.warn('[blogService] Network error, using local fallback', err)
        return localPosts
    }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const posts = await getAllPosts()
    return posts.find((p) => p.slug === slug)
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
    const posts = await getAllPosts()
    if (category === 'All') return posts
    return posts.filter((p) => p.category === category)
}
