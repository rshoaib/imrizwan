import type { Metadata } from 'next'
import ArchitectureCanvasClient from './ArchitectureCanvasClient'
import { tools } from '@/data/tools'
import Script from 'next/script'

const tool = tools.find((t) => t.slug === 'm365-architecture-canvas')!

export const metadata: Metadata = {
  title: `${tool.name} | ImRizwan`,
  description: tool.description,
  alternates: {
    canonical: `https://imrizwan.com/tools/${tool.slug}`,
  },
}

export default function ArchitectureCanvasPage() {
  return (
    <div className="container">
      <Script
        id="tool-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: tool.name,
            description: tool.description,
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          }),
        }}
      />
      <div className="page-title reveal">
        <h1>{tool.name}</h1>
        <p>{tool.description}</p>
      </div>

      <div className="reveal">
        <ArchitectureCanvasClient tool={tool} />
      </div>

      <div className="mt-16 reveal">
        <h2 className="text-2xl font-bold mb-6 text-slate-100">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-6">
          {tool.faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-sky-400 mb-2">
                {faq.question}
              </h3>
              <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
