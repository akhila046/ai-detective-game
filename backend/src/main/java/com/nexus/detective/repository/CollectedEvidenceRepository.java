package com.nexus.detective.repository;

import com.nexus.detective.model.CollectedEvidence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollectedEvidenceRepository extends JpaRepository<CollectedEvidence, Long> {
    List<CollectedEvidence> findBySessionId(String sessionId);
    boolean existsBySessionIdAndEvidenceId(String sessionId, String evidenceId);
}
