package com.rkvk.automobile.automobileshop.security;

import com.rkvk.automobile.automobileshop.entity.User;
import com.rkvk.automobile.automobileshop.entity.UserEmail;
import com.rkvk.automobile.automobileshop.repository.UserEmailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserEmailRepository userEmailRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEmail ue = userEmailRepository.findByIdEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        User user = ue.getUser();
        if (user == null) throw new UsernameNotFoundException("User record not found for email: " + email);

        String role = user.getRole() != null ? user.getRole().name() : "RECEPTIONIST";

        return new org.springframework.security.core.userdetails.User(
                email,
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
        );
    }
}
