import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

type GuidFormat = 'standard' | 'uppercase' | 'no-hyphens' | 'braces' | 'urn'

const FORMAT_OPTIONS: { value: GuidFormat; label: string; example: string }[] = [
  { value: 'standard', label: 'Standard', example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
  { value: 'uppercase', label: 'Uppercase', example: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX' },
  { value: 'no-hyphens', label: 'No Hyphens', example: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
  { value: 'braces', label: 'Braces', example: '{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}' },
  { value: 'urn', label: 'URN', example: 'urn:uuid:xxxxxxxx-xxxx-...' },
]

const BULK_OPTIONS = [1, 2, 5, 10, 25]

function generateRawGuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function formatGuid(raw: string, format: GuidFormat): string {
  switch (format) {
    case 'uppercase':
      return raw.toUpperCase()
    case 'no-hyphens':
      return raw.replace(/-/g, '')
    case 'braces':
      return `{${raw}}`
    case 'urn':
      return `urn:uuid:${raw}`
    case 'standard':
    default:
      return raw
  }
}

export default function GuidGenerator() {
  const [format, setFormat] = useState<GuidFormat>('standard')
  const [count, setCount] = useState(1)
  const [results, setResults] = useState<string[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [copied, setCopied] = useState<number | null>(null)
  const [allCopied, setAllCopied] = useState(false)

  // Generate initial GUIDs on mount
  useEffect(() => {
    const initialGuids = Array.from({ length: 1 }, () =>
      formatGuid(generateRawGuid(), 'standard')
    )
    setResults(initialGuids)
  }, [])

  const generate = (overrideFormat?: GuidFormat, overrideCount?: number) => {
    const activeFormat = overrideFormat || format
    const activeCount = overrideCount || count
    
    const newGuids = Array.from({ length: activeCount }, () =>
      formatGuid(generateRawGuid(), activeFormat)
    )
    setResults(newGuids)
    setHistory((prev) => [...newGuids, ...prev].slice(0, 50))
    setCopied(null)
    setAllCopied(false)
  }

  const handleFormatChange = (newFormat: GuidFormat) => {
    setFormat(newFormat)
    generate(newFormat, count)
  }

  const handleCountChange = (newCount: number) => {
    setCount(newCount)
    generate(format, newCount)
  }

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(index)
      setTimeout(() => setCopied(null), 1500)
    } catch {
      // Fallback
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(index)
      setTimeout(() => setCopied(null), 1500)
    }
  }

  const copyAll = async () => {
    const text = results.join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setAllCopied(true)
      setTimeout(() => setAllCopied(false), 1500)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setAllCopied(true)
      setTimeout(() => setAllCopied(false), 1500)
    }
  }

  return (
    <>
      <SEO
        title="GUID Generator — Free UUID v4 Generator for SPFx & Azure"
        description="Generate GUIDs/UUIDs instantly for SPFx manifests, Azure AD app registrations, Teams apps, and Power Platform solutions. Free, browser-based, no login required."
        url="/tools/guid-generator"
      />

      <div className="container">
        <div className="tool-page reveal">
          {/* Breadcrumb */}
          <nav className="tool-breadcrumb">
            <Link to="/tools">Tools</Link>
            <span className="tool-breadcrumb__sep">/</span>
            <span>GUID Generator</span>
          </nav>

          {/* Header */}
          <header className="tool-header">
            <div className="tool-header__icon">🔑</div>
            <h1 className="tool-header__title">GUID / UUID Generator</h1>
            <p className="tool-header__desc">
              Generate v4 UUIDs instantly for SPFx manifests, Azure AD registrations,
              Teams apps, and Power Platform solutions. 100% client-side — nothing
              leaves your browser.
            </p>
          </header>

          {/* Controls */}
          <div className="tool-section">
            <h2 className="tool-section__label">Format</h2>
            <div className="tool-pills">
              {FORMAT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`tool-pill ${format === opt.value ? 'tool-pill--active' : ''}`}
                  onClick={() => handleFormatChange(opt.value)}
                  title={opt.example}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="tool-section">
            <h2 className="tool-section__label">Quantity</h2>
            <div className="tool-pills">
              {BULK_OPTIONS.map((n) => (
                <button
                  key={n}
                  className={`tool-pill ${count === n ? 'tool-pill--active' : ''}`}
                  onClick={() => handleCountChange(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            className="tool-generate-btn"
            onClick={() => generate()}
            id="generate-guid-btn"
          >
            <span className="tool-generate-btn__icon">⚡</span>
            Generate {count > 1 ? `${count} GUIDs` : 'GUID'}
          </button>

          {/* Results */}
          {results.length > 0 && (
            <div className="tool-results">
              <div className="tool-results__header">
                <h2 className="tool-section__label">
                  {results.length === 1 ? 'Result' : `Results (${results.length})`}
                </h2>
                {results.length > 1 && (
                  <button
                    className={`tool-copy-all-btn ${allCopied ? 'tool-copy-all-btn--success' : ''}`}
                    onClick={copyAll}
                  >
                    {allCopied ? '✓ Copied All' : '📋 Copy All'}
                  </button>
                )}
              </div>

              <div className="tool-output-list">
                {results.map((guid, i) => (
                  <div key={`${guid}-${i}`} className="tool-output-row">
                    <code className="tool-output-value">{guid}</code>
                    <button
                      className={`tool-copy-btn ${copied === i ? 'tool-copy-btn--success' : ''}`}
                      onClick={() => copyToClipboard(guid, i)}
                      aria-label={`Copy GUID ${i + 1}`}
                    >
                      {copied === i ? '✓' : '📋'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="tool-history">
              <h2 className="tool-section__label">History (this session)</h2>
              <div className="tool-history-list">
                {history.map((guid, i) => (
                  <div key={`h-${guid}-${i}`} className="tool-history-item">
                    <code>{guid}</code>
                    <button
                      className="tool-copy-btn tool-copy-btn--small"
                      onClick={() => copyToClipboard(guid, 1000 + i)}
                      aria-label={`Copy history item ${i + 1}`}
                    >
                      {copied === 1000 + i ? '✓' : '📋'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO Content */}
          <section className="tool-info">
            <h2>What is a GUID / UUID?</h2>
            <p>
              A <strong>GUID</strong> (Globally Unique Identifier) or <strong>UUID</strong> (Universally Unique Identifier)
              is a 128-bit number used to uniquely identify resources in software systems.
              Version 4 UUIDs are randomly generated and have an extremely low probability of collision.
            </p>
            <h3>Common Uses in Microsoft 365 Development</h3>
            <ul>
              <li><strong>SPFx Manifests</strong> — every webpart and extension needs a unique <code>id</code> GUID</li>
              <li><strong>Azure AD App Registrations</strong> — application IDs and permission scope IDs</li>
              <li><strong>Teams App Manifests</strong> — <code>id</code> field in <code>manifest.json</code></li>
              <li><strong>Power Platform Solutions</strong> — solution component IDs and publisher prefixes</li>
              <li><strong>SharePoint Content Types</strong> — custom content type IDs</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  )
}
