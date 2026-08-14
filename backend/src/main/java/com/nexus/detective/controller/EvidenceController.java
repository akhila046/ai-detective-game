package com.nexus.detective.controller;

import com.nexus.detective.dto.EvidenceCollectRequest;
import com.nexus.detective.service.EvidenceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/evidence")
public class EvidenceController {

    private final EvidenceService evidenceService;

    public EvidenceController(EvidenceService evidenceService) {
        this.evidenceService = evidenceService;
    }

    /**
     * Record that a player has collected a piece of evidence.
     * Validates unlock prerequisites server-side.
     */
    @PostMapping("/collect")
    public ResponseEntity<?> collect(@Valid @RequestBody EvidenceCollectRequest request) {
        try {
            boolean isNew = evidenceService.collectEvidence(
                    request.getSessionId(), request.getEvidenceId());
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "evidenceId", request.getEvidenceId(),
                    "isNew", isNew
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get all evidence IDs collected by a session.
     */
    @GetMapping("/{sessionId}")
    public ResponseEntity<List<String>> getCollected(@PathVariable String sessionId) {
        return ResponseEntity.ok(evidenceService.getCollectedEvidenceIds(sessionId));
    }

    /**
     * Get all evidence currently available (unlocked) for a session.
     */
    @GetMapping("/{sessionId}/available")
    public ResponseEntity<?> getAvailable(@PathVariable String sessionId) {
        return ResponseEntity.ok(evidenceService.getAvailableForSession(sessionId));
    }
}
