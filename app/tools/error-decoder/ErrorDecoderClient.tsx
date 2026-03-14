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
    <div className="container">
       <style>{`
        .err-decoder-wrapper {
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }
        
        /* Search Box */
        .err-search-container {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-2xl);
          padding: var(--space-6);
          box-shadow: var(--shadow-xl);
          position: relative;
        }
        .err-search-label {
          display: block;
          font-size: var(--fs-sm);
          font-weight: var(--fw-bold);
          color: var(--text-muted);
          margin-bottom: var(--space-2);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .err-search-input-wrapper {
          position: relative;
        }
        .err-search-icon {
          position: absolute;
          top: 1rem;
          left: 1rem;
          color: var(--text-muted);
        }
        .err-textarea {
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
        .err-textarea:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 1px var(--accent);
        }
        .err-search-help {
          font-size: var(--fs-xs);
          color: var(--text-secondary);
          margin-top: var(--space-3);
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        /* Results */
        .err-results-header {
          font-size: var(--fs-xl);
          font-weight: var(--fw-bold);
          color: var(--text-primary);
          border-bottom: 1px solid var(--border);
          padding-bottom: var(--space-2);
          margin-bottom: var(--space-6);
        }
        .err-empty-state {
          background: var(--bg-secondary);
          border: 1px dashed var(--border);
          border-radius: var(--radius-xl);
          padding: var(--space-8);
          text-align: center;
          color: var(--text-secondary);
        }
        
        /* Cards */
        .err-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-2xl);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          transition: border-color var(--transition-fast), transform var(--transition-fast);
          margin-bottom: var(--space-6);
        }
        .err-card:hover {
          border-color: var(--text-muted);
          transform: translateY(-2px);
        }
        .err-card-header {
          padding: var(--space-4) var(--space-6);
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }
        .err-service-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-3);
          border-radius: var(--radius-xl);
          border: 1px solid;
          background: rgba(255,255,255,0.05);
        }
        .err-service-label {
          font-size: var(--fs-xs);
          font-weight: var(--fw-bold);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 2px;
        }
        .err-error-title {
          font-size: var(--fs-lg);
          font-weight: var(--fw-bold);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: var(--space-3);
          flex-wrap: wrap;
        }
        .err-error-code {
          font-size: var(--fs-xs);
          font-weight: var(--fw-normal);
          font-family: var(--font-mono);
          background: var(--bg-primary);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
          color: var(--text-secondary);
        }
        .err-card-body {
          padding: var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }
        
        /* Inner Sections */
        .err-section {
          display: flex;
          gap: var(--space-4);
        }
        .err-section-icon {
          margin-top: 4px;
          flex-shrink: 0;
        }
        .err-section-title {
          font-weight: var(--fw-semibold);
          color: var(--text-primary);
          margin-bottom: var(--space-2);
        }
        .err-section-text {
          font-size: var(--fs-sm);
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .err-fix-box {
          background: rgba(16, 185, 129, 0.05);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: var(--radius-xl);
          padding: var(--space-4);
        }
        .err-fix-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .err-fix-item {
          display: flex;
          gap: var(--space-2);
          font-size: var(--fs-sm);
          color: var(--text-primary);
          line-height: 1.6;
        }
        .err-fix-bullet {
          color: #10b981;
          font-weight: bold;
        }
      `}</style>
      
      <div className="err-decoder-wrapper">
        {/* Search Bar Container */}
        <div className="err-search-container reveal">
          <label htmlFor="error-input" className="err-search-label">
            Paste Error Message / Code
          </label>
          <div className="err-search-input-wrapper">
            <div className="err-search-icon">
              <Search size={24} />
            </div>
            <textarea
              id="error-input"
              rows={4}
              className="err-textarea"
              placeholder="e.g. 0x80070005, ActionBranchingConditionNotSatisfied, Cannot convert a primitive value..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <p className="err-search-help">
            <Info size={14} /> The decoder scans your pasted log against known M365 error patterns.
          </p>
        </div>

        {/* Results Section */}
        {query.trim() && (
          <div className="reveal">
            <h2 className="err-results-header">
              {filteredErrors.length === 0 ? 'No exact matches found' : `Discovered Issues (${filteredErrors.length})`}
            </h2>

            {filteredErrors.length === 0 ? (
              <div className="err-empty-state">
                <p>We couldn't identify a known issue from the text provided.</p>
                <p style={{ marginTop: '0.5rem', fontSize: 'var(--fs-sm)' }}>Try pasting just the specific error code or the exact sentence that indicates failure.</p>
              </div>
            ) : (
              <div>
                {filteredErrors.map((error) => {
                  const config = serviceConfig[error.service] || serviceConfig['SharePoint']

                  return (
                    <div key={error.id} className="err-card">
                      
                      {/* Card Header */}
                      <div className="err-card-header">
                        <div className={`err-service-icon ${config.colorClass}`} style={{ color: config.colorClass.includes('sky') ? '#38bdf8' : config.colorClass.includes('indigo') ? '#818cf8' : config.colorClass.includes('fuchsia') ? '#e879f9' : config.colorClass.includes('emerald') ? '#34d399' : '#cbd5e1' }}>
                          {config.icon}
                        </div>
                        <div>
                          <div className="err-service-label">{error.service}</div>
                          <h3 className="err-error-title">
                            {error.title} 
                            <span className="err-error-code">Code: {error.code}</span>
                          </h3>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="err-card-body">
                        
                        {/* Description */}
                        <div className="err-section">
                          <div className="err-section-icon" style={{ color: '#38bdf8' }}><Info size={20} /></div>
                          <div>
                            <h4 className="err-section-title">What this means</h4>
                            <p className="err-section-text">{error.description}</p>
                          </div>
                        </div>

                        {/* Root Cause */}
                        <div className="err-section">
                          <div className="err-section-icon" style={{ color: '#fbbf24' }}><AlertTriangle size={20} /></div>
                          <div>
                            <h4 className="err-section-title">Root Cause</h4>
                            <p className="err-section-text">{error.rootCause}</p>
                          </div>
                        </div>

                        {/* Fixes */}
                        <div className="err-section err-fix-box">
                          <div className="err-section-icon" style={{ color: '#10b981' }}><CheckCircle size={20} /></div>
                          <div>
                            <h4 className="err-section-title" style={{ color: '#10b981' }}>How to Fix</h4>
                            <ul className="err-fix-list">
                              {error.solution.map((step, idx) => (
                                <li key={idx} className="err-fix-item">
                                  <span className="err-fix-bullet">•</span>
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
    </div>
  )
}
