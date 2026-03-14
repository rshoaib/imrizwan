import { Metadata } from 'next'
import { tools } from '@/data/tools'
import ToolFAQ from '@/components/ToolFAQ'
import RelatedTools from '@/components/RelatedTools'
import AdSlot from '@/components/AdSlot'
import GraphExplorerClient from './GraphExplorerClient'

export const metadata: Metadata = {
    title: 'Microsoft Graph API Explorer Lite | Mock Sandbox | ImRizwan',
    description: 'An interactive, no-auth sandbox to explore popular Microsoft Graph API endpoints. View required M365 permissions and mock JSON responses.',
    keywords: 'Microsoft Graph API, Graph Explorer, Sandbox, Microsoft 365, M365 developer, SharePoint API, Office 365 API, Entra ID API',
    openGraph: {
        title: 'Graph API Explorer Lite - Quick Reference',
        description: 'Explore common Microsoft Graph endpoints, view required application/delegated permissions, and see realistic mock JSON responses.',
        url: 'https://imrizwan.com/tools/graph-api-explorer',
        type: 'website',
        images: [
            {
                url: 'https://imrizwan.com/og-tools.png',
                width: 1200,
                height: 630,
                alt: 'Graph API Explorer Lite by ImRizwan',
            },
        ],
    },
}

export default function GraphExplorerPage() {
    const tool = tools.find((t) => t.slug === 'graph-api-explorer')

    if (!tool) {
        return <div>Tool not found.</div>
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: tool.name,
        operatingSystem: 'Web',
        applicationCategory: 'DeveloperApplication',
        description: tool.description,
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
    }

    return (
        <div className="container">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            
            <div className="page-title reveal">
                <h1>{tool.emoji} {tool.name}</h1>
                <p>{tool.description}</p>
            </div>

            <div className="mb-12">
                <AdSlot type="leaderboard" />
            </div>

            <div className="reveal">
                <GraphExplorerClient />
            </div>

            <div className="mt-16 reveal">
                <ToolFAQ slug={tool.slug} />
                <AdSlot type="leaderboard" />
                <RelatedTools currentSlug={tool.slug} />
            </div>
        </div>
    )
}
