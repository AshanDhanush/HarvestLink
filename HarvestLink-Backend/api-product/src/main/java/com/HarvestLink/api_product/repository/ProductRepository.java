package com.HarvestLink.api_product.repository;

import com.HarvestLink.api_product.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {


    boolean existsByTempID(String tempid);

    void deleteByTempID(String tempid);
}