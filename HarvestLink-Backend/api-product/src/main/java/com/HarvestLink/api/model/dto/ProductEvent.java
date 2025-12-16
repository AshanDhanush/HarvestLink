package com.HarvestLink.api.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductEvent {
    private String type;
    private String productId;
    private String name;
    private BigDecimal price;
}