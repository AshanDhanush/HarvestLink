package com.HarvestLink.api.service;

import com.HarvestLink.api.model.dto.ProductRequest;
import com.HarvestLink.api.model.dto.ProductResponse;

import java.util.List;

public interface ProductService {
    void createProduct(ProductRequest request);
    List<ProductResponse> getAllProducts();
    ProductResponse getProductById(String id);
}
