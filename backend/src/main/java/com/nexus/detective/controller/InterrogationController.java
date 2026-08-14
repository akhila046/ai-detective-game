package com.nexus.detective.controller;

import com.nexus.detective.dto.InterrogateRequest;
import com.nexus.detective.dto.InterrogateResponse;
import com.nexus.detective.service.InterrogationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class InterrogationController {

    private final InterrogationService interrogationService;

    public InterrogationController(InterrogationService interrogationService) {
        this.interrogationService = interrogationService;
    }

    /**
     * REST endpoint for interrogation.
     * The frontend can also use the WebSocket endpoint (/ws/interrogate)
     * for a real-time streaming feel — both persist to the same DB tables.
     */
    @PostMapping("/interrogate")
    public ResponseEntity<?> interrogate(@Valid @RequestBody InterrogateRequest request) {
        try {
            InterrogateResponse response = interrogationService.interrogate(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(errorBody(e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().body(errorBody("AI service error: " + e.getMessage()));
        }
    }

    private java.util.Map<String, String> errorBody(String msg) {
        return java.util.Map.of("error", msg);
    }
}
