package edu.uok.stu.service;

import edu.uok.stu.model.dto.OrderRequestDto;

public interface OrderService {
    boolean addOrder(OrderRequestDto orderRequestDto);
}
