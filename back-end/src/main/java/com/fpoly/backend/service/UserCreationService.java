package com.fpoly.backend.service;

import java.util.UUID;

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
    public User createWithPlaceholderPhone(String email, String username, String fullName, String avatarUrl,
            String passwordHash, String status, String roleName) {

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

        // tối đa 20 ký tự cho cột phone
        u.setPhone("g" + UUID.randomUUID().toString().replace("-", "").substring(0, 19));

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
}