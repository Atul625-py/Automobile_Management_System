package com.rkvk.automobile.automobileshop.auth;

import com.rkvk.automobile.automobileshop.auth.dto.AuthenticationRequestDTO;
import com.rkvk.automobile.automobileshop.auth.dto.AuthenticationResponseDTO;
import com.rkvk.automobile.automobileshop.auth.dto.RegisterUserDTO;
import com.rkvk.automobile.automobileshop.entity.User;
import com.rkvk.automobile.automobileshop.entity.UserEmail;
import com.rkvk.automobile.automobileshop.entity.id.UserEmailId;
import com.rkvk.automobile.automobileshop.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthService authService;

    /**
     * ✅ Register endpoint
     * Accepts multiple emails and attaches them to user via composite IDs.
     */
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterUserDTO dto) {

        User user = User.builder()
                .username(dto.getUsername())
                .password(dto.getPassword()) // hashed in service
                .role(User.Role.valueOf(dto.getRole().toUpperCase()))
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .houseNo(dto.getHouseNo())
                .street(dto.getStreet())
                .locality(dto.getLocality())
                .city(dto.getCity())
                .pinCode(dto.getPinCode())
                .build();

        // ✅ Add multiple emails if present
        if (dto.getEmails() != null && !dto.getEmails().isEmpty()) {
            List<UserEmail> emailEntities = new ArrayList<>();
            for (String email : dto.getEmails()) {
                UserEmail emailEntity = UserEmail.builder()
                        .id(new UserEmailId(null, email)) // userId will be set after persist
                        .user(user)
                        .build();
                emailEntities.add(emailEntity);
            }
            user.setEmails(emailEntities);
        }

        User savedUser = authService.registerUser(user);
        return ResponseEntity.ok(savedUser);
    }

    /**
     * ✅ Login endpoint
     */
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponseDTO> login(@RequestBody AuthenticationRequestDTO request) {
        AuthenticationResponseDTO response = authService.login(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(response);
    }
}
