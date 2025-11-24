package uok.stu.Harvestlink.model.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collation = "emails")
@AllArgsConstructor
@NoArgsConstructor
@Data

public class EmailEntity {

    @Id
    private String id;
    private String to;
    private String subject;
    private String body;
    private String filepath;
}
