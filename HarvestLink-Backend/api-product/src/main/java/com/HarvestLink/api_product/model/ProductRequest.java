package com.HarvestLink.api_product.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductRequest {
    private String name;
    private String category;
    private String farmerName;
    private String location;
    private String description;
    private BigDecimal price;
    private Integer quantity;
    private java.time.LocalDate expiryDate;
}
