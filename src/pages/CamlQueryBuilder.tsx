import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import RelatedTools from '../components/RelatedTools'

/* ───────────── Types ───────────── */
type CamlOperator = 
  | 'Eq' | 'Neq' | 'Gt' | 'Lt' | 'Geq' | 'Leq' 
  | 'BeginsWith' | 'Contains' | 'IsNull' | 'IsNotNull'

type FieldType = 
  | 'Text' | 'Number' | 'Boolean' | 'DateTime' 
  | 'Choice' | 'Lookup' | 'User' | 'URL'

interface QueryCondition {
  id: string
  fieldRef: string
  fieldType: FieldType
  operator: CamlOperator
  value: string
}

type LogicalJoin = 'And' | 'Or'

const OPERATORS: { value: CamlOperator; label: string; requiresValue: boolean }[] = [
  { value: 'Eq', label: 'Equals (Eq)', requiresValue: true },
  { value: 'Neq', label: 'Not Equals (Neq)', requiresValue: true },
  { value: 'Gt', label: 'Greater Than (Gt)', requiresValue: true },
  { value: 'Lt', label: 'Less Than (Lt)', requiresValue: true },
  { value: 'Geq', label: 'Greater or Equal (Geq)', requiresValue: true },
  { value: 'Leq', label: 'Less or Equal (Leq)', requiresValue: true },
  { value: 'BeginsWith', label: 'Begins With', requiresValue: true },
  { value: 'Contains', label: 'Contains', requiresValue: true },
  { value: 'IsNull', label: 'Is Null', requiresValue: false },
  { value: 'IsNotNull', label: 'Is Not Null', requiresValue: false },
]

const FIELD_TYPES: FieldType[] = [
  'Text', 'Number', 'Boolean', 'DateTime', 'Choice', 'Lookup', 'User', 'URL'
]

/* ───────────── XML Generator ───────────── */

function generateConditionXml(cond: QueryCondition): string {
  const { fieldRef, fieldType, operator, value } = cond
  const indent = '      '
  
  if (operator === 'IsNull' || operator === 'IsNotNull') {
    return `${indent}<${operator}>\n${indent}  <FieldRef Name="${fieldRef}" />\n${indent}</${operator}>`
  }

  return `${indent}<${operator}>\n${indent}  <FieldRef Name="${fieldRef}" />\n${indent}  <Value Type="${fieldType}">${value}</Value>\n${indent}</${operator}>`
}

// Recursive function to build nested And/Or
function buildNestedJoins(conditions: QueryCondition[], joinType: LogicalJoin): string {
  if (conditions.length === 0) return ''
  if (conditions.length === 1) return generateConditionXml(conditions[0])

  // Get the last condition
  const lastCond = conditions[conditions.length - 1]
  const lastXml = generateConditionXml(lastCond)
  
  // Recursively build the rest
  const remaining = conditions.slice(0, conditions.length - 1)
  const nestedXml = buildNestedJoins(remaining, joinType)

  // We have to add indents dynamically based on depth, but for simplicity here we just wrap
  // A proper XML formatter can clean it up later.
  return `    <${joinType}>\n${nestedXml}\n${lastXml}\n    </${joinType}>`
}

function generateCamlXml(conditions: QueryCondition[], joinType: LogicalJoin, viewFields: string[], rowLimit?: string): string {
  let whereXml = ''
  if (conditions.length > 0) {
    if (conditions.length === 1) {
      whereXml = `    <Where>\n${generateConditionXml(conditions[0])}\n    </Where>`
    } else {
      whereXml = `    <Where>\n${buildNestedJoins(conditions, joinType)}\n    </Where>`
    }
  }

  let viewFieldsXml = ''
  if (viewFields.length > 0) {
    const fields = viewFields.map(f => `      <FieldRef Name="${f}" />`).join('\n')
    viewFieldsXml = `    <ViewFields>\n${fields}\n    </ViewFields>`
  }

  let rowLimitXml = ''
  if (rowLimit && rowLimit.trim() !== '') {
    rowLimitXml = `    <RowLimit>${rowLimit}</RowLimit>`
  }

  const parts = [whereXml, viewFieldsXml, rowLimitXml].filter(Boolean)
  const innerXml = parts.length > 0 ? `\n${parts.join('\n')}\n  ` : ''

  return `<View>\n  <Query>${innerXml}</Query>\n</View>`
}

/* ───────────── Component ───────────── */

