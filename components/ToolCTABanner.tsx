'use client'

import Link from 'next/link'

const CATEGORY_TOOL_MAP: Record<string, {
  slug: string
  name: string
  emoji: string
  pitch: string
}> = {
  'spfx': {
    slug: 'guid-generator',
    name: 'GUID Generator',
    emoji: '🔑',
    pitch: 'Every SPFx web part needs a unique GUID in its manifest. Generate cryptographically secure v4 UUIDs instantly — bulk generation supported.',
  },
  'power-platform': {
    slug: 'power-automate-expressions',
    name: 'Power Automate Expressions',
    emoji: '⚙️',
    pitch: 'Stop Googling expression syntax. Browse, search, and copy every Power Automate formula with real-world examples — free.',
  },
  'sharepoint': {
    slug: 'caml-query-builder',
    name: 'CAML Query Builder',
    emoji: '🔍',
    pitch: 'Build complex CAML queries visually — no more hand-writing XML. Add nested AND/OR conditions, lookup filters, and get clean output instantly.',
  },
  'microsoft-365': {
    slug: 'm365-architecture-canvas',
    name: 'M365 Architecture Canvas',
    emoji: '🏗️',
    pitch: 'Design SharePoint, Teams, and Power Platform architectures visually. Export a structured Markdown document ready for proposals or GitHub.',
  },
}

const FALLBACK = {
  slug: 'guid-generator',
  name: 'GUID Generator',
  emoji: '🔑',
  pitch: 'Generate cryptographically secure GUIDs for SPFx manifests, Azure AD registrations, and Power Platform solutions — free and instant.',
}

interface ToolCTABannerProps {
  category: string
}

export default function ToolCTABanner({ category }: ToolCTABannerProps) {
  const key = category.toLowerCase().replace(/\s+/g, '-')
  const tool = CATEGORY_TOOL_MAP[key] ?? FALLBACK

  return (
    <div className="tool-cta-banner">
      <div className="tool-cta-banner__inner">
        <span className="tool-cta-banner__emoji" aria-hidden="true">{tool.emoji}</span>
        <div className="tool-cta-banner__body">
          <p className="tool-cta-banner__label">Free Developer Tool</p>
          <p className="tool-cta-banner__name">{tool.name}</p>
          <p className="tool-cta-banner__pitch">{tool.pitch}</p>
        </div>
        <Link href={`/tools/${tool.slug}`} className="tool-cta-banner__btn">
          Try It Free →
        </Link>
      </div>
      <style>{`
        .tool-cta-banner {
          margin: 2.5rem 0;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.08) 100%);
          border: 1px solid rgba(99,102,241,0.25);
          padding: 1.25rem 1.5rem;
        }
        .tool-cta-banner__inner {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }
        .tool-cta-banner__emoji {
          font-size: 2.2rem;
          flex-shrink: 0;
        }
        .tool-cta-banner__body {
          flex: 1;
          min-width: 180px;
        }
        .tool-cta-banner__label {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #818cf8;
          margin: 0 0 2px;
        }
        .tool-cta-banner__name {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-main, #f1f5f9);
          margin: 0 0 4px;
        }
        .tool-cta-banner__pitch {
          font-size: 0.82rem;
          color: var(--text-muted, #94a3b8);
          margin: 0;
          line-height: 1.5;
        }
        .tool-cta-banner__btn {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          padding: 0.55rem 1.1rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: 8px;
          text-decoration: none;
          transition: opacity 0.15s, transform 0.15s;
          white-space: nowrap;
        }
        .tool-cta-banner__btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        @media (max-width: 560px) {
          .tool-cta-banner__btn { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  )
}
