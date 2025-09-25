package com.rkvk.automobile.automobileshop.auth;

import com.rkvk.automobile.automobileshop.auth.dto.AuthenticationRequestDTO;
import com.rkvk.automobile.automobileshop.auth.dto.AuthenticationResponseDTO;
import com.rkvk.automobile.automobileshop.auth.dto.RegisterUserDTO;
import com.rkvk.automobile.automobileshop.entity.User;
import com.rkvk.automobile.automobileshop.service.AuthService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthService authService;

    /**
     * Register endpoint
     */
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterUserDTO dto) {
        User user = User.builder()
                .username(dto.getUsername())
                .password(dto.getPassword()) // will be encoded in service
                .role(User.Role.valueOf(dto.getRole().toUpperCase()))
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .houseNo(dto.getHouseNo())
                .street(dto.getStreet())
                .locality(dto.getLocality())
                .city(dto.getCity())
                .pinCode(dto.getPinCode())
                .build();

        User savedUser = authService.registerUser(user);
        return ResponseEntity.ok(savedUser);
    }
    /**
     * Login endpoint
     */
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponseDTO> login(@RequestBody AuthenticationRequestDTO request) {
        String token = authService.login(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(new AuthenticationResponseDTO(token));
    }
}