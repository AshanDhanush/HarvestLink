package edu.uok.stu.model.entity;

import edu.uok.stu.model.dto.OrderItemsDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Document(collection =  "OrderDetails")

public class OrderDetails {
    @Id
    String disID;
    String CustomerName;
    String CustomerEmail;
    List<OrderItemsDto> orderItems;
    double deliveryFees;
    double totalPrice;
    String deliveryAddress;
    String status;
    LocalDate date;
}
