package com.HarvestLink.api.service;

import com.HarvestLink.api.model.dto.ProductRequest;

public interface AdminProductProducerService {
    String sendProduct(ProductRequest productRequest);
}
