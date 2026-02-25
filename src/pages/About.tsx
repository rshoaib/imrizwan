import SEO from '../components/SEO'

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

export default function About() {
  return (
    <>
      <SEO
        title="About"
        description="Rizwan is a SharePoint & Power Platform developer specializing in SPFx webparts, Power Automate flows, and Microsoft 365 solutions."
        url="/about"
      />

      <div className="about">
        <header className="about__header">
          <div className="about__avatar">R</div>
          <h1 className="about__name">Rizwan</h1>
          <p className="about__role">SharePoint & Power Platform Developer</p>
        </header>

        <div className="about__content">
          <p>
            I'm a Microsoft 365 developer with deep experience in SharePoint
            Framework (SPFx), Power Platform, and modern SharePoint
            customization. I've built production-grade webparts, extensions,
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

        <h2 className="section__title" style={{ marginTop: '2rem' }}>
          Skills & Technologies
        </h2>
        <div className="about__skills">
          {skills.map((skill) => (
            <span key={skill} className="about__skill">
              {skill}
            </span>
          ))}
        </div>

        <div className="about__links">
          <a
            href="/resume.pdf"
            download
            className="about__social-link about__social-link--primary"
          >
            📄 Download Resume
          </a>
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
    </>
  )
}
