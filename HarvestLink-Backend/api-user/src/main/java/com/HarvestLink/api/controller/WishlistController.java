package com.HarvestLink.api.controller;

import com.HarvestLink.api.model.Wishlist;
import com.HarvestLink.api.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user/wishlist")
@RequiredArgsConstructor

public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping("/add")
    @ResponseStatus(HttpStatus.CREATED)
    public void addToWishlist(@RequestBody Wishlist wishlist) {
        wishlistService.addToWishlist(wishlist);
    }

    // Pass userId and productId to remove specific item
    // Since we might not have the ID on frontend easily without fetching, using
    // productId/userId search
    @DeleteMapping("/remove/{userId}/{productId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeFromWishlist(@PathVariable String userId, @PathVariable String productId) {
        wishlistService.removeFromWishlist(userId, productId);
    }

    @GetMapping("/get/{userId}")
    @ResponseStatus(HttpStatus.OK)
    public List<Wishlist> getUserWishlist(@PathVariable String userId) {
        return wishlistService.getUserWishlist(userId);
    }

    @GetMapping("/check/{userId}/{productId}")
    @ResponseStatus(HttpStatus.OK)
    public boolean checkWishlistStatus(@PathVariable String userId, @PathVariable String productId) {
        return wishlistService.isProductInWishlist(userId, productId);
    }
}
