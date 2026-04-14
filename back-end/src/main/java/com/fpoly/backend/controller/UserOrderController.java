package com.fpoly.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fpoly.backend.service.UserOrderService;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserOrderController {

    private final UserOrderService userOrderService;

    public UserOrderController(UserOrderService userOrderService) {
        this.userOrderService = userOrderService;
    }

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody PlaceOrderRequest request) {
        try {
            var cmd = new UserOrderService.PlaceOrderCommand(
                    request.getReceiverName(),
                    request.getReceiverPhone(),
                    request.getShippingAddress(),
                    request.getNote(),
                    request.getPaymentMethod(),
                    request.getItems() == null ? List.of() : request.getItems().stream()
                            .map(i -> new UserOrderService.PlaceOrderItem(i.getProductId(), i.getQuantity()))
                            .toList()
            );

            Map<String, Object> body = userOrderService.placeOrder(cmd);
            return ResponseEntity.status(HttpStatus.CREATED).body(body);

        } catch (IllegalArgumentException ex) {
            HttpStatus status = "Unauthorized".equalsIgnoreCase(ex.getMessage()) ? HttpStatus.UNAUTHORIZED : HttpStatus.BAD_REQUEST;
            return ResponseEntity.status(status).body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Có lỗi xảy ra khi đặt hàng", "details", ex.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyOrders() {
        try {
            return ResponseEntity.ok(userOrderService.getMyOrders());
        } catch (IllegalArgumentException ex) {
            HttpStatus status = "Unauthorized".equalsIgnoreCase(ex.getMessage()) ? HttpStatus.UNAUTHORIZED : HttpStatus.BAD_REQUEST;
            return ResponseEntity.status(status).body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Có lỗi xảy ra khi lấy danh sách đơn hàng", "details", ex.getMessage()));
        }
    }

    public static class PlaceOrderRequest {
        private String receiverName;
        private String receiverPhone;
        private String shippingAddress;
        private String note;
        private String paymentMethod;
        private List<PlaceOrderItemRequest> items;

        public String getReceiverName() { return receiverName; }
        public void setReceiverName(String receiverName) { this.receiverName = receiverName; }

        public String getReceiverPhone() { return receiverPhone; }
        public void setReceiverPhone(String receiverPhone) { this.receiverPhone = receiverPhone; }

        public String getShippingAddress() { return shippingAddress; }
        public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

        public String getNote() { return note; }
        public void setNote(String note) { this.note = note; }

        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

        public List<PlaceOrderItemRequest> getItems() { return items; }
        public void setItems(List<PlaceOrderItemRequest> items) { this.items = items; }
    }

    public static class PlaceOrderItemRequest {
        private Long productId;
        private Integer quantity;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
}
