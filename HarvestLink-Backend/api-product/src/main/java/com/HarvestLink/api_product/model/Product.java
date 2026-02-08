package com.HarvestLink.api_product.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

@Document(collection = "products")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    @Id
    private String id;
    private String tempID;
    private String name;
    private String category;
    private String farmerName;
    private String location;
    private String imageUrl;
    private String description;
    private BigDecimal price;
    private Integer quantity;
    private java.time.LocalDate dateAdded;
    private java.time.LocalDate expiryDate;
    private Double averageRating = 0.0;
    private Integer soldCount = 0;
}