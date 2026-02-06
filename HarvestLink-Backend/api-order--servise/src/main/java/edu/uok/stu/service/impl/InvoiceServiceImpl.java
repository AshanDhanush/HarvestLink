package edu.uok.stu.service.impl;

import edu.uok.stu.service.InvoiceService;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import edu.uok.stu.model.dto.OrderItemsDto;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.List;

@Service

public class InvoiceServiceImpl implements InvoiceService {

    public String buildInvoiceHtml(
            String customerName,
            String customerEmail,
            String deliveryAddress,
            List<OrderItemsDto> orderItems,
            double deliveryFees,
            double totalPrice,
            String status
    ) {

        StringBuilder html = new StringBuilder();
        System.out.println(customerName + "" + customerEmail);

        html.append("""
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial; }
                            h2 { text-align: center; }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-top: 20px;
                            }
                            th, td {
                                border: 1px solid black;
                                padding: 8px;
                                text-align: center;
                            }
                            th {
                                background-color: #f2f2f2;
                            }
                            .info {
                                margin-top: 10px;
                            }
                            .total {
                                text-align: right;
                                font-weight: bold;
                            }
                        </style>
                    </head>
                    <body>
                        <h2>INVOICE</h2>
                """);

        html.append("<div class='info'><b>Customer:</b> ").append(customerName).append("</div>");
        html.append("<div class='info'><b>Email:</b> ").append(customerEmail).append("</div>");
        html.append("<div class='info'><b>Address:</b> ").append(deliveryAddress).append("</div>");
        html.append("<div class='info'><b>Status:</b> ").append(status).append("</div>");

        html.append("""
                        <table>
                            <tr>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                            </tr>
                """);

        double subTotal = 0;

        for (OrderItemsDto item : orderItems) {
            double itemTotal = item.getQuantity() * item.getUnitPrice();
            subTotal += itemTotal;

            html.append("<tr>");
            html.append("<td>").append(item.getProductName()).append("</td>");
            html.append("<td>").append(item.getQuantity()).append("</td>");
            html.append("<td>").append(item.getUnitPrice()).append("</td>");
            html.append("<td>").append(itemTotal).append("</td>");
            html.append("</tr>");
        }

        html.append("</table>");

        html.append("<p class='total'>Sub Total: ").append(subTotal).append("</p>");
        html.append("<p class='total'>Delivery Fee: ").append(deliveryFees).append("</p>");
        html.append("<p class='total'>Grand Total: ").append(totalPrice).append("</p>");

        html.append("</body></html>");

        return html.toString();
    }

    public byte[] generateInvoicePdf(String html) {
        try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.withHtmlContent(html, null);
            builder.toStream(os);
            builder.run();
            return os.toByteArray(); // Return the byte array
        } catch (Exception e) {
            throw new RuntimeException("Invoice PDF generation failed", e);
        }
    }
}
