package edu.uok.stu.repository;

import edu.uok.stu.model.dto.TopSellingProductDto;
import edu.uok.stu.model.entity.OrderDetails;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface OrderDetailsRepository extends MongoRepository<OrderDetails,String> {
    List<OrderDetails> findByDateBetween(LocalDate startCurrentMonth, LocalDate endCurrentMonth);
    @Aggregation(pipeline = {
            "{ $unwind: '$orderItems' }",
            "{ $group: { " +
                    "_id: '$orderItems.productId', " +
                    "productName: { $first: '$orderItems.productName' }, " +
                    "totalSold: { $sum: '$orderItems.quantity' } " +
                    "} }",
            "{ $sort: { totalSold: -1 } }",
            "{ $limit: 5 }"
    })
    List<TopSellingProductDto> findTopSellingProduct();
}
