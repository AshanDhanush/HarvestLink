package edu.uok.stu.controller;

import edu.uok.stu.model.dto.OrderDetailsDto;
import edu.uok.stu.model.dto.OrderRequestDto;
import edu.uok.stu.model.dto.OrderResponse;
import edu.uok.stu.model.dto.TopSellingProductDto;
import edu.uok.stu.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    OrderService orderService;

    @PostMapping("add/order")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> addOrder(@RequestBody OrderRequestDto orderRequestDto) {
        return ResponseEntity.ok(orderService.addOrder(orderRequestDto));
    }

    @GetMapping("get/Orders")
    @ResponseStatus(HttpStatus.CREATED)
    public List<OrderResponse> getOrders() {
        return orderService.getOrders();
    }

    @GetMapping("get/revenue")
    public ResponseEntity<Map<String, Object>> getMonthlyAnalytics() {
        return ResponseEntity.ok(orderService.getMonthlyRevenueAnalytics());
    }

    @GetMapping("get/topsellingproducts")
    public List<TopSellingProductDto> getTopSellingProducts() {
        return orderService.getTopSellingProducts();
    }

}
