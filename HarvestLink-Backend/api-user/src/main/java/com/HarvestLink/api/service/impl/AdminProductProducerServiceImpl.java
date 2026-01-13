package com.HarvestLink.api.service.impl;

import com.HarvestLink.api.model.dto.ProductRequest;
import com.HarvestLink.api.service.AdminProductProducerService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminProductProducerServiceImpl implements AdminProductProducerService {

    private final KafkaTemplate<String, ProductRequest> kafkaTemplate;

    @Override
    public String sendProduct(ProductRequest productRequest) {
        // 1. Create a Spring Message with the payload and topic header
        Message<ProductRequest> message = MessageBuilder
                .withPayload(productRequest)
                .setHeader(KafkaHeaders.TOPIC, "product-commands")
                .build();

        // 2. Send the message to Kafka
        kafkaTemplate.send(message);

        return "Product creation request sent successfully";
    }

    @Override
    public String deleteProduct(String id) {
        Message<String> message = MessageBuilder
                .withPayload(id)
                .setHeader(KafkaHeaders.TOPIC,"product-delete")
                .build();

        kafkaTemplate.send(message);
        return "Product Delete successfully";
    }

}
