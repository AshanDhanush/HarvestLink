package com.HarvestLink.api.service;

import com.HarvestLink.api.model.dto.ProductRequest;
import com.HarvestLink.api.model.dto.ProductResponse;

import java.util.List;

public interface ProductService {
    ProductResponse createProduct(ProductRequest request);
    List<ProductResponse> getAllProducts();
    ProductResponse getProductById(String id);
    ProductResponse updateProduct(String id,ProductRequest request);
    void deleteProduct(String id);

}
