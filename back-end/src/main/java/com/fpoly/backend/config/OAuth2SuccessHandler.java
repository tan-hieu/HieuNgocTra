package com.fpoly.backend.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Component;

import com.fpoly.backend.entity.User;
import com.fpoly.backend.service.GoogleUserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private GoogleUserService googleUserService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        System.err.println("=== OAUTH2 SUCCESS HANDLER CALLED ===");
        System.err.flush();
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

            System.err.println("=== [OAUTH2] email = " + email + " ===");
            System.err.flush();

            User savedUser = googleUserService.findOrCreateGoogleUser(email, name, avatar);

            System.out.println("[OAUTH2] GoogleUserService tra ve user id = " + savedUser.getId()
                    + ", email = " + savedUser.getEmail());

            // HttpSession session = request.getSession(true);
            // session.setAttribute("LOGGED_IN_USER", savedUser);
            // session.setAttribute("OAUTH2_USER", savedUser);
            // session.setAttribute("OAUTH2_EMAIL", savedUser.getEmail());
            // session.setAttribute("OAUTH2_AUTHENTICATED", true);

            HttpSession session = request.getSession(true);

            // Lưu Authentication của Spring Security vào session
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);
            session.setAttribute(
                    HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                    context
            );

            // Dùng chung key với login thường để không phá code cũ
            session.setAttribute("LOGGED_IN_USER", savedUser);

            // Giữ lại key cũ nếu chỗ khác đang dùng
            session.setAttribute("OAUTH2_USER", savedUser);
            session.setAttribute("OAUTH2_EMAIL", savedUser.getEmail());
            session.setAttribute("OAUTH2_AUTHENTICATED", true);

            // Gắn cờ để frontend biết đây là lượt quay về từ Google
            getRedirectStrategy().sendRedirect(request, response, "http://localhost:5173/?oauth2=success");
        } catch (Exception ex) {
            System.err.println("ERROR in OAuth2SuccessHandler: " + ex.getMessage());
            ex.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "OAuth2 login failed: " + ex.getMessage());
        }
    }
}
