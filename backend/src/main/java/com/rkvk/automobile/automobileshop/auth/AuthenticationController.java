package com.rkvk.automobile.automobileshop.auth;

import com.rkvk.automobile.automobileshop.auth.dto.*;
import com.rkvk.automobile.automobileshop.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponseDTO> login(@RequestBody AuthenticationRequestDTO request) {
        AuthenticationResponseDTO resp = authService.login(request);
        return ResponseEntity.ok(resp);
    }

    // Registration: only admins can create other admins — enforce with PreAuthorize
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponseDTO> register(@RequestBody RegisterUserDTO dto) {
        AuthenticationResponseDTO resp = authService.register(dto);
        return ResponseEntity.ok(resp);
    }
}
