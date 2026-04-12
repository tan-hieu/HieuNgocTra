package com.fpoly.backend.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.fpoly.backend.entity.Role;
import com.fpoly.backend.entity.User;
import com.fpoly.backend.repository.RoleRepository;
import com.fpoly.backend.repository.UserRepository;

@Service
public class UserCreationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public User createWithPlaceholderPhone(
            String email,
            String username,
            String fullName,
            String avatarUrl,
            String phone,
            String passwordHash,
            String status,
            String roleName) {

        Role role = roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new RuntimeException("Role " + roleName + " not found when creating user"));

        User existing = userRepository.findByEmail(email).orElse(null);
        if (existing != null) {
            return existing;
        }

        User u = new User();
        u.setEmail(email);
        u.setUsername(username);
        u.setFullName(fullName);
        u.setAvatarUrl(avatarUrl);
        u.setStatus(status);
        u.setRole(role);
        u.setPasswordHash(passwordHash);

        String normalizedPhone = normalizePhone(phone);

        // SQL Server + UNIQUE(phone): chỉ 1 giá trị NULL => Google user tiếp theo dễ lỗi.
        // Nếu Google không trả phone, tạo placeholder duy nhất để tránh đụng UNIQUE.
        if (normalizedPhone == null) {
            normalizedPhone = generateUniqueGooglePhonePlaceholder();
        }
        u.setPhone(normalizedPhone);

        return userRepository.saveAndFlush(u);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = true)
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    private String normalizePhone(String input) {
        if (input == null) return null;
        String p = input.trim();
        if (p.isEmpty()) return null;

        p = p.replaceAll("[^0-9+]", "");
        if (p.startsWith("++")) {
            p = p.substring(1);
        }

        if (p.length() > 20) {
            p = p.substring(0, 20);
        }

        return p.isBlank() ? null : p;
    }

    private String generateUniqueGooglePhonePlaceholder() {
        String candidate;
        do {
            // Độ dài tối đa 20 ký tự
            candidate = "GG" + UUID.randomUUID().toString().replace("-", "").substring(0, 18);
        } while (userRepository.existsByPhone(candidate));
        return candidate;
    }
}