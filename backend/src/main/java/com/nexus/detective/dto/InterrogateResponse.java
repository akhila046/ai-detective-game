package com.nexus.detective.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InterrogateResponse {
    private String characterId;
    private String characterName;
    private String reply;
    private int turnCount;
}
