package com.HarvestLink.api.service;

import com.HarvestLink.api.model.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendUserRegisteredEvent(User user) {
        log.info("Sending user registered event for user: {}", user.getEmail());
        Map<String, Object> event = new HashMap<>();
        event.put("id", user.getId());
        event.put("firstName", user.getFirstName());
        event.put("lastName", user.getLastName());
        event.put("email", user.getEmail());
        event.put("role", user.getRole().name());

        kafkaTemplate.send("user-events", event);
    }
}
