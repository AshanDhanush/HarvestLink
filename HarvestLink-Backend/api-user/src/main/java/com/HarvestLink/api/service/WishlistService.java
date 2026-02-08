package com.HarvestLink.api.service;

import com.HarvestLink.api.model.Wishlist;
import com.HarvestLink.api.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class WishlistService {

    private final WishlistRepository wishlistRepository;

    public void addToWishlist(Wishlist wishlist) {
        // Check if already exists
        Optional<Wishlist> existing = wishlistRepository.findByUserIdAndProductId(wishlist.getUserId(),
                wishlist.getProductId());
        if (existing.isPresent()) {
            log.info("Product already in wishlist: {}", wishlist.getProductId());
            return;
        }
        wishlist.setCreatedAt(LocalDateTime.now().toString());
        wishlistRepository.save(wishlist);
        log.info("Added to wishlist: {}", wishlist.getProductId());
    }

    public void removeFromWishlist(String userId, String productId) {
        Optional<Wishlist> item = wishlistRepository.findByUserIdAndProductId(userId, productId);
        item.ifPresent(wishlistRepository::delete);
        log.info("Removed from wishlist: {}", productId);
    }

    public List<Wishlist> getUserWishlist(String userId) {
        return wishlistRepository.findByUserId(userId);
    }

    public boolean isProductInWishlist(String userId, String productId) {
        return wishlistRepository.findByUserIdAndProductId(userId, productId).isPresent();
    }
}
