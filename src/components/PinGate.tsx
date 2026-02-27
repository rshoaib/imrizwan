import { useState, useEffect } from 'react'

const PIN = 'rizwan2026'

export default function PinGate({ children }: { children: React.ReactNode }) {
    const [unlocked, setUnlocked] = useState(false)
    const [input, setInput] = useState('')
    const [error, setError] = useState(false)

    useEffect(() => {
        if (localStorage.getItem('task_pin') === PIN) {
            setUnlocked(true)
        }
    }, [])

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (input === PIN) {
            localStorage.setItem('task_pin', PIN)
            setUnlocked(true)
        } else {
            setError(true)
            setTimeout(() => setError(false), 2000)
        }
    }

    if (unlocked) return <>{children}</>

    return (
        <div className="pin-gate">
            <form className="pin-gate__box" onSubmit={handleSubmit}>
                <div className="pin-gate__icon">🔒</div>
                <h2 className="pin-gate__title">Access Required</h2>
                <p className="pin-gate__desc">Enter the access code to continue</p>
                <input
                    className={`pin-gate__input ${error ? 'pin-gate__input--error' : ''}`}
                    type="password"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Enter access code"
                    autoFocus
                />
                <button className="tasks-btn tasks-btn--primary pin-gate__btn" type="submit">
                    Unlock
                </button>
                {error && <p className="pin-gate__error">Wrong code. Try again.</p>}
            </form>
        </div>
    )
}
