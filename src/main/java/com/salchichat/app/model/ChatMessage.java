package com.salchichat.app.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Data
@NoArgsConstructor
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con el usuario (puede ser null si el mensaje viene de un usuario de Telegram no registrado en la web)
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @Column(nullable = false)
    private String sessionId; // Identificador único de la conversación

    @Column(columnDefinition = "TEXT", nullable = false)
    private String prompt; // Lo que el usuario consultó

    @Column(columnDefinition = "TEXT", nullable = false)
    private String response; // Lo que el SalchiChat respondió

    @Column(nullable = false)
    private String platform; // "WEB" o "TELEGRAM"

    private int estimatedTokens; // Para el Dashboard de métricas

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}