import React, { createContext, useContext, useReducer } from 'react'

const GameContext = createContext(null)

const initialState = {
  sessionId: null,
  playerName: '',
  // Evidence collected so far (array of evidence IDs)
  collectedEvidence: [],
  // Which suspects have been interrogated
  interrogated: [],
  // Notes the player has written
  notes: [],
  // Current chapter / phase: 'intro' | 'investigation' | 'interrogation' | 'accusation' | 'solved' | 'failed'
  phase: 'intro',
  // Track which file folders have been opened
  openedFolders: [],
  // The player's final accusation
  accusation: null,
  // Conversation history per suspect (keyed by characterId)
  conversations: {},
  // Timer (seconds elapsed)
  elapsed: 0,
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...initialState,
        sessionId: action.payload.sessionId,
        playerName: action.payload.playerName,
        phase: 'investigation',
      }

    case 'COLLECT_EVIDENCE':
      if (state.collectedEvidence.includes(action.payload)) return state
      return {
        ...state,
        collectedEvidence: [...state.collectedEvidence, action.payload],
      }

    case 'OPEN_FOLDER':
      if (state.openedFolders.includes(action.payload)) return state
      return {
        ...state,
        openedFolders: [...state.openedFolders, action.payload],
      }

    case 'ADD_NOTE':
      return {
        ...state,
        notes: [...state.notes, { id: Date.now(), text: action.payload }],
      }

    case 'REMOVE_NOTE':
      return {
        ...state,
        notes: state.notes.filter((n) => n.id !== action.payload),
      }

    case 'SET_PHASE':
      return { ...state, phase: action.payload }

    case 'MARK_INTERROGATED':
      if (state.interrogated.includes(action.payload)) return state
      return {
        ...state,
        interrogated: [...state.interrogated, action.payload],
      }

    case 'ADD_CONVERSATION_MESSAGE':
      const { characterId, message } = action.payload
      const existing = state.conversations[characterId] || []
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [characterId]: [...existing, message],
        },
      }

    case 'SET_ACCUSATION':
      return { ...state, accusation: action.payload, phase: 'accusation' }

    case 'RESOLVE_CASE':
      return {
        ...state,
        phase: action.payload.correct ? 'solved' : 'failed',
      }

    case 'TICK':
      return { ...state, elapsed: state.elapsed + 1 }

    case 'RESET':
      return initialState

    default:
      return state
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
