package com.salchichat.app.controller;

import com.salchichat.app.model.ChatMessage;
import com.salchichat.app.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(
    origins = "*", 
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS}, 
    allowedHeaders = "*", 
    allowCredentials = "false"
)
public class ChatController {

    @Autowired
    private GeminiService geminiService;

    // Endpoint para enviar una pregunta al bot desde la Web
    @PostMapping("/ask")
    public ResponseEntity<?> ask(@RequestBody Map<String, Object> request) {
        try {
            String prompt = (String) request.get("prompt");
            String sessionId = (String) request.get("sessionId");
            Object userIdObj = request.get("userId");
            Long userId = (userIdObj instanceof Number) ? ((Number) userIdObj).longValue() : null;

            if (sessionId == null) sessionId = "default";

            String response = geminiService.askSalchiChat(prompt, userId, "WEB", sessionId);

            Map<String, String> jsonResponse = new HashMap<>();
            jsonResponse.put("response", response);
            return ResponseEntity.ok(jsonResponse);
            
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al conectar con Gemini: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    // Endpoint para pintar el historial en la interfaz de React
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<ChatMessage>> getHistory(@PathVariable String userId) {
        // Manejamos el caso de que el frontend envíe "null" como string o el ID sea inválido
        Long id = (userId == null || "null".equals(userId)) ? null : Long.parseLong(userId);
        List<ChatMessage> history = geminiService.getUserHistory(id);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/generate-title/{sessionId}")
    public ResponseEntity<Map<String, String>> generateTitle(@PathVariable String sessionId) {
        String title = geminiService.generateSessionTitle(sessionId);
        Map<String, String> response = new HashMap<>();
        response.put("title", title);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearHistory() {
        geminiService.clearChatHistory();
        return ResponseEntity.noContent().build();
    }

    // Endpoint para que el Frontend verifique la salud del sistema
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new HashMap<>();
        // Verificamos Gemini a través del servicio
        status.put("gemini_online", geminiService.isGeminiAvailable());
        status.put("database_online", true); // Si llega aquí, JPA está vivo
        return ResponseEntity.ok(status);
    }
}