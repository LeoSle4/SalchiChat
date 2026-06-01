package com.salchichat.app.controller;

import com.salchichat.app.model.User;
import com.salchichat.app.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Permite que tu frontend de React se conecte sin problemas de CORS
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User savedUser = authService.registerUser(user);
            // No devolvemos el password por seguridad en la respuesta HTTP
            savedUser.setPassword(null); 
            return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        try {
            // Usamos getUsername() para simplificar el acceso
            User authenticatedUser = authService.loginUser(loginRequest.getUsername(), loginRequest.getPassword());
            
            // Construimos una respuesta limpia para el Frontend
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login exitoso");
            response.put("username", authenticatedUser.getUsername());
            response.put("role", authenticatedUser.getRole());
            response.put("id", authenticatedUser.getId());
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }
    }
}