package edu.uok.stu.service;

import edu.uok.stu.model.dto.OrderDetailsDto;
import edu.uok.stu.model.dto.OrderRequestDto;
import edu.uok.stu.model.dto.OrderResponse;

import java.util.List;

public interface OrderService {
    boolean addOrder(OrderRequestDto orderRequestDto);

    List<OrderResponse> getOrders();
}
