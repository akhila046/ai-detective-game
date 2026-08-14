import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { Search, FileText, Users, AlertTriangle, Clock } from 'lucide-react'
import clsx from 'clsx'

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function NavBar() {
  const { state } = useGame()
  const navigate = useNavigate()
  const location = useLocation()

  const links = [
    { path: '/investigate', label: 'Investigate', icon: Search },
    { path: '/evidence', label: 'Evidence Board', icon: FileText },
    { path: '/accuse', label: 'Make Accusation', icon: AlertTriangle },
  ]

  return (
    <header className="border-b border-terminal-border bg-terminal-surface px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <span className="text-terminal-red font-mono font-bold text-lg glow-red">
          🕵️ CASE #4471
        </span>
        <span className="text-terminal-muted font-mono text-sm">
          The Missing Developer
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex items-center gap-1">
        {links.map(({ path, label, icon: Icon }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded font-mono text-sm transition-all duration-200',
              location.pathname === path
                ? 'bg-terminal-green/10 text-terminal-green border border-terminal-green/30'
                : 'text-terminal-muted hover:text-terminal-text hover:bg-white/5'
            )}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </nav>

      {/* Status */}
      <div className="flex items-center gap-4 font-mono text-sm">
        <span className="flex items-center gap-1 text-terminal-muted">
          <Clock size={13} />
          <span className={clsx(state.elapsed > 1800 ? 'text-terminal-red glow-red' : 'text-terminal-amber')}>
            {formatTime(state.elapsed)}
          </span>
        </span>
        <span className="flex items-center gap-1 text-terminal-muted">
          <FileText size={13} />
          <span className="text-terminal-green">{state.collectedEvidence.length}</span>
          <span> clues</span>
        </span>
        <span className="flex items-center gap-1 text-terminal-muted">
          <Users size={13} />
          <span className="text-terminal-blue">{state.interrogated.length}/4</span>
          <span> interrogated</span>
        </span>
      </div>
    </header>
  )
}
