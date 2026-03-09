import { tools } from '@/data/tools'

export default function ToolFAQ({ slug }: { slug: string }) {
  const tool = tools.find(t => t.slug === slug)
  if (!tool || !tool.faqs || tool.faqs.length === 0) return null

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }

  return (
    <div className="tool-faq" style={{ marginTop: '3rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <h2>Frequently Asked Questions</h2>
      <div className="faq-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
        {tool.faqs.map((faq, idx) => (
          <details key={idx} className="faq-item glass-card" style={{ padding: '1rem', cursor: 'pointer', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <summary style={{ fontWeight: 600, fontSize: '15px', outline: 'none' }}>{faq.question}</summary>
            <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
