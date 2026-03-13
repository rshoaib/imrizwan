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

export const blogPosts: BlogPost[] = [];
