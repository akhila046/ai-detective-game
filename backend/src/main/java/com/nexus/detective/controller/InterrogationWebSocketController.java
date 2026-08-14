package com.nexus.detective.controller;

import com.nexus.detective.dto.InterrogateRequest;
import com.nexus.detective.dto.InterrogateResponse;
import com.nexus.detective.service.InterrogationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

/**
 * WebSocket controller for real-time interrogation.
 *
 * Flow:
 *   1. Frontend sends message to /app/interrogate
 *   2. This controller calls the LLM (blocking, on a virtual thread)
 *   3. Reply is pushed to /topic/interrogate/{sessionId}/{characterId}
 *
 * Frontend subscribes to: /topic/interrogate/{sessionId}/{characterId}
 */
@Controller
public class InterrogationWebSocketController {

    private static final Logger log = LoggerFactory.getLogger(InterrogationWebSocketController.class);

    private final InterrogationService interrogationService;
    private final SimpMessagingTemplate messagingTemplate;

    public InterrogationWebSocketController(InterrogationService interrogationService,
                                             SimpMessagingTemplate messagingTemplate) {
        this.interrogationService = interrogationService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/interrogate")
    public void handleInterrogation(@Payload InterrogateRequest request) {
        String destination = "/topic/interrogate/"
                + request.getSessionId() + "/"
                + request.getCharacterId();
        try {
            // Push "typing..." indicator
            messagingTemplate.convertAndSend(destination, Map.of(
                    "type", "typing",
                    "characterId", request.getCharacterId()
            ));

            InterrogateResponse response = interrogationService.interrogate(request);

            // Push the real reply
            messagingTemplate.convertAndSend(destination, Map.of(
                    "type", "reply",
                    "characterId", response.getCharacterId(),
                    "characterName", response.getCharacterName(),
                    "reply", response.getReply(),
                    "turnCount", response.getTurnCount()
            ));
        } catch (Exception e) {
            log.error("WebSocket interrogation error for session {}", request.getSessionId(), e);
            messagingTemplate.convertAndSend(destination, Map.of(
                    "type", "error",
                    "message", "AI service temporarily unavailable. Please try again."
            ));
        }
    }
}
