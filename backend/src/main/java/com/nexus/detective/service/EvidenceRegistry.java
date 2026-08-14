package com.nexus.detective.service;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Server-side evidence registry.
 * Mirrors the unlock-chain logic from the frontend data/evidence.js
 * so the backend can independently validate evidence availability.
 */
@Component
public class EvidenceRegistry {

    public record EvidenceItem(
        String id,
        String type,
        String title,
        String folder,
        List<String> unlockAfter
    ) {}

    private static final List<EvidenceItem> ALL_EVIDENCE = List.of(
        new EvidenceItem("git_001",  "git",   "Suspicious Git Commit",            "git_log", List.of()),
        new EvidenceItem("git_002",  "git",   "Alex's Last Commit",               "git_log", List.of()),
        new EvidenceItem("git_003",  "git",   "The Telemetry Update Ticket",      "git_log", List.of("git_001")),
        new EvidenceItem("email_001","email", "Alex's Draft Email (Unsent)",      "emails",  List.of("git_002")),
        new EvidenceItem("email_002","email", "Dana Voss Internal Email",         "emails",  List.of("email_001", "git_003")),
        new EvidenceItem("email_003","email", "HR Performance Review (Suspicious)","emails", List.of("email_002")),
        new EvidenceItem("note_001", "note",  "Alex's Sticky Note",               "desktop", List.of()),
        new EvidenceItem("note_002", "file",  "Encrypted File: findings.enc",     "desktop", List.of("note_001")),
        new EvidenceItem("log_001",  "log",   "Server Access Log — Oct 14",       "logs",    List.of("git_001")),
        new EvidenceItem("log_002",  "log",   "Network Traffic Log — Oct 10-13",  "logs",    List.of("note_002"))
    );

    private static final Map<String, EvidenceItem> BY_ID = ALL_EVIDENCE.stream()
            .collect(Collectors.toMap(EvidenceItem::id, e -> e));

    /**
     * Returns all evidence items whose unlock prerequisites are satisfied
     * by the provided set of already-collected IDs.
     */
    public List<EvidenceItem> getAvailableEvidence(Set<String> collectedIds) {
        return ALL_EVIDENCE.stream()
                .filter(item -> collectedIds.containsAll(item.unlockAfter()))
                .collect(Collectors.toList());
    }

    /**
     * Checks whether a specific evidence item is available given what has been collected.
     */
    public boolean isAvailable(String evidenceId, Set<String> collectedIds) {
        EvidenceItem item = BY_ID.get(evidenceId);
        if (item == null) return false;
        return collectedIds.containsAll(item.unlockAfter());
    }

    public EvidenceItem getById(String id) {
        return BY_ID.get(id);
    }

    public boolean exists(String id) {
        return BY_ID.containsKey(id);
    }

    public List<EvidenceItem> getAll() {
        return ALL_EVIDENCE;
    }
}
