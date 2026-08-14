package com.nexus.detective.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StartSessionResponse {
    private String sessionId;
    private String playerName;
    private String phase;
    private String message;
}
