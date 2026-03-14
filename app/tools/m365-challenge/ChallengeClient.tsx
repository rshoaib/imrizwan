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
  }, [gameState === 'start'])

  const currentQuestion = questions[currentQuestionIndex]
  const score = userAnswers.filter((ans, idx) => ans === questions[idx].correctAnswerIndex).length

  const getRank = (score: number, total: number) => {
    const percentage = score / total
    if (percentage === 1) return { title: 'M365 Architect', color: 'var(--cat-sharepoint)' }
    if (percentage >= 0.8) return { title: 'Senior Developer', color: 'var(--cat-spfx)' }
    if (percentage >= 0.6) return { title: 'Intermediate Dev', color: 'var(--cat-power)' }
    if (percentage >= 0.4) return { title: 'Junior Developer', color: 'var(--accent)' }
    return { title: 'M365 Novice', color: 'var(--cat-m365)' }
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
        <div className="mc-panel mc-center">
          <div className="mc-icon-wrapper">
            <Trophy size={48} style={{ color: 'var(--cat-power)' }} />
          </div>
          <h2 className="mc-title">M365 Developer Challenge</h2>
          <p className="mc-desc">
            Can you score 10/10? Test your knowledge across SharePoint Framework (SPFx), Power Automate, Microsoft Graph, and general M365 Development.
          </p>
          <div className="mc-badges">
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
        <div className="mc-panel mc-center">
          <h2 className="mc-title">Challenge Complete!</h2>
          <p className="mc-desc">Here is how you performed against the M365 ecosystem.</p>
          
          <div className="mc-score-circle" style={{ borderColor: rank.color, boxShadow: `0 0 30px ${rank.color}40` }}>
            <span className="mc-score-text">{score}<span className="mc-score-total">/{questions.length}</span></span>
          </div>
          
          <div className="mc-rank-title" style={{ color: rank.color }}>
            Rank: {rank.title}
          </div>

          <div className="mc-actions">
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
        <div className="mc-review-header">
          <h2 className="mc-title" style={{ marginBottom: 0 }}>Answer Review</h2>
          <button onClick={handleStart} className="mc-btn mc-btn-secondary mc-btn-sm">
            Retry Challenge <RotateCcw size={16} />
          </button>
        </div>
        
        <div className="mc-review-list">
          {questions.map((q, qIndex) => {
            const userAnswer = userAnswers[qIndex]
            const isCorrect = userAnswer === q.correctAnswerIndex

            return (
              <div key={q.id} className="mc-panel mc-review-card">
                <div className="mc-review-q-header">
                  {isCorrect ? (
                    <CheckCircle2 style={{ color: 'var(--cat-sharepoint)' }} size={24} className="mc-review-icon" />
                  ) : (
                    <XCircle style={{ color: 'var(--cat-m365)' }} size={24} className="mc-review-icon" />
                  )}
                  <div className="mc-review-q-titles">
                    <span className="mc-review-category">{q.category}</span>
                    <h3 className="mc-review-question">{q.question}</h3>
                  </div>
                </div>
                
                <div className="mc-review-body">
                  <div className="mc-review-options">
                    {q.options.map((opt, optIndex) => {
                      let bgClass = "mc-opt-neutral"
                      let badge = null

                      if (optIndex === q.correctAnswerIndex) {
                        bgClass = "mc-opt-correct"
                        badge = <span className="mc-opt-badge">Correct Answer</span>
                      } else if (optIndex === userAnswer) {
                        bgClass = "mc-opt-wrong"
                        badge = <span className="mc-opt-badge">Your Answer</span>
                      }

                      return (
                        <div key={optIndex} className={`mc-review-opt ${bgClass}`}>
                          <span>{opt}</span>
                          {badge}
                        </div>
                      )
                    })}
                  </div>
                  
                  <div className="mc-explanation">
                    <strong>Explanation:</strong> {q.explanation}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mc-center" style={{ paddingTop: 'var(--space-8)' }}>
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
      <div className="mc-progress-header">
        <span className="mc-progress-text">Question {currentQuestionIndex + 1} of {questions.length}</span>
        <span className="mc-progress-cat">{currentQuestion.category}</span>
      </div>
      
      <div className="mc-progress-bar-bg">
        <div 
          className="mc-progress-bar-fill" 
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      <div className="mc-panel">
        <h2 className="mc-question-text">
          {currentQuestion.question}
        </h2>
        
        <div className="mc-options-list">
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
                <div className="mc-option-text">{option}</div>
              </button>
            )
          })}
        </div>
        
        <div className="mc-play-footer">
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
    margin: var(--space-8) auto var(--space-12);
    font-family: var(--font-body);
    /* Ensure padding-top creates breathing room below the sticky header */
    padding-top: var(--space-6); 
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
    text-align: center;
    padding: var(--space-12) var(--space-6);
  }
  
  .mc-icon-wrapper {
    margin-bottom: var(--space-6);
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
    max-width: 600px;
    line-height: var(--lh-relaxed);
    margin-bottom: var(--space-8);
  }

  .mc-badges {
    display: flex;
    justify-content: center;
    gap: var(--space-4);
    margin-bottom: var(--space-8);
  }
  
  .mc-badge {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    padding: 6px 16px;
    border-radius: var(--radius-full);
    font-weight: var(--fw-medium);
    font-size: var(--fs-sm);
    color: var(--text-secondary);
  }
  
  .mc-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 28px;
    border-radius: var(--radius-xl);
    font-weight: var(--fw-semibold);
    font-size: var(--fs-base);
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  
  .mc-btn-sm {
    padding: 8px 16px;
    font-size: var(--fs-sm);
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

  .mc-actions {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    justify-content: center;
  }
  @media (min-width: 640px) {
    .mc-actions {
      flex-direction: row;
    }
  }
  
  .mc-options-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    margin-bottom: var(--space-8);
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
    text-align: left;
  }
  
  .mc-option:hover:not(:disabled) {
    background: var(--bg-secondary);
    border-color: var(--text-muted);
    color: var(--text-primary);
  }
  
  .mc-option.selected {
    background: var(--accent-glow);
    border-color: var(--accent);
    color: var(--text-primary);
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
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    border-radius: 8px;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    font-weight: var(--fw-bold);
    color: var(--text-muted);
    transition: all var(--transition-fast);
  }

  .mc-option-text {
    flex-grow: 1;
  }
  
  .mc-score-circle {
    width: 180px;
    height: 180px;
    margin: 0 auto var(--space-6);
    border-radius: 50%;
    border: 8px solid;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .mc-score-text {
    font-size: var(--fs-5xl);
    font-weight: var(--fw-extrabold);
    color: var(--text-primary);
    font-family: var(--font-mono);
  }

  .mc-score-total {
    font-size: var(--fs-2xl);
    color: var(--text-muted);
  }
  
  .mc-rank-title {
    font-size: var(--fs-2xl);
    font-weight: var(--fw-bold);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--space-8);
  }

  .mc-progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-4);
    font-size: var(--fs-sm);
    font-weight: var(--fw-medium);
    color: var(--text-muted);
  }

  .mc-progress-cat {
    padding: 6px 12px;
    background: var(--bg-secondary);
    border-radius: var(--radius-full);
    border: 1px solid var(--border);
  }

  .mc-progress-bar-bg {
    width: 100%;
    background: var(--bg-secondary);
    border-radius: var(--radius-full);
    height: 8px;
    margin-bottom: var(--space-8);
    overflow: hidden;
  }

  .mc-progress-bar-fill {
    background: var(--accent);
    height: 100%;
    border-radius: var(--radius-full);
    transition: width 0.5s ease-out;
  }

  .mc-question-text {
    font-size: var(--fs-2xl);
    font-weight: var(--fw-medium);
    color: var(--text-primary);
    margin-bottom: var(--space-8);
    line-height: var(--lh-relaxed);
  }

  .mc-play-footer {
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid var(--border);
    padding-top: var(--space-6);
  }

  .mc-review-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-6);
  }

  .mc-review-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .mc-review-card {
    padding: var(--space-6);
  }

  .mc-review-q-header {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
  }

  .mc-review-icon {
    flex-shrink: 0;
    margin-top: 4px;
  }

  .mc-review-category {
    font-size: var(--fs-xs);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    font-weight: var(--fw-bold);
    margin-bottom: var(--space-1);
    display: block;
  }

  .mc-review-question {
    font-size: var(--fs-lg);
    font-weight: var(--fw-medium);
    color: var(--text-primary);
    margin: 0;
  }

  .mc-review-body {
    padding-left: 36px; /* Offset for icon width + gap */
  }

  .mc-review-options {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .mc-review-opt {
    padding: var(--space-3);
    border-radius: var(--radius-md);
    border: 1px solid;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: var(--fs-base);
  }

  .mc-opt-neutral {
    background: var(--bg-secondary);
    border-color: var(--border);
    color: var(--text-secondary);
  }

  .mc-opt-correct {
    background: rgba(16, 185, 129, 0.1);
    border-color: rgba(16, 185, 129, 0.4);
    color: #10b981;
    font-weight: var(--fw-medium);
  }

  .mc-opt-wrong {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.4);
    color: #ef4444;
  }

  .mc-opt-badge {
    font-size: var(--fs-xs);
    font-weight: var(--fw-semibold);
  }

  .mc-explanation {
    margin-top: var(--space-4);
    padding: var(--space-4);
    border-radius: var(--radius-md);
    background: var(--accent-glow);
    border: 1px solid rgba(99, 102, 241, 0.2);
    color: var(--text-primary);
    font-size: var(--fs-sm);
    line-height: var(--lh-relaxed);
  }

  [data-theme="light"] .mc-option {
    background: #fff;
  }
  
  [data-theme="light"] .mc-progress-cat {
    background: #fff;
  }

  [data-theme="light"] .mc-explanation {
    background: rgba(79, 70, 229, 0.05);
    color: #1e293b;
  }
`
