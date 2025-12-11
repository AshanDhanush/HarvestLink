package uok.stu.Harvestlink.service;

import uok.stu.Harvestlink.model.dto.CartItemRequest;
import uok.stu.Harvestlink.model.entity.Cart;

public interface CartService {
    Cart getCart(String userId);
    Cart addToCart(String userId, CartItemRequest itemRequest);
    Cart removeFromCart(String userId, String productId);
}