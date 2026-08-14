-- AI Detective Game: The Missing Developer
-- MySQL 8.0+ Schema

CREATE DATABASE IF NOT EXISTS ai_detective
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ai_detective;

-- ─────────────────────────────────────────────
-- 1. Game Sessions
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS game_sessions (
    id               BIGINT       NOT NULL AUTO_INCREMENT,
    session_id       VARCHAR(64)  NOT NULL UNIQUE,
    player_name      VARCHAR(50)  NOT NULL,
    phase            ENUM('INVESTIGATION','INTERROGATION','ACCUSATION','SOLVED','FAILED')
                                  NOT NULL DEFAULT 'INVESTIGATION',
    elapsed_seconds  INT          NOT NULL DEFAULT 0,
    accused_character_id VARCHAR(50)  NULL,
    accusation_motive    TEXT         NULL,
    is_correct_accusation BOOLEAN  NULL,
    created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_session_id (session_id)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
-- 2. Collected Evidence (per session)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS collected_evidence (
    id           BIGINT      NOT NULL AUTO_INCREMENT,
    session_id   VARCHAR(64) NOT NULL,
    evidence_id  VARCHAR(50) NOT NULL,
    collected_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_session_evidence (session_id, evidence_id),
    INDEX idx_ce_session (session_id),

    CONSTRAINT fk_ce_session
        FOREIGN KEY (session_id) REFERENCES game_sessions(session_id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
-- 3. Conversation Messages (interrogation history)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS conversation_messages (
    id           BIGINT       NOT NULL AUTO_INCREMENT,
    session_id   VARCHAR(64)  NOT NULL,
    character_id VARCHAR(50)  NOT NULL,
    role         VARCHAR(20)  NOT NULL COMMENT '"player" or "character"',
    content      TEXT         NOT NULL,
    created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_conv_session_char (session_id, character_id),

    CONSTRAINT fk_conv_session
        FOREIGN KEY (session_id) REFERENCES game_sessions(session_id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
-- 4. Player Notes
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS player_notes (
    id         BIGINT      NOT NULL AUTO_INCREMENT,
    session_id VARCHAR(64) NOT NULL,
    content    TEXT        NOT NULL,
    created_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_notes_session (session_id),

    CONSTRAINT fk_notes_session
        FOREIGN KEY (session_id) REFERENCES game_sessions(session_id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
-- 5. Leaderboard view (fastest correct solves)
-- ─────────────────────────────────────────────
CREATE OR REPLACE VIEW leaderboard AS
SELECT
    player_name,
    session_id,
    elapsed_seconds,
    accused_character_id,
    created_at
FROM game_sessions
WHERE phase = 'SOLVED'
  AND is_correct_accusation = TRUE
ORDER BY elapsed_seconds ASC
LIMIT 50;
