import { useEffect } from 'react'

interface AdSlotProps {
  type?: 'leaderboard' | 'rectangle'
}

export default function AdSlot({ type = 'leaderboard' }: AdSlotProps) {
  useEffect(() => {
    // Only push ads in production
    if (!import.meta.env.DEV) {
      try {
        // @ts-ignore
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (err) {
        console.error('AdSense error:', err)
      }
    }
  }, [])

  // Only show placeholder in development; in production, replace with actual AdSense code
  if (import.meta.env.DEV) {
    return (
      <div className={`ad-slot ${type === 'rectangle' ? 'ad-slot--rectangle' : ''}`}>
        Ad Slot ({type === 'rectangle' ? '300×250' : '728×90'})
      </div>
    )
  }

  return (
    <div className={`ad-slot ${type === 'rectangle' ? 'ad-slot--rectangle' : ''}`}>
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
