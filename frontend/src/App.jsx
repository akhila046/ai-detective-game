import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { GameProvider } from './context/GameContext'
import IntroScreen from './screens/IntroScreen'
import InvestigationScreen from './screens/InvestigationScreen'
import InterrogationScreen from './screens/InterrogationScreen'
import EvidenceBoardScreen from './screens/EvidenceBoardScreen'
import AccusationScreen from './screens/AccusationScreen'
import OutcomeScreen from './screens/OutcomeScreen'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IntroScreen />} />
          <Route
            path="/investigate"
            element={
              <ProtectedRoute allowedPhases={['investigation', 'interrogation']}>
                <InvestigationScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interrogate/:characterId"
            element={
              <ProtectedRoute allowedPhases={['investigation', 'interrogation']}>
                <InterrogationScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/evidence"
            element={
              <ProtectedRoute allowedPhases={['investigation', 'interrogation']}>
                <EvidenceBoardScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accuse"
            element={
              <ProtectedRoute allowedPhases={['accusation', 'investigation', 'interrogation']}>
                <AccusationScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/outcome"
            element={
              <ProtectedRoute allowedPhases={['solved', 'failed']}>
                <OutcomeScreen />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  )
}
