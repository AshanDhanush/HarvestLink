package com.HarvestLink.api.repository;


import com.HarvestLink.api.model.entity.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends MongoRepository<Product,String> {
    //Custom query methods can be added here if needed(findByCategory)
}
