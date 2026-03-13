'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import RelatedTools from '@/components/RelatedTools'
import ToolFAQ from '@/components/ToolFAQ'
import AdSlot from '@/components/AdSlot'

/* ───────────── Types ───────────── */

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

interface OperationTemplate {
  label: string
  method: HttpMethod
  pathTemplate: string
  description: string
  bodyTemplate?: string
  requiresList: boolean
  requiresItemId: boolean
}

/* ───────────── Data ───────────── */

const OPERATIONS: OperationTemplate[] = [
  // List / Library operations
  { label: 'Get all lists', method: 'GET', pathTemplate: '/lists', description: 'Retrieve all lists and libraries in the site', requiresList: false, requiresItemId: false },
  { label: 'Get list by title', method: 'GET', pathTemplate: "/lists/getbytitle('{listTitle}')", description: 'Retrieve a specific list by its title', requiresList: true, requiresItemId: false },
  { label: 'Get list items', method: 'GET', pathTemplate: "/lists/getbytitle('{listTitle}')/items", description: 'Retrieve all items from a specific list', requiresList: true, requiresItemId: false },
  { label: 'Get single item', method: 'GET', pathTemplate: "/lists/getbytitle('{listTitle}')/items({itemId})", description: 'Retrieve a single item by its ID', requiresList: true, requiresItemId: true },
  { label: 'Create list item', method: 'POST', pathTemplate: "/lists/getbytitle('{listTitle}')/items", description: 'Create a new item in a list', requiresList: true, requiresItemId: false, bodyTemplate: '{\n  "__metadata": {\n    "type": "SP.Data.{listTitle}ListItem"\n  },\n  "Title": "New Item"\n}' },
  { label: 'Update list item', method: 'PATCH', pathTemplate: "/lists/getbytitle('{listTitle}')/items({itemId})", description: 'Update an existing list item', requiresList: true, requiresItemId: true, bodyTemplate: '{\n  "__metadata": {\n    "type": "SP.Data.{listTitle}ListItem"\n  },\n  "Title": "Updated Title"\n}' },
  { label: 'Delete list item', method: 'DELETE', pathTemplate: "/lists/getbytitle('{listTitle}')/items({itemId})", description: 'Delete a list item by its ID', requiresList: true, requiresItemId: true },
  // Fields
  { label: 'Get list fields', method: 'GET', pathTemplate: "/lists/getbytitle('{listTitle}')/fields", description: 'Retrieve all fields (columns) in a list', requiresList: true, requiresItemId: false },
  // Site operations
  { label: 'Get site info', method: 'GET', pathTemplate: '', description: 'Retrieve current site properties', requiresList: false, requiresItemId: false },
  { label: 'Get site users', method: 'GET', pathTemplate: '/siteusers', description: 'Retrieve all users in the site collection', requiresList: false, requiresItemId: false },
  { label: 'Get site groups', method: 'GET', pathTemplate: '/sitegroups', description: 'Retrieve all SharePoint groups', requiresList: false, requiresItemId: false },
  { label: 'Get content types', method: 'GET', pathTemplate: '/contenttypes', description: 'Retrieve all content types in the site', requiresList: false, requiresItemId: false },
  { label: 'Get current user', method: 'GET', pathTemplate: '/currentuser', description: 'Retrieve the currently logged-in user', requiresList: false, requiresItemId: false },
  // Files
  { label: 'Get files in folder', method: 'GET', pathTemplate: "/GetFolderByServerRelativeUrl('{folderPath}')/Files", description: 'Retrieve files from a specific folder', requiresList: false, requiresItemId: false },
  { label: 'Get folder properties', method: 'GET', pathTemplate: "/GetFolderByServerRelativeUrl('{folderPath}')", description: 'Retrieve folder properties', requiresList: false, requiresItemId: false },
]

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: '#61affe',
  POST: '#49cc90',
  PATCH: '#fca130',
  DELETE: '#f93e3e',
}

type SnippetTab = 'url' | 'fetch' | 'pnpjs' | 'powershell'

/* ───────────── Component ───────────── */

