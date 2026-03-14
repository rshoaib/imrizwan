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
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      
      {/* Search Bar Container */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-md reveal">
        <label htmlFor="error-input" className="block text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider">
          Paste Error Message / Code
        </label>
        <div className="relative">
          <div className="absolute top-4 left-4 text-slate-500">
            <Search size={24} />
          </div>
          <textarea
            id="error-input"
            rows={4}
            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl py-4 pl-12 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all font-mono text-sm resize-y min-h-[120px]"
            placeholder="e.g. 0x80070005, ActionBranchingConditionNotSatisfied, Cannot convert a primitive value..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
          <Info size={14} /> The decoder scans your pasted log against known M365 error patterns.
        </p>
      </div>

      {/* Results Section */}
      {query.trim() && (
        <div className="reveal">
          <h2 className="text-xl font-bold border-b border-slate-800 pb-2 text-slate-200 mb-6">
            {filteredErrors.length === 0 ? 'No exact matches found' : `Discovered Issues (${filteredErrors.length})`}
          </h2>

          {filteredErrors.length === 0 ? (
            <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-xl p-8 text-center text-slate-400">
              <p>We couldn't identify a known issue from the text provided.</p>
              <p className="mt-2 text-sm">Try pasting just the specific error code or the exact sentence that indicates failure.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredErrors.map((error) => {
                const config = serviceConfig[error.service] || serviceConfig['SharePoint']

                return (
                  <div key={error.id} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg hover:border-slate-500/50 transition-all duration-200">
                    
                    {/* Card Header */}
                    <div className="px-6 py-4 bg-slate-900/60 border-b border-slate-700/50 flex flex-col sm:flex-row sm:align-center gap-4">
                      <div className={`flex items-center justify-center p-3 rounded-xl border bg-slate-800/50 ${config.colorClass}`}>
                        {config.icon}
                      </div>
                      <div className="flex flex-col justify-center">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">{error.service}</div>
                        <h3 className="text-lg font-bold text-slate-100 flex flex-wrap items-center gap-2">
                          {error.title} 
                          <span className="text-xs font-normal font-mono bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700 text-slate-300">Code: {error.code}</span>
                        </h3>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex flex-col gap-6">
                      
                      {/* Description */}
                      <div className="flex gap-4">
                        <div className="mt-1 text-sky-400 shrink-0"><Info size={20} /></div>
                        <div>
                          <h4 className="font-semibold text-slate-200 mb-1">What this means</h4>
                          <p className="text-slate-300 text-sm leading-relaxed">{error.description}</p>
                        </div>
                      </div>

                      {/* Root Cause */}
                      <div className="flex gap-4">
                        <div className="mt-1 text-amber-400 shrink-0"><AlertTriangle size={20} /></div>
                        <div>
                          <h4 className="font-semibold text-slate-200 mb-1">Root Cause</h4>
                          <p className="text-slate-300 text-sm leading-relaxed">{error.rootCause}</p>
                        </div>
                      </div>

                      {/* Fixes */}
                      <div className="flex gap-4 bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-4 md:-mx-4">
                        <div className="mt-1 text-emerald-400 shrink-0"><CheckCircle size={20} /></div>
                        <div>
                          <h4 className="font-semibold text-emerald-400 mb-2">How to Fix</h4>
                          <ul className="flex flex-col gap-2">
                            {error.solution.map((step, idx) => (
                              <li key={idx} className="flex gap-2 text-sm text-slate-300 leading-relaxed">
                                <span className="text-emerald-500 font-bold">•</span>
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
