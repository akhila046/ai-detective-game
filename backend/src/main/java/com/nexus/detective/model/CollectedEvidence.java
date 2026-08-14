package com.nexus.detective.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "collected_evidence",
    uniqueConstraints = @UniqueConstraint(columnNames = {"session_id", "evidence_id"})
)
@Data
@NoArgsConstructor
public class CollectedEvidence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_id", nullable = false, length = 64)
    private String sessionId;

    @Column(name = "evidence_id", nullable = false, length = 50)
    private String evidenceId;

    @Column(name = "collected_at", nullable = false, updatable = false)
    private LocalDateTime collectedAt;

    @PrePersist
    protected void onCreate() {
        collectedAt = LocalDateTime.now();
    }

    public CollectedEvidence(String sessionId, String evidenceId) {
        this.sessionId = sessionId;
        this.evidenceId = evidenceId;
    }
}
