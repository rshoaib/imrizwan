'use client'

import React, { useState, useMemo } from 'react'
import { m365Errors, M365Error } from '@/data/errors'
import { Search, AlertTriangle, CheckCircle, Info, Database, Zap, Cpu, MessageSquare, Users } from 'lucide-react'

// Map services to icons and colors
const serviceConfig: Record<string, { icon: React.ReactNode, colorClass: string }> = {
  'SharePoint': { icon: <Database size={18} />, colorClass: 'text-sky-400 border-sky-400' },
  'Power Automate': { icon: <Zap size={18} />, colorClass: 'text-indigo-400 border-indigo-400' },
  'Power Apps': { icon: <Cpu size={18} />, colorClass: 'text-fuchsia-400 border-fuchsia-400' },
  'Graph API': { icon: <MessageSquare size={18} />, colorClass: 'text-emerald-400 border-emerald-400' },
  'Entra ID': { icon: <Users size={18} />, colorClass: 'text-slate-300 border-slate-300' },
}

export default function ErrorDecoderClient() {
  const [query, setQuery] = useState('')

  // Search logic
  const filteredErrors = useMemo(() => {
    if (!query.trim()) return []

    const q = query.toLowerCase()
    return m365Errors.filter(error => {
      // 1. Direct code match (e.g. user typed "0x80070005")
      if (error.code.toLowerCase().includes(q)) return true
      
      // 2. Keyword match against the predefined keywords
      if (error.matchKeywords.some(keyword => q.includes(keyword) || keyword.includes(q))) return true
      
      // 3. Fallback: Search the title and description
      if (error.title.toLowerCase().includes(q)) return true
      if (error.description.toLowerCase().includes(q)) return true
      
      return false
    })
  }, [query])

  return (
    <div className="error-decoder-wrapper">
      <style>{`
        .error-decoder-wrapper {
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }
        
        .ed-search-container {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-2xl);
          padding: var(--space-6);
          box-shadow: var(--shadow-xl);
          position: relative;
        }
        
        .ed-search-label {
          display: block;
          font-size: var(--fs-sm);
          font-weight: var(--fw-bold);
          color: var(--text-muted);
          margin-bottom: var(--space-2);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .ed-search-input-wrapper {
          position: relative;
        }
        
        .ed-search-icon {
          position: absolute;
          top: 1rem;
          left: 1rem;
          color: var(--text-muted);
        }
        
        .ed-textarea {
          width: 100%;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: 1rem 1rem 1rem 3rem;
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-size: var(--fs-sm);
          resize: vertical;
          min-height: 120px;
          transition: border-color var(--transition-fast);
        }
        
        .ed-textarea:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 1px var(--accent);
        }
        
        .ed-search-help {
          font-size: var(--fs-xs);
          color: var(--text-secondary);
          margin-top: var(--space-3);
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .ed-results-header {
          font-size: var(--fs-xl);
          font-weight: var(--fw-bold);
          color: var(--text-primary);
          border-bottom: 1px solid var(--border);
          padding-bottom: var(--space-2);
          margin-bottom: var(--space-6);
        }

        .ed-empty-state {
          background: var(--bg-secondary);
          border: 1px dashed var(--border);
          border-radius: var(--radius-xl);
          padding: var(--space-8);
          text-align: center;
          color: var(--text-secondary);
        }
        
        .ed-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-2xl);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          transition: border-color var(--transition-fast), transform var(--transition-fast);
        }
        
        .ed-card:hover {
          border-color: var(--text-muted);
          transform: translateY(-2px);
        }

        .ed-card-header {
          padding: var(--space-4) var(--space-6);
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .ed-service-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-2);
          border-radius: var(--radius-lg);
          border: 1px solid;
          background: rgba(255,255,255,0.05);
        }
        
        .ed-service-label {
          font-size: var(--fs-xs);
          font-weight: var(--fw-bold);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 2px;
        }

        .ed-error-title {
          font-size: var(--fs-lg);
          font-weight: var(--fw-bold);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: var(--space-3);
          flex-wrap: wrap;
        }

        .ed-error-code {
          font-size: var(--fs-xs);
          font-weight: var(--fw-normal);
          font-family: var(--font-mono);
          background: var(--bg-primary);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
          color: var(--text-secondary);
        }

        .ed-card-body {
          padding: var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .ed-section {
          display: flex;
          gap: var(--space-4);
        }
        
        .ed-section-icon {
          margin-top: 4px;
        }

        .ed-section-title {
          font-weight: var(--fw-semibold);
          color: var(--text-primary);
          margin-bottom: var(--space-2);
        }

        .ed-section-text {
          font-size: var(--fs-sm);
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .ed-fix-box {
          background: rgba(16, 185, 129, 0.05); /* Emerald tint */
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: var(--radius-xl);
          padding: var(--space-4);
        }

        .ed-fix-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .ed-fix-item {
          display: flex;
          gap: var(--space-2);
          font-size: var(--fs-sm);
          color: var(--text-primary);
          line-height: 1.6;
        }
      `}</style>
      
      {/* Search Bar Container */}
      <div className="ed-search-container reveal">
        <label htmlFor="error-input" className="ed-search-label">
          Paste Error Message / Code
        </label>
        <div className="ed-search-input-wrapper">
          <div className="ed-search-icon">
            <Search size={24} />
          </div>
          <textarea
            id="error-input"
            rows={4}
            className="ed-textarea"
            placeholder="e.g. 0x80070005, ActionBranchingConditionNotSatisfied, Cannot convert a primitive value..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <p className="ed-search-help">
          <Info size={14} /> The decoder scans your pasted log against known M365 error patterns.
        </p>
      </div>

      {/* Results Section */}
      {query.trim() && (
        <div className="reveal">
          <h2 className="ed-results-header">
            {filteredErrors.length === 0 ? 'No exact matches found' : `Discovered Issues (${filteredErrors.length})`}
          </h2>

          {filteredErrors.length === 0 ? (
            <div className="ed-empty-state">
              <p>We couldn't identify a known issue from the text provided.</p>
              <p style={{ marginTop: '0.5rem', fontSize: 'var(--fs-sm)' }}>Try pasting just the specific error code or the exact sentence that indicates failure.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              {filteredErrors.map((error) => {
                const config = serviceConfig[error.service] || serviceConfig['SharePoint']

                return (
                  <div key={error.id} className="ed-card">
                    
                    {/* Card Header */}
                    <div className="ed-card-header">
                      <div className={`ed-service-icon ${config.colorClass}`}>
                        {config.icon}
                      </div>
                      <div>
                        <div className="ed-service-label">{error.service}</div>
                        <h3 className="ed-error-title">
                          {error.title} 
                          <span className="ed-error-code">Code: {error.code}</span>
                        </h3>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="ed-card-body">
                      
                      {/* Description */}
                      <div className="ed-section">
                        <div className="ed-section-icon" style={{ color: '#0ea5e9' }}><Info size={20} /></div>
                        <div>
                          <h4 className="ed-section-title">What this means</h4>
                          <p className="ed-section-text">{error.description}</p>
                        </div>
                      </div>

                      {/* Root Cause */}
                      <div className="ed-section">
                        <div className="ed-section-icon" style={{ color: '#fbbf24' }}><AlertTriangle size={20} /></div>
                        <div>
                          <h4 className="ed-section-title">Root Cause</h4>
                          <p className="ed-section-text">{error.rootCause}</p>
                        </div>
                      </div>

                      {/* Fixes */}
                      <div className="ed-section ed-fix-box">
                        <div className="ed-section-icon" style={{ color: '#10b981' }}><CheckCircle size={20} /></div>
                        <div>
                          <h4 className="ed-section-title" style={{ color: '#10b981' }}>How to Fix</h4>
                          <ul className="ed-fix-list">
                            {error.solution.map((step, idx) => (
                              <li key={idx} className="ed-fix-item">
                                <span style={{ color: '#10b981', fontWeight: 'bold' }}>•</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
