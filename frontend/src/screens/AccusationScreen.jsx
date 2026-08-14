import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext'
import NavBar from '../components/NavBar'
import { CHARACTERS } from '../data/characters'
import { getEvidenceById } from '../data/evidence'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import axios from 'axios'
import clsx from 'clsx'

const MOTIVE_OPTIONS = [
  'To silence the whistleblower and protect the data deal',
  'Personal grudge against Alex',
  'Following orders from above',
  'To cover up their own mistake',
  'Financial incentive from DataBridge Solutions',
]

export default function AccusationScreen() {
  const { state, dispatch } = useGame()
  const navigate = useNavigate()

  const [selected, setSelected] = useState(null)
  const [selectedMotive, setSelectedMotive] = useState('')
  const [selectedEvidence, setSelectedEvidence] = useState([])
  const [confirming, setConfirming] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function toggleEvidence(id) {
    setSelectedEvidence((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    )
  }

  async function submitAccusation() {
    if (!selected || !selectedMotive) return
    setSubmitting(true)

    dispatch({ type: 'SET_ACCUSATION', payload: selected.id })

    try {
      const res = await axios.post('/api/accuse', {
        sessionId: state.sessionId,
        accusedId: selected.id,
        motive: selectedMotive,
        evidence: selectedEvidence,
      })
      dispatch({
        type: 'RESOLVE_CASE',
        payload: { correct: res.data.correct },
      })
    } catch {
      // Fallback — client-side truth check
      const correct = selected.id === 'dana_voss'
      dispatch({ type: 'RESOLVE_CASE', payload: { correct } })
    }

    navigate('/outcome')
    setSubmitting(false)
  }

  const suspicionStyle = {
    low: 'border-terminal-green/30 text-terminal-green',
    medium: 'border-terminal-amber/30 text-terminal-amber',
    high: 'border-terminal-red/30 text-terminal-red',
    very_high: 'border-terminal-red/50 text-terminal-red shadow-glow-red',
  }

  return (
    <div className="min-h-screen bg-terminal-bg flex flex-col">
      <NavBar />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="text-terminal-red text-xs tracking-widest uppercase font-mono mb-2 glow-red">
              ⚖️ Final Accusation
            </div>
            <h1 className="text-3xl font-bold text-terminal-text font-mono">
              Who is responsible?
            </h1>
            <p className="text-terminal-muted font-mono text-sm mt-2">
              Choose carefully. You only get one shot.
            </p>
          </motion.div>

          {/* Suspect grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {CHARACTERS.map((c, i) => (
              <motion.button
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => { setSelected(c); setConfirming(false) }}
                className={clsx(
                  'p-6 rounded-lg border-2 text-left transition-all duration-200 font-mono',
                  selected?.id === c.id
                    ? `${suspicionStyle[c.suspicionLevel]} bg-terminal-surface`
                    : 'border-terminal-border bg-terminal-surface hover:border-terminal-muted'
                )}
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{c.avatar}</span>
                  <div className="flex-1">
                    <div className="text-terminal-text font-bold text-lg">
                      {c.name}
                    </div>
                    <div className="text-terminal-muted text-xs mt-0.5">{c.role}</div>
                    <div className={clsx('text-xs mt-2', suspicionStyle[c.suspicionLevel])}>
                      Suspicion: {c.suspicionLevel.replace('_', ' ').toUpperCase()}
                    </div>
                    <p className="text-terminal-muted text-xs mt-2 leading-relaxed">
                      {c.description}
                    </p>
                    {state.interrogated.includes(c.id) ? (
                      <span className="inline-flex items-center gap-1 text-terminal-green text-xs mt-2">
                        <CheckCircle size={11} /> Interrogated
                      </span>
                    ) : (
                      <span className="text-terminal-red text-xs mt-2 block">
                        ⚠ Not yet interrogated
                      </span>
                    )}
                  </div>
                  {selected?.id === c.id && (
                    <div className="text-terminal-green text-xl">◉</div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Motive */}
                <div className="terminal-panel p-6">
                  <h3 className="text-terminal-text font-mono font-bold mb-4">
                    What was the motive?
                  </h3>
                  <div className="space-y-2">
                    {MOTIVE_OPTIONS.map((m) => (
                      <button
                        key={m}
                        onClick={() => setSelectedMotive(m)}
                        className={clsx(
                          'w-full text-left p-3 rounded border font-mono text-sm transition-all',
                          selectedMotive === m
                            ? 'border-terminal-green/50 bg-terminal-green/10 text-terminal-green'
                            : 'border-terminal-border text-terminal-muted hover:text-terminal-text hover:border-terminal-muted'
                        )}
                      >
                        {selectedMotive === m ? '◉' : '○'} {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Supporting evidence */}
                <div className="terminal-panel p-6">
                  <h3 className="text-terminal-text font-mono font-bold mb-4">
                    Supporting evidence (select all that apply):
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {state.collectedEvidence.map((id) => {
                      const ev = getEvidenceById(id)
                      if (!ev) return null
                      const isSelected = selectedEvidence.includes(id)
                      return (
                        <button
                          key={id}
                          onClick={() => toggleEvidence(id)}
                          className={clsx(
                            'p-3 rounded border text-left font-mono text-xs transition-all',
                            isSelected
                              ? 'border-terminal-amber/50 bg-terminal-amber/10 text-terminal-amber'
                              : 'border-terminal-border text-terminal-muted hover:text-terminal-text'
                          )}
                        >
                          <span>{ev.icon}</span> {ev.title}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Confirm button */}
                {!confirming ? (
                  <button
                    onClick={() => setConfirming(true)}
                    disabled={!selectedMotive}
                    className="w-full py-4 bg-terminal-red/10 border-2 border-terminal-red/50 text-terminal-red rounded font-mono text-lg font-bold hover:bg-terminal-red/20 hover:shadow-glow-red transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <AlertTriangle className="inline mr-2" size={18} />
                    Accuse {selected.name}
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="terminal-panel p-6 border-terminal-red/40 border-2 text-center"
                  >
                    <div className="text-terminal-red glow-red font-mono font-bold text-lg mb-2">
                      Are you certain?
                    </div>
                    <p className="text-terminal-muted font-mono text-sm mb-6">
                      You are about to accuse{' '}
                      <strong className="text-terminal-text">{selected.name}</strong> of orchestrating
                      the disappearance of Alex Mercer. This cannot be undone.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={() => setConfirming(false)}
                        className="px-6 py-2 border border-terminal-border text-terminal-muted rounded font-mono text-sm hover:text-terminal-text transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={submitAccusation}
                        disabled={submitting}
                        className="px-8 py-2 bg-terminal-red/20 border border-terminal-red text-terminal-red rounded font-mono text-sm font-bold hover:bg-terminal-red/30 transition-all disabled:opacity-60"
                      >
                        {submitting ? 'Submitting...' : 'Yes, I accuse them'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
