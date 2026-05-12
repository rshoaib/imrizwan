import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__grid">
          <div className="footer__col">
            <p className="footer__brand">
              <span className="header__logo-accent">&lt;/&gt;</span> iamrizwan
            </p>
            <p className="footer__tagline">
              SharePoint &amp; Power Platform Developer — building real solutions with
              SPFx, Power Automate, and Microsoft 365.
            </p>
          </div>
          <div className="footer__col">
            <p className="footer__col-title">Quick Links</p>
            <div className="footer__col-links">
              <Link href="/blog" className="footer__link">Blog</Link>
              <Link href="/tools" className="footer__link">Tools</Link>
              <Link href="/projects" className="footer__link">Projects</Link>
              <Link href="/about" className="footer__link">About</Link>
              <Link href="/contact" className="footer__link">Contact</Link>
            </div>
          </div>

          <div className="footer__col">
            <p className="footer__col-title">Projects</p>
            <div className="footer__col-links">
              <a href="https://tinypdftools.com" target="_blank" rel="noopener noreferrer" className="footer__link">PDF Tools</a>
              <a href="https://dailysmartcalc.com" target="_blank" rel="noopener noreferrer" className="footer__link">SmartCalc</a>
              <a href="https://mycalcfinance.com" target="_blank" rel="noopener noreferrer" className="footer__link">Finance Calculators</a>
              <a href="https://onlineimageshrinker.com" target="_blank" rel="noopener noreferrer" className="footer__link">Image Shrinker</a>
              <a href="https://legalpolicygen.com" target="_blank" rel="noopener noreferrer" className="footer__link">Legal Policy Gen</a>
            </div>
          </div>

          <div className="footer__col">
            <p className="footer__col-title">Connect</p>
            <div className="footer__col-links">
              <a href="mailto:sh_rizwan44@hotmail.com" className="footer__link">Email</a>
              <a href="https://github.com/nicegamer7" target="_blank" rel="noopener noreferrer" className="footer__link">GitHub</a>
              <a href="https://www.linkedin.com/in/rizwan-shoaib-b341b485/" target="_blank" rel="noopener noreferrer" className="footer__link">LinkedIn</a>
            </div>
          </div>
        </div>

        <p className="footer__copyright">
          © {year} Rizwan. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
