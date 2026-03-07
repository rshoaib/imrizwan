'use client'

import { useEffect } from 'react'

export default function AdSlot({ type = 'leaderboard' }: { type?: 'leaderboard' | 'rectangle' }) {
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
      <div className={`ad-slot ${type === 'rectangle' ? 'ad-slot--rectangle' : ''}`}>
        Ad Slot ({type === 'rectangle' ? '300×250' : '728×90'})
      </div>
    )
  }

  return (
    <div className={`ad-slot ${type === 'rectangle' ? 'ad-slot--rectangle' : ''}`} aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client="ca-pub-3166995085202346"
        data-ad-slot="TODO_ADD_REAL_SLOT_ID"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
