package com.HarvestLink.api_product.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class OrderItems {
    private String productId;
    private String productName;
    private int quantity;
    private double unitPrice;
}
