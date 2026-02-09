package com.HarvestLink.api_product.consumer; // Adjust package to your folder structure

import com.HarvestLink.api_product.model.OrderItems;
import com.HarvestLink.api_product.model.ProductRequest; // Ensure you have this DTO
import com.HarvestLink.api_product.service.ProductService; // Ensure you have this Service
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.common.protocol.types.Field;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductKafkaConsumer {

    private final ProductService productService;

    @KafkaListener(topics = "product-commands", groupId = "product-group")
    public void consumeCommand(ProductRequest request) {
        log.info("Received new product event from Kafka: {}", request);

        
        productService.createProduct(request);

        log.info("Product processed successfully.");
    }

    @KafkaListener(topics = "product-delete", groupId = "product-group")
    public void consumeDelete(String id) {
        log.info("Received delete id event from Kafka : {}", id);
        productService.deleteProduct(id);
        log.info("Product delete successfully");
    }

    /*
     * @KafkaListener(topics = "product-update1", groupId = "product-group")
     * public void updateProduct(List<OrderItems> orderItems) {
     * log.info("Received update product info from kafka");
     * productService.updateProductStock(orderItems);
     * log.info("Product update successfully");
     * }
     */

}
