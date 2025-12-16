package com.HarvestLink.api.service;

import com.HarvestLink.api.model.entity.Product;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendProductEvent(Product product) {
        log.info("Sending product event for product: {}", product.getId());
        kafkaTemplate.send("product-events", product);
    }
}
