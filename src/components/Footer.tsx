export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__text">
          © {year} Rizwan. Built with React & Supabase.
        </p>
        <div className="footer__links">
          <a
            href="mailto:sh_rizwan44@hotmail.com"
            className="footer__link"
          >
            Email
          </a>
          <a
            href="https://github.com/nicegamer7"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/rizwan-shoaib-b341b485/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            LinkedIn
          </a>
        </div>
        <div className="footer__projects" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ fontSize: '0.7rem', opacity: 0.5, marginBottom: '0.5rem' }}>My Projects</p>
          <div className="footer__links">
            <a href="https://dailysmartcalc.com" target="_blank" rel="noopener noreferrer" className="footer__link">SmartCalc</a>
            <a href="https://mycalcfinance.com" target="_blank" rel="noopener noreferrer" className="footer__link">Finance Calculators</a>
            <a href="https://onlineimageshrinker.com" target="_blank" rel="noopener noreferrer" className="footer__link">Image Shrinker</a>
            <a href="https://legalpolicygen.com" target="_blank" rel="noopener noreferrer" className="footer__link">Legal Policy Gen</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
