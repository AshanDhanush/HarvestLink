package edu.uok.stu.model.dto;

import edu.uok.stu.model.entity.OrderDetails;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequestDto {

    String CustomerId;
    OrderDetailsDto orderDetails;
}
