package uok.stu.Harvestlink.repository;

import uok.stu.Harvestlink.model.entity.Cart;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CartRepository extends MongoRepository<Cart, String> {
    // Find a cart by the user ID
    Optional<Cart> findByUserId(String userId);
}