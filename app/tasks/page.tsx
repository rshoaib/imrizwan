import type { Metadata } from 'next'
import TasksClient from './TasksClient'

export const metadata: Metadata = {
  title: 'Tasks',
  description: 'Personal task management board.',
  robots: { index: false, follow: false },
}

export default function TasksPage() {
  return <TasksClient />
}
