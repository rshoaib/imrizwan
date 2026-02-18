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
            href="https://github.com/nicegamer7"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/imrizwan/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}
