package com.nexus.detective.controller;

import com.nexus.detective.dto.AccuseRequest;
import com.nexus.detective.dto.AccuseResponse;
import com.nexus.detective.service.AccusationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AccusationController {

    private final AccusationService accusationService;

    public AccusationController(AccusationService accusationService) {
        this.accusationService = accusationService;
    }

    @PostMapping("/accuse")
    public ResponseEntity<?> accuse(@Valid @RequestBody AccuseRequest request) {
        try {
            AccuseResponse response = accusationService.processAccusation(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
