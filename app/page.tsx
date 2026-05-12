import { getAllPosts } from '@/lib/blogService'
import HomeClient from '@/components/HomeClient'

export default async function HomePage() {
  const posts = await getAllPosts()
  return <HomeClient posts={posts} />
}
