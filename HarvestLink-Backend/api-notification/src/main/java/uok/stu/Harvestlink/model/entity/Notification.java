package uok.stu.Harvestlink.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "notifications")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Notification implements Serializable {

    @Id
    private String id;

    private String userId;
    private String idempotencyKey;
    private Map<String, Object> payload;

    private String toUser;
    private String subject;
    private String body;
    private String channel;

    private String status = "pending";
    private int attempts = 0;
    private String lastError;

    // For small attachments (< 1MB)
    private String attachmentName;
    private byte[] attachmentData;

    // For large attachments - store reference instead
    private String attachmentUrl; // S3 URL or GridFS ID
    private String attachmentStorageType; // "gridfs", "s3", "local", etc.

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
}