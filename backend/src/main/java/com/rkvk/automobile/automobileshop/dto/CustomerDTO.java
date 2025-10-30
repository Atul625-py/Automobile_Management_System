package com.rkvk.automobile.automobileshop.dto;

import lombok.Data;
import java.util.List;

@Data
public class CustomerDTO {
    private Long customerId;

    private String firstName;
    private String lastName;
    private String houseNo;
    private String street;
    private String locality;
    private String city;
    private String pinCode;

    private List<String> middleNames;
    private List<String> emails;
}