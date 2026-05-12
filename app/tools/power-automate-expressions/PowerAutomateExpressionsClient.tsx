'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import RelatedTools from '@/components/RelatedTools'
import AdSlot from '@/components/AdSlot'
import ToolFAQ from '@/components/ToolFAQ'

/* ── Expression Data ── */

type ExpressionCategory =
  | 'String'
  | 'Date / Time'
  | 'Collection'
  | 'Logical'
  | 'Conversion'
  | 'Math'
  | 'Referencing'

interface Expression {
  name: string
  category: ExpressionCategory
  syntax: string
  description: string
  example: string
}

const EXPRESSIONS: Expression[] = [
  // String
  { name: 'concat', category: 'String', syntax: "concat('str1', 'str2', ...)", description: 'Combines two or more strings into one.', example: "concat('Hello', ' ', 'World') → 'Hello World'" },
  { name: 'substring', category: 'String', syntax: "substring('text', startIndex, length)", description: 'Returns a portion of a string starting at the specified position.', example: "substring('Hello World', 6, 5) → 'World'" },
  { name: 'replace', category: 'String', syntax: "replace('text', 'old', 'new')", description: 'Replaces all occurrences of a substring with a new value.', example: "replace('Hello World', 'World', 'Power Automate') → 'Hello Power Automate'" },
  { name: 'toLower', category: 'String', syntax: "toLower('text')", description: 'Converts a string to all lowercase characters.', example: "toLower('HELLO') → 'hello'" },
  { name: 'toUpper', category: 'String', syntax: "toUpper('text')", description: 'Converts a string to all uppercase characters.', example: "toUpper('hello') → 'HELLO'" },
  { name: 'trim', category: 'String', syntax: "trim('text')", description: 'Removes leading and trailing whitespace from a string.', example: "trim('  hello  ') → 'hello'" },
  { name: 'indexOf', category: 'String', syntax: "indexOf('text', 'search')", description: 'Returns the starting position of a substring. Returns -1 if not found.', example: "indexOf('Hello World', 'World') → 6" },
  { name: 'startsWith', category: 'String', syntax: "startsWith('text', 'prefix')", description: 'Checks whether a string starts with the specified substring.', example: "startsWith('Hello World', 'Hello') → true" },
  { name: 'endsWith', category: 'String', syntax: "endsWith('text', 'suffix')", description: 'Checks whether a string ends with the specified substring.', example: "endsWith('Hello World', 'World') → true" },
  { name: 'split', category: 'String', syntax: "split('text', 'delimiter')", description: 'Splits a string into an array using the specified delimiter.', example: "split('a,b,c', ',') → ['a','b','c']" },
  { name: 'length', category: 'String', syntax: "length('text')", description: 'Returns the number of characters in a string or items in an array.', example: "length('Hello') → 5" },
  { name: 'guid', category: 'String', syntax: 'guid()', description: 'Generates a globally unique identifier (GUID) string.', example: "guid() → 'c2ecc88d-88c8-4096-912c-d6f2e2b138ce'" },

  // Date / Time
  { name: 'utcNow', category: 'Date / Time', syntax: "utcNow('format')", description: 'Returns the current UTC timestamp. Optionally formatted.', example: "utcNow('yyyy-MM-dd') → '2026-03-08'" },
  { name: 'formatDateTime', category: 'Date / Time', syntax: "formatDateTime('timestamp', 'format')", description: 'Formats a date/time value using the specified format string.', example: "formatDateTime('2026-03-08T10:00:00Z', 'dd/MM/yyyy') → '08/03/2026'" },
  { name: 'addDays', category: 'Date / Time', syntax: "addDays('timestamp', days, 'format')", description: 'Adds the specified number of days to a timestamp.', example: "addDays('2026-03-08', 7) → '2026-03-15'" },
  { name: 'addHours', category: 'Date / Time', syntax: "addHours('timestamp', hours, 'format')", description: 'Adds the specified number of hours to a timestamp.', example: "addHours('2026-03-08T10:00:00Z', 3) → '2026-03-08T13:00:00Z'" },
  { name: 'addMinutes', category: 'Date / Time', syntax: "addMinutes('timestamp', minutes, 'format')", description: 'Adds the specified number of minutes to a timestamp.', example: "addMinutes('2026-03-08T10:00:00Z', 30) → '2026-03-08T10:30:00Z'" },
  { name: 'convertTimeZone', category: 'Date / Time', syntax: "convertTimeZone('timestamp', 'sourceZone', 'destZone', 'format')", description: 'Converts a timestamp from one time zone to another.', example: "convertTimeZone(utcNow(), 'UTC', 'Eastern Standard Time', 'yyyy-MM-dd HH:mm')" },
  { name: 'dayOfWeek', category: 'Date / Time', syntax: "dayOfWeek('timestamp')", description: 'Returns the day of the week (0 = Sunday, 6 = Saturday).', example: "dayOfWeek('2026-03-08') → 0" },
  { name: 'dayOfMonth', category: 'Date / Time', syntax: "dayOfMonth('timestamp')", description: 'Returns the day of the month component.', example: "dayOfMonth('2026-03-08') → 8" },
  { name: 'ticks', category: 'Date / Time', syntax: "ticks('timestamp')", description: 'Returns the ticks (100-nanosecond intervals since 01/01/0001).', example: "ticks('2026-03-08T00:00:00Z') → 638793..." },

  // Collection
  { name: 'first', category: 'Collection', syntax: 'first(collection)', description: 'Returns the first item from an array or first character of a string.', example: "first(createArray(1,2,3)) → 1" },
  { name: 'last', category: 'Collection', syntax: 'last(collection)', description: 'Returns the last item from an array or last character of a string.', example: "last(createArray(1,2,3)) → 3" },
  { name: 'contains', category: 'Collection', syntax: "contains(collection, value)", description: 'Checks whether an array contains a value, or a string contains a substring.', example: "contains('Hello World', 'World') → true" },
  { name: 'empty', category: 'Collection', syntax: 'empty(collection)', description: 'Checks whether a collection, string, or object is empty.', example: "empty('') → true" },
  { name: 'join', category: 'Collection', syntax: "join(collection, 'delimiter')", description: 'Joins all items in an array into a single string with a delimiter.', example: "join(createArray('a','b','c'), ', ') → 'a, b, c'" },
  { name: 'createArray', category: 'Collection', syntax: 'createArray(item1, item2, ...)', description: 'Creates an array from the specified items.', example: "createArray(1, 2, 3) → [1, 2, 3]" },
  { name: 'union', category: 'Collection', syntax: 'union(collection1, collection2)', description: 'Returns a collection that has all items from the specified collections (no duplicates).', example: "union(createArray(1,2), createArray(2,3)) → [1,2,3]" },
  { name: 'intersection', category: 'Collection', syntax: 'intersection(collection1, collection2)', description: 'Returns a collection that has only the common items across the specified collections.', example: "intersection(createArray(1,2,3), createArray(2,3,4)) → [2,3]" },

  // Logical
  { name: 'if', category: 'Logical', syntax: "if(condition, valueIfTrue, valueIfFalse)", description: 'Returns one of two values based on whether a condition is true or false.', example: "if(equals(1,1), 'yes', 'no') → 'yes'" },
  { name: 'equals', category: 'Logical', syntax: 'equals(value1, value2)', description: 'Checks whether both values are equal. Returns true or false.', example: "equals(1, 1) → true" },
  { name: 'and', category: 'Logical', syntax: 'and(expr1, expr2)', description: 'Returns true only if all expressions are true.', example: "and(equals(1,1), equals(2,2)) → true" },
  { name: 'or', category: 'Logical', syntax: 'or(expr1, expr2)', description: 'Returns true if at least one expression is true.', example: "or(equals(1,2), equals(2,2)) → true" },
  { name: 'not', category: 'Logical', syntax: 'not(expression)', description: 'Returns the opposite boolean value.', example: "not(true) → false" },
  { name: 'greater', category: 'Logical', syntax: 'greater(value1, value2)', description: 'Returns true if the first value is greater than the second.', example: "greater(10, 5) → true" },
  { name: 'less', category: 'Logical', syntax: 'less(value1, value2)', description: 'Returns true if the first value is less than the second.', example: "less(5, 10) → true" },
  { name: 'coalesce', category: 'Logical', syntax: 'coalesce(value1, value2, ...)', description: 'Returns the first non-null value from the arguments.', example: "coalesce(null, '', 'fallback') → ''" },

  // Conversion
  { name: 'int', category: 'Conversion', syntax: "int('value')", description: 'Converts a string to an integer.', example: "int('42') → 42" },
  { name: 'float', category: 'Conversion', syntax: "float('value')", description: 'Converts a string to a floating-point number.', example: "float('3.14') → 3.14" },
  { name: 'string', category: 'Conversion', syntax: 'string(value)', description: 'Converts a value to its string representation.', example: "string(42) → '42'" },
  { name: 'bool', category: 'Conversion', syntax: "bool('value')", description: 'Converts a value to a boolean.', example: "bool(1) → true" },
  { name: 'json', category: 'Conversion', syntax: "json('jsonString')", description: 'Parses a JSON string into an object or array.', example: 'json(\'{"name":"Riz"}\') → { name: "Riz" }' },
  { name: 'base64', category: 'Conversion', syntax: "base64('value')", description: 'Encodes a string to its Base64 representation.', example: "base64('Hello') → 'SGVsbG8='" },
  { name: 'base64ToString', category: 'Conversion', syntax: "base64ToString('base64')", description: 'Decodes a Base64 string back to a plain string.', example: "base64ToString('SGVsbG8=') → 'Hello'" },
  { name: 'uriComponent', category: 'Conversion', syntax: "uriComponent('value')", description: 'Encodes a string for safe use in a URL.', example: "uriComponent('hello world') → 'hello%20world'" },

  // Math
  { name: 'add', category: 'Math', syntax: 'add(num1, num2)', description: 'Returns the sum of two numbers.', example: "add(10, 5) → 15" },
  { name: 'sub', category: 'Math', syntax: 'sub(num1, num2)', description: 'Returns the result of subtracting the second number from the first.', example: "sub(10, 5) → 5" },
  { name: 'mul', category: 'Math', syntax: 'mul(num1, num2)', description: 'Returns the product of two numbers.', example: "mul(3, 4) → 12" },
  { name: 'div', category: 'Math', syntax: 'div(num1, num2)', description: 'Returns the integer result of dividing two numbers.', example: "div(10, 3) → 3" },
  { name: 'mod', category: 'Math', syntax: 'mod(num1, num2)', description: 'Returns the remainder from dividing two numbers.', example: "mod(10, 3) → 1" },
  { name: 'min', category: 'Math', syntax: 'min(num1, num2, ...)', description: 'Returns the smallest value from a set of numbers or an array.', example: "min(1, 5, 3) → 1" },
  { name: 'max', category: 'Math', syntax: 'max(num1, num2, ...)', description: 'Returns the largest value from a set of numbers or an array.', example: "max(1, 5, 3) → 5" },
  { name: 'rand', category: 'Math', syntax: 'rand(minValue, maxValue)', description: 'Returns a random integer between the specified min (inclusive) and max (exclusive).', example: "rand(1, 100) → 42" },

  // Referencing
  { name: 'triggerBody', category: 'Referencing', syntax: 'triggerBody()', description: "Returns the trigger's body output at runtime.", example: "triggerBody()?['value'] → trigger payload" },
  { name: 'triggerOutputs', category: 'Referencing', syntax: 'triggerOutputs()', description: "Returns the trigger's output at runtime.", example: "triggerOutputs()?['headers'] → trigger headers" },
  { name: 'body', category: 'Referencing', syntax: "body('actionName')", description: "Returns an action's body output at runtime.", example: "body('Get_items')?['value'] → items array" },
  { name: 'outputs', category: 'Referencing', syntax: "outputs('actionName')", description: "Returns an action's full output at runtime.", example: "outputs('Send_email')?['statusCode'] → 200" },
  { name: 'items', category: 'Referencing', syntax: "items('loopName')", description: 'Returns the current item in an Apply to each loop.', example: "items('Apply_to_each')?['Title'] → current item title" },
  { name: 'variables', category: 'Referencing', syntax: "variables('varName')", description: 'Returns the value of a specified variable.', example: "variables('myCounter') → 5" },
  { name: 'parameters', category: 'Referencing', syntax: "parameters('paramName')", description: 'Returns a workflow parameter value.', example: "parameters('siteUrl') → 'https://contoso.sharepoint.com'" },
  { name: 'workflow', category: 'Referencing', syntax: 'workflow()', description: 'Returns details about the workflow itself at runtime.', example: "workflow()?['run']?['name'] → run ID" },
]

