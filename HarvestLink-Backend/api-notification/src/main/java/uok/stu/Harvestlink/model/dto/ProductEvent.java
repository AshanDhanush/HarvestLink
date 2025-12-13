package uok.stu.Harvestlink.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductEvent {
    private String id;
    private String name;
    private String category;
    private BigDecimal price;
    private Double quantity;
    private String description;
    private String imageUrl;
    private String farmerId;
}
