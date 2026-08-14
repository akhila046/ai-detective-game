package com.nexus.detective.service;

import com.nexus.detective.model.CollectedEvidence;
import com.nexus.detective.repository.CollectedEvidenceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class EvidenceService {

    private final CollectedEvidenceRepository evidenceRepo;
    private final EvidenceRegistry evidenceRegistry;

    public EvidenceService(CollectedEvidenceRepository evidenceRepo,
                           EvidenceRegistry evidenceRegistry) {
        this.evidenceRepo = evidenceRepo;
        this.evidenceRegistry = evidenceRegistry;
    }

    @Transactional
    public boolean collectEvidence(String sessionId, String evidenceId) {
        // Validate the evidence exists
        if (!evidenceRegistry.exists(evidenceId)) {
            throw new IllegalArgumentException("Unknown evidence ID: " + evidenceId);
        }

        // Check unlock prerequisites server-side
        Set<String> alreadyCollected = getCollectedIds(sessionId);
        if (!evidenceRegistry.isAvailable(evidenceId, alreadyCollected)) {
            throw new IllegalStateException("Evidence not yet available: " + evidenceId);
        }

        // Idempotent — don't double-record
        if (evidenceRepo.existsBySessionIdAndEvidenceId(sessionId, evidenceId)) {
            return false; // already collected
        }

        evidenceRepo.save(new CollectedEvidence(sessionId, evidenceId));
        return true; // newly collected
    }

    @Transactional(readOnly = true)
    public List<String> getCollectedEvidenceIds(String sessionId) {
        return evidenceRepo.findBySessionId(sessionId)
                .stream()
                .map(CollectedEvidence::getEvidenceId)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Set<String> getCollectedIds(String sessionId) {
        return evidenceRepo.findBySessionId(sessionId)
                .stream()
                .map(CollectedEvidence::getEvidenceId)
                .collect(Collectors.toSet());
    }

    /**
     * Returns all evidence items currently available to this session
     * (i.e. unlocked based on what they've already collected).
     */
    @Transactional(readOnly = true)
    public List<EvidenceRegistry.EvidenceItem> getAvailableForSession(String sessionId) {
        Set<String> collected = getCollectedIds(sessionId);
        return evidenceRegistry.getAvailableEvidence(collected);
    }
}
