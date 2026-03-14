'use client'

import React from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import dynamic from 'next/dynamic'

type ToolProp = {
  tool: {
    name: string;
    slug: string;
    description: string;
    emoji: string;
    tags: string[];
    faqs: { question: string; answer: string; }[];
  }
}

const ArchitectureCanvasCore = dynamic<ToolProp>(
  () => import('./ArchitectureCanvasCore'),
  { 
    ssr: false, 
    loading: () => (
      <div className="mc-panel mc-center" style={{ minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading Canvas Interface...</p>
      </div>
    ) 
  }
)

export default function ArchitectureCanvasClient({ tool }: ToolProp) {
  return (
    <ReactFlowProvider>
      <ArchitectureCanvasCore tool={tool} />
    </ReactFlowProvider>
  )
}
