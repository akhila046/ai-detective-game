package com.nexus.detective.service;

import com.nexus.detective.dto.AccuseRequest;
import com.nexus.detective.dto.AccuseResponse;
import com.nexus.detective.service.SessionService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AccusationService {

    @Value("${game.culprit-id}")
    private String culpritId;

    private final SessionService sessionService;
    private final CharacterRegistry characterRegistry;

    public AccusationService(SessionService sessionService,
                             CharacterRegistry characterRegistry) {
        this.sessionService = sessionService;
        this.characterRegistry = characterRegistry;
    }

    @Transactional
    public AccuseResponse processAccusation(AccuseRequest request) {
        if (!characterRegistry.isValidCharacter(request.getAccusedId())) {
            throw new IllegalArgumentException("Invalid suspect: " + request.getAccusedId());
        }

        boolean correct = culpritId.equals(request.getAccusedId());

        sessionService.recordAccusation(
                request.getSessionId(),
                request.getAccusedId(),
                request.getMotive(),
                correct
        );

        CharacterRegistry.CharacterInfo accused =
                characterRegistry.getCharacter(request.getAccusedId());
        CharacterRegistry.CharacterInfo culprit =
                characterRegistry.getCharacter(culpritId);

        String verdict;
        String explanation;

        if (correct) {
            verdict = "CORRECT";
            explanation = String.format(
                "%s orchestrated Alex Mercer's removal to protect the DataBridge Solutions data deal. " +
                "She ordered Sam Carter to delete Alex's monitoring scripts, revoked their access, " +
                "and fabricated an HR performance review after the fact. " +
                "Alex is safe but was silenced under a legal NDA.",
                culprit.name()
            );
        } else {
            verdict = "INCORRECT";
            explanation = String.format(
                "%s was not the culprit. The real orchestrator was %s, the CEO's Executive Assistant, " +
                "who protected a $102K/month data deal with DataBridge Solutions by silencing Alex Mercer.",
                accused.name(), culprit.name()
            );
        }

        return new AccuseResponse(correct, verdict, culpritId, explanation);
    }
}
