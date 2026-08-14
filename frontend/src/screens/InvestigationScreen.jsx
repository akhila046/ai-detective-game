import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext'
import NavBar from '../components/NavBar'
import EvidenceTag from '../components/EvidenceTag'
import { EVIDENCE_ITEMS, getAvailableEvidence } from '../data/evidence'
import { CHARACTERS } from '../data/characters'
import {
  Folder, FolderOpen, FileText, Mail, Terminal,
  ChevronRight, User, Lock, Unlock, Eye
} from 'lucide-react'
import clsx from 'clsx'

const FOLDER_META = {
  desktop: { label: 'Desktop', icon: '🖥️', description: "Alex's desktop files" },
  git_log: { label: 'Git History', icon: '📂', description: 'Repository commit log' },
  emails: { label: 'Email Client', icon: '📨', description: "Alex's inbox & drafts" },
  logs: { label: 'Server Logs', icon: '⚙️', description: 'Production access logs' },
}

// Timer hook
function useTimer() {
  const { dispatch } = useGame()
  useEffect(() => {
    const interval = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => clearInterval(interval)
  }, [dispatch])
}

export default function InvestigationScreen() {
  const { state, dispatch } = useGame()
  const navigate = useNavigate()
  const [activeFolder, setActiveFolder] = useState(null)
  const [selectedEvidence, setSelectedEvidence] = useState(null)
  const [noteText, setNoteText] = useState('')

  useTimer()

  const availableEvidence = getAvailableEvidence(state.collectedEvidence)

  function openFolder(folderId) {
    setActiveFolder(folderId)
    setSelectedEvidence(null)
    dispatch({ type: 'OPEN_FOLDER', payload: folderId })
  }

  function collectAndView(item) {
    dispatch({ type: 'COLLECT_EVIDENCE', payload: item.id })
    setSelectedEvidence(item)
  }

  function addNote() {
    if (!noteText.trim()) return
    dispatch({ type: 'ADD_NOTE', payload: noteText.trim() })
    setNoteText('')
  }

  const folderItems = activeFolder
    ? availableEvidence.filter((e) => e.folder === activeFolder)
    : []

  return (
    <div className="min-h-screen bg-terminal-bg flex flex-col">
      <NavBar />

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT — File System */}
        <aside className="w-64 border-r border-terminal-border bg-terminal-surface flex flex-col">
          <div className="p-4 border-b border-terminal-border">
            <div className="text-terminal-muted text-xs tracking-widest uppercase">
              Workstation
            </div>
            <div className="text-terminal-text text-sm font-mono mt-0.5">
              alex.mercer@nexus
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {Object.entries(FOLDER_META).map(([id, meta]) => {
              const isOpen = activeFolder === id
              const itemsAvailable = availableEvidence.filter((e) => e.folder === id).length
              return (
                <button
                  key={id}
                  onClick={() => openFolder(id)}
                  className={clsx(
                    'w-full flex items-center gap-2 px-3 py-2 rounded text-sm font-mono transition-all',
                    isOpen
                      ? 'bg-terminal-green/10 text-terminal-green border border-terminal-green/20'
                      : 'text-terminal-muted hover:bg-white/5 hover:text-terminal-text'
                  )}
                >
                  <span>{meta.icon}</span>
                  <span className="flex-1 text-left">{meta.label}</span>
                  <span className={clsx(
                    'text-xs px-1.5 py-0.5 rounded-full',
                    isOpen ? 'bg-terminal-green/20 text-terminal-green' : 'bg-terminal-muted/20 text-terminal-muted'
                  )}>
                    {itemsAvailable}
                  </span>
                </button>
              )
            })}
          </nav>

          {/* Suspects sidebar */}
          <div className="border-t border-terminal-border p-3">
            <div className="text-terminal-muted text-xs tracking-widest uppercase mb-2">
              Persons of Interest
            </div>
            <div className="space-y-1">
              {CHARACTERS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => navigate(`/interrogate/${c.id}`)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm font-mono text-terminal-muted hover:bg-white/5 hover:text-terminal-text transition-all"
                >
                  <span>{c.avatar}</span>
                  <span className="flex-1 text-left truncate">{c.name}</span>
                  {state.interrogated.includes(c.id) && (
                    <span className="text-terminal-green text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* MIDDLE — File Viewer */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Folder header */}
          <div className="border-b border-terminal-border px-6 py-3 flex items-center gap-2 text-sm font-mono text-terminal-muted bg-terminal-surface">
            <Terminal size={14} />
            <span>~/workstation</span>
            {activeFolder && (
              <>
                <ChevronRight size={14} />
                <span className="text-terminal-text">{FOLDER_META[activeFolder]?.label}</span>
              </>
            )}
            {selectedEvidence && (
              <>
                <ChevronRight size={14} />
                <span className="text-terminal-green">{selectedEvidence.title}</span>
              </>
            )}
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* File list */}
            <div className="w-72 border-r border-terminal-border overflow-y-auto">
              {!activeFolder ? (
                <div className="p-8 text-center text-terminal-muted font-mono text-sm">
                  <FolderOpen size={32} className="mx-auto mb-3 opacity-30" />
                  Select a folder to explore
                </div>
              ) : folderItems.length === 0 ? (
                <div className="p-6 text-terminal-muted font-mono text-sm">
                  <Lock size={20} className="mb-2 opacity-40" />
                  No files accessible yet.
                  <br />
                  <span className="text-xs mt-1 block opacity-60">
                    Collect more evidence to unlock hidden files.
                  </span>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {folderItems.map((item) => {
                    const collected = state.collectedEvidence.includes(item.id)
                    return (
                      <button
                        key={item.id}
                        onClick={() => collectAndView(item)}
                        className={clsx(
                          'w-full flex items-start gap-3 p-3 rounded text-left transition-all',
                          selectedEvidence?.id === item.id
                            ? 'bg-terminal-green/10 border border-terminal-green/20'
                            : 'hover:bg-white/5 border border-transparent'
                        )}
                      >
                        <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-terminal-text text-sm font-mono truncate">
                            {item.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <EvidenceTag type={item.type} label={item.type.toUpperCase()} />
                            {collected && (
                              <span className="text-terminal-green text-xs flex items-center gap-1">
                                <Eye size={10} /> viewed
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* File content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {selectedEvidence ? (
                  <motion.div
                    key={selectedEvidence.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-terminal-text font-bold text-lg font-mono">
                          {selectedEvidence.icon} {selectedEvidence.title}
                        </h2>
                        <div className="flex gap-2 mt-1">
                          <EvidenceTag type={selectedEvidence.type} label={selectedEvidence.type.toUpperCase()} />
                          <span className="text-terminal-green text-xs font-mono flex items-center gap-1">
                            <Unlock size={10} /> Collected
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Raw content */}
                    <div className="terminal-panel p-4 font-mono text-sm text-terminal-text whitespace-pre-wrap leading-relaxed">
                      {selectedEvidence.content}
                    </div>

                    {/* Analysis */}
                    <div className="border border-terminal-amber/30 bg-terminal-amber/5 rounded p-4">
                      <div className="text-terminal-amber text-xs tracking-widest uppercase mb-2 font-mono">
                        🔍 Detective Notes
                      </div>
                      <p className="text-terminal-text text-sm leading-relaxed">
                        {selectedEvidence.analysis}
                      </p>
                    </div>

                    {/* New unlocks */}
                    {EVIDENCE_ITEMS.filter(
                      (e) =>
                        e.unlockAfter.includes(selectedEvidence.id) &&
                        !state.collectedEvidence.includes(e.id)
                    ).length > 0 && (
                      <div className="border border-terminal-green/30 bg-terminal-green/5 rounded p-3 font-mono text-xs text-terminal-green">
                        ✓ New evidence unlocked — check other folders.
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex items-center justify-center text-terminal-muted font-mono text-sm"
                  >
                    <div className="text-center">
                      <FileText size={40} className="mx-auto mb-3 opacity-20" />
                      Select a file to view its contents
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>

        {/* RIGHT — Notes */}
        <aside className="w-64 border-l border-terminal-border bg-terminal-surface flex flex-col">
          <div className="p-4 border-b border-terminal-border">
            <div className="text-terminal-muted text-xs tracking-widest uppercase">
              Investigation Notes
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {state.notes.length === 0 ? (
              <p className="text-terminal-muted text-xs font-mono p-2">
                No notes yet. Add observations as you investigate.
              </p>
            ) : (
              state.notes.map((note) => (
                <div
                  key={note.id}
                  className="terminal-panel p-2 group relative"
                >
                  <p className="text-terminal-text text-xs font-mono leading-relaxed pr-4">
                    {note.text}
                  </p>
                  <button
                    onClick={() => dispatch({ type: 'REMOVE_NOTE', payload: note.id })}
                    className="absolute top-2 right-2 text-terminal-muted hover:text-terminal-red opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="p-3 border-t border-terminal-border">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) addNote() }}
              placeholder="Add a note... (Ctrl+Enter)"
              rows={3}
              className="w-full bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-terminal-text font-mono text-xs resize-none focus:outline-none focus:border-terminal-green transition-colors placeholder:text-terminal-muted"
            />
            <button
              onClick={addNote}
              disabled={!noteText.trim()}
              className="mt-2 w-full py-1.5 bg-terminal-green/10 border border-terminal-green/30 text-terminal-green rounded font-mono text-xs hover:bg-terminal-green/20 transition-all disabled:opacity-40"
            >
              + Add Note
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
