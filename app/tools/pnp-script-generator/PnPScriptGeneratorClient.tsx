'use client'

import { useState } from 'react'
import Link from 'next/link'
import RelatedTools from '@/components/RelatedTools'
import AdSlot from '@/components/AdSlot'
import ToolFAQ from '@/components/ToolFAQ'

/* ───────────── Types ───────────── */

interface ScriptTemplate {
  id: string
  label: string
  emoji: string
  category: string
  description: string
  params: ParamDef[]
  generate: (values: Record<string, string>) => string
}

interface ParamDef {
  key: string
  label: string
  placeholder: string
  type: 'text' | 'select' | 'number' | 'boolean'
  options?: { value: string; label: string }[]
  defaultValue: string
}

/* ───────────── Templates ───────────── */

const TEMPLATES: ScriptTemplate[] = [
  // ── LIST OPERATIONS ──
  {
    id: 'create-list',
    label: 'Create List',
    emoji: '📋',
    category: 'Lists',
    description: 'Create a new SharePoint list with specified template',
    params: [
      { key: 'siteUrl', label: 'Site URL', placeholder: 'https://contoso.sharepoint.com/sites/MySite', type: 'text', defaultValue: 'https://contoso.sharepoint.com/sites/MySite' },
      { key: 'listName', label: 'List Name', placeholder: 'Project Tasks', type: 'text', defaultValue: 'Project Tasks' },
      { key: 'template', label: 'Template', type: 'select', placeholder: '', defaultValue: 'GenericList', options: [
        { value: 'GenericList', label: 'Custom List' },
        { value: 'DocumentLibrary', label: 'Document Library' },
        { value: 'Announcements', label: 'Announcements' },
        { value: 'Tasks', label: 'Tasks' },
        { value: 'Calendar', label: 'Calendar' },
      ]},
    ],
    generate: (v) => `# Create a new SharePoint list
Connect-PnPOnline -Url "${v.siteUrl}" -Interactive

New-PnPList \\
  -Title "${v.listName}" \\
  -Template ${v.template}

Write-Host "✅ List '${v.listName}' created successfully"`,
  },
  {
    id: 'add-field',
    label: 'Add Column to List',
    emoji: '➕',
    category: 'Lists',
    description: 'Add a new column/field to an existing list',
    params: [
      { key: 'siteUrl', label: 'Site URL', placeholder: 'https://contoso.sharepoint.com/sites/MySite', type: 'text', defaultValue: 'https://contoso.sharepoint.com/sites/MySite' },
      { key: 'listName', label: 'List Name', placeholder: 'Project Tasks', type: 'text', defaultValue: 'Project Tasks' },
      { key: 'fieldName', label: 'Column Name', placeholder: 'Status', type: 'text', defaultValue: 'Status' },
      { key: 'fieldType', label: 'Column Type', type: 'select', placeholder: '', defaultValue: 'Text', options: [
        { value: 'Text', label: 'Single Line Text' },
        { value: 'Note', label: 'Multi-Line Text' },
        { value: 'Number', label: 'Number' },
        { value: 'DateTime', label: 'Date/Time' },
        { value: 'Boolean', label: 'Yes/No' },
        { value: 'Choice', label: 'Choice' },
        { value: 'User', label: 'Person or Group' },
        { value: 'Currency', label: 'Currency' },
      ]},
      { key: 'required', label: 'Required', type: 'boolean', placeholder: '', defaultValue: 'false' },
    ],
    generate: (v) => `# Add a column to a SharePoint list
Connect-PnPOnline -Url "${v.siteUrl}" -Interactive

Add-PnPField \\
  -List "${v.listName}" \\
  -DisplayName "${v.fieldName}" \\
  -InternalName "${v.fieldName.replace(/\s/g, '')}" \\
  -Type ${v.fieldType} \\
  -Required:$${v.required === 'true' ? 'True' : 'False'}

Write-Host "✅ Column '${v.fieldName}' added to '${v.listName}'"`,
  },
  {
    id: 'export-list-items',
    label: 'Export List Items to CSV',
    emoji: '📤',
    category: 'Lists',
    description: 'Export all items from a list to a CSV file',
    params: [
      { key: 'siteUrl', label: 'Site URL', placeholder: 'https://contoso.sharepoint.com/sites/MySite', type: 'text', defaultValue: 'https://contoso.sharepoint.com/sites/MySite' },
      { key: 'listName', label: 'List Name', placeholder: 'Project Tasks', type: 'text', defaultValue: 'Project Tasks' },
      { key: 'fields', label: 'Fields (comma separated)', placeholder: 'Title, Status, DueDate', type: 'text', defaultValue: 'Title, Status, DueDate' },
      { key: 'outputPath', label: 'Output CSV Path', placeholder: 'C:\\export.csv', type: 'text', defaultValue: 'C:\\export.csv' },
    ],
    generate: (v) => {
      const fields = v.fields.split(',').map(f => f.trim()).filter(Boolean)
      return `# Export list items to CSV
Connect-PnPOnline -Url "${v.siteUrl}" -Interactive

$items = Get-PnPListItem \\
  -List "${v.listName}" \\
  -Fields ${fields.map(f => `"${f}"`).join(', ')} \\
  -PageSize 2000

$results = $items | ForEach-Object {
  [PSCustomObject]@{
${fields.map(f => `    ${f} = $_.FieldValues["${f}"]`).join('\n')}
  }
}

$results | Export-Csv \\
  -Path "${v.outputPath}" \\
  -NoTypeInformation \\
  -Encoding UTF8

Write-Host "✅ Exported $($results.Count) items to ${v.outputPath}"`
    },
  },
  // ── PERMISSION OPERATIONS ──
  {
    id: 'set-permissions',
    label: 'Set List Permissions',
    emoji: '🔒',
    category: 'Permissions',
    description: 'Break inheritance and assign specific permissions',
    params: [
      { key: 'siteUrl', label: 'Site URL', placeholder: 'https://contoso.sharepoint.com/sites/MySite', type: 'text', defaultValue: 'https://contoso.sharepoint.com/sites/MySite' },
      { key: 'listName', label: 'List Name', placeholder: 'Confidential Docs', type: 'text', defaultValue: 'Confidential Docs' },
      { key: 'groupName', label: 'Group Name', placeholder: 'MySite Members', type: 'text', defaultValue: 'MySite Members' },
      { key: 'role', label: 'Role', type: 'select', placeholder: '', defaultValue: 'Contribute', options: [
        { value: 'Full Control', label: 'Full Control' },
        { value: 'Edit', label: 'Edit' },
        { value: 'Contribute', label: 'Contribute' },
        { value: 'Read', label: 'Read' },
        { value: 'View Only', label: 'View Only' },
      ]},
    ],
    generate: (v) => `# Break inheritance and set permissions on a list
Connect-PnPOnline -Url "${v.siteUrl}" -Interactive

# Break role inheritance (keep existing permissions)
Set-PnPList \\
  -Identity "${v.listName}" \\
  -BreakRoleInheritance \\
  -CopyRoleAssignments

# Assign permissions to a group
Set-PnPGroupPermissions \\
  -Identity "${v.groupName}" \\
  -List "${v.listName}" \\
  -AddRole "${v.role}"

Write-Host "✅ Permissions set: '${v.groupName}' → '${v.role}' on '${v.listName}'"`,
  },
  {
    id: 'audit-permissions',
    label: 'Audit Site Permissions',
    emoji: '🛡️',
    category: 'Permissions',
    description: 'Generate a permissions audit report for the entire site',
    params: [
      { key: 'siteUrl', label: 'Site URL', placeholder: 'https://contoso.sharepoint.com/sites/MySite', type: 'text', defaultValue: 'https://contoso.sharepoint.com/sites/MySite' },
      { key: 'outputPath', label: 'Output CSV Path', placeholder: 'C:\\permissions-audit.csv', type: 'text', defaultValue: 'C:\\permissions-audit.csv' },
    ],
    generate: (v) => `# Audit all permissions in a SharePoint site
Connect-PnPOnline -Url "${v.siteUrl}" -Interactive

$results = @()

# Site-level permissions
$web = Get-PnPWeb -Includes RoleAssignments
foreach ($ra in $web.RoleAssignments) {
  $member = $ra.Member
  $roles = $ra.RoleDefinitionBindings | Select-Object -ExpandProperty Name
  $results += [PSCustomObject]@{
    Scope    = "Site"
    Resource = $web.Title
    Principal = $member.LoginName
    Roles    = ($roles -join ", ")
  }
}

# List-level permissions (unique only)
$lists = Get-PnPList | Where-Object { $_.HasUniqueRoleAssignments }
foreach ($list in $lists) {
  $listRAs = Get-PnPProperty -ClientObject $list -Property RoleAssignments
  foreach ($ra in $listRAs) {
    $member = $ra.Member
    $roles = $ra.RoleDefinitionBindings | Select-Object -ExpandProperty Name
    $results += [PSCustomObject]@{
      Scope    = "List"
      Resource = $list.Title
      Principal = $member.LoginName
      Roles    = ($roles -join ", ")
    }
  }
}

$results | Export-Csv -Path "${v.outputPath}" -NoTypeInformation
Write-Host "✅ Audit complete: $($results.Count) permission entries → ${v.outputPath}"`,
  },
  // ── SITE OPERATIONS ──
  {
    id: 'create-site',
    label: 'Create Communication Site',
    emoji: '🌐',
    category: 'Sites',
    description: 'Create a new modern communication site',
    params: [
      { key: 'siteUrl', label: 'Admin URL', placeholder: 'https://contoso-admin.sharepoint.com', type: 'text', defaultValue: 'https://contoso-admin.sharepoint.com' },
      { key: 'title', label: 'Site Title', placeholder: 'Marketing Hub', type: 'text', defaultValue: 'Marketing Hub' },
      { key: 'alias', label: 'URL Alias', placeholder: 'marketing-hub', type: 'text', defaultValue: 'marketing-hub' },
      { key: 'owner', label: 'Owner Email', placeholder: 'admin@contoso.com', type: 'text', defaultValue: 'admin@contoso.com' },
    ],
    generate: (v) => `# Create a new Communication Site
Connect-PnPOnline -Url "${v.siteUrl}" -Interactive

New-PnPSite \\
  -Type CommunicationSite \\
  -Title "${v.title}" \\
  -Url "https://contoso.sharepoint.com/sites/${v.alias}" \\
  -Owner "${v.owner}" \\
  -SiteDesign Blank

Write-Host "✅ Communication site '${v.title}' created"`,
  },
  {
    id: 'apply-template',
    label: 'Apply PnP Template',
    emoji: '📐',
    category: 'Sites',
    description: 'Apply a PnP provisioning template to a site',
    params: [
      { key: 'siteUrl', label: 'Site URL', placeholder: 'https://contoso.sharepoint.com/sites/MySite', type: 'text', defaultValue: 'https://contoso.sharepoint.com/sites/MySite' },
      { key: 'templatePath', label: 'Template File Path', placeholder: 'C:\\template.xml', type: 'text', defaultValue: 'C:\\template.xml' },
    ],
    generate: (v) => `# Apply a PnP provisioning template
Connect-PnPOnline -Url "${v.siteUrl}" -Interactive

# To extract a template from an existing site:
# Get-PnPSiteTemplate -Out "${v.templatePath}"

# Apply the template
Invoke-PnPSiteTemplate \\
  -Path "${v.templatePath}"

Write-Host "✅ Template applied to ${v.siteUrl}"`,
  },
  // ── CONTENT OPERATIONS ──
  {
    id: 'create-content-type',
    label: 'Create Content Type',
    emoji: '📄',
    category: 'Content',
    description: 'Create a new site content type with columns',
    params: [
      { key: 'siteUrl', label: 'Site URL', placeholder: 'https://contoso.sharepoint.com/sites/MySite', type: 'text', defaultValue: 'https://contoso.sharepoint.com/sites/MySite' },
      { key: 'name', label: 'Content Type Name', placeholder: 'Project Document', type: 'text', defaultValue: 'Project Document' },
      { key: 'parent', label: 'Parent Content Type', type: 'select', placeholder: '', defaultValue: 'Item', options: [
        { value: 'Item', label: 'Item (0x01)' },
        { value: 'Document', label: 'Document (0x0101)' },
        { value: 'Folder', label: 'Folder (0x0120)' },
        { value: 'Event', label: 'Event (0x0102)' },
        { value: 'Task', label: 'Task (0x0108)' },
      ]},
      { key: 'group', label: 'Group', placeholder: 'Custom Content Types', type: 'text', defaultValue: 'Custom Content Types' },
    ],
    generate: (v) => `# Create a new content type
Connect-PnPOnline -Url "${v.siteUrl}" -Interactive

$parentCT = Get-PnPContentType -Identity "${v.parent}"

Add-PnPContentType \\
  -Name "${v.name}" \\
  -ParentContentType $parentCT \\
  -Group "${v.group}" \\
  -Description "Custom content type: ${v.name}"

Write-Host "✅ Content type '${v.name}' created (parent: ${v.parent})"`,
  },
  // ── BULK OPERATIONS ──
  {
    id: 'bulk-delete',
    label: 'Bulk Delete Items',
    emoji: '🗑️',
    category: 'Bulk',
    description: 'Delete all items from a list using batch processing',
    params: [
      { key: 'siteUrl', label: 'Site URL', placeholder: 'https://contoso.sharepoint.com/sites/MySite', type: 'text', defaultValue: 'https://contoso.sharepoint.com/sites/MySite' },
      { key: 'listName', label: 'List Name', placeholder: 'Old Data', type: 'text', defaultValue: 'Old Data' },
      { key: 'batchSize', label: 'Batch Size', placeholder: '100', type: 'number', defaultValue: '100' },
    ],
    generate: (v) => `# Bulk delete all items from a list (batched)
Connect-PnPOnline -Url "${v.siteUrl}" -Interactive

$items = Get-PnPListItem -List "${v.listName}" -PageSize 2000
$total = $items.Count
$deleted = 0

Write-Host "Found $total items to delete..."

# Process in batches
$batches = [System.Collections.ArrayList]@()
for ($i = 0; $i -lt $items.Count; $i += ${v.batchSize}) {
  $batch = New-PnPBatch
  $end = [System.Math]::Min($i + ${v.batchSize}, $items.Count)
  for ($j = $i; $j -lt $end; $j++) {
    Remove-PnPListItem \\
      -List "${v.listName}" \\
      -Identity $items[$j].Id \\
      -Batch $batch \\
      -Force
  }
  Invoke-PnPBatch -Batch $batch
  $deleted += ($end - $i)
  Write-Progress -Activity "Deleting" -Status "$deleted / $total" \\
    -PercentComplete (($deleted / $total) * 100)
}

Write-Host "✅ Deleted $total items from '${v.listName}'"`,
  },
  {
    id: 'bulk-upload',
    label: 'Bulk Upload Files',
    emoji: '📁',
    category: 'Bulk',
    description: 'Upload all files from a local folder to a document library',
    params: [
      { key: 'siteUrl', label: 'Site URL', placeholder: 'https://contoso.sharepoint.com/sites/MySite', type: 'text', defaultValue: 'https://contoso.sharepoint.com/sites/MySite' },
      { key: 'libraryName', label: 'Library Name', placeholder: 'Shared Documents', type: 'text', defaultValue: 'Shared Documents' },
      { key: 'localPath', label: 'Local Folder Path', placeholder: 'C:\\Documents\\Upload', type: 'text', defaultValue: 'C:\\Documents\\Upload' },
      { key: 'targetFolder', label: 'Target Folder (optional)', placeholder: '2026/Reports', type: 'text', defaultValue: '' },
    ],
    generate: (v) => {
      const folder = v.targetFolder ? `/${v.targetFolder}` : ''
      return `# Bulk upload files to a document library
Connect-PnPOnline -Url "${v.siteUrl}" -Interactive

$localPath = "${v.localPath}"
$files = Get-ChildItem -Path $localPath -File -Recurse
$total = $files.Count
$uploaded = 0

Write-Host "Uploading $total files..."

foreach ($file in $files) {
  $relativePath = $file.FullName.Replace("$localPath\\", "")
  $targetPath = "${v.libraryName}${folder}"

  Add-PnPFile \\
    -Path $file.FullName \\
    -Folder $targetPath

  $uploaded++
  Write-Progress -Activity "Uploading" -Status "$uploaded / $total" \\
    -PercentComplete (($uploaded / $total) * 100)
}

Write-Host "✅ Uploaded $total files to '${v.libraryName}${folder}'"` },
  },
]

