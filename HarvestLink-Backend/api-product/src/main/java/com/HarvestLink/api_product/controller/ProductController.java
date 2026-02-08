package com.HarvestLink.api_product.controller;

import com.HarvestLink.api_product.model.ProductRequest;
import com.HarvestLink.api_product.model.ProductResponse;
import com.HarvestLink.api_product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/product")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    // CREATE - HTTP POST
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public void createProduct(@RequestPart("product") ProductRequest productRequest,
            @RequestPart("image") MultipartFile image) {
        productService.createProduct(productRequest, image);
    }

    // READ All - HTTP GET
    @GetMapping("getAll")
    @ResponseStatus(HttpStatus.OK)
    public List<ProductResponse> getAllProducts() {
        return productService.getAllProducts();
    }

    // READ by ID - HTTP GET
    @GetMapping("/getby/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ProductResponse getProductById(@PathVariable String id) {
        return productService.getProductById(id);
    }

    // UPDATE - HTTP PUT
    @PutMapping("/update/by/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateProduct(@PathVariable String id, @RequestBody ProductRequest productRequest) {
        productService.updateProduct(id, productRequest);
    }

    // DELETE - HTTP DELETE
    @DeleteMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
    }

    @GetMapping("/latest")
    @ResponseStatus(HttpStatus.OK)
    public List<ProductResponse> getLatestProducts() {
        return productService.getLatestProducts();
    }

    @GetMapping("/top-rated")
    @ResponseStatus(HttpStatus.OK)
    public List<ProductResponse> getTopRatedProducts() {
        return productService.getTopRatedProducts();
    }

    @GetMapping("/popular")
    @ResponseStatus(HttpStatus.OK)
    public List<ProductResponse> getPopularProducts() {
        return productService.getPopularProducts();
    }
}