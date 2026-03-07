'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import RelatedTools from '@/components/RelatedTools'

/* ───────────── Types ───────────── */
type ResourceType = 'Site' | 'Library' | 'List' | 'Folder'
type PrincipalType = 'User' | 'SP Group' | 'AD Group'
type PermissionLevel =
  | 'Full Control'
  | 'Design'
  | 'Edit'
  | 'Contribute'
  | 'Read'
  | 'View Only'
  | 'None'

interface Resource {
  id: string
  name: string
  type: ResourceType
}

interface Principal {
  id: string
  name: string
  type: PrincipalType
}

/* ───────────── Constants ───────────── */
const RESOURCE_TYPES: ResourceType[] = ['Site', 'Library', 'List', 'Folder']
const PRINCIPAL_TYPES: PrincipalType[] = ['User', 'SP Group', 'AD Group']
const PERMISSION_LEVELS: PermissionLevel[] = [
  'Full Control',
  'Design',
  'Edit',
  'Contribute',
  'Read',
  'View Only',
  'None',
]

const PERMISSION_COLORS: Record<PermissionLevel, string> = {
  'Full Control': '#22c55e',
  Design: '#3b82f6',
  Edit: '#8b5cf6',
  Contribute: '#f59e0b',
  Read: '#06b6d4',
  'View Only': '#94a3b8',
  None: '#ef4444',
}

const RESOURCE_ICONS: Record<ResourceType, string> = {
  Site: '🌐',
  Library: '📁',
  List: '📋',
  Folder: '📂',
}

const PRINCIPAL_ICONS: Record<PrincipalType, string> = {
  User: '👤',
  'SP Group': '👥',
  'AD Group': '🏢',
}

/* ───────────── Preset Templates ───────────── */
interface PresetTemplate {
  name: string
  emoji: string
  description: string
  resources: Omit<Resource, 'id'>[]
  principals: Omit<Principal, 'id'>[]
  permissions: PermissionLevel[][]
}

const PRESETS: PresetTemplate[] = [
  {
    name: 'Intranet Hub',
    emoji: '🏠',
    description: '3 sites × 4 groups',
    resources: [
      { name: 'Intranet Home', type: 'Site' },
      { name: 'HR Portal', type: 'Site' },
      { name: 'IT Knowledge Base', type: 'Site' },
    ],
    principals: [
      { name: 'Site Owners', type: 'SP Group' },
      { name: 'Site Members', type: 'SP Group' },
      { name: 'Site Visitors', type: 'SP Group' },
      { name: 'External Users', type: 'AD Group' },
    ],
    permissions: [
      ['Full Control', 'Contribute', 'Read', 'None'],
      ['Full Control', 'Edit', 'Read', 'None'],
      ['Full Control', 'Contribute', 'Read', 'View Only'],
    ],
  },
  {
    name: 'Project Site',
    emoji: '📊',
    description: 'Single project site',
    resources: [
      { name: 'Project Alpha', type: 'Site' },
      { name: 'Project Documents', type: 'Library' },
      { name: 'Task List', type: 'List' },
      { name: 'Confidential', type: 'Folder' },
    ],
    principals: [
      { name: 'Project Owners', type: 'SP Group' },
      { name: 'Team Members', type: 'SP Group' },
      { name: 'Stakeholders', type: 'SP Group' },
    ],
    permissions: [
      ['Full Control', 'Contribute', 'Read'],
      ['Full Control', 'Edit', 'Read'],
      ['Full Control', 'Contribute', 'View Only'],
      ['Full Control', 'None', 'None'],
    ],
  },
  {
    name: 'Document Library',
    emoji: '📁',
    description: 'Library + tiered folders',
    resources: [
      { name: 'Shared Documents', type: 'Library' },
      { name: 'Public Folder', type: 'Folder' },
      { name: 'Team Folder', type: 'Folder' },
      { name: 'Management Only', type: 'Folder' },
    ],
    principals: [
      { name: 'Managers', type: 'AD Group' },
      { name: 'Staff', type: 'SP Group' },
      { name: 'Interns', type: 'SP Group' },
      { name: 'External Auditors', type: 'User' },
    ],
    permissions: [
      ['Full Control', 'Contribute', 'Read', 'View Only'],
      ['Full Control', 'Contribute', 'Read', 'Read'],
      ['Full Control', 'Contribute', 'None', 'None'],
      ['Full Control', 'None', 'None', 'None'],
    ],
  },
]

/* ───────────── Helpers ───────────── */
let idCounter = 0
function uid(): string {
  return `pm_${Date.now()}_${++idCounter}`
}

