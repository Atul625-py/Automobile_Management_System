package com.rkvk.automobile.automobileshop.service;

import com.rkvk.automobile.automobileshop.auth.dto.*;
import com.rkvk.automobile.automobileshop.entity.*;
import com.rkvk.automobile.automobileshop.entity.User.Role;
import com.rkvk.automobile.automobileshop.exception.ResourceNotFoundException;
import com.rkvk.automobile.automobileshop.repository.*;
import com.rkvk.automobile.automobileshop.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final UserEmailRepository userEmailRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    /**
     * Register new user. Caller must ensure only admins can create admins (enforce via controller or caller).
     */
    @Transactional
    public AuthenticationResponseDTO register(RegisterUserDTO dto) {
        // create user entity
        User user = User.builder()
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(Role.valueOf(dto.getRole().toUpperCase()))
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .houseNo(dto.getHouseNo())
                .street(dto.getStreet())
                .locality(dto.getLocality())
                .city(dto.getCity())
                .pinCode(dto.getPinCode())
                .build();

        User saved = userRepository.save(user);

        // save email mapping
        UserEmail ue = UserEmail.builder()
                .id(new com.rkvk.automobile.automobileshop.entity.id.UserEmailId(saved.getUserId(), dto.getEmail()))
                .user(saved)
                .build();
        userEmailRepository.save(ue);

        String token = jwtUtil.generateToken(dto.getEmail(), saved.getRole().name());
        return new AuthenticationResponseDTO(token, saved.getRole().name());
    }

    public AuthenticationResponseDTO login(AuthenticationRequestDTO request) {
        // authenticate with AuthenticationManager (will call CustomUserDetailsService)
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        // find user via email -> get role
        UserEmail ue = userEmailRepository.findByIdEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("No user found with email: " + request.getEmail()));

        User user = ue.getUser();
        String token = jwtUtil.generateToken(request.getEmail(), user.getRole().name());
        return new AuthenticationResponseDTO(token, user.getRole().name());
    }
}
