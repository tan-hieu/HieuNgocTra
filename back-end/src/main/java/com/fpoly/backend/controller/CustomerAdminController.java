package com.fpoly.backend.controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fpoly.backend.entity.User;
import com.fpoly.backend.service.CustomerAdminService;

@RestController
@RequestMapping("/api/admin/customers")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CustomerAdminController {

    private final CustomerAdminService customerAdminService;

    public CustomerAdminController(CustomerAdminService customerAdminService) {
        this.customerAdminService = customerAdminService;
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        List<Map<String, Object>> body = customerAdminService.getAllCustomers()
                .stream()
                .map(this::toMap)
                .toList();
        return ResponseEntity.ok(body);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateCustomerRequest request) {
        try {
            User saved = customerAdminService.createCustomer(
                    request.getFullName(),
                    request.getEmail(),
                    request.getPhone(),
                    request.getAddress(),
                    request.getPassword(),
                    request.getStatus()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(toMap(saved));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Có lỗi xảy ra khi tạo khách hàng", "details", ex.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody UpdateCustomerRequest request) {
        try {
            User saved = customerAdminService.updateCustomer(
                    id,
                    request.getFullName(),
                    request.getPhone(),
                    request.getAddress(),
                    request.getStatus()
            );
            return ResponseEntity.ok(toMap(saved));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Có lỗi xảy ra khi cập nhật khách hàng", "details", ex.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            customerAdminService.deleteCustomer(id);
            return ResponseEntity.ok(Map.of("message", "Xóa thành công"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Có lỗi xảy ra khi xóa khách hàng", "details", ex.getMessage()));
        }
    }

    private Map<String, Object> toMap(User u) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", u.getId());
        map.put("fullName", u.getFullName());
        map.put("username", u.getUsername());
        map.put("email", u.getEmail());
        map.put("phone", u.getPhone());
        map.put("address", u.getAddress());
        map.put("status", u.getStatus());
        map.put("roleName", u.getRole() != null ? u.getRole().getRoleName() : null);
        map.put("avatarUrl", u.getAvatarUrl());
        map.put("createdAt", u.getCreatedAt());
        map.put("updatedAt", u.getUpdatedAt());
        return map;
    }

    public static class CreateCustomerRequest {
        private String fullName;
        private String email;
        private String phone;
        private String address;
        private String password;
        private String status;

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class UpdateCustomerRequest {
        private String fullName;
        private String phone;
        private String address;
        private String status;

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
