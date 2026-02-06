package edu.uok.stu.model.entity;

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
@Document(collation = "order-entity")
public class OrderEntity {
    @Id
    String orderId;
    String CustomerId;
    LocalDate Date;



    
}
