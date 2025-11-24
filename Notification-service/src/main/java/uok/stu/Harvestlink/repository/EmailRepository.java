package uok.stu.Harvestlink.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import uok.stu.Harvestlink.model.entity.EmailEntity;

public interface EmailRepository extends MongoRepository<EmailEntity, String> {
}
