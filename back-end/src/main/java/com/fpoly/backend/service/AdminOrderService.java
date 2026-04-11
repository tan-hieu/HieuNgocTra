package com.fpoly.backend.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fpoly.backend.dao.OrderDao;
import com.fpoly.backend.dao.OrderStatusHistoryDao;
import com.fpoly.backend.entity.Order;
import com.fpoly.backend.entity.OrderItem;
import com.fpoly.backend.entity.OrderStatusHistory;
import com.fpoly.backend.entity.Product;
import com.fpoly.backend.entity.Role;
import com.fpoly.backend.entity.User;
import com.fpoly.backend.repository.ProductRepository;
import com.fpoly.backend.repository.RoleRepository;
import com.fpoly.backend.repository.UserRepository;

@Service
public class AdminOrderService {

    private final OrderDao orderDao;
    private final OrderStatusHistoryDao orderStatusHistoryDao;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final RoleRepository roleRepository;

    private final String guestUsername;

    public AdminOrderService(
            OrderDao orderDao,
            OrderStatusHistoryDao orderStatusHistoryDao,
            UserRepository userRepository,
            ProductRepository productRepository,
            RoleRepository roleRepository,
            @Value("${app.orders.guest-username:guest_order}") String guestUsername) {
        this.orderDao = orderDao;
        this.orderStatusHistoryDao = orderStatusHistoryDao;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.roleRepository = roleRepository;
        this.guestUsername = guestUsername;
    }

