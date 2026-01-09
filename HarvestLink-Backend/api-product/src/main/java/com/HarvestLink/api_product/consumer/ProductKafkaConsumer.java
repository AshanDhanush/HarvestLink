package com.HarvestLink.api_product.consumer; // Adjust package to your folder structure

import com.HarvestLink.api_product.model.ProductRequest; // Ensure you have this DTO
import com.HarvestLink.api_product.service.ProductService;   // Ensure you have this Service
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductKafkaConsumer {

    private final ProductService productService;

    @KafkaListener(topics = "product-commands", groupId = "product-group")
    public void consumeCommand(ProductRequest request) {
        log.info("Received new product event from Kafka: {}", request);

        // Call your internal service to save the product to MongoDB
        productService.createProduct(request);

        log.info("Product processed successfully.");
    }
}
