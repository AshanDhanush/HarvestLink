package uok.stu.Harvestlink.service.impl;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import uok.stu.Harvestlink.service.SMTPEmailService;

@Service
@RequiredArgsConstructor
public class SmtpEmailServiceImpl implements SMTPEmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendEmailWithAttachment(
            String to,
            String subject,
            String body,
            String attachmentName,
            byte[] attachmentData
    ) throws MessagingException {

        // true parameter enables multipart mode for attachments
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, false); // false for plain text email
        helper.setFrom("yourgmail@gmail.com");

        // --- Conditional Attachment Logic ---
        // If the attachment name and data are present, add the attachment.
        // If attachmentData is null or empty, the email is sent without an attachment.
        if (attachmentName != null && attachmentData != null && attachmentData.length > 0) {
            helper.addAttachment(
                    attachmentName,
                    new ByteArrayResource(attachmentData)
            );
            System.out.println("Adding attachment: " + attachmentName);
        }

        mailSender.send(message);
    }
}
