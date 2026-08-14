package com.nexus.detective.service;

import com.nexus.detective.dto.InterrogateRequest;
import com.nexus.detective.dto.InterrogateResponse;
import com.nexus.detective.model.ConversationMessage;
import com.nexus.detective.repository.ConversationMessageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class InterrogationService {

    private static final Logger log = LoggerFactory.getLogger(InterrogationService.class);

    // Max prior turns to include in context to keep token count reasonable
    private static final int MAX_HISTORY_TURNS = 10;

    private final OpenAiService openAiService;
    private final CharacterRegistry characterRegistry;
    private final ConversationMessageRepository conversationRepo;
    private final EvidenceRegistry evidenceRegistry;

    public InterrogationService(OpenAiService openAiService,
                                CharacterRegistry characterRegistry,
                                ConversationMessageRepository conversationRepo,
                                EvidenceRegistry evidenceRegistry) {
        this.openAiService = openAiService;
        this.characterRegistry = characterRegistry;
        this.conversationRepo = conversationRepo;
        this.evidenceRegistry = evidenceRegistry;
    }

    @Transactional
    public InterrogateResponse interrogate(InterrogateRequest request) {
        String sessionId = request.getSessionId();
        String characterId = request.getCharacterId();

        // Validate character
        CharacterRegistry.CharacterInfo character = characterRegistry.getCharacter(characterId);

        // Persist the player's message
        ConversationMessage playerMsg = new ConversationMessage(
                sessionId, characterId, "player", request.getMessage());
        conversationRepo.save(playerMsg);

        // Build context-aware system prompt
        String systemPrompt = buildSystemPrompt(character, request);

        // Build message list for OpenAI
        List<OpenAiService.ChatMessage> messages = buildMessageList(request);

        // Call LLM
        String reply = openAiService.chat(systemPrompt, messages);

        // Persist the character's reply
        ConversationMessage charMsg = new ConversationMessage(
                sessionId, characterId, "character", reply);
        conversationRepo.save(charMsg);

        long turnCount = conversationRepo.countBySessionIdAndCharacterIdAndRole(
                sessionId, characterId, "player");

        return new InterrogateResponse(
                characterId,
                character.name(),
                reply,
                (int) turnCount
        );
    }

    /**
     * Enriches the character's base system prompt with contextual clues
     * about what evidence the player has collected so far.
     */
    private String buildSystemPrompt(CharacterRegistry.CharacterInfo character,
                                     InterrogateRequest request) {
        StringBuilder sb = new StringBuilder(character.systemPrompt());
        sb.append("\n\n--- GAME CONTEXT ---\n");
        sb.append("The player is: ").append(request.getPlayerName()).append(" (an intern).\n");

        List<String> collected = request.getCollectedEvidence();
        if (collected != null && !collected.isEmpty()) {
            sb.append("Evidence the player has collected so far:\n");
            for (String evidenceId : collected) {
                EvidenceRegistry.EvidenceItem item = evidenceRegistry.getById(evidenceId);
                if (item != null) {
                    sb.append("  - ").append(item.title()).append(" [").append(item.type()).append("]\n");
                }
            }
        } else {
            sb.append("The player has not yet collected any evidence.\n");
        }

        // Let the character know how many times they've been asked questions
        if (request.getConversationHistory() != null) {
            int turns = (int) request.getConversationHistory().stream()
                    .filter(t -> "user".equals(t.getRole())).count();
            if (turns > 5) {
                sb.append("This is turn ").append(turns)
                  .append(" — the player is persistent. You may reveal slightly more than usual, but still guard your core secrets.\n");
            }
        }

        return sb.toString();
    }

    /**
     * Converts the request's conversation history into OpenAI message format,
     * then appends the current player message.
     * Limits history to MAX_HISTORY_TURNS to keep token count under control.
     */
    private List<OpenAiService.ChatMessage> buildMessageList(InterrogateRequest request) {
        List<OpenAiService.ChatMessage> messages = new ArrayList<>();

        List<InterrogateRequest.ConversationTurn> history = request.getConversationHistory();
        if (history != null && !history.isEmpty()) {
            int start = Math.max(0, history.size() - MAX_HISTORY_TURNS * 2);
            for (int i = start; i < history.size(); i++) {
                InterrogateRequest.ConversationTurn turn = history.get(i);
                messages.add(new OpenAiService.ChatMessage(turn.getRole(), turn.getContent()));
            }
        }

        // Add the current message
        messages.add(new OpenAiService.ChatMessage("user", request.getMessage()));

        return messages;
    }
}
