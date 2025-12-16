package com.HarvestLink.api.service.impl;

import com.HarvestLink.api.exception.ProductNotFoundException;
import com.HarvestLink.api.model.dto.ProductEvent;
import com.HarvestLink.api.model.dto.ProductRequest;
import com.HarvestLink.api.model.dto.ProductResponse;
import com.HarvestLink.api.model.entity.Product;
import com.HarvestLink.api.repository.ProductRepository;
import com.HarvestLink.api.service.ProductEventProducer;
import com.HarvestLink.api.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductEventProducer productEventProducer;

    @Override
    public void createProduct(ProductRequest productRequest) {
        Product product = Product.builder()
                .name(productRequest.getName())
                .description(productRequest.getDescription())
                .price(productRequest.getPrice())
                .quantity(productRequest.getQuantity()) // Assuming quantity exists
                .build();

        productRepository.save(product);
        log.info("Product {} is saved", product.getId());

        // Send event to Kafka/Notification service
        productEventProducer.sendProductEvent(new ProductEvent(product.getId(), "Product Created"));
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream().map(this::mapToProductResponse).collect(Collectors.toList());
    }

    @Override
    public ProductResponse getProductById(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));
        return mapToProductResponse(product);
    }

    @Override
    public void updateProduct(String id, ProductRequest productRequest) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));

        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setQuantity(productRequest.getQuantity());

        productRepository.save(product);
        log.info("Product {} is updated", product.getId());

        productEventProducer.sendProductEvent(new ProductEvent(product.getId(), "Product Updated"));
    }

    @Override
    public void deleteProduct(String id) {
        if (!productRepository.existsById(id)) {
            throw new ProductNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
        log.info("Product {} is deleted", id);

        productEventProducer.sendProductEvent(new ProductEvent(id, "Product Deleted"));
    }

    private ProductResponse mapToProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .build();
    }
}