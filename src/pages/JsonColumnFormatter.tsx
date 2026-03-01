import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

/* ───────────── Templates ───────────── */
interface Template {
  name: string
  description: string
  json: object
  sampleValues: string[]
}

const TEMPLATES: Template[] = [
  {
    name: 'Status Icons',
    description: 'Show colored icons based on status text (Done, In Progress, Blocked)',
    json: {
      "$schema": "https://columnformatting.sharepointpnp.com/columnFormattingSchema.json",
      "elmType": "div",
      "style": {
        "display": "flex",
        "align-items": "center",
        "gap": "6px"
      },
      "children": [
        {
          "elmType": "span",
          "txtContent": "=if(@currentField == 'Done', '✅', if(@currentField == 'In Progress', '🔄', if(@currentField == 'Blocked', '🚫', '⬜')))",
          "style": { "font-size": "16px" }
        },
        {
          "elmType": "span",
          "txtContent": "@currentField",
          "style": {
            "color": "=if(@currentField == 'Done', '#10b981', if(@currentField == 'In Progress', '#f59e0b', if(@currentField == 'Blocked', '#ef4444', '#94a3b8')))",
            "font-weight": "600"
          }
        }
      ]
    },
    sampleValues: ['Done', 'In Progress', 'Blocked', 'Not Started'],
  },
  {
    name: 'Progress Bar',
    description: 'Render a colored progress bar from a percentage value (0–100)',
    json: {
      "$schema": "https://columnformatting.sharepointpnp.com/columnFormattingSchema.json",
      "elmType": "div",
      "style": {
        "width": "100%",
        "height": "20px",
        "background-color": "#e5e7eb",
        "border-radius": "10px",
        "overflow": "hidden",
        "position": "relative"
      },
      "children": [
        {
          "elmType": "div",
          "style": {
            "width": "=@currentField + '%'",
            "height": "100%",
            "background-color": "=if(@currentField >= 80, '#10b981', if(@currentField >= 50, '#f59e0b', '#ef4444'))",
            "border-radius": "10px",
            "transition": "width 0.3s ease"
          }
        },
        {
          "elmType": "span",
          "txtContent": "=@currentField + '%'",
          "style": {
            "position": "absolute",
            "top": "0",
            "left": "0",
            "right": "0",
            "text-align": "center",
            "font-size": "11px",
            "line-height": "20px",
            "font-weight": "700",
            "color": "#1e293b"
          }
        }
      ]
    },
    sampleValues: ['25', '50', '75', '100'],
  },
  {
    name: 'Due Date Highlight',
    description: 'Highlight dates red when overdue, yellow when due soon, green when future',
    json: {
      "$schema": "https://columnformatting.sharepointpnp.com/columnFormattingSchema.json",
      "elmType": "div",
      "style": {
        "padding": "4px 12px",
        "border-radius": "12px",
        "display": "inline-flex",
        "align-items": "center",
        "gap": "4px",
        "background-color": "=if(@currentField <= @now, '#fef2f2', if(@currentField <= @now + 604800000, '#fffbeb', '#f0fdf4'))",
        "color": "=if(@currentField <= @now, '#dc2626', if(@currentField <= @now + 604800000, '#d97706', '#16a34a'))",
        "font-weight": "600",
        "font-size": "13px"
      },
      "children": [
        {
          "elmType": "span",
          "txtContent": "=if(@currentField <= @now, '⚠️', if(@currentField <= @now + 604800000, '⏳', '✅'))"
        },
        {
          "elmType": "span",
          "txtContent": "@currentField"
        }
      ]
    },
    sampleValues: ['2024-01-01', '2026-03-05', '2026-12-31', '2025-06-15'],
  },
  {
    name: 'Yes / No Badge',
    description: 'Render a styled pill badge for boolean Yes/No fields',
    json: {
      "$schema": "https://columnformatting.sharepointpnp.com/columnFormattingSchema.json",
      "elmType": "div",
      "style": {
        "display": "inline-flex",
        "align-items": "center",
        "gap": "4px",
        "padding": "2px 10px",
        "border-radius": "12px",
        "font-weight": "600",
        "font-size": "13px",
        "background-color": "=if(@currentField == 'Yes', '#dcfce7', '#fee2e2')",
        "color": "=if(@currentField == 'Yes', '#166534', '#991b1b')"
      },
      "children": [
        {
          "elmType": "span",
          "txtContent": "=if(@currentField == 'Yes', '✓', '✕')",
          "style": { "font-weight": "700" }
        },
        {
          "elmType": "span",
          "txtContent": "@currentField"
        }
      ]
    },
    sampleValues: ['Yes', 'No', 'Yes', 'No'],
  },
  {
    name: 'Conditional Background',
    description: 'Color the entire cell background based on priority (High, Medium, Low)',
    json: {
      "$schema": "https://columnformatting.sharepointpnp.com/columnFormattingSchema.json",
      "elmType": "div",
      "style": {
        "padding": "6px 14px",
        "border-radius": "6px",
        "font-weight": "600",
        "font-size": "13px",
        "text-align": "center",
        "background-color": "=if(@currentField == 'High', '#fef2f2', if(@currentField == 'Medium', '#fffbeb', '#f0fdf4'))",
        "color": "=if(@currentField == 'High', '#dc2626', if(@currentField == 'Medium', '#d97706', '#16a34a'))",
        "border": "=if(@currentField == 'High', '1px solid #fecaca', if(@currentField == 'Medium', '1px solid #fde68a', '1px solid #bbf7d0'))"
      },
      "txtContent": "@currentField"
    },
    sampleValues: ['High', 'Medium', 'Low', 'Medium'],
  },
  {
    name: 'Trending Arrows',
    description: 'Show up/down/flat trend arrows based on text (Up, Down, Flat)',
    json: {
      "$schema": "https://columnformatting.sharepointpnp.com/columnFormattingSchema.json",
      "elmType": "div",
      "style": {
        "display": "flex",
        "align-items": "center",
        "gap": "6px"
      },
      "children": [
        {
          "elmType": "span",
          "txtContent": "=if(@currentField == 'Up', '▲', if(@currentField == 'Down', '▼', '▶'))",
          "style": {
            "color": "=if(@currentField == 'Up', '#10b981', if(@currentField == 'Down', '#ef4444', '#94a3b8'))",
            "font-size": "14px",
            "font-weight": "700"
          }
        },
        {
          "elmType": "span",
          "txtContent": "@currentField",
          "style": {
            "color": "=if(@currentField == 'Up', '#10b981', if(@currentField == 'Down', '#ef4444', '#94a3b8'))",
            "font-weight": "600"
          }
        }
      ]
    },
    sampleValues: ['Up', 'Down', 'Flat', 'Up'],
  },
]