export default function CamlQueryBuilder() {
  const [conditions, setConditions] = useState<QueryCondition[]>([
    { id: '1', fieldRef: 'Title', fieldType: 'Text', operator: 'Eq', value: '' }
  ])
  const [joinType, setJoinType] = useState<LogicalJoin>('And')
  const [viewFieldsStr, setViewFieldsStr] = useState('')
  const [rowLimit, setRowLimit] = useState('')
  const [xmlOutput, setXmlOutput] = useState('')
  const [copied, setCopied] = useState(false)

  // Update XML whenever state changes
  useEffect(() => {
    const viewFields = viewFieldsStr
      .split(',')
      .map(f => f.trim())
      .filter(f => f.length > 0)
    
    // Filter out empty 'FieldRef' to prevent invalid XML
    const validConditions = conditions.filter(c => c.fieldRef.trim() !== '')
    
    setXmlOutput(generateCamlXml(validConditions, joinType, viewFields, rowLimit))
  }, [conditions, joinType, viewFieldsStr, rowLimit])

  const addCondition = () => {
    setConditions([
      ...conditions,
      { id: Date.now().toString(), fieldRef: '', fieldType: 'Text', operator: 'Eq', value: '' }
    ])
  }

  const updateCondition = (id: string, updates: Partial<QueryCondition>) => {
    setConditions(conditions.map(c => c.id === id ? { ...c, ...updates } : c))
  }

  const removeCondition = (id: string) => {
    setConditions(conditions.filter(c => c.id !== id))
  }

  const handleCopy = async () => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'copy_clicked', { tool_name: 'caml_query_builder' })
    }
    try {
      await navigator.clipboard.writeText(xmlOutput)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = xmlOutput
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const trackToolUsage = () => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'tool_used', { 
        tool_name: 'caml_query_builder',
        conditions_count: conditions.length,
        join_type: joinType 
      })
    }
  }

  return (
    <>
      <SEO
        title="SharePoint CAML Query Builder — Free Online Tool"
        description="Build and generate SharePoint XML CAML queries visually. Setup filters, ViewFields, RowLimits and 'And/Or' nested conditions instantly. No login required."
        url="/tools/caml-query-builder"
        type="webapp"
      />

      <div className="container">
        <div className="tool-page glass-panel reveal-stagger">
          <nav className="tool-breadcrumb">
            <Link to="/tools">Tools</Link>
            <span className="tool-breadcrumb__sep">/</span>
            <span>CAML Query Builder</span>
          </nav>

          <header className="tool-header">
            <div className="tool-header__icon">🔍</div>
            <h1 className="tool-header__title">SharePoint CAML Query Builder</h1>
            <p className="tool-header__desc">
              Construct XML CAML Queries visually for SharePoint REST APIs, PnP JS, 
              CSOM, or SPFx. Add conditions, select fields, and generate the raw XML instantly.
            </p>
          </header>

          <div className="tool-grid-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)', gap: '2rem', alignItems: 'start', marginTop: '2rem' }}>
            
            {/* Editor Side */}
            <div className="caml-editor-side">
              
              {/* Conditions Section */}
              <div className="tool-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 className="tool-section__label" style={{ margin: 0 }}>Query Conditions (&lt;Where&gt;)</h2>
                  {conditions.length > 1 && (
                    <div className="segmented-control" style={{ marginBottom: 0 }}>
                      <button 
                        className={`segment-btn ${joinType === 'And' ? 'segment-btn--active' : ''}`}
                        onClick={() => { setJoinType('And'); trackToolUsage(); }}
                        style={{ padding: '0.25rem 0.75rem', fontSize: '13px' }}
                      >AND</button>
                      <button 
                        className={`segment-btn ${joinType === 'Or' ? 'segment-btn--active' : ''}`}
                        onClick={() => { setJoinType('Or'); trackToolUsage(); }}
                        style={{ padding: '0.25rem 0.75rem', fontSize: '13px' }}
                      >OR</button>
                    </div>
                  )}
                </div>

                <div className="caml-conditions-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {conditions.map((cond, index) => (
                    <div key={cond.id} className="caml-condition-row glass-card" style={{ padding: '0.75rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      {conditions.length > 1 && (
                        <div style={{ display: 'flex', alignItems: 'center', height: '36px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', width: '24px', flexShrink: 0 }}>
                            {index === 0 ? '' : joinType}
                          </span>
                        </div>
                      )}
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', flex: 1, alignItems: 'center' }}>
                        
                        <div className="form-group" style={{ flex: '1 1 100px', marginBottom: 0 }}>
                          <input 
                            type="text" 
                            placeholder="FieldRef (e.g. Title)" 
                            value={cond.fieldRef}
                            onChange={(e) => updateCondition(cond.id, { fieldRef: e.target.value })}
                            className="form-input"
                            style={{ padding: '0.4rem 0.5rem', fontSize: '13px', width: '100%', height: '36px' }}
                          />
                        </div>

                        <div className="form-group" style={{ flex: '1 1 100px', marginBottom: 0 }}>
                          <select 
                            value={cond.fieldType}
                            onChange={(e) => updateCondition(cond.id, { fieldType: e.target.value as FieldType })}
                            className="form-input"
                            style={{ padding: '0.4rem 0.5rem', fontSize: '13px', width: '100%', height: '36px' }}
                          >
                            {FIELD_TYPES.map(ft => <option key={ft} value={ft}>{ft}</option>)}
                          </select>
                        </div>

                        <div className="form-group" style={{ flex: '1 1 110px', marginBottom: 0 }}>
                          <select 
                            value={cond.operator}
                            onChange={(e) => updateCondition(cond.id, { operator: e.target.value as CamlOperator })}
                            className="form-input"
                            style={{ padding: '0.4rem 0.5rem', fontSize: '13px', width: '100%', height: '36px' }}
                          >
                            {OPERATORS.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
                          </select>
                        </div>

                        {OPERATORS.find(o => o.value === cond.operator)?.requiresValue && (
                          <div className="form-group" style={{ flex: '1 1 100px', marginBottom: 0 }}>
                            <input 
                              type="text" 
                              placeholder="Value" 
                              value={cond.value}
                              onChange={(e) => updateCondition(cond.id, { value: e.target.value })}
                              className="form-input"
                              style={{ padding: '0.4rem 0.5rem', fontSize: '13px', width: '100%', height: '36px' }}
                            />
                          </div>
                        )}

                        <button 
                          onClick={() => removeCondition(cond.id)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0', opacity: conditions.length === 1 ? 0.3 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', flex: '0 0 24px', height: '36px' }}
                          disabled={conditions.length === 1}
                          title="Remove Condition"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => { addCondition(); trackToolUsage(); }}
                  className="tool-generate-btn"
                  style={{ marginTop: '1rem', padding: '0.5rem 1rem', width: 'auto', display: 'inline-flex', background: 'var(--bg-secondary)', color: 'var(--text)', border: '1px solid var(--border)' }}
                >
                  <span className="tool-generate-btn__icon">➕</span> Add Condition
                </button>
              </div>

              {/* View Configuration Section */}
              <div className="tool-section">
                <h2 className="tool-section__label">View Configuration</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px' }}>ViewFields (Comma separated)</label>
                    <input 
                      type="text" 
                      placeholder="Title, Modified, Author" 
                      value={viewFieldsStr}
                      onChange={(e) => setViewFieldsStr(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px' }}>RowLimit</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 100" 
                      value={rowLimit}
                      onChange={(e) => setRowLimit(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Preview Side */}
            <div className="caml-preview-side" style={{ position: 'sticky', top: '5rem' }}>
              <div className="formatter-preview-wrapper" style={{ margin: 0, height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h2 className="tool-section__label" style={{ margin: 0 }}>Generated XML</h2>
                  <button 
                    onClick={handleCopy}
                    className={`formatter-action-btn ${copied ? 'formatter-action-btn--success' : ''}`}
                    style={{ padding: '0.3rem 0.8rem', fontSize: '13px' }}
                  >
                    {copied ? '✓ Copied' : '📋 Copy XML'}
                  </button>
                </div>
                
                <div className="formatter-editor" style={{ height: '400px', backgroundColor: '#1e1e1e' }}>
                  <textarea 
                    readOnly
                    value={xmlOutput}
                    className="formatter-textarea"
                    style={{ whiteSpace: 'pre', color: '#d4d4d4', fontFamily: 'monospace' }}
                  />
                </div>
              </div>
            </div>

          </div>

          <section className="tool-info" style={{ marginTop: '4rem' }}>
            <h2>What is CAML?</h2>
            <p>
              <strong>CAML (Collaborative Application Markup Language)</strong> is an XML-based language used in SharePoint to query lists and libraries. It's often required when fetching items using the CSOM, SSOM, or specific REST endpoints (like <code>GetItems(query)</code>).
            </p>
            <h3>Common Use Cases</h3>
            <ul>
              <li>Fetching list items with complex <code>Or</code> / <code>And</code> logic.</li>
              <li>Performing efficient server-side filtering and ordering natively before data is sent to the client.</li>
              <li>Limiting the response size manually using <code>&lt;RowLimit&gt;</code> and <code>&lt;ViewFields&gt;</code>.</li>
            </ul>
          </section>

          <RelatedTools currentSlug="caml-query-builder" />
        </div>
      </div>
    </>
  )
}