const CATEGORIES = [...new Set(TEMPLATES.map(t => t.category))]

/* ───────────── Component ───────────── */

export default function PnPScriptGenerator() {
  const [selectedId, setSelectedId] = useState(TEMPLATES[0].id)
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    TEMPLATES[0].params.forEach(p => { init[p.key] = p.defaultValue })
    return init
  })
  const [copied, setCopied] = useState(false)

  const template = TEMPLATES.find(t => t.id === selectedId)!

  const selectTemplate = (id: string) => {
    setSelectedId(id)
    const tmpl = TEMPLATES.find(t => t.id === id)!
    const init: Record<string, string> = {}
    tmpl.params.forEach(p => { init[p.key] = p.defaultValue })
    setValues(init)
    setCopied(false)
  }

  const updateValue = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  const output = template.generate(values)

  const handleCopy = async () => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'copy_clicked', { tool_name: 'pnp_script_generator', template: selectedId })
    }
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = output
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>

      <div className="container">
        <div className="tool-page glass-panel reveal-stagger">
          <nav className="tool-breadcrumb">
            <Link href="/tools">Tools</Link>
            <span className="tool-breadcrumb__sep">/</span>
            <span>PnP Script Generator</span>
          </nav>

          <header className="tool-header">
            <div className="tool-header__icon">🔧</div>
            <h1 className="tool-header__title">PnP PowerShell Script Generator</h1>
            <p className="tool-header__desc">
              Choose a SharePoint task, fill in parameters, and get a ready-to-run
              PnP PowerShell script — with error handling and best practices baked in.
            </p>
          </header>

          <div className="tool-grid-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)', gap: '2rem', alignItems: 'start', marginTop: '2rem' }}>

            {/* Left: Task Selector & Params */}
            <div className="pnp-builder-config">

              {/* Task Selector (by category) */}
              <div className="tool-section">
                <h2 className="tool-section__label">Choose a Task</h2>
                {CATEGORIES.map(cat => (
                  <div key={cat} style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      {cat}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {TEMPLATES.filter(t => t.category === cat).map(t => (
                        <button
                          key={t.id}
                          onClick={() => selectTemplate(t.id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.6rem',
                            padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)',
                            background: t.id === selectedId ? 'var(--accent-bg)' : 'var(--bg-secondary)',
                            cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease',
                          }}
                        >
                          <span style={{ fontSize: '16px' }}>{t.emoji}</span>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: t.id === selectedId ? 600 : 400, color: 'var(--text)' }}>{t.label}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.description}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Parameters */}
              <div className="tool-section">
                <h2 className="tool-section__label">Parameters</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {template.params.map(param => (
                    <div key={param.key} className="form-group" style={{
                      marginBottom: 0,
                      gridColumn: param.key === 'siteUrl' || param.key.includes('Path') || param.key === 'fields' ? '1/-1' : undefined,
                    }}>
                      <label className="form-label" style={{ fontSize: '12px' }}>{param.label}</label>
                      {param.type === 'select' ? (
                        <select
                          value={values[param.key] || ''}
                          onChange={(e) => updateValue(param.key, e.target.value)}
                          className="form-input" style={{ fontSize: '13px' }}
                        >
                          {param.options!.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      ) : param.type === 'boolean' ? (
                        <select
                          value={values[param.key] || 'false'}
                          onChange={(e) => updateValue(param.key, e.target.value)}
                          className="form-input" style={{ fontSize: '13px' }}
                        >
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      ) : (
                        <input
                          type={param.type}
                          value={values[param.key] || ''}
                          onChange={(e) => updateValue(param.key, e.target.value)}
                          className="form-input" style={{ fontSize: '13px' }}
                          placeholder={param.placeholder}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Script Output */}
            <div className="pnp-builder-output" style={{ position: 'sticky', top: '5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h2 className="tool-section__label" style={{ margin: 0 }}>Generated Script</h2>
                <button
                  onClick={handleCopy}
                  className={`formatter-action-btn ${copied ? 'formatter-action-btn--success' : ''}`}
                  style={{ padding: '0.3rem 0.8rem', fontSize: '12px' }}
                >
                  {copied ? '✓ Copied' : '📋 Copy Script'}
                </button>
              </div>

              <div className="formatter-editor" style={{ height: '500px', backgroundColor: '#1e1e1e', borderRadius: '8px' }}>
                <textarea
                  readOnly
                  value={output}
                  className="formatter-textarea"
                  style={{ whiteSpace: 'pre', color: '#d4d4d4', fontFamily: "'Fira Code', 'Cascadia Code', monospace", fontSize: '12.5px', lineHeight: 1.6 }}
                />
              </div>

              <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(73, 204, 144, 0.08)', border: '1px solid rgba(73, 204, 144, 0.2)' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                  <strong style={{ color: '#49cc90' }}>Prerequisite:</strong> Install PnP PowerShell with <code>Install-Module PnP.PowerShell</code>. Register an Entra ID app or use <code>-Interactive</code> flag for browser-based authentication.
                </p>
              </div>
            </div>
          </div>

          <section className="tool-info" style={{ marginTop: '4rem' }}>
            <h2>What is PnP PowerShell?</h2>
            <p>
              <strong>PnP PowerShell</strong> is an open-source, cross-platform PowerShell module with 700+ cmdlets for managing SharePoint Online, Microsoft Teams, and other Microsoft 365 services. It's the most popular tool for SharePoint administration and automation.
            </p>
            <h3>Getting Started</h3>
            <ul>
              <li><strong>Install:</strong> <code>Install-Module PnP.PowerShell -Scope CurrentUser</code></li>
              <li><strong>Connect:</strong> <code>Connect-PnPOnline -Url "https://tenant.sharepoint.com" -Interactive</code></li>
              <li><strong>Verify:</strong> <code>Get-PnPWeb</code> — should return your site title</li>
            </ul>
            <h3>Why PnP over Standard SharePoint PowerShell?</h3>
            <ul>
              <li>700+ cmdlets vs ~120 in SharePoint Management Shell</li>
              <li>Cross-platform (Windows, macOS, Linux)</li>
              <li>Supports batching for high-performance bulk operations</li>
              <li>Active community — monthly releases and community calls</li>
            </ul>
          </section>

          <ToolFAQ slug="pnp-script-generator" />

          <AdSlot type="leaderboard" />

          <RelatedTools currentSlug="pnp-script-generator" />
        </div>
      </div>
    </>
  )
}