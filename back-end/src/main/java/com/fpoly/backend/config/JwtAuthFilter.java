package com.fpoly.backend.config;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fpoly.backend.service.CustomUserDetailsService;
import com.fpoly.backend.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthFilter(JwtService jwtService, CustomUserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = authHeader.substring(7);
        String username;
        try {
            username = jwtService.extractUsername(jwt);
        } catch (Exception ex) {
            filterChain.doFilter(request, response);
            return;
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                System.out.println("[JwtAuthFilter] Loading user: " + username);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                System.out.println("[JwtAuthFilter] User loaded, validating token");

                if (jwtService.isTokenValid(jwt, userDetails)) {
                    System.out.println("[JwtAuthFilter] Token valid, setting authentication");
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities());

                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("[JwtAuthFilter] Authentication set successfully");
                } else {
                    System.out.println("[JwtAuthFilter] Token invalid");
                }
            } catch (UsernameNotFoundException ex) {
                System.err.println("[JwtAuthFilter] User not found: " + username);
                // User không tồn tại - không set authentication
            } catch (Exception ex) {
                System.err.println("[JwtAuthFilter] Error loading user: " + ex.getClass().getSimpleName() + " - " + ex.getMessage());
                ex.printStackTrace();
                // Tiếp tục mà không set authentication
            }
        }

        filterChain.doFilter(request, response);
    }
}
