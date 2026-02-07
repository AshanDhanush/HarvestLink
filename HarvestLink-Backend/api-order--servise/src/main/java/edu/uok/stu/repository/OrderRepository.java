package edu.uok.stu.repository;

import edu.uok.stu.model.dto.TopSellingProductDto;
import edu.uok.stu.model.entity.OrderEntity;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<OrderEntity,String> {
}
