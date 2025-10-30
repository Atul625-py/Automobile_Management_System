package com.rkvk.automobile.automobileshop.controller;

import com.rkvk.automobile.automobileshop.dto.UserDTO;
import com.rkvk.automobile.automobileshop.entity.User;
import com.rkvk.automobile.automobileshop.mapper.UserMapper;
import com.rkvk.automobile.automobileshop.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ----- CREATE -----
    @PostMapping
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDTO) {
        User savedUser = userService.createUser(userDTO);
        return ResponseEntity.ok(UserMapper.toDTO(savedUser));
    }

    // ----- UPDATE -----
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        User updatedUser = userService.updateUser(id, userDTO);
        return ResponseEntity.ok(UserMapper.toDTO(updatedUser));
    }

    // ----- DELETE -----
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    // ----- GET SINGLE USER -----
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(UserMapper.toDTO(user));
    }

    // ----- LIST ALL USERS -----
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers()
                .stream()
                .map(UserMapper::toDTO)
                .toList();
        return ResponseEntity.ok(users);
    }

    // ----- SEARCH BY USERNAME -----
    @GetMapping("/username/{username}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        return ResponseEntity.ok(UserMapper.toDTO(user));
    }


    @GetMapping("/role/{role}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<List<UserDTO>> getUsersByRole(@PathVariable String role) {
        List<UserDTO> users = userService.getUsersByRole(User.Role.valueOf(role))
                .stream()
                .map(UserMapper::toDTO)
                .toList();
        return ResponseEntity.ok(users);
    }
}