/* ───────────── Helpers ───────────── */

function validateJson(text: string): { valid: boolean; error?: string } {
  if (!text.trim()) return { valid: true }
  try {
    JSON.parse(text)
    return { valid: true }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Invalid JSON'
    return { valid: false, error: msg }
  }
}

function beautify(text: string): string {
  try {
    return JSON.stringify(JSON.parse(text), null, 2)
  } catch {
    return text
  }
}

function minify(text: string): string {
  try {
    return JSON.stringify(JSON.parse(text))
  } catch {
    return text
  }
}

/* ─── Simple SP expression evaluator (for preview) ─── */
const CF_PLACEHOLDER = '\x00CF\x00' // unique sentinel that won't appear in real expressions

function evalExpression(expr: string, currentField: string): string {
  if (typeof expr !== 'string') return String(expr)

  // Non-expression: just replace @currentField literally
  if (!expr.startsWith('=')) {
    return expr.replace(/@currentField/g, currentField)
  }

  const raw = expr.slice(1).trim()
  // Replace @currentField with a safe placeholder
  const withField = raw.replace(/@currentField/g, CF_PLACEHOLDER)
  // Replace @now with current timestamp
  const withNow = withField.replace(/@now/g, String(Date.now()))

  return evalIf(withNow, currentField)
}

