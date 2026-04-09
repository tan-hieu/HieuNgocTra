package com.fpoly.backend.service;

import java.text.Normalizer;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fpoly.backend.entity.Role;
import com.fpoly.backend.entity.User;
import com.fpoly.backend.repository.RoleRepository;
import com.fpoly.backend.repository.UserRepository;

@Service
public class CustomerAdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomerAdminService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<User> getAllCustomers() {
        return userRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @Transactional
    public User createCustomer(
            String fullName,
            String email,
            String phone,
            String address,
            String rawPassword,
            String status) {

        String cleanName = required(fullName, "Họ tên không được để trống");
        String cleanEmail = required(email, "Email không được để trống").toLowerCase();
        String cleanPassword = required(rawPassword, "Mật khẩu không được để trống");

        String cleanPhone = trimToNull(phone);
        String cleanAddress = trimToNull(address);
        String cleanStatus = normalizeStatus(status);

        if (userRepository.existsByEmail(cleanEmail)) {
            throw new IllegalArgumentException("Email đã tồn tại.");
        }

        if (cleanPhone != null && userRepository.existsByPhone(cleanPhone)) {
            throw new IllegalArgumentException("Số điện thoại đã tồn tại.");
        }

        Role roleUser = roleRepository.findByRoleName("USER")
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy role USER trong CSDL."));

        User user = new User();
        user.setFullName(cleanName);
        user.setEmail(cleanEmail);
        user.setUsername(generateUniqueUsername(cleanEmail, cleanName));
        user.setPhone(cleanPhone);
        user.setAddress(cleanAddress); // cho phép null
        user.setPasswordHash(passwordEncoder.encode(cleanPassword));
        user.setStatus(cleanStatus);
        user.setRole(roleUser); // admin tạo mới vẫn luôn USER

        return userRepository.save(user);
    }

    @Transactional
    public void deleteCustomer(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khách hàng với id: " + id));

        if (user.getRole() != null && "ADMIN".equalsIgnoreCase(user.getRole().getRoleName())) {
            throw new IllegalArgumentException("Không thể xóa tài khoản ADMIN.");
        }

        userRepository.delete(user);
    }

    @Transactional
    public User updateCustomer(
            Long id,
            String fullName,
            String phone,
            String address,
            String status) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khách hàng với id: " + id));

        if (user.getRole() != null && "ADMIN".equalsIgnoreCase(user.getRole().getRoleName())) {
            throw new IllegalArgumentException("Không cho phép sửa tài khoản ADMIN tại màn này.");
        }

        String cleanName = required(fullName, "Họ tên không được để trống");
        String cleanPhone = trimToNull(phone);
        String cleanAddress = trimToNull(address);
        String cleanStatus = normalizeStatus(status);

        if (cleanPhone != null) {
            User byPhone = userRepository.findAll().stream()
                    .filter(u -> u.getPhone() != null && u.getPhone().equals(cleanPhone))
                    .findFirst()
                    .orElse(null);

            if (byPhone != null && !byPhone.getId().equals(user.getId())) {
                throw new IllegalArgumentException("Số điện thoại đã tồn tại.");
            }
        }

        user.setFullName(cleanName);
        user.setPhone(cleanPhone);
        user.setAddress(cleanAddress);
        user.setStatus(cleanStatus);

        return userRepository.save(user);
    }

    private String required(String value, String message) {
        String cleaned = value == null ? "" : value.trim();
        if (cleaned.isEmpty()) {
            throw new IllegalArgumentException(message);
        }
        return cleaned;
    }

    private String trimToNull(String value) {
        if (value == null) return null;
        String cleaned = value.trim();
        return cleaned.isEmpty() ? null : cleaned;
    }

    private String normalizeStatus(String status) {
        String s = status == null ? "" : status.trim().toUpperCase();
        if ("INACTIVE".equals(s)) return "INACTIVE";
        if ("LOCKED".equals(s)) return "LOCKED";
        return "ACTIVE";
    }

    private String generateUniqueUsername(String email, String fullName) {
        String base = email.split("@")[0].trim().toLowerCase();
        if (base.isBlank()) {
            base = toSlug(fullName);
        }
        if (base.isBlank()) {
            base = "user";
        }

        String candidate = base;
        int i = 1;
        while (userRepository.existsByUsername(candidate)) {
            candidate = base + i++;
        }
        return candidate;
    }

    private String toSlug(String input) {
        String normalized = Normalizer.normalize(input == null ? "" : input, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        return normalized.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "")
                .replaceAll("-+", "");
    }
}
