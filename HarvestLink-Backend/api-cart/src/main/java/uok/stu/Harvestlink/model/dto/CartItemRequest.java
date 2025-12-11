package uok.stu.Harvestlink.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemRequest {
    private String productId;
    private Integer quantity;
    // We don't ask for the price, the service must fetch it securely
}