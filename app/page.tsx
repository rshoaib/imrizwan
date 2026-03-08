import { getAllPosts } from '@/lib/blogService'
import HomeClient from './HomeClient'

export const revalidate = 60 // ISR: refresh from Supabase every 60 seconds

export default async function Home() {
  const allPosts = await getAllPosts()

  return <HomeClient initialPosts={allPosts} />
}
