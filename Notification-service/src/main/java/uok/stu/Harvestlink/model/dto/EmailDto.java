package uok.stu.Harvestlink.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data

public class EmailDto {
    private String to;
    private String subject;
    private String body;
    private String filepath;
}
