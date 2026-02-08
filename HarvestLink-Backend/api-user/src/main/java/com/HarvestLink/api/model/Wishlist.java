package com.HarvestLink.api.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(value = "wishlist")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Wishlist {
    @Id
    private String id;
    private String userId;
    private String productId;
    private String productName;
    private String productImage;
    private Double price;
    private String createdAt;
}
