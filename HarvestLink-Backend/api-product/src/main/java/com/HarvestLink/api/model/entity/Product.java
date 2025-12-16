package com.HarvestLink.api.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;



@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")//MongoDB collection Name
public class Product {
    @Id
    private String id;
    private String name;
    private String category;
    private BigDecimal price;
    private Double quantity;
    private String description;
    private String imageUrl;
    private String farmerId; // Links the product to the user who created the listing
}

