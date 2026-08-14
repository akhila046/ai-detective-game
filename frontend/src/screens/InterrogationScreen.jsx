import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext'
import NavBar from '../components/NavBar'
import EvidenceTag from '../components/EvidenceTag'
import { getCharacterById } from '../data/characters'
import { getEvidenceById } from '../data/evidence'
import { Send, ArrowLeft, AlertCircle } from 'lucide-react'
import axios from 'axios'
import clsx from 'clsx'

const QUICK_QUESTIONS = [
  'Where were you the morning Alex disappeared?',
  'Do you know why Alex was removed from the project?',
  'What do you know about DataBridge Solutions?',
  'Did you access the production server recently?',
  'What happened during the Q3 deployment?',
]

export default function InterrogationScreen() {
  const { characterId } = useParams()
  const { state, dispatch } = useGame()
  const navigate = useNavigate()
  const character = getCharacterById(characterId)

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showEvidence, setShowEvidence] = useState(false)
  const bottomRef = useRef(null)

  const messages = state.conversations[characterId] || []

  useEffect(() => {
    if (!character) navigate('/investigate')
  }, [character])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Mark as interrogated on first visit
  useEffect(() => {
    if (character) {
      dispatch({ type: 'MARK_INTERROGATED', payload: characterId })
    }
  }, [characterId])

  async function sendMessage(text) {
    if (!text.trim() || loading) return
    setError('')

    const userMsg = { role: 'player', text, timestamp: Date.now() }
    dispatch({
      type: 'ADD_CONVERSATION_MESSAGE',
      payload: { characterId, message: userMsg },
    })
    setInput('')
    setLoading(true)

    try {
      const res = await axios.post('/api/interrogate', {
        sessionId: state.sessionId,
        characterId,
        playerName: state.playerName,
        message: text,
        collectedEvidence: state.collectedEvidence,
        conversationHistory: messages.map((m) => ({
          role: m.role === 'player' ? 'user' : 'assistant',
          content: m.text,
        })),
      })

      const aiMsg = {
        role: 'character',
        text: res.data.reply,
        timestamp: Date.now(),
      }
      dispatch({
        type: 'ADD_CONVERSATION_MESSAGE',
        payload: { characterId, message: aiMsg },
      })
    } catch (err) {
      setError('Connection to AI failed. Check your backend and API key.')
      // Fallback response for demo
      const fallbackMsg = {
        role: 'character',
        text: `[AI service unavailable] ${character.name} stares at you silently.`,
        timestamp: Date.now(),
      }
      dispatch({
        type: 'ADD_CONVERSATION_MESSAGE',
        payload: { characterId, message: fallbackMsg },
      })
    } finally {
      setLoading(false)
    }
  }

  function presentEvidence(evidenceId) {
    const ev = getEvidenceById(evidenceId)
    if (!ev) return
    sendMessage(`I want to show you something. [Presents evidence: ${ev.title}] What do you say about this?`)
    setShowEvidence(false)
  }

  if (!character) return null

  const suspicionColor = {
    low: 'text-terminal-green',
    medium: 'text-terminal-amber',
    high: 'text-terminal-red',
    very_high: 'text-terminal-red glow-red',
  }[character.suspicionLevel] || 'text-terminal-muted'

  return (
    <div className="min-h-screen bg-terminal-bg flex flex-col">
      <NavBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left — character info */}
        <aside className="w-72 border-r border-terminal-border bg-terminal-surface flex flex-col">
          <button
            onClick={() => navigate('/investigate')}
            className="flex items-center gap-2 p-4 text-terminal-muted hover:text-terminal-text text-sm font-mono transition-colors border-b border-terminal-border"
          >
            <ArrowLeft size={14} /> Back to Investigation
          </button>

          {/* Character card */}
          <div className="p-6 border-b border-terminal-border">
            <div className="text-5xl mb-3 text-center">{character.avatar}</div>
            <h2 className="text-terminal-text font-bold font-mono text-center text-lg">
              {character.name}
            </h2>
            <p className="text-terminal-muted text-xs text-center mt-1 font-mono">
              {character.role}
            </p>
            <div className={clsx('text-xs text-center mt-3 font-mono', suspicionColor)}>
              Suspicion:{' '}
              {character.suspicionLevel.replace('_', ' ').toUpperCase()}
            </div>
            <p className="text-terminal-muted text-xs leading-relaxed mt-4 p-3 terminal-panel">
              {character.description}
            </p>
          </div>

          {/* Present evidence */}
          <div className="p-4 flex-1 overflow-y-auto">
            <button
              onClick={() => setShowEvidence(!showEvidence)}
              className="w-full py-2 border border-terminal-amber/30 text-terminal-amber rounded font-mono text-xs hover:bg-terminal-amber/10 transition-all mb-3"
            >
              🔍 Present Evidence ({state.collectedEvidence.length})
            </button>

            <AnimatePresence>
              {showEvidence && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1 overflow-hidden"
                >
                  {state.collectedEvidence.length === 0 ? (
                    <p className="text-terminal-muted text-xs font-mono p-2">
                      No evidence collected yet.
                    </p>
                  ) : (
                    state.collectedEvidence.map((id) => {
                      const ev = getEvidenceById(id)
                      if (!ev) return null
                      return (
                        <button
                          key={id}
                          onClick={() => presentEvidence(id)}
                          className="w-full text-left p-2 rounded border border-terminal-border hover:border-terminal-amber/30 hover:bg-terminal-amber/5 transition-all"
                        >
                          <div className="text-terminal-text text-xs font-mono flex items-center gap-1">
                            <span>{ev.icon}</span> {ev.title}
                          </div>
                          <EvidenceTag type={ev.type} label={ev.type} />
                        </button>
                      )
                    })
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick questions */}
            <div className="mt-4">
              <div className="text-terminal-muted text-xs tracking-widest uppercase mb-2">
                Quick Questions
              </div>
              <div className="space-y-1">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    disabled={loading}
                    className="w-full text-left p-2 rounded text-terminal-muted text-xs font-mono hover:bg-white/5 hover:text-terminal-text transition-all border border-transparent hover:border-terminal-border disabled:opacity-40"
                  >
                    › {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right — chat */}
        <main className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="border-b border-terminal-border px-6 py-3 bg-terminal-surface flex items-center justify-between">
            <div className="font-mono text-sm text-terminal-muted">
              Interrogating:{' '}
              <span className="text-terminal-text font-bold">{character.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
              <span className="text-terminal-green text-xs font-mono">Session Active</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">{character.avatar}</div>
                <p className="text-terminal-muted font-mono text-sm">
                  {character.name} sits across from you, waiting.
                </p>
                <p className="text-terminal-muted font-mono text-xs mt-2 opacity-60">
                  Ask a question or present evidence to begin.
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={clsx('flex', msg.role === 'player' ? 'justify-end' : 'justify-start')}
              >
                {msg.role === 'character' && (
                  <span className="text-2xl mr-3 mt-1 flex-shrink-0">{character.avatar}</span>
                )}
                <div
                  className={clsx(
                    'max-w-lg rounded px-4 py-3 font-mono text-sm leading-relaxed',
                    msg.role === 'player'
                      ? 'bg-terminal-blue/10 border border-terminal-blue/30 text-terminal-text'
                      : 'bg-terminal-surface border border-terminal-border text-terminal-text'
                  )}
                >
                  {msg.role === 'player' && (
                    <div className="text-terminal-blue text-xs mb-1">
                      {state.playerName} (You)
                    </div>
                  )}
                  {msg.role === 'character' && (
                    <div className={clsx('text-xs mb-1', suspicionColor)}>
                      {character.name}
                    </div>
                  )}
                  {msg.text}
                </div>
              </motion.div>
            ))}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <span className="text-2xl">{character.avatar}</span>
                <div className="bg-terminal-surface border border-terminal-border rounded px-4 py-3 font-mono text-sm text-terminal-muted flex items-center gap-2">
                  <span className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 bg-terminal-muted rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </span>
                  thinking...
                </div>
              </motion.div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-terminal-red text-xs font-mono p-3 border border-terminal-red/20 rounded bg-terminal-red/5">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-terminal-border p-4 bg-terminal-surface">
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(input) }}
              className="flex gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                placeholder={`Ask ${character.name} something...`}
                className="flex-1 bg-terminal-bg border border-terminal-border rounded px-4 py-2.5 text-terminal-text font-mono text-sm focus:outline-none focus:border-terminal-green transition-colors placeholder:text-terminal-muted disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-4 py-2.5 bg-terminal-green/10 border border-terminal-green/40 text-terminal-green rounded font-mono text-sm hover:bg-terminal-green/20 transition-all disabled:opacity-40 flex items-center gap-2"
              >
                <Send size={14} />
                Ask
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
