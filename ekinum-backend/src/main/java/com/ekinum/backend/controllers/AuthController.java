package com.ekinum.backend.controllers;

import com.ekinum.backend.dtos.*;
import com.ekinum.backend.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiMessageResponse> signup(@Valid @RequestBody SignupRequest request) {
        authService.signup(request);
        return ResponseEntity.ok(new ApiMessageResponse(
                "Signup successful! Please check your email to verify your account."
        ));
    }

    @GetMapping("/verify")
    public ResponseEntity<ApiMessageResponse> verify(@RequestParam("token") String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok(new ApiMessageResponse(
                "Email verified successfully! You can now log in."
        ));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<ApiMessageResponse> resendVerification(
            @Valid @RequestBody ResendVerificationRequest request
    ) {
        authService.resendVerification(request.getEmail());
        return ResponseEntity.ok(new ApiMessageResponse(
                "Verification email sent successfully. Please check your inbox."
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}