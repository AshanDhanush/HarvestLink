package com.HarvestLink.api.service.impl;

import com.HarvestLink.api.model.dto.ProductRequest;
import com.HarvestLink.api.model.dto.ProductResponse;
import com.HarvestLink.api.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Override
    public void createProduct(ProductRequest request) {
        // implement persistence or mapping logic here
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        // replace with real retrieval logic
        return new ArrayList<>();
    }

    @Override
    public ProductResponse getProductById(String id) {
        // replace with real retrieval logic
        return null;
    }
}
