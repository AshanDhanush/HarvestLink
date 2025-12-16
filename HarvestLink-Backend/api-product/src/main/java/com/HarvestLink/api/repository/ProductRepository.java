package com.HarvestLink.api.repository;

import com.HarvestLink.api.model.entity.Product;
import org.springframework.data.mongodb.repository.MongoRepository; // Or JpaRepository

public interface ProductRepository extends MongoRepository<Product, String> {
}