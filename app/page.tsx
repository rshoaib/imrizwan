import { getAllPosts } from '@/lib/blogService'
import HomeClient from './HomeClient'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const allPosts = await getAllPosts()

  return <HomeClient initialPosts={allPosts} />
}
