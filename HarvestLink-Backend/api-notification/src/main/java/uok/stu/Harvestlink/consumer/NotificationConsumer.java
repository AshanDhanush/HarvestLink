
package uok.stu.Harvestlink.consumer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import uok.stu.Harvestlink.config.RabbitConfig;
import uok.stu.Harvestlink.model.entity.Notification;
import uok.stu.Harvestlink.service.SMTPEmailService;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationConsumer {

    private final SMTPEmailService emailService;

    @RabbitListener(queues = RabbitConfig.QUEUE_EMAIL)
    public void listenEmail(Notification notification) {
        log.info("========================================");
        log.info("📧 Received notification from queue!");
        log.info("ID: {}", notification.getId());
        log.info("To: {}", notification.getToUser());
        log.info("Subject: {}", notification.getSubject());
        log.info("========================================");

        try {

            boolean hasAttachment = notification.getAttachmentData() != null
                    && notification.getAttachmentData().length > 0
                    && notification.getAttachmentName() != null;

            if (hasAttachment) {
                log.info("Sending email with attachment: {}", notification.getAttachmentName());
                emailService.sendEmailWithAttachment(
                        notification.getToUser(),
                        notification.getSubject(),
                        notification.getBody(),
                        notification.getAttachmentName(),
                        notification.getAttachmentData()
                );
            } else {
                log.info("Sending plain email without attachment");
                emailService.sendEmail(
                        notification.getToUser(),
                        notification.getSubject(),
                        notification.getBody()
                );
            }

            log.info("✅ Email sent successfully for notification: {}", notification.getId());

        } catch (Exception e) {
            log.error("❌ Failed to process notification: {}", notification.getId(), e);
            throw new RuntimeException("Failed to send email notification", e);
        }
    }
}