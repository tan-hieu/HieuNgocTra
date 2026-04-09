package com.fpoly.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
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

        // Lưu số điện thoại đúng từ Google nếu có, không random.
        // Nếu Google không trả về thì để null.
        u.setPhone(normalizePhone(phone));

        try {
            return userRepository.saveAndFlush(u);
        } catch (DataIntegrityViolationException ex) {
            User existingAfterFail = userRepository.findByEmail(email).orElse(null);
            if (existingAfterFail != null) {
                return existingAfterFail;
            }
            throw ex;
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = true)
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    private String normalizePhone(String input) {
        if (input == null) return null;
        String p = input.trim();
        if (p.isEmpty()) return null;

        // Giữ số và dấu + đầu số quốc tế
        p = p.replaceAll("[^0-9+]", "");
        if (p.startsWith("++")) {
            p = p.substring(1);
        }

        // Cột phone NVARCHAR(20)
        if (p.length() > 20) {
            p = p.substring(0, 20);
        }

        return p.isBlank() ? null : p;
    }
}