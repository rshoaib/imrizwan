import { useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import RelatedTools from '../components/RelatedTools'

/* ───────────── Types ───────────── */

type ActionType =
  | 'createSPList'
  | 'addSPField'
  | 'addSPView'
  | 'addContentType'
  | 'setSiteLogo'
  | 'applyTheme'
  | 'setRegionalSettings'
  | 'addNavLink'
  | 'setSiteExternalSharingCapability'
  | 'triggerFlow'
  | 'installSolution'

interface ActionDef {
  type: ActionType
  label: string
  emoji: string
  description: string
  fields: FieldDef[]
}

interface FieldDef {
  key: string
  label: string
  placeholder: string
  type: 'text' | 'select' | 'number' | 'boolean'
  options?: { value: string; label: string }[]
  defaultValue: string
}

interface ActionInstance {
  id: string
  type: ActionType
  values: Record<string, string>
}

/* ───────────── Action Templates ───────────── */

const ACTION_TEMPLATES: ActionDef[] = [
  {
    type: 'createSPList',
    label: 'Create List',
    emoji: '📋',
    description: 'Create a new SharePoint list or library',
    fields: [
      { key: 'listName', label: 'List Name', placeholder: 'Project Tasks', type: 'text', defaultValue: 'Project Tasks' },
      { key: 'templateType', label: 'Template', type: 'select', placeholder: '', defaultValue: '100', options: [
        { value: '100', label: 'Custom List (100)' },
        { value: '101', label: 'Document Library (101)' },
        { value: '104', label: 'Announcements (104)' },
        { value: '106', label: 'Calendar (106)' },
        { value: '107', label: 'Tasks (107)' },
        { value: '108', label: 'Discussion Board (108)' },
        { value: '109', label: 'Picture Library (109)' },
        { value: '119', label: 'Site Pages (119)' },
      ]},
    ],
  },
  {
    type: 'addSPField',
    label: 'Add Column',
    emoji: '➕',
    description: 'Add a site column to a list',
    fields: [
      { key: 'fieldType', label: 'Field Type', type: 'select', placeholder: '', defaultValue: 'Text', options: [
        { value: 'Text', label: 'Single Line Text' },
        { value: 'Note', label: 'Multi-Line Text' },
        { value: 'Number', label: 'Number' },
        { value: 'DateTime', label: 'Date/Time' },
        { value: 'Boolean', label: 'Yes/No' },
        { value: 'Choice', label: 'Choice' },
        { value: 'User', label: 'Person or Group' },
        { value: 'Currency', label: 'Currency' },
        { value: 'URL', label: 'Hyperlink' },
      ]},
      { key: 'displayName', label: 'Display Name', placeholder: 'Status', type: 'text', defaultValue: 'Status' },
      { key: 'internalName', label: 'Internal Name', placeholder: 'Status', type: 'text', defaultValue: 'Status' },
      { key: 'isRequired', label: 'Required', type: 'boolean', placeholder: '', defaultValue: 'false' },
    ],
  },
  {
    type: 'addSPView',
    label: 'Add View',
    emoji: '👁️',
    description: 'Add a custom view to a list',
    fields: [
      { key: 'name', label: 'View Name', placeholder: 'Active Items', type: 'text', defaultValue: 'Active Items' },
      { key: 'viewFields', label: 'View Fields (comma separated)', placeholder: 'Title, Status, DueDate', type: 'text', defaultValue: 'Title, Status, DueDate' },
      { key: 'query', label: 'CAML Query (Where clause)', placeholder: '', type: 'text', defaultValue: '' },
      { key: 'rowLimit', label: 'Row Limit', placeholder: '30', type: 'number', defaultValue: '30' },
      { key: 'isPaged', label: 'Enable Paging', type: 'boolean', placeholder: '', defaultValue: 'true' },
      { key: 'makeDefault', label: 'Set as Default View', type: 'boolean', placeholder: '', defaultValue: 'false' },
    ],
  },
  {
    type: 'addContentType',
    label: 'Add Content Type',
    emoji: '📄',
    description: 'Associate a site content type to a list',
    fields: [
      { key: 'name', label: 'Content Type Name', placeholder: 'Document Set', type: 'text', defaultValue: 'Document Set' },
    ],
  },
  {
    type: 'setSiteLogo',
    label: 'Set Site Logo',
    emoji: '🖼️',
    description: 'Set the site logo URL',
    fields: [
      { key: 'url', label: 'Logo URL', placeholder: '/sites/MySite/SiteAssets/logo.png', type: 'text', defaultValue: '/sites/MySite/SiteAssets/logo.png' },
    ],
  },
  {
    type: 'applyTheme',
    label: 'Apply Theme',
    emoji: '🎨',
    description: 'Apply a named theme to the site',
    fields: [
      { key: 'themeName', label: 'Theme Name', placeholder: 'Red', type: 'text', defaultValue: 'Contoso Blue' },
    ],
  },
  {
    type: 'setRegionalSettings',
    label: 'Regional Settings',
    emoji: '🌍',
    description: 'Set the site time zone and locale',
    fields: [
      { key: 'timeZone', label: 'Time Zone ID', placeholder: '13', type: 'number', defaultValue: '13' },
      { key: 'locale', label: 'Locale ID', placeholder: '1033', type: 'number', defaultValue: '1033' },
      { key: 'sortOrder', label: 'Sort Order', placeholder: '25', type: 'number', defaultValue: '25' },
    ],
  },
  {
    type: 'addNavLink',
    label: 'Add Nav Link',
    emoji: '🔗',
    description: 'Add a link to the site navigation',
    fields: [
      { key: 'displayName', label: 'Display Name', placeholder: 'My Page', type: 'text', defaultValue: 'My Page' },
      { key: 'url', label: 'URL', placeholder: '/sites/MySite/SitePages/MyPage.aspx', type: 'text', defaultValue: '/sites/MySite/SitePages/MyPage.aspx' },
      { key: 'isWebRelative', label: 'Web Relative', type: 'boolean', placeholder: '', defaultValue: 'true' },
    ],
  },
  {
    type: 'setSiteExternalSharingCapability',
    label: 'External Sharing',
    emoji: '🔒',
    description: 'Set the external sharing capability',
    fields: [
      { key: 'capability', label: 'Capability', type: 'select', placeholder: '', defaultValue: 'Disabled', options: [
        { value: 'Disabled', label: 'Disabled' },
        { value: 'ExistingExternalUserSharingOnly', label: 'Existing Guests Only' },
        { value: 'ExternalUserSharingOnly', label: 'New & Existing Guests' },
        { value: 'ExternalUserAndGuestSharing', label: 'Anyone (incl. anonymous)' },
      ]},
    ],
  },
  {
    type: 'triggerFlow',
    label: 'Trigger Flow',
    emoji: '⚡',
    description: 'Trigger a Power Automate flow',
    fields: [
      { key: 'url', label: 'Flow Trigger URL', placeholder: 'https://prod-xx.logic.azure.com/...', type: 'text', defaultValue: '' },
      { key: 'name', label: 'Flow Name', placeholder: 'Provisioning Flow', type: 'text', defaultValue: 'Provisioning Flow' },
    ],
  },
  {
    type: 'installSolution',
    label: 'Install SPFx Solution',
    emoji: '📦',
    description: 'Install an SPFx solution from the app catalog',
    fields: [
      { key: 'id', label: 'Solution ID (GUID)', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', type: 'text', defaultValue: '' },
    ],
  },
]

/* ───────────── JSON Generator ───────────── */

function generateSiteScript(actions: ActionInstance[]): string {
  const scriptActions = actions.map(a => {
    const def = ACTION_TEMPLATES.find(d => d.type === a.type)!
    switch (a.type) {
      case 'createSPList': {
        const subActions: Record<string, unknown>[] = []
        // Gather sub-actions that reference this list
        return {
          verb: 'createSPList',
          listName: a.values.listName || 'New List',
          templateType: parseInt(a.values.templateType || '100'),
          subactions: subActions.length > 0 ? subActions : undefined,
        }
      }
      case 'addSPField':
        return {
          verb: 'addSPField',
          fieldType: a.values.fieldType || 'Text',
          displayName: a.values.displayName || 'New Column',
          internalName: (a.values.internalName || a.values.displayName || 'NewColumn').replace(/\s/g, ''),
          isRequired: a.values.isRequired === 'true',
        }
      case 'addSPView': {
        const viewFields = (a.values.viewFields || 'Title').split(',').map(f => f.trim()).filter(Boolean)
        const viewObj: Record<string, unknown> = {
          verb: 'addSPView',
          name: a.values.name || 'Custom View',
          viewFields,
          query: a.values.query || '',
          rowLimit: parseInt(a.values.rowLimit || '30'),
          isPaged: a.values.isPaged === 'true',
          makeDefault: a.values.makeDefault === 'true',
        }
        if (!viewObj.query) delete viewObj.query
        return viewObj
      }
      case 'addContentType':
        return { verb: 'addContentType', name: a.values.name || 'Item' }
      case 'setSiteLogo':
        return { verb: 'setSiteLogo', url: a.values.url || '' }
      case 'applyTheme':
        return { verb: 'applyTheme', themeName: a.values.themeName || '' }
      case 'setRegionalSettings':
        return {
          verb: 'setRegionalSettings',
          timeZone: parseInt(a.values.timeZone || '13'),
          locale: parseInt(a.values.locale || '1033'),
          sortOrder: parseInt(a.values.sortOrder || '25'),
        }
      case 'addNavLink':
        return {
          verb: 'addNavLink',
          url: a.values.url || '',
          displayName: a.values.displayName || '',
          isWebRelative: a.values.isWebRelative === 'true',
        }
      case 'setSiteExternalSharingCapability':
        return {
          verb: 'setSiteExternalSharingCapability',
          capability: a.values.capability || 'Disabled',
        }
      case 'triggerFlow':
        return {
          verb: 'triggerFlow',
          url: a.values.url || '',
          name: a.values.name || '',
        }
      case 'installSolution':
        return {
          verb: 'installSolution',
          id: a.values.id || '',
        }
      default:
        return { verb: def.type, ...a.values }
    }
  })

  const script = {
    "$schema": "https://developer.microsoft.com/json-schemas/sp/site-design-script-actions.schema.json",
    actions: scriptActions,
    version: 1,
  }

  return JSON.stringify(script, null, 2)
}

function generatePowerShell(json: string, designTitle: string): string {
  return `# 1. Add the Site Script
$siteScriptJson = '${json.replace(/'/g, "''")}'

$siteScript = Add-SPOSiteScript \\
  -Title "${designTitle} Script" \\
  -Content $siteScriptJson \\
  -Description "Auto-generated site script"

Write-Host "Site Script created: $($siteScript.Id)"

# 2. Create a Site Design that uses this script
Add-SPOSiteDesign \\
  -Title "${designTitle}" \\
  -WebTemplate "64" \\
  -SiteScripts $siteScript.Id \\
  -Description "Created via Site Script Generator"

Write-Host "Site Design created successfully!"`
}

/* ───────────── Component ───────────── */

export default function SiteScriptGenerator() {
  const [actions, setActions] = useState<ActionInstance[]>([])
  const [designTitle, setDesignTitle] = useState('My Site Design')
  const [activeTab, setActiveTab] = useState<'json' | 'powershell'>('json')
  const [copied, setCopied] = useState(false)

  const addAction = (type: ActionType) => {
    const def = ACTION_TEMPLATES.find(d => d.type === type)!
    const values: Record<string, string> = {}
    def.fields.forEach(f => { values[f.key] = f.defaultValue })
    setActions([...actions, { id: Date.now().toString(), type, values }])
  }

  const updateAction = (id: string, key: string, value: string) => {
    setActions(actions.map(a => a.id === id ? { ...a, values: { ...a.values, [key]: value } } : a))
  }

  const removeAction = (id: string) => {
    setActions(actions.filter(a => a.id !== id))
  }

  const moveAction = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= actions.length) return
    const updated = [...actions]
    const [moved] = updated.splice(index, 1)
    updated.splice(newIndex, 0, moved)
    setActions(updated)
  }

  const json = generateSiteScript(actions)
  const powershell = generatePowerShell(json, designTitle)

  const outputText = activeTab === 'json' ? json : powershell

  const handleCopy = async () => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'copy_clicked', { tool_name: 'site_script_generator', tab: activeTab })
    }
    try {
      await navigator.clipboard.writeText(outputText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = outputText
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const loadPreset = () => {
    setDesignTitle('Project Site')
    const now = Date.now()
    setActions([
      { id: `${now}`, type: 'createSPList', values: { listName: 'Project Tasks', templateType: '100' } },
      { id: `${now + 1}`, type: 'addSPField', values: { fieldType: 'Choice', displayName: 'Priority', internalName: 'Priority', isRequired: 'true' } },
      { id: `${now + 2}`, type: 'addSPField', values: { fieldType: 'DateTime', displayName: 'Due Date', internalName: 'DueDate', isRequired: 'false' } },
      { id: `${now + 3}`, type: 'addNavLink', values: { displayName: 'Project Tasks', url: 'Lists/ProjectTasks', isWebRelative: 'true' } },
      { id: `${now + 4}`, type: 'applyTheme', values: { themeName: 'Blue' } },
    ])
  }

  return (
    <>
      <SEO
        title="SharePoint Site Script Generator — Free Online Tool"
        description="Build SharePoint site scripts visually. Add actions like creating lists, adding columns, applying themes, and setting navigation. Generate JSON site scripts and PowerShell deployment code. No login required."
        url="/tools/site-script-generator"
        type="webapp"
      />

      <div className="container">
        <div className="tool-page glass-panel reveal-stagger">
          <nav className="tool-breadcrumb">
            <Link to="/tools">Tools</Link>
            <span className="tool-breadcrumb__sep">/</span>
            <span>Site Script Generator</span>
          </nav>

          <header className="tool-header">
            <div className="tool-header__icon">🏗️</div>
            <h1 className="tool-header__title">Site Script Generator</h1>
            <p className="tool-header__desc">
              Build SharePoint site scripts visually — add actions, configure settings,
              and export JSON site scripts with PowerShell deployment commands.
            </p>
          </header>

          <div className="tool-grid-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)', gap: '2rem', alignItems: 'start', marginTop: '2rem' }}>

            {/* Left: Builder */}
            <div className="site-script-builder">

              {/* Design Title */}
              <div className="tool-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 className="tool-section__label" style={{ margin: 0 }}>Site Design Title</h2>
                  <button
                    onClick={loadPreset}
                    style={{
                      padding: '0.3rem 0.75rem', fontSize: '12px', borderRadius: '6px', cursor: 'pointer',
                      background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-muted)',
                    }}
                  >📦 Load Preset</button>
                </div>
                <input
                  type="text" value={designTitle}
                  onChange={(e) => setDesignTitle(e.target.value)}
                  className="form-input" placeholder="My Site Design"
                  style={{ marginTop: '0.5rem' }}
                />
              </div>

              {/* Add Action Palette */}
              <div className="tool-section">
                <h2 className="tool-section__label">Add Actions</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {ACTION_TEMPLATES.map(at => (
                    <button
                      key={at.type}
                      onClick={() => addAction(at.type)}
                      title={at.description}
                      style={{
                        padding: '0.35rem 0.65rem', fontSize: '12px', borderRadius: '6px', cursor: 'pointer',
                        background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)',
                        display: 'flex', alignItems: 'center', gap: '0.3rem', transition: 'all 0.15s',
                      }}
                    >
                      <span>{at.emoji}</span> {at.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action List */}
              <div className="tool-section">
                <h2 className="tool-section__label">Actions ({actions.length})</h2>
                {actions.length === 0 && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '2rem 0' }}>
                    Click an action above to add it to your site script
                  </p>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {actions.map((action, index) => {
                    const def = ACTION_TEMPLATES.find(d => d.type === action.type)!
                    return (
                      <div key={action.id} className="glass-card" style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600 }}>
                            <span style={{ marginRight: '0.4rem' }}>{def.emoji}</span>
                            {def.label}
                          </span>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button onClick={() => moveAction(index, -1)} disabled={index === 0}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', opacity: index === 0 ? 0.3 : 1, fontSize: '14px' }}>↑</button>
                            <button onClick={() => moveAction(index, 1)} disabled={index === actions.length - 1}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', opacity: index === actions.length - 1 ? 0.3 : 1, fontSize: '14px' }}>↓</button>
                            <button onClick={() => removeAction(action.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f93e3e', fontSize: '14px' }}>✕</button>
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                          {def.fields.map(field => (
                            <div key={field.key} className="form-group" style={{ marginBottom: 0, gridColumn: field.type === 'text' && field.key.includes('url') ? '1/-1' : undefined }}>
                              <label className="form-label" style={{ fontSize: '11px' }}>{field.label}</label>
                              {field.type === 'select' ? (
                                <select
                                  value={action.values[field.key] || ''}
                                  onChange={(e) => updateAction(action.id, field.key, e.target.value)}
                                  className="form-input" style={{ fontSize: '12px', height: '32px' }}
                                >
                                  {field.options!.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                              ) : field.type === 'boolean' ? (
                                <select
                                  value={action.values[field.key] || 'false'}
                                  onChange={(e) => updateAction(action.id, field.key, e.target.value)}
                                  className="form-input" style={{ fontSize: '12px', height: '32px' }}
                                >
                                  <option value="true">Yes</option>
                                  <option value="false">No</option>
                                </select>
                              ) : (
                                <input
                                  type={field.type}
                                  value={action.values[field.key] || ''}
                                  onChange={(e) => updateAction(action.id, field.key, e.target.value)}
                                  className="form-input" style={{ fontSize: '12px', height: '32px' }}
                                  placeholder={field.placeholder}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right: Output */}
            <div className="site-script-output" style={{ position: 'sticky', top: '5rem' }}>
              <div style={{ display: 'flex', gap: '0', marginBottom: '0', borderBottom: '1px solid var(--border)' }}>
                {([{ key: 'json', label: 'Site Script JSON' }, { key: 'powershell', label: 'PowerShell' }] as const).map(tab => (
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

              <div className="formatter-editor" style={{ height: '500px', backgroundColor: '#1e1e1e', borderRadius: '0 0 8px 8px' }}>
                <textarea
                  readOnly
                  value={outputText}
                  className="formatter-textarea"
                  style={{ whiteSpace: 'pre', color: '#d4d4d4', fontFamily: "'Fira Code', 'Cascadia Code', monospace", fontSize: '12.5px', lineHeight: 1.6 }}
                />
              </div>
            </div>
          </div>

          <section className="tool-info" style={{ marginTop: '4rem' }}>
            <h2>What are Site Scripts?</h2>
            <p>
              <strong>Site Scripts</strong> are JSON files that define a set of provisioning actions SharePoint should execute when a site is created. They automate the setup of lists, columns, themes, navigation, and more — so every new site starts with the same structure.
            </p>
            <h3>How Site Designs Work</h3>
            <ul>
              <li><strong>Site Script:</strong> The JSON definition of actions (what to create)</li>
              <li><strong>Site Design:</strong> A package that references one or more site scripts and appears in the site creation dialog</li>
              <li><strong>Deployment:</strong> Use <code>Add-SPOSiteScript</code> and <code>Add-SPOSiteDesign</code> via SharePoint Online Management Shell or PnP PowerShell</li>
            </ul>
            <h3>Supported Actions</h3>
            <p>
              Actions include creating lists, adding columns, applying themes, setting navigation, configuring regional settings, triggering Power Automate flows, and installing SPFx solutions. Each action maps to a <code>verb</code> in the JSON schema.
            </p>
          </section>

          <RelatedTools currentSlug="site-script-generator" />
        </div>
      </div>
    </>
  )
}
