import React from 'react'
import clsx from 'clsx'

const variants = {
  online: 'text-terminal-green border-terminal-green/30 bg-terminal-green/10',
  offline: 'text-terminal-red border-terminal-red/30 bg-terminal-red/10',
  warning: 'text-terminal-amber border-terminal-amber/30 bg-terminal-amber/10',
  neutral: 'text-terminal-muted border-terminal-muted/30 bg-terminal-muted/10',
}

export default function StatusBadge({ status, label }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border',
        variants[status] || variants.neutral
      )}
    >
      <span className={clsx('w-1.5 h-1.5 rounded-full', {
        'bg-terminal-green animate-pulse': status === 'online',
        'bg-terminal-red': status === 'offline',
        'bg-terminal-amber animate-pulse': status === 'warning',
        'bg-terminal-muted': status === 'neutral',
      })} />
      {label}
    </span>
  )
}
