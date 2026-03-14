import type { Metadata } from 'next'
import ErrorDecoderWrapper from './ErrorDecoderWrapper'
import { tools } from '@/data/tools'
import Script from 'next/script'
import ToolFAQ from '@/components/ToolFAQ'
import RelatedTools from '@/components/RelatedTools'
import AdSlot from '@/components/AdSlot'

const tool = tools.find((t) => t.slug === 'error-decoder')!

export const metadata: Metadata = {
  title: `${tool.name} | ImRizwan`,
  description: tool.description,
  alternates: {
    canonical: `https://imrizwan.com/tools/${tool.slug}`,
  },
}

export default function ErrorDecoderPage() {
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
        <ErrorDecoderWrapper />
      </div>

      <div className="mt-16 reveal">
        <ToolFAQ slug={tool.slug} />
        <AdSlot type="leaderboard" />
        <RelatedTools currentSlug={tool.slug} />
      </div>
    </div>
  )
}
