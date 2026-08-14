import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach session ID to every request
api.interceptors.request.use((config) => {
  const sessionId = sessionStorage.getItem('sessionId')
  if (sessionId) config.headers['X-Session-Id'] = sessionId
  return config
})

export const sessionApi = {
  start: (playerName) =>
    api.post('/sessions/start', { playerName }),

  getState: (sessionId) =>
    api.get(`/sessions/${sessionId}`),
}

export const interrogateApi = {
  sendMessage: ({ sessionId, characterId, playerName, message, collectedEvidence, conversationHistory }) =>
    api.post('/interrogate', {
      sessionId,
      characterId,
      playerName,
      message,
      collectedEvidence,
      conversationHistory,
    }),
}

export const evidenceApi = {
  collect: (sessionId, evidenceId) =>
    api.post('/evidence/collect', { sessionId, evidenceId }),

  getCollected: (sessionId) =>
    api.get(`/evidence/${sessionId}`),
}

export const accuseApi = {
  submit: ({ sessionId, accusedId, motive, evidence }) =>
    api.post('/accuse', { sessionId, accusedId, motive, evidence }),
}

export default api
