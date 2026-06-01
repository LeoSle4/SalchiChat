package com.salchichat.app.repository;

import com.salchichat.app.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    // Recupera el historial ordenado para mantener el contexto del chat por usuario
    List<Message> findByUserIdOrderByTimestampAsc(Long userId);

    // Recupera todo el historial ordenado (global)
    List<Message> findByOrderByTimestampAsc();
}