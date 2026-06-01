package com.salchichat.app.repository;

import com.salchichat.app.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    // Este método soluciona el error de la línea 43 en GeminiService
    // Permite recuperar el historial de una sesión específica para dar contexto a la IA
    List<ChatMessage> findBySessionIdOrderByCreatedAtAsc(String sessionId);

    // Este método soluciona el error de la línea 98 en GeminiService
    // Permite recuperar todo el historial de un usuario para el dashboard
    List<ChatMessage> findByUserIdOrderByCreatedAtDesc(Long userId);
}