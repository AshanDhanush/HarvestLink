package edu.uok.stu.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class OrderResponse {

    String disID;
    String CustomerName;
    String CustomerEmail;
    List<String> productNames;
    List<Integer> quantity;
    double deliveryFees;
    double totalPrice;
    String deliveryAddress;
    String status;
    String date;
}
