interface AdSlotProps {
  type?: 'leaderboard' | 'rectangle'
}

export default function AdSlot({ type = 'leaderboard' }: AdSlotProps) {
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
      {/* AdSense code will be inserted here after approval */}
    </div>
  )
}
