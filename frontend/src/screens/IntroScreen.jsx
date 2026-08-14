import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext'
import TypewriterText from '../components/TypewriterText'
import axios from 'axios'

const BOOT_LINES = [
  'NEXUS CORP INTERNAL SYSTEM v4.2.1',
  'Loading employee workstation...',
  'Authenticating intern credentials...',
  'WARNING: Primary user [alex.mercer] account suspended.',
  'Mounting last session snapshot...',
  'ALERT: Anomalous activity detected in session logs.',
  'System ready.',
  '',
  '> Good morning. You are the only one here early.',
  '> Alex Mercer\'s desk is empty.',
  '> Their monitor is still on.',
]

export default function IntroScreen() {
  const { state, dispatch } = useGame()
  const navigate = useNavigate()
  const [bootIndex, setBootIndex] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (bootIndex < BOOT_LINES.length) {
      const delay = bootIndex === 0 ? 300 : 500
      const timer = setTimeout(() => setBootIndex((i) => i + 1), delay)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => setShowForm(true), 800)
      return () => clearTimeout(timer)
    }
  }, [bootIndex])

  async function handleStart(e) {
    e.preventDefault()
    if (!playerName.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('/api/sessions/start', { playerName: playerName.trim() })
      dispatch({
        type: 'START_GAME',
        payload: { sessionId: res.data.sessionId, playerName: playerName.trim() },
      })
      navigate('/investigate')
    } catch (err) {
      // If backend isn't running yet, still let the player in for frontend demo
      dispatch({
        type: 'START_GAME',
        payload: { sessionId: `local_${Date.now()}`, playerName: playerName.trim() },
      })
      navigate('/investigate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-terminal-bg flex flex-col items-center justify-center p-8 font-mono">
      {/* Flickering top bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-terminal-red via-terminal-amber to-terminal-red opacity-60" />

      <div className="w-full max-w-2xl">
        {/* Company logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="text-terminal-muted text-xs tracking-[0.3em] uppercase mb-2">
            Nexus Corp — Internal Workstation
          </div>
          <div className="w-full h-px bg-terminal-border" />
        </motion.div>

        {/* Boot log */}
        <div className="terminal-panel p-6 min-h-64 mb-6">
          <div className="text-xs text-terminal-muted mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-terminal-red inline-block" />
            <span className="w-3 h-3 rounded-full bg-terminal-amber inline-block" />
            <span className="w-3 h-3 rounded-full bg-terminal-green inline-block" />
            <span className="ml-2">terminal — bash</span>
          </div>

          <div className="space-y-1">
            {BOOT_LINES.slice(0, bootIndex).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.1 }}
                className={
                  line.startsWith('WARNING') || line.startsWith('ALERT')
                    ? 'text-terminal-amber text-sm'
                    : line.startsWith('>')
                    ? 'text-terminal-green text-sm mt-3'
                    : 'text-terminal-text text-sm'
                }
              >
                {line || '\u00A0'}
              </motion.div>
            ))}
            {bootIndex < BOOT_LINES.length && (
              <span className="animate-pulse text-terminal-green">█</span>
            )}
          </div>
        </div>

        {/* Case briefing */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="terminal-panel p-6 border-terminal-red/40 border">
                <div className="text-terminal-red text-xs tracking-widest uppercase mb-3 glow-red">
                  ⚠ Incident Report #4471
                </div>
                <h1 className="text-2xl font-bold text-terminal-text mb-3">
                  The Missing Developer
                </h1>
                <p className="text-terminal-muted text-sm leading-relaxed">
                  It's 8:47 AM. You arrive at the office as the new intern.
                  <br />
                  <span className="text-terminal-text">Alex Mercer</span> — the lead developer — is gone.
                  No notice. No goodbye. Their computer is still logged in.
                </p>
                <p className="text-terminal-muted text-sm leading-relaxed mt-3">
                  You have access to their workstation. Something doesn't add up.
                  <br />
                  Investigate. Interrogate. Find out what happened.
                </p>
                <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                  <div className="bg-terminal-bg rounded p-3 border border-terminal-border">
                    <div className="text-terminal-muted mb-1">Suspects</div>
                    <div className="text-terminal-amber font-bold text-base">4</div>
                  </div>
                  <div className="bg-terminal-bg rounded p-3 border border-terminal-border">
                    <div className="text-terminal-muted mb-1">Evidence Items</div>
                    <div className="text-terminal-green font-bold text-base">11</div>
                  </div>
                  <div className="bg-terminal-bg rounded p-3 border border-terminal-border">
                    <div className="text-terminal-muted mb-1">One Culprit</div>
                    <div className="text-terminal-red font-bold text-base">Hidden</div>
                  </div>
                </div>
              </div>

              {/* Name form */}
              <form onSubmit={handleStart} className="terminal-panel p-6">
                <label className="block text-terminal-green text-sm mb-2">
                  Enter your name, Detective:
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Your name..."
                    maxLength={30}
                    className="flex-1 bg-terminal-bg border border-terminal-border rounded px-4 py-2 text-terminal-text font-mono text-sm focus:outline-none focus:border-terminal-green transition-colors placeholder:text-terminal-muted"
                  />
                  <button
                    type="submit"
                    disabled={loading || !playerName.trim()}
                    className="px-6 py-2 bg-terminal-green/10 border border-terminal-green/50 text-terminal-green rounded font-mono text-sm hover:bg-terminal-green/20 hover:shadow-glow-green transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Starting...' : 'Begin Investigation →'}
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-terminal-red text-xs">{error}</p>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
