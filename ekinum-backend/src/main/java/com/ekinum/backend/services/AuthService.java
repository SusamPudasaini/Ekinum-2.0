package com.ekinum.backend.services;

import com.ekinum.backend.dtos.SignupRequest;
import com.ekinum.backend.entities.User;
import com.ekinum.backend.entities.UserRole;
import com.ekinum.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;

    private final int expiryHours;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            MailService mailService,
            @Value("${app.verify.expiry-hours:24}") int expiryHours
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailService = mailService;
        this.expiryHours = expiryHours;
    }

    public void signup(SignupRequest req) {
        String email = req.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        if (!req.getPassword().equals(req.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match.");
        }

        User user = new User();
        user.setFullName(req.getFullName().trim());
        user.setPhoneNumber(req.getPhoneNumber().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));

        user.setEmailVerified(false);
        user.setRole(UserRole.CUSTOMER);

        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);
        user.setVerificationTokenExpiry(LocalDateTime.now().plusHours(expiryHours));

        userRepository.save(user);

        // Send via Mailtrap SMTP using Spring Mail
        mailService.sendVerificationEmail(user.getEmail(), user.getFullName(), token);
    }

    public void verifyEmail(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("Verification token is required.");
        }

        User user = userRepository.findByVerificationToken(token.trim())
                .orElseThrow(() -> new IllegalArgumentException("Invalid verification token."));

        if (user.isEmailVerified()) {
            return; // already verified
        }

        LocalDateTime expiry = user.getVerificationTokenExpiry();
        if (expiry == null || expiry.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Verification token expired. Please sign up again or request a new token.");
        }

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);

        userRepository.save(user);
    }
}