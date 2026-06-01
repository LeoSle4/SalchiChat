package com.salchichat.app.config;

import com.salchichat.app.service.TelegramBotService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.telegram.telegrambots.longpolling.TelegramBotsLongPollingApplication;
import jakarta.annotation.PreDestroy;

@Configuration
public class TelegramConfig {

    private TelegramBotsLongPollingApplication botsApplication;

    @Bean
    public TelegramBotsLongPollingApplication registerBot(
            @Value("${telegram.bot.token}") String botToken,
            TelegramBotService telegramBotService) {
        
        try {
            // Instanciamos el manejador de la aplicación de Long Polling de la v9.5.0
            botsApplication = new TelegramBotsLongPollingApplication();
            
            // Registramos el token asociado a nuestro servicio consumidor
            botsApplication.registerBot(botToken, telegramBotService);
            
            System.out.println("============== SALCHICHAT BOT INITIALIZED ==============");
            System.out.println("Bot de Telegram corriendo exitosamente en la versión 9.5.0");
            System.out.println("========================================================");
            
            return botsApplication;
        } catch (Exception e) {
            System.err.println("Fallo crítico al registrar el ciclo de vida del bot: " + e.getMessage());
            return null;
        }
    }

    // Buenas prácticas de seguridad y persistencia: desconecta del servidor de Telegram al apagar la app
    @PreDestroy
    public void stop() {
        if (botsApplication != null) {
            try {
                botsApplication.close();
                System.out.println("Conexión con Telegram cerrada de manera segura.");
            } catch (Exception e) {
                System.err.println("Error al cerrar el pool de Telegram: " + e.getMessage());
            }
        }
    }
}