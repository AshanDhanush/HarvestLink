package com.HarvestLink.api.service;

import com.HarvestLink.api.model.dto.ProductRequest;
import com.HarvestLink.api.model.dto.ProductResponse;

import java.util.List;

public interface ProductService {
    void createProduct(ProductRequest productRequest);
    List<ProductResponse> getAllProducts();
    ProductResponse getProductById(String id);
    void updateProduct(String id, ProductRequest productRequest);
    void deleteProduct(String id);
}