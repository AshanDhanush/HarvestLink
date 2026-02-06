package edu.uok.stu.repository;

import edu.uok.stu.model.entity.OrderDetails;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface OrderDetailsRepository extends MongoRepository<OrderDetails,String> {
    List<OrderDetails> findByDateBetween(LocalDate startCurrentMonth, LocalDate endCurrentMonth);
}
