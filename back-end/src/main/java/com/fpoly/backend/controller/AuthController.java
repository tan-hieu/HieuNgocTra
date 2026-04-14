package com.fpoly.backend.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fpoly.backend.entity.Role;
import com.fpoly.backend.entity.User;
import com.fpoly.backend.repository.RoleRepository;
import com.fpoly.backend.repository.UserRepository;
import com.fpoly.backend.service.JwtService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository,
                          RoleRepository roleRepository,
                          JavaMailSender mailSender,
                          PasswordEncoder passwordEncoder,
                          AuthenticationManager authenticationManager,
                          JwtService jwtService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
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
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String usernameOrEmail = body.get("email"); // FE đang gửi key "email"
        String password = body.get("password");

        if (usernameOrEmail == null || usernameOrEmail.isBlank()
                || password == null || password.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email/Username và mật khẩu không được để trống"));
        }

        // 1) Tìm user theo email rồi tới username
        User user = userRepository.findByEmail(usernameOrEmail)
                .orElseGet(() -> userRepository.findByUsername(usernameOrEmail).orElse(null));

        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email/Username hoặc mật khẩu không đúng"));
        }

        // 2) Kiểm tra password
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email/Username hoặc mật khẩu không đúng"));
        }

        // 3) Kiểm tra status
        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Tài khoản đã bị khóa / không hoạt động"));
        }

        // 4) Tạo principal (dùng email làm username trong JWT)
        String roleName = (user.getRole() != null && user.getRole().getRoleName() != null)
                ? user.getRole().getRoleName()
                : "USER";

        var authorities = List.<GrantedAuthority>of(
                new SimpleGrantedAuthority("ROLE_" + roleName)
        );

        org.springframework.security.core.userdetails.User principal =
                new org.springframework.security.core.userdetails.User(
                        user.getEmail(),
                        user.getPasswordHash(),
                        authorities
                );

        // 5) Sinh JWT
        String accessToken = jwtService.generateToken(principal);

        // 6) Lấy roles từ authorities
        List<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        AuthUserResponse userDto = new AuthUserResponse(
                user.getId(),
                user.getFullName(),
                user.getUsername(),
                user.getEmail(),
                user.getPhone(),
                user.getAvatarUrl(),
                user.getAddress(),
                user.getStatus(),
                user.getRole() != null ? user.getRole().getRoleName() : null
        );

        JwtAuthResponse jwtResponse = new JwtAuthResponse(
                accessToken,
                "Bearer",
                user.getUsername(),
                roles,
                userDto
        );

        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Stateless: server không giữ session auth; FE chỉ cần xoá JWT
        return ResponseEntity.ok(Map.of("message", "Đã logout, hãy xoá token phía frontend"));
    }

    @GetMapping("/me")
    @Transactional(readOnly = true)
    public ResponseEntity<?> me(HttpSession session) {
        System.out.println("=== /me called ===");
        
        try {
            // 1) Kiểm tra session trước
            User sessionUser = (User) session.getAttribute("LOGGED_IN_USER");
            if (sessionUser != null) {
                System.out.println("✓ User found in session: " + sessionUser.getEmail());
                User user = userRepository.findById(sessionUser.getId()).orElse(null);
                if (user != null) {
                    return ResponseEntity.ok(buildAuthUserResponse(user));
                }
                session.removeAttribute("LOGGED_IN_USER");
                System.out.println("✗ Session user not found in DB");
            }

            // 2) Fallback sang JWT/SecurityContext
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("[/me] Authentication: " + (authentication != null ? authentication.getClass().getSimpleName() : "null"));
            
            if (authentication == null) {
                System.out.println("✗ No authentication");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Unauthorized"));
            }

            // Kiểm tra anonymous
            Object principal = authentication.getPrincipal();
            if (principal == null) {
                System.out.println("✗ Principal is null");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Unauthorized"));
            }

            String principalStr = principal.toString();
            if ("anonymousUser".equals(principalStr)) {
                System.out.println("✗ Anonymous user");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Unauthorized"));
            }

            if (!authentication.isAuthenticated()) {
                System.out.println("✗ Not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Unauthorized"));
            }

            // 3) Tìm email từ principal
            String email = null;
            
            if (principal instanceof org.springframework.security.core.userdetails.User userDetails) {
                email = userDetails.getUsername();
                System.out.println("✓ Email from UserDetails: " + email);
            } else if (principal instanceof OAuth2User oAuth2User) {
                email = oAuth2User.getAttribute("email");
                System.out.println("✓ Email from OAuth2User: " + email);
            } else {
                System.out.println("✗ Unknown principal type: " + principal.getClass().getSimpleName());
            }

            if (email == null || email.isBlank()) {
                System.out.println("✗ Email is null/blank");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Unauthorized"));
            }

            // 4) Tìm user từ DB
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                System.out.println("✗ User not found in DB for email: " + email);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Unauthorized"));
            }

            System.out.println("✓ User found: " + user.getId() + " - " + user.getEmail());

            // 5) Lưu vào session để lần sau nhanh hơn
            session.setAttribute("LOGGED_IN_USER", user);

            return ResponseEntity.ok(buildAuthUserResponse(user));
            
        } catch (Exception ex) {
            System.err.println("✗ /me exception: " + ex.getClass().getSimpleName() + " - " + ex.getMessage());
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal error"));
        }
    }

    @PutMapping("/me")
    @Transactional
    public ResponseEntity<?> updateMe(@RequestBody Map<String, String> body, HttpSession session) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null
                    || !authentication.isAuthenticated()
                    || authentication.getPrincipal() == null
                    || "anonymousUser".equals(authentication.getPrincipal().toString())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Unauthorized"));
            }

            Object principal = authentication.getPrincipal();
            String email = null;

            if (principal instanceof org.springframework.security.core.userdetails.User userDetails) {
                email = userDetails.getUsername();
            } else if (principal instanceof OAuth2User oAuth2User) {
                email = oAuth2User.getAttribute("email");
            }

            if (email == null || email.isBlank()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Unauthorized"));
            }

            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Unauthorized"));
            }

            String fullName = trimToNull(body.get("fullName"));
            String phone = trimToNull(body.get("phone"));
            String address = trimToNull(body.get("address"));
            String avatarUrl = trimToNull(body.get("avatarUrl"));

            if (fullName == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Họ và tên không được để trống"));
            }

            // Chỉ check trùng khi phone mới khác phone cũ
            if (phone != null && !phone.equals(user.getPhone()) && userRepository.existsByPhone(phone)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Số điện thoại đã được sử dụng"));
            }

            user.setFullName(fullName);
            user.setPhone(phone);
            user.setAddress(address);
            user.setAvatarUrl(avatarUrl);

            User saved = userRepository.save(user);
            session.setAttribute("LOGGED_IN_USER", saved);

            return ResponseEntity.ok(Map.of(
                    "message", "Cập nhật thông tin thành công",
                    "user", buildAuthUserResponse(saved)
            ));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Có lỗi xảy ra khi cập nhật thông tin"));
        }
    }

    @PostMapping("/change-password")
    @Transactional
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> body, HttpSession session) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null
                    || !authentication.isAuthenticated()
                    || authentication.getPrincipal() == null
                    || "anonymousUser".equals(authentication.getPrincipal().toString())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Unauthorized"));
            }

            Object principal = authentication.getPrincipal();
            String email = null;

            if (principal instanceof org.springframework.security.core.userdetails.User userDetails) {
                email = userDetails.getUsername();
            } else if (principal instanceof OAuth2User oAuth2User) {
                email = oAuth2User.getAttribute("email");
            }

            if (email == null || email.isBlank()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Unauthorized"));
            }

            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Unauthorized"));
            }

            String currentPassword = body.get("currentPassword");
            String newPassword = body.get("newPassword");
            String confirmPassword = body.get("confirmPassword");

            if (currentPassword == null || currentPassword.isBlank()
                    || newPassword == null || newPassword.isBlank()
                    || confirmPassword == null || confirmPassword.isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Vui lòng nhập đầy đủ thông tin mật khẩu"));
            }

            if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Mật khẩu hiện tại không chính xác"));
            }

            if (!newPassword.equals(confirmPassword)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Xác nhận mật khẩu không khớp"));
            }

            if (newPassword.length() < 8) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Mật khẩu mới phải có ít nhất 8 ký tự"));
            }

            if (passwordEncoder.matches(newPassword, user.getPasswordHash())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Mật khẩu mới không được trùng mật khẩu cũ"));
            }

            user.setPasswordHash(passwordEncoder.encode(newPassword));
            userRepository.save(user);

            session.removeAttribute("LOGGED_IN_USER");

            return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công"));

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Có lỗi xảy ra khi đổi mật khẩu"));
        }
    }

    private String trimToNull(String value) {
        if (value == null) return null;
        String v = value.trim();
        return v.isEmpty() ? null : v;
    }

    private AuthUserResponse buildAuthUserResponse(User user) {
        String roleName = (user.getRole() != null) ? user.getRole().getRoleName() : "USER";
        return new AuthUserResponse(
                user.getId(),
                user.getFullName(),
                user.getUsername(),
                user.getEmail(),
                user.getPhone(),
                user.getAvatarUrl(),
                user.getAddress(),
                user.getStatus(),
                roleName
        );
    }

    private void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Mã xác thực OTP - Hieu Ngoc Tra");
        message.setText("Mã OTP của bạn là: " + otp + ". Mã có hiệu lực trong 3 phút.");
        mailSender.send(message);
    }
}