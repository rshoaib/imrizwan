'use client'

import { useEffect } from 'react'

export default function AdSlot({ type = 'leaderboard', slot = 'TODO_ADD_REAL_SLOT_ID' }: { type?: 'leaderboard' | 'rectangle', slot?: string }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (err) {
        console.error('AdSense error:', err)
      }
    }
  }, [])

  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`ad-slot ${type === 'rectangle' ? 'ad-slot--rectangle' : ''}`} style={{ border: '1px dashed #ccc', textAlign: 'center', padding: '20px', margin: '2rem 0', color: 'var(--text-muted)' }}>
        Ad Slot ({type === 'rectangle' ? '300×250' : '728×90'}) - Slot: {slot}
      </div>
    )
  }

  return (
    <div className={`ad-slot ${type === 'rectangle' ? 'ad-slot--rectangle' : ''}`} aria-label="Advertisement" style={{ margin: '2rem 0', textAlign: 'center' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client="ca-pub-3166995085202346"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
