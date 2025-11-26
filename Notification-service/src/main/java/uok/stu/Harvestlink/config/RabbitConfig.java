package uok.stu.Harvestlink.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;




@Configuration
public class RabbitConfig {
    public static final String EXCHANGE = "notifications.exchange";
    public static final String QUEUE_EMAIL = "notification.email.queue";
    public static final String ROUTING_EMAIL = "notification.email";

    @Bean
    public TopicExchange notificationExchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue emailQueue() {
        return QueueBuilder.durable(QUEUE_EMAIL).build();
    }

    @Bean
    public Binding emailBinding() {
        return BindingBuilder.bind(emailQueue())
                .to(notificationExchange())
                .with(ROUTING_EMAIL);
    }
}
