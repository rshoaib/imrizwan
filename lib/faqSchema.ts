export interface FaqItem {
  question: string
  answer: string
}

/**
 * Extract FAQ items from markdown content.
 * Looks for a section starting with ## Frequently Asked Questions
 * and parses Q: / A: pairs.
 */
export function extractFaqItems(content: string): FaqItem[] {
  if (!content) return []

  // Find the FAQ section
  const faqMatch = content.match(
    /##\s+(?:Frequently Asked Questions|FAQ)[\s\S]*?(?=\n##\s|$)/i
  )
  if (!faqMatch) return []

  const faqSection = faqMatch[0]

  // Match Q: ... A: ... pairs (bold or plain)
  const pairs: FaqItem[] = []
  const qRegex = /(?:\*\*Q:\*\*|Q:)\s*(.+?)\n(?:[\s\S]*?)(?:\*\*A:\*\*|A:)\s*(.+?)(?=\n(?:\*\*Q:\*\*|Q:)|$)/g

  let match
  while ((match = qRegex.exec(faqSection)) !== null) {
    pairs.push({
      question: match[1].trim(),
      answer: match[2].trim(),
    })
  }

  return pairs
}

export function buildFaqJsonLd(items: FaqItem[]): object | null {
  if (!items || items.length === 0) return null

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
