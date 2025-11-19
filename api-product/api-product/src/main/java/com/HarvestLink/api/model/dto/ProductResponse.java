package com.HarvestLink.api.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;



@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse {
    private String id;
    private String name;
    private String category;
    private BigDecimal price;
    private Double quantity;
    private String description;
    private String imageUrl;
    private String farmerId;
}
