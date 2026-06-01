package com.salchichat.app.repository;

import com.salchichat.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Método clave para el Login: busca si el usuario existe por su nombre
    Optional<User> findByUsername(String username);
}