package lt.msi2016;


import lt.msi2016.internal.controller.CommandsWsHandler;
import lt.msi2016.internal.controller.VideoStreamWsHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfiguration implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(commandsWsHandler(), "/ws/api/{operatorId}").setAllowedOrigins("*");
        registry.addHandler(videoStreamWsHandler(), "/ws/video/{operatorId}").setAllowedOrigins("*");
    }

    @Bean
    public WebSocketHandler commandsWsHandler() {
        return new CommandsWsHandler();
    }

    @Bean
    public WebSocketHandler videoStreamWsHandler() {
        return new VideoStreamWsHandler();
    }
}
