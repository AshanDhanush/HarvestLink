package com.HarvestLink.api_product.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(value = "product_rating")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ProductRating {
    @Id
    private String id;
    private String productId;
    private String userId;
    private String userName;
    private Integer rating;
    private String comment;
    private String createdAt;
}
