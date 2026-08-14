package com.nexus.detective.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class AccuseRequest {
    @NotBlank
    private String sessionId;

    @NotBlank
    private String accusedId;

    private String motive;

    private List<String> evidence;
}
