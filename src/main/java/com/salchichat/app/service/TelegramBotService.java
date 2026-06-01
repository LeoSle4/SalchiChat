package com.salchichat.app.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.longpolling.util.LongPollingSingleThreadUpdateConsumer;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.meta.generics.TelegramClient;
import org.telegram.telegrambots.client.okhttp.OkHttpTelegramClient;

@Service
public class TelegramBotService implements LongPollingSingleThreadUpdateConsumer {

    private final TelegramClient telegramClient;
    private final GeminiService geminiService;

    // El constructor inyecta el servicio de IA y levanta el cliente con el Token del .env
    public TelegramBotService(GeminiService geminiService, @Value("${telegram.bot.token}") String botToken) {
        this.geminiService = geminiService;
        this.telegramClient = new OkHttpTelegramClient(botToken);
    }

    @Override
    public void consume(Update update) {
        // Validamos que el update contenga un mensaje de texto válido
        if (update.hasMessage() && update.getMessage().hasText()) {
            String messageText = update.getMessage().getText();
            long chatId = update.getMessage().getChatId();

            // Comando inicial por defecto
            if (messageText.equalsIgnoreCase("/start")) {
                sendText(chatId, "¡Hola! Soy SalchiChat 🌭🤖 tu asistente universitario de IA. ¿En qué te puedo ayudar?");
                return;
            }

            // Comando de Debug: Ping (No consume tokens de IA)
            if (messageText.equalsIgnoreCase("/ping")) {
                sendText(chatId, "¡PONG! El backend de SalchiChat está funcionando correctamente. 🌭🤖");
                return;
            }

            try {
                // Enviamos el prompt a Gemini. Al ser Telegram directo, el userId va como null
                String aiResponse = geminiService.askSalchiChat(messageText, null, "TELEGRAM", String.valueOf(chatId));

                // Respondemos de vuelta al usuario en la plataforma
                sendText(chatId, aiResponse);

            } catch (Exception e) {
                sendText(chatId, "Lo siento, tuve un problema procesando el prompt con Gemini.");
                System.err.println("Error procesando mensaje en SalchiChat: " + e.getMessage());
            }
        }
    }

    // Método encapsulado para el envío de respuestas utilizando la API de meta
    private void sendText(long chatId, String text) {
        SendMessage message = SendMessage.builder()
                .chatId(String.valueOf(chatId)) // v9.5.0 requiere preferiblemente un String para el ChatId
                .text(text)
                .build();
        try {
            telegramClient.execute(message);
        } catch (TelegramApiException e) {
            System.err.println("Error al enviar el paquete de datos a Telegram: " + e.getMessage());
        }
    }
}