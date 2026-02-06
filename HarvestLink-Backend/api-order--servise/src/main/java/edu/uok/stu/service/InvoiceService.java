package edu.uok.stu.service;

import edu.uok.stu.model.dto.OrderItemsDto;

import java.util.List;

public interface InvoiceService {

     String buildInvoiceHtml(
            String customerName,
            String customerEmail,
            String deliveryAddress,
            List<OrderItemsDto> orderItems,
            double deliveryFees,
            double totalPrice,
            String status
    );
     byte[] generateInvoicePdf(String html);
}
