'use client'

import dynamic from 'next/dynamic'
import React from 'react'

const ErrorDecoderClient = dynamic(
  () => import('./ErrorDecoderClient'),
  { 
    ssr: false, 
    loading: () => (
      <div className="mc-panel mc-center" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading Decoder Engine...</p>
      </div>
    ) 
  }
)

export default function ErrorDecoderWrapper() {
  return <ErrorDecoderClient />
}
