package com.rkvk.automobile.automobileshop.mapper;

import com.rkvk.automobile.automobileshop.dto.UserDTO;
import com.rkvk.automobile.automobileshop.entity.User;
import com.rkvk.automobile.automobileshop.entity.UserEmail;

import java.util.stream.Collectors;

public class UserMapper {

    public static UserDTO toDTO(User user) {
        if (user == null) {
            return null;
        }

        return UserDTO.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .password(user.getPassword())
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
                        .map(e -> e.getId().getEmail()) // from composite key
                        .collect(Collectors.toList())
                        : null)
                .build();
    }

    public static User toEntity(UserDTO dto) {
        if (dto == null) {
            return null;
        }

        User user = User.builder()
                .userId(dto.getUserId())
                .username(dto.getUsername())
                .password(dto.getPassword())
                .role(dto.getRole() != null ? User.Role.valueOf(dto.getRole()) : null)
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .houseNo(dto.getHouseNo())
                .street(dto.getStreet())
                .locality(dto.getLocality())
                .city(dto.getCity())
                .pinCode(dto.getPinCode())
                .build();

        if (dto.getEmails() != null) {
            user.setEmails(
                    dto.getEmails().stream()
                            .map(email -> UserEmail.builder()
                                    .id(new com.rkvk.automobile.automobileshop.entity.id.UserEmailId(user.getUserId(), email))
                                    .user(user)
                                    .build())
                            .collect(Collectors.toList())
            );
        }

        return user;
    }
}
