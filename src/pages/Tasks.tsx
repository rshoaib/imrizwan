import { useState, useEffect } from 'react'
import { getAllTasks, createTask, updateTask, deleteTask, type Task, type NewTask } from '../lib/taskService'
import SEO from '../components/SEO'

const PRIORITIES: Task['priority'][] = ['low', 'medium', 'high', 'critical']
const STATUSES: Task['status'][] = ['todo', 'in_progress', 'testing', 'done', 'blocked']

const STATUS_LABELS: Record<Task['status'], string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    testing: 'Testing',
    done: 'Done',
    blocked: 'Blocked',
    open: 'Open',
    fixed: 'Fixed',
    closed: 'Closed',
}

const PRIORITY_LABELS: Record<Task['priority'], string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
}

export default function Tasks() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)

    // Form state
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState<Task['priority']>('medium')
    const [appName, setAppName] = useState('')

    useEffect(() => {
        loadTasks()
    }, [])

    async function loadTasks() {
        setLoading(true)
        const data = await getAllTasks()
        setTasks(data)
        setLoading(false)
    }

    function resetForm() {
        setTitle('')
        setDescription('')
        setPriority('medium')
        setAppName('')
        setEditingTask(null)
        setShowForm(false)
    }

    function openEditForm(task: Task) {
        setTitle(task.title)
        setDescription(task.description)
        setPriority(task.priority)
        setAppName(task.app_name)
        setEditingTask(task)
        setShowForm(true)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!title.trim()) return

        if (editingTask) {
            const updated = await updateTask(editingTask.id, {
                title,
                description,
                priority,
                app_name: appName,
            })
            if (updated) {
                setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
            }
        } else {
            const newTask: NewTask = { title, description, priority, app_name: appName }
            const created = await createTask(newTask)
            if (created) {
                setTasks(prev => [created, ...prev])
            }
        }
        resetForm()
    }

    async function handleDelete(id: number) {
        if (!confirm('Delete this task?')) return
        const ok = await deleteTask(id)
        if (ok) {
            setTasks(prev => prev.filter(t => t.id !== id))
        }
    }

    async function handleStatusChange(task: Task, newStatus: Task['status']) {
        const updated = await updateTask(task.id, { status: newStatus })
        if (updated) {
            setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
        }
    }

    // Stats
    const stats = STATUSES.map(s => ({
        status: s,
        label: STATUS_LABELS[s],
        count: tasks.filter(t => t.status === s).length,
    }))

    return (
        <>
            <SEO title="Task Manager — imrizwan" description="Internal task management" />
            <div className="tasks-page container">
                <div className="tasks-header">
                    <div>
                        <h1 className="tasks-title">📋 Task Manager</h1>
                        <p className="tasks-subtitle">Assign and track testing tasks</p>
                    </div>
                    <button className="tasks-btn tasks-btn--primary" onClick={() => { resetForm(); setShowForm(true) }}>
                        + New Task
                    </button>
                </div>

                {/* Stats bar */}
                <div className="tasks-stats">
                    {stats.map(s => (
                        <div key={s.status} className={`tasks-stat tasks-stat--${s.status}`}>
                            <span className="tasks-stat__count">{s.count}</span>
                            <span className="tasks-stat__label">{s.label}</span>
                        </div>
                    ))}
                </div>

                {/* Create/Edit Form */}
                {showForm && (
                    <div className="tasks-form-overlay" onClick={() => resetForm()}>
                        <form className="tasks-form" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
                            <h2 className="tasks-form__title">{editingTask ? 'Edit Task' : 'Create New Task'}</h2>

                            <div className="tasks-form__field">
                                <label htmlFor="task-title">Title *</label>
                                <input
                                    id="task-title"
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="e.g. Test login flow on MyCalcFinance"
                                    required
                                />
                            </div>

                            <div className="tasks-form__field">
                                <label htmlFor="task-desc">Description</label>
                                <textarea
                                    id="task-desc"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Detailed instructions for the tester..."
                                    rows={4}
                                />
                            </div>

                            <div className="tasks-form__row">
                                <div className="tasks-form__field">
                                    <label htmlFor="task-priority">Priority</label>
                                    <select
                                        id="task-priority"
                                        value={priority}
                                        onChange={e => setPriority(e.target.value as Task['priority'])}
                                    >
                                        {PRIORITIES.map(p => (
                                            <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="tasks-form__field">
                                    <label htmlFor="task-app">Application</label>
                                    <input
                                        id="task-app"
                                        type="text"
                                        value={appName}
                                        onChange={e => setAppName(e.target.value)}
                                        placeholder="e.g. MyCalcFinance"
                                    />
                                </div>
                            </div>

                            <div className="tasks-form__actions">
                                <button type="button" className="tasks-btn tasks-btn--ghost" onClick={resetForm}>Cancel</button>
                                <button type="submit" className="tasks-btn tasks-btn--primary">
                                    {editingTask ? 'Save Changes' : 'Create Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Task List */}
                {loading ? (
                    <div className="tasks-loading">Loading tasks...</div>
                ) : tasks.length === 0 ? (
                    <div className="tasks-empty">
                        <p>No tasks yet. Click <strong>+ New Task</strong> to create one.</p>
                    </div>
                ) : (
                    <div className="tasks-table-wrapper">
                        <table className="tasks-table">
                            <thead>
                                <tr>
                                    <th>Task</th>
                                    <th>App</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Test Result</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map(task => (
                                    <tr key={task.id} className={`tasks-row tasks-row--${task.status}`}>
                                        <td>
                                            <div className="tasks-row__title">{task.title}</div>
                                            {task.description && (
                                                <div className="tasks-row__desc">{task.description.substring(0, 80)}{task.description.length > 80 ? '…' : ''}</div>
                                            )}
                                        </td>
                                        <td>
                                            {task.app_name && <span className="tasks-app-badge">{task.app_name}</span>}
                                        </td>
                                        <td>
                                            <span className={`tasks-priority tasks-priority--${task.priority}`}>
                                                {PRIORITY_LABELS[task.priority]}
                                            </span>
                                        </td>
                                        <td>
                                            <select
                                                className={`tasks-status-select tasks-status-select--${task.status}`}
                                                value={task.status}
                                                onChange={e => handleStatusChange(task, e.target.value as Task['status'])}
                                            >
                                                {STATUSES.map(s => (
                                                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <span className={`tasks-result tasks-result--${task.test_result || 'none'}`}>
                                                {task.test_result ? task.test_result.toUpperCase() : '—'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="tasks-actions">
                                                <button className="tasks-btn tasks-btn--sm" onClick={() => openEditForm(task)} title="Edit">✏️</button>
                                                <button className="tasks-btn tasks-btn--sm tasks-btn--danger" onClick={() => handleDelete(task.id)} title="Delete">🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    )
}
