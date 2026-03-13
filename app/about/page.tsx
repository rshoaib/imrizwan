import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Rizwan is a SharePoint & Power Platform developer with 5+ years of enterprise experience in SPFx, Power Automate, and Microsoft 365 solutions.',
  alternates: { canonical: '/about' },
}

const skills = [
  'SharePoint Framework (SPFx)',
  'Power Automate',
  'Power Apps',
  'Power BI',
  'SharePoint Online',
  'Microsoft Graph API',
  'Azure AD / Entra ID',
  'Microsoft Teams Development',
  'React / TypeScript',
  'PnP JS',
  'JSON Column Formatting',
  'Site Designs & Scripts',
]

const certifications = [
  { name: 'Microsoft 365 Certified: Developer Associate', icon: '🏅' },
  { name: 'SharePoint Framework Specialist', icon: '⚡' },
  { name: 'Power Platform Fundamentals', icon: '🔧' },
]

const timeline = [
  {
    period: '2021 — Present',
    role: 'Senior SharePoint & M365 Developer',
    description:
      'Building production-grade SPFx webparts, Power Automate workflows, and custom Teams extensions for enterprise clients. Leading migration projects from classic to modern SharePoint.',
  },
  {
    period: '2019 — 2021',
    role: 'SharePoint Developer',
    description:
      'Developed custom solutions using SPFx, PnP JS, and REST APIs. Automated business processes with Power Automate and Power Apps across multiple organizations.',
  },
  {
    period: '2017 — 2019',
    role: 'Web Developer',
    description:
      'Built responsive web applications using React and Node.js. Transitioned into the Microsoft 365 ecosystem and began specializing in SharePoint development.',
  },
]

export default function AboutPage() {
  return (
    <div className="about">
      <header suppressHydrationWarning className="about__header reveal">
        <div className="about__avatar">R</div>
        <h1 className="about__name">Rizwan</h1>
        <p className="about__role">SharePoint & Power Platform Developer</p>
      </header>

      <div suppressHydrationWarning className="about__content reveal">
        <p>
          I&apos;m a Microsoft 365 developer with 5+ years of deep experience in SharePoint
          Framework (SPFx), Power Platform, and modern SharePoint
          customization. I&apos;ve built production-grade webparts, extensions,
          application customizers, and Power Automate flows for enterprise
          clients across multiple industries.
        </p>
        <p>
          This blog is where I document the real problems I solve every day —
          with actual code, real screenshots, and step-by-step walkthroughs.
          No generic tutorials, no AI-generated fluff. Just proven solutions
          from a working developer.
        </p>
        <p>
          My goal is simple: when you Google a SharePoint or Power Platform
          problem, you should find a post here that actually solves it.
        </p>
      </div>

      {/* Experience Timeline */}
      <h2 suppressHydrationWarning className="section__title reveal" style={{ marginTop: '2rem' }}>
        Experience
      </h2>
      <div suppressHydrationWarning className="about__content reveal">
        {timeline.map((entry) => (
          <div
            key={entry.period}
            style={{
              borderLeft: '3px solid var(--accent)',
              paddingLeft: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--accent)', fontWeight: 600, marginBottom: '0.25rem' }}>
              {entry.period}
            </p>
            <p style={{ fontWeight: 700, fontSize: 'var(--fs-lg)', marginBottom: '0.25rem' }}>
              {entry.role}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
              {entry.description}
            </p>
          </div>
        ))}
      </div>

      {/* Certifications */}
      <h2 suppressHydrationWarning className="section__title reveal" style={{ marginTop: '2rem' }}>
        Certifications
      </h2>
      <div suppressHydrationWarning className="about__skills reveal">
        {certifications.map((cert) => (
          <span key={cert.name} className="about__skill">
            {cert.icon} {cert.name}
          </span>
        ))}
      </div>

      <h2 suppressHydrationWarning className="section__title reveal" style={{ marginTop: '2rem' }}>
        Skills & Technologies
      </h2>
      <div suppressHydrationWarning className="about__skills reveal">
        {skills.map((skill) => (
          <span key={skill} className="about__skill">
            {skill}
          </span>
        ))}
      </div>

      <div suppressHydrationWarning className="about__links reveal">
        <a
          href="mailto:sh_rizwan44@hotmail.com"
          className="about__social-link"
        >
          ✉️ Email
        </a>
        <a
          href="https://github.com/nicegamer7"
          target="_blank"
          rel="noopener noreferrer"
          className="about__social-link"
        >
          🔗 GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/rizwan-shoaib-b341b485/"
          target="_blank"
          rel="noopener noreferrer"
          className="about__social-link"
        >
          💼 LinkedIn
        </a>
      </div>

      {/* CTA */}
      <div suppressHydrationWarning className="about__content reveal" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Looking for SharePoint development, Power Platform consulting, or collaboration?
        </p>
        <Link href="/contact" className="home-btn home-btn--primary">
          Get in Touch →
        </Link>
      </div>
    </div>
  )
}
