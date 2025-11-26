package uok.stu.Harvestlink.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uok.stu.Harvestlink.model.dto.CreateNotificationRequest;
import uok.stu.Harvestlink.model.dto.CreateNotificationResponce;
import uok.stu.Harvestlink.model.entity.Notification;
import uok.stu.Harvestlink.repository.NotificationRepository;
import uok.stu.Harvestlink.service.NotificationService;
import uok.stu.Harvestlink.service.NotificationSender;
import uok.stu.Harvestlink.util.IdempotencyUtil; // <-- ADDED IMPORT

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository repo;
    private final NotificationSender sender;

    @Override
    public CreateNotificationResponce create(CreateNotificationRequest req) {

        // 1. Determine the final idempotency key
        String finalIdempotencyKey = req.getIdempotencyKey();

        // If the key is null or invalid, generate one based on request content
        if (finalIdempotencyKey == null || !IdempotencyUtil.isValidKey(finalIdempotencyKey)) {

            // Build a unique string from all relevant fields (content, recipient, type)
            StringBuilder inputBuilder = new StringBuilder();
            inputBuilder.append(req.getUserId());
            inputBuilder.append(req.getChannel());
            inputBuilder.append(req.getToUser());
            inputBuilder.append(req.getSubject());
            inputBuilder.append(req.getBody());

            // Convert Map payload to string for key generation
            if (req.getPayload() != null) {
                inputBuilder.append(req.getPayload().toString());
            }

            finalIdempotencyKey = IdempotencyUtil.generateKey(inputBuilder.toString()); // <-- UTIL CLASS USED
        }

        // 2. Perform idempotency check using the determined key
        if (finalIdempotencyKey != null) {
            var existing = repo.findByIdempotencyKey(finalIdempotencyKey);
            if (existing.isPresent()) {
                // Return existing status if request is a duplicate
                return new CreateNotificationResponce(existing.get().getId(), existing.get().getStatus());
            }
        }

        // 3. Create and save new notification entity
        Notification notif = Notification.builder()
                .userId(req.getUserId())
                .channel(req.getChannel())
                .payload(req.getPayload())
                .idempotencyKey(finalIdempotencyKey) // Store the generated/provided key

                // Email Specific Mapping
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

        Notification saved = repo.save(notif);

        // 4. Publish to queue
        if ("email".equalsIgnoreCase(saved.getChannel())) {
            sender.sendToQueue(saved);
        }

        return new CreateNotificationResponce(saved.getId(), saved.getStatus());
    }
}