/* ───────────── Component ───────────── */
export default function PermissionMatrix() {
  const [resources, setResources] = useState<Resource[]>([
    { id: uid(), name: 'Home Site', type: 'Site' },
    { id: uid(), name: 'Documents', type: 'Library' },
  ])
  const [principals, setPrincipals] = useState<Principal[]>([
    { id: uid(), name: 'Owners', type: 'SP Group' },
    { id: uid(), name: 'Members', type: 'SP Group' },
    { id: uid(), name: 'Visitors', type: 'SP Group' },
  ])
  // permissions[resourceIndex][principalIndex]
  const [permissions, setPermissions] = useState<PermissionLevel[][]>([
    ['Full Control', 'Contribute', 'Read'],
    ['Full Control', 'Edit', 'Read'],
  ])
  const [copied, setCopied] = useState<string | null>(null)

  /* ── Resource CRUD ── */
  const addResource = () => {
    setResources([...resources, { id: uid(), name: '', type: 'Site' }])
    setPermissions([...permissions, new Array(principals.length).fill('Read' as PermissionLevel)])
  }

  const updateResource = (id: string, updates: Partial<Resource>) => {
    setResources(resources.map((r) => (r.id === id ? { ...r, ...updates } : r)))
  }

  const removeResource = (index: number) => {
    if (resources.length <= 1) return
    setResources(resources.filter((_, i) => i !== index))
    setPermissions(permissions.filter((_, i) => i !== index))
  }

  /* ── Principal CRUD ── */
  const addPrincipal = () => {
    setPrincipals([...principals, { id: uid(), name: '', type: 'User' }])
    setPermissions(permissions.map((row) => [...row, 'Read' as PermissionLevel]))
  }

  const updatePrincipal = (id: string, updates: Partial<Principal>) => {
    setPrincipals(principals.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }

  const removePrincipal = (index: number) => {
    if (principals.length <= 1) return
    setPrincipals(principals.filter((_, i) => i !== index))
    setPermissions(permissions.map((row) => row.filter((_, i) => i !== index)))
  }

  /* ── Permission update ── */
  const setPermission = (ri: number, pi: number, level: PermissionLevel) => {
    const next = permissions.map((row) => [...row])
    next[ri][pi] = level
    setPermissions(next)
  }

  /* ── Presets ── */
  const applyPreset = (preset: PresetTemplate) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'tool_used', {
        tool_name: 'permission_matrix',
        action: 'preset_applied',
        preset_name: preset.name,
      })
    }
    setResources(preset.resources.map((r) => ({ ...r, id: uid() })))
    setPrincipals(preset.principals.map((p) => ({ ...p, id: uid() })))
    setPermissions(preset.permissions.map((row) => [...row]))
  }

  /* ── Export ── */
  const csvContent = useMemo(() => {
    const header = ['Resource', 'Type', ...principals.map((p) => `${p.name} (${p.type})`)].join(
      ','
    )
    const rows = resources.map((r, ri) => {
      const cells = permissions[ri]?.map((perm) => perm) || []
      return [r.name, r.type, ...cells].join(',')
    })
    return [header, ...rows].join('\n')
  }, [resources, principals, permissions])

  const markdownContent = useMemo(() => {
    const header = `| Resource | Type | ${principals.map((p) => `${p.name}`).join(' | ')} |`
    const sep = `|---|---|${principals.map(() => '---').join('|')}|`
    const rows = resources.map((r, ri) => {
      const cells = permissions[ri]?.map((perm) => perm) || []
      return `| ${r.name} | ${r.type} | ${cells.join(' | ')} |`
    })
    return [header, sep, ...rows].join('\n')
  }, [resources, principals, permissions])

  const handleCopy = async (content: string, label: string) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'copy_clicked', {
        tool_name: 'permission_matrix',
        export_type: label,
      })
    }
    try {
      await navigator.clipboard.writeText(content)
      setCopied(label)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = content
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(label)
      setTimeout(() => setCopied(null), 2000)
    }
  }

  return (
    <>

      <div className="container">
        <div className="tool-page glass-panel reveal-stagger">
          {/* Breadcrumb */}
          <nav className="tool-breadcrumb">
            <Link href="/tools">Tools</Link>
            <span className="tool-breadcrumb__sep">/</span>
            <span>Permission Matrix</span>
          </nav>

          {/* Header */}
          <header className="tool-header">
            <div className="tool-header__icon">🛡️</div>
            <h1 className="tool-header__title">SharePoint Permission Matrix Generator</h1>
            <p className="tool-header__desc">
              Define resources and principals, assign permission levels, and instantly generate a
              color-coded matrix. Export as CSV or Markdown for audits and documentation. 100%
              client-side — nothing leaves your browser.
            </p>
          </header>

          {/* Preset Templates */}
          <div className="tool-section">
            <h2 className="tool-section__label">Quick Start Templates</h2>
            <div className="pm-presets">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  className="pm-preset-btn glass-card"
                  onClick={() => applyPreset(preset)}
                >
                  <span className="pm-preset-btn__emoji">{preset.emoji}</span>
                  <span className="pm-preset-btn__name">{preset.name}</span>
                  <span className="pm-preset-btn__desc">{preset.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Grid: Editor + Preview */}
          <div
            className="pm-layout"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '2rem',
              marginTop: '2rem',
            }}
          >
            {/* ── Editor Panel ── */}
            <div className="pm-editor">
              {/* Resources */}
              <div className="tool-section">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <h2 className="tool-section__label" style={{ margin: 0 }}>
                    Resources (Rows)
                  </h2>
                  <button
                    onClick={addResource}
                    className="tool-generate-btn"
                    style={{
                      padding: '0.4rem 0.8rem',
                      width: 'auto',
                      display: 'inline-flex',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text)',
                      border: '1px solid var(--border)',
                      fontSize: '13px',
                    }}
                  >
                    <span className="tool-generate-btn__icon">➕</span> Add Resource
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {resources.map((res, ri) => (
                    <div
                      key={res.id}
                      className="glass-card"
                      style={{
                        padding: '0.6rem 0.8rem',
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '16px', flexShrink: 0 }}>
                        {RESOURCE_ICONS[res.type]}
                      </span>
                      <select
                        value={res.type}
                        onChange={(e) =>
                          updateResource(res.id, { type: e.target.value as ResourceType })
                        }
                        className="form-input"
                        style={{
                          padding: '0.35rem 0.5rem',
                          fontSize: '13px',
                          width: '110px',
                          height: '34px',
                          flexShrink: 0,
                        }}
                      >
                        {RESOURCE_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Resource name…"
                        value={res.name}
                        onChange={(e) => updateResource(res.id, { name: e.target.value })}
                        className="form-input"
                        style={{
                          padding: '0.35rem 0.5rem',
                          fontSize: '13px',
                          flex: 1,
                          height: '34px',
                        }}
                      />
                      <button
                        onClick={() => removeResource(ri)}
                        disabled={resources.length <= 1}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          opacity: resources.length <= 1 ? 0.3 : 1,
                          fontSize: '14px',
                          padding: '0 4px',
                          flexShrink: 0,
                        }}
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Principals */}
              <div className="tool-section">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <h2 className="tool-section__label" style={{ margin: 0 }}>
                    Principals (Columns)
                  </h2>
                  <button
                    onClick={addPrincipal}
                    className="tool-generate-btn"
                    style={{
                      padding: '0.4rem 0.8rem',
                      width: 'auto',
                      display: 'inline-flex',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text)',
                      border: '1px solid var(--border)',
                      fontSize: '13px',
                    }}
                  >
                    <span className="tool-generate-btn__icon">➕</span> Add Principal
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {principals.map((p, pi) => (
                    <div
                      key={p.id}
                      className="glass-card"
                      style={{
                        padding: '0.6rem 0.8rem',
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '16px', flexShrink: 0 }}>
                        {PRINCIPAL_ICONS[p.type]}
                      </span>
                      <select
                        value={p.type}
                        onChange={(e) =>
                          updatePrincipal(p.id, { type: e.target.value as PrincipalType })
                        }
                        className="form-input"
                        style={{
                          padding: '0.35rem 0.5rem',
                          fontSize: '13px',
                          width: '110px',
                          height: '34px',
                          flexShrink: 0,
                        }}
                      >
                        {PRINCIPAL_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Principal name…"
                        value={p.name}
                        onChange={(e) => updatePrincipal(p.id, { name: e.target.value })}
                        className="form-input"
                        style={{
                          padding: '0.35rem 0.5rem',
                          fontSize: '13px',
                          flex: 1,
                          height: '34px',
                        }}
                      />
                      <button
                        onClick={() => removePrincipal(pi)}
                        disabled={principals.length <= 1}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          opacity: principals.length <= 1 ? 0.3 : 1,
                          fontSize: '14px',
                          padding: '0 4px',
                          flexShrink: 0,
                        }}
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Live Matrix Preview ── */}
            <div className="pm-preview">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <h2 className="tool-section__label" style={{ margin: 0 }}>
                  Permission Matrix
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleCopy(csvContent, 'csv')}
                    className={`formatter-action-btn ${copied === 'csv' ? 'formatter-action-btn--success' : ''}`}
                    style={{ padding: '0.3rem 0.8rem', fontSize: '13px' }}
                  >
                    {copied === 'csv' ? '✓ Copied' : '📋 Copy CSV'}
                  </button>
                  <button
                    onClick={() => handleCopy(markdownContent, 'md')}
                    className={`formatter-action-btn ${copied === 'md' ? 'formatter-action-btn--success' : ''}`}
                    style={{ padding: '0.3rem 0.8rem', fontSize: '13px' }}
                  >
                    {copied === 'md' ? '✓ Copied' : '📝 Copy Markdown'}
                  </button>
                </div>
              </div>

              <div className="pm-table-wrapper">
                <table className="pm-table">
                  <thead>
                    <tr>
                      <th className="pm-table__corner">Resource</th>
                      {principals.map((p) => (
                        <th key={p.id} className="pm-table__header">
                          <span className="pm-table__header-icon">{PRINCIPAL_ICONS[p.type]}</span>
                          <span className="pm-table__header-name">{p.name || '(unnamed)'}</span>
                          <span className="pm-table__header-type">{p.type}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {resources.map((res, ri) => (
                      <tr key={res.id}>
                        <td className="pm-table__resource">
                          <span className="pm-table__resource-icon">
                            {RESOURCE_ICONS[res.type]}
                          </span>
                          <div>
                            <div className="pm-table__resource-name">
                              {res.name || '(unnamed)'}
                            </div>
                            <div className="pm-table__resource-type">{res.type}</div>
                          </div>
                        </td>
                        {principals.map((p, pi) => {
                          const level = permissions[ri]?.[pi] || 'None'
                          return (
                            <td key={p.id} className="pm-table__cell">
                              <select
                                value={level}
                                onChange={(e) =>
                                  setPermission(ri, pi, e.target.value as PermissionLevel)
                                }
                                className="pm-perm-select"
                                style={{
                                  backgroundColor: `${PERMISSION_COLORS[level]}18`,
                                  color: PERMISSION_COLORS[level],
                                  borderColor: `${PERMISSION_COLORS[level]}40`,
                                }}
                              >
                                {PERMISSION_LEVELS.map((lvl) => (
                                  <option key={lvl} value={lvl}>
                                    {lvl}
                                  </option>
                                ))}
                              </select>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Permission Legend */}
              <div className="pm-legend">
                {PERMISSION_LEVELS.map((level) => (
                  <div key={level} className="pm-legend__item">
                    <span
                      className="pm-legend__dot"
                      style={{ backgroundColor: PERMISSION_COLORS[level] }}
                    />
                    <span className="pm-legend__label">{level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <section className="tool-info" style={{ marginTop: '4rem' }}>
            <h2>What is a SharePoint Permission Matrix?</h2>
            <p>
              A <strong>SharePoint Permission Matrix</strong> is a structured document that maps out
              which users and groups have what level of access across your SharePoint sites,
              libraries, lists, and folders. It provides a clear, at-a-glance view of your
              security posture — making it essential for audits, compliance, and IT governance.
            </p>
            <h3>When You Need a Permission Matrix</h3>
            <ul>
              <li>
                <strong>Security Audits</strong> — document who can access what before an audit
                or compliance review (ISO 27001, SOC 2, GDPR).
              </li>
              <li>
                <strong>Site Provisioning</strong> — plan the permission structure before creating
                new sites, so you start with the right security model.
              </li>
              <li>
                <strong>Employee Onboarding/Offboarding</strong> — quickly see which groups a new
                hire should be added to, or verify access is revoked when someone leaves.
              </li>
              <li>
                <strong>Broken Inheritance Reviews</strong> — identify where unique permissions
                have been applied and whether they follow your governance policies.
              </li>
              <li>
                <strong>External Sharing Reviews</strong> — track which resources are accessible
                to external users, guests, or partner organizations.
              </li>
            </ul>
            <h3>SharePoint Permission Levels Explained</h3>
            <ul>
              <li>
                <strong>Full Control</strong> — complete administrative access including managing
                permissions and site settings.
              </li>
              <li>
                <strong>Design</strong> — can create lists/libraries and edit pages in the site.
              </li>
              <li>
                <strong>Edit</strong> — can add, edit, and delete list items and documents.
              </li>
              <li>
                <strong>Contribute</strong> — can add, edit, and delete their own items.
              </li>
              <li>
                <strong>Read</strong> — can view pages, list items, and download documents.
              </li>
              <li>
                <strong>View Only</strong> — can view pages and items but cannot download.
              </li>
            </ul>
          </section>

          <RelatedTools currentSlug="permission-matrix" />
        </div>
      </div>
    </>
  )
}