function evalIf(expr: string, currentField: string): string {
  const trimmed = expr.trim()
  // Simple if(cond, trueVal, falseVal) parser
  const ifMatch = trimmed.match(/^if\s*\(/)
  if (!ifMatch) {
    return evalSimple(trimmed, currentField)
  }

  // Parse the if arguments manually (handling nested if)
  const inner = trimmed.slice(trimmed.indexOf('(') + 1)
  const args = splitIfArgs(inner)
  if (args.length < 3) return trimmed

  const cond = args[0].trim()
  const trueVal = args[1].trim()
  const falseVal = args[2].trim()

  const condResult = evalCondition(cond, currentField)
  const chosen = condResult ? trueVal : falseVal

  // Recursively evaluate chosen branch (it might be another if())
  return evalIf(chosen, currentField)
}

function splitIfArgs(str: string): string[] {
  const args: string[] = []
  let depth = 0
  let current = ''
  let inString = false
  let stringChar = ''
  for (let i = 0; i < str.length; i++) {
    const ch = str[i]
    // Track string boundaries
    if ((ch === "'" || ch === '"') && !inString) {
      inString = true
      stringChar = ch
    } else if (ch === stringChar && inString) {
      inString = false
    }

    if (!inString) {
      if (ch === '(') depth++
      if (ch === ')') {
        if (depth === 0) {
          args.push(current)
          break
        }
        depth--
      }
      if (ch === ',' && depth === 0) {
        args.push(current)
        current = ''
        continue
      }
    }
    current += ch
  }
  return args
}

function evalCondition(cond: string, currentField: string): boolean {
  // Handle == comparison
  const eqMatch = cond.match(/^(.+?)\s*==\s*(.+)$/)
  if (eqMatch) {
    const left = evalSimple(eqMatch[1].trim(), currentField)
    const right = evalSimple(eqMatch[2].trim(), currentField)
    return left === right
  }
  // Handle <= comparison
  const leMatch = cond.match(/^(.+?)\s*<=\s*(.+)$/)
  if (leMatch) {
    const left = parseFloat(evalSimple(leMatch[1].trim(), currentField))
    const right = parseFloat(evalSimple(leMatch[2].trim(), currentField))
    if (!isNaN(left) && !isNaN(right)) return left <= right
  }
  // Handle >= comparison
  const geMatch = cond.match(/^(.+?)\s*>=\s*(.+)$/)
  if (geMatch) {
    const left = parseFloat(evalSimple(geMatch[1].trim(), currentField))
    const right = parseFloat(evalSimple(geMatch[2].trim(), currentField))
    if (!isNaN(left) && !isNaN(right)) return left >= right
  }
  return false
}

function evalSimple(expr: string, currentField: string): string {
  const trimmed = expr.trim()

  // Handle placeholder → return the actual currentField value
  if (trimmed === CF_PLACEHOLDER) return currentField

  // Remove surrounding quotes
  if ((trimmed.startsWith("'") && trimmed.endsWith("'")) ||
      (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
    return trimmed.slice(1, -1)
  }
  // Handle string concatenation with +
  if (trimmed.includes(' + ')) {
    const parts = trimmed.split(/\s*\+\s*/)
    return parts.map(p => evalSimple(p, currentField)).join('')
  }
  // Handle arithmetic addition (for @now + number)
  if (/^\d+\s*\+\s*\d+$/.test(trimmed)) {
    const parts = trimmed.split(/\s*\+\s*/)
    return String(Number(parts[0]) + Number(parts[1]))
  }
  // Replace any remaining placeholders in mixed content
  return trimmed.replace(new RegExp(CF_PLACEHOLDER.replace(/\0/g, '\\0'), 'g'), currentField)
}

/* ─── Preview renderer ─── */
function resolveStyle(
  styleDef: Record<string, string> | undefined,
  currentField: string
): React.CSSProperties {
  if (!styleDef) return {}
  const result: Record<string, string> = {}
  for (const [key, val] of Object.entries(styleDef)) {
    result[camelCase(key)] = evalExpression(String(val), currentField)
  }
  return result as unknown as React.CSSProperties
}

function camelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

interface SpNode {
  elmType: string
  txtContent?: string
  style?: Record<string, string>
  children?: SpNode[]
  attributes?: Record<string, string>
}

function renderSpNode(node: SpNode, currentField: string, key: number): React.ReactNode {
  if (!node || !node.elmType) return null
  const tagName = node.elmType
  const style = resolveStyle(node.style, currentField)
  const text = node.txtContent ? evalExpression(node.txtContent, currentField) : undefined

  const attrs: Record<string, unknown> = {}
  if (node.attributes) {
    for (const [k, v] of Object.entries(node.attributes)) {
      attrs[k] = evalExpression(v, currentField)
    }
  }

  const childNodes: React.ReactNode[] = []
  if (text) childNodes.push(text)
  if (node.children) {
    node.children.forEach((child, i) => {
      childNodes.push(renderSpNode(child, currentField, i))
    })
  }

  return React.createElement(tagName, { key, style, ...attrs }, ...childNodes)
}

/* ────────────────────────────────────
   Main Component
   ──────────────────────────────────── */

export default function JsonColumnFormatter() {
  const [json, setJson] = useState(() => JSON.stringify(TEMPLATES[0].json, null, 2))
  const [selectedTemplate, setSelectedTemplate] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [lineCount, setLineCount] = useState(1)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumRef = useRef<HTMLDivElement>(null)

  // Validate on every change
  useEffect(() => {
    const result = validateJson(json)
    setError(result.valid ? null : result.error || null)
    setLineCount(json.split('\n').length)
  }, [json])

  // Sync line-number scroll with textarea
  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumRef.current) {
      lineNumRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }, [])

  const applyTemplate = (index: number) => {
    setSelectedTemplate(index)
    setJson(JSON.stringify(TEMPLATES[index].json, null, 2))
  }

  const handleFormat = () => setJson(beautify(json))
  const handleMinify = () => setJson(minify(json))

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(json)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = json
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  const handleReset = () => {
    setJson(JSON.stringify(TEMPLATES[selectedTemplate].json, null, 2))
  }

  // Build preview
  let parsedJson: SpNode | null = null
  try {
    parsedJson = JSON.parse(json)
  } catch {
    parsedJson = null
  }

  const sampleValues = TEMPLATES[selectedTemplate]?.sampleValues || ['Sample']

  return (
    <>
      <SEO
        title="JSON Column Formatter — SharePoint Column Formatting Editor"
        description="Write, validate, and preview SharePoint JSON column formatting with built-in templates and a live preview. Free, browser-based, no login required."
        url="/tools/json-column-formatter"
      />

      <div className="container">
        <div className="tool-page reveal-stagger">
          {/* Breadcrumb */}
          <nav className="tool-breadcrumb">
            <Link to="/tools">Tools</Link>
            <span className="tool-breadcrumb__sep">/</span>
            <span>JSON Column Formatter</span>
          </nav>

          {/* Header */}
          <header className="tool-header">
            <div className="tool-header__icon">🎨</div>
            <h1 className="tool-header__title">JSON Column Formatter</h1>
            <p className="tool-header__desc">
              Write, validate, and preview SharePoint JSON column formatting with
              built-in templates. 100% client-side — nothing leaves your browser.
            </p>
          </header>

          {/* Template Picker */}
          <div className="tool-section">
            <h2 className="tool-section__label">Template</h2>
            <div className="formatter-templates">
              {TEMPLATES.map((tpl, i) => (
                <button
                  key={tpl.name}
                  className={`formatter-template-btn ${selectedTemplate === i ? 'formatter-template-btn--active' : ''}`}
                  onClick={() => applyTemplate(i)}
                  title={tpl.description}
                >
                  {tpl.name}
                </button>
              ))}
            </div>
            <p className="formatter-template-hint">
              {TEMPLATES[selectedTemplate].description}
            </p>
          </div>

          {/* Actions Toolbar */}
          <div className="formatter-actions">
            <button className="formatter-action-btn" onClick={handleFormat} title="Beautify JSON">
              ✨ Format
            </button>
            <button className="formatter-action-btn" onClick={handleMinify} title="Minify JSON">
              📦 Minify
            </button>
            <button
              className={`formatter-action-btn ${copied ? 'formatter-action-btn--success' : ''}`}
              onClick={handleCopy}
              title="Copy to Clipboard"
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
            <button className="formatter-action-btn formatter-action-btn--danger" onClick={handleReset} title="Reset to template">
              ↺ Reset
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="formatter-error">
              <span className="formatter-error__icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Editor + Preview Layout */}
          <div className="formatter-layout">
            {/* Editor */}
            <div className="formatter-editor-wrapper">
              <h2 className="tool-section__label">JSON Editor</h2>
              <div className="formatter-editor">
                <div className="formatter-line-numbers" ref={lineNumRef}>
                  {Array.from({ length: lineCount }, (_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </div>
                <textarea
                  ref={textareaRef}
                  className="formatter-textarea"
                  value={json}
                  onChange={(e) => setJson(e.target.value)}
                  onScroll={handleScroll}
                  spellCheck={false}
                  id="json-editor-textarea"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="formatter-preview-wrapper">
              <h2 className="tool-section__label">Live Preview</h2>
              <div className="formatter-preview">
                {/* Mock SP table */}
                <div className="sp-table">
                  <div className="sp-table__header">
                    <div className="sp-table__header-cell">Title</div>
                    <div className="sp-table__header-cell sp-table__header-cell--formatted">
                      Formatted Column
                    </div>
                  </div>
                  {sampleValues.map((val, i) => (
                    <div key={i} className="sp-table__row">
                      <div className="sp-table__cell">Item {i + 1}</div>
                      <div className="sp-table__cell sp-table__cell--formatted">
                        {parsedJson ? (
                          renderSpNode(parsedJson, val, 0)
                        ) : (
                          <span className="sp-table__cell--raw">{val}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <section className="tool-info">
            <h2>What is SharePoint JSON Column Formatting?</h2>
            <p>
              <strong>JSON column formatting</strong> lets you customize how columns
              in SharePoint lists and libraries are displayed. Instead of building
              custom SPFx solutions, you can apply a JSON object to change colors,
              icons, layouts, and conditional styling — all without writing any code.
            </p>
            <h3>How to Apply Column Formatting</h3>
            <ul>
              <li>
                <strong>Open your SharePoint list</strong> and click the column header
                you want to format
              </li>
              <li>
                Select <strong>Column settings → Format this column</strong>
              </li>
              <li>
                Click <strong>Advanced mode</strong> to switch to the JSON editor
              </li>
              <li>
                <strong>Paste</strong> the JSON from this tool and click <strong>Save</strong>
              </li>
            </ul>
            <h3>Key Properties</h3>
            <ul>
              <li>
                <code>elmType</code> — the HTML element type
                (<code>div</code>, <code>span</code>, <code>a</code>, <code>img</code>, <code>button</code>)
              </li>
              <li>
                <code>txtContent</code> — text to display, supports expressions
                like <code>@currentField</code>
              </li>
              <li>
                <code>style</code> — CSS properties applied to the element
              </li>
              <li>
                <code>children</code> — nested elements for complex layouts
              </li>
              <li>
                <code>attributes</code> — HTML attributes like <code>href</code>,
                <code>class</code>, <code>target</code>
              </li>
            </ul>
            <h3>Supported Expressions</h3>
            <ul>
              <li>
                <code>@currentField</code> — the value of the current column
              </li>
              <li>
                <code>@now</code> — the current date/time (as a Unix timestamp)
              </li>
              <li>
                <code>@me</code> — the current user's email
              </li>
              <li>
                <code>if(condition, trueValue, falseValue)</code> — conditional
                logic with nesting support
              </li>
            </ul>
          </section>
        </div>
      </div>
    </>
  )
}
