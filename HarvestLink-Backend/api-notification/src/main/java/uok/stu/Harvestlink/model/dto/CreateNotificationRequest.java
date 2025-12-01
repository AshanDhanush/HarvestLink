package uok.stu.Harvestlink.model.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateNotificationRequest {
    private String userId;
    private String channel;
    private Map<String, Object> payload;
    private String idempotencyKey;


    private String toUser;
    private String subject;
    private String body;
    private String attachmentName;
    private byte[] attachmentData;
}