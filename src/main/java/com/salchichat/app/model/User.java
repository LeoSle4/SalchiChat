package com.salchichat.app.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data // Genera getters, setters, toString, equals y hashCode gracias a Lombok
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(nullable = false, length = 255) // Largo porque BCrypt genera hashes largos
    private String password;

    @Column(nullable = false)
    private String role; // Almacenará "USER" o "ADMIN"
}