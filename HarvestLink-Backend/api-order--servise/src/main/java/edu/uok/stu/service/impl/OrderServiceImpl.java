package edu.uok.stu.service.impl;

import edu.uok.stu.model.dto.*;
import edu.uok.stu.model.entity.OrderDetails;
import edu.uok.stu.model.entity.OrderEntity;
import edu.uok.stu.repository.OrderDetailsRepository;
import edu.uok.stu.repository.OrderRepository;
import edu.uok.stu.service.InvoiceService;
import edu.uok.stu.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    OrderRepository orderRepository;
    @Autowired
    OrderDetailsRepository orderDetailsRepository;
    @Autowired
    private InvoiceService invoiceService;

    LocalDate date = LocalDate.now();
    @Autowired
    private KafkaTemplate<?, ?> kafkaTemplate;
    @Autowired
    private KafkaTemplate<Object, NotificationEvent> kafkaTemplate1;

    @Override
    @Transactional
    public boolean addOrder(OrderRequestDto orderRequestDto) {
        if (orderRequestDto == null) {
            return false;
        }
        OrderEntity orderEntity = new OrderEntity(null, orderRequestDto.getCustomerId(), LocalDate.now());

        try {
            orderRepository.save(orderEntity);

            OrderDetails orderDetails = mapToOrderDetails(orderRequestDto);
            orderDetailsRepository.save(orderDetails);

            // 🔹 SEND KAFKA NOTIFICATIONS (truly non-blocking - runs in background thread)
            CompletableFuture.runAsync(() -> {
                try {
                    // 🔹 BUILD INVOICE
                    String html = invoiceService.buildInvoiceHtml(
                            orderRequestDto.getOrderDetails().getCustomerName(),
                            orderRequestDto.getOrderDetails().getCustomerEmail(),
                            orderRequestDto.getOrderDetails().getDeliveryAddress(),
                            orderRequestDto.getOrderDetails().getOrderItems(),
                            orderRequestDto.getOrderDetails().getDeliveryFees(),
                            orderRequestDto.getOrderDetails().getTotalPrice(),
                            orderRequestDto.getOrderDetails().getStatus());

                    // 🔹 GENERATE PDF
                    byte[] pdfBytes = invoiceService.generateInvoicePdf(html);
                    String pdfFileName = "Invoice_" + orderRequestDto.getOrderDetails().getCustomerName() + ".pdf";

                    // 🔹 PREPARE KAFKA NOTIFICATION EVENT
                    NotificationEvent notificationEvent = new NotificationEvent(
                            orderRequestDto.getOrderDetails().getCustomerEmail(),
                            "Order Confirmation & Invoice",
                            "Thank you for your order! Please find your invoice attached.",
                            pdfFileName,
                            pdfBytes);

                    // 🔹 SEND TO KAFKA
                    kafkaTemplate1.send("invoice-topic", notificationEvent);

                    for (OrderItemsDto orderItemsDto : orderDetails.getOrderItems()) {
                        Message<OrderItemsDto> message = MessageBuilder
                                .withPayload(orderItemsDto)
                                .setHeader(KafkaHeaders.TOPIC, "product-update1")
                                .build();
                        kafkaTemplate.send(message);
                    }
                } catch (Exception kafkaEx) {
                    // Log warning but don't fail the order
                    System.err.println(
                            "⚠️ Kafka notification failed (order was saved successfully): " + kafkaEx.getMessage());
                }
            });

            return true;

        } catch (Exception e) {
            throw new RuntimeException("Failed to save order", e);
        }
    }

    @Override
    public List<OrderResponse> getOrders() {
        List<OrderDetails> orderDetails = orderDetailsRepository.findAll();
        List<OrderResponse> orderResponses = new ArrayList<>();

        for (OrderDetails o : orderDetails) {

            List<String> productNames = o.getOrderItems().stream()
                    .map(OrderItemsDto::getProductName)
                    .toList();

            List<Integer> quantities = o.getOrderItems().stream()
                    .map(OrderItemsDto::getQuantity)
                    .toList();

            OrderResponse response = new OrderResponse(
                    o.getDisID(),
                    o.getCustomerName(),
                    o.getCustomerEmail(),
                    productNames,
                    quantities,
                    o.getDeliveryFees(),
                    o.getTotalPrice(),
                    o.getDeliveryAddress(),
                    o.getStatus(),
                    o.getDate().toString());

            orderResponses.add(response);
        }

        return orderResponses;
    }

    @Override
    public Map<String, Object> getMonthlyRevenueAnalytics() {
        LocalDate now = LocalDate.now();

        LocalDate startCurrentMonth = now.withDayOfMonth(1);
        LocalDate endCurrentMonth = now.withDayOfMonth(now.lengthOfMonth());

        LocalDate startLastMonth = now.minusMonths(1).withDayOfMonth(1);
        LocalDate endLastMonth = now.minusMonths(1).withDayOfMonth(now.minusMonths(1).lengthOfMonth());

        List<OrderDetails> currentMonthOrders = orderDetailsRepository.findByDateBetween(startCurrentMonth,
                endCurrentMonth);
        List<OrderDetails> lastMonthOrders = orderDetailsRepository.findByDateBetween(startLastMonth, endLastMonth);

        double currentMonthTotal = currentMonthOrders.stream()
                .mapToDouble(OrderDetails::getTotalPrice)
                .sum();

        double lastMonthTotal = lastMonthOrders.stream()
                .mapToDouble(OrderDetails::getTotalPrice)
                .sum();

        double percentageChange;
        if (lastMonthTotal == 0) {
            percentageChange = (currentMonthTotal > 0) ? 100.0 : 0.0;
        } else {
            percentageChange = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
        }

        Map<String, Object> response = new HashMap<>();
        response.put("currentMonthTotal", currentMonthTotal);
        response.put("lastMonthTotal", lastMonthTotal);
        response.put("percentageChange", Math.round(percentageChange * 100.0) / 100.0);
        System.out.println(currentMonthTotal);
        System.out.println(lastMonthTotal);
        System.out.println(percentageChange);

        return response;
    }

    @Override
    public List<TopSellingProductDto> getTopSellingProducts() {
        return orderDetailsRepository.findTopSellingProduct();
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

    private OrderDetails mapToOrderDetails(OrderRequestDto orderRequestDto) {
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