export default function RestApiBuilder() {
  const [siteUrl, setSiteUrl] = useState('https://contoso.sharepoint.com/sites/MySite')
  const [selectedOp, setSelectedOp] = useState(0)
  const [listTitle, setListTitle] = useState('Documents')
  const [itemId, setItemId] = useState('1')
  const [folderPath, setFolderPath] = useState('/sites/MySite/Shared Documents')

  // OData options
  const [selectFields, setSelectFields] = useState('')
  const [filterExpr, setFilterExpr] = useState('')
  const [expandFields, setExpandFields] = useState('')
  const [orderBy, setOrderBy] = useState('')
  const [topCount, setTopCount] = useState('')

  const [activeTab, setActiveTab] = useState<SnippetTab>('url')
  const [copied, setCopied] = useState(false)

  const op = OPERATIONS[selectedOp]

  /* ── Build the full URL ── */
  const buildUrl = useCallback(() => {
    const base = siteUrl.replace(/\/+$/, '')
    let path = op.pathTemplate
      .replace(/\{listTitle\}/g, listTitle)
      .replace(/\{itemId\}/g, itemId)
      .replace(/\{folderPath\}/g, folderPath)

    let fullUrl = `${base}/_api/web${path}`

    // OData query params
    const params: string[] = []
    if (selectFields.trim()) params.push(`$select=${selectFields.trim()}`)
    if (filterExpr.trim()) params.push(`$filter=${filterExpr.trim()}`)
    if (expandFields.trim()) params.push(`$expand=${expandFields.trim()}`)
    if (orderBy.trim()) params.push(`$orderby=${orderBy.trim()}`)
    if (topCount.trim()) params.push(`$top=${topCount.trim()}`)

    if (params.length > 0) {
      fullUrl += '?' + params.join('&')
    }

    return fullUrl
  }, [siteUrl, op, listTitle, itemId, folderPath, selectFields, filterExpr, expandFields, orderBy, topCount])

  const [generatedUrl, setGeneratedUrl] = useState('')

  useEffect(() => {
    setGeneratedUrl(buildUrl())
  }, [buildUrl])

  /* ── Build request body ── */
  const getBody = () => {
    if (!op.bodyTemplate) return ''
    return op.bodyTemplate.replace(/\{listTitle\}/g, listTitle)
  }

  /* ── Code snippets ── */
  const getSnippet = (tab: SnippetTab): string => {
    const url = generatedUrl
    const body = getBody()

    switch (tab) {
      case 'url':
        return url

      case 'fetch':
        if (op.method === 'GET') {
          return `const response = await fetch("${url}", {
  method: "GET",
  headers: {
    "Accept": "application/json;odata=verbose",
    "Authorization": "Bearer " + accessToken
  }
});

const data = await response.json();
console.log(data.d.results);`
        }
        if (op.method === 'POST') {
          return `const response = await fetch("${url}", {
  method: "POST",
  headers: {
    "Accept": "application/json;odata=verbose",
    "Content-Type": "application/json;odata=verbose",
    "Authorization": "Bearer " + accessToken,
    "X-RequestDigest": formDigestValue
  },
  body: JSON.stringify(${body})
});

const data = await response.json();
console.log(data.d);`
        }
        if (op.method === 'PATCH') {
          return `const response = await fetch("${url}", {
  method: "POST",
  headers: {
    "Accept": "application/json;odata=verbose",
    "Content-Type": "application/json;odata=verbose",
    "Authorization": "Bearer " + accessToken,
    "X-RequestDigest": formDigestValue,
    "IF-MATCH": "*",
    "X-HTTP-Method": "MERGE"
  },
  body: JSON.stringify(${body})
});

console.log("Item updated:", response.ok);`
        }
        // DELETE
        return `const response = await fetch("${url}", {
  method: "POST",
  headers: {
    "Accept": "application/json;odata=verbose",
    "Authorization": "Bearer " + accessToken,
    "X-RequestDigest": formDigestValue,
    "IF-MATCH": "*",
    "X-HTTP-Method": "DELETE"
  }
});

console.log("Item deleted:", response.ok);`

      case 'pnpjs':
        if (op.pathTemplate.includes('/items') && op.method === 'GET' && !op.requiresItemId) {
          const parts: string[] = []
          if (selectFields.trim()) parts.push(`.select(${selectFields.split(',').map(f => `"${f.trim()}"`).join(', ')})`)
          if (filterExpr.trim()) parts.push(`.filter("${filterExpr.trim()}")`)
          if (expandFields.trim()) parts.push(`.expand(${expandFields.split(',').map(f => `"${f.trim()}"`).join(', ')})`)
          if (orderBy.trim()) parts.push(`.orderBy("${orderBy.trim()}")`)
          if (topCount.trim()) parts.push(`.top(${topCount.trim()})`)
          return `import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const sp = spfi().using(SPFx(this.context));

const items = await sp.web.lists
  .getByTitle("${listTitle}")
  .items${parts.join('')}();

console.log(items);`
        }
        if (op.requiresItemId && op.method === 'GET') {
          return `import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const sp = spfi().using(SPFx(this.context));

const item = await sp.web.lists
  .getByTitle("${listTitle}")
  .items.getById(${itemId})();

console.log(item);`
        }
        if (op.method === 'POST' && op.pathTemplate.includes('/items')) {
          return `import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const sp = spfi().using(SPFx(this.context));

const result = await sp.web.lists
  .getByTitle("${listTitle}")
  .items.add({
    Title: "New Item"
  });

console.log("Created:", result);`
        }
        if (op.method === 'PATCH') {
          return `import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const sp = spfi().using(SPFx(this.context));

await sp.web.lists
  .getByTitle("${listTitle}")
  .items.getById(${itemId})
  .update({
    Title: "Updated Title"
  });

console.log("Item updated");`
        }
        if (op.method === 'DELETE') {
          return `import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const sp = spfi().using(SPFx(this.context));

await sp.web.lists
  .getByTitle("${listTitle}")
  .items.getById(${itemId})
  .delete();

console.log("Item deleted");`
        }
        return `// PnPjs snippet not available for this operation.\n// Use the URL tab and fetch() instead.`

      case 'powershell':
        if (op.method === 'GET') {
          const odataParams: string[] = []
          if (selectFields.trim()) odataParams.push(`'$select' = '${selectFields.trim()}'`)
          if (filterExpr.trim()) odataParams.push(`'$filter' = '${filterExpr.trim()}'`)
          if (topCount.trim()) odataParams.push(`'$top' = '${topCount.trim()}'`)
          const queryStr = odataParams.length > 0 ? `\n\n$queryParams = @{\n  ${odataParams.join('\n  ')}\n}\n$queryString = ($queryParams.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" }) -join '&'` : ''
          const urlPart = odataParams.length > 0 ? '"$siteUrl/_api/web' + op.pathTemplate.replace(/\{listTitle\}/g, listTitle).replace(/\{itemId\}/g, itemId).replace(/\{folderPath\}/g, folderPath) + '?$queryString"' : '"$siteUrl/_api/web' + op.pathTemplate.replace(/\{listTitle\}/g, listTitle).replace(/\{itemId\}/g, itemId).replace(/\{folderPath\}/g, folderPath) + '"'
          return `Connect-PnPOnline -Url "${siteUrl}" -Interactive
${queryStr}
$response = Invoke-PnPSPRestMethod -Method Get -Url ${urlPart}

$response.value | Format-Table`
        }
        if (op.method === 'POST') {
          return `Connect-PnPOnline -Url "${siteUrl}" -Interactive

$body = @{
  "__metadata" = @{ "type" = "SP.Data.${listTitle}ListItem" }
  "Title" = "New Item"
} | ConvertTo-Json

Invoke-PnPSPRestMethod -Method Post \\
  -Url "$siteUrl/_api/web/lists/getbytitle('${listTitle}')/items" \\
  -Content $body \\
  -ContentType "application/json;odata=verbose"`
        }
        return `Connect-PnPOnline -Url "${siteUrl}" -Interactive

# Use PnP cmdlets for ${op.method} operations:
# Remove-PnPListItem, Set-PnPListItem, etc.
# Example:
# Set-PnPListItem -List "${listTitle}" -Identity ${itemId} -Values @{"Title" = "Updated"}
# Remove-PnPListItem -List "${listTitle}" -Identity ${itemId} -Force`

      default:
        return ''
    }
  }

  /* ── Copy ── */
  const handleCopy = async () => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'copy_clicked', { tool_name: 'rest_api_builder', tab: activeTab })
    }
    const text = getSnippet(activeTab)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const TABS: { key: SnippetTab; label: string }[] = [
    { key: 'url', label: 'URL' },
    { key: 'fetch', label: 'JavaScript' },
    { key: 'pnpjs', label: 'PnPjs' },
    { key: 'powershell', label: 'PowerShell' },
  ]

  return (
    <>

      <div className="container">
        <div suppressHydrationWarning className="tool-page glass-panel reveal-stagger">
          <nav className="tool-breadcrumb">
            <Link href="/tools">Tools</Link>
            <span className="tool-breadcrumb__sep">/</span>
            <span>REST API Builder</span>
          </nav>

          <header className="tool-header">
            <div className="tool-header__icon">⚡</div>
            <h1 className="tool-header__title">SharePoint REST API Builder</h1>
            <p className="tool-header__desc">
              Build SharePoint REST API URLs visually — pick an operation, configure OData parameters,
              and copy code snippets in JavaScript, PnPjs, or PowerShell.
            </p>
          </header>

          <div className="tool-grid-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)', gap: '2rem', alignItems: 'start', marginTop: '2rem' }}>

            {/* Left: Configuration */}
            <div className="rest-builder-config">

              {/* Site URL */}
              <div className="tool-section">
                <h2 className="tool-section__label">Site URL</h2>
                <input
                  type="text"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  className="form-input"
                  placeholder="https://contoso.sharepoint.com/sites/MySite"
                />
              </div>

              {/* Operation */}
              <div className="tool-section">
                <h2 className="tool-section__label">Operation</h2>
                <div className="rest-operations-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                  {OPERATIONS.map((o, i) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedOp(i); setCopied(false) }}
                      className={`rest-operation-btn ${i === selectedOp ? 'rest-operation-btn--active' : ''}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)',
                        background: i === selectedOp ? 'var(--accent-bg)' : 'var(--bg-secondary)',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease',
                      }}
                    >
                      <span style={{
                        fontSize: '11px', fontWeight: 700, fontFamily: 'monospace',
                        padding: '2px 6px', borderRadius: '4px',
                        color: '#fff', backgroundColor: METHOD_COLORS[o.method],
                        minWidth: '52px', textAlign: 'center',
                      }}>{o.method}</span>
                      <span style={{ fontSize: '13px', color: 'var(--text)', fontWeight: i === selectedOp ? 600 : 400 }}>{o.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic params */}
              {(op.requiresList || op.pathTemplate.includes('{folderPath}')) && (
                <div className="tool-section">
                  <h2 className="tool-section__label">Parameters</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {op.requiresList && (
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '12px' }}>List Title</label>
                        <input type="text" value={listTitle} onChange={(e) => setListTitle(e.target.value)} className="form-input" placeholder="Documents" />
                      </div>
                    )}
                    {op.requiresItemId && (
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '12px' }}>Item ID</label>
                        <input type="number" value={itemId} onChange={(e) => setItemId(e.target.value)} className="form-input" placeholder="1" />
                      </div>
                    )}
                    {op.pathTemplate.includes('{folderPath}') && (
                      <div className="form-group" style={{ marginBottom: 0, gridColumn: '1/-1' }}>
                        <label className="form-label" style={{ fontSize: '12px' }}>Folder Path (server-relative)</label>
                        <input type="text" value={folderPath} onChange={(e) => setFolderPath(e.target.value)} className="form-input" placeholder="/sites/MySite/Shared Documents" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* OData Query Options */}
              {op.method === 'GET' && (
                <div className="tool-section">
                  <h2 className="tool-section__label">OData Query Options</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '12px' }}>$select</label>
                      <input type="text" value={selectFields} onChange={(e) => setSelectFields(e.target.value)} className="form-input" placeholder="Title, Id, Created" />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '12px' }}>$filter</label>
                      <input type="text" value={filterExpr} onChange={(e) => setFilterExpr(e.target.value)} className="form-input" placeholder="Title eq 'Test'" />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '12px' }}>$expand</label>
                      <input type="text" value={expandFields} onChange={(e) => setExpandFields(e.target.value)} className="form-input" placeholder="Author, Editor" />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '12px' }}>$orderby</label>
                      <input type="text" value={orderBy} onChange={(e) => setOrderBy(e.target.value)} className="form-input" placeholder="Created desc" />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '12px' }}>$top</label>
                      <input type="number" value={topCount} onChange={(e) => setTopCount(e.target.value)} className="form-input" placeholder="10" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Output */}
            <div className="rest-builder-output" style={{ position: 'sticky', top: '5rem' }}>

              {/* Operation description */}
              <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{
                    fontSize: '11px', fontWeight: 700, fontFamily: 'monospace',
                    padding: '2px 6px', borderRadius: '4px',
                    color: '#fff', backgroundColor: METHOD_COLORS[op.method],
                  }}>{op.method}</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{op.label}</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{op.description}</p>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '0', marginBottom: '0', borderBottom: '1px solid var(--border)' }}>
                {TABS.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => { setActiveTab(tab.key); setCopied(false) }}
                    style={{
                      padding: '0.5rem 1rem', fontSize: '13px', fontWeight: activeTab === tab.key ? 600 : 400,
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      color: activeTab === tab.key ? 'var(--accent)' : 'var(--text-muted)',
                      borderBottom: activeTab === tab.key ? '2px solid var(--accent)' : '2px solid transparent',
                      transition: 'all 0.15s ease',
                    }}
                  >{tab.label}</button>
                ))}
                <div style={{ flex: 1 }} />
                <button
                  onClick={handleCopy}
                  className={`formatter-action-btn ${copied ? 'formatter-action-btn--success' : ''}`}
                  style={{ padding: '0.3rem 0.8rem', fontSize: '12px', alignSelf: 'center' }}
                >
                  {copied ? '✓ Copied' : '📋 Copy'}
                </button>
              </div>

              {/* Code output */}
              <div className="formatter-editor" style={{ height: '420px', backgroundColor: '#1e1e1e', borderRadius: '0 0 8px 8px' }}>
                <textarea
                  readOnly
                  value={getSnippet(activeTab)}
                  className="formatter-textarea"
                  style={{ whiteSpace: 'pre', color: '#d4d4d4', fontFamily: "'Fira Code', 'Cascadia Code', monospace", fontSize: '12.5px', lineHeight: 1.6 }}
                />
              </div>

              {/* Headers info for non-GET */}
              {op.method !== 'GET' && (
                <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(252, 161, 48, 0.08)', border: '1px solid rgba(252, 161, 48, 0.2)' }}>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                    <strong style={{ color: '#fca130' }}>Note:</strong> {op.method === 'POST' ? 'POST' : op.method} requests require an <code>X-RequestDigest</code> header for authentication. In SPFx, use <code>this.context.pageContext.formDigestValue</code>.
                    {op.method === 'PATCH' && ' PATCH requests use X-HTTP-Method: MERGE with a POST verb.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Info section */}
          <section className="tool-info" style={{ marginTop: '4rem' }}>
            <h2>What is the SharePoint REST API?</h2>
            <p>
              The <strong>SharePoint REST API</strong> lets you interact with SharePoint data over HTTP. You can read, create, update, and delete list items, documents, users, and site settings using standard REST calls. It works with any language — JavaScript, C#, PowerShell, Python — as long as you can make HTTP requests.
            </p>
            <h3>Common OData Parameters</h3>
            <ul>
              <li><code>$select</code> — Choose which fields to return (reduces payload size)</li>
              <li><code>$filter</code> — Server-side filtering using OData expressions</li>
              <li><code>$expand</code> — Include related entities (e.g., Author, Editor lookup fields)</li>
              <li><code>$orderby</code> — Sort results by a field (append <code>desc</code> for descending)</li>
              <li><code>$top</code> — Limit the number of results returned</li>
            </ul>
            <h3>Authentication</h3>
            <p>
              In <strong>SPFx web parts</strong>, authentication is handled automatically via the context. For external apps, use <strong>Microsoft Entra ID</strong> (Azure AD) app registration with <code>Sites.Read.All</code> or <code>Sites.ReadWrite.All</code> permissions.
            </p>
          </section>

          <ToolFAQ slug="rest-api-builder" />

          <AdSlot type="leaderboard" />

          <RelatedTools currentSlug="rest-api-builder" />
        </div>
      </div>
    </>
  )
}