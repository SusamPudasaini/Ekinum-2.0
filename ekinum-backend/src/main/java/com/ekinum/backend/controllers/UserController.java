package com.ekinum.backend.controllers;

import com.ekinum.backend.entities.User;
import com.ekinum.backend.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        String email = authentication.getName().trim().toLowerCase();
        User u = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return ResponseEntity.ok(Map.of(
                "userId", u.getUserId(),
                "fullName", u.getFullName(),
                "email", u.getEmail(),
                "phoneNumber", u.getPhoneNumber(),
                "role", u.getRole().name(),
                "emailVerified", u.isEmailVerified()
        ));
    }
}