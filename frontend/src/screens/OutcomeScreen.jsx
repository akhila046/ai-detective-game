import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { CHARACTERS } from '../data/characters'
import TypewriterText from '../components/TypewriterText'

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s}s`
  return `${m}m ${s}s`
}

const SOLVED_NARRATIVE = `Alex Mercer discovered that Nexus Corp had been secretly selling user data to DataBridge Solutions — a data broker — earning $102,000 per month. When Alex tried to report this internally, they were shut down.

Dana Voss, acting on behalf of the CEO, ordered Sam Carter to delete Alex's monitoring scripts, revoke their production access, and remove all traces of the discovery. A fabricated HR performance review was created after the fact to justify the lockout.

Alex was escorted out under an NDA threat. They are safe — but silenced.

Thanks to your investigation, the truth is on record.`

const FAILED_NARRATIVE = `You accused the wrong person. The real orchestrator remains free.

Dana Voss watches from across the office as the accusation falls apart. She gives you a cold, measured smile.

Alex Mercer's name gets buried. The data exports to DataBridge Solutions continue every Sunday at 3AM.

The case goes cold.`

export default function OutcomeScreen() {
  const { state, dispatch } = useGame()
  const navigate = useNavigate()
  const [showDetails, setShowDetails] = useState(false)

  const isSolved = state.phase === 'solved'
  const accused = CHARACTERS.find((c) => c.id === state.accusation)
  const culprit = CHARACTERS.find((c) => c.id === 'dana_voss')

  useEffect(() => {
    const timer = setTimeout(() => setShowDetails(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-terminal-bg flex flex-col items-center justify-center p-8 font-mono">
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-terminal-red to-transparent opacity-60" />

      <div className="w-full max-w-2xl">
        {/* Result header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          {isSolved ? (
            <>
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-4xl font-bold text-terminal-green glow-green mb-2">
                Case Solved
              </h1>
              <p className="text-terminal-muted text-sm">
                Justice was served in{' '}
                <span className="text-terminal-amber">{formatTime(state.elapsed)}</span>
              </p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">💀</div>
              <h1 className="text-4xl font-bold text-terminal-red glow-red mb-2">
                Wrong Accusation
              </h1>
              <p className="text-terminal-muted text-sm">
                The real culprit walks free.
              </p>
            </>
          )}
        </motion.div>

        {/* Accused */}
        {accused && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`terminal-panel p-5 mb-6 border-2 ${
              isSolved ? 'border-terminal-green/40' : 'border-terminal-red/40'
            }`}
          >
            <div className="text-xs tracking-widest uppercase text-terminal-muted mb-3">
              You accused
            </div>
            <div className="flex items-center gap-4">
              <span className="text-5xl">{accused.avatar}</span>
              <div>
                <div className="text-terminal-text font-bold text-xl">{accused.name}</div>
                <div className="text-terminal-muted text-sm">{accused.role}</div>
                {isSolved ? (
                  <div className="text-terminal-green text-sm mt-1">✓ Correct — this was the culprit</div>
                ) : (
                  <div className="text-terminal-red text-sm mt-1">✗ Incorrect</div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Reveal culprit if wrong */}
        {!isSolved && culprit && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="terminal-panel p-5 mb-6 border border-terminal-amber/30"
          >
            <div className="text-xs tracking-widest uppercase text-terminal-amber mb-3">
              The real culprit was
            </div>
            <div className="flex items-center gap-4">
              <span className="text-5xl">{culprit.avatar}</span>
              <div>
                <div className="text-terminal-text font-bold text-xl">{culprit.name}</div>
                <div className="text-terminal-muted text-sm">{culprit.role}</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Narrative */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="terminal-panel p-6 mb-6"
          >
            <div className="text-xs tracking-widest uppercase text-terminal-muted mb-3">
              What happened
            </div>
            <TypewriterText
              text={isSolved ? SOLVED_NARRATIVE : FAILED_NARRATIVE}
              speed={20}
              className="text-terminal-text text-sm leading-relaxed whitespace-pre-wrap"
            />
          </motion.div>
        )}

        {/* Stats */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <div className="terminal-panel p-4 text-center">
              <div className="text-terminal-muted text-xs mb-1">Evidence</div>
              <div className="text-terminal-green font-bold text-2xl">
                {state.collectedEvidence.length}
              </div>
              <div className="text-terminal-muted text-xs">/ 11 collected</div>
            </div>
            <div className="terminal-panel p-4 text-center">
              <div className="text-terminal-muted text-xs mb-1">Suspects</div>
              <div className="text-terminal-amber font-bold text-2xl">
                {state.interrogated.length}
              </div>
              <div className="text-terminal-muted text-xs">/ 4 interrogated</div>
            </div>
            <div className="terminal-panel p-4 text-center">
              <div className="text-terminal-muted text-xs mb-1">Time</div>
              <div className="text-terminal-blue font-bold text-2xl">
                {formatTime(state.elapsed)}
              </div>
              <div className="text-terminal-muted text-xs">total</div>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex gap-4 justify-center"
          >
            <button
              onClick={() => { dispatch({ type: 'RESET' }); navigate('/') }}
              className="px-8 py-3 bg-terminal-green/10 border border-terminal-green/40 text-terminal-green rounded font-mono text-sm hover:bg-terminal-green/20 hover:shadow-glow-green transition-all"
            >
              Play Again
            </button>
            {!isSolved && (
              <button
                onClick={() => navigate('/accuse')}
                className="px-8 py-3 bg-terminal-amber/10 border border-terminal-amber/40 text-terminal-amber rounded font-mono text-sm hover:bg-terminal-amber/20 transition-all"
              >
                Try Again
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
