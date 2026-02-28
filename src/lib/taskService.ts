import { supabase } from './supabase'

// -------- types --------
export interface Task {
    id: number
    title: string
    description: string
    priority: 'low' | 'medium' | 'high' | 'critical'
    status: 'todo' | 'in_progress' | 'testing' | 'done' | 'blocked' | 'open' | 'fixed' | 'closed'
    assigned_to: string
    app_name: string
    test_cases: string
    test_result: '' | 'pass' | 'fail' | 'partial'
    notes: string
    created_at: string
    updated_at: string
}

export type BugStatus = 'open' | 'fixed' | 'closed'

export type NewTask = Pick<Task, 'title' | 'description' | 'priority' | 'app_name'> & {
    assigned_to?: string
    status?: string
}

export type TaskUpdate = Partial<Omit<Task, 'id' | 'created_at'>>

// -------- CRUD --------

export async function getAllTasks(): Promise<Task[]> {
    if (!supabase) return []

    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('[taskService] Failed to fetch tasks', error)
        return []
    }

    return (data as Task[]) || []
}

export async function getTaskById(id: number): Promise<Task | null> {
    if (!supabase) return null

    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('[taskService] Failed to fetch task', error)
        return null
    }

    return data as Task
}

export async function createTask(task: NewTask): Promise<Task | null> {
    if (!supabase) return null

    const { data, error } = await supabase
        .from('tasks')
        .insert([{
            title: task.title,
            description: task.description || '',
            priority: task.priority || 'medium',
            app_name: task.app_name || '',
            assigned_to: task.assigned_to || 'Tester',
            ...(task.status ? { status: task.status } : {}),
        }])
        .select()
        .single()

    if (error) {
        console.error('[taskService] Failed to create task', error)
        return null
    }

    return data as Task
}

export async function updateTask(id: number, updates: TaskUpdate): Promise<Task | null> {
    if (!supabase) return null

    const { data, error } = await supabase
        .from('tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('[taskService] Failed to update task', error)
        return null
    }

    return data as Task
}

export async function deleteTask(id: number): Promise<boolean> {
    if (!supabase) return false

    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('[taskService] Failed to delete task', error)
        return false
    }

    return true
}
