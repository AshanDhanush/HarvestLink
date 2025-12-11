package uok.stu.Harvestlink.model.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
    private String productId;
    private Integer quantity;
    private BigDecimal priceAtTimeOfAdding; // Crucial for pricing integrity
}