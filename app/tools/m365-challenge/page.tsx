import { Metadata } from 'next'
import { tools } from '@/data/tools'
import ToolFAQ from '@/components/ToolFAQ'
import RelatedTools from '@/components/RelatedTools'
import AdSlot from '@/components/AdSlot'
import ChallengeClient from './ChallengeClient'

export const metadata: Metadata = {
    title: 'M365 Challenge Mode | Interactive Developer Quiz | ImRizwan',
    description: 'Test your Microsoft 365, SharePoint, and Power Platform knowledge with this gamified developer quiz. Review detailed explanations after you finish!',
    keywords: 'Microsoft 365 quiz, SharePoint quiz, Power Platform questions, SPFx challenge, developer quiz',
    openGraph: {
        title: 'M365 Challenge Mode | Developer Quiz',
        description: 'Test your Microsoft 365, SharePoint, and Power Platform knowledge with this gamified developer quiz.',
        url: 'https://imrizwan.com/tools/m365-challenge',
        type: 'website',
        images: [
            {
                url: 'https://imrizwan.com/og-tools.png',
                width: 1200,
                height: 630,
                alt: 'M365 Challenge Mode by ImRizwan',
            },
        ],
    },
}

export default function M365ChallengePage() {
    const tool = tools.find((t) => t.slug === 'm365-challenge')

    if (!tool) {
        return <div>Tool not found.</div>
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: tool.name,
        operatingSystem: 'Web',
        applicationCategory: 'EducationalApplication',
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

            <div className="reveal min-h-[500px]">
                <ChallengeClient />
            </div>

            <div className="mt-16 reveal">
                <ToolFAQ slug={tool.slug} />
                <AdSlot type="leaderboard" />
                <RelatedTools currentSlug={tool.slug} />
            </div>
        </div>
    )
}
