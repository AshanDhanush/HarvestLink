package com.HarvestLink.api.controller;

import com.HarvestLink.api.model.dto.ProductRequest;
import com.HarvestLink.api.model.dto.ProductResponse;
import com.HarvestLink.api.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor

public class ProductController {
    private final ProductService productService;

    // POST /api/v1/products (Create a new product listing)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)

    public ProductResponse createProduct(@RequestBody ProductRequest request){
        return productService.createProduct(request);
    }

    // GET /api/v1/products (Get all product listings)
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ProductResponse> getAllProducts() {
        return productService.getAllProducts();
    }

    // GET /api/v1/products/{id} (Get a single product by ID)
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ProductResponse getProductById(@PathVariable String id) {
        return productService.getProductById(id);
    }

    // PUT /api/v1/products/{id} (Update an existing product)
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    // Security note: Should be restricted to FARMER role and listing owner
    public ProductResponse updateProduct(@PathVariable String id, @RequestBody ProductRequest request) {
        return productService.updateProduct(id, request);
    }

    // DELETE /api/v1/products/{id} (Delete a product listing)
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    // Security note: Should be restricted to FARMER role and listing owner, or ADMIN
    public void deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
    }
}

