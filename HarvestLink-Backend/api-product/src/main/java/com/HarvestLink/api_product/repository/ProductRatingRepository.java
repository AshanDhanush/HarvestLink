package com.HarvestLink.api_product.repository;

import com.HarvestLink.api_product.model.ProductRating;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProductRatingRepository extends MongoRepository<ProductRating, String> {
    List<ProductRating> findByProductId(String productId);

    List<ProductRating> findByProductIdAndUserId(String productId, String userId);
}
