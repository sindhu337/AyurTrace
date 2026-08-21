package com.ayurtrace.dto;

import com.ayurtrace.entity.Order;
import com.ayurtrace.entity.OrderItem;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class OrderResponse {
    private Long id;
    private String customerName;
    private String customerMobile;
    private BigDecimal totalAmount;
    private String status;
    private String paymentMethod;
    private String paymentStatus;
    private LocalDateTime orderDate;
    private List<OrderItemResponse> items;

    @Data
    public static class OrderItemResponse {
        private Long productId;
        private String productName;
        private Integer quantity;
        private BigDecimal price;
    }

    public static OrderResponse from(Order o) {
        OrderResponse r = new OrderResponse();
        r.setId(o.getId());
        if (o.getCustomer() != null) {
            r.setCustomerName(o.getCustomer().getFullName());
            r.setCustomerMobile(o.getCustomer().getMobile());
        }
        r.setTotalAmount(o.getTotalAmount());
        r.setStatus(o.getStatus());
        r.setPaymentMethod(o.getPaymentMethod());
        r.setPaymentStatus(o.getPaymentStatus());
        r.setOrderDate(o.getOrderDate());
        r.setItems(o.getItems().stream().map(i -> {
            OrderItemResponse ir = new OrderItemResponse();
            ir.setProductId(i.getProduct().getId());
            ir.setProductName(i.getProduct().getName());
            ir.setQuantity(i.getQuantity());
            ir.setPrice(i.getPrice());
            return ir;
        }).collect(Collectors.toList()));
        return r;
    }
}
