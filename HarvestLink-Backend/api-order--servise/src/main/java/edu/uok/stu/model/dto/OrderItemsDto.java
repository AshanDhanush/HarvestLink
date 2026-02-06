package edu.uok.stu.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class OrderItemsDto {

    private String productId;
    private String productName;
    private int quantity;
    private double unitPrice;

}
