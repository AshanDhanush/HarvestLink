package com.HarvestLink.api.repository;

import com.HarvestLink.api.model.Wishlist;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends MongoRepository<Wishlist, String> {
    List<Wishlist> findByUserId(String userId);

    Optional<Wishlist> findByUserIdAndProductId(String userId, String productId);
}
