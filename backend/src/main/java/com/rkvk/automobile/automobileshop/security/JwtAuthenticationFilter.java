package com.rkvk.automobile.automobileshop.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // 🟢 Skip JWT check for public/static resources
        if (isPublicPath(path)) {
            chain.doFilter(request, response);
            return;
        }

        try {
            String header = request.getHeader("Authorization");
            String token = null;

            if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
                token = header.substring(7);
            }

            if (token != null && jwtUtil.validateToken(token)
                    && SecurityContextHolder.getContext().getAuthentication() == null) {

                String username = jwtUtil.getUsernameFromToken(token);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }

        } catch (Exception ex) {
            logger.error("❌ JWT Authentication failed: ", ex);
        }

        chain.doFilter(request, response);
    }

    /**
     * Utility method — defines which paths should be public (no JWT required)
     */
    private boolean isPublicPath(String path) {
        return path.startsWith("/api/auth")
                || path.startsWith("/images")
                || path.startsWith("/api/images")
                || path.startsWith("/css")
                || path.startsWith("/js")
                || path.equals("/favicon.ico");
    }
}
