import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import NavBar from '../components/NavBar'
import EvidenceTag from '../components/EvidenceTag'
import { getEvidenceById, EVIDENCE_ITEMS } from '../data/evidence'
import { CHARACTERS } from '../data/characters'
import { useNavigate } from 'react-router-dom'

// Predefined positions for "pinned" cards on the board
const POSITIONS = [
  { top: '8%', left: '5%', rotate: '-2deg' },
  { top: '8%', left: '28%', rotate: '1deg' },
  { top: '8%', left: '51%', rotate: '-1.5deg' },
  { top: '8%', left: '74%', rotate: '2deg' },
  { top: '44%', left: '5%', rotate: '1.5deg' },
  { top: '44%', left: '28%', rotate: '-1deg' },
  { top: '44%', left: '51%', rotate: '2deg' },
  { top: '44%', left: '74%', rotate: '-2deg' },
  { top: '72%', left: '5%', rotate: '-1deg' },
  { top: '72%', left: '28%', rotate: '2deg' },
  { top: '72%', left: '51%', rotate: '-2deg' },
]

const PIN_COLORS = ['bg-terminal-red', 'bg-terminal-amber', 'bg-terminal-green', 'bg-terminal-blue']

export default function EvidenceBoardScreen() {
  const { state } = useGame()
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  const collected = state.collectedEvidence
    .map((id) => getEvidenceById(id))
    .filter(Boolean)

  const totalItems = EVIDENCE_ITEMS.length

  return (
    <div className="min-h-screen bg-terminal-bg flex flex-col">
      <NavBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Board */}
        <div className="flex-1 relative overflow-hidden">
          {/* Cork board texture */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at 20% 30%, rgba(255,184,0,0.03) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 70%, rgba(255,59,92,0.03) 0%, transparent 50%),
                #0d0d14
              `,
            }}
          />

          {/* Header */}
          <div className="relative z-10 p-6 flex items-center justify-between border-b border-terminal-border">
            <div>
              <h1 className="text-terminal-text font-bold font-mono text-xl">
                Evidence Board
              </h1>
              <p className="text-terminal-muted font-mono text-xs mt-1">
                {collected.length}/{totalItems} items collected
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 bg-terminal-border rounded-full w-48 overflow-hidden">
                <div
                  className="h-full bg-terminal-green rounded-full transition-all duration-500"
                  style={{ width: `${(collected.length / totalItems) * 100}%` }}
                />
              </div>
              <span className="text-terminal-green font-mono text-sm">
                {Math.round((collected.length / totalItems) * 100)}%
              </span>
            </div>
          </div>

          {/* Pinned cards */}
          <div className="relative" style={{ height: 'calc(100vh - 160px)' }}>
            {collected.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-terminal-muted font-mono">
                  <div className="text-6xl mb-4 opacity-20">📌</div>
                  <p className="text-sm">No evidence collected yet.</p>
                  <p className="text-xs mt-1 opacity-60">
                    Investigate Alex's workstation to find clues.
                  </p>
                </div>
              </div>
            ) : (
              collected.map((item, i) => {
                const pos = POSITIONS[i % POSITIONS.length]
                const pinColor = PIN_COLORS[i % PIN_COLORS.length]
                const isSelected = selected?.id === item.id
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8, y: -20 }}
                    animate={{ opacity: 1, scale: isSelected ? 1.05 : 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    onClick={() => setSelected(isSelected ? null : item)}
                    className="absolute cursor-pointer"
                    style={{
                      top: pos.top,
                      left: pos.left,
                      transform: `rotate(${pos.rotate})`,
                      width: '200px',
                      zIndex: isSelected ? 20 : 10,
                    }}
                  >
                    {/* Pin */}
                    <div className={`w-3 h-3 rounded-full ${pinColor} mx-auto mb-1 shadow-lg`} />
                    {/* Card */}
                    <div
                      className={`bg-terminal-surface border rounded p-3 shadow-lg transition-all duration-200 ${
                        isSelected
                          ? 'border-terminal-amber shadow-glow-amber'
                          : 'border-terminal-border hover:border-terminal-amber/40'
                      }`}
                    >
                      <div className="text-xl mb-1">{item.icon}</div>
                      <div className="text-terminal-text font-mono text-xs font-bold leading-tight mb-2">
                        {item.title}
                      </div>
                      <EvidenceTag type={item.type} label={item.type.toUpperCase()} />
                      <p className="text-terminal-muted text-xs mt-2 leading-snug line-clamp-2">
                        {item.analysis.substring(0, 80)}...
                      </p>
                    </div>
                  </motion.div>
                )
              })
            )}

            {/* Connection strings hint */}
            {collected.length >= 3 && (
              <div className="absolute bottom-4 left-4 right-4 terminal-panel p-3 border-terminal-amber/20 border">
                <p className="text-terminal-amber font-mono text-xs">
                  💡 Tip: When you have enough evidence, go to <strong>Make Accusation</strong> to name your suspect.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right panel — detail + suspects */}
        <aside className="w-80 border-l border-terminal-border bg-terminal-surface overflow-y-auto">
          {/* Selected evidence detail */}
          {selected ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-5 border-b border-terminal-border"
            >
              <div className="text-terminal-amber text-xs tracking-widest uppercase font-mono mb-3">
                Selected Evidence
              </div>
              <div className="text-2xl mb-2">{selected.icon}</div>
              <h3 className="text-terminal-text font-bold font-mono text-sm mb-2">
                {selected.title}
              </h3>
              <EvidenceTag type={selected.type} label={selected.type.toUpperCase()} />
              <div className="mt-3 terminal-panel p-3">
                <p className="text-terminal-text font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto">
                  {selected.content}
                </p>
              </div>
              <div className="mt-3 border border-terminal-amber/20 rounded p-3">
                <p className="text-terminal-text text-xs leading-relaxed">
                  {selected.analysis}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="p-5 border-b border-terminal-border">
              <div className="text-terminal-muted text-xs font-mono">
                Click any card to view full details.
              </div>
            </div>
          )}

          {/* Suspects tracker */}
          <div className="p-5">
            <div className="text-terminal-muted text-xs tracking-widest uppercase font-mono mb-3">
              Suspects
            </div>
            <div className="space-y-2">
              {CHARACTERS.map((c) => {
                const interrogated = state.interrogated.includes(c.id)
                return (
                  <button
                    key={c.id}
                    onClick={() => navigate(`/interrogate/${c.id}`)}
                    className="w-full flex items-center gap-3 p-3 terminal-panel hover:border-terminal-green/30 hover:border transition-all rounded text-left"
                  >
                    <span className="text-2xl">{c.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-terminal-text font-mono text-xs font-bold">
                        {c.name}
                      </div>
                      <div className="text-terminal-muted font-mono text-xs truncate">
                        {c.role}
                      </div>
                    </div>
                    {interrogated ? (
                      <span className="text-terminal-green text-xs font-mono">✓ done</span>
                    ) : (
                      <span className="text-terminal-amber text-xs font-mono">→ talk</span>
                    )}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => navigate('/accuse')}
              className="mt-6 w-full py-3 bg-terminal-red/10 border border-terminal-red/40 text-terminal-red rounded font-mono text-sm hover:bg-terminal-red/20 hover:shadow-glow-red transition-all"
            >
              ⚖️ Make Your Accusation
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
