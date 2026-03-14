'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, ChevronDown, Copy, Check, Info, Shield, Server, User } from 'lucide-react'
import { graphEndpoints, GraphEndpointData } from '@/data/graph-endpoints'

export default function GraphExplorerClient() {
  const [query, setQuery] = useState('')
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>(graphEndpoints[0].id)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Determine the active endpoint to display
  const activeEndpoint = useMemo(() => {
    return graphEndpoints.find(e => e.id === selectedEndpointId) || graphEndpoints[0]
  }, [selectedEndpointId])

  // Group endpoints for the dropdown
  const groupedEndpoints = useMemo(() => {
    return graphEndpoints.reduce((acc, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = []
      }
      acc[curr.category].push(curr)
      return acc
    }, {} as Record<string, GraphEndpointData[]>)
  }, [])

  // Auto-filter when typing a URL directly
  useEffect(() => {
    if (!query) return;
    const lowerQuery = query.toLowerCase();
    const match = graphEndpoints.find(e => e.endpoint.toLowerCase().includes(lowerQuery));
    if (match && dropdownOpen) { // Only auto-select if they are typing in the search bar and results are open
        // Wait for user to actually select, doing it on type might be jarring. Let's just filter the dropdown.
    }
  }, [query])

  // Filtered endpoints for dropdown search
  const filteredGroupedEndpoints = useMemo(() => {
    if (!query) return groupedEndpoints;
    const result: Record<string, GraphEndpointData[]> = {};
    const lowerQuery = query.toLowerCase();
    
    Object.keys(groupedEndpoints).forEach(category => {
      const matches = groupedEndpoints[category].filter(e => 
        e.endpoint.toLowerCase().includes(lowerQuery) || 
        e.description.toLowerCase().includes(lowerQuery) ||
        category.toLowerCase().includes(lowerQuery)
      );
      if (matches.length > 0) {
        result[category] = matches;
      }
    });
    return result;
  }, [query, groupedEndpoints])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(activeEndpoint.mockResponse, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleSelectEndpoint = (id: string) => {
    setSelectedEndpointId(id)
    setDropdownOpen(false)
    setQuery('') // Reset query on select
  }

  return (
    <div className="container">
      <style>{`
        .gx-wrapper {
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
        }
        
        /* URL Bar UI */
        .gx-url-container {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-2xl);
          padding: var(--space-4);
          box-shadow: var(--shadow-xl);
        }
        
        .gx-url-bar {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          width: 100%;
          position: relative;
        }
        
        .gx-method-badge {
          background: var(--text-primary);
          color: var(--bg-primary);
          font-weight: var(--fw-bold);
          font-size: var(--fs-md);
          padding: 12px 16px;
          border-radius: var(--radius-xl);
          font-family: var(--font-mono);
          letter-spacing: 0.05em;
          flex-shrink: 0;
        }
        
        .gx-method-GET { background: #3b82f6; color: white; }
        .gx-method-POST { background: #10b981; color: white; }
        .gx-method-PUT { background: #f59e0b; color: white; }
        .gx-method-DELETE { background: #ef4444; color: white; }
        
        .gx-search-wrapper {
          position: relative;
          flex-grow: 1;
        }

        .gx-search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .gx-dropdown-icon {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          cursor: pointer;
          transition: transform var(--transition-fast);
        }

        .gx-dropdown-icon.open {
          transform: translateY(-50%) rotate(180deg);
        }
        
        .gx-input {
          width: 100%;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: 1rem 3rem;
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-size: var(--fs-sm);
          transition: border-color var(--transition-fast);
        }
        
        .gx-input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 1px var(--accent);
        }

        /* Dropdown Menu */
        .gx-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          max-height: 400px;
          overflow-y: auto;
          z-index: 50;
        }

        .gx-dropdown-category {
          padding: 8px 16px;
          font-size: var(--fs-xs);
          font-weight: var(--fw-bold);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          background: var(--bg-secondary);
          position: sticky;
          top: 0;
        }

        .gx-dropdown-item {
          padding: 12px 16px;
          cursor: pointer;
          border-bottom: 1px solid var(--border);
          transition: background var(--transition-fast);
        }
        
        .gx-dropdown-item:last-child {
          border-bottom: none;
        }

        .gx-dropdown-item:hover {
          background: var(--bg-secondary);
        }

        .gx-item-title {
          font-family: var(--font-mono);
          font-size: var(--fs-sm);
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        
        .gx-item-desc {
          font-size: var(--fs-xs);
          color: var(--text-secondary);
        }

        /* Info & Permissions Container */
        .gx-two-col {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-6);
        }

        @media (min-width: 1024px) {
          .gx-two-col {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* Panels */
        .gx-panel {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-2xl);
          padding: var(--space-6);
          box-shadow: var(--shadow-md);
        }

        .gx-panel-header {
          font-size: var(--fs-lg);
          font-weight: var(--fw-bold);
          color: var(--text-primary);
          margin-bottom: var(--space-4);
          display: flex;
          align-items: center;
          gap: var(--space-2);
          border-bottom: 1px solid var(--border);
          padding-bottom: var(--space-3);
        }

        .gx-panel-desc {
          font-size: var(--fs-sm);
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: var(--space-6);
        }

        /* Permissions */
        .gx-perm-group {
          margin-bottom: var(--space-5);
        }

        .gx-perm-title {
          font-size: var(--fs-sm);
          font-weight: var(--fw-bold);
          color: var(--text-primary);
          margin-bottom: var(--space-3);
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .gx-perm-tags {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .gx-tag {
          font-size: var(--fs-xs);
          font-family: var(--font-mono);
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          border: 1px solid;
        }

        .gx-tag-delegated {
          background: rgba(56, 189, 248, 0.1);
          border-color: rgba(56, 189, 248, 0.3);
          color: #38bdf8;
        }

        .gx-tag-application {
          background: rgba(167, 139, 250, 0.1);
          border-color: rgba(167, 139, 250, 0.3);
          color: #a78bfa;
        }

        /* Code Block */
        .gx-code-container {
          background: #0f172a; /* Slate 900 */
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          position: relative;
          overflow: hidden;
        }

        .gx-code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 16px;
          background: #1e293b; /* Slate 800 */
          border-bottom: 1px solid var(--border);
        }

        .gx-code-title {
          font-size: var(--fs-xs);
          font-family: var(--font-mono);
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .gx-copy-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-secondary);
          padding: 4px 10px;
          border-radius: var(--radius-md);
          font-size: var(--fs-xs);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .gx-copy-btn:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .gx-copy-btn.copied {
          color: #10b981;
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }

        .gx-pre {
          margin: 0;
          padding: var(--space-4);
          overflow-x: auto;
          font-family: var(--font-mono);
          font-size: 13px;
          line-height: 1.5;
          color: #e2e8f0;
          max-height: 400px;
          overflow-y: auto;
        }

      `}</style>
      
      <div className="gx-wrapper">
        
        {/* URL/Command Bar */}
        <div className="gx-url-container reveal">
          <div className="gx-url-bar">
            <div className={`gx-method-badge gx-method-${activeEndpoint.method}`}>
              {activeEndpoint.method}
            </div>
            
            <div className="gx-search-wrapper">
              <Search className="gx-search-icon" size={20} />
              <input 
                type="text" 
                className="gx-input"
                placeholder="Search endpoints (e.g. /me, groups, messages)..."
                value={dropdownOpen ? query : activeEndpoint.endpoint}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setDropdownOpen(true);
                }}
                onFocus={() => {
                  setDropdownOpen(true);
                  if(!query) setQuery(activeEndpoint.endpoint); // Pre-fill to allow quick editing/searching
                }}
                onBlur={() => {
                  // Delay closing to allow clicks on dropdown items
                  setTimeout(() => setDropdownOpen(false), 200); 
                }}
              />
              <ChevronDown 
                className={`gx-dropdown-icon ${dropdownOpen ? 'open' : ''}`} 
                size={20} 
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />

              {/* Autocomplete Dropdown */}
              {dropdownOpen && (
                <div className="gx-dropdown">
                  {Object.keys(filteredGroupedEndpoints).length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-500">No matching endpoints found</div>
                  ) : (
                    Object.entries(filteredGroupedEndpoints).map(([category, endpoints]) => (
                      <div key={category}>
                        <div className="gx-dropdown-category">{category}</div>
                        {endpoints.map((ep) => (
                          <div 
                            key={ep.id} 
                            className="gx-dropdown-item"
                            onClick={() => handleSelectEndpoint(ep.id)}
                          >
                            <div className="gx-item-title">
                              <span style={{color: ep.method === 'GET' ? '#3b82f6' : '#10b981', marginRight: '8px', fontWeight: 'bold'}}>{ep.method}</span>
                              {ep.endpoint}
                            </div>
                            <div className="gx-item-desc">{ep.description}</div>
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="gx-two-col reveal delay-100">
          
          {/* Left Column: Info & Permissions */}
          <div className="flex flex-col gap-6">
            <div className="gx-panel">
               <h2 className="gx-panel-header">
                <Info size={24} style={{color: '#38bdf8'}} /> Endpoint Details
               </h2>
               <p className="gx-panel-desc">{activeEndpoint.description}</p>
               
               <div className="mb-4 pt-4 border-t border-slate-800">
                 <h2 className="gx-panel-header border-none mb-4">
                  <Shield size={24} style={{color: '#f59e0b'}} /> Required Permissions
                 </h2>
                 
                 {/* Delegated */}
                 <div className="gx-perm-group">
                   <div className="gx-perm-title"><User size={16}/> Delegated (Work or School Account)</div>
                   <div className="gx-perm-tags">
                     {activeEndpoint.delegatedPermissions.length > 0 ? (
                       activeEndpoint.delegatedPermissions.map(p => (
                         <span key={p} className="gx-tag gx-tag-delegated">{p}</span>
                       ))
                     ) : (
                       <span className="text-xs text-slate-500 italic">Not supported for delegated flow</span>
                     )}
                   </div>
                 </div>

                 {/* Application */}
                 <div className="gx-perm-group mb-0">
                   <div className="gx-perm-title"><Server size={16}/> Application (Background Service)</div>
                   <div className="gx-perm-tags">
                     {activeEndpoint.applicationPermissions.length > 0 ? (
                       activeEndpoint.applicationPermissions.map(p => (
                         <span key={p} className="gx-tag gx-tag-application">{p}</span>
                       ))
                     ) : (
                       <span className="text-xs text-slate-500 italic">Not supported for application flow</span>
                     )}
                   </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Right Column: JSON Response */}
          <div className="gx-panel p-0 overflow-hidden flex flex-col h-full">
            <div className="gx-code-container h-full flex flex-col border-none radius-none">
              <div className="gx-code-header">
                <span className="gx-code-title">Mock Response Data (JSON)</span>
                <button 
                  onClick={copyToClipboard}
                  className={`gx-copy-btn ${copied ? 'copied' : ''}`}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="gx-pre flex-grow">
                {JSON.stringify(activeEndpoint.mockResponse, null, 2)}
              </pre>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
