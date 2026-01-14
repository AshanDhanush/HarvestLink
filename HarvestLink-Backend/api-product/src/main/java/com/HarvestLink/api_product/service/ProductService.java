package com.HarvestLink.api_product.service;

import com.HarvestLink.api_product.model.OrderItems;
import com.HarvestLink.api_product.model.ProductRequest;
import com.HarvestLink.api_product.model.ProductResponse;

import java.util.List;

public interface ProductService {
    void createProduct(ProductRequest productRequest);
    List<ProductResponse> getAllProducts();
    ProductResponse getProductById(String id);
    void updateProduct(String id, ProductRequest productRequest);
    boolean deleteProduct(String id);
    void UpdateStock(List<OrderItems> orderItems);
}