const CATEGORIES: ExpressionCategory[] = [
  'String',
  'Date / Time',
  'Collection',
  'Logical',
  'Conversion',
  'Math',
  'Referencing',
]

const CATEGORY_COLORS: Record<ExpressionCategory, string> = {
  'String': '#3b82f6',
  'Date / Time': '#f59e0b',
  'Collection': '#10b981',
  'Logical': '#ec4899',
  'Conversion': '#8b5cf6',
  'Math': '#06b6d4',
  'Referencing': '#ef4444',
}

export default function PowerAutomateExpressionsClient() {
  const [activeCategory, setActiveCategory] = useState<ExpressionCategory | 'All'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const filtered = useMemo(() => {
    let result = EXPRESSIONS
    if (activeCategory !== 'All') {
      result = result.filter((e) => e.category === activeCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.syntax.toLowerCase().includes(q)
      )
    }
    return result
  }, [activeCategory, searchQuery])

  const copyToClipboard = async (text: string, index: number) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'copy_clicked', { tool_name: 'power_automate_expressions', expression: text })
    }
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 1500)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 1500)
    }
  }

  return (
    <>
      <div className="container">
        <div suppressHydrationWarning className="tool-page glass-panel reveal-stagger">
          {/* Breadcrumb */}
          <nav className="tool-breadcrumb">
            <Link href="/tools">Tools</Link>
            <span className="tool-breadcrumb__sep">/</span>
            <span>Power Automate Expressions</span>
          </nav>

          {/* Header */}
          <header className="tool-header">
            <div className="tool-header__icon">⚙️</div>
            <h1 className="tool-header__title">Power Automate Expression Builder</h1>
            <p className="tool-header__desc">
              Browse, search, and copy 40+ Power Automate expressions with syntax,
              examples, and usage tips. 100% free — bookmark this page for quick reference.
            </p>
          </header>

          {/* Search */}
          <div className="tool-section">
            <div className="pa-search-wrap">
              <span className="pa-search-icon">🔍</span>
              <input
                type="text"
                className="pa-search"
                placeholder="Search expressions... (e.g. formatDateTime, concat)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="expression-search"
              />
              {searchQuery && (
                <button
                  className="pa-search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="tool-section">
            <h2 className="tool-section__label">Category</h2>
            <div className="segmented-control" style={{ flexWrap: 'wrap' }}>
              <button
                className={`segment-btn ${activeCategory === 'All' ? 'segment-btn--active' : ''}`}
                onClick={() => setActiveCategory('All')}
              >
                All ({EXPRESSIONS.length})
              </button>
              {CATEGORIES.map((cat) => {
                const count = EXPRESSIONS.filter((e) => e.category === cat).length
                return (
                  <button
                    key={cat}
                    className={`segment-btn ${activeCategory === cat ? 'segment-btn--active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat} ({count})
                  </button>
                )
              })}
            </div>
          </div>

          {/* Results Count */}
          <div className="tool-section">
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
              Showing {filtered.length} expression{filtered.length !== 1 ? 's' : ''}
              {activeCategory !== 'All' && ` in ${activeCategory}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>

          {/* Expression Cards */}
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">🔍</div>
              <h3 className="empty-state__title">No expressions found</h3>
              <p className="empty-state__text">Try a different search term or category.</p>
            </div>
          ) : (
            <div className="pa-expressions-grid">
              {filtered.map((expr, i) => (
                <div key={`${expr.name}-${i}`} className="pa-expression-card">
                  <div className="pa-expression-card__header">
                    <div className="pa-expression-card__name-row">
                      <code className="pa-expression-card__name">{expr.name}</code>
                      <span
                        className="pa-expression-card__category"
                        style={{
                          background: `${CATEGORY_COLORS[expr.category]}20`,
                          color: CATEGORY_COLORS[expr.category],
                          borderColor: `${CATEGORY_COLORS[expr.category]}40`,
                        }}
                      >
                        {expr.category}
                      </span>
                    </div>
                    <button
                      className={`tool-copy-btn ${copiedIndex === i ? 'tool-copy-btn--success' : ''}`}
                      onClick={() => copyToClipboard(expr.syntax, i)}
                      aria-label={`Copy ${expr.name} syntax`}
                      title="Copy syntax"
                    >
                      {copiedIndex === i ? '✓' : '📋'}
                    </button>
                  </div>
                  <p className="pa-expression-card__desc">{expr.description}</p>
                  <div className="pa-expression-card__syntax">
                    <span className="pa-expression-card__label">Syntax</span>
                    <code>{expr.syntax}</code>
                  </div>
                  <div className="pa-expression-card__example">
                    <span className="pa-expression-card__label">Example</span>
                    <code>{expr.example}</code>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SEO Content */}
          <section className="tool-info">
            <h2>What are Power Automate Expressions?</h2>
            <p>
              <strong>Power Automate expressions</strong> are formulas used inside Microsoft Power Automate
              (formerly Microsoft Flow) to transform data, perform calculations, and control workflow logic.
              They are similar to Excel formulas but designed for cloud-based automation.
            </p>
            <h3>When to Use Expressions</h3>
            <ul>
              <li><strong>Data transformation</strong> — format dates, manipulate strings, convert types</li>
              <li><strong>Conditional logic</strong> — use <code>if()</code>, <code>equals()</code>, <code>and()</code> to branch workflows</li>
              <li><strong>Dynamic content</strong> — reference trigger data, action outputs, and variables</li>
              <li><strong>Date arithmetic</strong> — add days, convert time zones, format timestamps</li>
              <li><strong>Collections</strong> — filter arrays, join items, check for values</li>
            </ul>
            <h3>Tips for Writing Expressions</h3>
            <ul>
              <li>Always wrap string literals in <strong>single quotes</strong>: <code>&apos;Hello&apos;</code></li>
              <li>Use the <strong>?</strong> operator for null-safe property access: <code>body(&apos;action&apos;)?[&apos;value&apos;]</code></li>
              <li>Chain functions by nesting them: <code>toLower(trim(triggerBody()?[&apos;email&apos;]))</code></li>
              <li>Use <code>coalesce()</code> to provide fallback values for potentially null fields</li>
              <li>Test expressions in a <strong>Compose</strong> action before using them in production flows</li>
            </ul>
          </section>

          <ToolFAQ slug="power-automate-expressions" />

          <AdSlot type="leaderboard" />

          <RelatedTools currentSlug="power-automate-expressions" />
        </div>
      </div>
    </>
  )
}
