package uok.stu.Harvestlink.consumer;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import uok.stu.Harvestlink.model.dto.ProductEvent;

@Component
@Slf4j
public class ProductEventConsumer {

    @KafkaListener(topics = "product-events", groupId = "notification-group")
    public void listenProductEvents(ProductEvent productEvent) {
        log.info("========================================");
        log.info("🛒 Received New Product Event!");
        log.info("Product ID: {}", productEvent.getId());
        log.info("Name: {}", productEvent.getName());
        log.info("Farmer ID: {}", productEvent.getFarmerId());
        log.info("========================================");

    }
}
