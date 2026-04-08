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

    public User findOrCreateGoogleUser(String email, String name, String avatar) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Google email is null or blank");
        }
        email = email.trim().toLowerCase();

        Role role = roleRepository.findByRoleName("USER")
                .orElseThrow(() -> new RuntimeException("Role USER not found in database"));

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            System.out.println("[GOOGLE] KHONG tim thay user trong DB, se tao moi. Email = " + email);

            user = new User();
            user.setEmail(email);

            // Lấy username từ tên Google nếu có, nếu trùng thì fallback/điều chỉnh để đảm bảo unique
            String usernameCandidate = (name == null || name.isBlank()) ? email : name.trim();
            // Chuẩn hoá: thay khoảng trắng bằng dấu gạch dưới, loại bỏ ký tự lạ
            usernameCandidate = usernameCandidate.replaceAll("\\s+", "_").replaceAll("[^\\p{L}0-9_@.-]", "");
            String base = usernameCandidate;
            int suffix = 1;
            while (userRepository.existsByUsername(usernameCandidate)) {
                usernameCandidate = base + "_" + suffix++;
                if (usernameCandidate.length() > 100) {
                    usernameCandidate = usernameCandidate.substring(0, 95) + "_" + suffix;
                }
            }
            user.setUsername(usernameCandidate);

            user.setFullName((name == null || name.isBlank()) ? email.split("@")[0] : name.trim());
            user.setAvatarUrl((avatar == null || avatar.isBlank()) ? null : avatar.trim());
            user.setStatus("ACTIVE");
            user.setRole(role);
            String encodedPassword = passwordEncoder.encode(UUID.randomUUID().toString() + UUID.randomUUID().toString());
            user.setPasswordHash(encodedPassword);

            // Nếu Google không trả phone, để NULL (theo yêu cầu). Nếu DB có ràng buộc không cho nhiều NULL,
            // sẽ xử lý trong catch bằng cách tạo user trong transaction mới.
            user.setPhone("g" + UUID.randomUUID().toString().replace("-", "").substring(0, 19));

            try {
                System.out.println("[GOOGLE] Creating user via UserCreationService for: " + email);
                user = userCreationService.createWithPlaceholderPhone(
                    email, 
                    usernameCandidate,
                    (name == null || name.isBlank()) ? email.split("@")[0] : name.trim(),
                    (avatar == null || avatar.isBlank()) ? null : avatar.trim(), 
                    encodedPassword, 
                    "ACTIVE", 
                    "USER"
                );
                System.out.println("[GOOGLE] ✓ User created successfully: ID=" + user.getId() + ", email=" + user.getEmail() + ", status=" + user.getStatus());
            } catch (DataIntegrityViolationException ex) {
                System.err.println("[GOOGLE] ✗ DataIntegrityViolation: " + ex.getMessage());
                User existing = userRepository.findByEmail(email).orElse(null);
                if (existing != null) {
                    System.out.println("[GOOGLE] Returning existing user created by concurrent request: " + existing.getId());
                    return existing;
                }
                System.err.println("[GOOGLE] No existing user found after DataIntegrityViolation - throwing exception");
                throw ex;
            } catch (Exception ex) {
                System.err.println("[GOOGLE] ✗ Unexpected exception: " + ex.getClass().getSimpleName() + " - " + ex.getMessage());
                ex.printStackTrace();
                throw new RuntimeException("[GOOGLE] Failed to create user: " + ex.getMessage(), ex);
            }

            System.out.println("[GOOGLE] DA insert user moi vao DB. ID = " + user.getId() + ", email = " + user.getEmail());
            return user;
        } else {
            System.out.println("[GOOGLE] DA ton tai user trong DB, khong insert moi. ID = " + user.getId() + ", email = " + user.getEmail());
        }

        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("User status is not ACTIVE for email: " + email);
        }

        boolean changed = false;
        String finalName = (name == null || name.isBlank()) ? email.split("@")[0] : name.trim();
        String finalAvatar = (avatar == null || avatar.isBlank()) ? null : avatar.trim();

        if (!Objects.equals(user.getFullName(), finalName)) {
            user.setFullName(finalName);
            changed = true;
        }
        if (!Objects.equals(user.getAvatarUrl(), finalAvatar)) {
            user.setAvatarUrl(finalAvatar);
            changed = true;
        }
        if (user.getRole() == null) {
            user.setRole(role);
            changed = true;
        }
        if (changed) {
            System.out.println("Updating existing internal user for Google email: " + email);
            user = userRepository.saveAndFlush(user);
            System.out.println("Saved internal user successfully with id=" + user.getId());
        }
        return user;
    }
}
