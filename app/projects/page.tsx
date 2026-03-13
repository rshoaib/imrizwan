import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Portfolio of web apps by Rizwan — WhatsApp ordering, finance calculators, image tools, legal generators, and more.',
  alternates: { canonical: '/projects' },
}

const projects = [
  {
    name: 'OrderViaChat',
    url: 'https://orderviachat.com',
    description: 'WhatsApp-based ordering platform for small businesses. Customers browse a menu and place orders directly through WhatsApp — no app download needed.',
    stack: ['React', 'Supabase', 'WhatsApp API', 'Vercel'],
    emoji: '💬',
  },
  {
    name: 'BuildWithRiz',
    url: 'https://buildwithriz.com',
    description: 'Free invoice generator for freelancers — create professional invoices in seconds, download as PDF. No login, no signup, 100% free.',
    stack: ['Next.js', 'TypeScript', 'PDF Generation', 'Vercel'],
    emoji: '🧾',
  },
  {
    name: 'DailySmartCalc',
    url: 'https://dailysmartcalc.com',
    description: 'Collection of everyday calculators — BMI, age, percentage, loan EMI, and more. Built for speed with zero dependencies.',
    stack: ['React', 'TypeScript', 'Vercel'],
    emoji: '🧮',
  },
  {
    name: 'MyCalcFinance',
    url: 'https://mycalcfinance.com',
    description: 'Financial calculators for retirement planning, compound interest, 401(k) projections, and investment returns.',
    stack: ['React', 'Supabase', 'Vercel'],
    emoji: '💰',
  },
  {
    name: 'PDFToolkit',
    url: 'https://pdftoolkit.com',
    description: 'Free browser-based PDF tools — merge, split, compress, and convert PDFs without uploading to any server.',
    stack: ['React', 'PDF.js', 'Vercel'],
    emoji: '📄',
  },
  {
    name: 'OnlineImageShrinker',
    url: 'https://onlineimageshrinker.com',
    description: 'Client-side image compression tool. Resize, compress, and convert images without uploading to any server — 100% browser-based privacy.',
    stack: ['React', 'Canvas API', 'Web Workers'],
    emoji: '🖼️',
  },
  {
    name: 'LegalPolicyGen',
    url: 'https://legalpolicygen.com',
    description: 'Generate privacy policies, terms of service, and cookie policies for your website. Free, no login required.',
    stack: ['React', 'TypeScript', 'Vercel'],
    emoji: '📜',
  },
]

const projectsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Projects by Rizwan',
  description: 'Portfolio of web apps built and maintained by Rizwan.',
  numberOfItems: projects.length,
  itemListElement: projects.map((project, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'SoftwareApplication',
      name: project.name,
      description: project.description,
      url: project.url,
      applicationCategory: 'WebApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
  })),
}

export default function ProjectsPage() {
  return (
    <div className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsJsonLd) }} />

      <div suppressHydrationWarning className="page-title reveal">
        <h1>Projects</h1>
        <p>Web apps I&apos;ve built and maintain</p>
      </div>

      <div suppressHydrationWarning className="projects-grid reveal-stagger">
        {projects.map((project) => (
          <a
            key={project.name}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            suppressHydrationWarning className="project-card reveal"
          >
            <div className="project-card__emoji">{project.emoji}</div>
            <h3 className="project-card__name">{project.name}</h3>
            <p className="project-card__desc">{project.description}</p>
            <div className="project-card__stack">
              {project.stack.map((tech) => (
                <span key={tech} className="project-card__tech">{tech}</span>
              ))}
            </div>
            <span className="project-card__link">Visit Site →</span>
          </a>
        ))}
      </div>
    </div>
  )
}
