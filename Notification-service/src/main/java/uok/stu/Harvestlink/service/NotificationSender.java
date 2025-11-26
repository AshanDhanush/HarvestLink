package uok.stu.Harvestlink.service;

import uok.stu.Harvestlink.model.entity.Notification;

public interface NotificationSender {
    void sendToQueue(Notification notification);
}
