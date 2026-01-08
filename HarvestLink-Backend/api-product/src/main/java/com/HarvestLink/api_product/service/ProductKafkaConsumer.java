package com.HarvestLink.api_product.service;
import com.HarvestLink.api_product.model.ProductRequest;
import com.HarvestLink.api_product.model.ProductResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductKafkaConsumer {
    private final ProductService productService;

    // Listens for commands to perform database actions
    @KafkaListener(topics = "product-commands", groupId = "product-group")
    public void consumeCommand(ProductRequest request) {
        // This allows another service to trigger createProduct via Kafka
        productService.createProduct(request);
    }


}
