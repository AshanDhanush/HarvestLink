package edu.uok.stu.controller;


import edu.uok.stu.model.dto.OrderRequestDto;
import edu.uok.stu.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {

    @Autowired
    OrderService orderService;

    @PostMapping("add/order")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> addOrder(@RequestBody OrderRequestDto orderRequestDto){
        return ResponseEntity.ok(orderService.addOrder(orderRequestDto));
    }

}