    @Transactional
    public Map<String, Object> createOrder(CreateOrderCommand cmd) {
        String customerMode = normalizeCustomerMode(cmd.customerMode());
        User orderUser = resolveOrderUser(customerMode, cmd.customerId());

        String receiverName = required(cmd.receiverName(), "Tên người nhận không được để trống");
        String receiverPhone = required(cmd.receiverPhone(), "SĐT người nhận không được để trống");
        String shippingAddress = required(cmd.shippingAddress(), "Địa chỉ giao hàng không được để trống");
        String orderStatus = normalizeOrderStatus(cmd.orderStatus());
        String paymentMethod = normalizePaymentMethod(cmd.paymentMethod());

        if (cmd.items() == null || cmd.items().isEmpty()) {
            throw new IllegalArgumentException("Đơn hàng phải có ít nhất 1 sản phẩm");
        }

        Order order = new Order();
        order.setUser(orderUser);
        order.setOrderCode(generateUniqueOrderCode());
        order.setReceiverName(receiverName);
        order.setReceiverPhone(receiverPhone);
        order.setShippingAddress(shippingAddress);
        order.setNote(trimToNull(cmd.note()));
        order.setPaymentMethod(paymentMethod);
        order.setPaymentStatus("UNPAID");
        order.setOrderStatus(orderStatus);
        order.setAdminNote(trimToNull(cmd.adminNote()));

        BigDecimal total = BigDecimal.ZERO;

        for (OrderProductLine line : cmd.items()) {
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
                throw new IllegalArgumentException("Sản phẩm không ở trạng thái ACTIVE: " + product.getName());
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
        Order saved = orderDao.save(order);

        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrder(saved);
        history.setStatus(saved.getOrderStatus());
        history.setChangedBy(null);
        history.setNote("Tạo đơn bởi admin");
        history.setChangedAt(LocalDateTime.now());
        orderStatusHistoryDao.save(history);

        boolean phoneExists = userRepository.existsByPhone(receiverPhone);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", saved.getId());
        response.put("orderCode", saved.getOrderCode());
        response.put("receiverName", saved.getReceiverName());
        response.put("receiverPhone", saved.getReceiverPhone());
        response.put("shippingAddress", saved.getShippingAddress());
        response.put("orderStatus", saved.getOrderStatus());
        response.put("paymentMethod", saved.getPaymentMethod());
        response.put("paymentStatus", saved.getPaymentStatus());
        response.put("totalAmount", saved.getTotalAmount());
        response.put("createdAt", saved.getCreatedAt());
        response.put("phoneWarning", phoneExists);
        if (phoneExists) {
            response.put("phoneWarningMessage", "SĐT đã tồn tại trong hệ thống, nhưng đơn vẫn được tạo.");
        }

        return response;
    }

    private User resolveOrderUser(String customerMode, Long customerId) {
        if ("EXISTING".equals(customerMode)) {
            if (customerId == null) {
                throw new IllegalArgumentException("Bạn chưa chọn khách hàng có sẵn");
            }
            return userRepository.findById(customerId)
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khách hàng id=" + customerId));
        }

        return getOrCreateGuestUser();
    }

    private User getOrCreateGuestUser() {
        return userRepository.findByUsername(guestUsername).orElseGet(() -> {
            Role userRole = roleRepository.findByRoleName("USER")
                    .orElseThrow(() -> new IllegalArgumentException("Thiếu role USER trong bảng roles"));

            User guest = new User();
            guest.setRole(userRole);
            guest.setFullName("Khach mua tai quay");
            guest.setUsername(guestUsername);
            guest.setEmail(guestUsername + "@hieungoctra.local");
            guest.setPhone(null);
            guest.setPasswordHash("NO_LOGIN_REQUIRED");
            guest.setAvatarUrl(null);
            guest.setAddress("Khach vang lai");
            guest.setStatus("ACTIVE");

            try {
                return userRepository.saveAndFlush(guest);
            } catch (Exception ex) {
                // Tránh race condition: request khác vừa tạo xong thì lấy lại
                return userRepository.findByUsername(guestUsername)
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Không thể tạo user giả lập '" + guestUsername + "': " + ex.getMessage()));
            }
        });
    }

    private String generateUniqueOrderCode() {
        String code;
        do {
            String random = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
            code = "ORD-" + random;
        } while (orderDao.existsByOrderCode(code));
        return code;
    }

    private String normalizeCustomerMode(String mode) {
        String value = safe(mode).toUpperCase();
        if ("EXISTING".equals(value)) return "EXISTING";
        return "MANUAL";
    }

    private String normalizePaymentMethod(String method) {
        String value = safe(method).toUpperCase();
        if ("BANK_TRANSFER".equals(value)) return "BANK_TRANSFER";
        return "COD";
    }

    private String normalizeOrderStatus(String status) {
        String s = safe(status).toUpperCase();
        return switch (s) {
            case "PENDING", "CONFIRMED", "PREPARING", "SHIPPING", "DELIVERED", "CANCELLED" -> s;
            case "PREPARE" -> "PREPARING";
            case "CANCELED" -> "CANCELLED";
            default -> "PREPARING"; // mặc định chờ lấy hàng
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

    public record CreateOrderCommand(
            String customerMode,
            Long customerId,
            String receiverName,
            String receiverPhone,
            String shippingAddress,
            String receiverEmail,
            String note,
            String paymentMethod,
            String orderStatus,
            String adminNote,
            List<OrderProductLine> items
    ) {}

    public record OrderProductLine(
            Long productId,
            Integer quantity
    ) {}

    @Transactional(readOnly = true)
    public Map<String, Object> getOrdersPage(int page, int size, String statusFilter) {
        int safePage = Math.max(page, 1);
        int safeSize;
        if (size == 4 || size == 5) {
            safeSize = size;
        } else {
            safeSize = 5;
        }
        int offset = (safePage - 1) * safeSize;

        String normalizedStatus = normalizeFilterStatus(statusFilter);

        List<Order> rows = orderDao.findPageByStatus(normalizedStatus, offset, safeSize);
        long totalElements = orderDao.countByStatus(normalizedStatus);
        int totalPages = totalElements == 0 ? 1 : (int) Math.ceil((double) totalElements / safeSize);

        List<Map<String, Object>> content = rows.stream().map(this::toListMap).toList();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("page", safePage);
        result.put("size", safeSize);
        result.put("totalElements", totalElements);
        result.put("totalPages", totalPages);
        result.put("hasPrevious", safePage > 1);
        result.put("hasNext", safePage < totalPages);
        result.put("content", content);
        return result;
    }

    private Map<String, Object> toListMap(Order o) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", o.getId());
        m.put("orderCode", o.getOrderCode());
        m.put("orderStatus", o.getOrderStatus());
        m.put("totalAmount", o.getTotalAmount());
        m.put("createdAt", o.getCreatedAt());
        m.put("receiverName", o.getReceiverName());
        m.put("receiverPhone", o.getReceiverPhone());
        m.put("shippingAddress", o.getShippingAddress());
        m.put("receiverEmail", o.getUser() != null ? o.getUser().getEmail() : null);

        List<Map<String, Object>> itemRows = o.getItems().stream().map(i -> {
            Map<String, Object> im = new LinkedHashMap<>();
            im.put("name", i.getProductName());
            im.put("quantity", i.getQuantity());
            im.put("price", i.getUnitPrice());
            im.put("lineTotal", i.getLineTotal());
            return im;
        }).toList();
        m.put("items", itemRows);

        return m;
    }

    private String normalizeFilterStatus(String status) {
        String s = safe(status).toUpperCase();
        if (s.isEmpty() || "ALL".equals(s)) return null;
        return switch (s) {
            case "PREPARING", "DELIVERED", "CANCELLED", "PENDING", "CONFIRMED", "SHIPPING" -> s;
            case "PREPARE" -> "PREPARING";
            case "CANCELED" -> "CANCELLED";
            default -> null;
        };
    }

    @Transactional
    public Map<String, Object> updateOrderStatus(Long orderId, String action) {
        Order order = orderDao.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng id=" + orderId));

        String currentStatus = safe(order.getOrderStatus()).toUpperCase();
        if (!"PREPARING".equals(currentStatus) && !"PENDING".equals(currentStatus) && !"CONFIRMED".equals(currentStatus)) {
            throw new IllegalArgumentException("Chỉ đơn đang chờ mới được xác nhận hoặc hủy");
        }

        String actionValue = safe(action).toUpperCase();
        String nextStatus;
        String note;

        if ("CONFIRM".equals(actionValue) || "CONFIRMED".equals(actionValue)) {
            nextStatus = "DELIVERED";
            note = "Xác nhận đơn bởi admin";
        } else if ("CANCEL".equals(actionValue) || "CANCELLED".equals(actionValue) || "CANCELED".equals(actionValue)) {
            nextStatus = "CANCELLED";
            note = "Hủy đơn bởi admin";
        } else {
            throw new IllegalArgumentException("Action không hợp lệ. Dùng CONFIRM hoặc CANCEL");
        }

        order.setOrderStatus(nextStatus);
        Order saved = orderDao.save(order);

        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrder(saved);
        history.setStatus(nextStatus);
        history.setChangedBy(null);
        history.setNote(note);
        history.setChangedAt(LocalDateTime.now());
        orderStatusHistoryDao.save(history);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("message", "Cập nhật trạng thái thành công");
        result.put("order", toListMap(saved));
        return result;
    }
}
