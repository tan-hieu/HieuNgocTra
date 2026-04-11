package com.fpoly.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fpoly.backend.service.AdminOrderService;

@RestController
@RequestMapping("/api/admin/orders")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    public AdminOrderController(AdminOrderService adminOrderService) {
        this.adminOrderService = adminOrderService;
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request) {
        try {
            var cmd = new AdminOrderService.CreateOrderCommand(
                    request.getCustomerMode(),
                    request.getCustomerId(),
                    request.getReceiverName(),
                    request.getReceiverPhone(),
                    request.getShippingAddress(),
                    request.getReceiverEmail(),
                    request.getNote(),
                    request.getPaymentMethod(),
                    request.getOrderStatus(),
                    request.getAdminNote(),
                    request.getItems() == null ? List.of() : request.getItems().stream()
                            .map(i -> new AdminOrderService.OrderProductLine(i.getProductId(), i.getQuantity()))
                            .toList()
            );

            Map<String, Object> body = adminOrderService.createOrder(cmd);
            return ResponseEntity.status(HttpStatus.CREATED).body(body);

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Có lỗi xảy ra khi tạo đơn hàng", "details", ex.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getOrders(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "ALL") String status) {
        try {
            return ResponseEntity.ok(adminOrderService.getOrdersPage(page, size, status));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Có lỗi xảy ra khi lấy danh sách đơn hàng", "details", ex.getMessage()));
        }
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody UpdateOrderStatusRequest request) {
        try {
            return ResponseEntity.ok(adminOrderService.updateOrderStatus(orderId, request.getAction()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Có lỗi xảy ra khi cập nhật trạng thái đơn hàng", "details", ex.getMessage()));
        }
    }

    public static class UpdateOrderStatusRequest {
        private String action;

        public String getAction() { return action; }
        public void setAction(String action) { this.action = action; }
    }

    public static class CreateOrderRequest {
        private String customerMode;
        private Long customerId;
        private String receiverName;
        private String receiverPhone;
        private String shippingAddress;
        private String receiverEmail;
        private String note;
        private String paymentMethod;
        private String orderStatus;
        private String adminNote;
        private List<CreateOrderItemRequest> items;

        public String getCustomerMode() { return customerMode; }
        public void setCustomerMode(String customerMode) { this.customerMode = customerMode; }

        public Long getCustomerId() { return customerId; }
        public void setCustomerId(Long customerId) { this.customerId = customerId; }

        public String getReceiverName() { return receiverName; }
        public void setReceiverName(String receiverName) { this.receiverName = receiverName; }

        public String getReceiverPhone() { return receiverPhone; }
        public void setReceiverPhone(String receiverPhone) { this.receiverPhone = receiverPhone; }

        public String getShippingAddress() { return shippingAddress; }
        public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

        public String getReceiverEmail() { return receiverEmail; }
        public void setReceiverEmail(String receiverEmail) { this.receiverEmail = receiverEmail; }

        public String getNote() { return note; }
        public void setNote(String note) { this.note = note; }

        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

        public String getOrderStatus() { return orderStatus; }
        public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }

        public String getAdminNote() { return adminNote; }
        public void setAdminNote(String adminNote) { this.adminNote = adminNote; }

        public List<CreateOrderItemRequest> getItems() { return items; }
        public void setItems(List<CreateOrderItemRequest> items) { this.items = items; }
    }

    public static class CreateOrderItemRequest {
        private Long productId;
        private Integer quantity;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
}