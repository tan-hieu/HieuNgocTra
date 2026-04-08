package com.fpoly.backend.service;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fpoly.backend.entity.User;
import com.fpoly.backend.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        System.out.println("[CustomUserDetailsService] Loading user: " + usernameOrEmail);
        
        User user = userRepository.findByEmail(usernameOrEmail)
                .orElseGet(() -> userRepository.findByUsername(usernameOrEmail)
                        .orElseThrow(() -> {
                            System.err.println("[CustomUserDetailsService] User not found: " + usernameOrEmail);
                            return new UsernameNotFoundException("User not found: " + usernameOrEmail);
                        }));

        System.out.println("[CustomUserDetailsService] User found: " + user.getEmail() + ", status=" + user.getStatus() + ", role=" + (user.getRole() != null ? user.getRole().getRoleName() : "null"));

        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            System.err.println("[CustomUserDetailsService] User not ACTIVE: " + user.getEmail() + " (" + user.getStatus() + ")");
            throw new UsernameNotFoundException("User is not ACTIVE: " + user.getStatus());
        }

        String roleName = (user.getRole() != null && user.getRole().getRoleName() != null)
                ? user.getRole().getRoleName()
                : "USER";

        Collection<? extends GrantedAuthority> authorities =
                List.of(new SimpleGrantedAuthority("ROLE_" + roleName));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(),
                true, true, true, true,
                authorities
        );
    }
}
