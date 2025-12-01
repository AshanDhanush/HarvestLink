package uok.stu.Harvestlink.service;

import uok.stu.Harvestlink.model.dto.CreateNotificationRequest;
import uok.stu.Harvestlink.model.dto.CreateNotificationResponce;

public interface NotificationService {
    CreateNotificationResponce create(CreateNotificationRequest req);
}
