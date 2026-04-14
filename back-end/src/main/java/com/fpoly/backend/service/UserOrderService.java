package com.fpoly.backend.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fpoly.backend.entity.Order;
import com.fpoly.backend.entity.OrderItem;
import com.fpoly.backend.entity.OrderStatusHistory;
import com.fpoly.backend.entity.Product;
import com.fpoly.backend.entity.User;
import com.fpoly.backend.repository.OrderRepository;
import com.fpoly.backend.repository.OrderStatusHistoryRepository;
import com.fpoly.backend.repository.ProductRepository;
import com.fpoly.backend.repository.UserRepository;

@Service
public class UserOrderService {

    private final OrderRepository orderRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public UserOrderService(
            OrderRepository orderRepository,
            OrderStatusHistoryRepository orderStatusHistoryRepository,
            ProductRepository productRepository,
            UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.orderStatusHistoryRepository = orderStatusHistoryRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Map<String, Object> placeOrder(PlaceOrderCommand cmd) {
        User currentUser = resolveCurrentUser();

        String receiverName = required(cmd.receiverName(), "Tên người nhận không được để trống");
        String receiverPhone = required(cmd.receiverPhone(), "Số điện thoại không được để trống");
        String shippingAddress = required(cmd.shippingAddress(), "Địa chỉ giao hàng không được để trống");
        String note = trimToNull(cmd.note());
        String paymentMethod = normalizePaymentMethod(cmd.paymentMethod());

        if (cmd.items() == null || cmd.items().isEmpty()) {
            throw new IllegalArgumentException("Đơn hàng phải có ít nhất 1 sản phẩm");
        }

        Order order = new Order();
        order.setUser(currentUser);
        order.setOrderCode(generateUniqueOrderCode());
        order.setReceiverName(receiverName);
        order.setReceiverPhone(receiverPhone);
        order.setShippingAddress(shippingAddress);
        order.setNote(note);
        order.setPaymentMethod(paymentMethod);
        order.setPaymentStatus("UNPAID");
        order.setOrderStatus("PENDING");
        order.setAdminNote(null);

        BigDecimal total = BigDecimal.ZERO;

        for (PlaceOrderItem line : cmd.items()) {
            if (line == null || line.productId() == null) {
                throw new IllegalArgumentException("Thiếu productId trong danh sách sản phẩm");
            }

            int qty = line.quantity() == null ? 0 : line.quantity();
            if (qty <= 0) {
                throw new IllegalArgumentException("Số lượng phải lớn hơn 0");
            }

            Product product = productRepository.findById(line.productId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm id=" + line.productId()));

            if (!"ACTIVE".equalsIgnoreCase(safe(product.getStatus()))) {
                throw new IllegalArgumentException("Sản phẩm không còn khả dụng: " + product.getName());
            }

            int stock = product.getStockQuantity() == null ? 0 : product.getStockQuantity();
            if (stock < qty) {
                throw new IllegalArgumentException("Không đủ tồn kho cho sản phẩm: " + product.getName());
            }

            BigDecimal unitPrice = product.getPrice();
            if (unitPrice == null || unitPrice.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Giá sản phẩm không hợp lệ: " + product.getName());
            }

            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(qty));
            total = total.add(lineTotal);

            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setProductName(product.getName());
            item.setProductImageUrl(product.getMainImageUrl());
            item.setUnitPrice(unitPrice);
            item.setQuantity(qty);
            item.setLineTotal(lineTotal);
            order.addItem(item);

            product.setStockQuantity(stock - qty);
            if (product.getStockQuantity() <= 0) {
                product.setStatus("OUT_OF_STOCK");
            }
        }

        order.setTotalAmount(total);
        Order saved = orderRepository.saveAndFlush(order);

        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrder(saved);
        history.setStatus(saved.getOrderStatus());
        history.setChangedBy(currentUser);
        history.setNote("Khach dat hang");
        history.setChangedAt(LocalDateTime.now());
        orderStatusHistoryRepository.save(history);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", saved.getId());
        response.put("orderCode", saved.getOrderCode());
        response.put("orderStatus", saved.getOrderStatus());
        response.put("paymentMethod", saved.getPaymentMethod());
        response.put("paymentStatus", saved.getPaymentStatus());
        response.put("totalAmount", saved.getTotalAmount());
        response.put("createdAt", saved.getCreatedAt());
        response.put("itemCount", saved.getItems().size());

        return response;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getMyOrders() {
        User currentUser = resolveCurrentUser();

        return orderRepository.findMyOrdersWithItems(currentUser.getId())
                .stream()
                .map(this::toOrderMap)
                .toList();
    }

    private Map<String, Object> toOrderMap(Order o) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", o.getId());
        map.put("orderCode", o.getOrderCode());
        map.put("receiverName", o.getReceiverName());
        map.put("receiverPhone", o.getReceiverPhone());
        map.put("shippingAddress", o.getShippingAddress());
        map.put("note", o.getNote());
        map.put("paymentMethod", o.getPaymentMethod());
        map.put("paymentStatus", o.getPaymentStatus());
        map.put("orderStatus", o.getOrderStatus());
        map.put("totalAmount", o.getTotalAmount());
        map.put("createdAt", o.getCreatedAt());

        List<Map<String, Object>> items = o.getItems().stream().map(i -> {
            Map<String, Object> im = new LinkedHashMap<>();
            im.put("productId", i.getProduct() != null ? i.getProduct().getId() : null);
            im.put("productName", i.getProductName());
            im.put("productImageUrl", i.getProductImageUrl());
            im.put("quantity", i.getQuantity());
            im.put("unitPrice", i.getUnitPrice());
            im.put("lineTotal", i.getLineTotal());
            return im;
        }).toList();

        map.put("items", items);
        return map;
    }

    private User resolveCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getPrincipal() == null
                || "anonymousUser".equals(authentication.getPrincipal().toString())) {
            throw new IllegalArgumentException("Unauthorized");
        }

        Object principal = authentication.getPrincipal();
        String email = null;

        if (principal instanceof org.springframework.security.core.userdetails.User userDetails) {
            email = userDetails.getUsername();
        } else if (principal instanceof OAuth2User oAuth2User) {
            email = oAuth2User.getAttribute("email");
        }

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Unauthorized");
        }

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Unauthorized"));
    }

    private String generateUniqueOrderCode() {
        String code;
        do {
            String random = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
            code = "ORD-" + random;
        } while (orderRepository.existsByOrderCode(code));
        return code;
    }

    private String normalizePaymentMethod(String method) {
        String m = safe(method).toUpperCase();
        return switch (m) {
            case "BANK_TRANSFER", "WALLET", "COD" -> m;
            default -> "COD";
        };
    }

    private String required(String value, String message) {
        String cleaned = value == null ? "" : value.trim();
        if (cleaned.isEmpty()) throw new IllegalArgumentException(message);
        return cleaned;
    }

    private String trimToNull(String value) {
        if (value == null) return null;
        String v = value.trim();
        return v.isEmpty() ? null : v;
    }

    private String safe(String value) {
        return value == null ? "" : value.trim();
    }

    public record PlaceOrderCommand(
            String receiverName,
            String receiverPhone,
            String shippingAddress,
            String note,
            String paymentMethod,
            List<PlaceOrderItem> items
    ) {}

    public record PlaceOrderItem(
            Long productId,
            Integer quantity
    ) {}
}
