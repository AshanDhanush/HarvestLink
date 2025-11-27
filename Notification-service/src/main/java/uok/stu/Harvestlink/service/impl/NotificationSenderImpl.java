package uok.stu.Harvestlink.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Service;
import uok.stu.Harvestlink.config.RabbitConfig;
import uok.stu.Harvestlink.model.entity.Notification;
import uok.stu.Harvestlink.service.NotificationSender;

@Service
@RequiredArgsConstructor
@Slf4j
@ConditionalOnBean(RabbitTemplate.class)
public class NotificationSenderImpl implements NotificationSender {

    private final RabbitTemplate rabbitTemplate;

    @Override
    public void sendToQueue(Notification notification) {
        log.info("📨 sendToQueue called for notification ID: {}", notification.getId());

        String routingKey = notification.getChannel() != null && "email".equalsIgnoreCase(notification.getChannel())
                ? RabbitConfig.ROUTING_EMAIL
                : "";

        if (!routingKey.isEmpty()) {
            log.info("🔀 Routing Key: {}, Exchange: {}", routingKey, RabbitConfig.EXCHANGE);

            rabbitTemplate.convertAndSend(
                    RabbitConfig.EXCHANGE,
                    routingKey,
                    notification
            );

            log.info("✅ Notification sent to queue: {} via channel {}", notification.getId(), notification.getChannel());
        } else {
            log.error("❌ Unsupported channel or missing routing key for notification ID: {}", notification.getId());
        }
    }
}