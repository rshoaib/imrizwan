import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <h1 style={{ fontSize: '4rem', color: 'var(--primary)' }}>404</h1>
      <h2>Page Not Found</h2>
      <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="hero__cta" style={{ marginTop: '2rem', display: 'inline-block' }}>
        ← Back to Home
      </Link>
    </div>
  )
}
