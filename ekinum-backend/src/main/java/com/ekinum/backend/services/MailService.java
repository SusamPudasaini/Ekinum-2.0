package com.ekinum.backend.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend.base-url}")
    private String frontendBaseUrl;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String toEmail, String fullName, String token) {
        String verifyUrl = frontendBaseUrl + "/verify?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Verify your email - Ekinum");
        message.setText(
                "Hi " + fullName + ",\n\n" +
                "Thanks for signing up!\n\n" +
                "Please verify your email by clicking the link below:\n" +
                verifyUrl + "\n\n" +
                "If you didn’t create this account, you can ignore this email.\n\n" +
                "— Ekinum Team"
        );

        mailSender.send(message);
    }
}