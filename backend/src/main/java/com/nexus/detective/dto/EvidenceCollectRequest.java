package com.nexus.detective.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EvidenceCollectRequest {
    @NotBlank
    private String sessionId;

    @NotBlank
    private String evidenceId;
}
