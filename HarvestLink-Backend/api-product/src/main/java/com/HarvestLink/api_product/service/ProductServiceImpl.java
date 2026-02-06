package com.HarvestLink.api_product.service;

import com.HarvestLink.api_product.model.OrderItems;
import com.HarvestLink.api_product.model.Product;
import com.HarvestLink.api_product.model.ProductRequest;
import com.HarvestLink.api_product.model.ProductResponse;
import com.HarvestLink.api_product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate; // Added KafkaTemplate
    private static final String TOPIC = "product-events";

    @Override
    public void createProduct(ProductRequest productRequest) {
        Product product = mapToProduct(productRequest);
        Product savedProduct = productRepository.save(product);


        kafkaTemplate.send(TOPIC, "CREATE", savedProduct);
    }

    @Override
    public void updateProduct(String id, ProductRequest productRequest) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        existingProduct.setName(productRequest.getName());
        existingProduct.setPrice(productRequest.getPrice());
        existingProduct.setQuantity(productRequest.getQuantity());

        productRepository.save(existingProduct);


        kafkaTemplate.send(TOPIC, "UPDATE", existingProduct);
    }

    @Override
    @Transactional
    public boolean deleteProduct(String tempid) {
        if (!productRepository.existsByTempID(tempid)) {
            throw new RuntimeException("Product not found: " + tempid);
        }
        productRepository.deleteByTempID(tempid);


        kafkaTemplate.send(TOPIC, "DELETE", tempid);
        return true;
    }

    @Override
    public void UpdateStock(List<OrderItems> orderItems) {
        for(OrderItems i : orderItems) {
            Product product = productRepository.findByTempID(i.getProductId()).orElseThrow();
            int quantity = product.getQuantity();
            System.out.println(quantity);
            int newQuantity =  quantity - i.getQuantity();
            System.out.println(newQuantity);
            product.setQuantity(newQuantity);
            productRepository.save(product);
        }
    }


    @Override
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream().map(this::mapToProductResponse).toList();
    }

    @Override
    public ProductResponse getProductById(String id) {
        Product product = productRepository.findById(id).orElseThrow();
        return mapToProductResponse(product);
    }

    private Product mapToProduct(ProductRequest req) {
        return new Product(null,generateTempId(), req.getName(), req.getDescription(), req.getPrice(), req.getQuantity());
    }

    private ProductResponse mapToProductResponse(Product p) {
        return new ProductResponse(p.getTempID(), p.getName(), p.getDescription(), p.getPrice(), p.getQuantity());
    }

    private String generateTempId() {
        List<Product> products = productRepository.findAll();

        if (products.isEmpty()) {
            return "P001";
        } else {
            int maxId = 0;

            for (Product product : products) {
                String tempId = product.getTempID();
                if (tempId != null && tempId.startsWith("P")) {
                    try {
                        int currentId = Integer.parseInt(tempId.substring(1));
                        if (currentId > maxId) {
                            maxId = currentId;
                        }
                    } catch (NumberFormatException e) {
                    }
                }
            }

            int nextId = maxId + 1;
            return String.format("P%03d", nextId);
        }
    }
}