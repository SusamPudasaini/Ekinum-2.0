package com.ekinum.backend.controllers;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/customer")
public class CustomerTestController {

    @GetMapping("/ping")
    public Map<String, Object> ping() {
        return Map.of("ok", true, "area", "customer");
    }
}