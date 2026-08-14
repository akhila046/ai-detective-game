package com.nexus.detective.repository;

import com.nexus.detective.model.ConversationMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationMessageRepository extends JpaRepository<ConversationMessage, Long> {
    List<ConversationMessage> findBySessionIdAndCharacterIdOrderByCreatedAtAsc(
            String sessionId, String characterId);

    List<ConversationMessage> findBySessionIdOrderByCreatedAtAsc(String sessionId);

    long countBySessionIdAndCharacterIdAndRole(String sessionId, String characterId, String role);
}
