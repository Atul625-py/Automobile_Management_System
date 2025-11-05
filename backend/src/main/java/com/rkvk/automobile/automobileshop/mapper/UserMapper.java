package com.rkvk.automobile.automobileshop.mapper;

import com.rkvk.automobile.automobileshop.dto.UserDTO;
import com.rkvk.automobile.automobileshop.entity.User;
import com.rkvk.automobile.automobileshop.entity.UserEmail;
import com.rkvk.automobile.automobileshop.entity.id.UserEmailId;

import java.util.List;
import java.util.stream.Collectors;

public class UserMapper {

    public static UserDTO toDTO(User user) {
        if (user == null) return null;

        return UserDTO.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .houseNo(user.getHouseNo())
                .street(user.getStreet())
                .locality(user.getLocality())
                .city(user.getCity())
                .pinCode(user.getPinCode())
                .emails(user.getEmails() != null
                        ? user.getEmails().stream()
                        .map(e -> e.getId().getEmail())
                        .collect(Collectors.toList())
                        : null)
                .build();
    }

    public static User toEntity(UserDTO dto) {
        if (dto == null) return null;

        User user = new User();
        user.setUserId(dto.getUserId());
        user.setUsername(dto.getUsername());
        if (dto.getRole() != null) {
            user.setRole(User.Role.valueOf(dto.getRole()));
        }
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setHouseNo(dto.getHouseNo());
        user.setStreet(dto.getStreet());
        user.setLocality(dto.getLocality());
        user.setCity(dto.getCity());
        user.setPinCode(dto.getPinCode());

        if (dto.getEmails() != null) {
            List<UserEmail> emailEntities = dto.getEmails().stream()
                    .map(email -> UserEmail.builder()
                            .id(new UserEmailId(user.getUserId(), email))
                            .user(user)
                            .build())
                    .collect(Collectors.toList());
            user.setEmails(emailEntities);
        }

        return user;
    }
}
