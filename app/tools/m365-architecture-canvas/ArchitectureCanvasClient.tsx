'use client'

import { ReactFlowProvider } from '@xyflow/react'
import dynamic from 'next/dynamic'

const ArchitectureCanvasCore = dynamic(
  () => import('./ArchitectureCanvasCore'),
  {
    ssr: false,
    loading: () => (
      <div className="mc-panel mc-center" style={{ minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading Canvas Interface...</p>
      </div>
    ),
  }
)

export default function ArchitectureCanvasClient() {
  return (
    <ReactFlowProvider>
      <ArchitectureCanvasCore />
    </ReactFlowProvider>
  )
}
