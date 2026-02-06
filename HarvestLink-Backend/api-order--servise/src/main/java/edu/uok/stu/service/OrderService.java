package edu.uok.stu.service;

import edu.uok.stu.model.dto.OrderDetailsDto;
import edu.uok.stu.model.dto.OrderRequestDto;
import edu.uok.stu.model.dto.OrderResponse;

import java.util.List;
import java.util.Map;

public interface OrderService {
    boolean addOrder(OrderRequestDto orderRequestDto);

    List<OrderResponse> getOrders();


    Map<String, Object> getMonthlyRevenueAnalytics();
}
