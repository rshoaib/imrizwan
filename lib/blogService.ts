import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string
  date: string
  displayDate: string
  readTime: string
  category: string
  image?: string
  tags?: string[]
  content: string
}

const postsDirectory = path.join(process.cwd(), 'content/blog')

export async function getAllPosts(): Promise<BlogPost[]> {
  if (!fs.existsSync(postsDirectory)) return []

  const filenames = fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.md'))

  const posts = filenames.map((filename, index) => {
    const filePath = path.join(postsDirectory, filename)
    const fileContents = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContents)

    return {
      id: index + 1,
      slug: filename.replace(/\.md$/, ''),
      title: data.title || '',
      excerpt: data.excerpt || '',
      date: data.date || '',
      displayDate: data.displayDate || '',
      readTime: data.readTime || '',
      category: data.category || '',
      image: data.image || undefined,
      tags: data.tags || [],
      content,
    } as BlogPost
  })

  return posts.sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return isNaN(dateA) || isNaN(dateB) ? 0 : dateB - dateA
  })
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllPosts()
  return posts.find((p) => p.slug === slug) ?? null
}
