'use client'

import { useState } from 'react'

export default function NewsletterCTA() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })

      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="newsletter">
      <div className="newsletter__inner">
        <div className="newsletter__text">
          <h3 className="newsletter__title">📬 Stay Updated</h3>
          <p className="newsletter__desc">
            Get notified when I publish new SharePoint & Power Platform guides.
            No spam, unsubscribe anytime.
          </p>
        </div>

        {status === 'success' ? (
          <div className="newsletter__success">
            ✅ You're subscribed! Thanks for joining.
          </div>
        ) : (
          <form className="newsletter__form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="you@example.com"
              className="newsletter__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              className="newsletter__btn"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="newsletter__msg newsletter__msg--error">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </section>
  )
}
