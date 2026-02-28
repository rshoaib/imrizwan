import { useState, useEffect } from 'react'
import { getAllTasks, createTask, updateTask, type Task, type BugStatus, type NewTask } from '../lib/taskService'
import SEO from '../components/SEO'

const PROJECTS = ['Azan Time', 'EasyOrder Bot']

const BUG_STATUSES: { key: BugStatus; label: string; icon: string }[] = [
    { key: 'open', label: 'Open', icon: '🐛' },
    { key: 'fixed', label: 'Fixed', icon: '🔧' },
    { key: 'closed', label: 'Closed', icon: '✅' },
]

const PRIORITY_LABELS: Record<Task['priority'], string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
}

type Role = 'tester' | 'developer'

// Map old statuses to new bug statuses
function toBugStatus(status: string): BugStatus {
    if (status === 'fixed') return 'fixed'
    if (status === 'closed' || status === 'done') return 'closed'
    return 'open' // todo, in_progress, testing, blocked, open all map to 'open'
}

function timeAgo(dateStr: string): string {
    const now = new Date()
    const date = new Date(dateStr)
    const diffMs = now.getTime() - date.getTime()
    const mins = Math.floor(diffMs / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
}

export default function TaskBoard() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [role, setRole] = useState<Role>(() =>
        (localStorage.getItem('bug_board_role') as Role) || 'tester'
    )
    const [filterProject, setFilterProject] = useState('')
    const [showBugForm, setShowBugForm] = useState(false)
    const [selectedBug, setSelectedBug] = useState<Task | null>(null)
    const [fixNotes, setFixNotes] = useState('')
    const [saving, setSaving] = useState(false)

    // Bug form state
    const [bugTitle, setBugTitle] = useState('')
    const [bugDesc, setBugDesc] = useState('')
    const [bugProject, setBugProject] = useState(PROJECTS[0])
    const [bugPriority, setBugPriority] = useState<Task['priority']>('medium')

    useEffect(() => {
        loadTasks()
    }, [])

    useEffect(() => {
        localStorage.setItem('bug_board_role', role)
    }, [role])

    async function loadTasks() {
        setLoading(true)
        const data = await getAllTasks()
        setTasks(data)
        setLoading(false)
    }

    function resetBugForm() {
        setBugTitle('')
        setBugDesc('')
        setBugProject(PROJECTS[0])
        setBugPriority('medium')
        setShowBugForm(false)
    }

    async function handleLogBug(e: React.FormEvent) {
        e.preventDefault()
        if (!bugTitle.trim()) return
        setSaving(true)
        const newTask: NewTask = {
            title: bugTitle,
            description: bugDesc,
            priority: bugPriority,
            app_name: bugProject,
            assigned_to: 'Tester',
            status: 'open',
        }
        const created = await createTask(newTask)
        if (created) {
            setTasks(prev => [created, ...prev])
        }
        resetBugForm()
        setSaving(false)
    }

    async function handleMoveTo(task: Task, newStatus: BugStatus) {
        setSaving(true)
        const updates: Record<string, string> = { status: newStatus }
        if (newStatus === 'fixed' && fixNotes.trim()) {
            updates.notes = (task.notes ? task.notes + '\n\n' : '') + `[Fix] ${fixNotes}`
        }
        const updated = await updateTask(task.id, updates)
        if (updated) {
            setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
            setSelectedBug(null)
            setFixNotes('')
        }
        setSaving(false)
    }

    // Filter & group
    const filteredTasks = filterProject
        ? tasks.filter(t => t.app_name === filterProject)
        : tasks

    const columns = BUG_STATUSES.map(s => ({
        ...s,
        bugs: filteredTasks.filter(t => toBugStatus(t.status) === s.key),
    }))

    return (
        <>
            <SEO title="Bug Tracker — Board" description="Simple bug tracking board" />
            <div className="board-page">
                {/* Header */}
                <div className="board-header container">
                    <div>
                        <h1 className="board-title">🐛 Bug Tracker</h1>
                        <p className="board-subtitle">
                            {role === 'tester' ? 'Log bugs & verify fixes' : 'Pick bugs & mark as fixed'}
                        </p>
                    </div>
                    <div className="board-controls">
                        {/* Role Switcher */}
                        <div className="bug-role-switch">
                            <button
                                className={`bug-role-btn ${role === 'tester' ? 'bug-role-btn--active' : ''}`}
                                onClick={() => setRole('tester')}
                            >
                                🧪 Tester
                            </button>
                            <button
                                className={`bug-role-btn ${role === 'developer' ? 'bug-role-btn--active' : ''}`}
                                onClick={() => setRole('developer')}
                            >
                                💻 Developer
                            </button>
                        </div>

                        {/* Project Filter */}
                        <select
                            className="board-filter"
                            value={filterProject}
                            onChange={e => setFilterProject(e.target.value)}
                        >
                            <option value="">All Projects</option>
                            {PROJECTS.map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>

                        {/* Actions */}
                        {role === 'tester' && (
                            <button
                                className="tasks-btn tasks-btn--primary"
                                onClick={() => setShowBugForm(true)}
                            >
                                + Log Bug
                            </button>
                        )}
                        <button className="tasks-btn tasks-btn--ghost" onClick={loadTasks}>🔄</button>
                    </div>
                </div>

                {/* Bug Log Form */}
                {showBugForm && (
                    <div className="tasks-form-overlay" onClick={() => resetBugForm()}>
                        <form className="tasks-form" onClick={e => e.stopPropagation()} onSubmit={handleLogBug}>
                            <h2 className="tasks-form__title">🐛 Log a Bug</h2>

                            <div className="tasks-form__field">
                                <label htmlFor="bug-title">Bug Title *</label>
                                <input
                                    id="bug-title"
                                    type="text"
                                    value={bugTitle}
                                    onChange={e => setBugTitle(e.target.value)}
                                    placeholder="e.g. Prayer time shows wrong timezone"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="tasks-form__field">
                                <label htmlFor="bug-desc">Steps to Reproduce / Details</label>
                                <textarea
                                    id="bug-desc"
                                    value={bugDesc}
                                    onChange={e => setBugDesc(e.target.value)}
                                    placeholder="1. Open the app&#10;2. Go to settings&#10;3. Notice the bug..."
                                    rows={4}
                                />
                            </div>

                            <div className="tasks-form__row">
                                <div className="tasks-form__field">
                                    <label htmlFor="bug-project">Project</label>
                                    <select
                                        id="bug-project"
                                        value={bugProject}
                                        onChange={e => setBugProject(e.target.value)}
                                    >
                                        {PROJECTS.map(p => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="tasks-form__field">
                                    <label htmlFor="bug-priority">Priority</label>
                                    <select
                                        id="bug-priority"
                                        value={bugPriority}
                                        onChange={e => setBugPriority(e.target.value as Task['priority'])}
                                    >
                                        {(['low', 'medium', 'high', 'critical'] as Task['priority'][]).map(p => (
                                            <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="tasks-form__actions">
                                <button type="button" className="tasks-btn tasks-btn--ghost" onClick={resetBugForm}>Cancel</button>
                                <button type="submit" className="tasks-btn tasks-btn--primary" disabled={saving}>
                                    {saving ? 'Logging...' : '🐛 Log Bug'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Kanban Board */}
                {loading ? (
                    <div className="tasks-loading">Loading bugs...</div>
                ) : (
                    <div className="board-kanban container">
                        {columns.map(col => (
                            <div key={col.key} className={`board-column board-column--${col.key}`}>
                                <div className="board-column__header">
                                    <span className="board-column__title">{col.icon} {col.label}</span>
                                    <span className="board-column__count">{col.bugs.length}</span>
                                </div>
                                <div className="board-column__cards">
                                    {col.bugs.map(bug => (
                                        <div
                                            key={bug.id}
                                            className={`board-card board-card--${bug.priority}`}
                                            onClick={() => { setSelectedBug(bug); setFixNotes('') }}
                                        >
                                            <div className="board-card__top">
                                                <span className={`tasks-priority tasks-priority--${bug.priority}`}>
                                                    {PRIORITY_LABELS[bug.priority]}
                                                </span>
                                                <span className="board-card__time">{timeAgo(bug.created_at)}</span>
                                            </div>
                                            <h3 className="board-card__title">{bug.title}</h3>
                                            {bug.app_name && <span className="tasks-app-badge">{bug.app_name}</span>}
                                            {bug.description && (
                                                <p className="board-card__desc">
                                                    {bug.description.substring(0, 80)}{bug.description.length > 80 ? '…' : ''}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                    {col.bugs.length === 0 && (
                                        <div className="board-column__empty">
                                            {col.key === 'open' ? 'No open bugs 🎉' : col.key === 'fixed' ? 'Nothing to verify' : 'No closed bugs yet'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Bug Detail Panel */}
                {selectedBug && (
                    <div className="board-panel-overlay" onClick={() => setSelectedBug(null)}>
                        <div className="board-panel" onClick={e => e.stopPropagation()}>
                            <div className="board-panel__header">
                                <h2>{selectedBug.title}</h2>
                                <button className="board-panel__close" onClick={() => setSelectedBug(null)}>✕</button>
                            </div>

                            <div className="board-panel__body">
                                <div className="board-panel__meta">
                                    <span className={`tasks-priority tasks-priority--${selectedBug.priority}`}>
                                        {PRIORITY_LABELS[selectedBug.priority]}
                                    </span>
                                    {selectedBug.app_name && <span className="tasks-app-badge">{selectedBug.app_name}</span>}
                                    <span className="bug-detail__time">Logged {timeAgo(selectedBug.created_at)}</span>
                                </div>

                                {selectedBug.description && (
                                    <div className="board-panel__section">
                                        <h3>📝 Description</h3>
                                        <p className="board-panel__text">{selectedBug.description}</p>
                                    </div>
                                )}

                                {selectedBug.notes && (
                                    <div className="board-panel__section">
                                        <h3>💬 Notes</h3>
                                        <p className="board-panel__text" style={{ whiteSpace: 'pre-wrap' }}>{selectedBug.notes}</p>
                                    </div>
                                )}

                                {/* Developer: Fix notes when marking as fixed */}
                                {role === 'developer' && toBugStatus(selectedBug.status) === 'open' && (
                                    <div className="board-panel__section">
                                        <h3>🔧 Fix Notes (optional)</h3>
                                        <textarea
                                            className="board-panel__textarea"
                                            value={fixNotes}
                                            onChange={e => setFixNotes(e.target.value)}
                                            placeholder="What did you fix? e.g. Updated timezone offset calculation..."
                                            rows={3}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="board-panel__footer">
                                {/* Role-based actions */}
                                {role === 'tester' && toBugStatus(selectedBug.status) === 'fixed' && (
                                    <>
                                        <button
                                            className="tasks-btn tasks-btn--danger"
                                            onClick={() => handleMoveTo(selectedBug, 'open')}
                                            disabled={saving}
                                        >
                                            🔄 Reopen
                                        </button>
                                        <button
                                            className="tasks-btn tasks-btn--success"
                                            onClick={() => handleMoveTo(selectedBug, 'closed')}
                                            disabled={saving}
                                        >
                                            ✅ Verified & Close
                                        </button>
                                    </>
                                )}

                                {role === 'developer' && toBugStatus(selectedBug.status) === 'open' && (
                                    <button
                                        className="tasks-btn tasks-btn--primary"
                                        onClick={() => handleMoveTo(selectedBug, 'fixed')}
                                        disabled={saving}
                                    >
                                        {saving ? 'Saving...' : '🔧 Mark as Fixed'}
                                    </button>
                                )}

                                {toBugStatus(selectedBug.status) === 'closed' && (
                                    <span className="bug-closed-badge">✅ This bug is closed</span>
                                )}

                                <button className="tasks-btn tasks-btn--ghost" onClick={() => setSelectedBug(null)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
