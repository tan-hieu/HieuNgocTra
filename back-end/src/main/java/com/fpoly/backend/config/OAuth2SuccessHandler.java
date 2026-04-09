package com.fpoly.backend.config;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

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
    private final OAuth2AuthorizedClientService authorizedClientService;

    public OAuth2SuccessHandler(GoogleUserService googleUserService,
                                CustomUserDetailsService customUserDetailsService,
                                JwtService jwtService,
                                OAuth2AuthorizedClientService authorizedClientService) {
        this.googleUserService = googleUserService;
        this.customUserDetailsService = customUserDetailsService;
        this.jwtService = jwtService;
        this.authorizedClientService = authorizedClientService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        try {
            if (!(authentication.getPrincipal() instanceof OAuth2User oAuth2User)) {
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

            String phone = extractGooglePhone(authentication);

            User savedUser = googleUserService.findOrCreateGoogleUser(email, name, avatar, phone);

            UserDetails userDetails = customUserDetailsService.loadUserByUsername(savedUser.getEmail());
            String accessToken = jwtService.generateToken(userDetails);

            String rolesParam = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.joining(","));

            String redirectUrl = "http://localhost:5173/"
                    + "?oauth2=success"
                    + "&token=" + URLEncoder.encode(accessToken, StandardCharsets.UTF_8)
                    + "&roles=" + URLEncoder.encode(rolesParam, StandardCharsets.UTF_8);

            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
        } catch (Exception ex) {
            ex.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "OAuth2 login failed: " + ex.getMessage());
        }
    }

    private String extractGooglePhone(Authentication authentication) {
        try {
            OAuth2AuthorizedClient client =
                    authorizedClientService.loadAuthorizedClient("google", authentication.getName());
            if (client == null || client.getAccessToken() == null) return null;

            String accessToken = client.getAccessToken().getTokenValue();

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);

            HttpEntity<Void> entity = new HttpEntity<>(headers);
            RestTemplate restTemplate = new RestTemplate();

            String url = "https://people.googleapis.com/v1/people/me?personFields=phoneNumbers";
            ResponseEntity<Map> resp = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

            if (!resp.getStatusCode().is2xxSuccessful() || resp.getBody() == null) return null;

            Object phoneObj = resp.getBody().get("phoneNumbers");
            if (!(phoneObj instanceof List<?> list) || list.isEmpty()) return null;

            Object first = list.get(0);
            if (!(first instanceof Map<?, ?> phoneMap)) return null;

            Object canonical = phoneMap.get("canonicalForm");
            if (canonical != null && !canonical.toString().isBlank()) return canonical.toString();

            Object value = phoneMap.get("value");
            return value == null ? null : value.toString();
        } catch (Exception ex) {
            return null;
        }
    }
}
