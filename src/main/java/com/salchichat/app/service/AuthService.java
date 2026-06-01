package com.salchichat.app.service;

import com.salchichat.app.model.User;
import com.salchichat.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 1. Lógica de Registro
    public User registerUser(User user) {
        // Verificar si el usuario ya existe para evitar duplicados
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("El nombre de usuario ya está en uso.");
        }
        
        // CUMPLIENDO REQUERIMIENTO: Encriptar la contraseña antes de guardarla en la DB
        String encryptedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encryptedPassword);
        
        // Por defecto, si no se especifica rol, se le asigna USER
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        } else {
            user.setRole(user.getRole().toUpperCase());
        }
        
        return userRepository.save(user);
    }

    // 2. Lógica de Login
    public User loginUser(String username, String rawPassword) {
        // Buscamos por nombre de usuario directamente
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Compara la contraseña en texto plano con el hash guardado en la DB
            if (passwordEncoder.matches(rawPassword, user.getPassword())) {
                return user; // Credenciales correctas, retornamos el usuario (con su rol)
            }
        }
        throw new RuntimeException("Usuario o contraseña incorrectos.");
    }
}