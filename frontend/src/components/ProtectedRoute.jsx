import React from 'react'
import { Navigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'

export default function ProtectedRoute({ children, allowedPhases }) {
  const { state } = useGame()
  if (!allowedPhases.includes(state.phase)) {
    return <Navigate to="/" replace />
  }
  return children
}
