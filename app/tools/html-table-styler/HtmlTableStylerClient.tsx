'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import RelatedTools from '@/components/RelatedTools'
import AdSlot from '@/components/AdSlot'
import ToolFAQ from '@/components/ToolFAQ'

const PREVIEW_DATA = [
  { ID: 1, Title: 'Server Migration', Status: 'In Progress', Owner: 'Rizwan', Priority: 'High' },
  { ID: 2, Title: 'Update SSL Certificates', Status: 'Pending', Owner: 'Alice', Priority: 'Medium' },
  { ID: 3, Title: 'Renew Domain Names', Status: 'Completed', Owner: 'Bob', Priority: 'Low' },
  { ID: 4, Title: 'Database Backup Configuration', Status: 'In Progress', Owner: 'Rizwan', Priority: 'High' },
]

export default function HtmlTableStylerClient() {
  const [headerBgColor, setHeaderBgColor] = useState('#2563eb')
  const [headerTextColor, setHeaderTextColor] = useState('#ffffff')
  const [rowStripeColor, setRowStripeColor] = useState('#f8fafc')
  const [borderColor, setBorderColor] = useState('#e2e8f0')
  const [fontFamily, setFontFamily] = useState('Segoe UI, sans-serif')
  const [tableWidth, setTableWidth] = useState('100%')
  const [paddingCell, setPaddingCell] = useState('12px 16px')
  const [textAlign, setTextAlign] = useState('left')
  const [headerFontWeight, setHeaderFontWeight] = useState('600')
  
  const [generatedCss, setGeneratedCss] = useState('')
  const [copied, setCopied] = useState(false)

  // Generate CSS whenever settings change
  useEffect(() => {
    const css = `<style>
table {
  width: ${tableWidth};
  border-collapse: collapse;
  font-family: ${fontFamily};
  margin: 20px 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
th {
  background-color: ${headerBgColor};
  color: ${headerTextColor};
  font-weight: ${headerFontWeight};
  padding: ${paddingCell};
  text-align: ${textAlign};
  border: 1px solid ${borderColor};
}
td {
  padding: ${paddingCell};
  border: 1px solid ${borderColor};
  color: #334155;
  text-align: ${textAlign};
}
tr:nth-child(even) td {
  background-color: ${rowStripeColor};
}
tr:nth-child(odd) td {
  background-color: #ffffff;
}
</style>`
    setGeneratedCss(css)
  }, [headerBgColor, headerTextColor, rowStripeColor, borderColor, fontFamily, tableWidth, paddingCell, textAlign, headerFontWeight])

  const handleCopy = async () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'copy_clicked', { tool_name: 'html_table_styler' })
    }
    try {
      await navigator.clipboard.writeText(generatedCss)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = generatedCss
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Pre-defined themes
  const handleApplyTheme = (theme: 'modern' | 'dark' | 'simple') => {
    if (theme === 'modern') {
      setHeaderBgColor('#2563eb')
      setHeaderTextColor('#ffffff')
      setRowStripeColor('#f8fafc')
      setBorderColor('#e2e8f0')
    } else if (theme === 'dark') {
      setHeaderBgColor('#1e293b')
      setHeaderTextColor('#f8fafc')
      setRowStripeColor('#f1f5f9')
      setBorderColor('#cbd5e1')
    } else if (theme === 'simple') {
      setHeaderBgColor('#ffffff')
      setHeaderTextColor('#334155')
      setRowStripeColor('#ffffff')
      setBorderColor('#e2e8f0')
    }
  }

  return (
    <div className="container">
      <div suppressHydrationWarning className="tool-page reveal-stagger">
        {/* Breadcrumb */}
        <nav className="tool-breadcrumb">
          <Link href="/tools">Tools</Link>
          <span className="tool-breadcrumb__sep">/</span>
          <span>HTML Table Styler</span>
        </nav>

        {/* Header */}
        <header className="tool-header">
          <div className="tool-header__icon">🎨</div>
          <h1 className="tool-header__title">Power Automate HTML Table Styler</h1>
          <p className="tool-header__desc">
            Visual CSS generator for styling the output of the "Create HTML table" action in Power Automate. 
            Customize colors, fonts, and borders, then copy the raw <code>&lt;style&gt;</code> block straight into your email flow.
          </p>
        </header>

        {/* Flex layout for Editor + Preview */}
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', marginTop: '2rem' }}>
          
          {/* Controls Panel */}
          <div style={{ flex: '1 1 300px', minWidth: 0, background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 className="tool-section__label" style={{ marginTop: 0 }}>Styling Options</h2>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="formatter-action-btn" onClick={() => handleApplyTheme('modern')}>Modern Blue</button>
              <button className="formatter-action-btn" onClick={() => handleApplyTheme('dark')}>Dark Slate</button>
              <button className="formatter-action-btn" onClick={() => handleApplyTheme('simple')}>Minimal</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>Header Background</label>
                <input type="color" value={headerBgColor} onChange={(e) => setHeaderBgColor(e.target.value)} style={{ width: '100%', height: '40px', padding: '0', cursor: 'pointer', border: 'none', borderRadius: '6px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>Header Text Color</label>
                <input type="color" value={headerTextColor} onChange={(e) => setHeaderTextColor(e.target.value)} style={{ width: '100%', height: '40px', padding: '0', cursor: 'pointer', border: 'none', borderRadius: '6px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>Alternating Row Color</label>
                <input type="color" value={rowStripeColor} onChange={(e) => setRowStripeColor(e.target.value)} style={{ width: '100%', height: '40px', padding: '0', cursor: 'pointer', border: 'none', borderRadius: '6px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>Border Color</label>
                <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} style={{ width: '100%', height: '40px', padding: '0', cursor: 'pointer', border: 'none', borderRadius: '6px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>Font Family</label>
                <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}>
                  <option value="Segoe UI, sans-serif">Segoe UI (Default M365)</option>
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="Helvetica, sans-serif">Helvetica</option>
                  <option value="monospace">Monospace</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>Text Alignment</label>
                <select value={textAlign} onChange={(e) => setTextAlign(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}>
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>Header Font Weight</label>
                <select value={headerFontWeight} onChange={(e) => setHeaderFontWeight(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}>
                  <option value="normal">Normal</option>
                  <option value="600">Semibold (600)</option>
                  <option value="bold">Bold (700)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>Cell Padding</label>
                <input type="text" value={paddingCell} onChange={(e) => setPaddingCell(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>Table Width</label>
                <input type="text" value={tableWidth} onChange={(e) => setTableWidth(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
              </div>
            </div>
            
          </div>

          {/* Preview Panel */}
          <div style={{ flex: '2 1 500px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', overflowX: 'auto' }}>
              <h2 className="tool-section__label" style={{ marginTop: 0, color: '#334155' }}>Live Preview</h2>
              {/* Inject the generated CSS into the component just for this preview, but scoped! */}
              <style dangerouslySetInnerHTML={{ __html: generatedCss.replace(/table/g, '.pa-table-preview table').replace(/th/g, '.pa-table-preview th').replace(/td/g, '.pa-table-preview td').replace(/<style>/, '').replace(/<\/style>/, '') }} />
              
              <div className="pa-table-preview">
                {/* This simulates what Power Automate generates */}
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Owner</th>
                      <th>Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PREVIEW_DATA.map((row) => (
                      <tr key={row.ID}>
                        <td>{row.ID}</td>
                        <td>{row.Title}</td>
                        <td>{row.Status}</td>
                        <td>{row.Owner}</td>
                        <td>{row.Priority}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h2 className="tool-section__label" style={{ margin: 0 }}>Generated CSS</h2>
                <button
                  className={`formatter-action-btn ${copied ? 'formatter-action-btn--success' : ''}`}
                  onClick={handleCopy}
                  title="Copy CSS snippet"
                >
                  {copied ? '✓ Copied!' : '📋 Copy CSS'}
                </button>
              </div>
              <textarea
                readOnly
                value={generatedCss}
                style={{
                  width: '100%',
                  height: '220px',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: '#1e293b',
                  color: '#e2e8f0',
                  resize: 'none'
                }}
              />
            </div>
          </div>

        </div>

        {/* SEO Content */}
        <section className="tool-info" style={{ marginTop: '3rem' }}>
          <h2>How to style an HTML table in Power Automate</h2>
          <p>
            When you use the <strong>Create HTML table</strong> action in Power Automate (often fed from a "Get items" SharePoint action), it outputs a very basic, unstyled HTML table. It lacks borders, padding, and alternating row colors, making it hard to read when sent in an email or Teams message.
          </p>
          <h3>Steps to apply this CSS:</h3>
          <ol>
            <li>Add a <strong>Compose</strong> action immediately after your "Create HTML table" action.</li>
            <li>Paste the <code>&lt;style&gt;</code> block generated by this tool into that Compose action.</li>
            <li>In your "Send an email (V2)" or "Post message in a chat or channel" action, insert the output of the <strong>Compose</strong> action (the CSS) first, followed immediately by the output of the <strong>Create HTML table</strong> action.</li>
          </ol>
          <p>
            When the email client or Teams renders the message, the browser engine will read your <code>&lt;style&gt;</code> tags and format the table exactly as it appears in the live preview above. 
          </p>
          <div style={{ padding: '16px', background: 'var(--surface-hover)', borderRadius: '8px', borderLeft: '4px solid var(--accent)', marginTop: '1rem' }}>
            <strong>Pro Tip:</strong> Ensure that your email body is set to "Code View" (the <code>&lt;/&gt;</code> icon) when pasting raw HTML into Outlook email actions, or just use dynamic content mapping to insert the Compose output.
          </div>
        </section>

        <ToolFAQ slug="html-table-styler" />

        <AdSlot type="leaderboard" />

        <RelatedTools currentSlug="html-table-styler" />
      </div>
    </div>
  )
}
