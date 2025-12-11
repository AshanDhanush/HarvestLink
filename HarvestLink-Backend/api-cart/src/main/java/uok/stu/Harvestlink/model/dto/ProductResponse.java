package uok.stu.Harvestlink.model.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductResponse {
    private String id;
    private String name;
    private BigDecimal price; // <--- The crucial field
    // Add other fields as needed
}