package uok.stu.Harvestlink.service;

public interface SMTPEmailService {
    void sendEmail(String to, String subject, String body);
    void sendEmailWithAttachment(String to, String subject, String body, String attachmentName, byte[] attachmentData);
}