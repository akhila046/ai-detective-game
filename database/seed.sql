-- Seed data for AI Detective Game
-- Run AFTER schema.sql: mysql -u root -p ai_detective < seed.sql

USE ai_detective;

-- Insert a demo completed session so you can see the leaderboard view works
INSERT INTO game_sessions
    (session_id, player_name, phase, elapsed_seconds, accused_character_id,
     accusation_motive, is_correct_accusation, created_at, updated_at)
VALUES
    ('demo_session_001', 'Alice', 'SOLVED', 1823, 'dana_voss',
     'To silence the whistleblower and protect the data deal',
     TRUE, NOW(), NOW()),

    ('demo_session_002', 'Bob', 'FAILED', 2541, 'sam_carter',
     'Following orders from above',
     FALSE, NOW(), NOW());

-- Seed some collected evidence for the demo session
INSERT INTO collected_evidence (session_id, evidence_id, collected_at) VALUES
    ('demo_session_001', 'git_001', NOW()),
    ('demo_session_001', 'git_002', NOW()),
    ('demo_session_001', 'git_003', NOW()),
    ('demo_session_001', 'email_001', NOW()),
    ('demo_session_001', 'email_002', NOW()),
    ('demo_session_001', 'email_003', NOW()),
    ('demo_session_001', 'note_001', NOW()),
    ('demo_session_001', 'note_002', NOW()),
    ('demo_session_001', 'log_001', NOW()),
    ('demo_session_001', 'log_002', NOW());

-- Verify leaderboard
SELECT * FROM leaderboard;
