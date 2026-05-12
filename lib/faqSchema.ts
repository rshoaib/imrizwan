/**
 * Extracts FAQ question/answer pairs from markdown content.
 * Looks for the pattern:  **Question?**\nAnswer text.
 * inside a "## FAQ" or "## Frequently Asked Questions" section.
 */
export interface FaqItem {
    question: string
    answer: string
}

export function extractFaqItems(markdown: string): FaqItem[] {
    // Find the FAQ section
    const faqMatch = markdown.match(
        /##\s*(?:FAQ|Frequently Asked Questions)\s*\n([\s\S]*?)(?=\n##\s|\n---|\n$)/i
    )
    if (!faqMatch) return []

    const faqBlock = faqMatch[1]
    const items: FaqItem[] = []

    // Match **Question?** followed by answer text
    const regex = /\*\*(.+?\?)\*\*\s*\n([\s\S]*?)(?=\n\*\*|\n---|$)/g
    let match

    while ((match = regex.exec(faqBlock)) !== null) {
        const question = match[1].trim()
        const answer = match[2]
            .trim()
            .replace(/\n+/g, ' ')       // collapse newlines
            .replace(/\s{2,}/g, ' ')    // collapse whitespace
            .replace(/[`*[\]]/g, '')    // strip markdown formatting
        if (question && answer) {
            items.push({ question, answer })
        }
    }

    return items
}

/**
 * Builds FAQPage JSON-LD schema from extracted items.
 */
export function buildFaqJsonLd(items: FaqItem[]) {
    if (items.length === 0) return null

    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    }
}
