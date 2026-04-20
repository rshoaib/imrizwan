'use client'

import { useEffect } from 'react'

/*
 * AdSlot Component
 * ────────────────
 * Uses data-ad-format="auto" with data-full-width-responsive="true".
 * To use manual ad units, create slots in the AdSense dashboard
 * and pass the real slot ID via the `slot` prop.
 */

const AD_CLIENT = 'ca-pub-3166995085202346'

export default function AdSlot({ type = 'leaderboard', slot }: { type?: 'leaderboard' | 'rectangle'; slot?: string }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (err) {
        console.error('AdSense push error:', err)
      }
    }
  }, [])

  if (process.env.NODE_ENV === 'development') {
    return (
      <div
        className={`ad-slot ${type === 'rectangle' ? 'ad-slot--rectangle' : ''}`}
        style={{ border: '1px dashed #ccc', textAlign: 'center', padding: '20px', margin: '2rem 0', color: 'var(--text-muted)' }}
      >
        Ad Slot ({type === 'rectangle' ? '300×250' : '728×90'}){slot ? ` — Slot: ${slot}` : ' — Auto Format'}
      </div>
    )
  }

  return (
    <div className={`ad-slot ${type === 'rectangle' ? 'ad-slot--rectangle' : ''}`} aria-label="Advertisement" style={{ margin: '2rem 0', textAlign: 'center' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CLIENT}
        {...(slot ? { 'data-ad-slot': slot } : {})}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
