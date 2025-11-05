package com.rkvk.automobile.automobileshop.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterUserDTO {
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private String houseNo;
    private List<String> emails;;
    private String street;
    private String locality;
    private String city;
    private String pinCode;
    private String role; // "ADMIN" or "RECEPTIONIST"
}
