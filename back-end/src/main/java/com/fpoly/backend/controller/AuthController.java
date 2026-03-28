package com.fpoly.backend.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fpoly.backend.entity.Role;
import com.fpoly.backend.entity.User;
import com.fpoly.backend.repository.RoleRepository;
import com.fpoly.backend.repository.UserRepository;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository,
                          RoleRepository roleRepository,
                          JavaMailSender mailSender,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body,
                                      HttpSession session) {
        String fullName = body.get("fullName");
        String email = body.get("email");
        String phone = body.get("phone");
        String password = body.get("password");

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email đã tồn tại"));
        }
        if (userRepository.existsByUsername(email)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Tên đăng nhập đã tồn tại"));
        }

        User user = new User();
        user.setFullName(fullName);
        user.setUsername(email);
        user.setEmail(email);
        user.setPhone(phone);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setStatus("ACTIVE");

        Role roleUser = roleRepository.findByRoleName("USER").orElse(null);
        if (roleUser == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Role USER không tồn tại"));
        }
        user.setRole(roleUser);

        String otp = String.format("%06d", new Random().nextInt(1_000_000));
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(3);

        session.setAttribute("PENDING_USER", user);
        session.setAttribute("OTP_CODE", otp);
        session.setAttribute("OTP_EXPIRES_AT", expiry);

        sendOtpEmail(email, otp);

        return ResponseEntity.ok(Map.of(
                "message", "OTP đã được gửi tới email",
                "email", email
        ));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body,
                                       HttpSession session) {
        String inputOtp = body.get("otp");

        User pendingUser = (User) session.getAttribute("PENDING_USER");
        String sessionOtp = (String) session.getAttribute("OTP_CODE");
        LocalDateTime expiresAt = (LocalDateTime) session.getAttribute("OTP_EXPIRES_AT");

        if (pendingUser == null || sessionOtp == null || expiresAt == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Không có đăng ký đang chờ hoặc OTP đã hết hạn"));
        }

        if (LocalDateTime.now().isAfter(expiresAt)) {
            session.invalidate();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "OTP đã hết hạn, vui lòng đăng ký lại"));
        }

        if (!sessionOtp.equals(inputOtp)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Mã OTP không chính xác"));
        }

        userRepository.save(pendingUser);

        session.removeAttribute("PENDING_USER");
        session.removeAttribute("OTP_CODE");
        session.removeAttribute("OTP_EXPIRES_AT");

        return ResponseEntity.ok(Map.of("message", "Đăng ký thành công, vui lòng đăng nhập"));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(HttpSession session) {
        User pendingUser = (User) session.getAttribute("PENDING_USER");
        if (pendingUser == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Không có đăng ký đang chờ, vui lòng đăng ký lại"));
        }

        String email = pendingUser.getEmail();
        String otp = String.format("%06d", new Random().nextInt(1_000_000));
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(3);

        session.setAttribute("OTP_CODE", otp);
        session.setAttribute("OTP_EXPIRES_AT", expiry);

        sendOtpEmail(email, otp);

        return ResponseEntity.ok(Map.of(
                "message", "OTP mới đã được gửi",
                "email", email
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body,
                               HttpSession session) {
        String email = body.get("email");
        String password = body.get("password");

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email hoặc mật khẩu không đúng"));
        }

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email hoặc mật khẩu không đúng"));
        }

        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Tài khoản đã bị khóa / không hoạt động"));
        }

        session.setAttribute("LOGGED_IN_USER", user);

        // Thiết lập Spring Security Authentication dựa trên role từ DB để các route bị bảo vệ hoạt động
        String roleName = (user.getRole() != null && user.getRole().getRoleName() != null)
            ? user.getRole().getRoleName()
            : "USER";
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + roleName));
        org.springframework.security.core.userdetails.User principal =
            new org.springframework.security.core.userdetails.User(user.getEmail(), "", authorities);
        UsernamePasswordAuthenticationToken authToken =
            new UsernamePasswordAuthenticationToken(principal, null, authorities);
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authToken);
        SecurityContextHolder.setContext(context);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);

        AuthUserResponse dto = new AuthUserResponse(
            user.getId(), user.getFullName(), user.getUsername(), user.getEmail(),
            user.getPhone(), user.getAvatarUrl(), user.getAddress(), user.getStatus(),
            user.getRole() != null ? user.getRole().getRoleName() : null
        );

        return ResponseEntity.ok(Map.of("user", dto));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("message", "Đã đăng xuất"));
    }

    @GetMapping("/me")
    @Transactional(readOnly = true)
    public ResponseEntity<?> me(HttpSession session) {
        // 1) Ưu tiên session trước để dùng chung cho cả login thường và Google login
        User sessionUser = (User) session.getAttribute("LOGGED_IN_USER");
        if (sessionUser != null) {
            User user = userRepository.findById(sessionUser.getId()).orElse(null);

            if (user == null) {
                session.removeAttribute("LOGGED_IN_USER");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Session user not found", "code", "SESSION_USER_NOT_FOUND"));
            }

            AuthUserResponse dto = new AuthUserResponse(
                user.getId(), user.getFullName(), user.getUsername(), user.getEmail(),
                user.getPhone(), user.getAvatarUrl(), user.getAddress(), user.getStatus(),
                user.getRole() != null ? user.getRole().getRoleName() : null
            );
            return ResponseEntity.ok(dto);
        }

        // 2) Nếu không có session thì mới fallback sang SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not authenticated", "code", "NO_AUTH"));
        }

        String email = null;
        Object principal = authentication.getPrincipal();

        if (principal instanceof org.springframework.security.core.userdetails.User userDetails) {
            email = userDetails.getUsername();
        } else if (principal instanceof OAuth2User oAuth2User) {
            email = oAuth2User.getAttribute("email");
        }

        if (email == null || email.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "No email in principal", "code", "NO_EMAIL"));
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Internal user not found", "code", "NO_INTERNAL_USER"));
        }

        // Đồng bộ lại session để các lần sau frontend gọi /me ổn định
        session.setAttribute("LOGGED_IN_USER", user);

        AuthUserResponse dto = new AuthUserResponse(
            user.getId(), user.getFullName(), user.getUsername(), user.getEmail(),
            user.getPhone(), user.getAvatarUrl(), user.getAddress(), user.getStatus(),
            user.getRole() != null ? user.getRole().getRoleName() : null
        );
        return ResponseEntity.ok(dto);
    }

    private void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Mã xác thực OTP - Hieu Ngoc Tra");
        message.setText("Mã OTP của bạn là: " + otp + ". Mã có hiệu lực trong 3 phút.");
        mailSender.send(message);
    }
}
