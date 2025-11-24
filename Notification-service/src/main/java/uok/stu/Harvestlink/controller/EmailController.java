package uok.stu.Harvestlink.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uok.stu.Harvestlink.service.EmailService;

@RestController
@RequestMapping("/notification")
public class EmailController {

    @Autowired
    private EmailService emailService;

}
