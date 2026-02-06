package edu.uok.stu.repository;

import edu.uok.stu.model.entity.OrderDetails;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface OrderDetailsRepository extends MongoRepository<OrderDetails,String> {
}
