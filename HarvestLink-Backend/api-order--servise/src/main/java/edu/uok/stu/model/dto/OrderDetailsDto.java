package edu.uok.stu.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class OrderDetailsDto {

    String customerName;
    String customerEmail;
    List<OrderItemsDto> orderItems;
    double deliveryFees;
    double totalPrice;
    String deliveryAddress;
    String status;

}
