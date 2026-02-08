package com.HarvestLink.api_product.service;

import com.HarvestLink.api_product.model.ProductRating;
import com.HarvestLink.api_product.repository.ProductRatingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.OptionalDouble;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductRatingService {

    private final ProductRatingRepository productRatingRepository;
    private final com.HarvestLink.api_product.repository.ProductRepository productRepository; // Full package to avoid
                                                                                              // import clash if any

    public void addRating(ProductRating productRating) {
        productRating.setCreatedAt(LocalDateTime.now().toString());
        productRatingRepository.save(productRating);

        // Update product average rating
        updateProductAverageRating(productRating.getProductId());

        log.info("Rating added for product: {}", productRating.getProductId());
    }

    public List<ProductRating> getRatingsByProduct(String productId) {
        return productRatingRepository.findByProductId(productId);
    }

    public Double getAverageRating(String productId) {
        List<ProductRating> ratings = productRatingRepository.findByProductId(productId);
        if (ratings.isEmpty()) {
            return 0.0;
        }
        OptionalDouble average = ratings.stream()
                .mapToInt(ProductRating::getRating)
                .average();
        return average.orElse(0.0);
    }

    private void updateProductAverageRating(String productId) {
        Double avg = getAverageRating(productId);
        productRepository.findByTempID(productId).ifPresent(product -> {
            product.setAverageRating(avg);
            productRepository.save(product);
        });
        // Also check by ID if tempID match fails (depending on how ID is stored)
        productRepository.findById(productId).ifPresent(product -> {
            product.setAverageRating(avg);
            productRepository.save(product);
        });
    }
}
