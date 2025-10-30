package com.rkvk.automobile.automobileshop.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class AuthenticationResponseDTO {
    private String token;
    private Long userId;
    private String role;
}
