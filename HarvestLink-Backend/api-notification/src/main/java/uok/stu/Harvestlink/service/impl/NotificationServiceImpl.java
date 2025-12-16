package uok.stu.Harvestlink.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uok.stu.Harvestlink.model.dto.CreateNotificationRequest;
import uok.stu.Harvestlink.model.dto.CreateNotificationResponce;
import uok.stu.Harvestlink.model.entity.Notification;
import uok.stu.Harvestlink.repository.NotificationRepository;
import uok.stu.Harvestlink.service.NotificationService;
import uok.stu.Harvestlink.service.NotificationSender;
import uok.stu.Harvestlink.service.SMTPEmailService;
import uok.stu.Harvestlink.util.IdempotencyUtil;

import java.time.LocalDateTime;
import java.util.UUID; // Import UUID

@Service
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository repo;
    private final NotificationSender sender;
    private final SMTPEmailService emailService;

    public NotificationServiceImpl(NotificationRepository repo,
                                   @Autowired(required = false) NotificationSender sender,
                                   SMTPEmailService emailService) {
        this.repo = repo;
        this.sender = sender;
        this.emailService = emailService;
    }

    @Override
    public CreateNotificationResponce create(CreateNotificationRequest req) {
        log.info("🔔 CREATE NOTIFICATION REQUEST RECEIVED");
        log.info("UserId: {}, Channel: {}, ToUser: {}", req.getUserId(), req.getChannel(), req.getToUser());

        String finalIdempotencyKey = req.getIdempotencyKey();


        if (finalIdempotencyKey == null || !IdempotencyUtil.isValidKey(finalIdempotencyKey)) {
            finalIdempotencyKey = UUID.randomUUID().toString();
            log.info("🔑 Auto-generated unique key: {}", finalIdempotencyKey);
        }


        if (finalIdempotencyKey != null) {
            var existing = repo.findByIdempotencyKey(finalIdempotencyKey);
            if (existing.isPresent()) {
                log.info("⚠️ Duplicate notification detected with key: {}", finalIdempotencyKey);
                return new CreateNotificationResponce(existing.get().getId(), existing.get().getStatus());
            }
        }

        Notification notif = Notification.builder()
                .userId(req.getUserId())
                .channel(req.getChannel())
                .payload(req.getPayload())
                .idempotencyKey(finalIdempotencyKey)
                .toUser(req.getToUser())
                .subject(req.getSubject())
                .body(req.getBody())
                .attachmentName(req.getAttachmentName())
                .attachmentData(req.getAttachmentData())
                .status("queued")
                .attempts(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        log.info("💾 Saving notification to database...");
        Notification saved = repo.save(notif);
        log.info("✅ Notification saved with ID: {}", saved.getId());


        if ("email".equalsIgnoreCase(saved.getChannel())) {
            if (sender != null) {
                log.info("📤 Publishing notification to RabbitMQ queue...");
                sender.sendToQueue(saved);
                log.info("✅ Notification published to queue");
            } else {
                log.warn("⚠️ RabbitMQ is disabled. Switching to DIRECT EMAIL sending.");
                sendEmailDirectly(saved);
            }
        } else {
            log.warn("⚠️ Unsupported channel: {}", saved.getChannel());
        }

        return new CreateNotificationResponce(saved.getId(), saved.getStatus());
    }



    private void sendEmailDirectly(Notification notification) {
        try {

            boolean hasAttachment = notification.getAttachmentData() != null
                    && notification.getAttachmentData().length > 0
                    && notification.getAttachmentName() != null;

            if (hasAttachment) {
                log.info("Directly sending email with attachment: {}", notification.getAttachmentName());


                emailService.sendEmailWithAttachment(
                        notification.getToUser(),
                        notification.getSubject(),
                        notification.getBody(),
                        notification.getAttachmentName(), // Name from request
                        notification.getAttachmentData()  // Byte array from request
                );
            } else {
                log.info("Directly sending plain email without attachment");

                // This method is called for plain emails
                emailService.sendEmail(
                        notification.getToUser(),
                        notification.getSubject(),
                        notification.getBody());
            }
        } catch (Exception e) {
            log.error("❌ Failed to send direct email", e);
        }
    }
}