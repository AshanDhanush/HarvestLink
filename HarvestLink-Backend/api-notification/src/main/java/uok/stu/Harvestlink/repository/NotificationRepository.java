package uok.stu.Harvestlink.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import uok.stu.Harvestlink.model.entity.Notification;

import java.util.Optional;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    Optional<Notification> findByIdempotencyKey(String key);
}
