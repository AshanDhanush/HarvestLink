package uok.stu.Harvestlink.service;

import jakarta.mail.MessagingException;
import uok.stu.Harvestlink.model.dto.CreateNotificationRequest;

public interface SMTPEmailService {
    void sendEmailWithAttachment(
            String to,
            String subject,
            String body,
            String attachmentName,
            byte[] attachmentData
    ) throws MessagingException;
}
