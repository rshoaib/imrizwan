import { useState, useEffect } from 'react'
import { getAllTasks, updateTask, type Task } from '../lib/taskService'
import SEO from '../components/SEO'

const STATUSES: Task['status'][] = ['todo', 'in_progress', 'testing', 'done', 'blocked']

const STATUS_LABELS: Record<Task['status'], string> = {
    todo: '📋 To Do',
    in_progress: '🔨 In Progress',
    testing: '🧪 Testing',
    done: '✅ Done',
    blocked: '🚫 Blocked',
}

const PRIORITY_LABELS: Record<Task['priority'], string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
}

const TEST_RESULTS: { value: Task['test_result']; label: string }[] = [
    { value: '', label: 'Not Tested' },
    { value: 'pass', label: '✅ Pass' },
    { value: 'fail', label: '❌ Fail' },
    { value: 'partial', label: '⚠️ Partial' },
]

export default function TaskBoard() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [filterApp, setFilterApp] = useState('')

    // Editable fields for selected task
    const [editStatus, setEditStatus] = useState<Task['status']>('todo')
    const [editTestCases, setEditTestCases] = useState('')
    const [editTestResult, setEditTestResult] = useState<Task['test_result']>('')
    const [editNotes, setEditNotes] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        loadTasks()
    }, [])

    async function loadTasks() {
        setLoading(true)
        const data = await getAllTasks()
        setTasks(data)
        setLoading(false)
    }

    function openTask(task: Task) {
        setSelectedTask(task)
        setEditStatus(task.status)
        setEditTestCases(task.test_cases)
        setEditTestResult(task.test_result)
        setEditNotes(task.notes)
    }

    function closeTask() {
        setSelectedTask(null)
    }

    async function handleSave() {
        if (!selectedTask) return
        setSaving(true)
        const updated = await updateTask(selectedTask.id, {
            status: editStatus,
            test_cases: editTestCases,
            test_result: editTestResult,
            notes: editNotes,
        })
        if (updated) {
            setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
            setSelectedTask(updated)
        }
        setSaving(false)
    }

    // Get unique app names for filter
    const appNames = [...new Set(tasks.map(t => t.app_name).filter(Boolean))]

    // Filter tasks
    const filteredTasks = filterApp
        ? tasks.filter(t => t.app_name === filterApp)
        : tasks

    // Group by status for kanban
    const columns = STATUSES.map(status => ({
        status,
        label: STATUS_LABELS[status],
        tasks: filteredTasks.filter(t => t.status === status),
    }))

    return (
        <>
            <SEO title="Task Board — Tester" description="Tester task board" />
            <div className="board-page">
                <div className="board-header container">
                    <div>
                        <h1 className="board-title">🧪 Tester Board</h1>
                        <p className="board-subtitle">Click any task to write test cases and update results</p>
                    </div>
                    <div className="board-controls">
                        {appNames.length > 0 && (
                            <select
                                className="board-filter"
                                value={filterApp}
                                onChange={e => setFilterApp(e.target.value)}
                            >
                                <option value="">All Apps</option>
                                {appNames.map(app => (
                                    <option key={app} value={app}>{app}</option>
                                ))}
                            </select>
                        )}
                        <button className="tasks-btn tasks-btn--ghost" onClick={loadTasks}>🔄 Refresh</button>
                    </div>
                </div>

                {loading ? (
                    <div className="tasks-loading">Loading board...</div>
                ) : tasks.length === 0 ? (
                    <div className="tasks-empty">
                        <p>No tasks assigned yet. Ask Rizwan to create some tasks.</p>
                    </div>
                ) : (
                    <div className="board-kanban container">
                        {columns.map(col => (
                            <div key={col.status} className={`board-column board-column--${col.status}`}>
                                <div className="board-column__header">
                                    <span className="board-column__title">{col.label}</span>
                                    <span className="board-column__count">{col.tasks.length}</span>
                                </div>
                                <div className="board-column__cards">
                                    {col.tasks.map(task => (
                                        <div
                                            key={task.id}
                                            className={`board-card board-card--${task.priority}`}
                                            onClick={() => openTask(task)}
                                        >
                                            <div className="board-card__top">
                                                <span className={`tasks-priority tasks-priority--${task.priority}`}>
                                                    {PRIORITY_LABELS[task.priority]}
                                                </span>
                                                {task.test_result && (
                                                    <span className={`tasks-result tasks-result--${task.test_result}`}>
                                                        {task.test_result.toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="board-card__title">{task.title}</h3>
                                            {task.app_name && <span className="tasks-app-badge">{task.app_name}</span>}
                                            {task.description && (
                                                <p className="board-card__desc">
                                                    {task.description.substring(0, 100)}{task.description.length > 100 ? '…' : ''}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                    {col.tasks.length === 0 && (
                                        <div className="board-column__empty">No tasks</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Task Detail Panel */}
                {selectedTask && (
                    <div className="board-panel-overlay" onClick={closeTask}>
                        <div className="board-panel" onClick={e => e.stopPropagation()}>
                            <div className="board-panel__header">
                                <h2>{selectedTask.title}</h2>
                                <button className="board-panel__close" onClick={closeTask}>✕</button>
                            </div>

                            <div className="board-panel__body">
                                <div className="board-panel__meta">
                                    <span className={`tasks-priority tasks-priority--${selectedTask.priority}`}>
                                        {PRIORITY_LABELS[selectedTask.priority]}
                                    </span>
                                    {selectedTask.app_name && <span className="tasks-app-badge">{selectedTask.app_name}</span>}
                                </div>

                                {selectedTask.description && (
                                    <div className="board-panel__section">
                                        <h3>📝 Description</h3>
                                        <p className="board-panel__text">{selectedTask.description}</p>
                                    </div>
                                )}

                                <div className="board-panel__section">
                                    <h3>📊 Status</h3>
                                    <div className="board-panel__status-grid">
                                        {STATUSES.map(s => (
                                            <button
                                                key={s}
                                                className={`board-panel__status-btn ${editStatus === s ? 'board-panel__status-btn--active' : ''} board-panel__status-btn--${s}`}
                                                onClick={() => setEditStatus(s)}
                                            >
                                                {STATUS_LABELS[s]}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="board-panel__section">
                                    <h3>🧪 Test Cases</h3>
                                    <textarea
                                        className="board-panel__textarea"
                                        value={editTestCases}
                                        onChange={e => setEditTestCases(e.target.value)}
                                        placeholder="Write your test cases here...&#10;&#10;1. Open the app&#10;2. Click on Login&#10;3. Enter credentials&#10;4. Verify dashboard loads"
                                        rows={8}
                                    />
                                </div>

                                <div className="board-panel__section">
                                    <h3>✅ Test Result</h3>
                                    <div className="board-panel__result-grid">
                                        {TEST_RESULTS.map(r => (
                                            <button
                                                key={r.value}
                                                className={`board-panel__result-btn ${editTestResult === r.value ? 'board-panel__result-btn--active' : ''} board-panel__result-btn--${r.value || 'none'}`}
                                                onClick={() => setEditTestResult(r.value)}
                                            >
                                                {r.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="board-panel__section">
                                    <h3>💬 Notes</h3>
                                    <textarea
                                        className="board-panel__textarea"
                                        value={editNotes}
                                        onChange={e => setEditNotes(e.target.value)}
                                        placeholder="Any additional notes, bugs found, screenshots needed..."
                                        rows={4}
                                    />
                                </div>
                            </div>

                            <div className="board-panel__footer">
                                <button className="tasks-btn tasks-btn--ghost" onClick={closeTask}>Cancel</button>
                                <button className="tasks-btn tasks-btn--primary" onClick={handleSave} disabled={saving}>
                                    {saving ? 'Saving...' : '💾 Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
