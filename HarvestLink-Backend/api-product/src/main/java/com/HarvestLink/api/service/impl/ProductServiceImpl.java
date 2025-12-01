package com.HarvestLink.api.service.impl;

import com.HarvestLink.api.model.dto.ProductRequest;
import com.HarvestLink.api.model.dto.ProductResponse;
import com.HarvestLink.api.model.entity.Product;
import com.HarvestLink.api.repository.ProductRepository;
import com.HarvestLink.api.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    private ProductResponse mapToProductResponse(Product product){

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .category(product.getCategory())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .description(product.getDescription())
                .imageUrl(product.getImageUrl())
                .farmerId(product.getFarmerId())
                .build();

    }

    @Override
    public ProductResponse createProduct(ProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .category(request.getCategory())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .farmerId(request.getFarmerId())
                .build();

        Product savedProduct = productRepository.save(product);
        return mapToProductResponse(savedProduct);
}
    @Override
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponse getProductById(String id) {
        return productRepository.findById(id)
                .map(this::mapToProductResponse)
                .orElseThrow(() -> new NoSuchElementException("Product not found with id: " + id));
    }

    @Override
    public ProductResponse updateProduct(String id, ProductRequest request) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Product not found with id: " + id));

        // Update fields based on the request
        existingProduct.setName(request.getName());
        existingProduct.setCategory(request.getCategory());
        existingProduct.setPrice(request.getPrice());
        existingProduct.setQuantity(request.getQuantity());
        existingProduct.setDescription(request.getDescription());
        existingProduct.setImageUrl(request.getImageUrl());
        // Note: farmerId is typically immutable

        Product updatedProduct = productRepository.save(existingProduct);
        return mapToProductResponse(updatedProduct);
    }

    @Override
    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }
}