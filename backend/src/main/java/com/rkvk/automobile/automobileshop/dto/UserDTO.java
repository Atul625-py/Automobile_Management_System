package com.rkvk.automobile.automobileshop.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long userId;
    private String username;
    private String password;
    private String role;
    private String firstName;
    private String lastName;
    private String houseNo;
    private String street;
    private String locality;
    private String city;
    private String pinCode;

    private List<String> emails;
}
