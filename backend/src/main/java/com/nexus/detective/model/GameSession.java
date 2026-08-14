package com.nexus.detective.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "game_sessions")
@Data
@NoArgsConstructor
public class GameSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_id", unique = true, nullable = false, length = 64)
    private String sessionId;

    @Column(name = "player_name", nullable = false, length = 50)
    private String playerName;

    /**
     * Phase: INVESTIGATION, INTERROGATION, ACCUSATION, SOLVED, FAILED
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionPhase phase = SessionPhase.INVESTIGATION;

    @Column(name = "elapsed_seconds", nullable = false)
    private int elapsedSeconds = 0;

    @Column(name = "accused_character_id", length = 50)
    private String accusedCharacterId;

    @Column(name = "accusation_motive", columnDefinition = "TEXT")
    private String accusationMotive;

    @Column(name = "is_correct_accusation")
    private Boolean isCorrectAccusation;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum SessionPhase {
        INVESTIGATION, INTERROGATION, ACCUSATION, SOLVED, FAILED
    }
}
