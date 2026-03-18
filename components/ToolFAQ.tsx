'use client'

import { useState } from 'react'
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
      <h2 className="tool-faq__title">Frequently Asked Questions</h2>
      <div className="tool-faq__list">
        {tool.faqs.map((faq, idx) => (
          <FAQItem key={idx} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`tool-faq__item ${isOpen ? 'tool-faq__item--open' : ''}`}>
      <button
        className="tool-faq__question"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <span className="tool-faq__chevron">{isOpen ? '−' : '+'}</span>
      </button>
      <div
        className="tool-faq__answer"
        style={{
          maxHeight: isOpen ? '500px' : '0',
          opacity: isOpen ? 1 : 0,
          paddingTop: isOpen ? 'var(--space-4)' : '0',
          paddingBottom: isOpen ? 'var(--space-5)' : '0',
        }}
      >
        <p dangerouslySetInnerHTML={{ __html: answer }} />
      </div>
    </div>
  )
}
