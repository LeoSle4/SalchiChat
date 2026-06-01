package com.salchichat.app.service;

import com.salchichat.app.model.ChatMessage;
import com.salchichat.app.model.User;
import com.salchichat.app.repository.ChatMessageRepository;
import com.salchichat.app.repository.UserRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GeminiService {

    private final ChatClient chatClient;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    private boolean geminiAvailable = true;

    // Usamos el Builder para que Spring AI configure automáticamente la API Key y
    // el modelo
    public GeminiService(ChatClient.Builder chatClientBuilder, ChatMessageRepository chatMessageRepository,
            UserRepository userRepository) {
        this.chatClient = chatClientBuilder.build();
        this.chatMessageRepository = chatMessageRepository;
        this.userRepository = userRepository;
    }

    @Value("${spring.ai.google.genai.api-key}")
    private String apiKey;

    public String askSalchiChat(String prompt, Long userId, String platform, String sessionId) {
        System.out.println("[GeminiService] Longitud de la API Key cargada: " + (apiKey != null ? apiKey.length() : 0));

        // Buscar usuario si existe (Lo movemos arriba para asociarlo a comandos)
        User user = userId != null ? userRepository.findById(userId).orElse(null) : null;

        // --- INTERCEPTOR DE COMANDOS (Ahorro de Tokens) ---
        String trimmedPrompt = prompt.trim();
        if (trimmedPrompt.startsWith("/")) {
            String command = trimmedPrompt.toLowerCase();
            String commandResponse = null;

            if (command.equals("/ping")) {
                commandResponse = "🟢 ¡Pong! \n GeminiService, operativo y conectado.";
            }

            if (command.equals("/status")) {
                StringBuilder statusMsg = new StringBuilder("# 📊 **Estado del Sistema:**\n\n");
                statusMsg.append("✅ **Backend**: Operativo\n\n");
                statusMsg.append("✅ **Base de Datos**: ").append("Conectada (MySQL)\n\n");
                statusMsg.append(isGeminiAvailable() ? "✅ **Motor IA**: Gemini 2.5 Flash\n\n"
                        : "❌ **Motor IA**: Gemini con problemas\n\n");
                statusMsg.append("\n\n ## Respuesta automatica generada por el GeminiService.");
                commandResponse = statusMsg.toString();
            }

            if (commandResponse != null) {
                // Guardar el comando en la auditoría antes de retornar
                ChatMessage cmdLog = new ChatMessage();
                cmdLog.setUser(user);
                cmdLog.setSessionId(sessionId);
                cmdLog.setPrompt(prompt);
                cmdLog.setResponse(commandResponse);
                cmdLog.setPlatform(platform + "_CMD"); // Marcamos que fue un comando
                cmdLog.setEstimatedTokens(0);
                chatMessageRepository.save(cmdLog);
                return commandResponse;
            }
        }

        // 1. Llamar a la API de Gemini
        String aiResponse;

        // 3. Recuperar solo el historial de ESTA sesión para no mezclar contextos
        List<ChatMessage> history = chatMessageRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);

        // Construimos un prompt que incluye el historial de la conversación
        StringBuilder conversationHistory = new StringBuilder();
        conversationHistory.append("Historial de conversación:\n");
        for (ChatMessage msg : history) {
            conversationHistory.append("USER: ").append(msg.getPrompt()).append("\n");
            conversationHistory.append("GEMINI: ").append(msg.getResponse()).append("\n");
        }
        conversationHistory.append("USER: ").append(prompt).append("\n");
        conversationHistory.append("GEMINI:");

        String systemPrompt = "Eres un asistente de cocina humano llamado 'SalchiChat'. " +
                "Eres un experto culinario profesional de origen peruano con un acento neutro. " +
                "No eres un animal ni un robot, sino un colega servicial. " +
                "Responde de forma cordial, profesional y técnica, brindando instrucciones claras y precisas.";

        System.out.println("[GeminiService] Enviando prompt con memoria a Gemini (" + platform + ")");

        try {
            var response = chatClient.prompt()
                    .system(systemPrompt)
                    .user(conversationHistory.toString())
                    .call()
                    .chatResponse();

            if (response != null && response.getResult() != null) {
                aiResponse = response.getResult().getOutput().getText();
                this.geminiAvailable = true;
            } else {
                aiResponse = "Gemini no devolvió resultados. Revisa los filtros de seguridad en Google AI Studio.";
                this.geminiAvailable = false;
            }

        } catch (Exception e) {
            System.err.println("Error directo de Spring AI / Gemini: " + e.getMessage());
            this.geminiAvailable = false;
            throw e; // Relanzamos para que el servicio de Telegram lo capture
        }

        // Guardar la interacción completa (Pregunta y Respuesta)
        ChatMessage interaction = new ChatMessage();
        interaction.setUser(user);
        interaction.setSessionId(sessionId);
        interaction.setPrompt(prompt);
        interaction.setResponse(aiResponse != null ? aiResponse : "Sin respuesta.");
        interaction.setPlatform(platform);
        chatMessageRepository.save(interaction);

        return aiResponse;
    }

    public String generateSessionTitle(String sessionId) {
        List<ChatMessage> history = chatMessageRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);
        if (history.isEmpty())
            return "Nueva Consulta";

        StringBuilder context = new StringBuilder(
                "Basado en estos mensajes, genera un título de máximo 4 palabras para esta conversación:\n");
        for (ChatMessage msg : history.subList(0, Math.min(history.size(), 5))) {
            context.append("- ").append(msg.getPrompt()).append("\n");
        }

        var response = chatClient.prompt()
                .user(context.toString())
                .call()
                .chatResponse();

        return response.getResult().getOutput().getText().replaceAll("[\\\"\\.]", "");
    }

    // Método para recuperar el historial de un usuario específico
    public List<ChatMessage> getUserHistory(Long userId) {
        if (userId == null) {
            return chatMessageRepository.findAll();
        }
        return chatMessageRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void clearChatHistory() {
        chatMessageRepository.deleteAll();
    }

    public boolean isGeminiAvailable() {
        return geminiAvailable;
    }
}