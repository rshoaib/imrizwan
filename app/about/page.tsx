import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Rizwan is a SharePoint & Power Platform developer specializing in SPFx webparts, Power Automate flows, and Microsoft 365 solutions.',
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

export default function AboutPage() {
  return (
    <div className="about">
      <header className="about__header reveal">
        <div className="about__avatar">R</div>
        <h1 className="about__name">Rizwan</h1>
        <p className="about__role">SharePoint &amp; Power Platform Developer</p>
      </header>

      <div className="about__content reveal">
        <p>
          I&apos;m a Microsoft 365 developer with deep experience in SharePoint
          Framework (SPFx), Power Platform, and modern SharePoint
          customization. I&apos;ve built production-grade webparts, extensions,
          application customizers, and Power Automate flows for enterprise
          clients.
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

      <h2 className="section__title reveal" style={{ marginTop: '2rem' }}>
        Skills &amp; Technologies
      </h2>
      <div className="about__skills reveal">
        {skills.map((skill) => (
          <span key={skill} className="about__skill">
            {skill}
          </span>
        ))}
      </div>

      <div className="about__links reveal">
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
    </div>
  )
}
