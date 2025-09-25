package com.rkvk.automobile.automobileshop.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MechanicDTO {
    private Long mechanicId;
    private String firstName;
    private String lastName;
    private String houseNo;
    private String street;
    private String locality;
    private String city;
    private String pinCode;
}
