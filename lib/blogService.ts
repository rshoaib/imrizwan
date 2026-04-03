import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

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

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog')

function getPostFromFile(filename: string): BlogPost {
  const filePath = path.join(POSTS_DIR, filename)
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const slug = filename.replace(/\.md$/, '')
  return {
    id: slug,
    slug,
    title: data.title,
    excerpt: data.excerpt,
    content,
    date: data.date,
    displayDate: data.displayDate,
    readTime: data.readTime,
    category: data.category as BlogPost['category'],
    ...(data.image ? { image: data.image } : {}),
    ...(data.tags ? { tags: data.tags } : {}),
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'))
  const posts = files.map(getPostFromFile)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const filePath = path.join(POSTS_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return undefined
  return getPostFromFile(`${slug}.md`)
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const posts = await getAllPosts()
  if (category === 'All') return posts
  return posts.filter(p => p.category === category)
}
