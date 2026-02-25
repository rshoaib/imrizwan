import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function NewsletterCTA() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'duplicate'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')

    if (!supabase) {
      setStatus('error')
      return
    }

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email: email.trim().toLowerCase() })

      if (error) {
        if (error.code === '23505') {
          setStatus('duplicate')
        } else {
          setStatus('error')
        }
        return
      }

      setStatus('success')
      setEmail('')
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

        {status === 'duplicate' && (
          <p className="newsletter__msg newsletter__msg--info">
            You're already subscribed! 🎉
          </p>
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
