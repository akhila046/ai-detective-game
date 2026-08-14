package com.nexus.detective.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AccuseResponse {
    private boolean correct;
    private String verdict;
    private String culpritId;
    private String explanation;
}
