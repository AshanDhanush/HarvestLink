package uok.stu.Harvestlink.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import uok.stu.Harvestlink.config.RabbitConfig;
import uok.stu.Harvestlink.model.entity.Notification;
import uok.stu.Harvestlink.service.NotificationSender;

@Service
@RequiredArgsConstructor // Uses constructor injection for final fields
public class NotificationSenderImpl implements NotificationSender {

    // Injected via constructor
    private final RabbitTemplate rabbitTemplate;

    /**
     * Sends the Notification entity to the appropriate RabbitMQ queue based on its channel.
     * The RabbitTemplate automatically handles serialization (e.g., to JSON).
     */
    @Override
    public void sendToQueue(Notification notification) {

        // Use the constants defined in RabbitConfig to identify the exchange and key
        String routingKey = notification.getChannel() != null && "email".equalsIgnoreCase(notification.getChannel())
                ? RabbitConfig.ROUTING_EMAIL
                : ""; // Fallback for unsupported channels

        if (!routingKey.isEmpty()) {
            // Publish the Notification object to the exchange using the determined routing key
            rabbitTemplate.convertAndSend(
                    RabbitConfig.EXCHANGE, // notifications.exchange
                    routingKey,            // notification.email
                    notification           // The Notification entity (implements Serializable)
            );
            System.out.println("Notification sent to queue: " + notification.getId() + " via channel " + notification.getChannel());
        } else {
            System.err.println("Unsupported channel or missing routing key for notification ID: " + notification.getId());
        }
    }
}