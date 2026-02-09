package uok.stu.Harvestlink.controller;

import uok.stu.Harvestlink.model.dto.CartItemRequest;
import uok.stu.Harvestlink.model.entity.Cart;
import uok.stu.Harvestlink.service.CartService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }


    @GetMapping("/{userId}")
    @ResponseStatus(HttpStatus.OK)
    public Cart getCart(@PathVariable String userId) {
        return cartService.getCart(userId);
    }

    // POST /api/cart/add/{userId} - Adds a product to the cart
    @PostMapping("/add/{userId}")
    @ResponseStatus(HttpStatus.CREATED)
    public Cart addItemToCart(@PathVariable String userId,
                              @RequestBody CartItemRequest itemRequest) {
        return cartService.addToCart(userId, itemRequest);
    }

    // DELETE /api/cart/remove/{userId}/{productId} - Removes a product from the cart
    @DeleteMapping("/remove/{userId}/{productId}")
    @ResponseStatus(HttpStatus.OK)
    public Cart removeItemFromCart(@PathVariable String userId,
                                   @PathVariable String productId) {
        
        return cartService.removeFromCart(userId, productId);
    }
}