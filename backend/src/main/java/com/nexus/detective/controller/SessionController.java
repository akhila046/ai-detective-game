package com.nexus.detective.controller;

import com.nexus.detective.dto.StartSessionRequest;
import com.nexus.detective.dto.StartSessionResponse;
import com.nexus.detective.model.GameSession;
import com.nexus.detective.service.SessionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping("/start")
    public ResponseEntity<StartSessionResponse> startSession(
            @Valid @RequestBody StartSessionRequest request) {
        StartSessionResponse response = sessionService.startSession(request.getPlayerName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<?> getSession(@PathVariable String sessionId) {
        try {
            GameSession session = sessionService.getSession(sessionId);
            return ResponseEntity.ok(Map.of(
                    "sessionId", session.getSessionId(),
                    "playerName", session.getPlayerName(),
                    "phase", session.getPhase().name(),
                    "elapsedSeconds", session.getElapsedSeconds(),
                    "createdAt", session.getCreatedAt().toString()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
