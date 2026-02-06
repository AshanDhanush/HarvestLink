package edu.uok.stu.model.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationEvent {
    private String toUser;
    private String subject;
    private String body;
    private String attachmentName;
    private byte[] attachmentData;
}
