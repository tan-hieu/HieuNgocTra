package com.fpoly.backend.service;

import java.util.Objects;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fpoly.backend.entity.Role;
import com.fpoly.backend.entity.User;
import com.fpoly.backend.repository.RoleRepository;
import com.fpoly.backend.repository.UserRepository;

@Service
public class GoogleUserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserCreationService userCreationService;

    public User findOrCreateGoogleUser(String email, String name, String avatar, String phone) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Google email is null or blank");
        }
        email = email.trim().toLowerCase();

        Role role = roleRepository.findByRoleName("USER")
                .orElseThrow(() -> new RuntimeException("Role USER not found in database"));

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            System.out.println("[GOOGLE] KHONG tim thay user trong DB, se tao moi. Email = " + email);

            String usernameCandidate = (name == null || name.isBlank()) ? email : name.trim();
            usernameCandidate = usernameCandidate
                    .replaceAll("\\s+", "_")
                    .replaceAll("[^\\p{L}0-9_@.-]", "");

            String base = usernameCandidate;
            int suffix = 1;
            while (userRepository.existsByUsername(usernameCandidate)) {
                usernameCandidate = base + "_" + suffix++;
                if (usernameCandidate.length() > 100) {
                    usernameCandidate = usernameCandidate.substring(0, 95) + "_" + suffix;
                }
            }

            String encodedPassword = passwordEncoder.encode(
                    UUID.randomUUID().toString() + UUID.randomUUID().toString()
            );

            try {
                System.out.println("[GOOGLE] Creating user via UserCreationService for: " + email);
                user = userCreationService.createWithPlaceholderPhone(
                        email,
                        usernameCandidate,
                        (name == null || name.isBlank()) ? email.split("@")[0] : name.trim(),
                        (avatar == null || avatar.isBlank()) ? null : avatar.trim(),
                        phone, // lấy đúng phone từ Google
                        encodedPassword,
                        "ACTIVE",
                        "USER"
                );
                System.out.println("[GOOGLE] ✓ User created successfully: ID=" + user.getId() + ", email=" + user.getEmail() + ", status=" + user.getStatus());
            } catch (DataIntegrityViolationException ex) {
                System.err.println("[GOOGLE] ✗ DataIntegrityViolation: " + ex.getMessage());
                User existing = userCreationService.findUserByEmail(email);
                if (existing != null) {
                    System.out.println("[GOOGLE] Returning existing user created by concurrent request: " + existing.getId());
                    return existing;
                }
                throw ex;
            } catch (Exception ex) {
                System.err.println("[GOOGLE] ✗ Unexpected exception: " + ex.getClass().getSimpleName() + " - " + ex.getMessage());
                ex.printStackTrace();
                throw new RuntimeException("[GOOGLE] Failed to create user: " + ex.getMessage(), ex);
            }

            return user;
        }

        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("User status is not ACTIVE for email: " + email);
        }

        boolean changed = false;
        String finalName = (name == null || name.isBlank()) ? email.split("@")[0] : name.trim();
        String finalAvatar = (avatar == null || avatar.isBlank()) ? null : avatar.trim();
        String finalPhone = normalizePhone(phone);

        if (!Objects.equals(user.getFullName(), finalName)) {
            user.setFullName(finalName);
            changed = true;
        }
        if (!Objects.equals(user.getAvatarUrl(), finalAvatar)) {
            user.setAvatarUrl(finalAvatar);
            changed = true;
        }

        // Nếu Google trả phone thật thì cập nhật vào user
        if (finalPhone != null && !Objects.equals(user.getPhone(), finalPhone)) {
            user.setPhone(finalPhone);
            changed = true;
        }

        if (user.getRole() == null) {
            user.setRole(role);
            changed = true;
        }

        if (changed) {
            user = userRepository.saveAndFlush(user);
        }

        return user;
    }

    private String normalizePhone(String input) {
        if (input == null) return null;
        String p = input.trim();
        if (p.isEmpty()) return null;
        p = p.replaceAll("[^0-9+]", "");
        if (p.startsWith("++")) p = p.substring(1);
        if (p.length() > 20) p = p.substring(0, 20);
        return p.isBlank() ? null : p;
    }
}
