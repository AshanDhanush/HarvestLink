package com.HarvestLink.api_product.service;

import com.HarvestLink.api_product.model.Product;
import com.HarvestLink.api_product.model.ProductRequest;
import com.HarvestLink.api_product.model.ProductResponse;
import com.HarvestLink.api_product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
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
    public void deleteProduct(String id) {
        if (!productRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
        }
        productRepository.deleteById(id);


        kafkaTemplate.send(TOPIC, "DELETE", id);
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
        return new Product(null, req.getName(), req.getDescription(), req.getPrice(), req.getQuantity());
    }

    private ProductResponse mapToProductResponse(Product p) {
        return new ProductResponse(p.getId(), p.getName(), p.getDescription(), p.getPrice(), p.getQuantity());
    }
}