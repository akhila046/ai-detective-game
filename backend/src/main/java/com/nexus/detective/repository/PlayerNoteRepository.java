package com.nexus.detective.repository;

import com.nexus.detective.model.PlayerNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerNoteRepository extends JpaRepository<PlayerNote, Long> {
    List<PlayerNote> findBySessionIdOrderByCreatedAtAsc(String sessionId);
}
