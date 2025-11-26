package uok.stu.Harvestlink.consumer;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import uok.stu.Harvestlink.model.entity.Notification;
import uok.stu.Harvestlink.repository.NotificationRepository;
import uok.stu.Harvestlink.service.SMTPEmailService;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NotificationConsumer {

    private final NotificationRepository repo;
    private final SMTPEmailService SMTPEmailService;

    @RabbitListener(queues = "notification.email.queue")
    public void listenEmail(Notification n) {

        try {
            System.out.println("Attempting to send email to: " + n.getToUser());

            // Calls the service, which handles the attachment presence
            SMTPEmailService.sendEmailWithAttachment(
                    n.getToUser(),
                    n.getSubject(),
                    n.getBody(),
                    n.getAttachmentName(),
                    n.getAttachmentData()
            );

            // Update status on success
            n.setStatus("delivered");
            n.setLastError(null);
            n.setUpdatedAt(LocalDateTime.now());
            repo.save(n);
            System.out.println("Email successfully sent and status updated for ID: " + n.getId());

        } catch (MessagingException e) {
            // Update status on failure (will be retried/dead-lettered by RabbitMQ)
            System.err.println("Email sending failed for ID " + n.getId() + ": " + e.getMessage());
            n.setStatus("failed");
            n.setAttempts(n.getAttempts() + 1);
            n.setLastError(e.getMessage());
            n.setUpdatedAt(LocalDateTime.now());
            repo.save(n);

            // Re-throw RuntimeException to trigger RabbitMQ retry/DLQ logic
            throw new RuntimeException("Email failed, attempting retry/DLQ logic.", e);
        }
    }
}
