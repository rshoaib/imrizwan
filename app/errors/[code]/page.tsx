import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { m365Errors, errorSlug, type M365Error } from '@/data/errors'

interface Props {
  params: Promise<{ code: string }>
}

const SITE_URL = 'https://imrizwan.com'

function findError(slug: string): M365Error | undefined {
  const norm = slug.toLowerCase()
  return m365Errors.find((e) => errorSlug(e) === norm)
}

export async function generateStaticParams() {
  return m365Errors.map((e) => ({ code: errorSlug(e) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params
  const err = findError(code)
  if (!err) return {}

  const title = `${err.code}: ${err.title} — Cause & Fix (2026)`
  const description = `${err.description} How to fix ${err.code} in ${err.service}: root cause, step-by-step solution, and related error codes.`
  const url = `${SITE_URL}/errors/${errorSlug(err)}`

  return {
    title,
    description,
    alternates: { canonical: `/errors/${errorSlug(err)}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function ErrorCodePage({ params }: Props) {
  const { code } = await params
  const err = findError(code)
  if (!err) notFound()

  const url = `${SITE_URL}/errors/${errorSlug(err)}`

  const related = (err.relatedCodes || [])
    .map((id) => m365Errors.find((e) => e.id === id))
    .filter((e): e is M365Error => Boolean(e))

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Error Codes', item: `${SITE_URL}/errors` },
      { '@type': 'ListItem', position: 3, name: err.code, item: url },
    ],
  }

  const techArticleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `${err.code}: ${err.title}`,
    description: err.description,
    about: err.service,
    proficiencyLevel: 'Expert',
    dependencies: err.service,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Person', name: 'Rizwan', url: `${SITE_URL}/about` },
    publisher: {
      '@type': 'Organization',
      name: 'ImRizwan',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
    },
    datePublished: err.reviewed || '2026-05-08',
    dateModified: err.reviewed || '2026-05-08',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleJsonLd) }}
      />
      <main className="container" style={{ maxWidth: 880, margin: '0 auto', padding: 'var(--space-8) var(--space-4)' }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
          <Link href="/">Home</Link>
          {' / '}
          <Link href="/errors">Error Codes</Link>
          {' / '}
          <span>{err.code}</span>
        </nav>

        <header style={{ marginBottom: 'var(--space-8)' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '4px 10px',
              borderRadius: 999,
              border: '1px solid var(--border)',
              fontSize: 'var(--fs-xs)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)',
              marginBottom: 'var(--space-3)',
            }}
          >
            {err.service}
          </div>
          <h1 style={{ fontSize: 'var(--fs-3xl)', fontWeight: 800, margin: 0, lineHeight: 1.15 }}>
            <code style={{ fontFamily: 'var(--font-mono, monospace)' }}>{err.code}</code>
            <span style={{ color: 'var(--text-muted)' }}> — </span>
            {err.title}
          </h1>
          <p style={{ fontSize: 'var(--fs-lg)', color: 'var(--text-muted)', marginTop: 'var(--space-3)' }}>
            {err.description}
          </p>
        </header>

        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Root cause</h2>
          <p style={{ lineHeight: 1.7 }}>{err.rootCause}</p>
        </section>

        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>How to fix it</h2>
          <ol style={{ paddingLeft: 'var(--space-6)', lineHeight: 1.7 }}>
            {err.solution.map((step, i) => (
              <li key={i} style={{ marginBottom: 'var(--space-3)' }}>{step}</li>
            ))}
          </ol>
        </section>

        {err.docsUrl && (
          <section style={{ marginBottom: 'var(--space-8)' }}>
            <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Official documentation</h2>
            <p>
              Microsoft documents this error in their{' '}
              <a href={err.docsUrl} rel="noopener" target="_blank">
                authentication and authorization error codes reference
              </a>
              .
            </p>
          </section>
        )}

        {related.length > 0 && (
          <section style={{ marginBottom: 'var(--space-8)' }}>
            <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Related error codes</h2>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 'var(--space-2)' }}>
              {related.map((r) => (
                <li key={r.id}>
                  <Link href={`/errors/${errorSlug(r)}`}>
                    <strong>{r.code}</strong> — {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section
          style={{
            marginTop: 'var(--space-10)',
            padding: 'var(--space-5)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl, 12px)',
            background: 'var(--bg-card)',
          }}
        >
          <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 700, marginTop: 0 }}>Decode any M365 error</h2>
          <p style={{ marginBottom: 'var(--space-3)' }}>
            Paste an unfamiliar error message into the interactive decoder — it searches every code in this catalog and explains the cause in plain English.
          </p>
          <Link href="/tools/error-decoder">Open the Error Decoder →</Link>
        </section>
      </main>
    </>
  )
}
