package com.nexus.detective.service;

import com.nexus.detective.dto.StartSessionResponse;
import com.nexus.detective.model.GameSession;
import com.nexus.detective.repository.CollectedEvidenceRepository;
import com.nexus.detective.repository.GameSessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class SessionService {

    private final GameSessionRepository sessionRepo;
    private final CollectedEvidenceRepository evidenceRepo;

    public SessionService(GameSessionRepository sessionRepo,
                          CollectedEvidenceRepository evidenceRepo) {
        this.sessionRepo = sessionRepo;
        this.evidenceRepo = evidenceRepo;
    }

    @Transactional
    public StartSessionResponse startSession(String playerName) {
        String sessionId = UUID.randomUUID().toString().replace("-", "").substring(0, 16);

        GameSession session = new GameSession();
        session.setSessionId(sessionId);
        session.setPlayerName(playerName);
        session.setPhase(GameSession.SessionPhase.INVESTIGATION);
        sessionRepo.save(session);

        return new StartSessionResponse(
                sessionId,
                playerName,
                GameSession.SessionPhase.INVESTIGATION.name(),
                "Welcome to Nexus Corp, " + playerName + ". Alex Mercer's workstation is waiting."
        );
    }

    @Transactional(readOnly = true)
    public GameSession getSession(String sessionId) {
        return sessionRepo.findBySessionId(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + sessionId));
    }

    @Transactional
    public GameSession updatePhase(String sessionId, GameSession.SessionPhase phase) {
        GameSession session = getSession(sessionId);
        session.setPhase(phase);
        return sessionRepo.save(session);
    }

    @Transactional
    public GameSession recordAccusation(String sessionId, String accusedId,
                                        String motive, boolean correct) {
        GameSession session = getSession(sessionId);
        session.setAccusedCharacterId(accusedId);
        session.setAccusationMotive(motive);
        session.setIsCorrectAccusation(correct);
        session.setPhase(correct
                ? GameSession.SessionPhase.SOLVED
                : GameSession.SessionPhase.FAILED);
        return sessionRepo.save(session);
    }
}
