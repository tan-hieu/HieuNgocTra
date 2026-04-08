package com.fpoly.backend.config;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.fpoly.backend.entity.User;
import com.fpoly.backend.service.CustomUserDetailsService;
import com.fpoly.backend.service.GoogleUserService;
import com.fpoly.backend.service.JwtService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final GoogleUserService googleUserService;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtService jwtService;

    public OAuth2SuccessHandler(GoogleUserService googleUserService,
                                CustomUserDetailsService customUserDetailsService,
                                JwtService jwtService) {
        this.googleUserService = googleUserService;
        this.customUserDetailsService = customUserDetailsService;
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        System.err.println("=== OAUTH2 SUCCESS HANDLER CALLED ===");
        try {
            if (!(authentication.getPrincipal() instanceof OAuth2User oAuth2User)) {
                System.out.println("OAuth2SuccessHandler: principal not OAuth2User");
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid OAuth2 principal");
                return;
            }

            String email = oAuth2User.getAttribute("email");
            String name = oAuth2User.getAttribute("name");
            String avatar = oAuth2User.getAttribute("picture");

            if (email == null || email.isBlank()) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Google email missing");
                return;
            }
            System.out.println("OAuth2SuccessHandler: email=" + email + ", name=" + name);

            // 1) Tìm hoặc tạo user nội bộ
            User savedUser = googleUserService.findOrCreateGoogleUser(email, name, avatar);
            System.out.println("[OAUTH2] GoogleUserService tra ve user id = " + savedUser.getId()
                    + ", email = " + savedUser.getEmail());

            // 2) Load UserDetails nội bộ để có authorities đúng chuẩn (ROLE_USER / ROLE_ADMIN)
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(savedUser.getEmail());

            // 3) Sinh JWT dùng chung JwtService như login thường
            String accessToken = jwtService.generateToken(userDetails);

            // (tuỳ chọn) gom roles cho FE nếu muốn dùng
            String rolesParam = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.joining(","));

            // 4) Redirect về frontend mang theo token qua query param
            String redirectUrl = "http://localhost:5173/"
                    + "?oauth2=success"
                    + "&token=" + URLEncoder.encode(accessToken, StandardCharsets.UTF_8)
                    + "&roles=" + URLEncoder.encode(rolesParam, StandardCharsets.UTF_8);

            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
        } catch (Exception ex) {
            System.err.println("ERROR in OAuth2SuccessHandler: " + ex.getMessage());
            ex.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "OAuth2 login failed: " + ex.getMessage());
        }
    }
}
