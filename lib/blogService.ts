import { supabase } from './supabase'

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  displayDate: string
  readTime: string
  category: 'SPFx' | 'Power Platform' | 'SharePoint' | 'Microsoft 365'
  image?: string
  tags?: string[]
}

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

export async function getAllPosts(): Promise<BlogPost[]> {
    if (!supabase) return []

    try {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('date', { ascending: false })

        if (error || !data) {
            console.warn('[blogService] Supabase fetch failed', error)
            return []
        }

        return (data as DbRow[]).map(rowToPost)
    } catch (err) {
        console.warn('[blogService] Network error', err)
        return []
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
