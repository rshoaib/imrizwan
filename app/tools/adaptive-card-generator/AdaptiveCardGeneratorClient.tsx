'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import RelatedTools from '@/components/RelatedTools'
import AdSlot from '@/components/AdSlot'
import ToolFAQ from '@/components/ToolFAQ'

const TEMPLATES: Record<string, any> = {
  ac_basic: {
    type: "AdaptiveCard",
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    version: "1.5",
    body: [
      {
        type: "TextBlock",
        text: "Project Apollo",
        weight: "Bolder",
        size: "Medium"
      },
      {
        type: "TextBlock",
        text: "Launch sequence initiated. All systems go.",
        isSubtle: true,
        wrap: true
      }
    ]
  },
  ace_primary: {
    templateType: "PrimaryText",
    data: {
      primaryText: "Welcome to Viva!",
      description: "Tap here to explore the new employee dashboard features.",
      title: "Company Intranet"
    }
  },
  ac_input: {
    type: "AdaptiveCard",
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    version: "1.5",
    body: [
      {
        type: "TextBlock",
        text: "Feedback Form",
        weight: "Bolder",
        size: "Large"
      },
      {
        type: "Input.Text",
        id: "comments",
        placeholder: "Enter your comments...",
        isMultiline: true
      }
    ],
    actions: [
      {
        type: "Action.Submit",
        title: "Submit Feedback"
      }
    ]
  }
}

export default function AdaptiveCardGeneratorClient() {
  const [jsonInput, setJsonInput] = useState(() => JSON.stringify(TEMPLATES.ace_primary, null, 2))
  const [parsedCard, setParsedCard] = useState<any>(TEMPLATES.ace_primary)
  const [errorMsg, setErrorMsg] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try {
      const parsed = JSON.parse(jsonInput)
      setParsedCard(parsed)
      setErrorMsg('')
    } catch (e) {
      setErrorMsg('Invalid JSON format.')
    }
  }, [jsonInput])

  const handleTemplateSelect = (key: string) => {
    setJsonInput(JSON.stringify(TEMPLATES[key], null, 2))
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'template_selected', { tool_name: 'adaptive_card_generator', template: key })
    }
  }

  const handleCopy = async () => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'copy_clicked', { tool_name: 'adaptive_card_generator' })
    }
    try {
      await navigator.clipboard.writeText(jsonInput)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  const trackToolUsage = () => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'tool_used', { tool_name: 'adaptive_card_generator' })
    }
  }

  return (
    <div className="container">
      <div className="tool-page glass-panel reveal-stagger">
        <nav className="tool-breadcrumb">
          <Link href="/tools">Tools</Link>
          <span className="tool-breadcrumb__sep">/</span>
          <span>Adaptive Card AI Generator</span>
        </nav>

        <header className="tool-header">
          <div className="tool-header__icon">🎴</div>
          <h1 className="tool-header__title">Adaptive Card AI Generator</h1>
          <p className="tool-header__desc">
            Build and preview Adaptive Cards visually with JSON templates optimized for SPFx Viva Connections ACEs.
          </p>
        </header>

        <div className="tool-grid-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)', gap: '2rem', alignItems: 'start', marginTop: '2rem' }}>
          
          {/* Editor Side */}
          <div className="editor-side">
            <div className="tool-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 className="tool-section__label" style={{ margin: 0 }}>Select Template (SPFx / Viva)</h2>
              </div>
              <div className="segmented-control" style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button className="segment-btn" onClick={() => handleTemplateSelect('ace_primary')}>Viva ACE: Primary Text</button>
                <button className="segment-btn" onClick={() => handleTemplateSelect('ac_basic')}>QuickView: Basic</button>
                <button className="segment-btn" onClick={() => handleTemplateSelect('ac_input')}>QuickView: Form</button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h2 className="tool-section__label" style={{ margin: 0 }}>Card Payload (JSON)</h2>
                {errorMsg && <span style={{ color: '#ef4444', fontSize: '13px' }}>{errorMsg}</span>}
              </div>
              
              <div className="formatter-editor" style={{ height: '450px', backgroundColor: '#1e1e1e' }}>
                <textarea 
                  value={jsonInput}
                  onChange={(e) => { setJsonInput(e.target.value); trackToolUsage(); }}
                  className="formatter-textarea"
                  style={{ whiteSpace: 'pre', color: '#d4d4d4', fontFamily: 'monospace', height: '100%', padding: '1rem' }}
                  spellCheck="false"
                />
              </div>
            </div>
          </div>

          {/* Preview Side */}
          <div className="preview-side" style={{ position: 'sticky', top: '5rem' }}>
            <div className="formatter-preview-wrapper" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 className="tool-section__label" style={{ margin: 0 }}>Live Preview Mockup</h2>
                <button 
                  onClick={handleCopy}
                  className={`formatter-action-btn ${copied ? 'formatter-action-btn--success' : ''}`}
                  style={{ padding: '0.3rem 0.8rem', fontSize: '13px' }}
                >
                  {copied ? '✓ Copied JSON' : '📋 Copy JSON'}
                </button>
              </div>
              
              <div className="ace-preview-container" style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '1.5rem',
                minHeight: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                {errorMsg ? (
                  <div style={{ color: 'var(--text-muted)' }}>Fix JSON errors to see preview</div>
                ) : (
                  <div className="ace-card-mockup" style={{
                    width: '320px',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid var(--border)'
                  }}>
                    {parsedCard.templateType === 'PrimaryText' ? (
                      <div style={{ padding: '1.25rem' }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                          {parsedCard.data?.title || 'Title'}
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
                          {parsedCard.data?.primaryText || 'Primary Text'}
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                          {parsedCard.data?.description || 'Description'}
                        </div>
                      </div>
                    ) : (
                       <div style={{ padding: '1.25rem' }}>
                         {parsedCard.body?.map((block: any, i: number) => {
                           if (block.type === 'TextBlock') {
                             return <div key={i} style={{
                               fontSize: block.size === 'Large' ? '20px' : '15px',
                               fontWeight: block.weight === 'Bolder' ? 700 : 400,
                               color: block.isSubtle ? 'var(--text-muted)' : 'var(--text-primary)',
                               marginBottom: '0.5rem'
                             }}>{block.text}</div>
                           }
                           if (block.type === 'Input.Text') {
                             return <div key={i} style={{
                               width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px', marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '13px'
                             }}>{block.placeholder}</div>
                           }
                           return null
                         })}
                         {parsedCard.actions && (
                           <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                             {parsedCard.actions.map((act: any, i: number) => (
                               <button key={i} style={{ flex: 1, padding: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, color: 'var(--accent)' }}>
                                 {act.title}
                               </button>
                             ))}
                           </div>
                         )}
                       </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

        <ToolFAQ slug="adaptive-card-generator" />

        <AdSlot type="leaderboard" />

        <RelatedTools currentSlug="adaptive-card-generator" />
      </div>
    </div>
  )
}
