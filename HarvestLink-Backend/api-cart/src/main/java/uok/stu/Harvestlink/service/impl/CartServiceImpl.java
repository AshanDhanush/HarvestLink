package uok.stu.Harvestlink.service.impl;

import uok.stu.Harvestlink.model.dto.CartItemRequest;
import uok.stu.Harvestlink.model.entity.Cart;
import uok.stu.Harvestlink.model.entity.CartItem;
import uok.stu.Harvestlink.repository.CartRepository;
import uok.stu.Harvestlink.service.CartService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final WebClient.Builder webClientBuilder;

    @Value("${product.service.url}")
    private String productServiceUrl;

    public CartServiceImpl(CartRepository cartRepository, WebClient.Builder webClientBuilder) {
        this.cartRepository = cartRepository;
        this.webClientBuilder = webClientBuilder;
    }

    @Override
    public Cart getCart(String userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> createNewCart(userId));
    }

    private Cart createNewCart(String userId) {
        Cart cart = new Cart();
        cart.setUserId(userId);
        cart.setItems(new ArrayList<>());
        cart.setTotalAmount(BigDecimal.ZERO);
        return cartRepository.save(cart);
    }

    @Override
    public Cart addToCart(String userId, CartItemRequest itemRequest) {
        // 1. Fetch current price from Product Service
        BigDecimal productPrice = fetchProductPrice(itemRequest.getProductId());

        if (productPrice == null) {
            throw new RuntimeException("Product with ID " + itemRequest.getProductId() + " not found or unavailable.");
        }

        // 2. Get the user's cart or create a new one
        Cart cart = getCart(userId);

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(itemRequest.getProductId()))
                .findFirst();

        if (existingItem.isPresent()) {
            // Update quantity for existing item
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + itemRequest.getQuantity());
            // Update price at time of adding (important if product price changed)
            item.setPriceAtTimeOfAdding(productPrice);
        } else {
            // Add new item
            CartItem newItem = new CartItem(
                    itemRequest.getProductId(),
                    itemRequest.getQuantity(),
                    productPrice
            );
            cart.getItems().add(newItem);
        }

        // 3. Recalculate total amount
        recalculateTotalAmount(cart);

        // 4. Save and return
        return cartRepository.save(cart);
    }

    private BigDecimal fetchProductPrice(String productId) {
        // Synchronous call to Product Service using WebClient
        // The API-PRODUCT service needs a corresponding endpoint (e.g., GET /api/product/{productId}/price)
        // You'll need a DTO in the Product Service for ProductResponse that contains price.

        // This relies on Eureka for service resolution
        // The ProductResponse DTO should have a field like BigDecimal price.

        AtomicReference<BigDecimal> price = new AtomicReference<>();

        try {
            // Assuming Product Service exposes an endpoint like: GET /api/product/{productId}
            webClientBuilder.build()
                    .get()
                    .uri(productServiceUrl + "/api/product/{productId}", productId)
                    .retrieve()
                    .bodyToMono(ProductResponse.class) // You'll need to create this DTO
                    .doOnSuccess(response -> price.set(response.getPrice()))
                    .block(); // Blocking call (synchronous behavior)

            return price.get();

        } catch (Exception e) {
            System.err.println("Error fetching product price: " + e.getMessage());
            return null;
        }
    }

    // Helper method to recalculate the cart total
    private void recalculateTotalAmount(Cart cart) {
        BigDecimal total = cart.getItems().stream()
                .map(item -> item.getPriceAtTimeOfAdding().multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalAmount(total);
    }

    // TODO: Implement removeFromCart logic (left as an exercise)
    @Override
    public Cart removeFromCart(String userId, String productId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}