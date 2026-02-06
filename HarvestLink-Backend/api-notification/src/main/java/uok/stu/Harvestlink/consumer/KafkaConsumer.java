package uok.stu.Harvestlink.consumer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import uok.stu.Harvestlink.model.dto.CreateNotificationRequest; // Using your existing DTO
import uok.stu.Harvestlink.service.SMTPEmailService;

@Component
@RequiredArgsConstructor
@Slf4j
public class KafkaConsumer {

    private final SMTPEmailService emailService;

    @KafkaListener(topics = "invoice-topic", groupId = "notification-group")
    public void listenInvoice(CreateNotificationRequest notification) {
        log.info("📧 Received invoice notification for: {}", notification.getToUser());

        try {
            if (notification.getAttachmentData() != null && notification.getAttachmentData().length > 0) {
                log.info("Sending email with attachment: {}", notification.getAttachmentName());

                emailService.sendEmailWithAttachment(
                        notification.getToUser(),
                        notification.getSubject(),
                        notification.getBody(),
                        notification.getAttachmentName(),
                        notification.getAttachmentData()
                );
            } else {
                // Fallback if no attachment (though invoice flow should always have one)
                emailService.sendEmail(
                        notification.getToUser(),
                        notification.getSubject(),
                        notification.getBody()
                );
            }
            log.info("✅ Invoice email sent successfully.");

        } catch (Exception e) {
            log.error("❌ Failed to send invoice email", e);
        }
    }
}