import React from 'react'
import clsx from 'clsx'

const typeStyles = {
  git: 'border-terminal-blue/40 text-terminal-blue bg-terminal-blue/10',
  email: 'border-terminal-amber/40 text-terminal-amber bg-terminal-amber/10',
  note: 'border-terminal-green/40 text-terminal-green bg-terminal-green/10',
  log: 'border-terminal-red/40 text-terminal-red bg-terminal-red/10',
  file: 'border-terminal-muted/40 text-terminal-muted bg-terminal-muted/10',
}

export default function EvidenceTag({ type, label }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border',
        typeStyles[type] || typeStyles.file
      )}
    >
      {label}
    </span>
  )
}
