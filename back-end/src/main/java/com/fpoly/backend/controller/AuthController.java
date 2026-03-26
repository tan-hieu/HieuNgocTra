package com.fpoly.backend.controller;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fpoly.backend.dao.RoleDao;
import com.fpoly.backend.dao.UserDao;
import com.fpoly.backend.entity.Role;
import com.fpoly.backend.entity.User;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // sửa origin theo cổng front-end của bạn
public class AuthController {

    private final UserDao userDao;
    private final RoleDao roleDao;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserDao userDao,
                          RoleDao roleDao,
                          JavaMailSender mailSender,
                          PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.roleDao = roleDao;
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

        // kiểm tra trùng email / username
        if (userDao.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email đã tồn tại"));
        }
        if (userDao.existsByUsername(email)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Tên đăng nhập đã tồn tại"));
        }

        // tạo User tạm, CHƯA LƯU DB
        User user = new User();
        user.setFullName(fullName);
        user.setUsername(email);            // nếu bạn dùng email làm username
        user.setEmail(email);
        user.setPhone(phone);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setStatus("ACTIVE");

        Role roleUser = roleDao.findByRoleName("USER");
        user.setRole(roleUser);

        // tạo OTP 6 số, hết hạn sau 3 phút
        String otp = String.format("%06d", new Random().nextInt(1_000_000));
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(3);

        // lưu tạm trong session
        session.setAttribute("PENDING_USER", user);
        session.setAttribute("OTP_CODE", otp);
        session.setAttribute("OTP_EXPIRES_AT", expiry);

        // gửi mail
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

        // OTP đúng -> lưu user xuống DB
        userDao.save(pendingUser);

        // xoá dữ liệu tạm
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

        // Tìm user theo email
        User user = userDao.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email hoặc mật khẩu không đúng"));
        }

        // So sánh mật khẩu
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email hoặc mật khẩu không đúng"));
        }

        // Kiểm tra trạng thái nếu cần
        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Tài khoản đã bị khóa / không hoạt động"));
        }

        // Lưu thông tin đăng nhập vào session (nếu bạn muốn dùng session)
        session.setAttribute("LOGGED_IN_USER_ID", user.getId());

        return ResponseEntity.ok(Map.of(
                "message", "Đăng nhập thành công",
                "fullName", user.getFullName(),
                "role", user.getRole().getRoleName()
        ));
    }

    private void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Mã xác thực OTP - Hieu Ngoc Tra");
        message.setText("Mã OTP của bạn là: " + otp + ". Mã có hiệu lực trong 3 phút.");
        mailSender.send(message);
    }
}
