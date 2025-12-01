package uok.stu.Harvestlink.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import uok.stu.Harvestlink.model.dto.CreateNotificationRequest;
import uok.stu.Harvestlink.model.dto.CreateNotificationResponce;
import uok.stu.Harvestlink.service.NotificationService;

@RestController
@RequestMapping("/notification")
@RequiredArgsConstructor
public class NotificationController {


    private final NotificationService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CreateNotificationResponce create(@RequestBody CreateNotificationRequest req) {
        return service.create(req);
    }

}
