'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Honeypot — if filled, it's a bot
    if (honeypot) {
      setStatus('sent') // Silently pretend success
      return
    }

    setStatus('sending')

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

      if (!serviceId || !templateId || !publicKey) {
        const mailto = `mailto:sh_rizwan44@hotmail.com?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`
        window.open(mailto, '_blank')
        setStatus('sent')
        return
      }

      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            from_name: form.name,
            from_email: form.email,
            subject: form.subject,
            message: form.message,
          },
        }),
      })

      if (res.ok) {
        setStatus('sent')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="contact">
      <div suppressHydrationWarning className="page-title reveal">
        <h1>Get in Touch</h1>
        <p>Have a question or want to work together? Drop me a message.</p>
      </div>

      <div suppressHydrationWarning className="contact__grid reveal">
        <div className="contact__info">
          <div className="contact__info-card">
            <span className="contact__info-icon">✉️</span>
            <h3>Email</h3>
            <a href="mailto:sh_rizwan44@hotmail.com">sh_rizwan44@hotmail.com</a>
          </div>
          <div className="contact__info-card">
            <span className="contact__info-icon">💼</span>
            <h3>LinkedIn</h3>
            <a href="https://www.linkedin.com/in/rizwan-shoaib-b341b485/" target="_blank" rel="noopener noreferrer">
              Connect on LinkedIn
            </a>
          </div>
          <div className="contact__info-card">
            <span className="contact__info-icon">🔗</span>
            <h3>GitHub</h3>
            <a href="https://github.com/nicegamer7" target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </div>
        </div>

        <form className="contact__form" onSubmit={handleSubmit}>
          <div className="contact__field">
            <label htmlFor="contact-name">Name</label>
            <input id="contact-name" name="name" type="text" value={form.name} onChange={handleChange} required placeholder="Your name" disabled={status === 'sending'} />
          </div>

          {/* Honeypot — hidden from real users, catches bots */}
          <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
            <label htmlFor="contact-website">Website</label>
            <input id="contact-website" name="website" type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
          </div>
          <div className="contact__field">
            <label htmlFor="contact-email">Email</label>
            <input id="contact-email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" disabled={status === 'sending'} />
          </div>
          <div className="contact__field">
            <label htmlFor="contact-subject">Subject</label>
            <input id="contact-subject" name="subject" type="text" value={form.subject} onChange={handleChange} required placeholder="What's this about?" disabled={status === 'sending'} />
          </div>
          <div className="contact__field">
            <label htmlFor="contact-message">Message</label>
            <textarea id="contact-message" name="message" rows={5} value={form.message} onChange={handleChange} required placeholder="Your message..." disabled={status === 'sending'} />
          </div>

          <button type="submit" className="hero__cta" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>

          {status === 'sent' && (
            <p className="contact__msg contact__msg--success">
              ✅ Message sent! I&apos;ll get back to you soon.
            </p>
          )}
          {status === 'error' && (
            <p className="contact__msg contact__msg--error">
              ❌ Something went wrong. Please try again or email me directly.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
