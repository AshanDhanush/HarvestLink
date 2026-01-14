package edu.uok.stu.service.impl;


import edu.uok.stu.model.dto.OrderItemsDto;
import edu.uok.stu.model.dto.OrderRequestDto;
import edu.uok.stu.model.entity.OrderDetails;
import edu.uok.stu.model.entity.OrderEntity;
import edu.uok.stu.repository.OrderDetailsRepository;
import edu.uok.stu.repository.OrderRepository;
import edu.uok.stu.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    OrderRepository orderRepository;
    @Autowired
    OrderDetailsRepository orderDetailsRepository;

    LocalDate date = LocalDate.now();
    @Autowired
    private KafkaTemplate<?, ?> kafkaTemplate;

    @Override
    @Transactional
    public boolean addOrder(OrderRequestDto orderRequestDto) {
        if(orderRequestDto == null){
            return false;
        }
        OrderEntity orderEntity = new OrderEntity(null,orderRequestDto.getCustomerId(), LocalDate.now());

        try{
            orderRepository.save(orderEntity);

            OrderDetails orderDetails= mapToOrderDetails(orderRequestDto);
            orderDetailsRepository.save(orderDetails);
            for(OrderItemsDto orderItemsDto : orderDetails.getOrderItems()) {
                Message<OrderItemsDto> message = MessageBuilder
                        .withPayload(orderItemsDto)
                        .setHeader(KafkaHeaders.TOPIC, "product-update1")
                        .build();
                kafkaTemplate.send(message);
            }
            return true;

        }catch (Exception e) {
            throw new RuntimeException("Failed to save order", e);
        }
    }

    private String generateTempId() {
        List<OrderDetails> orders = orderDetailsRepository.findAll();

        if (orders.isEmpty()) {
            return "O001";
        } else {
            int maxId = 0;

            for (OrderDetails order : orders) {
                String tempId = order.getDisID();
                if (tempId != null && tempId.startsWith("O")) {
                    try {
                        int currentId = Integer.parseInt(tempId.substring(1));
                        if (currentId > maxId) {
                            maxId = currentId;
                        }
                    } catch (NumberFormatException e) {
                    }
                }
            }

            int nextId = maxId + 1;
            return String.format("O%03d", nextId);
        }
    }

    private OrderDetails mapToOrderDetails(OrderRequestDto orderRequestDto){
        OrderDetails orderDetails = new OrderDetails();

        orderDetails.setDisID(generateTempId());
        orderDetails.setCustomerName(orderRequestDto.getOrderDetails().getCustomerName());
        orderDetails.setCustomerEmail(orderRequestDto.getOrderDetails().getCustomerEmail());
        orderDetails.setOrderItems(orderRequestDto.getOrderDetails().getOrderItems());
        orderDetails.setDeliveryFees(orderRequestDto.getOrderDetails().getDeliveryFees());
        orderDetails.setTotalPrice(orderRequestDto.getOrderDetails().getTotalPrice());
        orderDetails.setDeliveryAddress(orderRequestDto.getOrderDetails().getDeliveryAddress());
        orderDetails.setStatus(orderRequestDto.getOrderDetails().getStatus());
        orderDetails.setDate(LocalDate.now());

        return orderDetails;
    }


}
