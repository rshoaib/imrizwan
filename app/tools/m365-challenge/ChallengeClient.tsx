'use client'

import { useState, useMemo } from 'react'
import { m365QuizBank, QuizQuestion } from '@/data/m365-quiz'
import { Trophy, ArrowRight, RotateCcw, CheckCircle2, XCircle, Info } from 'lucide-react'

type GameState = 'start' | 'playing' | 'results' | 'review'

export default function ChallengeClient() {
  const [gameState, setGameState] = useState<GameState>('start')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  
  // Shuffle questions once on mount so it's a random 10-question set
  const questions = useMemo(() => {
    return [...m365QuizBank].sort(() => 0.5 - Math.random()).slice(0, 10)
  }, [gameState === 'start']) // Re-shuffle when restarting

  const currentQuestion = questions[currentQuestionIndex]
  const score = userAnswers.filter((ans, idx) => ans === questions[idx].correctAnswerIndex).length

  const getRank = (score: number, total: number) => {
    const percentage = score / total
    if (percentage === 1) return { title: 'M365 Architect', color: '#10b981' } // Emerald
    if (percentage >= 0.8) return { title: 'Senior Developer', color: '#3b82f6' } // Blue
    if (percentage >= 0.6) return { title: 'Intermediate Dev', color: '#f59e0b' } // Amber
    if (percentage >= 0.4) return { title: 'Junior Developer', color: '#a78bfa' } // Purple
    return { title: 'M365 Novice', color: '#ef4444' } // Red
  }

  const handleStart = () => {
    setGameState('playing')
    setCurrentQuestionIndex(0)
    setUserAnswers([])
    setSelectedAnswer(null)
  }

  const handleNext = () => {
    if (selectedAnswer === null) return

    const newAnswers = [...userAnswers, selectedAnswer]
    setUserAnswers(newAnswers)
    setSelectedAnswer(null)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      setGameState('results')
    }
  }

  /* START SCREEN */
  if (gameState === 'start') {
    return (
      <div className="mc-container">
        <style>{styles}</style>
        <div className="mc-panel mc-center text-center">
          <div className="mc-icon-wrapper mb-6">
            <Trophy size={48} className="text-amber-400" />
          </div>
          <h2 className="mc-title">M365 Developer Challenge</h2>
          <p className="mc-desc mb-8">
            Can you score 10/10? Test your knowledge across SharePoint Framework (SPFx), Power Automate, Microsoft Graph, and general M365 Development.
          </p>
          <div className="flex justify-center gap-4 text-sm text-slate-400 mb-8">
            <span className="mc-badge">10 Questions</span>
            <span className="mc-badge">Intermediate / Advanced</span>
          </div>
          <button onClick={handleStart} className="mc-btn mc-btn-primary">
            Start Challenge <ArrowRight size={18} />
          </button>
        </div>
      </div>
    )
  }

  /* RESULTS SCREEN */
  if (gameState === 'results') {
    const rank = getRank(score, questions.length)
    return (
      <div className="mc-container">
        <style>{styles}</style>
        <div className="mc-panel mc-center text-center">
          <h2 className="mc-title mb-2">Challenge Complete!</h2>
          <p className="mc-desc mb-8">Here is how you performed against the M365 ecosystem.</p>
          
          <div className="mc-score-circle" style={{ borderColor: rank.color, boxShadow: `0 0 30px ${rank.color}40` }}>
            <span className="mc-score-text">{score}<span className="text-2xl text-slate-500">/{questions.length}</span></span>
          </div>
          
          <div className="mc-rank-title mb-8" style={{ color: rank.color }}>
            Rank: {rank.title}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setGameState('review')} className="mc-btn mc-btn-secondary">
              Review Answers <Info size={18} />
            </button>
            <button onClick={handleStart} className="mc-btn mc-btn-primary">
              Play Again <RotateCcw size={18} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* REVIEW SCREEN */
  if (gameState === 'review') {
    return (
      <div className="mc-container">
        <style>{styles}</style>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Answer Review</h2>
          <button onClick={handleStart} className="mc-btn mc-btn-secondary text-sm py-2">
            Retry Challenge <RotateCcw size={16} />
          </button>
        </div>
        
        <div className="flex flex-col gap-6">
          {questions.map((q, qIndex) => {
            const userAnswer = userAnswers[qIndex]
            const isCorrect = userAnswer === q.correctAnswerIndex

            return (
              <div key={q.id} className="mc-panel p-6">
                <div className="flex items-start gap-3 mb-4">
                  {isCorrect ? (
                    <CheckCircle2 className="text-emerald-500 flex-shrink-0 mt-1" size={24} />
                  ) : (
                    <XCircle className="text-rose-500 flex-shrink-0 mt-1" size={24} />
                  )}
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1 block">{q.category}</span>
                    <h3 className="text-lg font-medium text-slate-200">{q.question}</h3>
                  </div>
                </div>
                
                <div className="pl-9 space-y-4">
                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, optIndex) => {
                      let bgClass = "bg-slate-800/50 border-slate-700 text-slate-400"
                      let badge = null

                      if (optIndex === q.correctAnswerIndex) {
                        bgClass = "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-medium"
                        badge = <span className="text-xs ml-auto">Correct Answer</span>
                      } else if (optIndex === userAnswer) {
                        bgClass = "bg-rose-500/10 border-rose-500/50 text-rose-400"
                        badge = <span className="text-xs ml-auto">Your Answer</span>
                      }

                      return (
                        <div key={optIndex} className={`p-3 rounded-lg border flex items-center ${bgClass}`}>
                          <span>{opt}</span>
                          {badge}
                        </div>
                      )
                    })}
                  </div>
                  
                  <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-sm leading-relaxed mt-4">
                    <strong>Explanation:</strong> {q.explanation}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-8 text-center">
            <button onClick={handleStart} className="mc-btn mc-btn-primary">
              Play Again <RotateCcw size={18} />
            </button>
        </div>
      </div>
    )
  }

  /* PLAYING SCREEN */
  const isQuestionAnswered = selectedAnswer !== null
  
  return (
    <div className="mc-container">
      <style>{styles}</style>
      
      {/* Progress */}
      <div className="flex justify-between items-center mb-4 text-sm font-medium text-slate-400">
        <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
        <span className="px-3 py-1 bg-slate-800 rounded-full border border-slate-700">{currentQuestion.category}</span>
      </div>
      
      <div className="w-full bg-slate-800 rounded-full h-2 mb-8 overflow-hidden">
        <div 
          className="bg-indigo-500 h-2 rounded-full transition-all duration-500" 
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      <div className="mc-panel">
        <h2 className="text-xl md:text-2xl font-medium text-slate-100 mb-8 leading-relaxed">
          {currentQuestion.question}
        </h2>
        
        <div className="flex flex-col gap-3 mb-8">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx
            return (
              <button
                key={idx}
                onClick={() => setSelectedAnswer(idx)}
                className={`mc-option ${isSelected ? 'selected' : ''}`}
                disabled={isQuestionAnswered}
              >
                <div className="mc-option-marker">
                  {String.fromCharCode(65 + idx)}
                </div>
                <div className="text-left">{option}</div>
              </button>
            )
          })}
        </div>
        
        <div className="flex justify-end border-t border-slate-800 pt-6">
          <button 
            onClick={handleNext} 
            disabled={!isQuestionAnswered}
            className={`mc-btn ${isQuestionAnswered ? 'mc-btn-primary' : 'mc-btn-disabled'}`}
          >
            {currentQuestionIndex === questions.length - 1 ? 'See Results' : 'Next Question'} <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = `
  .mc-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    font-family: var(--font-body);
  }
  
  .mc-panel {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-2xl);
    padding: var(--space-8);
    box-shadow: var(--shadow-xl);
  }
  
  .mc-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-12) var(--space-6);
  }
  
  .mc-title {
    font-size: var(--fs-3xl);
    font-weight: var(--fw-bold);
    color: var(--text-primary);
    margin-bottom: var(--space-4);
  }
  
  .mc-desc {
    font-size: var(--fs-lg);
    color: var(--text-secondary);
    max-width: 500px;
    line-height: var(--lh-relaxed);
  }
  
  .mc-badge {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    padding: 6px 12px;
    border-radius: var(--radius-full);
    font-weight: var(--fw-medium);
  }
  
  .mc-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border-radius: var(--radius-xl);
    font-weight: var(--fw-semibold);
    font-size: var(--fs-base);
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  
  .mc-btn-primary {
    background: var(--accent);
    color: white;
    border: 1px solid transparent;
  }
  
  .mc-btn-primary:hover {
    background: var(--accent-hover);
    box-shadow: 0 0 15px var(--accent-glow);
    transform: translateY(-2px);
  }
  
  .mc-btn-secondary {
    background: transparent;
    color: var(--text-primary);
    border: 1px solid var(--border);
  }
  
  .mc-btn-secondary:hover {
    background: var(--bg-secondary);
    border-color: var(--text-muted);
  }

  .mc-btn-disabled {
    background: var(--bg-secondary);
    color: var(--text-muted);
    border: 1px solid transparent;
    cursor: not-allowed;
    opacity: 0.5;
  }
  
  .mc-option {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    width: 100%;
    padding: var(--space-4);
    background: rgba(15, 23, 42, 0.4);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    color: var(--text-secondary);
    font-size: var(--fs-lg);
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  
  .mc-option:hover:not(:disabled) {
    background: var(--bg-secondary);
    border-color: var(--text-muted);
    color: var(--text-primary);
  }
  
  .mc-option.selected {
    background: rgba(99, 102, 241, 0.1);
    border-color: var(--accent);
    color: white;
  }
  
  .mc-option.selected .mc-option-marker {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
  }
  
  .mc-option-marker {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    border-radius: 8px;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    font-weight: var(--fw-bold);
    color: var(--text-muted);
    transition: all var(--transition-fast);
  }
  
  .mc-score-circle {
    width: 160px;
    height: 160px;
    margin: 0 auto;
    border-radius: 50%;
    border: 8px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--space-6);
  }
  
  .mc-score-text {
    font-size: 3.5rem;
    font-weight: var(--fw-extrabold);
    color: white;
    font-family: var(--font-mono);
  }
  
  .mc-rank-title {
    font-size: var(--fs-2xl);
    font-weight: var(--fw-bold);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`
