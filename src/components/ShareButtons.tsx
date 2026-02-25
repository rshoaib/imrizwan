interface ShareButtonsProps {
  url: string
  title: string
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const fullUrl = `https://imrizwan.com${url}`
  const encodedUrl = encodeURIComponent(fullUrl)
  const encodedTitle = encodeURIComponent(title)

  const shares = [
    {
      label: 'LinkedIn',
      icon: '💼',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: 'X',
      icon: '𝕏',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: 'WhatsApp',
      icon: '💬',
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    },
  ]

  return (
    <div className="share-buttons">
      <span className="share-buttons__label">Share this post</span>
      <div className="share-buttons__row">
        {shares.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="share-buttons__btn"
            aria-label={`Share on ${s.label}`}
          >
            <span className="share-buttons__icon">{s.icon}</span>
            {s.label}
          </a>
        ))}
      </div>
    </div>
  )
}
