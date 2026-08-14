package com.nexus.detective.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class InterrogateRequest {

    @NotBlank
    private String sessionId;

    @NotBlank
    private String characterId;

    private String playerName;

    @NotBlank
    @Size(max = 1000, message = "Message too long")
    private String message;

    private List<String> collectedEvidence;

    // Prior turns sent from the frontend for context
    private List<ConversationTurn> conversationHistory;

    @Data
    public static class ConversationTurn {
        private String role;    // "user" or "assistant"
        private String content;
    }
}
