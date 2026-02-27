package com.ekinum.backend.controllers;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminTestController {

    @GetMapping("/ping")
    public Map<String, Object> ping() {
        return Map.of("ok", true, "area", "admin");
    }
}