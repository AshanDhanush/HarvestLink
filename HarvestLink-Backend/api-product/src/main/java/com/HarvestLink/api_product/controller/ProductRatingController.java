package com.HarvestLink.api_product.controller;

import com.HarvestLink.api_product.model.ProductRating;
import com.HarvestLink.api_product.service.ProductRatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/product/rating")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductRatingController {

    private final ProductRatingService productRatingService;

    @PostMapping("/add")
    @ResponseStatus(HttpStatus.CREATED)
    public void addRating(@RequestBody ProductRating productRating) {
        productRatingService.addRating(productRating);
    }

    @GetMapping("/get/{productId}")
    @ResponseStatus(HttpStatus.OK)
    public List<ProductRating> getRatingsByProduct(@PathVariable String productId) {
        return productRatingService.getRatingsByProduct(productId);
    }

    @GetMapping("/average/{productId}")
    @ResponseStatus(HttpStatus.OK)
    public Double getAverageRating(@PathVariable String productId) {
        return productRatingService.getAverageRating(productId);
    }
}
