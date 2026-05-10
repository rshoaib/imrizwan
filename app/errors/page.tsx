import type { Metadata } from 'next'
import Link from 'next/link'
import { m365Errors, errorSlug, type M365Error } from '@/data/errors'

export const metadata: Metadata = {
  title: 'Microsoft 365 Error Code Reference (2026)',
  description:
    'Browse Microsoft 365, SharePoint, Power Platform, Graph API, and Entra ID error codes with root causes and step-by-step fixes. AADSTS, throttling, permissions, and more.',
  alternates: { canonical: '/errors' },
}

const SITE_URL = 'https://imrizwan.com'

const services = [
  'Entra ID',
  'Graph API',
  'SharePoint',
  'Power Automate',
  'Power Apps',
] as const

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Error Codes', item: `${SITE_URL}/errors` },
  ],
}

const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Microsoft 365 Error Code Reference',
  description: 'Curated reference of common error codes across Microsoft 365 services.',
  numberOfItems: m365Errors.length,
  itemListElement: m365Errors.map((e, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    url: `${SITE_URL}/errors/${errorSlug(e)}`,
    name: `${e.code} — ${e.title}`,
  })),
}

export default function ErrorsIndexPage() {
  const grouped: Record<string, M365Error[]> = {}
  for (const svc of services) grouped[svc] = []
  for (const err of m365Errors) {
    if (!grouped[err.service]) grouped[err.service] = []
    grouped[err.service].push(err)
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <main
        className="container"
        style={{ maxWidth: 1080, margin: '0 auto', padding: 'var(--space-8) var(--space-4)' }}
      >
        <header style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ fontSize: 'var(--fs-3xl)', fontWeight: 800, margin: 0 }}>
            Microsoft 365 Error Code Reference
          </h1>
          <p style={{ fontSize: 'var(--fs-lg)', color: 'var(--text-muted)', marginTop: 'var(--space-3)', maxWidth: 720 }}>
            A curated catalog of common error codes across SharePoint, Power Platform, Graph API,
            and Entra ID — each with the root cause and a step-by-step fix. Need to decode an
            unfamiliar message? Try the{' '}
            <Link href="/tools/error-decoder">interactive Error Decoder</Link>.
          </p>
        </header>

        {services.map((svc) => {
          const list = grouped[svc] || []
          if (list.length === 0) return null
          return (
            <section key={svc} style={{ marginBottom: 'var(--space-10)' }}>
              <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
                {svc}
                <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 'var(--fs-base)' }}>
                  {' '}({list.length})
                </span>
              </h2>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: 'var(--space-3)',
                }}
              >
                {list.map((err) => (
                  <li
                    key={err.id}
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg, 10px)',
                      padding: 'var(--space-4)',
                      background: 'var(--bg-card)',
                    }}
                  >
                    <Link
                      href={`/errors/${errorSlug(err)}`}
                      style={{ display: 'block', textDecoration: 'none' }}
                    >
                      <div style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 700 }}>
                        {err.code}
                      </div>
                      <div style={{ marginTop: 4, fontWeight: 600 }}>{err.title}</div>
                      <div style={{ marginTop: 6, fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                        {err.description.length > 140
                          ? err.description.slice(0, 140) + '…'
                          : err.description}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </main>
    </>
  )
}
